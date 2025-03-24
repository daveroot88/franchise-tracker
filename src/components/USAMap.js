import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import '../styles/USAMap.css';
import { fetchLocationData, getLocationCountsByState, groupLocationsByStatus, getPipelineData } from '../services/googleSheetsService';

// US map GeoJSON data
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// State name mapping for tooltips
const stateNames = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
  "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
  "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
  "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
  "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
  "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
  "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming",
  "DC": "District of Columbia"
};

function USAMap() {
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [franchiseData, setFranchiseData] = useState([]);
  const [franchiseLocations, setFranchiseLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch data from Google Sheets
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch location data from Google Sheets
        const locations = await fetchLocationData();
        
        if (locations && locations.length > 0) {
          // Process locations to get state counts
          const stateCounts = getLocationCountsByState(locations);
          
          // Group locations by status
          const groupedLocations = groupLocationsByStatus(locations);
          
          // Get pipeline data for tracking leads through store opening
          const pipeline = getPipelineData(locations);
          
          // Format data for the map
          const formattedStateData = Object.keys(stateCounts).map(state => ({
            state: state,
            name: stateNames[state] || state,
            count: stateCounts[state],
            status: "active"
          }));
          
          // Format location data for markers
          const formattedLocations = locations.map(loc => ({
            name: loc.name || loc.city,
            coordinates: [loc.lng, loc.lat],
            state: loc.state,
            status: loc.status?.toLowerCase() || "unknown",
            stage: loc.stage?.toLowerCase() || "",
            address: loc.address,
            city: loc.city,
            openDate: loc.openDate,
            franchiseOwner: loc.franchiseOwner
          })).filter(loc => loc.coordinates[0] && loc.coordinates[1]); // Filter out locations without coordinates
          
          console.log('Loaded franchise data:', {
            locations: locations.length,
            states: Object.keys(stateCounts).length,
            openLocations: groupedLocations.open.length,
            constructionLocations: groupedLocations.construction.length,
            comingSoonLocations: groupedLocations.comingSoon.length,
            pipelineStages: Object.keys(pipeline).map(key => `${key}: ${pipeline[key].count}`).join(', ')
          });
          
          setFranchiseData(formattedStateData);
          setFranchiseLocations(formattedLocations);
        } else {
          // If no data is returned, use fallback data
          console.warn('No data returned from Google Sheets, using fallback data');
          setError('Using sample Crave Cookies location data.');
        }
      } catch (err) {
        console.error('Error loading franchise data:', err);
        setError('Error loading franchise data. Using sample Crave Cookies locations.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Create color scale based on franchise counts
  const colorScale = scaleQuantile()
    .domain(franchiseData.length > 0 ? franchiseData.map(d => d.count) : [0, 1, 2, 3, 4, 5])
    .range([
      "#f7fbff",
      "#e3eef9",
      "#cfe1f2",
      "#b5d4e9",
      "#93c3df",
      "#6daed5",
      "#4b97c8",
      "#2f7ebc",
      "#1864aa",
      "#0a4a90",
      "#08306b"
    ]);

  // Get color for a state based on franchise count
  const getStateColor = (geo) => {
    const stateData = franchiseData.find(d => d.state === geo.id);
    if (!stateData) return "#EEE";
    
    if (stateData.status === "pending") return "#f8d7a3"; // Pending states
    return stateData.count === 0 ? "#f5f5f7" : colorScale(stateData.count);
  };

  // Handle mouse events for tooltips
  const handleMouseEnter = (geo, evt) => {
    const stateData = franchiseData.find(d => d.state === geo.id);
    if (stateData) {
      const status = stateData.status === "pending" ? "Pending" : "Active";
      setTooltipContent(`
        <strong>${stateData.name}</strong><br />
        Franchises: ${stateData.count}<br />
        Status: ${status}
      `);
      setTooltipPosition({ x: evt.clientX, y: evt.clientY });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
    setShowTooltip(false);
  };

  // Get marker color based on status and stage
  const getMarkerColor = (status, stage) => {
    // First check status
    if (status.includes('open')) {
      return "#4caf50"; // Green for open locations
    } else if (status.includes('construction') || status.includes('development')) {
      return "#ff9500"; // Orange for under construction
    } else if (status.includes('coming') || status.includes('soon')) {
      return "#9c27b0"; // Purple for coming soon
    }
    
    // Then check stage if status doesn't determine color
    if (stage) {
      if (stage.includes('lead') || stage.includes('call') || stage.includes('follow')) {
        return "#2196f3"; // Blue for leads/calls/follow-ups
      } else if (stage.includes('agreement') || stage.includes('wire') || stage.includes('sale')) {
        return "#ff5722"; // Deep orange for agreements/sales
      } else if (stage.includes('training') || stage.includes('onboarding')) {
        return "#ffeb3b"; // Yellow for training/onboarding
      } else if (stage.includes('equipment')) {
        return "#795548"; // Brown for equipment
      }
    }
    
    return "#9e9e9e"; // Grey for unknown status
  };

  return (
    <div className="usa-map">
      <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1000 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={getStateColor(geo)}
                stroke="#FFFFFF"
                strokeWidth={0.5}
                onMouseEnter={(evt) => handleMouseEnter(geo, evt)}
                onMouseLeave={handleMouseLeave}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#F53" },
                  pressed: { outline: "none" }
                }}
              />
            ))
          }
        </Geographies>
        
        {franchiseLocations.map((location, index) => (
          <Marker key={index} coordinates={location.coordinates}>
            <circle
              r={5}
              fill={getMarkerColor(location.status, location.stage)}
              stroke="#FFFFFF"
              strokeWidth={2}
              onMouseEnter={(evt) => {
                const locationName = location.name || (location.city && location.state ? `${location.city}, ${location.state}` : "Unknown Location");
                const formattedStatus = location.status.charAt(0).toUpperCase() + location.status.slice(1);
                const stageInfo = location.stage ? `<br />Stage: ${location.stage.charAt(0).toUpperCase() + location.stage.slice(1)}` : '';
                const ownerInfo = location.franchiseOwner ? `<br />Owner: ${location.franchiseOwner}` : '';
                
                setTooltipContent(`
                  <strong>${locationName}</strong><br />
                  Status: ${formattedStatus}${stageInfo}${ownerInfo}
                `);
                setTooltipPosition({ x: evt.clientX, y: evt.clientY });
                setShowTooltip(true);
              }}
              onMouseLeave={handleMouseLeave}
            />
          </Marker>
        ))}
      </ComposableMap>
      
      {showTooltip && (
        <div 
          className="tooltip" 
          style={{ 
            left: `${tooltipPosition.x + 10}px`, 
            top: `${tooltipPosition.y + 10}px`,
            display: showTooltip ? 'block' : 'none'
          }}
          dangerouslySetInnerHTML={{ __html: tooltipContent }}
        />
      )}
      
      <div className="map-legend">
        <h3>Crave Cookies Locations</h3>
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: "#4caf50" }}></span>
          <span>Open Location</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: "#ff9500" }}></span>
          <span>Under Construction</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: "#9c27b0" }}></span>
          <span>Coming Soon</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: "#2196f3" }}></span>
          <span>Lead/Call/Follow-up</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: "#ff5722" }}></span>
          <span>Agreement/Sale</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: "#ffeb3b" }}></span>
          <span>Training/Onboarding</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: "#f8d7a3" }}></span>
          <span>Pending State</span>
        </div>
      </div>
    </div>
  );
}

export default USAMap;

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import '../styles/USAMap.css';

// US map GeoJSON data
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Sample franchise data by state
const franchiseData = [
  { state: "CA", name: "California", count: 12, status: "active" },
  { state: "TX", name: "Texas", count: 8, status: "active" },
  { state: "FL", name: "Florida", count: 6, status: "active" },
  { state: "NY", name: "New York", count: 5, status: "active" },
  { state: "IL", name: "Illinois", count: 4, status: "active" },
  { state: "AZ", name: "Arizona", count: 3, status: "active" },
  { state: "CO", name: "Colorado", count: 3, status: "active" },
  { state: "WA", name: "Washington", count: 2, status: "active" },
  { state: "GA", name: "Georgia", count: 2, status: "active" },
  { state: "NC", name: "North Carolina", count: 2, status: "active" },
  { state: "NV", name: "Nevada", count: 1, status: "active" },
  { state: "UT", name: "Utah", count: 1, status: "active" },
  { state: "OR", name: "Oregon", count: 1, status: "active" },
  { state: "MA", name: "Massachusetts", count: 1, status: "active" },
  { state: "OH", name: "Ohio", count: 0, status: "pending" },
  { state: "PA", name: "Pennsylvania", count: 0, status: "pending" },
  { state: "MI", name: "Michigan", count: 0, status: "pending" },
  { state: "VA", name: "Virginia", count: 0, status: "pending" },
];

// Sample franchise locations (city coordinates)
const franchiseLocations = [
  { name: "Los Angeles", coordinates: [-118.2437, 34.0522], state: "CA", status: "open" },
  { name: "San Francisco", coordinates: [-122.4194, 37.7749], state: "CA", status: "open" },
  { name: "San Diego", coordinates: [-117.1611, 32.7157], state: "CA", status: "open" },
  { name: "Sacramento", coordinates: [-121.4944, 38.5816], state: "CA", status: "construction" },
  { name: "Dallas", coordinates: [-96.7970, 32.7767], state: "TX", status: "open" },
  { name: "Houston", coordinates: [-95.3698, 29.7604], state: "TX", status: "open" },
  { name: "Austin", coordinates: [-97.7431, 30.2672], state: "TX", status: "construction" },
  { name: "Miami", coordinates: [-80.1918, 25.7617], state: "FL", status: "open" },
  { name: "Orlando", coordinates: [-81.3792, 28.5383], state: "FL", status: "open" },
  { name: "New York City", coordinates: [-74.0060, 40.7128], state: "NY", status: "open" },
  { name: "Chicago", coordinates: [-87.6298, 41.8781], state: "IL", status: "open" },
  { name: "Phoenix", coordinates: [-112.0740, 33.4484], state: "AZ", status: "open" },
  { name: "Denver", coordinates: [-104.9903, 39.7392], state: "CO", status: "construction" },
  { name: "Seattle", coordinates: [-122.3321, 47.6062], state: "WA", status: "open" },
  { name: "Atlanta", coordinates: [-84.3880, 33.7490], state: "GA", status: "open" },
  { name: "Las Vegas", coordinates: [-115.1398, 36.1699], state: "NV", status: "open" },
  { name: "Salt Lake City", coordinates: [-111.8910, 40.7608], state: "UT", status: "construction" },
  { name: "Portland", coordinates: [-122.6765, 45.5231], state: "OR", status: "open" },
  { name: "Boston", coordinates: [-71.0589, 42.3601], state: "MA", status: "open" },
];

function USAMap() {
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Create color scale based on franchise counts
  const colorScale = scaleQuantile()
    .domain(franchiseData.map(d => d.count))
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

  // Get marker color based on status
  const getMarkerColor = (status) => {
    switch (status) {
      case "open": return "#4caf50"; // Green for open
      case "construction": return "#ff9500"; // Orange for under construction
      default: return "#c83a2c"; // Red for other statuses
    }
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
              fill={getMarkerColor(location.status)}
              stroke="#FFFFFF"
              strokeWidth={2}
              onMouseEnter={(evt) => {
                setTooltipContent(`
                  <strong>${location.name}</strong><br />
                  Status: ${location.status.charAt(0).toUpperCase() + location.status.slice(1)}
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
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: "#4caf50" }}></span>
          <span>Open Location</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ backgroundColor: "#ff9500" }}></span>
          <span>Under Construction</span>
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

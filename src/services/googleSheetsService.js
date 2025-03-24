import { GoogleSpreadsheet } from 'google-spreadsheet';

// Google Sheets configuration
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SHEETS_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// For service account authentication (if using)
const SERVICE_ACCOUNT_EMAIL = process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_PRIVATE_KEY;

// Sample data to use as fallback if Google Sheets API fails
const sampleLocationData = [
  { name: "Provo", city: "Provo", state: "UT", status: "Open", lat: 40.2338, lng: -111.6585 },
  { name: "Orem", city: "Orem", state: "UT", status: "Open", lat: 40.2969, lng: -111.6946 },
  { name: "Lehi", city: "Lehi", state: "UT", status: "Open", lat: 40.3916, lng: -111.8508 },
  { name: "Salt Lake City", city: "Salt Lake City", state: "UT", status: "Open", lat: 40.7608, lng: -111.8910 },
  { name: "Boise", city: "Boise", state: "ID", status: "Under Construction", lat: 43.6150, lng: -116.2023 },
  { name: "Denver", city: "Denver", state: "CO", status: "Coming Soon", lat: 39.7392, lng: -104.9903 },
  { name: "Phoenix", city: "Phoenix", state: "AZ", status: "Coming Soon", lat: 33.4484, lng: -112.0740 }
];

/**
 * Fetches location data from the Crave Locations Mastersheet
 * @returns {Promise<Array>} Array of location objects with properties like name, state, status, lat, lng
 */
export const fetchLocationData = async () => {
  try {
    // Initialize the sheet
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    
    // Try service account auth first, then fall back to API key
    if (SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY && PRIVATE_KEY !== 'your_private_key_here') {
      try {
        await doc.useServiceAccountAuth({
          client_email: SERVICE_ACCOUNT_EMAIL,
          private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
        console.log('Authenticated with service account');
      } catch (authError) {
        console.warn('Service account auth failed, trying API key:', authError);
        // Fall back to API key if service account fails
        if (!API_KEY || API_KEY === 'your_api_key_here') {
          console.warn('No API key provided. Using sample data.');
          return sampleLocationData;
        }
        await doc.useApiKey(API_KEY);
      }
    } else {
      // No service account, try API key
      if (!API_KEY || API_KEY === 'your_api_key_here') {
        console.warn('No API key provided. Using sample data.');
        return sampleLocationData;
      }
      await doc.useApiKey(API_KEY);
    }
    
    // Load the document properties and sheets
    await doc.loadInfo();
    
    // Assuming your location data is in the first sheet
    const sheet = doc.sheetsByIndex[0];
    
    // Load all rows
    const rows = await sheet.getRows();
    
    if (!rows || rows.length === 0) {
      console.warn('No data found in Google Sheet. Using sample data.');
      return sampleLocationData;
    }
    
    // Process the rows into a format suitable for the map
    // Adjust the field names based on your actual column headers in Google Sheets
    return rows.map(row => ({
      name: row.Store || row.LocationName || row.Name,
      address: row.Address,
      city: row.City,
      state: row.State,
      zipCode: row.ZipCode || row['Zip Code'],
      status: row.Status || 'Unknown', // e.g., "Open", "Under Construction", "Coming Soon"
      stage: row.Stage || row.DevelopmentStage || row['Development Stage'],
      openDate: row.OpenDate || row['Open Date'] || row['Grand Opening'],
      lat: parseFloat(row.Latitude || row.Lat || 0),
      lng: parseFloat(row.Longitude || row.Lng || 0),
      franchiseOwner: row.Owner || row.FranchiseOwner || row['Franchise Owner'],
      notes: row.Notes
    }));
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return sampleLocationData;
  }
};

/**
 * Processes location data to get counts by state
 * @param {Array} locations Array of location objects
 * @returns {Object} Object with state codes as keys and counts as values
 */
export const getLocationCountsByState = (locations) => {
  const stateCounts = {};
  
  locations.forEach(location => {
    if (location.state) {
      const stateCode = location.state;
      stateCounts[stateCode] = (stateCounts[stateCode] || 0) + 1;
    }
  });
  
  return stateCounts;
};

/**
 * Groups locations by status
 * @param {Array} locations Array of location objects
 * @returns {Object} Object with status types as keys and arrays of locations as values
 */
export const groupLocationsByStatus = (locations) => {
  const grouped = {
    open: [],
    construction: [],
    comingSoon: [],
    lead: [],
    agreement: [],
    training: [],
    other: []
  };
  
  locations.forEach(location => {
    const status = location.status ? location.status.toLowerCase() : '';
    const stage = location.stage ? location.stage.toLowerCase() : '';
    
    if (status.includes('open')) {
      grouped.open.push(location);
    } else if (status.includes('construction') || status.includes('development')) {
      grouped.construction.push(location);
    } else if (status.includes('coming') || status.includes('soon')) {
      grouped.comingSoon.push(location);
    } else if (stage.includes('lead') || stage.includes('call') || stage.includes('follow')) {
      grouped.lead.push(location);
    } else if (stage.includes('agreement') || stage.includes('wire') || stage.includes('sale')) {
      grouped.agreement.push(location);
    } else if (stage.includes('training') || stage.includes('onboarding')) {
      grouped.training.push(location);
    } else {
      grouped.other.push(location);
    }
  });
  
  return grouped;
};

/**
 * Gets the full pipeline data for tracking leads through store opening
 * @param {Array} locations Array of location objects
 * @returns {Object} Object with pipeline stages and counts
 */
export const getPipelineData = (locations) => {
  const pipeline = {
    lead: { count: 0, locations: [] },
    call: { count: 0, locations: [] },
    followUp: { count: 0, locations: [] },
    sale: { count: 0, locations: [] },
    agreement: { count: 0, locations: [] },
    wireTransfer: { count: 0, locations: [] },
    onboarding: { count: 0, locations: [] },
    training: { count: 0, locations: [] },
    construction: { count: 0, locations: [] },
    equipment: { count: 0, locations: [] },
    open: { count: 0, locations: [] }
  };
  
  locations.forEach(location => {
    const stage = location.stage ? location.stage.toLowerCase() : '';
    const status = location.status ? location.status.toLowerCase() : '';
    
    if (stage.includes('lead')) {
      pipeline.lead.count++;
      pipeline.lead.locations.push(location);
    } else if (stage.includes('call')) {
      pipeline.call.count++;
      pipeline.call.locations.push(location);
    } else if (stage.includes('follow')) {
      pipeline.followUp.count++;
      pipeline.followUp.locations.push(location);
    } else if (stage.includes('sale')) {
      pipeline.sale.count++;
      pipeline.sale.locations.push(location);
    } else if (stage.includes('agreement')) {
      pipeline.agreement.count++;
      pipeline.agreement.locations.push(location);
    } else if (stage.includes('wire')) {
      pipeline.wireTransfer.count++;
      pipeline.wireTransfer.locations.push(location);
    } else if (stage.includes('onboarding')) {
      pipeline.onboarding.count++;
      pipeline.onboarding.locations.push(location);
    } else if (stage.includes('training')) {
      pipeline.training.count++;
      pipeline.training.locations.push(location);
    } else if (stage.includes('construction') || status.includes('construction')) {
      pipeline.construction.count++;
      pipeline.construction.locations.push(location);
    } else if (stage.includes('equipment')) {
      pipeline.equipment.count++;
      pipeline.equipment.locations.push(location);
    } else if (status.includes('open')) {
      pipeline.open.count++;
      pipeline.open.locations.push(location);
    }
  });
  
  return pipeline;
};

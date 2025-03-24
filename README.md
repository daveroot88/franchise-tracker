# Franchise Tracker

A web application for tracking Crave Cookies franchise locations across the United States. The application visualizes franchise data on an interactive map, showing locations that are open, under construction, or coming soon.

## Google Sheets Integration

This application can now fetch real-time data from your Crave Locations Mastersheet in Google Sheets. To set up the integration:

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the Google Sheets API for your project

2. **Create API Credentials**:
   - In your Google Cloud project, go to "APIs & Services" > "Credentials"
   - Create an API Key
   - Restrict the API key to only the Google Sheets API

3. **Set Up Your Environment Variables**:
   - Open the `.env` file in the root of the project
   - Replace `your_sheet_id_here` with your Google Sheet ID (the long string in the URL of your Google Sheet)
   - Replace `your_api_key_here` with the API key you created

4. **Make Your Google Sheet Public**:
   - Open your Google Sheet
   - Click "Share" in the top right
   - Change the permissions to "Anyone with the link can view"

5. **Format Your Google Sheet**:
   The application expects your sheet to have the following columns:
   - LocationName: Name of the franchise location
   - Address: Street address
   - City: City name
   - State: Two-letter state code (e.g., TX, CA)
   - ZipCode: Postal code
   - Status: Status of the location (e.g., "Open", "Under Construction", "Coming Soon")
   - Latitude: Decimal latitude coordinates
   - Longitude: Decimal longitude coordinates
   - FranchiseOwner: Name of the franchise owner (optional)
   - OpenDate: Date the location opened or will open (optional)
   - Notes: Additional information (optional)

## Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

4. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

## Technologies Used

- React
- react-simple-maps for the interactive US map
- d3-scale for color scaling
- Google Sheets API for data integration
- webpack for bundling
- GitHub Pages for deployment

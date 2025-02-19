const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 850,
    height: 1250,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('autheninput.html');

  // Uncomment to open DevTools if needed
  // mainWindow.webContents.openDevTools();
});

ipcMain.on('print-document', (event) => {
  const options = {
    silent: true, // Enable silent printing
    printBackground: true, // Include background graphics
    deviceName: '', // Specify printer name (leave empty for default)
  };

  mainWindow.webContents.print(options, (success, errorType) => {
    if (!success) {
      console.error(`Failed to print: ${errorType}`);
    }
  });
});

ipcMain.handle('open-visit', async (event, hn) => {
  if (!hn) {
    throw new Error('HN is required to open a visit.');
  }

 // Prepare the request body
 const requestBody = {
  hn,
  staff: '1234', // Example: Required field
  curDep: 'OPD', // Example: Required field
  doctor: '5678', // Example: Required field
  nodeId: "ABCD123", // Nullable field
  pttype: 'Insurance', // Example: Required field
  rfrocs: "Procedure", // Nullable field
  spclty: 'General', // Example: Required field
  hospsub: "SubUnit", // Nullable field
  lastDep: 'ER', // Example: Required field
  mainDep: 'OPD', // Example: Required field
  ovstist: "Active", // Nullable field
  ovstost: 'Started', // Example: Required field
  hospmain: "MainHospital", // Nullable field
  pttypeno: '001', // Example: Required field
  hasInsurance: 'true', // Example: Required field
  ovstDto: { // Required nested object
    visitDate: '2024-12-23',
    visitType: "Regular", // Nullable field in nested object
    otherDetails: 'Any other required data',
  },
};

  try {
    const response = await axios.post('http://172.16.200.202:8089/api/Hos/OpenVisitWithKey', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

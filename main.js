const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');

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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  printDocument: () => ipcRenderer.send('print-document'),

  // New function to fetch data from API
  fetchWardData: async () => {
    try {
      // Make a GET request to the API
      const response = await fetch('http://localhost:5094/api/Ipd/getward');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json(); // Parse JSON response
    } catch (error) {
      console.error('Error fetching ward data:', error);
      throw error; // Re-throw error to handle it in the renderer process
    }
  },
});

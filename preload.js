const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  printDocument: () => ipcRenderer.send('print-document'),
  openVisit: async (hn) => {
    return ipcRenderer.invoke('open-visit', hn);
  },

  // New function to fetch data from API
  fetchWardData: async () => {
    try {
      // Make a GET request to the API
      const response = await fetch('http://172.16.200.202:8089/api/Ipd/getward');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json(); // Parse JSON response
    } catch (error) {
      console.error('Error fetching ward data:', error);
      throw error; // Re-throw error to handle it in the renderer process
    }
  },

  fetchAuthenData: async () => {
    try {
      // Make a GET request to the API
      const response = await fetch('http://localhost:8189/api/smartcard/read?readImageFlag=false');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json(); // Parse JSON response
    } catch (error) {
      console.error('Error fetching ward data:', error);
      throw error; // Re-throw error to handle it in the renderer process
    }
  },
  fetchCData: async () => {
    try {
      // Make a GET request to the API
      const response = await fetch('http://localhost:8189/api/smartcard/read?readImageFlag=false');
      const claimCode = await fetch(`http://localhost:8189/api/nhso-service/latest-authen-code/${response.pid}`).then(res => res.json());
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await claimCode.json(); // Parse JSON response
    } catch (error) {
      console.error('Error fetching ward data:', error);
      throw error; // Re-throw error to handle it in the renderer process
    }
  },

   fetchPatientData: async () => {
    try {
      const Cid2 = await fetch('http://localhost:8189/api/smartcard/read?readImageFlag=false').then(res => res.json());
      const patients = await fetch(`http://172.16.200.202:8089/api/Hos/getpatienthnimage?_cid=${Cid2.pid}`).then(res => res.json());
      return { Cid2, patients };
    } catch (error) {
      console.error('Error fetching patient data:', error);
      return { Cid2: null, patients: null };
    }
  },

   
});

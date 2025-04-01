// Preload script runs in an isolated context
const { contextBridge, ipcRenderer } = require('electron');

// Expose limited functionality to the renderer process
contextBridge.exposeInMainWorld('api', {
  // You can add methods here to allow the web application 
  // to communicate with the main process if needed
  // For example:
  // sendMessage: (channel, data) => {
  //   ipcRenderer.send(channel, data);
  // },
  // receiveMessage: (channel, func) => {
  //   ipcRenderer.on(channel, (event, ...args) => func(...args));
  // }
}); 
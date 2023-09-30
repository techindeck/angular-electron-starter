// preload.js

const { contextBridge, ipcRenderer } = require("electron");

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//     const replaceText = (selector, text) => {
//       const element = document.getElementById(selector)
//       if (element) element.innerText = text
//     }

//     for (const dependency of ['chrome', 'node', 'electron']) {
//       replaceText(`${dependency}-version`, process.versions[dependency])
//     }
//   })

// Expose a subset of Electron APIs to the renderer process
contextBridge.exposeInMainWorld("app", {
  quit: (url) => {
    ipcRenderer.send("quit-app", url);
  },
});

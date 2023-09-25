// main.js

// Modules to control application life and create native browser window
const { app, screen, BrowserWindow } = require("electron");
const electronServe = require("electron-serve");
const unhandled = require("electron-unhandled");
const electronIsDev = require("electron-is-dev");
const path = require("path");

unhandled();

const loadURL = electronServe({
  directory: path.join(__dirname, "./../web"),
});

let splashWindow = null;

// Create a function to create the splash window
const createSplashWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  splashWindow = new BrowserWindow({
    width: width, // Set your desired splash screen dimensions
    height: height,
    frame: false, // Remove window frame
    transparent: true, // Make the window transparent
    center: true, // Center the window
    webPreferences: {
      nodeIntegration: true,
    },
  });

  splashWindow.setResizable(false);

  // set the splash.html file as the window content
  // Load the splash.html file
  splashWindow.loadFile("splash.html");

  // devtools
  if (electronIsDev) splashWindow.webContents.openDevTools();

  // Display the splash window
  splashWindow.show();
};

let mainWindow = null;
const createWindow = () => {
  // Create the browser window.
  // get the screen size
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    show: false,
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      webSecurity: true,
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  // Open the DevTools.
  if (electronIsDev) mainWindow.webContents.openDevTools();

  mainWindow.setMenuBarVisibility(false);

  mainWindow.webContents.on("will-navigate", (event, _newURL) => {
    if (!this.MainWindow.webContents.getURL().includes(this.customScheme)) {
      event.preventDefault();
    }
  });

  loadURL(mainWindow);

  // Once the main window is ready, close the splash window
  mainWindow.once("ready-to-show", () => {
    setTimeout(() => {
      splashWindow.close();
      splashWindow.destroy();
      // Show the main window when it's ready
      mainWindow.show();
    }, 3000);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Create the splash window
  createSplashWindow();

  // Create the main window when Electron is ready
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  splashWindow.on("closed", () => {
    splashWindow = null;
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  mainWindow.removeAllListeners("close");
  mainWindow.close();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

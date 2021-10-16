const { app, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let mainWindow = null

app.whenReady().then(() => {
    // We cannot require the screen module until the app is ready.
    const { screen, Tray, session, Notification } = require('electron')

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ['default-src \'self\'']
            }
        })
    })

    // Create a window that fills the screen's available work area.
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize
    const branding = path.join(__dirname, 'epsiloncommunity.png')

    const appIcon = new Tray(branding)
    mainWindow = new BrowserWindow({ width, height, icon: branding })
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    const NOTIFICATION_TITLE = 'Welcome!'
    const NOTIFICATION_BODY = 'Thank you for using our Desktop Application'

    const notif = new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()


})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
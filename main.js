const { app, Tray, BrowserWindow, nativeImage, Menu } = require('electron')
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

let base_url = process.env.HA_HOST;
let token = process.env.HS_TOKEN;


const createConfigWindow = () => {
    
    const configWindow = new BrowserWindow({
        width: 800,
        height: 600
    })
    configWindow.loadFile('index.html')

    configWindow.on('closed', () => {
        configWindow = null;
    });
}

const LightsToggle = () => {
    console.log('Lights on')
    axios.post(base_url + "/api/services/light/toggle", {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        entity_id: "light.office_light_1"
    }).then((response) => {
        console.log(response.data)
    }).catch((error) => {
        console.log(error)
    })
}

const createTray = () => {
    const icon = nativeImage.createFromPath('icons8-building-24.png')
    const tray = new Tray(icon)

    // tray.setTitle('Tray Title');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Office light 1',
            click: () => LightsToggle()
        },
        {
            label: 'Office light 2',
            click: () => console.log('Item 1 clicked')
        },
        {
            label: 'Open window',
            click: () => createConfigWindow()
        },
        { 
            label: 'Exit', 
            type: 'normal', 
            click: () => app.exit()
        },
    ])
    
    tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
//   createWindow()
    createTray();
    if (app.dock) {
        app.dock.hide();
    }
})

// Prevent the app from quitting when all windows are closed,
// Keeps it running as tray app after closing config window
app.on('window-all-closed', (event) => {
    // Do nothing, so the app stays alive with the tray icon
});
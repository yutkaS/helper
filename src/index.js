import { addScene, animationStackShift } from './animation/untils/';
import { handleTgMessages } from './functional/telegram';
import { sendJoke } from './functional/jokes';
import * as path from 'path';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { format as formatUrl } from 'url';
import { handlePatterns } from './animation';
import dialog from 'eslint-plugin-jsx-a11y/lib/util/implicitRoles/dialog';

const { app, BrowserWindow, ipcMain, } = require('electron');
let screen;
let displaySize;
let helperPosition = {x:0, y:0,};

const isDevelopment = false;

const helperSize = {
  width: 300,
  height: 224,
};

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

const handleMove = (x = helperPosition.x, y = helperPosition.y) => {
  console.log('start', x, y, helperPosition);
  helperPosition = {x, y};

  mainWindow.setPosition(
    helperPosition.x,
    helperPosition.y,
  );
};

// использую отдельную функцию из-за того что не могу получить screen до того как electron будет готов
const moveToLeftBottom = () => {
  console.log(displaySize.width, hedisplaySize.width - helperSize[0]);
  handleMove(
    displaySize.width - helperSize[0],
    displaySize.height - helperSize[1],
  )
};
const eventsListener = (wtf, event, ...args) => {
  switch (event) {

    case 'click':
      // sendJoke();
      break;
// bullshit
    case 'mouseUp' : {
      mainWindow.setSize(helperSize[0], helperSize[1]);
      break;
    }

    case 'move' :
      // переделать, получить расположение окна из свойств mainWindow
      const [distance, distanceByStart] = args;

      if (!distance) {
        const pixelsByMove = 1;
        const framesCount = distanceByStart / pixelsByMove;

        for (let i = 0; i < framesCount; i++) {
          setTimeout(() => {
            console.log(helperPosition.x, pixelsByMove);

            handleMove(helperPosition.x - pixelsByMove);
          }, i * 10);
        }
      }
      handleMove(helperPosition.x + distance);
      break;

    case 'addBoard':
      mainWindow.setResizable(true);
      helperSize[1] += 55;
      mainWindow.setSize(helperSize[0], helperSize[1]);
      moveToLeftBottom();
      mainWindow.setResizable(false);
      break;

    case 'removeBoard' :
      mainWindow.setResizable(true);
      helperSize[1] -= 55;
      mainWindow.setSize(helperSize[0], helperSize[1]);
      moveToLeftBottom();
      mainWindow.setResizable(false);
      break;
  }
};

const handleAnimation = async () => {
  const sceneName = animationStackShift();
  mainWindow.webContents.send('animate', sceneName);

  const scenePath = path.join(__dirname, `/front/videos/${sceneName}.gif`);

  // костыль, getVideoDurationInSeconds очень долго выполняется,
  // приходиться корректировать длительность сцены с расчетом на то сколько времени выполняется функция расчета времени сцены
  const dateBeforeGetVideoDuration = Date.now();
  const sceneDuration = await getVideoDurationInSeconds(scenePath) * 1000;
  const dateAfterGetVideoDuration = Date.now();

  setTimeout(() => handleAnimation(), sceneDuration - (dateAfterGetVideoDuration - dateBeforeGetVideoDuration));
};

setInterval(() => addScene('wait'), 10000);

function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    width: helperSize[0],
    height: helperSize[1],
    frame: false,
    transparent: true,
    focusable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: isDevelopment,
  });

  isDevelopment && window.webContents.openDevTools();

  window.loadURL(formatUrl({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true,
  }));

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });
  ipcMain.on('synchronous-message', eventsListener);
  return window;
}


app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  screen = require('electron').screen;
  mainWindow = createMainWindow();
  displaySize = screen.getPrimaryDisplay().workAreaSize;
  helperPosition = {
    x: displaySize.width - helperSize[0],
    y: displaySize.height - helperSize[1]
  };
  console.log(displaySize.width, helperPosition);
  moveToLeftBottom();
  console.log('после');
  handleAnimation();
  // setInterval(handleTgMessages, 2000);
  // setInterval(handlePatterns, 20000);
});

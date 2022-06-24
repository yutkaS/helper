// const homeMaid = document.querySelector('.homeMaid');

const { ipcRenderer } = require('electron');

const boardContent = document.querySelector('.board__content');
const boardFrom = document.querySelector('.board__from');
const boardIco = document.querySelector('.board__ico');

const board = document.querySelector('.board');

const hideBoard = () => board.style.visibility = 'hidden';
const showBoard = () => board.style.visibility = 'visible';

const clearBoard = () => {
  boardContent.innerHTML = '';
  boardFrom.innerHTML = '';
  boardIco.innerHTML = '';
  ipcRenderer.send('asynchronous-message', 'removeBoard');
  hideBoard();
};

const updateBoard = (text, from, ico = null) => {
  if (!text) return;
  if (text.length > 30) {
    boardContent.innerHTML = 'Сообщение слишком длинное ;d';
  } else {
    boardContent.innerHTML = text;
  }
  boardFrom.innerHTML = `${from}:`;
  boardIco.innerHTML = ico;
  setTimeout(clearBoard, 3000);
};

const tgIcon = `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="13px" height="13px"><path fill="#29b6f6" d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"/><path fill="#fff" d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z"/><path fill="#b0bec5" d="M23,30.505l-3.426,3.374c0,0-0.149,0.115-0.348,0.12c-0.069,0.002-0.143-0.009-0.219-0.043 l0.964-5.965L23,30.505z"/><path fill="#cfd8dc" d="M29.897,18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16,26c0,0,2.106,5.892,2.427,6.912 c0.322,1.021,0.58,1.045,0.58,1.045l0.964-5.965l9.832-9.096C30.023,18.729,30.064,18.416,29.897,18.196z"/></svg>`;


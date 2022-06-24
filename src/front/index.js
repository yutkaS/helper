const { ipcRenderer } = require('electron');

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  let context, args, result;
  let timeout = null;
  let previous = 0;
  if (!options) options = {};
  let later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    let now = Date.now();
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}



const homeMaid = document.querySelector('.homeMaid');

const handleClick = (event) => {
  console.log('click');
};

let mouseMoveXStartPosition;
let mouseMoveXEndPosition;
let lastMoveX;

const _handleMouseMove = (event) => {
  if (lastMoveX > event.x) return
  const distance = event.x - mouseMoveXStartPosition;
  ipcRenderer.send('synchronous-message', 'move', distance);

  lastMoveX = event.x
};

const handleMouseMove = throttle(_handleMouseMove, 10)

const handleSwipeRight = (event) => {
  ipcRenderer.send('synchronous-message', 'move', 350)
  setTimeout( () => {
    ipcRenderer.send('synchronous-message', 'move', 0)
  }, 10000)

};

const handleMouseDown = (event) => {
  homeMaid.addEventListener('mousemove', handleMouseMove);
  mouseMoveXStartPosition = event.x;
};

const handleMouseUp = (event) => {
  ipcRenderer.send('synchronous-message', 'mouseUp')
  homeMaid.removeEventListener('mousemove', handleMouseMove);
  lastMoveX = 0
  mouseMoveXEndPosition = event.x;

  if (mouseMoveXEndPosition - mouseMoveXStartPosition > 70) handleSwipeRight();
  else ipcRenderer.send('synchronous-message', 'move', 0, mouseMoveXEndPosition - mouseMoveXStartPosition);
};

const handleClicks = () => {
  homeMaid.addEventListener('click', handleClick);
  homeMaid.addEventListener('mousedown', handleMouseDown);
  homeMaid.addEventListener('mouseup', handleMouseUp);
  homeMaid.addEventListener('mouseleave', handleMouseUp)
};

handleClicks();


const handleAnimate = (event, animationName) => {
  homeMaid.src = `./front/videos/${animationName}.png`;
};

ipcRenderer.on('animate', handleAnimate);

document.addEventListener(
  'click',
  () => ipcRenderer.send('synchronous-message', 'click')
);

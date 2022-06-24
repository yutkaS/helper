const animationStack = [];
const defaultAnimationName = 'headSpin';
let timeWithOutAnimations = 0;

const getAnimationStack = () => animationStack;
const getTimeWithOutAnimations = () => timeWithOutAnimations;
const setTimeWithOutAnimations = (newTime) => timeWithOutAnimations = newTime;

const getRandomWaitScene = () => {
  const waitSceneNames = ['wait1', 'wait2', 'wait3'];
  return waitSceneNames[Math.floor(Math.random() * waitSceneNames.length)]
}

let lastScene = 'wait';

const animationStackShift = () => {
  // const newScene = lastScene === defaultAnimationName ? lastScene : defaultAnimationName;
  return animationStack.shift() || defaultAnimationName;
}
const addSleepyScene = () => animationStack.push('sleepy');
const addBoringScene = () => animationStack.push('boring');

const addScene = (sceneName) => {
  animationStack.push(sceneName);
}

export {getAnimationStack, addScene, animationStackShift, getTimeWithOutAnimations, getRandomWaitScene, setTimeWithOutAnimations};

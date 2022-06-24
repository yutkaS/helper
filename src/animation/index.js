import {getTimeWithOutAnimations, setTimeWithOutAnimations, addScene} from './untils';

const intervalReloadTime = 10000;

const getNumFromInterval = (min, max) => Math.floor(Math.random() * max) + min;

const handlePatterns = () => {
  // const timeWithOutAnimation = getTimeWithOutAnimations();
  // console.log(timeWithOutAnimation);
  // if (timeWithOutAnimation > 1000 * 60 * getNumFromInterval(3, 15)) {
    addScene('wait');
    // setTimeWithOutAnimations(0);
  // }
  // else setTimeWithOutAnimations(timeWithOutAnimation + intervalReloadTime);
}

export { handlePatterns }

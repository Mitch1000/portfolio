class SliderHandler {
  constructor(sliderEl) {
    this.slider = sliderEl;
    this.setInitial();
  }

  resetPositionData() {
    this.sliderClickedPos = 0;
    this.isSliderClicked = false;
    this.currentPosition = 0;
    this.newTop = 0;
    this.slideValue = 0;
  }

  setInitial() {
    if (!(this.slider instanceof HTMLElement)) {
      return;
    }
    this.sliderExtension = 2;

    this.initialPosition = this.slider.getBoundingClientRect().top;

    this.resetPositionData();
  }

  reset() {
    this.resetPositionData();
    this.slider.style.transform = 'translateX(0px) translateY(0px)';
  }
}

export default function handleSlider(updateCallBack, sliderEl, horizontal = false) {
  const sh = new SliderHandler(sliderEl);
  
  if (!(sh.slider instanceof HTMLElement)) {
    return;
  }

  const handleMove = (targetPos) => {
    const newPosition = sh.currentPosition + (targetPos - sh.sliderClickedPos);
    sh.slideValue = (sh.sliderClickedPos - targetPos);

    if (horizontal) {
      sh.newTop = newPosition;
      const translate = 'translateX';
      sh.slider.style.transform = `${translate}(${sh.newTop}px)`;
    } else {
      const { top, bottom } = sh.slider.nextElementSibling.getBoundingClientRect();

      const topDiffrence = Math.abs(sh.initialPosition - top);
      const bottomDiffrence = Math.abs(bottom - sh.initialPosition);

      const handleHeight = sh.slider.getBoundingClientRect().height;

      const halfHandleHeight = handleHeight / 2;

      const maximumSliderPosition = (topDiffrence + sh.sliderExtension + halfHandleHeight) * -1;

      const minimumSliderPosition = (bottomDiffrence + sh.sliderExtension - halfHandleHeight);

      if (newPosition < minimumSliderPosition && newPosition > maximumSliderPosition) {
        sh.newTop = newPosition;
        const translate = 'translateY';
        sh.slider.style.transform = `${translate}(${sh.newTop}px)`;
      }
    }
  };

  const handleMouseMove = (moveEvent) => {
    moveEvent.preventDefault();
    if (!sh.isSliderClicked) { return; }

    const mousePos = horizontal ? moveEvent.clientX : moveEvent.clientY;
    handleMove(mousePos);
  };

  const handleTouchMove = (moveEvent) => {
    moveEvent.preventDefault();
    if (!sh.isSliderClicked) { return; }
    const touch = moveEvent.targetTouches[0];

    const fingerPos = horizontal ? touch.clientX : touch.clientY;

    handleMove(fingerPos);
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    sh.isSliderClicked = false;
    sh.currentPosition = sh.newTop;

    updateCallBack(sh.newTop * -1, sh.initialPosition, sliderEl);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchend', handleMouseUp);
  };

  const sliderTouchHandler = (event) => {
    event.preventDefault();
    const touch = event.targetTouches[0];
    const { clientY, clientX } = touch;

    sh.sliderClickedPos = horizontal ? clientX : clientY;
    sh.isSliderClicked = true;
    document.addEventListener('touchend', handleMouseUp);
  };

  const sliderMouseHandler = (event) => {
    event.preventDefault();
    const { clientY, clientX } = event;

    sh.sliderClickedPos = horizontal ? clientX : clientY;
    sh.isSliderClicked = true;
    document.addEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('touchmove', handleTouchMove);

  sh.slider.addEventListener('mousedown', sliderMouseHandler);
  sh.slider.addEventListener('touchstart', sliderTouchHandler);
  return sh;
}

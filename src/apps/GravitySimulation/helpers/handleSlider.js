class SliderHandler {
  constructor(sliderEl) {
    this.slider = sliderEl;
    this.setInitial();
  }

  setInitial() {
    this.sliderExtension = 10;

    this.initialPosition = this.slider.getBoundingClientRect().top;

    this.sliderClickedPos = 0;
    this.isSliderClicked = false;
    this.currentPosition = 0;
    this.newTop = 0;
    this.slideValue = 0;
  }

  reset() {
    this.setInitial();
    this.slider.style.transform = 'translateX(0px) translateY(0px)';
  }
}

export default function handleSlider(updateCallBack, sliderEl, horizontal = false) {
  const sh = new SliderHandler(sliderEl);
  const handleMouseMove = (moveEvent) => {
    if (!sh.isSliderClicked) { return; }
    const mousePos = horizontal ? moveEvent.clientX : moveEvent.clientY;
    const newPosition = sh.currentPosition + (mousePos - sh.sliderClickedPos);
    sh.slideValue = (sh.sliderClickedPos - mousePos);

    if (horizontal) {
      sh.newTop = newPosition;
      const translate = 'translateX';
      sh.slider.style.transform = `${translate}(${sh.newTop}px)`;
    } else {
      const { top, height } = sh.slider.nextElementSibling.getBoundingClientRect();

      const maximumSliderPosition = (top + sh.sliderExtension) * -1;
      const minimumSliderPosition = (height - top + sh.sliderExtension);
      if (newPosition < minimumSliderPosition && newPosition > maximumSliderPosition) {
        sh.newTop = newPosition;
        const translate = 'translateY';
        sh.slider.style.transform = `${translate}(${sh.newTop}px)`;
      }
    }
  };

  const handleMouseUp = () => {
    sh.isSliderClicked = false;
    sh.currentPosition = sh.newTop;

    updateCallBack(sh.newTop * -1, sh.initialPosition, sliderEl);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const sliderHandler = (event) => {
    const { clientY, clientX } = event;
    sh.sliderClickedPos = horizontal ? clientX : clientY;
    sh.isSliderClicked = true;
    document.addEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  sh.slider.addEventListener('mousedown', sliderHandler);
  return sh;
}

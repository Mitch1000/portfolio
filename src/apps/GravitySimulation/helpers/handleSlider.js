class SliderHandler {
  constructor(sliderEl) {
    this.slider = sliderEl;
    this.initialPosition = this.slider.getBoundingClientRect().top;

    this.sliderClickedPos = 0;
    this.isSliderClicked = false;
    this.currentPosition = 0;
    this.newTop = 0;
    this.slideValue = 0;
  }
}

export default function handleSlider(updateCallBack, sliderEl, horizontal = false) {
  const sh = new SliderHandler(sliderEl);
  const handleMouseMove = (moveEvent) => {
    if (!sh.isSliderClicked) { return; }
    const mousePos = horizontal ? moveEvent.clientX : moveEvent.clientY;
    sh.newTop = sh.currentPosition + (mousePos - sh.sliderClickedPos);
    sh.slideValue = (sh.sliderClickedPos - mousePos);

    const translate = horizontal ? 'translateX' : 'translateY';
    sh.slider.style.transform = `${translate}(${sh.newTop}px)`;
  };

  const handleMouseUp = () => {
    sh.isSliderClicked = false;
    sh.currentPosition = sh.newTop;
    updateCallBack(sh.slideValue, sh.initialPosition, sliderEl);
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

import P5 from 'p5';

let isLeftAnimating = false;
let isRightAnimating = false;
const vScale = 8;

const defaultRect = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  r: 0,
};

let leftRect = defaultRect;
let rightRect = defaultRect;

const fadeOutTime = 5;

let rightSplashTime = fadeOutTime + 1;
let leftSplashTime = fadeOutTime + 1;
let leftActiveRect = {};
let rightActiveRect = {};

function getIsLeftSplashing() {
  return leftSplashTime < fadeOutTime;
}

function getIsRightSplashing() {
  return rightSplashTime < fadeOutTime;
}

function setLeftRect(value) {
  leftRect = value;
}

function setRightRect(value) {
  rightRect = value;
}

function overlay(p5) {
  return {
    setup() {
      const el = document.getElementById('defaultCanvas0');
      el.style.position = 'absolute';
      el.style.top = '0';
      el.style.left = '0';
      el.style.zIndex = 10;

      p5.createCanvas(window.innerWidth, window.innerHeight);
      p5.pixelDensity(1);
      p5.clear();
    },

    draw() {
      const isLeftSplashing = getIsLeftSplashing();
      if (isLeftSplashing) {
        const scaleRatio = (leftSplashTime / fadeOutTime) - 1;

        p5.scale(scaleRatio);
        p5.clear();
        p5.rect(
          leftActiveRect.x / scaleRatio,
          leftActiveRect.y / scaleRatio,
          leftActiveRect.w,
          leftActiveRect.h,
          leftActiveRect.r,
        );
        leftSplashTime += 1;
      }

      const isRightSplashing = getIsRightSplashing();
      if (isRightSplashing) {
        const scaleRatio = (rightSplashTime / fadeOutTime) - 1;
        p5.scale(scaleRatio);
        p5.clear();
        p5.rect(
          rightActiveRect.x / scaleRatio,
          rightActiveRect.y / scaleRatio,
          rightActiveRect.w,
          rightActiveRect.h,
          rightActiveRect.r,
        );
        rightSplashTime += 1;
      }

      p5.noStroke();

      const color = p5.color(255, 202, 153);
      color.setAlpha(180);
      p5.fill(color);

      p5.rectMode(p5.CENTER);
      if (isLeftAnimating && !isLeftSplashing) {
        console.log('isLeftAnimating', leftSplashTime);
        leftSplashTime = 0;
        leftActiveRect = leftRect;
        p5.rect(leftRect.x, leftRect.y, leftRect.w, leftRect.h, leftRect.r);
        isLeftAnimating = false;
      }

      if (isRightAnimating && !isRightSplashing) {
        console.log('isRightAnimating', rightSplashTime);
        rightSplashTime = 0;
        rightActiveRect = rightRect;
        p5.rect(rightRect.x, rightRect.y, rightRect.w, rightRect.h, rightRect.r);
        isRightAnimating = false;
      }
    },
  };
}

function code(p5) {
  // Daniel Shiffman
  // https://youtu.be/rNqaw8LT2ZU
  // http://thecodingtrain.com

  let video;
  let videoArray = [];
  let previousVideoArray = [];
  let initialVideoArray = [];

  function handleLeft() {
    console.log('handleLeft');
    isLeftAnimating = true;
  }

  function handleRight() {
    isRightAnimating = true;
    // const w = p5.map(bright, 0, 255, 0, vScale) * splashModifier;
    // p5.rect(x * vScale, y * vScale, w, w, w / 3);
  }

  function drawRectPixel(pixel, index) {
    const {
      r,
      g,
      b,
      y,
      x,
      bright,
    } = pixel;

    p5.noStroke();
    const sideWidth = vScale * 2.8;
    const sideHeight = vScale * 1.4;
    const alpha = 0.7;

    const getColor = ((c2, c1) => alpha * c1 + (1 - alpha) * c2);
    let hasRightTriggered = false;
    let hasLeftTriggered = false;
    const splashDistance = 20;
    let splashModifier = 10;

    p5.rectMode(p5.CENTER);
    const w = p5.map(bright, 0, 255, 0, vScale);

    if (y <= sideHeight || y >= video.width - sideHeight) {
      const rr = getColor(r, 255);
      const rg = getColor(g, 87);
      const rb = getColor(b, 51);
      // p5.fill(144, 238, 144);
      p5.fill(rr, rg, rb);
    } else if (x <= sideWidth || x >= video.width - sideWidth) {
      // p5.fill(144, 238, 144);
      const gr = getColor(r, 144);
      const gg = getColor(g, 238);
      const gb = getColor(b, 144);
      p5.fill(gr, gg, gb);

      const triggerThreshold = 24;
      const prevBright = previousVideoArray[index].bright;
      const hasBrightChanged = bright > prevBright + triggerThreshold
        || bright < prevBright - triggerThreshold;

      if (x <= sideWidth) {
        if (!hasLeftTriggered && hasBrightChanged && !getIsLeftSplashing()) {
          handleLeft();
          // console.log(video.pixels[10]);
          hasLeftTriggered = true;
        }
        // Trigger the Left splash
        if (hasLeftTriggered) {
          splashModifier = splashDistance;

          const sw = w * splashModifier;

          setLeftRect({
            x: x * vScale,
            y: y * vScale,
            w: sw,
            h: sw,
            r: sw / 3,
          });
        }
      }

      if (x >= (video.width - sideWidth)) {
        if (!hasRightTriggered && hasBrightChanged && !getIsRightSplashing()) {
          handleRight(bright, splashModifier, x, y);
          hasRightTriggered = true;
        }
        // Trigger the Right splash
        if (hasRightTriggered) {
          splashModifier = splashDistance;

          const sw = w * splashModifier;

          setRightRect({
            x: x * vScale,
            y: y * vScale,
            w: sw,
            h: sw,
            r: sw / 3,
          });
        }
      }
    } else {
      // p5.fill(255, 246, 193);
      p5.fill(r, g, b);
    }

    p5.rect(x * vScale, y * vScale, w, w, w / 3);
  }

  function makeBrightnessMap() {
    previousVideoArray = videoArray;
    videoArray = [];
    for (let y = 0; y < video.height; y += 1) {
      for (let x = 0; x < video.width; x += 1) {
        const index = (video.width - x - 1 + (y * video.width)) * 4;

        const r = video.pixels[index + 0];
        const g = video.pixels[index + 1];
        const b = video.pixels[index + 2];
        const bright = (r + g + b) / 3;
        videoArray.push({
          value: video.pixels[index],
          index,
          x,
          y,
          r,
          g,
          b,
          bright,
        });
      }
    }

    if (previousVideoArray.length < videoArray.length) {
      previousVideoArray = videoArray;
    }
  }

  function showPixels() {
    p5.background(51);
    for (let i = 0; i < videoArray.length; i += 1) {
      const pixel = videoArray[i];
      drawRectPixel(pixel, i);
    }
  }

  window.setInitialArray = () => {
    initialVideoArray = videoArray;
    console.log(initialVideoArray);
  };

  window.logVideoArray = () => {
    console.log(videoArray);
  };

  return {
    setup() {
      const el = document.getElementById('defaultCanvas1');
      el.style.position = 'absolute';
      el.style.top = '0';
      el.style.left = '0';

      p5.createCanvas(window.innerWidth, window.innerHeight);
      p5.pixelDensity(1);
      video = p5.createCapture(p5.VIDEO);
      video.size(p5.width / vScale, p5.height / vScale);
      p5.background(51);
      video.loadPixels();
    },

    draw() {
      video.loadPixels();
      makeBrightnessMap();
      showPixels();
    },
  };
}

function main() {
  const canvas1 = (p5) => Object.assign(p5, code(p5));
  const canvas2 = (p5) => Object.assign(p5, overlay(p5));

  return {
    one: new P5(canvas2),
    two: new P5(canvas1),
  };
}

export default main;

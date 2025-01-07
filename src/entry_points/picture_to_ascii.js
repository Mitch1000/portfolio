export default function code(p5) {
  const asciiToGreyScaleMap = '¶@ØÆMåBNÊßÔR#8Q&mÃ0À$GXZA5ñk2S%±3Fz¢yÝCJf1t7ªLc¿+?(r/¤²!*;"^:,\'.`       ';
  const setPixel = (x, y) => {
    const d = p5.pixelDensity();
    let total = 0;
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;

    for (let i = 0; i < d; i += 1) {
      for (let j = 0; j < d; j += 1) {
        const index = 4 * ((y * d + j)
          * p5.width * d + (x * d + i));
        const r = p5.pixels[index];
        const g = p5.pixels[index + 1];
        const b = p5.pixels[index + 2];
        const a = p5.pixels[index + 3];

        totalR += r;
        totalG += g;
        totalB += b;

        total += Math
          .floor(((r + g + b) / 3) * (a / 255));
      }
    }

    const average = total / (d * d);
    const averageR = totalR / (d * d);
    const averageG = totalG / (d * d);
    const averageB = totalB / (d * d);

    const { length } = asciiToGreyScaleMap;
    const letterIndex = Math
      .floor((length / 255) * average);

    p5.colorMode(p5.RGB);
    const rgbColor = p5.color(averageR, averageG, averageB);

    const hue = Math.round(p5.hue(rgbColor));
    const possibleSaturation = Math.round(p5.saturation(rgbColor)) + 40;
    const saturation = possibleSaturation < 100 ? possibleSaturation : 100;
    const possibleLightness = Math.round(p5.lightness(rgbColor)) - 20;
    const lightness = possibleLightness > 0 ? possibleLightness : 0;

    p5.colorMode(p5.HSL);
    const hslColor = p5.color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);

    return {
      letter: asciiToGreyScaleMap[letterIndex],
      color: hslColor,
    };
  };

  const drawLinesInDiv = (lines) => {
    const div = p5.createDiv();
    div.style('font-size', '12pt');
    div.style('font-family', 'Courier New');
    div.style('font-weight', '600');
    div.style('position', 'absolute');
    div.style('top', '0');
    div.style('left', '0');
    div.style('scale', `${0.1385 * 2}`);
    div.style('line-height', '0.6');
    div.position(0, 0);

    const lineDiv = p5.createDiv(lines);
    lineDiv.style('position', 'absolute');
    div.child(lineDiv);
    lineDiv.addClass('text-lines');
  };

  const getLinesOfAscii = (img, fontSize = 4, draw = false) => {
    let lines = '';
    for (let h = 0; h < img.height; h += 1) {
      let line = '';
      for (let w = 0; w < img.width; w += 1) {
        const pixel = setPixel(w, h);
        line += pixel.letter;
        if (draw) {
          p5.fill(pixel.color);
          const squishRatio = Math.floor(fontSize * 0.75);
          p5.text(pixel.letter, w * squishRatio, h * squishRatio);
        }
      }
      lines += (`${line}<br>`);
    }

    return lines;
  };

  const ascii = (img) => {
    p5.loadFont('assets/SpaceMono-Regular.ttf', (spaceMono) => {
      p5.textFont(spaceMono);
      const fontSize = 4;
      p5.textSize(fontSize);
      getLinesOfAscii(img, fontSize, true);
    });
  };

  const drawAsciiArt = (img) => {
    const lines = getLinesOfAscii(img);
    drawLinesInDiv(lines);
  };

  const setupImageResolution = (img) => {
    const aspectRatio = img.width / img.height;
    if (p5.width > 720) {
      const newWidth = 720;
      const newHeight = 720 / aspectRatio;
      img.resize(newWidth, newHeight);
    }

    if (p5.height > 480) {
      const newHeight = 480;
      const newWidth = 480 * aspectRatio;
      img.resize(newWidth, newHeight);
    }
  };

  return {
    setup() {
      const height = 1600;
      const width = Math.floor(height * 1.33333333);
      p5.createCanvas(width, height);

      p5.pixelDensity(6.0);

      p5.loadImage('assets/devon.jpg', (img) => {
        setupImageResolution(img);

        // p5.resizeCanvas(img.width, img.height);
        p5.image(img, 0, 0);
        p5.loadPixels();

        p5.background(255);

        ascii(img);
        // drawAsciiArt(img);
      });
    },
  };
}

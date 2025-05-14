import threeImporter from './threeImporter';
const THREE = threeImporter();
const { TextGeometry } = window.examples;
import { getToonMaterial, solidify } from './toonLighting';

class IntroText {
  constructor({
    scene,
    textString = 'Mitch World',
    kerning = 12,
    info = 'Default',
    size = 500,
    scale = 0.125,
    ySpeed = 0.08,
    amplitude = 12,
    initialPositionX = 224,
    initialPositionY = 125,
    color = 'crimson',
    glitch = false,
    glitchColor = { x: 0.5, y: 0.1670, z: 0.0429 },
  }) {
    this.scene = scene;
    this.textString = textString;
    this.kerning = kerning;
    this.frameCount = 0;
    this.size = size;
    this.scale = scale;
    this.ySpeed = ySpeed;
    this.amplitude = amplitude;
    this.initialPositionX = initialPositionX;
    this.initialPositionY = initialPositionY;
    this.color = color;
    this.glitch = glitch;
    this.messages = [];
    this.boxes = [];
    this.outlines = [];
    this.glitches = [];
    this.backdrops = [];
    this.glitchColor = glitchColor;
    this.offsetTime = 250;
    this.info = info;
  }

  async drawText(minCharacterSpace = 60) {
    const {
      scale,
      initialPositionX,
      initialPositionY,
      color,
      size,
      glitchColor,
    } = this;

    const material = await getToonMaterial(color);
    const material2 = await getToonMaterial('black');

    let previosLetterXPosition = initialPositionX;

    const onFontLoad = (font) => {
      for (let i = 0; i < this.textString.length; i += 1) {
        const character = this.textString.charAt(i);
        const geometry = new TextGeometry(character, {
          font,
          size,
          depth: 45,
          curveSegmnts: 12,
          bevelEnabled: true,
          bevelThickness: 1,
          bevelSize: 2,
          bevelOffset: 0,
          bevelSegments: 2,
        });

        const alphaNumbericRegEx = /^[a-z0-9]+$/i;
        const isValid = alphaNumbericRegEx.test(character);
        let minX = 0;
        let maxX = 0;
        if (isValid) {
          geometry.scale(scale, scale, scale);
          geometry.rotateY(180 * (Math.PI / 180));

          geometry.translate(previosLetterXPosition - this.kerning, initialPositionY, 0);
          geometry.computeBoundingBox();
          const box3 = geometry.boundingBox;
          minX = box3.min.x;
          maxX = box3.max.x;

          const text = new THREE.Mesh(geometry, material);

          const outline = solidify({
            geometry,
            scene: this.scene,
            thickness: 8.1,
          });

          if (this.glitch) {
            const glitch = solidify({
              geometry,
              scene: this.scene,
              thickness: 0.1,
              color: glitchColor,
            });

            glitch.geometry.translate(0, 0, -70);
            const backdrop = new THREE.Mesh(geometry, material2);
            backdrop.geometry.translate(0, 0, -40);
            this.glitches.push(glitch);
            this.backdrops.push(backdrop);
          }

          text.name = `Text ${this.info} - ${this.textString} (${character})`;

          this.scene.add(text);

          this.messages.push(text);
          this.outlines.push(outline);
          this.boxes.push(box3);
        }

        previosLetterXPosition = minX === 0 && maxX === 0
          ? previosLetterXPosition - minCharacterSpace
          : minX;
      }

      return this.messages;
    };

    if ((window.ignoreFont.font || {}).isFont) {
      onFontLoad(window.ignoreFont.font);
      return;
    }

    window.ignoreFont.onSetListeners
      .push((font) => onFontLoad(font));
  }

  async draw() {
    return this.drawText(20, 249);
  }

  animate() {
    const { ySpeed, amplitude } = this;

    for (let i = 0; i < this.messages.length; i += 1) {
      const message = this.messages[i];
      const outline = this.outlines[i];
      const box = this.boxes[i];
      const letterX = 0;

      const letterOffset = i * (this.kerning / 2);

      const height = box.max.y - box.min.y;

      const letterY = (height / 4
        + Math.sin((this.frameCount - letterOffset) * ySpeed) * amplitude) / 2;

      message.position.set(letterX, letterY, 0);
      outline.position.set(letterX, letterY, 0);

      if (this.glitch) {
        setTimeout(() => {
          this.glitches[i].position.set(letterX, letterY, 5);
        }, this.offsetTime);

        setTimeout(() => {
          this.backdrops[i].position.set(letterX, letterY, 5);
        }, this.offsetTime * 2.5);
      }
    }

    this.frameCount += 1;
  }
}

export default IntroText;

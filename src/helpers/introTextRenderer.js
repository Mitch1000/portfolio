import IntroText from './introText';

export default class IntroTextRenderer {
  constructor(scene) {
    this.header = new IntroText({
      scene,
      ySpeed: 0.04,
      glitch: true,
      info: 'Header',
      textString: 'Mitch Drohan',
      kerning: 12.5,
      offsetTime: 200,
      glitchColor: { x: 0.9, y: 0, z: 0.1 },
      amplitude: 12,
      initialPositionX: 255,
      scale: 0.125,
    });

    this.subHeader = new IntroText({
      scene,
      textString: 'Click a Planet to Explore!',
      color: '#DC143C',
      info: 'Subheader',
      initialPositionY: 80,
      initialPositionX: 190,
      size: 400,
      scale: 0.055,
      kerning: 3.2,
      color: '#c9c8ab',
      ySpeed: 0.04,
      glitch: true,
      glitchColor: { x: 1, y: 0.1670, z: 0.0429 },
    });
  }

  async draw() {
    this.header.draw();
    this.subHeader.draw();
    return { header: this.header, subHeader: this.subHeader };
  }

  animate() {
    this.header.animate();
    this.subHeader.animate();
  }
}

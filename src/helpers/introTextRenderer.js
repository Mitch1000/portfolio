import IntroText from './introText';

export default class IntroTextRenderer {
  constructor(scene) {
    this.header = new IntroText({
      scene,
      ySpeed: 0.04,
      glitch: true,
      kerning: 12.5,
      offsetTime: 200,
      glitchColor: { x: 0.9, y: 0, z: 0.1 },
      amplitude: 12,
      initialPositionX: 215,
      scale: 0.125,
    });

    this.subHeader = new IntroText({
      scene,
      textString: 'Coming Soon',
      initialPositionY: 70,
      initialPositionX: 90,
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
    await this.header.draw();
    await this.subHeader.draw();
    return { header: this.header, subHeader: this.subHeader };
  }

  animate() {
    this.header.animate();
    this.subHeader.animate();
  }
}

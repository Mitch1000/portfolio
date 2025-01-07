class Denormalizer {
  constructor(windowScale, diagramScale) {
    this.windowScale = windowScale;
    this.diagramScale = diagramScale;
  }

  // denormalize x
  dnx(val) {
    return (val / this.diagramScale.x) * this.windowScale.x;
  }

  // denormalize y
  dny(val) {
    return (val / this.diagramScale.y) * this.windowScale.y;
  }

  // denormalize z
  dnz(val) {
    return (val / this.diagramScale.z) * this.windowScale.z;
  }
}
export default Denormalizer;

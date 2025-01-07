import Vector from './vector';

class PhysicsBody {
  constructor({
    velocity = new Vector({ x: 0, y: 0, z: 0 }),
    position = new Vector({ x: 0, y: 0, z: 0 }),
    mass = 1,
    color = [255, 255, 255],
    name = 'Planet',
    density = 5513,
    scale = 1,
    isToDrawForceVector = true,
  }) {
    this.velocity = velocity;
    this.position = position;
    this.mass = mass;
    this.name = name;
    this.color = color;
    this.density = density;
    this.scale = scale;
    this.acceleration = new Vector({ x: 0, y: 0, z: 0 });
    this.isToDrawForceVector = isToDrawForceVector;
    this.drawPosition = new Vector(this.position);
  }

  getAcceleration(physicsBodies, gravitationConstant) {
    return physicsBodies.reduce((result, comparatorBody) => {
      if (this === comparatorBody) {
        return result;
      }
      const acceleration = result;
      const c1 = gravitationConstant * comparatorBody.mass;
      const b1 = Vector
        .getDistanceBetweenVectors(comparatorBody.position, this.position) ** 3;
      acceleration.x += (c1 * (comparatorBody.position.x - this.position.x)) / b1;
      acceleration.y += (c1 * (comparatorBody.position.y - this.position.y)) / b1;
      acceleration.z += (c1 * (comparatorBody.position.z - this.position.z)) / b1;

      return acceleration;
    }, new Vector({ x: 0, y: 0, z: 0 }));
  }

  getSize(width, isScaled = true, minSize = 1.5) {
    // const s = ((Math.log((this.mass) * 10 ** -24.8) * 4) * (Math.log((width / 100)) / 1.8));
    // density forumlay from
    // https://evgenii.com/blog/three-body-problem-simulator/
    if (isScaled) {
      const density = this.density * 10 ** 24;
      const s = ((((3 / 4) * this.mass) / (Math.PI * density)) ** (1 / 3)) * this.scale;

      return Math.max(s, minSize);
    }

    const density = this.density * 10 ** 24;
    return (((3 / 4) * this.mass) / (Math.PI * density)) ** (1 / 3);
  }

  drawForceVector(p5, denormalizer) {
    if (!this.isToDrawForceVector) { return; }
    p5.fill(206, 45, 79);
    p5.strokeWeight(2);
    p5.stroke(206, 45, 79);
    p5.translate(0, 0, 0.1);
    const multiplier = denormalizer.diagramScale.y * 0.01;
    const headx = denormalizer.dnx(this.position.x) + this.acceleration.x * multiplier;
    const heady = denormalizer.dny(this.position.y) + this.acceleration.y * multiplier;
    const headz = denormalizer.dny(this.position.z) + this.acceleration.z * multiplier;
    p5.line(
      denormalizer.dnx(this.position.x),
      denormalizer.dny(this.position.y),
      denormalizer.dny(this.position.z),
      headx,
      heady,
      headz,
    );
    p5.noStroke();
    p5.translate(0, 0, 0);
  }

  getVelocityWithDelta(timeIncrease, acceleration) {
    return new Vector({
      x: this.velocity.x + (acceleration.x * timeIncrease),
      y: this.velocity.y + (acceleration.y * timeIncrease),
      z: this.velocity.z + (acceleration.z * timeIncrease),
    });
  }

  draw(p5, denormalizer, isScaled = true) {
    const d = denormalizer;
    const s = this.getSize(d.windowScale.x, isScaled);

    p5.push(); // enter local coordinate system
    p5.noStroke();
    p5.fill(this.color[0], this.color[1], this.color[2]);
    p5.translate(d.dnx(this.position.x), d.dny(this.position.y), d.dnz(this.position.z));
    p5.emissiveMaterial(this.color[0], this.color[1], this.color[2]);

    p5.sphere(s, 12);
    p5.pop(); // enter local coordinate system

    const circleSize = this.getSize(d.windowScale.x, false, 0.000001);
    p5.push(); // enter local coordinate system
    p5.translate(d.dnx(this.position.x), d.dny(this.position.y), d.dnz(this.position.z));
    p5.rotateY(p5.radians(90));
    if (isScaled) {
      p5.emissiveMaterial(0);
      p5.fill(0);
      p5.noStroke();
      p5.sphere(circleSize + 2, 2);
    } else {
      p5.stroke(this.color[0], this.color[1], this.color[2]);
      p5.noFill();
      p5.sphere(circleSize);
    }
    p5.pop(); // enter local coordinate system
  }
}

export default PhysicsBody;

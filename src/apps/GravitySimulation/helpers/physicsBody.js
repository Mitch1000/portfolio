import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { getToonMaterial, solidify } from './toonLighting';
import Vector from './vector';

function rgbToHex(r, g, b) {
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`; // eslint-disable-line
}

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
    lightingTones = 2,
    offset = -100,
    scene,
  }) {
    this.offset = offset;
    this.velocity = velocity;
    this.lightingTones = lightingTones;
    this.position = position;
    this.mass = mass;
    this.name = name;
    this.color = color;
    this.density = density;
    this.scale = scale;
    this.acceleration = new Vector({ x: 0, y: 0, z: 0 });
    this.isToDrawForceVector = isToDrawForceVector;
    this.drawPosition = new Vector(this.position);
    this.scene = scene;
    this.mesh = null;
    this.outline = null;
    this.forceVector = null;
  }

  setPosition(mesh, position, denormalizer) {
    const p = position;
    const d = denormalizer;
    mesh.position.set(d.dnx(p.x) + this.offset, d.dny(p.y), d.dnz(p.z));
    mesh.updateMatrix();
    return mesh.position;
  }

  async drawSphere(radius, color, denormalizer) {
    const height = 12;
    const width = 24;
    const geometry = new THREE.SphereGeometry(radius, width, height);
    const material = await getToonMaterial(color, this.lightingTones);

    const sphere = new THREE.Mesh(geometry, material);

    this.scene.add(sphere);

    sphere.matrixAutoUpdate = false;
    this.setPosition(sphere, this.position, denormalizer);

    return sphere;
  }

  drawLine(originVector, targetVector, color) {
    const raycaster = new THREE.Raycaster();

    raycaster.ray.origin.set(originVector.x, originVector.y, originVector.z);
    raycaster.ray.direction.set(targetVector.x, targetVector.y, targetVector.z);

    const points = [];
    points.push(originVector);
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(originVector);

    const geometry = new LineGeometry();

    const positions = [
      originVector.x,
      originVector.y,
      originVector.z,
      this.offset,
      0,
      0,
      originVector.x,
      originVector.y,
      originVector.z,
    ];

    geometry.setPositions(positions);
    const material = new LineMaterial({
      color,
      linewidth: 2.5,
      alphaToCoverage: false,
    });

    const line = new Line2(geometry, material);
    // const line = new THREE.Mesh(geometry, material);

    this.scene.add(line);
    return line;
  }

  hexColor() {
    const [r, g, b] = this.color;
    return rgbToHex(r, g, b);
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

  drawForceVector(denormalizer, drawDistance) {
    if (!this.isToDrawForceVector) { return; }
    // const color = rgbToHex(206, 45, 79);
    const color = 'crimson';

    const multiplier = denormalizer.diagramScale.y * 0.01;
    const headx = denormalizer.dnx(this.position.x) + this.acceleration.x * multiplier;
    const heady = denormalizer.dny(this.position.y) + this.acceleration.y * multiplier;
    const headz = denormalizer.dnz(this.position.z) + this.acceleration.z * multiplier;

    const originVector = new THREE.Vector3(
      denormalizer.dnx(this.position.x) + this.offset,
      denormalizer.dny(this.position.y),
      denormalizer.dny(this.position.z),
    );

    const targetVector = new THREE.Vector3(
      headx,
      heady,
      headz,
    );

    this.forceVector = this.drawLine(
      originVector,
      targetVector,
      color,
      drawDistance / 16,
    );
  }

  updateForceVector(denormalizer) {
    if (!this.isToDrawForceVector) {
      return;
    }

    const hasArrow = this.forceVector instanceof Line2;

    if (!hasArrow) { return; }

    const originVector = new THREE.Vector3(
      denormalizer.dnx(this.position.x),
      denormalizer.dny(this.position.y),
      denormalizer.dnz(this.position.z),
    );

    const position = this.forceVector.geometry.attributes.instanceStart.data;

    position.array[0] = originVector.x + this.offset;
    position.array[1] = originVector.y;
    position.array[2] = originVector.z;

    position.array[position.array.length - 3] = originVector.x + this.offset;
    position.array[position.array.length - 2] = originVector.y;
    position.array[position.array.length - 1] = originVector.z;

    this.forceVector.geometry.attributes.instanceStart.needsUpdate = true;

    position.needsUpdate = true;

    // this.forceVector.geometry.needsUpdate = true;
    // const quaternion = new THREE.Quaternion();
    // quaternion.setFromUnitVectors(targetVector, originVector);

    // this.forceVector.applyQuaternion(quaternion);
  }

  updatePosition(denormalizer) {
    const hasMesh = this.mesh instanceof THREE.Mesh;
    const hasOutline = this.outline instanceof THREE.Mesh;

    if (!hasMesh || !hasOutline) {
      return;
    }

    const hasMeshPosition = this.mesh.position !== undefined;
    const hasOutlinePosition = this.outline.position !== undefined;
    if (!hasMeshPosition || !hasOutlinePosition) { return; }

    const d = denormalizer;
    const p = this.position;

    this.mesh.position.set(d.dnx(p.x), d.dny(p.y), d.dnz(p.z));
    this.setPosition(this.mesh, this.position, denormalizer);
    this.setPosition(this.outline, this.position, denormalizer);

    this.mesh.updateMatrix();
  }

  getVelocityWithDelta(timeIncrease, acceleration) {
    return new Vector({
      x: this.velocity.x + (acceleration.x * timeIncrease),
      y: this.velocity.y + (acceleration.y * timeIncrease),
      z: this.velocity.z + (acceleration.z * timeIncrease),
    });
  }

  async draw(denormalizer, isScaled = true) {
    const d = denormalizer;
    const s = this.getSize(d.windowScale.x, isScaled);

    this.mesh = await this.drawSphere(s, this.hexColor(), denormalizer);
    // const circleSize = this.getSize(d.windowScale.x, false, 0.000001);

    this.outline = await solidify(this.mesh, this.scene);

    // if (isScaled) {
    // } else {
    //   this.outline = await this.drawSphere(circleSize, this.hexColor(), denormalizer);
    // }
  }
}

export default PhysicsBody;

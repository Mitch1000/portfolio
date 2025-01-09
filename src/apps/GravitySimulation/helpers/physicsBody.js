import * as THREE from 'three';
import { getToonMaterial, solidify } from './toonLighting';
import Vector from './vector';

const LINE_WIDTH = 2;
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
    offsetX = -100,
    offsetY = 0,
    scene,
  }) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
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
    this.forceLineMesh = null;
    this.lineWidth = 2;
  }

  updateBoxHeadAndTail(headVector, tailVector, pos) {
    // TODO Find pattern here in BoxGeometry to avoid creating these arrays.
    const lineOriginVectorsIndexes = [0, 1, 2, 3, 9, 11, 13, 15, 17, 19, 20, 22];
    // To make it a box these oints need to be offset by the width value
    // Y indices of top sides of cube
    const yPositionBoxIndexes = [0, 3, 12, 15, 24, 27, 30, 33, 48, 51, 60, 63];

    // Z indices of back sides of cube
    const zPositionBoxIndexes = [0, 6, 15, 21, 30, 33, 36, 39, 48, 51, 54, 57];

    const position = pos;
    const width = LINE_WIDTH;

    const updateToVector = (i, vector, isHead = false) => {
      const positionArrayIndex = i * 3;

      const absY = Math.abs(vector.y - this.offsetY);
      const absX = Math.abs(vector.x - this.offsetX);

      const rat = absY < absX
        ? absY / absX
        : absX / absY;

      let xSign = vector.x === 0
        ? Math.sign(headVector.x - this.offsetX)
        : Math.sign(vector.x - this.offsetX);

      let ySign = vector.y === 0
        ? Math.sign(headVector.y - this.offsetY)
        : Math.sign(vector.y - this.offsetY);

      if (xSign === 0) {
        xSign = 1;
      }

      if (ySign === 0) {
        ySign = 1;
      }

      const isCenter = Number.isNaN(rat) ? -1 : 1;

      const headFactor = isHead ? 0.8 : 1;

      const sign = xSign * ySign;

      if (yPositionBoxIndexes.includes(positionArrayIndex)) {
        position.array[positionArrayIndex] = vector.x + (width / 2) * sign * headFactor * isCenter;
      } else {
        position.array[positionArrayIndex] = vector.x + (width / -2) * sign * headFactor;
      }

      if (yPositionBoxIndexes.includes(positionArrayIndex)) {
        position.array[positionArrayIndex + 1] = vector.y + (width / -2) * headFactor;
      } else {
        position.array[positionArrayIndex + 1] = vector.y + (width / 2) * headFactor;
      }

      if (zPositionBoxIndexes.includes(positionArrayIndex)) {
        position.array[positionArrayIndex + 2] = vector.z + width / 2;
      } else {
        position.array[positionArrayIndex + 2] = vector.z + width / -2;
      }
    };

    for (let i = 0; i < (position.array.length / 3); i += 1) {
      // Update Box to Origin Points or Target Points

      if (lineOriginVectorsIndexes.includes(i)) {
        updateToVector(i, headVector, true);
      } else {
        updateToVector(i, tailVector);
      }
    }

    position.needsUpdate = true;
  }

  setPosition(mesh, position, denormalizer) {
    const p = position;
    const d = denormalizer;
    mesh.position.set(d.dnx(p.x) + this.offsetX, d.dny(p.y) + this.offsetY, d.dnz(p.z));
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

  drawLine(originVector, targetVector, color, denormalizer) {
    const points = [];
    points.push(originVector);
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(originVector);

    const distance = originVector.distanceTo(targetVector);

    const width = LINE_WIDTH;
    const geometry = new THREE.CylinderGeometry(width, width, distance, 8, 1);

    const material = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
    });

    const line = new THREE.Mesh(geometry, material);

    const position = line.geometry.getAttribute('position');

    this.updateBoxHeadAndTail(originVector, targetVector, position, denormalizer);

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

  drawForceVector(denormalizer) {
    if (!this.isToDrawForceVector) { return; }
    // const color = rgbToHex(206, 45, 79);
    const color = 'crimson';

    const originVector = new THREE.Vector3(
      denormalizer.dnx(this.position.x) + this.offsetX,
      denormalizer.dny(this.position.y) + this.offsetY,
      denormalizer.dny(this.position.z),
    );

    const targetVector = new THREE.Vector3(
      0 + this.offsetX,
      0 + this.offsetY,
      0,
    );

    this.forceLineMesh = this.drawLine(
      originVector,
      targetVector,
      color,
      denormalizer,
    );
  }

  updateForceLines(denormalizer) {
    if (!this.isToDrawForceVector) {
      return;
    }

    const hasArrow = this.forceLineMesh instanceof THREE.Mesh;

    if (!hasArrow) { return; }

    const originVector = new THREE.Vector3(
      denormalizer.dnx(this.position.x) + this.offsetX,
      denormalizer.dny(this.position.y) + this.offsetY,
      denormalizer.dnz(this.position.z),
    );

    const targetVector = new THREE.Vector3(
      0 + this.offsetX,
      0 + this.offsetY,
      0,
    );

    const position = this.forceLineMesh.geometry.getAttribute('position');
    this.updateBoxHeadAndTail(originVector, targetVector, position);
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

    this.outline = await solidify(this.mesh.geometry, this.scene);

    // if (isScaled) {
    // } else {
    //   this.outline = await this.drawSphere(circleSize, this.hexColor(), denormalizer);
    // }
  }
}

export default PhysicsBody;

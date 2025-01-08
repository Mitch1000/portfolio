import * as THREE from 'three';
import TOON_TONE3 from '../../../assets/threeTone.jpg';
import TOON_TONE2 from '../../../assets/twoTone.jpg';
import TOON_TONE1 from '../../../assets/oneTone.jpg';

function solidify(mesh, scene) {
  const THICKNESS = 1.4;
  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `void main() { 
      vec3 newPosition = position + normal * ${THICKNESS};
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1);
    }`,
    fragmentShader: `void main() {
      gl_FragColor = vec4(0, 0, 0, 1);
    }`,
    side: THREE.BackSide,
  });

  const outline = new THREE.Mesh(mesh.geometry, shaderMaterial);
  outline.rotation.set(0, (180 * (Math.PI / 180)), 0);
  scene.add(outline);
  return outline;
}

async function getToonMaterial(color, tones = 3) {
  const toonTones = [TOON_TONE1, TOON_TONE2, TOON_TONE3];
  const toonTone = toonTones[tones - 1];
  const texture = await new THREE.TextureLoader().loadAsync(toonTone);

  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  return new THREE.MeshToonMaterial({
    color,
    gradientMap: texture,
  });
}

export { solidify, getToonMaterial };

import * as THREE from 'three';
import TOON_TONE3 from '../../../assets/threeTone.jpg';
import TOON_TONE2 from '../../../assets/twoTone.jpg';
import TOON_TONE1 from '../../../assets/oneTone.jpg';

function solidify(geometry, scene, thickness = 1.4, color = { x: 0, y: 0, z: 0 }) {
  const { x, y, z } = color;

  // vec3 xyz = vec3(0.3213,0.1670,0.0429);
  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `void main() { 
      vec3 newPosition = position + normal * ${thickness};
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1);
    }`,
    fragmentShader: `void main() {
      vec3 xyz = vec3(${x},${y},${z});
      gl_FragColor = vec4(xyz, 1.0);
    }`,
    side: THREE.BackSide,
  });

  const outline = new THREE.Mesh(geometry, shaderMaterial);
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

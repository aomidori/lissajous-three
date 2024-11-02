import * as THREE from 'three';

export const addGrid = (
  scene: THREE.Scene,
  size: number,
  divisions: number,
  color: number,
) => {
  const gridHelper = new THREE.GridHelper(size, divisions, color, color);
  scene.add(gridHelper);
}

export const addBox = (
  scene: THREE.Scene,
  size: number,
  color: number,
) => {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

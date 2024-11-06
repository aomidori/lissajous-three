import * as THREE from 'three';

export const addGrid = (
  scene: THREE.Scene,
  size: number,
  divisions: number,
  color: number,
) => {
  const gridHelper = new THREE.GridHelper(size, divisions, color, color);
  gridHelper.name = 'grid';
  scene.add(gridHelper);
}

export const addGridBox = (
  scene: THREE.Scene,
  size: number,
  divisions: number,
  color: number,
) => {
  const gridHelper = new THREE.GridHelper(size, divisions, color, color);
  gridHelper.name = 'grid-y-plane';
  scene.add(gridHelper);

  const gridHelperZ = new THREE.GridHelper(size, divisions, color, color);
  gridHelperZ.name = 'grid-z-plane';
  gridHelperZ.rotation.x = Math.PI / 2;
  gridHelperZ.position.y = size / 2;
  gridHelperZ.position.z = - size / 2;
  scene.add(gridHelperZ);

  const gridHelperX = new THREE.GridHelper(size, divisions, color, color);
  gridHelperX.name = 'grid-x-plane';
  gridHelperX.rotation.z = Math.PI / 2;
  gridHelperX.position.x = - size / 2;
  gridHelperX.position.y = size / 2;
  scene.add(gridHelperX);

  gridHelper.position.y -= size / 2;
  gridHelperZ.position.y -= size / 2;
  gridHelperX.position.y -= size / 2;
}

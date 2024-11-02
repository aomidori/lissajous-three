import * as THREE from 'three';

export const CAMERA_POSITION = {
  top: { x: 0, y: 0, z: 10 },
  front: { x: 0, y: 10, z: 0 },
  left: { x: 10, y: 0, z: 0 },
  initial: { x: 10, y: 10, z: 10 }
}

export const initCamera = (camera: THREE.PerspectiveCamera, position: { x: number, y: number, z: number }) => {
  camera.position.x = position.x;
  camera.position.y = position.y;
  camera.position.z = position.z;
  camera.lookAt(0, 0, 0);
}

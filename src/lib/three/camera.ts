import * as THREE from 'three';
import { Tween, Easing } from '@tweenjs/tween.js'

let cameraTween: Tween;

export const CAMERA_POSITION = {
  top: { x: 0, y: 0, z: 10 },
  front: { x: 0, y: 10, z: 0 },
  left: { x: 10, y: 0, z: 0 },
  initial_pre: { x: 5, y: 5, z: 10 },
  initial: { x: 3, y: 3, z: 7 }
}

export const initCamera = (camera: THREE.PerspectiveCamera) => {
  const positionPre = CAMERA_POSITION.initial_pre;
  const position = CAMERA_POSITION.initial;
  camera.position.x = positionPre.x;
  camera.position.y = positionPre.y;
  camera.position.z = positionPre.z;
  cameraTween = new Tween(camera.position)
    .to({ x: position.x, y: position.y, z: position.z }, 2000)
    .easing(Easing.Quadratic.Out)
    .start();
  camera.position.x = position.x;
  camera.position.y = position.y;
  camera.position.z = position.z;
  camera.lookAt(0, 0, 0);
}

export const updateCamera = () => {
  if (updateCamera) {
    cameraTween.update();
  }
}

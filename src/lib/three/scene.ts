import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { theme } from '$lib/data/theme/theme';
import { settings } from '$lib/data/settings';

import { addGrid } from './objects';
import { addLightings } from './lightings';
import { CAMERA_POSITION, initCamera } from './camera';
import { Lissajous3D } from './plot/lissajous';

export class SceneManager {
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  private controls: OrbitControls;

  private lissajous2D = new Lissajous3D({
    a: 1,
    b: 0,
    c: 1,
    n: 1,
    m: 1,
    d: 0,
  });

  constructor(canvasContainer: HTMLDivElement) {
    if (!canvasContainer) {
      throw new Error('Canvas element not found');
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(theme.three.backgroundColor);
    canvasContainer.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.initScene();
  }

  private initScene() {
    initCamera(this.camera, CAMERA_POSITION.initial);
    addLightings(this.scene);
    addGrid(this.scene, 10, 10, theme.three.gridColor);
    // addBox(this.scene, 2, theme.three.lineColor);
    this.scene.add(this.lissajous2D.getMesh());
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    this.lissajous2D.setValues({
      a: 1,
      b: 0,
      c: settings.xFrequency,
      n: settings.yFrequency,
      m: settings.zFrequency,
      d: 0,
    });
    requestAnimationFrame(() => this.render());
  }

  public resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public dispose() {
    this.renderer?.dispose();
  }
}

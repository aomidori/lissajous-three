import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { writable } from 'svelte/store';

import { theme } from '$lib/data/theme/theme';
import { setGuiControlsVisibility, settings } from '$lib/data/settings';

import { addGrid } from './objects';
import { addLightings } from './lightings';
import { animateCameraToView, initCamera, updateCamera } from './camera';
import { Lissajous3D, lissajousGroupItems } from './plot/lissajous';

export const hoveringFigureData = writable<THREE.Object3D['userData'] | undefined>();
export const hoveringFigurePosition = writable<THREE.Vector3 | undefined>();

export class SceneManager {
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  private controls: OrbitControls;
  private raycaster = new THREE.Raycaster();

  private lissajousSingleRoot: THREE.Group = new THREE.Group();
  private lissajousGroupRoot: THREE.Group = new THREE.Group();

  private lissajous3D!: Lissajous3D;
  private lissajousGroup: Lissajous3D[] = [];

  // view state
  private hoveringFigureName: string = '';
  private activeView: 'single' | 'group' = 'single';

  constructor(canvasContainer: HTMLDivElement) {
    if (!canvasContainer) {
      throw new Error('Canvas element not found');
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(theme.three.backgroundColor);
    canvasContainer.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.initScene();
  }

  private initScene() {
    initCamera(this.camera);
    addLightings(this.scene);
    addGrid(this.scene, 8, 12, theme.three.gridColor);
    this.scene.add(this.lissajousSingleRoot);
    this.scene.add(this.lissajousGroupRoot);
    this.setView('single');

    window.addEventListener('pointermove', this.intersectObject);
    this.controls.addEventListener('change', () => {
      if (this.hoveringFigureName) {
        const figure = this.scene.getObjectByName(this.hoveringFigureName);
        if (figure) {
          hoveringFigurePosition.set(figure.position);
        }
      }
    });
  }

  private intersectObject = (e: PointerEvent) => {
    if (this.activeView === 'single') {
      return;
    }
    const pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    const pointerY = -(e.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(new THREE.Vector2(pointerX, pointerY), this.camera);
    const intersects = this.raycaster.intersectObjects([this.lissajousGroupRoot]);
    if (intersects.length) {
      if (intersects[0].object instanceof THREE.Points) {
        this.hoveringFigureName = intersects[0].object.name;
        hoveringFigureData.set(intersects[0].object.userData);
        hoveringFigurePosition.set(intersects[0].object.position);
        return;
      }
    }
    this.hoveringFigureName = '';
    hoveringFigureData.set(undefined);
    hoveringFigurePosition.set(undefined);
  };

  public render() {
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    updateCamera();
    this.lissajous3D.setValues({
      xA: 1,
      yA: 1,
      zA: 1,
      a: settings.xFrequency,
      b: settings.yFrequency,
      c: settings.zFrequency,
      xPhi: 0,
      yPhi: 0,
      zPhi: 0,
    });
    this.lissajous3D.setMaterialColor(settings.color);
    requestAnimationFrame(() => this.render());
  }

  public resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    if (window.devicePixelRatio !== this.renderer.getPixelRatio()) {
      this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public projectPositionToScreen = (position: THREE.Vector3): { x: number; y: number } => {
    const vector = position.clone().project(this.camera);
    const canvasWidth = this.renderer.domElement.width / window.devicePixelRatio;
    const canvasHeight = this.renderer.domElement.height / window.devicePixelRatio;
    vector.x = ((vector.x + 1) * canvasWidth) / 2;
    vector.y = ((-vector.y + 1) * canvasHeight) / 2;
    return vector;
  };

  public setView(view: string) {
    switch (view) {
      case 'single':
        this.activeView = 'single';
        if (!this.lissajous3D) {
          this.lissajous3D = new Lissajous3D();
          const mesh = this.lissajous3D.getMesh();
          mesh.name = 'lissajous-single';
          this.lissajousSingleRoot.add(mesh);
        }
        this.lissajousSingleRoot.visible = true;
        this.lissajousGroupRoot.visible = false;
        setGuiControlsVisibility(true);
        initCamera(this.camera);
        break;
      case 'group':
        this.activeView = 'group';
        if (!this.lissajousGroup.length) {
          this.lissajousGroup = Array.from({ length: 8 }, () => new Lissajous3D());
          lissajousGroupItems.forEach((params, i) => {
            const lissajous = new Lissajous3D(params, true);
            this.lissajousGroup.push(lissajous);
            const mesh = lissajous.getMesh();
            const x = (i % 4) - 1.5;
            const y = Math.floor(i / 4) - 1.5;
            const gap = 2;
            mesh.scale.set(0.2, 0.2, 0.2);
            mesh.position.set(x * gap, 0, y * gap);
            mesh.name = `lissajous-group-${i}`;
            this.lissajousGroupRoot.add(mesh);
          });
        }
        this.lissajousSingleRoot.visible = false;
        this.lissajousGroupRoot.visible = true;
        setGuiControlsVisibility(false);
        animateCameraToView(this.camera, 'top');
        break;
      default:
        console.error('Unknown view');
        break;
    }
  }

  public dispose() {
    window.removeEventListener('pointermove', this.intersectObject);
    const renderTarget = this.renderer.getRenderTarget();
    if (renderTarget) {
      renderTarget.dispose();
    }
    this.renderer?.dispose();
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        object.material.dispose();
      }
    });
  }
}

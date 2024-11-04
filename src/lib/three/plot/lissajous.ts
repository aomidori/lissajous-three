import * as THREE from 'three';

type LissajousParams = {
  xA: number; // x-axis amplitude
  yA: number; // y-axis amplitude
  zA: number; // z-axis amplitude
  a: number; // x-axis frequency
  b: number; // y-axis frequency
  c: number; // z-axis frequency
  xPhi: number; // x-axis phase
  yPhi: number; // y-axis phase
  zPhi: number; // z-axis phase
};

// x(t) = xA * sin(a * t + xPhi)
// y(t) = yA * sin(b * t + yPhi)
// z(t) = zA * sin(c * t + zPhi)

const DEFAULT_PARAMS: LissajousParams = {
  xA: 1,
  yA: 1,
  zA: 1,
  a: 1,
  b: 1,
  c: 1,
  xPhi: 0,
  yPhi: 0,
  zPhi: 0,
};

const POINTS = 6000;
const SCALE = 2.0;

export class Lissajous3D {
  private vertices = new Float32Array(POINTS * 3);
  private geometry = new THREE.BufferGeometry();
  private material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.01 });
  private points = new THREE.Points(this.geometry, this.material);

  constructor(params: LissajousParams = DEFAULT_PARAMS) {
    this.points.name = 'Lissajous3D';
    this.plot(params);
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
  }

  private plot(params: LissajousParams) {
    const { xA, yA, zA, a, b, c, xPhi, yPhi, zPhi } = params;
    for (let i = 0; i < POINTS; i++) {
      const x = xA * Math.sin(a * i + xPhi);
      const y = yA * Math.sin(b * i + yPhi);
      const z = zA * Math.sin(c * i + zPhi);
      this.vertices[i * 3] = x * SCALE;
      this.vertices[i * 3 + 1] = y * SCALE;
      this.vertices[i * 3 + 2] = z * SCALE;
    }
  }

  public setMaterialColor(color: number) {
    this.material.color.set(color);
  }

  public setValues(params: LissajousParams) {
    this.plot(params);
    this.geometry.attributes.position.needsUpdate = true;
  }

  public getMesh() {
    return this.points;
  }
}

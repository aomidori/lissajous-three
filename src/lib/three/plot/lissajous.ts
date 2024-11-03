import * as THREE from 'three';

// Lissajous curve
// a: x-axis amplitude
// b: x-axis phase
// c: x-axis frequency
// n: y-axis frequency
// m: z-axis frequency
// d: y-axis and z-axis phase
// t: time

// x = sin(a * t + b) * cos(c * t + d)
// y = sin(n * t)
// z = cos(m * t)

type LissajousParams = {
  a: number;
  b: number;
  c: number;
  n: number;
  m: number;
  d: number;
};

const POINTS = 5000;

export class Lissajous3D {
  private vertices = new Float32Array(POINTS * 3);
  private geometry = new THREE.BufferGeometry();
  private material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  private line = new THREE.Line(this.geometry, this.material);

  constructor(params: LissajousParams) {
    this.line.name = 'Lissajous3D';
    this.plot(params);
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
  }

  private plot(params: LissajousParams) {
    const { a, b, c, n, m, d } = params;
    for (let i = 0; i < POINTS; i++) {
      const x = Math.sin(a * i + b) * Math.cos(c * i + d);
      const y = Math.sin(n * i);
      const z = Math.cos(m * i);
      this.vertices[i * 3] = x;
      this.vertices[i * 3 + 1] = y;
      this.vertices[i * 3 + 2] = z;
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
    return this.line;
  }
}

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

const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    u_color: { value: new THREE.Color(0x00ff00) },
    u_point_size: { value: 3.0 },
    u_glow_strength: { value: 2.5 },
  },
  transparent: true,
  depthWrite: false,
  vertexShader: /* glsl */`
    uniform float u_point_size;
    uniform vec3 u_color;
    varying vec3 vColor;
    void main() {
      gl_PointSize = u_point_size;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vColor = u_color;
    }
  `,
  fragmentShader: /* glsl */`
    varying vec3 vColor;
    uniform float u_glow_strength;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      float alpha = 1.0 - smoothstep(0.3, 0.5, dist) * u_glow_strength;
      gl_FragColor = vec4(vColor, alpha);
    }
  `,
});

export class Lissajous3D {
  private vertices = new Float32Array(POINTS * 3);
  private geometry = new THREE.BufferGeometry();
  private material = shaderMaterial;
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
    this.material.uniforms.u_color.value.set(color);
    this.material.needsUpdate = true;
  }

  public setValues(params: LissajousParams) {
    this.plot(params);
    this.geometry.attributes.position.needsUpdate = true;
  }

  public getMesh() {
    return this.points;
  }
}

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
	zPhi: 0
};

const POINTS = 18000;
const NOISES_PER_POINT = 4;

const shaderMaterial = new THREE.ShaderMaterial({
	uniforms: {
		u_color: { value: new THREE.Vector3(0.0, 1.0, 0.0) },
		u_point_size: { value: 2.0 },
		u_glow_strength: { value: 2.5 },
		u_time: { value: 0.0 }
	},
	transparent: true,
	depthWrite: false,
	blending: THREE.AdditiveBlending,
	vertexShader: /* glsl */ `
    uniform float u_point_size;
    void main() {
      gl_PointSize = u_point_size;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	fragmentShader: /* glsl */ `
    uniform vec3 u_color;
    uniform float u_glow_strength;
    uniform float u_time;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      vec3 black = vec3(0.0);
      float alpha = max(1.0 - smoothstep(0.3, 0.8, dist) * u_glow_strength, 0.0);
      float mix_strength = max(0.1 + 0.5 * sin(u_time * 0.004), alpha);
      gl_FragColor = vec4(mix(u_color, black, mix_strength), alpha);
    }
  `
});

export class Lissajous3D {
	private vertices!: Float32Array;
	private noisesVertices!: Float32Array;

	private geometry = new THREE.BufferGeometry();
	private material = shaderMaterial;
	private points = new THREE.Points(this.geometry, this.material);

	private scale = 2;
	private numberOfPoints = POINTS;

	private start = 0;

	constructor(params: LissajousParams = DEFAULT_PARAMS, mini?: boolean) {
		this.numberOfPoints = mini ? 5000 : POINTS;
		this.vertices = new Float32Array(
			this.numberOfPoints * 3 + this.numberOfPoints * 3 * NOISES_PER_POINT
		);
		this.noisesVertices = new Float32Array(this.numberOfPoints * 3 * NOISES_PER_POINT);
		this.points.name = 'lissajous';
		this.points.userData = {
			type: 'lissajous',
			params
		};

		this.plot(params);
		this.geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
	}

	private plot(params: LissajousParams) {
		const { xA, yA, zA, a, b, c, xPhi, yPhi, zPhi } = params;
		for (let i = 0; i < POINTS; i++) {
			const x = xA * Math.sin(a * i + xPhi);
			const y = yA * Math.sin(b * i + yPhi);
			const z = zA * Math.sin(c * i + zPhi);
			this.vertices[i * 3] = x * this.scale;
			this.vertices[i * 3 + 1] = y * this.scale;
			this.vertices[i * 3 + 2] = z * this.scale;
		}
		if (!this.start) {
			this.start = performance.now();
		}
		const time = performance.now() - this.start;
		this.material.uniforms.u_time.value = time;

		this.noisesVertices = Math.round(time / 50) % 2 ? this.getNoises() : this.noisesVertices;
		this.vertices.set(this.noisesVertices, this.numberOfPoints * 3);
	}

	private getNoises(): Float32Array {
		const noiseScale = this.scale * 0.025;
		const noises = new Float32Array(this.numberOfPoints * 3 * NOISES_PER_POINT);
		for (let i = 0; i < this.numberOfPoints; i++) {
			for (let j = 0; j < NOISES_PER_POINT; j++) {
				noises[i * 3 * NOISES_PER_POINT + j * 3] =
					Math.random() * noiseScale + this.vertices[i * 3];
				noises[i * 3 * NOISES_PER_POINT + j * 3 + 1] =
					Math.random() * noiseScale + this.vertices[i * 3 + 1];
				noises[i * 3 * NOISES_PER_POINT + j * 3 + 2] =
					Math.random() * noiseScale + this.vertices[i * 3 + 2];
			}
		}
		return noises;
	}

	public setMaterialColor(color: number) {
		const { r, g, b } = new THREE.Color(color);
		this.material.uniforms.u_color.value.set(r, g, b);
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

export const lissajousGroupItems: LissajousParams[] = [];
for (let i = 0; i < 16; i++) {
	const newItem = {
		xA: 1,
		yA: 1,
		zA: 1,
		a: Number(Math.random().toFixed(1)),
		b: Number(Math.random().toFixed(1)),
		c: Number(Math.random().toFixed(1)),
		xPhi: 0,
		yPhi: 0,
		zPhi: 0
	};
	lissajousGroupItems.push(newItem);
}

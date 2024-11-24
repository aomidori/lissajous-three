import type { PerspectiveCamera, Vector3 } from 'three';

export const canvasPositionToScreen = (
	position: Vector3,
	camera: PerspectiveCamera,
	canvasWidth: number,
	canvasHeight: number
): { x: number; y: number } => {
	const vector = position.project(camera);
	vector.x = ((vector.x + 1) * canvasWidth) / 2;
	vector.y = ((-vector.y + 1) * canvasHeight) / 2;
	return vector;
};

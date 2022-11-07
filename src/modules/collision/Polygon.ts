import type { Vertex } from './Vertex';

export class Polygon {
	vertices: Vertex[];
	edges: Vertex[];

	constructor(vertices: Vertex[], edges: Vertex[]) {
		this.vertices = vertices;
		this.edges = edges;
	}
}

import { Polygon } from './Polygon';
import type { Rectangle } from './Rectangle';
import { Vertex } from './Vertex';

export function workOutNewPoints(
	cx: number,
	cy: number,
	vx: number,
	vy: number,
	rotatedAngle: number
) {
	//From a rotated object
	//cx,cy are the centre coordinates, vx,vy is the point to be measured against the center point
	//Convert rotated angle into radians
	rotatedAngle = (rotatedAngle * Math.PI) / 180;
	const dx = vx - cx;
	const dy = vy - cy;
	const distance = Math.sqrt(dx * dx + dy * dy);
	const originalAngle = Math.atan2(dy, dx);
	const rotatedX = cx + distance * Math.cos(originalAngle + rotatedAngle);
	const rotatedY = cy + distance * Math.sin(originalAngle + rotatedAngle);

	return {
		x: rotatedX,
		y: rotatedY
	};
}

export function getRotatedSquareCoordinates(square: Rectangle) {
	const centerX = square.x + square.width / 2;
	const centerY = square.y + square.height / 2;
	//Work out the new locations
	const topLeft = workOutNewPoints(centerX, centerY, square.x, square.y, square.rotation);
	const topRight = workOutNewPoints(
		centerX,
		centerY,
		square.x + square.width,
		square.y,
		square.rotation
	);
	const bottomLeft = workOutNewPoints(
		centerX,
		centerY,
		square.x,
		square.y + square.height,
		square.rotation
	);
	const bottomRight = workOutNewPoints(
		centerX,
		centerY,
		square.x + square.width,
		square.y + square.height,
		square.rotation
	);
	return {
		tl: topLeft,
		tr: topRight,
		bl: bottomLeft,
		br: bottomRight
	};
}

// The actual Seperate Axis Theorum function
function sat(polygonA: Polygon, polygonB: Polygon) {
	let perpendicularLine = null;
	let dot = 0;
	const perpendicularStack = [];
	let amin: number | null = null;
	let amax: number | null = null;
	let bmin: number | null = null;
	let bmax: number | null = null;

	// Work out all perpendicular vectors on each edge for polygonA
	for (let i = 0; i < polygonA.edges.length; i++) {
		perpendicularLine = new Vertex(-polygonA.edges[i].y, polygonA.edges[i].x);
		perpendicularStack.push(perpendicularLine);
	}
	//Work out all perpendicular vectors on each edge for polygonB
	for (let i = 0; i < polygonB.edges.length; i++) {
		perpendicularLine = new Vertex(-polygonB.edges[i].y, polygonB.edges[i].x);
		perpendicularStack.push(perpendicularLine);
	}
	//Loop through each perpendicular vector for both polygons
	for (let i = 0; i < perpendicularStack.length; i++) {
		//These dot products will return different values each time
		amin = null;
		amax = null;
		bmin = null;
		bmax = null;
		/*Work out all of the dot products for all of the vertices in PolygonA against the perpendicular vector
       that is currently being looped through*/
		for (let j = 0; j < polygonA.vertices.length; j++) {
			dot =
				polygonA.vertices[j].x * perpendicularStack[i].x +
				polygonA.vertices[j].y * perpendicularStack[i].y;
			//Then find the dot products with the highest and lowest values from polygonA.
			if (amax === null || dot > amax) {
				amax = dot;
			}
			if (amin === null || dot < amin) {
				amin = dot;
			}
		}
		/*Work out all of the dot products for all of the vertices in PolygonB against the perpendicular vector
       that is currently being looped through*/
		for (let j = 0; j < polygonB.vertices.length; j++) {
			dot =
				polygonB.vertices[j].x * perpendicularStack[i].x +
				polygonB.vertices[j].y * perpendicularStack[i].y;
			//Then find the dot products with the highest and lowest values from polygonB.
			if (bmax === null || dot > bmax) {
				bmax = dot;
			}
			if (bmin === null || dot < bmin) {
				bmin = dot;
			}
		}
		// If there is no gap between the dot products projection then we will continue onto evaluating the next perpendicular edge.
		if (
			amin !== null &&
			amax !== null &&
			bmin !== null &&
			bmax !== null &&
			((amin < bmax && amin > bmin) || (bmin < amax && bmin > amin))
		) {
			continue;
		}
		// Otherwise, we know that there is no collision for definite.
		else {
			return false;
		}
	}
	/*If we have gotten this far. Where we have looped through all of the perpendicular edges and not a single one of there projections had
  a gap in them. Then we know that the 2 polygons are colliding for definite then.*/
	return true;
}

export function detectRectangleCollision(rectA: Rectangle, rectB: Rectangle) {
	// Get rotated coordinates for both rectangles
	const rectAR = getRotatedSquareCoordinates(rectA);
	const rectBR = getRotatedSquareCoordinates(rectB);

	// Vertices & Edges are listed in clockwise order. Starting from the top right
	const thisTankVertices = [
		new Vertex(rectAR.tr.x, rectAR.tr.y),
		new Vertex(rectAR.br.x, rectAR.br.y),
		new Vertex(rectAR.bl.x, rectAR.bl.y),
		new Vertex(rectAR.tl.x, rectAR.tl.y)
	];
	const thisTankEdges = [
		new Vertex(rectAR.br.x - rectAR.tr.x, rectAR.br.y - rectAR.tr.y),
		new Vertex(rectAR.bl.x - rectAR.br.x, rectAR.bl.y - rectAR.br.y),
		new Vertex(rectAR.tl.x - rectAR.bl.x, rectAR.tl.y - rectAR.bl.y),
		new Vertex(rectAR.tr.x - rectAR.tl.x, rectAR.tr.y - rectAR.tl.y)
	];
	const otherTankVertices = [
		new Vertex(rectBR.tr.x, rectBR.tr.y),
		new Vertex(rectBR.br.x, rectBR.br.y),
		new Vertex(rectBR.bl.x, rectBR.bl.y),
		new Vertex(rectBR.tl.x, rectBR.tl.y)
	];
	const otherTankEdges = [
		new Vertex(rectBR.br.x - rectBR.tr.x, rectBR.br.y - rectBR.tr.y),
		new Vertex(rectBR.bl.x - rectBR.br.x, rectBR.bl.y - rectBR.br.y),
		new Vertex(rectBR.tl.x - rectBR.bl.x, rectBR.tl.y - rectBR.bl.y),
		new Vertex(rectBR.tr.x - rectBR.tl.x, rectBR.tr.y - rectBR.tl.y)
	];
	const rectAPolygon = new Polygon(thisTankVertices, thisTankEdges);
	const rectBPolygon = new Polygon(otherTankVertices, otherTankEdges);

	if (sat(rectAPolygon, rectBPolygon)) {
		return true;
	} else {
		// Because we are working with vertices and edges. This algorithm does not cover the normal un-rotated rectangle
		// algorithm which just deals with sides
		if (rectA.rotation === 0 && rectB.rotation === 0) {
			if (
				!(
					rectA.x > rectB.x + rectB.width ||
					rectA.x + rectA.width < rectB.x ||
					rectA.y > rectB.y + rectB.height ||
					rectA.y + rectA.height < rectB.y
				)
			) {
				return true;
			}
		}
	}

	return false;
}

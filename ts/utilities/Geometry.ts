/*************************************************************
 *
 *  Copyright (c) 2022 Sandeep Jain
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  Contains the windowToCanvas function, the Geometry class, and
 * 				  the Coordinates type definition
 *
 * @author Sandeep Jain
 */


/*****************************************************************/
/**
 * The canvas is a rectangular area which sits on the browser window, and on which all 
 * kinds of geometrical operations can be performed. The windowToCanvas function
 * takes as input the x and y values corresponding to the coordinates of the mouse
 * with respect to the browser window, and returns a Coordinates type (which
 * is just a container for an x value and a y value). The returned value contains
 * the coordinates of the mouse with respect to the rectangular canvas area.
 * 
 * @param {HTMLCanvasElement} canvas The HTML canvas
 * @param {number} x The x coordinate with respect to the browser window
 * @param {number} y The y coordinate with respect to the browser window
 * @returns {Coordinates} The x and y coordinates with respect to the canvas element
 */
export function windowToCanvas(canvas: HTMLCanvasElement, x: number, y: number): Coordinates {
	const bounding_box = canvas.getBoundingClientRect();
	return { x: x - bounding_box.left * (canvas.width / bounding_box.width),
			 y: y - bounding_box.top * (canvas.height / bounding_box.height)
	};
}

/*****************************************************************/
/**
 * The Geometry class is responsible for basic geometrical operations
 */
export class Geometry {

	/**
	 * The context object is responsible for all drawing operations on the canvas
	 */
	private context: CanvasRenderingContext2D;

	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */
	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
	}

	/**
	 * Draws a line from a specified starting point to a specified ending point, of a 
	 * specified color and width.
	 * 
	 * @param {number} startX The x coordinate of the starting point of the line
	 * @param {number} startY The y coordinate of the starting point of the line
	 * @param {number} endX The x coordinate of the ending point of the line
	 * @param {number} endY The y coordinate of the ending point of the line
	 * @param {string} strokeStyle The line color
	 * @param {number} lineWidth The width of the line
	 */
	public drawLine(startX: number, startY: number, endX: number, endY: number, strokeStyle: string, 
		            lineWidth: number): void {
		this.context.beginPath();
		this.context.lineWidth = lineWidth;
		this.context.strokeStyle = strokeStyle;
		this.context.moveTo(startX, startY);
		this.context.lineTo(endX, endY);
		this.context.stroke();
	}

	/**
	 * Draws a circle with a specified center, a specified radius, a specified internal color,
	 * a specifed outline color, and a specified outline width.
	 * 
	 * @param {number} centerX The x coordinate of the center
	 * @param {number} centerY The y coordinate of the center
	 * @param {number} radius The radius of the circle
	 * @param {string} fillStyle The internal color
	 * @param {string} strokeStyle The outline color
	 * @param {number} strokeWidth The outline width
	 */
	public drawCircle(centerX: number, centerY: number, radius: number, fillStyle: string, strokeStyle: string, 
		       strokeWidth: number): void {
		// draw outline of circle
		this.context.beginPath();
		this.context.lineWidth = strokeWidth;
		this.context.strokeStyle = strokeStyle;
		this.context.arc(centerX, centerY, radius, 0, Math.PI*2, false);
		this.context.stroke();

		// fill circle with color
		this.context.beginPath();
		this.context.fillStyle = fillStyle;
		this.context.arc(centerX, centerY, radius, 0, Math.PI*2, false);
		this.context.fill();
	}

	/**
	 * Returns true if a point specified by pointX, pointY lies within the circle specified
	 * by centerX, centerY, circleRadius, and false otherwise.
	 * 
	 * @param {number} pointX The x coordinate of the point
	 * @param {number} pointY The y coordinate of the point
	 * @param {number} centerX The x coordinate of the center of the circle
	 * @param {number} centerY The y coordinate of the center of the circle
	 * @param {number} circleRadius The radius of the circle
	 * @returns {boolean} True if the point is within the circle, false otherwise
	 */
	public pointIsWithinCircle(pointX: number, pointY: number, centerX: number, centerY: number, 
		                circleRadius: number): boolean {
		let distanceX = pointX - centerX;
		let distanceY = pointY - centerY;
		if( Math.sqrt( distanceX*distanceX + distanceY*distanceY) < circleRadius ) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns true if the point specified by pointX, pointY lies on the line going from
	 * startX, startY to endX, endY, false otherwise. The slopeMargin specifies how close
	 * the slope of the line should be to the slope of the other line from the point to the
	 * beginning of the line. The cutOffDistance specifies the distance from both ends of
	 * the line, to which the pointIsOnTheLine function should work.
	 * 
	 * @param {number} pointX The x coordinate of the point
	 * @param {number} pointY The y coordinate of the point
	 * @param {number} startX The x coordinate of the start of the line
	 * @param {number} startY The y coordinate of the start of the line
	 * @param {number} endX The x coordinate of the end of the line
	 * @param {number} endY The y coordinate of the end of the line
	 * @param {number} slopeMargin The absolute difference between the slope of the line and the slope of the
	 *                    point to the beginning of the line
	 * @param {number} cutOffDistance The distance from the start and the end of the line, to which this function
	 *                       should work
	 * @returns {boolean} True if the point is on the line, false otherwise
	 */

	public pointIsOnTheLine(pointX: number, pointY: number, startX: number, startY: number, endX: number, 
		             endY: number, slopeMargin: number, cutOffDistance: number): boolean {
		let lineSlope = (startY - endY)/(endX - startX);
		let pointSlope = (startY - pointY)/(pointX - startX);
		let distanceFromStart = Math.sqrt( (pointX - startX)**2 + (pointY - startY)**2 );
		let distanceFromEnd = Math.sqrt( (pointX - endX)**2 + (pointY - endY)**2 );

		if( Math.abs(lineSlope - pointSlope) < slopeMargin && distanceFromStart > cutOffDistance && distanceFromEnd > cutOffDistance) {
			if(lineSlope == 0) {
				if(pointX <= endX && pointX >= startX) {
					return true;
				}
			} else if( lineSlope > 0 ) {
				if(pointY <= startY && pointY >= endY && pointX <= endX && pointX >= startX) {
					return true;
				}
			} else {
				if (pointY >= startY && pointY <= endY && pointX <= endX && pointX >= startX) {
					return true;
				}
			}
		}
		return false;
	}
}

/**
 * A container for the x and y geometrical coordinates of a point.
 */
export type Coordinates = {
	/**
	 * The x-coordinate
	 */
	x: number;

	/**
	 * The y-coordinate
	 */
	y: number;
}

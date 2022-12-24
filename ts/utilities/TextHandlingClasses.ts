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
 * @fileoverview  Contains the BoundingRectangle and TextHandler classes
 *
 * @author Sandeep Jain
 */

import {Coordinates} from './Geometry.js';
import {Calculator} from './Calculator.js';

/*****************************************************************/
/**
 * The BoundingRectangle class draws and fills straight and rounded rectangles. 
 * These rectangles serve as the background for the appropriate text, in the
 * context of a neural network diagram
 */
export class BoundingRectangle {

	/**
	 * The context object is responsible for all drawing operations on the canvas
	 */
	protected context: CanvasRenderingContext2D;

	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */
	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
	}

	/**
	 * Fills a straight rectangle having the specified parameters, with a color defined by fillStyle.
	 * 
	 * @param {Coordinates} centerCoordinates The coordinates of the center of the rectangle
	 * @param {number} width The width of the rectangle
	 * @param {number} height The height of the rectangle
	 * @param {string} fillStyle The color of the rectangle
	 */
	public fillRectangle(centerCoordinates: Coordinates, width: number, height: number, fillStyle: string): void {
		this.context.save();
		this.context.fillStyle = fillStyle;
		this.context.translate(centerCoordinates.x, centerCoordinates.y);
		this.context.fillRect(- width/2, - height/2, width, height);
		this.context.restore();
	}

	/**
	 * Draws and fills a rounded rectangle having the specified parameters
	 * 
	 * @param {number} cornerX The x-coordinate of the top left corner of the rectangle
	 * @param {number} cornerY The y-coordinate of the top left corner of the rectangle
	 * @param {number} width The width of the rectangle
	 * @param {number} height The height of the rectangle
	 * @param {number} cornerRadius The radius of each corner of the rounded rectangle
	 * @param {string} strokeStyle The color of the outline of the rectangle
	 * @param {string} fillStyle The color of the interior of the rectangle
	 * @param {number} lineWidth The width of the outline of the rectangle
	 */
	public drawRoundedRectangle(cornerX: number, cornerY: number, width: number, height: number, 
		                 cornerRadius: number, strokeStyle: string, fillStyle: string, lineWidth: number): void {
	   this.context.save()
	   this.context.beginPath();

	   this.createRoundedRectangle(cornerX, cornerY, width, height, cornerRadius);

	   this.context.strokeStyle = strokeStyle;
	   this.context.fillStyle = fillStyle;
	   this.context.lineWidth = lineWidth;

	   this.context.stroke();
	   this.context.fill();
	   this.context.restore();
	}

	/**
	 * This function is used by drawRoundedRectangle to create the rectangle within the context.
	 * drawRoundedRectangle then draws and fills it.
	 * 
	 * @param {number} cornerX The x-coordinate of the top left corner of the rectangle
	 * @param {number} cornerY The y-coordinate of the top left corner of the rectangle
	 * @param {number} width The width of the rectangle
	 * @param {number} height The height of the rectangle
	 * @param {number} cornerRadius The radius of each corner of the rounded rectangle
	 */
	private createRoundedRectangle(cornerX: number, cornerY: number, width: number, height: number, cornerRadius: number): void {
	   if (width > 0) this.context.moveTo(cornerX + cornerRadius, cornerY);
	   else           this.context.moveTo(cornerX - cornerRadius, cornerY);

	   this.context.arcTo(cornerX + width, cornerY,
	                 cornerX + width, cornerY + height,
	                 cornerRadius);

	   this.context.arcTo(cornerX + width, cornerY + height,
	                 cornerX, cornerY + height,
	                 cornerRadius);

	   this.context.arcTo(cornerX, cornerY + height,
	                 cornerX, cornerY,
	                 cornerRadius);

	   if (width > 0) {
	      this.context.arcTo(cornerX, cornerY,
	                    cornerX + cornerRadius, cornerY,
	                    cornerRadius);
	   }
	   else {
	      this.context.arcTo(cornerX, cornerY,
	                    cornerX - cornerRadius, cornerY,
	                    cornerRadius);
	   }
	}
}

/*****************************************************************/
/**
 * This abstract class serves as the base for all the TextHandlers in the 
 * program. The TextHandler classes are responsible for displaying the text
 * associated with each of the elements of a neural network.
 */
export abstract class TextHandler {

	/**
	 * The context object is responsible for all drawing operations on the canvas
	 */
	protected context: CanvasRenderingContext2D;

	/**
	 * The Calculator implements calculations to be done on numbers or arrays
	 */
	protected calculator: Calculator;

	/**
	 * The BoundingRectangle implements straight or rounded rectangles, to serve
	 * as the background for the appropriate text
	 */
	protected boundingShape: BoundingRectangle;

	/**
	 * @param {CanvasRenderingContext2D} context Resposible for all 2 dimensional drawing operations     
	 * @constructor
	 */
	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
		this.calculator = new Calculator();
		this.boundingShape = new BoundingRectangle(context);
	}

	/**
	 * Draws a specified string, at the specified coordinates, with the alignment  being one of "left",
	 * "center" and "right", and the baseline being one of "top", "middle", and "bottom"
	 * 
	 * @param {string} text 
	 * @param {Coordinates} coordinates 
	 * @param {CanvasTextAlign} alignment 
	 * @param {CanvasTextBaseline} baseline 
	 */
	public drawText(text: string, coordinates: Coordinates, alignment: CanvasTextAlign, baseline: CanvasTextBaseline): void {
		this.context.textAlign = alignment as CanvasTextAlign;
		this.context.textBaseline = baseline as CanvasTextBaseline;
		this.context.fillText(text, coordinates.x, coordinates.y)
	}

	/**
	 * Draws an array of strings from top to bottom, at the specified coordinates
	 * (the specified coordinates being at the top left of the drawn array).
	 * 
	 * @param {string[]} text 
	 * @param {Coordinates} coordinates 
	 */
	public drawPopupText(text: string[], coordinates: Coordinates): void {
		let height = this.context.measureText('M').width + 8;
		var yPosition: number, adjustedCoordinates: Coordinates;
		for(var i=0; i < text.length; i++) {
			yPosition = coordinates.y + i*height;
			adjustedCoordinates = {x:coordinates.x, y: yPosition};
			this.drawText(text[i], adjustedCoordinates, "left", "middle");
		}
	}

	/**
	 * Given two numerical arrays firstArray and secondArray, returns a description of the dot
	 * product of the two arrays as follows. If the firstArray is [1,2], and the second array
	 * is [3,4], then this function returns an array of strings of the form:
	 * 
	 * ["1 x 3 = 3",
	 *  "2 x 4 = 8",
	 *  "3 + 8 = 11"]
	 * 
	 * @param {number[]} firstArray The first array of numbers
	 * @param {number[]} secondArray The second array of numbers
	 * @returns {string[]} A description of the dot product as specified above
	 */

	public getDotProductAsStringArray(firstArray: number[], secondArray: number[]): string[] {
		let textStringArray = new Array(firstArray.length);
		let products = new Array(firstArray.length);

		// Given firstArray = [.234, .567] and secondArray = [.456, .678], create an array textStringArray of the form
		// [".234 x .456 = .107", ".567 x .678 = .384"]
		for(var i=0; i < firstArray.length; i++) {
			products[i] = this.calculator.roundDecimalTo(firstArray[i]*secondArray[i], 3);
			textStringArray[i] = firstArray[i] + " x " + secondArray[i] + " = " + products[i];
		}

		// Given products[i] = [.107, .384], create a string sumString of the form ".107 + .384 = .491"
		var sumString = "";
		for(var i=0; i < products.length; i++) {
			sumString += products[i];
			if(i < products.length - 1) {
				sumString += " + ";
			}
		}

		// Append the value corresponding to the dot product to the textStringArray
		sumString += " = " + this.calculator.roundDecimalTo(this.calculator.dotProduct(firstArray,secondArray), 3);
		if(firstArray.length > 0) {
			textStringArray[firstArray.length] = sumString;
		}

		return textStringArray;
	}

	/**
	 * Given a string, returns that same string as superscripts, using Unicode
	 * characters
	 * 
	 * @param {string} characters The candidate string 
	 * @returns {string} The string in unicode, as superscript characters
	 */
	public getStringAsUnicodeSuperscript(characters: string): string {
		let asUnicode = "";
		for(var i=0; i < characters.length; i++) {
			asUnicode = asUnicode + this.asUnicodeSuperscript(characters[i]);
		}
		return asUnicode;
	}

	/**
	 * Given a character, returns that character as a superscript, using Unicode
	 * 
	 * @param {string} character The candidate character 
	 * @returns {string} The character in unicode, as a superscript
	 */
	public asUnicodeSuperscript(character: string): string {
		switch(character) {
			case '-': return '\u207B';
			case '(': return '\u207D';
			case ')': return '\u207E';
			case '.': return '\u22C5';

			case '0': return '\u2070';
			case '1': return '\u00B9';
			case '2': return '\u00B2';
			case '3': return '\u00B3';
			case '4': return '\u2074';
			case '5': return '\u2075';
			case '6': return '\u2076';
			case '7': return '\u2077';
			case '8': return '\u2078';
			case '9': return '\u2079';
		}
		return 'z';
	}
}

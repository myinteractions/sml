
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
 * @fileoverview  Contains the BasicWeightTextHandler, BasicNeuronTextHandler,
 *                and BasicNeuralNetworkTextHandler classes. These basic text handler
 *                classes are responsible for displaying all the text associated with
 *                a  basic neural network. For an explanation of what a basic neural
 * 				  network is, see the BasicNeuralNetworkElements.ts file.
 *
 * @author Sandeep Jain
 */

import {Geometry, Coordinates} from '../utilities/Geometry.js';
import {TextHandler} from '../utilities/TextHandlingClasses.js';

export const MAIN_TEXT_FONT = "15px Helvetica";
export const WEIGHT_POPUP_FILL = "mintcream";
export const WEIGHT_POPUP_STROKE = "deepskyblue";
export const WEIGHT_POPUP_LINE_WIDTH = 1;
const SUPERSCRIPT_TEXT_FONT = "11px Helvetica";
const NEURON_INTERNAL_FONT = "19px Helvetica";
const NEURAL_NETWORK_FONT = "22px Helvetica";
const WEIGHT_TEXT_RECTANGLE_COLOR = "lightgray";
const TEXT_COLOR = "dimgray";

/*****************************************************************/
/**
 * The BasicWeightTextHandler class is responsible for displaying the text and
 * text containing rectangles associated with a BasicWeight (defined in 
 * BasicNeuralNetworkElements.ts). There are 2 types of weight display. One is
 * a static text which sits on the weight, and contains the value of the
 * weight. The other is a dynamic text which pops up whenever the user hovers
 * over the weight, and which describes the multiplication operation being
 * performed by the weight. 
 */
export class BasicWeightTextHandler extends TextHandler {

	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */
	constructor(context: CanvasRenderingContext2D) {
		super(context);
	}

	/**
	 * Draws the value of the weight inside a fitting rectangle, that is sitting on the line
	 * corresponding to the weight.
	 * 
	 * @param {number} value The value of the weight
	 * @param {number} startX The x coordinate of the starting point of the weight line
	 * @param {number} startY The y coordinate of the starting point of the weight line
	 * @param {number} endX The x coordinate of the ending point of the weight line
	 * @param {number} endY the y coordinate of the ending point of the weight line
	 */
	public drawWeightText(value: number, startX: number, startY: number, endX: number, endY: number): void {
		this.context.font = MAIN_TEXT_FONT;
		let roundedValue = this.calculator.roundDecimalTo(value,3);
		let xLocation = startX + (endX - startX)/4;
		let yLocation = startY - (startY - endY)/4;
		let coordinates = {x: xLocation, y: yLocation};
		this.drawBoundingRectangle(roundedValue, coordinates);
		this.context.fillStyle = TEXT_COLOR;
		this.drawText(roundedValue.toString(), coordinates, "center", "middle");
	}

	/**
	 * Draws a rounded rectangle containing the text 
	 * 
	 * Inflowing value = ____
	 * Weight value = ____
	 * Outflowing value =
	 * ____ x ____ = ____
	 * 
	 * This rectangle pops us when the user hovers over the weight with his mouse.
	 * The logic for making the popup rectangle appear and disappear is in the BasicNeuron
	 * class in the file BasicNeuralNetworkElements.ts.
	 * 
	 * @param {number} mouseX The x coordinate of the mouse position
	 * @param {number} mouseY The y coordinate of the mouse positiion
	 * @param {number} weightValue The numerical value of the weight
	 * @param {number} previousNeuronOutput The numerical value of the output of the neuron connecting in to the weight
	 */
	public drawWeightPopup(mouseX: number, mouseY: number, weightValue: number, previousNeuronOutput: number): void {
		let coordinates = {x: mouseX, y: mouseY};
		let outflowingValue = this.calculator.roundDecimalTo(previousNeuronOutput * weightValue, 3);
		let roundedWeight = this.calculator.roundDecimalTo(weightValue, 3);
		let textTop = "Inflowing value = " + previousNeuronOutput;
		let textMiddle1 =  "Weight value = " + roundedWeight;
		let textMiddle2 = "Outflowing value = "
		let textBottom = " " + previousNeuronOutput + " x " + roundedWeight + " " + " = " + outflowingValue;
		let text = [textTop, textMiddle1, textMiddle2, textBottom];
		this.drawPopupBoundingRectangle(text, coordinates);
		this.drawWeightPopupText(text, coordinates);
	}

	/**
	 * Draws the rounded rectangle which is supposed to contain the weight popup text when
	 * a user hovers over the weight.
	 * 
	 * @param {string[]} text The array of strings corresponding to the text. This parameter is 
	 *   					  passed to size the rectangle
	 * @param {Coordinates} coordinates The coordinates of the top left corner of the rectangle
	 */
	protected drawPopupBoundingRectangle(text: string[], coordinates: Coordinates): void {
		this.context.font = MAIN_TEXT_FONT;
		let maxLengthIndex = this.calculator.getStringMaxLengthIndex(text);
		let textMetrics = this.context.measureText(text[maxLengthIndex]);
		let width = textMetrics.width + 28;
		let height = (this.context.measureText('M').width + 8) * text.length + 12;
		this.boundingShape.drawRoundedRectangle(coordinates.x, coordinates.y, width, height, 5, WEIGHT_POPUP_STROKE,
			                                                                                         WEIGHT_POPUP_FILL, WEIGHT_POPUP_LINE_WIDTH);
	}

	/**
	 * Draws the actual text which is supposed to be displayed when the user hovers over the
	 * weight. This text is drawn within the rectangle.
	 * 
	 * @param {string[]} text The array of strings corresponding to the text. 
	 * @param {Coordinates} coordinates The coordinates of the top left corner of the rectangle containing
	 * 									the text
	 */
	protected  drawWeightPopupText(text: string[], coordinates: Coordinates): void {
		this.context.font = MAIN_TEXT_FONT;
		this.context.fillStyle = TEXT_COLOR;
		let textCoordinates = {x: coordinates.x + 10, y: coordinates.y + 18};
		this.drawPopupText(text, textCoordinates);
	}

	/**
	 * Draws the static rectangle containing the text which is supposed to contain the value
	 * of the weight.
	 * 
	 * @param {number} value The value of the weight
	 * @param {Coordinates} coordinates The coordinates of the rectangle 
	 */
	private drawBoundingRectangle(value: number, coordinates: Coordinates): void {
		let textMetrics = this.context.measureText(value.toString());
		let width = textMetrics.width + 2;
		let height = this.context.measureText('M').width + 2;
		this.boundingShape.fillRectangle(coordinates, width, height, WEIGHT_TEXT_RECTANGLE_COLOR);
	}
}

export const NEURON_POPUP_STROKE = "tan";
export const NEURON_POPUP_LINE_WIDTH = 1;
export const INPUT_LAYER_NEURON_FILL_STYLE = 'papayawhip';
const NEURON_POPUP_FILL = "ivory";

/*****************************************************************/
/**
 * The BasicNeuronTextHandler class is responsible for displaying the text 
 * associated with a BasicNeuron (defined in the file BasicNeuralNetworkElements.ts).
 * There are two types of text display. One is the numerical value being output
 * by the neuron, which sits inside the circular neuron. The second is the
 * computation performed by the neuron to arrive at the output, which pops up
 * in a rounded rectangle whenever the user hovers over the neuron with his mouse.
 */
export class BasicNeuronTextHandler extends TextHandler {
	
	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */	
	constructor(context: CanvasRenderingContext2D) {
		super(context);
	}

	/**
	 * Draws the value being output by the neuron, inside the neuron.
	 * 
	 * @param {number} value The value being output by the neuron 
	 * @param {number} centerX The x coordinate of the center of the neuron
	 * @param {number} centerY The y coordinate of the center of the neuron
	 */
	public drawNeuronInternalText(value: number, centerX: number, centerY: number): void {
		this.context.font = NEURON_INTERNAL_FONT;
		this.context.fillStyle = TEXT_COLOR;
		let coordinates = {x: centerX, y: centerY};
		this.drawText(value.toString(), coordinates, "center", "middle");
	}

	/**
	 * Draws the calculation being performed by the neuron to arrive at the neuron
	 * output from the neuron inputs, inside a rounded rectangle which pops up
	 * whenever the user hovers over the neuron with his mouse.
	 * 
	 * @param {number} centerX The x coordinate of the center of the neuron 
	 * @param {number} centerY The y coordinate of the center of the neuron
	 * @param {number} neuronRadius The radius of the neuron
	 * @param {number[]} incomingWeightValuesArray The array of weight values feeding into the neuron
	 * @param {number[]} previousNeuronOutputsArray The output values of the neurons in the layer prior 
	 * 												to this neuron. A dot product between these values
	 * 												and the incoming weight values gives the value feeding
	 * 												this neuron. This incoming value is then put through
	 * 												a sigmoid function to give the output of this neuron.
	 */
	public drawNeuronPopup(centerX: number, centerY: number, neuronRadius: number, 
		            incomingWeightValuesArray: number[], previousNeuronOutputsArray: number[]): void {
		let coordinates = {x: centerX + neuronRadius + 15, y: centerY};
		let sum = this.calculator.dotProduct(incomingWeightValuesArray, previousNeuronOutputsArray);
		sum = this.calculator.roundDecimalTo(sum, 3);
		let sumString = "-(" + sum + ")";
		let text = this.getDotProductAsStringArray(previousNeuronOutputsArray, incomingWeightValuesArray);
		let output = this.calculator.roundDecimalTo( this.calculator.sigmoid(sum), 2);
		
		/* This outputTextString is not actually displayed as part of the popup. It is only
		   used to compute the width of the popup bounding rectangle. */
		let outputTextString = this.getOutputTextString(sumString, output);
		text[text.length] = outputTextString;
		
		this.drawPopupBoundingRectangle(text, coordinates);
		text[text.length-1] = "";
		this.drawNeuronPopupText(text, coordinates);
		this.drawOutputTextString(text, sumString, output, coordinates);
	}

	/**
	 * The value for the output of the neurons in the first layer of the basic neural network is just
	 * a random number, which is displayed in a pop up rounded rectangle. The output of each of these
	 * neurons is actually the input to the neural network because the first layer neurons do not
	 * do anything to the input to get the output.
	 * 
	 * @param {number} centerX The x coordinate of the center of the neuron
	 * @param {number} centerY The y coordinate of the center of the neuron
	 * @param {number} neuronRadius The radius of the neuron
	 * @param {number} outputValue The value displayed as the output of the neuron, which is actually an
	 * 								input to the neural network as a whole
	 */
	public drawFirstLayerNeuronPopup(centerX: number, centerY: number, neuronRadius: number, outputValue: number): void {
		this.context.font = MAIN_TEXT_FONT;
		let coordinates = {x: centerX + neuronRadius + 15, y: centerY};
		let textString = "Input value = " + outputValue;
		this.drawFirstLayerPopupBoundingRectangle(textString, coordinates);
		this.drawText(textString, coordinates, "left", "middle");
	}
 
	/**
	 * Draws a rounded rectangle which pops up whenever the user's mouse hovers over the neuron,
	 * inside which the descsriptive text is drawn.
	 * 
	 * @param {string} text The array of strings representing the text to be drawn inside the rectangle,
	 * 						passed as a parameter to compute the dimensions of the rectangle
	 * @param {Coordinates} coordinates The coordinates of the bounding rectangle
	 */
	protected drawPopupBoundingRectangle(text: string[], coordinates: Coordinates): void {
		this.context.font = MAIN_TEXT_FONT;
		let maxLengthIndex = this.calculator.getStringMaxLengthIndex(text);
		let textMetrics = this.context.measureText(text[maxLengthIndex]);
		let width = textMetrics.width + 25;
		let height = (this.context.measureText('M').width + 8) * text.length + 12;
		this.boundingShape.drawRoundedRectangle(coordinates.x-5, coordinates.y-14, width, height, 5, NEURON_POPUP_STROKE, NEURON_POPUP_FILL,
			                                                                                           NEURON_POPUP_LINE_WIDTH);
	}

	/**
	 * Draws the string corresponding to the calculation of the output of the neuron from the sum value
	 * feeding into it: 1/1 + e^-sum. A whole method is needed for this because the "sum" needs to be
	 * raised upwards in superscript format.
	 * 
	 * @param {string[]} text The array of strings being displayed by the neuron popup
	 * @param {string} sum The value of the sum, as a string
	 * @param {number} output The final output of the neuron 
	 * @param {Coordinates} coordinates The coordinates of the display point
	 */
	private drawOutputTextString(text: string[], sum: string, output: number, 
		                 coordinates: Coordinates): void {
		let height = this.context.measureText('M').width + 8;
		coordinates.y = coordinates.y + (height * text.length) - height;
		let outputTextStringFirstHalf = "1 / ( 1 + e";
		this.drawText(outputTextStringFirstHalf, coordinates, "left", "middle");
		coordinates.x = coordinates.x + this.context.measureText(outputTextStringFirstHalf).width;
		this.context.font = SUPERSCRIPT_TEXT_FONT;
		this.drawText(sum, coordinates, "left", "bottom");
		coordinates.x = coordinates.x + this.context.measureText(sum).width;
		this.context.font = MAIN_TEXT_FONT;
		let outputTextStringSecondHalf = " ) = " + output.toString();
		this.drawText(outputTextStringSecondHalf, coordinates, "left", "middle");
	}

	/**
	 * Returns the output text string in plain (not superscript) format, for the purpose of
	 * computing the width of the bounding rectangle.
	 * 
	 * @param {string} sum The total sum value feeding in to the neuron, as a string 
	 * @param {number} output The output value of the neuron
	 * @returns {string} The full sum string
	 */
	private getOutputTextString(sum: string, output: number): string {
		let returnValue = "1 / ( 1 + e" + sum + " )" + " = " + output.toString();
		return returnValue;
	}

	/**
	 * Draws the array of strings corresponding to the text that pops up inside the rounded
	 * bounding rectangle when the user's mouse hovers over the neuron.
	 * 
	 * @param {string[]} text The text to be displayed 
	 * @param {Coordinates} coordinates The coordinates at which to display the text
	 */
	private drawNeuronPopupText(text: string[], coordinates: Coordinates): void {
		this.context.font = MAIN_TEXT_FONT;
		this.context.fillStyle = TEXT_COLOR;
		this.drawPopupText(text, coordinates);
	}

	/**
	 * Draws the rounded bounding rectangle which pops up when the user's mouse hovers over a
	 * neuron in the first layer of the neural network.
	 * 
	 * @param {string} textString The string to be enclosed in the bounding rectangle. Passed as a parameter
	 * 							  to compute the dimensions of the rectangle.
	 * @param {Coordinates} coordinates The coordinates at which to display the rectangle
	 */
	private drawFirstLayerPopupBoundingRectangle(textString: string, coordinates: Coordinates): void {
		let textMetrics = this.context.measureText(textString);
		let width = textMetrics.width + 20;
		let height = this.context.measureText('M').width + 14;
		this.boundingShape.drawRoundedRectangle(coordinates.x-5, coordinates.y-12, width, height, 5, 
			                   NEURON_POPUP_STROKE, INPUT_LAYER_NEURON_FILL_STYLE, NEURON_POPUP_LINE_WIDTH);
	}
}

/*****************************************************************/
/**
 * The BasicNeuralNetworkTextHandler class is responsible for displaying the text 
 * associated with a BasicNeuralNetwork as a whole. In the context of a basic neural network,
 * this consists of the text "Input Layer", "Hidden Layers", and "Output Layer", along with
 * the dividing lines between the layers.
 */
export class BasicNeuralNetworkTextHandler extends TextHandler {
	
	/**
	 * The Geometry class is responsible for basic geometrical operations, such as drawing lines
	 */
	private geometry: Geometry;
	
	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */
	constructor(context: CanvasRenderingContext2D) {
		super(context);
        this.geometry = new Geometry(context);
	}

	/**
	 * Displays all the text associated with a basic neural network, along with the dividing lines
	 * between the layers.
	 * 
	 * @param {Coordinates[]} topNeuronLocations An array of coordinates corresponding to the location
	 * 											 of the top most neuron of each layer. 
	 */
	public handleNeuralNetworkText(topNeuronLocations: Coordinates[]): void {
		let textYCoordinate = this.findTopmostNeuronHeight(topNeuronLocations) - 80;
		let inputLayerTextCoordinates = this.getInputLayerTextCoordinates(topNeuronLocations, textYCoordinate);
		let outputLayerTextCoordinates = this.getOutputLayerTextCoordinates(topNeuronLocations, textYCoordinate);
		let hiddenLayerTextCoordinates = this.getHiddenLayerTextCoordinates(topNeuronLocations, textYCoordinate);
		let inputLayerText = "Input Layer";
		let outputLayerText = "Output Layer";
		let hiddenLayerText = this.getHiddenLayerText(topNeuronLocations);
		this.drawLayerText(inputLayerText, inputLayerTextCoordinates);
		this.drawLayerText(outputLayerText, outputLayerTextCoordinates);
		this.drawLayerText(hiddenLayerText, hiddenLayerTextCoordinates);
		this.drawDividingLines(topNeuronLocations, textYCoordinate);
	}

	/**
	 * Draws the dividing lines between layers.
	 * 
	 * @param {Coordinates[]} topNeuronLocations An array of coordinates corresponding to the location
	 * 											 of the top most neuron of each layer. 
	 * @param {number} yHeight A location slightly above the y coordinate of the top most neuron of all
	 *                         the top most neurons of each layer.
	 */
	private drawDividingLines(topNeuronLocations: Coordinates[], yHeight: number): void {
		let strokeStyle = TEXT_COLOR;
		let lineWidth = 2;
		if(topNeuronLocations.length >= 3) {
			let firstLineX = (topNeuronLocations[0].x + topNeuronLocations[1].x)/2;
			let secondLineX = (topNeuronLocations[topNeuronLocations.length-2].x + topNeuronLocations[topNeuronLocations.length-1].x)/2;
			this.geometry.drawLine(firstLineX, yHeight - 20, firstLineX, yHeight + 60, strokeStyle, lineWidth);
			this.geometry.drawLine(secondLineX, yHeight - 20, secondLineX, yHeight + 60, strokeStyle, lineWidth);
		}
	}

	/**
	 * Draws the text describing each layer, at the specified coordinates.
	 * 
	 * @param {string} text The descriptive text corresponding to a layer 
	 * @param {Coordinates} coordinates The coordinates at which to draw the text
	 */
	private drawLayerText(text: string, coordinates: Coordinates): void {
		this.context.save();
		this.context.font = NEURAL_NETWORK_FONT;
		this.context.fillStyle = TEXT_COLOR;
		this.drawText(text, coordinates, "center", "middle");
		this.context.restore();
	}

	/**
	 * Returns the coordinates at which to draw the input layer text
	 * 
	 * @param {Coordinates[]} topNeuronLocations An array of coordinates corresponding to the location
	 * 											 of the top most neuron of each layer. 
	 * @param {number} textYCoordinate The y coordinate at which to draw the text. 
	 * @returns 
	 */
	private getInputLayerTextCoordinates(topNeuronLocations: Coordinates[], textYCoordinate: number): Coordinates {
		return {x: topNeuronLocations[0].x, y: textYCoordinate};
	}

	/**
	 * Returns the coordinates at which to draw the output layer text
	 * 
	 * @param {Coordinates[]} topNeuronLocations An array of coordinates corresponding to the location
	 * 											 of the top most neuron of each layer. 
	 * @param {number} textYCoordinate The y coordinate at which to draw the text. 
	 * @returns 
	 */
	private getOutputLayerTextCoordinates(topNeuronLocations: Coordinates[], textYCoordinate: number): Coordinates {
		return {x: topNeuronLocations[topNeuronLocations.length-1].x, y: textYCoordinate};
	}

	/**
	 * Returns the coordinates at which to draw the hidden layer text
	 * 
	 * @param {Coordinates[]} topNeuronLocations An array of coordinates corresponding to the location
	 * 											 of the top most neuron of each layer. 
	 * @param {number} textYCoordinate The y coordinate at which to draw the text. 
	 * @returns {Coordinates}
	 */
	private getHiddenLayerTextCoordinates(topNeuronLocations: Coordinates[], textYCoordinate: number): Coordinates {
		let xCoord = (topNeuronLocations[0].x + topNeuronLocations[topNeuronLocations.length-1].x)/2;
		return {x: xCoord, y: textYCoordinate};
	}

	/**
	 * Returns the y coordinate of the top most neuron of all of the top most neurons in each layer.
	 * 
	 * @param {Coordinates[]} topNeuronLocations An array of coordinates corresponding to the location
	 * 											 of the top most neuron of each layer. 
	 * @returns {number} The y coordinate of the top most neuron 
	 */
	private findTopmostNeuronHeight(topNeuronLocations: Coordinates[]): number {
		let height = 100000;
		for(var i = 0; i < topNeuronLocations.length; i++) {
			if(topNeuronLocations[i].y <= height) {
				height = topNeuronLocations[i].y;
			}
		}
		return height;
	}

	/**
	 * Returns "Hidden Layers" or "Hidden Layer" depending on whether there are multiple hidden
	 * layers or a single hidden layer in the neural network.
	 * 
	 * @param {Coordinates[]} topNeuronLocations An array of coordinates corresponding to the location
	 * 											 of the top most neuron of each layer
	 * @returns {string} A string as described above
	 */
	private getHiddenLayerText(topNeuronLocations: Coordinates[]): string {
		var hiddenLayerText;
		if(topNeuronLocations.length > 3) {
			hiddenLayerText = "Hidden Layers";
		} else if(topNeuronLocations.length == 3) {
			hiddenLayerText = "Hidden Layer";
		} else {
			hiddenLayerText = "";
		}
		return hiddenLayerText;
	}
}

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
 * @fileoverview  Contains the WeightTextHandler, NeuronTextHandler, and NeuralNetworkTextHandler
 * 				  classes. These classes manage the display of text for the respective neural
 * 				  network elements.
 *
 * @author Sandeep Jain
 */

import {TextCursor, TextLine} from './EditText.js';
import {BasicWeightTextHandler, BasicNeuronTextHandler, BasicNeuralNetworkTextHandler} from '../basic_nn/BasicTextHandlers.js';
import {WEIGHT_POPUP_STROKE, WEIGHT_POPUP_FILL, WEIGHT_POPUP_LINE_WIDTH} from '../basic_nn/BasicTextHandlers.js';
import {MAIN_TEXT_FONT} from '../basic_nn/BasicTextHandlers.js';
import {EncapsulatedNumber} from '../utilities/Calculator.js';
import {TrainingData} from './TrainingData.js';
import {Coordinates} from '../utilities/Geometry.js';

/**
 * The color of the rounded rectangle in which the weight is edited.
 */
const WEIGHT_EDITOR_FILL = "white";

/**
 * The color of the outline of the rounded rectangle in which the weight is edited.
 */
const WEIGHT_EDITOR_STROKE = "deepskyblue";

/**
 * The width of the outline of the rounded rectangle in which the weight is edited.
 */
const WEIGHT_EDITOR_LINE_WIDTH = 1;

/*****************************************************************/
/**
 * The WeightTextHandler class pops up a rounded rectangle when the user's mouse hovers
 * over the weight, and the user can then edit the value of the weight within that rectangle.
 */
export class WeightTextHandler extends BasicWeightTextHandler {

	/**
	 * Represents a line of editable text
	 */
	private textLine: TextLine;

	/**
	 * Manages a short vertical line, the text cursor, at the position where text can be inserted or removed
	 */
	private textCursor: TextCursor;

	/**
	 * Is saved and repainted on to the canvas to erase existing text and draw new text
	 */
	private drawingSurfaceImageData: ImageData;

	/**
	 * A numerical weight value, wrapped inside an object
	 */
	private encapsulatedWeightValue: EncapsulatedNumber;

	/**
	 * The new weight entered by the user
	 */
	private enteredWeightString: string;

	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */
	constructor(context: CanvasRenderingContext2D) {
		super(context);

		// General Neural Network Variables
		this.textLine = new TextLine(context);
		this.textCursor = new TextCursor(context);
	    this.drawingSurfaceImageData;
	    this.encapsulatedWeightValue;
	    this.enteredWeightString;
	}

	/**
	 * Draws a rounded rectangle which pops up whenever the user hovers over the weight. The rounded
	 * rectangle displays the existing encapsulatedWeightValue, which can be edited by the user.
	 * 
	 * @param {number} mouseX The x coordinate of the position at which to draw the rectangle
	 * @param {number} mouseY The y coordinate of the position at which to draw the rectangle*
	 * @param {EncapsulatedNumber} encapsulatedWeightValue The existing weight value 
	 */
	public drawWeightPopupForAcceptingNewWeight(mouseX: number, mouseY: number, 
		                                 encapsulatedWeightValue: EncapsulatedNumber): void {
		let coordinates = {x: mouseX, y: mouseY};
		this.boundingShape.drawRoundedRectangle(coordinates.x, coordinates.y, 150, 70, 5, WEIGHT_POPUP_STROKE,
		                                                                         WEIGHT_POPUP_FILL, WEIGHT_POPUP_LINE_WIDTH);
		this.boundingShape.drawRoundedRectangle(coordinates.x + 30, coordinates.y + 30, 90, 30, 5, WEIGHT_EDITOR_STROKE,
		                                                                         WEIGHT_EDITOR_FILL, WEIGHT_EDITOR_LINE_WIDTH);
		let text = ["Edit weight value:"];
		this.drawWeightPopupText(text, coordinates);
		this.saveDrawingSurface();
		this.encapsulatedWeightValue = encapsulatedWeightValue;
		this.enteredWeightString = this.encapsulatedWeightValue.getValueAsString();
		this.drawTextLineAndCursorAtPopup(mouseX, mouseY);
	}

	/**
	 * Responds to the event that the user enters a character
	 * 
	 * @param {KeyboardEvent} eventObject An event that occurs on the keyboard 
	 */
	public handleKeypressEvent(eventObject: KeyboardEvent): void {
		let key = String.fromCharCode(eventObject.which);

   		if (eventObject.key !== "Backspace" && !eventObject.ctrlKey && !eventObject.metaKey && 
			this.enteredWeightString.length <= 8) {
     		eventObject.preventDefault(); // no further browser processing
     		this.enteredWeightString = this.enteredWeightString + key;
			this.insertPressedKeyIntoLine(key);
		}
	}

	/**
	 * Responds to the event that the user enters "Backspace" or "Enter"
	 * 
	 * @param {KeyboardEvent} eventObject An event that occurs on the keyboard 
	 */
	public handleKeydownEvent(eventObject: KeyboardEvent): void {
		if (eventObject.key === "Backspace" || eventObject.key === "Enter") {
			eventObject.preventDefault();
    	}

    	if (eventObject.key === "Backspace") {  // backspace
    		this.enteredWeightString = this.removeLastCharacter(this.enteredWeightString);
			this.removeLastCharacterFromLine();
   		}

   		if (eventObject.key === "Enter") { // enter key
   			let parsedValue = parseFloat(this.enteredWeightString);
   			if ( !isNaN( parsedValue ) ) {
   				this.encapsulatedWeightValue.setValue(parsedValue, 3);
   			}
   		}
	}

	/**
	 * Draws the internal editable weight value along with a cursor at the approximate given
	 * coordinates
	 * 
	 * @param {number} mouseX The x coordinate at which to draw the text
	 * @param {number} mouseY The y coordinate at which to draw the text
	 */
	private drawTextLineAndCursorAtPopup(mouseX: number, mouseY: number): void {
		let editableX = mouseX + 34;
		let editableY = mouseY + 54;
		this.textLine.resetText();
		this.textLine.moveTo(editableX, editableY);
		this.textLine.insert(this.encapsulatedWeightValue.getValueAsString() );
		this.textLine.draw();
		let cursorXPosition = editableX + this.textLine.getWidth();
		this.textCursor.draw(cursorXPosition, editableY);
	}

	/**
	 * Inserts the character key pressed by the user into the internal TextLine object,
	 * and redraws the TextLine on to the screen
	 * 
	 * @param {string} key The character key pressed by the user
	 */
	private insertPressedKeyIntoLine(key: string): void {
		this.context.save();
		this.textLine.erase(this.drawingSurfaceImageData);
		this.textLine.insert(key);
		this.moveCursor(this.textLine.left + this.textLine.getWidth(), this.textLine.bottom);
		this.textLine.draw();
		this.context.restore();
	}

	/**
	 * Removes the last character of the line from the internal TextLine object, and redraws the
	 * TextLine on to the screen
	 */
	private removeLastCharacterFromLine(): void {
		this.context.save();
		this.textLine.erase(this.drawingSurfaceImageData);
		this.textLine.removeCharacterBeforeCaret();
		this.moveCursor(this.textLine.left + this.textLine.getWidth(), this.textLine.bottom);
		this.textLine.draw();
		this.context.restore();
	}

	/**
	 * Removes the last character of the string from the string
	 * 
	 * @param {string} aString The string to act upon
	 * @returns {string} The string with the last character removed
	 */
	private removeLastCharacter(aString: string): string {
		return aString.substring(0, aString.length - 1);
	}

	/**
	 * Saves the existing canvas on to the internal ImageData object
	 */
	private saveDrawingSurface(): void {
   		this.drawingSurfaceImageData = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
	}

	/**
	 * Moves the TextCursor to the specified coordinates
	 * 
	 * @param {number} x The x coordinate to move to
	 * @param {number} y The y coordinate to move to
	 */
	private moveCursor(x: number, y: number): void {
	   this.textCursor.erase(this.drawingSurfaceImageData);
	   this.saveDrawingSurface();
	   this.context.putImageData(this.drawingSurfaceImageData, 0, 0);
	   this.textCursor.draw(x, y);
	}
}

/*****************************************************************/
/**
 * The NeuronTextHandler, as of now, does not do anything new as compared to the
 * BasicNeuronTextHandler.
 */
export class NeuronTextHandler extends BasicNeuronTextHandler {
	constructor(context: CanvasRenderingContext2D) {
		super(context);
	}
}

/*****************************************************************/
/**
 * The NeuralNetworkTextHandler manages the display of the training related text
 * with respect to the neural network.
 */
export class NeuralNetworkTextHandler extends BasicNeuralNetworkTextHandler {

	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */
	constructor(context: CanvasRenderingContext2D) {
		super(context);
	}

	/**
	 * Displays the number of training iterations that have happened so far
	 * 
	 * @param {Coordinates[]} topNeuronLocations The array of coordinates of the locations of the top most neurons
	 * @param {number} numIterations The number of iterations to display
	 */
	public showIterations(topNeuronLocations: Coordinates[], numIterations: number): void {
		let text = ["Iterations: " + numIterations];
		let coordinates = this.getIterationsTextCoordinates(topNeuronLocations);
		this.context.font = MAIN_TEXT_FONT;
		this.drawPopupText(text, coordinates);
	}

	/**
	 * Draws the text which describes the numerical value of the error function
	 * 
	 * @param {TrainingData} trainingData The patterns on which the neural network is to be trained
	 * @param {number[]} outputDataContainer The actual output values with which to compare the patterns
	 * @param {Coordinates[]} topNeuronLocations The array of coordinates of the locations of the top most neurons 
	 */
	public drawErrorOutputText(trainingData: TrainingData, outputDataContainer: number[], 
		                topNeuronLocations: Coordinates[]): void {
		let text = new Array();
		text[0] = "Error = "
		text[1] = "(1/2) x ["
		text[2] = this.getErrorStringFragment(trainingData.getIthOutputValue(0), outputDataContainer[0]) + " +";
		text[3] = this.getErrorStringFragment(trainingData.getIthOutputValue(1), outputDataContainer[1]) + " +";
		text[4] = this.getErrorStringFragment(trainingData.getIthOutputValue(2), outputDataContainer[2]) + " +";
		text[5] = this.getErrorStringFragment(trainingData.getIthOutputValue(3), outputDataContainer[3]) + " ]";
		text[6] = "= " + this.calculator.roundDecimalTo(this.calculator.calculateErrorFunctionValue(trainingData, outputDataContainer), 2);
		let coordinates = this.getErrorTextCoordinates(topNeuronLocations);
		this.context.font = MAIN_TEXT_FONT;
		this.drawPopupText(text, coordinates);
	}

	/**
	 * Separately draws the actual output of the neural network to compare it with the desired output from the
	 * training data.
	 * 
	 * @param {Coordinates[]} topNeuronLocations The array of coordinates of the locations of the top most neurons 
	 * @param {Object} actualAndDesiredOutputs An object containing the actual and desired output values
	 */
	public drawActualAndDesiredOutputs(topNeuronLocations: Coordinates[], 
		                        actualAndDesiredOutputs: {actual: number, desired: number}): void {
		let coordinates = this.getOutputsTextCoordinates(topNeuronLocations);
		let text = new Array();
		text[0] = "Actual output: " + actualAndDesiredOutputs.actual;
		text[1] = "Desired output: " + actualAndDesiredOutputs.desired;
		this.context.font = MAIN_TEXT_FONT;
		this.drawPopupText(text, coordinates);
	}

	/**
	 * Returns the coordinates at which the text with the number of elapsed iterations is supposed to be
	 * drawn.
	 * 
	 * @param {Coordinates[]} topNeuronLocations The array of coordinates of the locations of the top most neurons 
	 * @returns {Coordinates} The actual coordinates at which the text is supposed to be drawn 
	 */
	private getIterationsTextCoordinates(topNeuronLocations: Coordinates[]): Coordinates {
		let xCoordinate = topNeuronLocations[topNeuronLocations.length-1].x + 90;
		let yCoordinate = topNeuronLocations[topNeuronLocations.length-1].y - 180;
		return {x: xCoordinate, y: yCoordinate};
	}

	/**
	 * Returns the coordinates at which the text with the error function value is supposed to be drawn.
	 * 
	 * @param {Coordinates[]} topNeuronLocations The array of coordinates of the locations of the top most neurons 
	 * @returns {Coordinates} The actual coordinates at which the text is supposed to be drawn 
	 */
	private getErrorTextCoordinates(topNeuronLocations: Coordinates[]): Coordinates {
		let xCoordinate = topNeuronLocations[topNeuronLocations.length-1].x + 90;
		let yCoordinate = topNeuronLocations[topNeuronLocations.length-1].y - 140;
		return {x: xCoordinate, y: yCoordinate};
	}

	/**
	 * Returns a fragment of the error string which contains the desired output minus the actual output
	 * 
	 * @param {number} desiredOutput The desired output
	 * @param {number} actualOutput The actual output
	 * @returns {string} The error string fragment
	 */
	private getErrorStringFragment(desiredOutput: number, actualOutput: number): string {
		let subtraction = "(" + desiredOutput.toString() + " - " + actualOutput.toString() + ")";
		return subtraction + this.asUnicodeSuperscript("2");
	}

	/**
	 * Returns the coordinates at which the actual and desired outputs text is supposed to be drawn
	 * 
	 * @param {Coordinates[]} topNeuronLocations The array of coordinates of the locations of the top most neurons 
	 * @returns {Coordinates} The actual coordinates at which the text is supposed to be drawn 
	 */
	private getOutputsTextCoordinates(topNeuronLocations: Coordinates[]): Coordinates {
		let xCoordinate = topNeuronLocations[topNeuronLocations.length-1].x;;
		let yCoordinate = topNeuronLocations[topNeuronLocations.length-1].y + 60;
		return {x: xCoordinate, y: yCoordinate};
	}
}


import {TextCursor, TextLine} from './EditText.js';

import {BasicWeightTextHandler, BasicNeuronTextHandler, BasicNeuralNetworkTextHandler} from '../basic_nn/BasicTextHandlers.js';
import {WEIGHT_POPUP_STROKE, WEIGHT_POPUP_FILL, WEIGHT_POPUP_LINE_WIDTH} from '../basic_nn/BasicTextHandlers.js';
import {MAIN_TEXT_FONT} from '../basic_nn/BasicTextHandlers.js';

const WEIGHT_EDITOR_FILL = "white";
const WEIGHT_EDITOR_STROKE = "deepskyblue";
const WEIGHT_EDITOR_LINE_WIDTH = 1;

export class WeightTextHandler extends BasicWeightTextHandler {
	constructor(context) {
		super(context);

		// XOR Neural Network Variables
		this.textLine = new TextLine();
		this.textCursor = new TextCursor();
	    this.drawingSurfaceImageData;
	    this.encapsulatedWeightValue;
	    this.enteredWeightString;

		this.blinkingInterval;
	}

	drawWeightPopupForAcceptingNewWeight(mouseX, mouseY, encapsulatedWeightValue) {
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

	drawTextLineAndCursorAtPopup(mouseX, mouseY) {
		let editableX = mouseX + 34;
		let editableY = mouseY + 54;
		this.textLine.resetText();
		this.textLine.moveTo(editableX, editableY);
		this.textLine.insert(this.encapsulatedWeightValue.getValueAsString() );
		this.textLine.draw(this.context);
		let cursorXPosition = editableX + this.textLine.getWidth(this.context);
		this.textCursor.draw(this.context, cursorXPosition, editableY);
		// this.blinkCursor(cursorXPosition, mouseY, this.textCursor, this.context, this.drawingSurfaceImageData);
	}

	handleKeypressEvent(eventObject) {
		let key = String.fromCharCode(eventObject.which);

   		if (eventObject.keyCode !== 8 && !eventObject.ctrlKey && !eventObject.metaKey && this.enteredWeightString.length <= 8) {
     		eventObject.preventDefault(); // no further browser processing
     		this.enteredWeightString = this.enteredWeightString + key;
			this.insertPressedKeyIntoLine(key);
		}
	}

	insertPressedKeyIntoLine(key) {
		this.context.save();
		this.textLine.erase(this.context, this.drawingSurfaceImageData);
		this.textLine.insert(key);
		this.moveCursor(this.textLine.left + this.textLine.getWidth(this.context), this.textLine.bottom);
		this.textLine.draw(this.context);
		this.context.restore();
	}

	handleKeydownEvent(eventObject) {
		if (eventObject.keyCode === 8 || eventObject.keyCode === 13) {
			eventObject.preventDefault();
    	}

    	if (eventObject.keyCode === 8) {  // backspace
    		this.enteredWeightString = this.removeLastCharacter(this.enteredWeightString);
			this.removeLastCharacterFromLine();
   		}

   		if (eventObject.keyCode === 13) { // enter key
   			let parsedValue = parseFloat(this.enteredWeightString);
   			if ( !isNaN( parsedValue ) ) {
   				this.encapsulatedWeightValue.setValue(parsedValue, 3);
   			}
   		}
	}

	removeLastCharacterFromLine() {
		this.context.save();
		this.textLine.erase(this.context, this.drawingSurfaceImageData);
		this.textLine.removeCharacterBeforeCaret();
		this.moveCursor(this.textLine.left + this.textLine.getWidth(this.context), this.textLine.bottom);
		this.textLine.draw(this.context);
		this.context.restore();
	}

	removeLastCharacter(aString) {
		return aString.substr(0, aString.length - 1);
	}

	saveDrawingSurface() {
   		this.drawingSurfaceImageData = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
	}

	blinkCursor(x, y, myTextCursor, myContext, myDrawingSurfaceImageData) {
	   clearInterval(this.blinkingInterval);
	   this.blinkingInterval = setInterval( function (e) {
	   myTextCursor.erase(myContext, myDrawingSurfaceImageData);
	      setTimeout( function (e) {
	         if (myTextCursor.left == x &&
	            myTextCursor.top + myTextCursor.getHeight(myContext) == y) {
	            myTextCursor.draw(myContext, x, y);
	         }
	      }, 300);
	   }, 1000);
	}

	moveCursor(x, y) {
	   this.textCursor.erase(this.context, this.drawingSurfaceImageData);
	   this.saveDrawingSurface();
	   this.context.putImageData(this.drawingSurfaceImageData, 0, 0);
	   this.textCursor.draw(this.context, x, y);
	   // this.blinkCursor(x, y, this.textCursor, this.context, this.drawingSurfaceImageData);
	}
}

export class NeuronTextHandler extends BasicNeuronTextHandler {
	constructor(context) {
		super(context);
	}
}

const NEURAL_NETWORK_RECTANGLE_STROKE = "lavender";
const NEURAL_NETWORK_RECTANGLE_FILL = "lavenderblush";
const NEURAL_NETWORK_RECTANGLE_LINE_WIDTH = "1";

export class NeuralNetworkTextHandler extends BasicNeuralNetworkTextHandler {
	constructor(context) {
		super(context);
	}

	showIterations(topNeuronLocations, numIterations) {
		let text = ["Iterations: " + numIterations];
		let coordinates = this.getIterationsTextCoordinates(topNeuronLocations);
		this.context.font = MAIN_TEXT_FONT;
		this.drawPopupText(text, coordinates);
	}

	getIterationsTextCoordinates(topNeuronLocations) {
		let xCoordinate = topNeuronLocations[topNeuronLocations.length-1].x + 90;
		let yCoordinate = topNeuronLocations[topNeuronLocations.length-1].y - 180;
		return {x: xCoordinate, y: yCoordinate};
	}

	drawErrorOutputText(trainingData, outputDataContainer, topNeuronLocations) {
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

	getErrorTextCoordinates(topNeuronLocations) {
		let xCoordinate = topNeuronLocations[topNeuronLocations.length-1].x + 90;
		let yCoordinate = topNeuronLocations[topNeuronLocations.length-1].y - 140;
		return {x: xCoordinate, y: yCoordinate};
	}

	getErrorStringFragment(desiredOutput, actualOutput) {
		let subtraction = "(" + desiredOutput + " - " + actualOutput + ")";
		return subtraction + this.asUnicodeSuperscript("2");
	}

	drawActualAndDesiredOutputs(topNeuronLocations, actualAndDesiredOutputs) {
		let coordinates = this.getOutputsTextCoordinates(topNeuronLocations);
		let text = new Array();
		text[0] = "Actual output: " + actualAndDesiredOutputs.actual;
		text[1] = "Desired output: " + actualAndDesiredOutputs.desired;
		this.context.font = MAIN_TEXT_FONT;
		this.drawPopupText(text, coordinates);
	}

	getOutputsTextCoordinates(topNeuronLocations) {
		let xCoordinate = topNeuronLocations[topNeuronLocations.length-1].x;;
		let yCoordinate = topNeuronLocations[topNeuronLocations.length-1].y + 60;
		return {x: xCoordinate, y: yCoordinate};
	}
}

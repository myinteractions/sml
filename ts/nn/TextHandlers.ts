
import {TextCursor, TextLine} from './EditText.js';

import {BasicWeightTextHandler, BasicNeuronTextHandler, BasicNeuralNetworkTextHandler} from '../basic_nn/BasicTextHandlers.js';
import {WEIGHT_POPUP_STROKE, WEIGHT_POPUP_FILL, WEIGHT_POPUP_LINE_WIDTH} from '../basic_nn/BasicTextHandlers.js';
import {MAIN_TEXT_FONT} from '../basic_nn/BasicTextHandlers.js';
import {EncapsulatedNumber} from '../utilities/Calculator.js';
import {TrainingData} from './TrainingData.js';
import {Coordinates} from '../utilities/Geometry.js';

const WEIGHT_EDITOR_FILL = "white";
const WEIGHT_EDITOR_STROKE = "deepskyblue";
const WEIGHT_EDITOR_LINE_WIDTH = 1;

export class WeightTextHandler extends BasicWeightTextHandler {
	private textLine: TextLine;
	private textCursor: TextCursor;
	private drawingSurfaceImageData: ImageData;
	private encapsulatedWeightValue: EncapsulatedNumber;
	private enteredWeightString: string;

	constructor(context: CanvasRenderingContext2D) {
		super(context);

		// General Neural Network Variables
		this.textLine = new TextLine(context);
		this.textCursor = new TextCursor(context);
	    this.drawingSurfaceImageData;
	    this.encapsulatedWeightValue;
	    this.enteredWeightString;
	}

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

	public handleKeypressEvent(eventObject: KeyboardEvent): void {
		let key = String.fromCharCode(eventObject.which);

   		if (eventObject.key !== "Backspace" && !eventObject.ctrlKey && !eventObject.metaKey && 
			this.enteredWeightString.length <= 8) {
     		eventObject.preventDefault(); // no further browser processing
     		this.enteredWeightString = this.enteredWeightString + key;
			this.insertPressedKeyIntoLine(key);
		}
	}

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

	private insertPressedKeyIntoLine(key: string): void {
		this.context.save();
		this.textLine.erase(this.drawingSurfaceImageData);
		this.textLine.insert(key);
		this.moveCursor(this.textLine.left + this.textLine.getWidth(), this.textLine.bottom);
		this.textLine.draw();
		this.context.restore();
	}

	private removeLastCharacterFromLine(): void {
		this.context.save();
		this.textLine.erase(this.drawingSurfaceImageData);
		this.textLine.removeCharacterBeforeCaret();
		this.moveCursor(this.textLine.left + this.textLine.getWidth(), this.textLine.bottom);
		this.textLine.draw();
		this.context.restore();
	}

	private removeLastCharacter(aString: string): string {
		return aString.substring(0, aString.length - 1);
	}

	private saveDrawingSurface(): void {
   		this.drawingSurfaceImageData = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
	}

	private moveCursor(x: number, y: number): void {
	   this.textCursor.erase(this.drawingSurfaceImageData);
	   this.saveDrawingSurface();
	   this.context.putImageData(this.drawingSurfaceImageData, 0, 0);
	   this.textCursor.draw(x, y);
	}
}

export class NeuronTextHandler extends BasicNeuronTextHandler {
	constructor(context: CanvasRenderingContext2D) {
		super(context);
	}
}

export class NeuralNetworkTextHandler extends BasicNeuralNetworkTextHandler {
	constructor(context: CanvasRenderingContext2D) {
		super(context);
	}

	public showIterations(topNeuronLocations: Coordinates[], numIterations: number): void {
		let text = ["Iterations: " + numIterations];
		let coordinates = this.getIterationsTextCoordinates(topNeuronLocations);
		this.context.font = MAIN_TEXT_FONT;
		this.drawPopupText(text, coordinates);
	}

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

	public drawActualAndDesiredOutputs(topNeuronLocations: Coordinates[], 
		                        actualAndDesiredOutputs: {actual: number, desired: number}): void {
		let coordinates = this.getOutputsTextCoordinates(topNeuronLocations);
		let text = new Array();
		text[0] = "Actual output: " + actualAndDesiredOutputs.actual;
		text[1] = "Desired output: " + actualAndDesiredOutputs.desired;
		this.context.font = MAIN_TEXT_FONT;
		this.drawPopupText(text, coordinates);
	}

	private getIterationsTextCoordinates(topNeuronLocations: Coordinates[]): Coordinates {
		let xCoordinate = topNeuronLocations[topNeuronLocations.length-1].x + 90;
		let yCoordinate = topNeuronLocations[topNeuronLocations.length-1].y - 180;
		return {x: xCoordinate, y: yCoordinate};
	}


	private getErrorTextCoordinates(topNeuronLocations: Coordinates[]): Coordinates {
		let xCoordinate = topNeuronLocations[topNeuronLocations.length-1].x + 90;
		let yCoordinate = topNeuronLocations[topNeuronLocations.length-1].y - 140;
		return {x: xCoordinate, y: yCoordinate};
	}

	private getErrorStringFragment(desiredOutput: number, actualOutput: number): string {
		let subtraction = "(" + desiredOutput.toString() + " - " + actualOutput.toString() + ")";
		return subtraction + this.asUnicodeSuperscript("2");
	}

	private getOutputsTextCoordinates(topNeuronLocations: Coordinates[]): Coordinates {
		let xCoordinate = topNeuronLocations[topNeuronLocations.length-1].x;;
		let yCoordinate = topNeuronLocations[topNeuronLocations.length-1].y + 60;
		return {x: xCoordinate, y: yCoordinate};
	}
}


import {Geometry} from '../utilities/Geometry.js';
import {TextHandler} from '../utilities/TextHandlingSuperClasses.js';

export const MAIN_TEXT_FONT = "15px Helvetica";
const SUPERSCRIPT_TEXT_FONT = "11px Helvetica";
const NEURON_INTERNAL_FONT = "19px Helvetica";
const NEURAL_NETWORK_FONT = "22px Helvetica";
const TEXT_COLOR = "dimgray";
export const WEIGHT_POPUP_FILL = "mintcream";
export const WEIGHT_POPUP_STROKE = "deepskyblue";
export const WEIGHT_POPUP_LINE_WIDTH = 1;

export class BasicWeightTextHandler extends TextHandler {
	constructor(context) {
		super(context);
	}

	drawWeightText(value, startX, startY, endX, endY) {
		this.context.font = MAIN_TEXT_FONT;
		let roundedValue = this.calculator.roundDecimalTo(value,3);
		let xLocation = startX + (endX - startX)/4;
		let yLocation = startY - (startY - endY)/4;
		let coordinates = {x: xLocation, y: yLocation};
		this.drawBoundingRectangle(roundedValue, coordinates);
		this.context.fillStyle = TEXT_COLOR;
		this.drawText(roundedValue, coordinates, "center", "middle");
	}

	drawBoundingRectangle(value, coordinates) {
		let textMetrics = this.context.measureText(value);
		let width = textMetrics.width + 2;
		let height = this.context.measureText('M').width + 2;
		this.boundingShape.fillRectangle(coordinates, width, height, "lightgray");
	}

	drawWeightPopup(mouseX, mouseY, weightValue, previousNeuronOutput) {
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

	drawPopupBoundingRectangle(text, coordinates) {
		this.context.font = MAIN_TEXT_FONT;
		let maxLengthIndex = this.calculator.getStringMaxLengthIndex(text);
		let textMetrics = this.context.measureText(text[maxLengthIndex]);
		let width = textMetrics.width + 28;
		let height = (this.context.measureText('M').width + 8) * text.length + 12;
		this.boundingShape.drawRoundedRectangle(coordinates.x, coordinates.y, width, height, 5, WEIGHT_POPUP_STROKE,
			                                                                                         WEIGHT_POPUP_FILL, WEIGHT_POPUP_LINE_WIDTH);
	}

	drawWeightPopupText(text, coordinates) {
		this.context.font = MAIN_TEXT_FONT;
		this.context.fillStyle = TEXT_COLOR;
		let textCoordinates = {x: coordinates.x + 10, y: coordinates.y + 18};
		this.drawPopupText(text, textCoordinates);
	}
}

const NEURON_POPUP_FILL = "ivory";
export const NEURON_POPUP_STROKE = "tan";
export const NEURON_POPUP_LINE_WIDTH = 1;
export const INPUT_LAYER_NEURON_FILL_STYLE = 'papayawhip';

export class BasicNeuronTextHandler extends TextHandler {
	constructor(context) {
		super(context);
	}

	drawNeuronInternalText(value, centerX, centerY) {
		this.context.font = NEURON_INTERNAL_FONT;
		this.context.fillStyle = TEXT_COLOR;
		let coordinates = {x: centerX, y: centerY};
		this.drawText(value, coordinates, "center", "middle");
	}

	drawNeuronPopup(centerX, centerY, neuronRadius, incomingWeightValuesArray, previousNeuronOutputsArray) {
		let coordinates = {x: centerX + neuronRadius + 15, y: centerY};
		let weightArray = this.calculator.roundArrayDecimalsTo(incomingWeightValuesArray, 3);
		let sum = this.calculator.dotProduct(incomingWeightValuesArray, previousNeuronOutputsArray);
		sum = this.calculator.roundDecimalTo(sum, 3);
		let sumString = "-(" + sum + ")";
		let text = this.getDotProductAsStringArray(previousNeuronOutputsArray, incomingWeightValuesArray);
		let output = this.calculator.roundDecimalTo( this.calculator.sigmoid(sum), 2);
		let outputTextString = this.getOutputTextString(sumString, output);
		text[text.length] = outputTextString;
		this.drawPopupBoundingRectangle(text, coordinates);
		text[text.length-1] = "";
		this.drawNeuronPopupText(text, coordinates);
		this.drawOutputTextString(text, sumString, output, coordinates);
	}

	drawOutputTextString(text, sumString, output, coordinates) {
		let height = this.context.measureText('M').width + 8;
		coordinates.y = coordinates.y + (height * text.length) - height;
		let outputTextStringFirstHalf = "1 / ( 1 + e";
		this.drawText(outputTextStringFirstHalf, coordinates, "left", "middle");
		coordinates.x = coordinates.x + this.context.measureText(outputTextStringFirstHalf).width;
		this.context.font = SUPERSCRIPT_TEXT_FONT;
		this.drawText(sumString, coordinates, "left", "bottom");
		coordinates.x = coordinates.x + this.context.measureText(sumString).width;
		this.context.font = MAIN_TEXT_FONT;
		let outputTextStringSecondHalf = " ) = " + output;
		this.drawText(outputTextStringSecondHalf, coordinates, "left", "middle");
	}

	getOutputTextString(sumString, output) {
		let returnValue = "1 / ( 1 + e" + sumString + " )" + " = " + output;
		return returnValue;
	}

	drawNeuronPopupText(text, coordinates) {
		this.context.font = MAIN_TEXT_FONT;
		this.context.fillStyle = TEXT_COLOR;
		this.drawPopupText(text, coordinates);
	}

	drawPopupBoundingRectangle(text, coordinates) {
		this.context.font = MAIN_TEXT_FONT;
		let maxLengthIndex = this.calculator.getStringMaxLengthIndex(text);
		let textMetrics = this.context.measureText(text[maxLengthIndex]);
		let width = textMetrics.width + 25;
		let height = (this.context.measureText('M').width + 8) * text.length + 12;
		this.boundingShape.drawRoundedRectangle(coordinates.x-5, coordinates.y-14, width, height, 5, NEURON_POPUP_STROKE, NEURON_POPUP_FILL,
			                                                                                           NEURON_POPUP_LINE_WIDTH);
	}

	drawFirstLayerNeuronPopup(centerX, centerY, neuronRadius, outputValue) {
		this.context.font = MAIN_TEXT_FONT;
		let coordinates = {x: centerX + neuronRadius + 15, y: centerY};
		let textString = "Input value = " + outputValue;
		this.drawFirstLayerPopupBoundingRectangle(textString, coordinates);
		this.drawText(textString, coordinates, "left", "middle");
	}

	drawFirstLayerPopupBoundingRectangle(textString, coordinates) {
		let textMetrics = this.context.measureText(textString);
		let width = textMetrics.width + 20;
		let height = this.context.measureText('M').width + 14;
		this.boundingShape.drawRoundedRectangle(coordinates.x-5, coordinates.y-12, width, height, 5, NEURON_POPUP_STROKE,
												INPUT_LAYER_NEURON_FILL_STYLE, NEURON_POPUP_LINE_WIDTH);
	}
}

export class BasicNeuralNetworkTextHandler extends TextHandler {
	constructor(context) {
		super(context);
        this.geometry = new Geometry(context);
	}

	handleNeuralNetworkText(topNeuronLocations) {
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

	drawDividingLines(topNeuronLocations, yHeight) {
		let strokeStyle = TEXT_COLOR;
		let lineWidth = 2;
		if(topNeuronLocations.length >= 3) {
			let firstLineX = (topNeuronLocations[0].x + topNeuronLocations[1].x)/2;
			let secondLineX = (topNeuronLocations[topNeuronLocations.length-2].x + topNeuronLocations[topNeuronLocations.length-1].x)/2;
			this.geometry.drawLine(firstLineX, yHeight - 20, firstLineX, yHeight + 60, strokeStyle, lineWidth);
			this.geometry.drawLine(secondLineX, yHeight - 20, secondLineX, yHeight + 60, strokeStyle, lineWidth);
		}
	}

	drawLayerText(text, coordinates) {
		this.context.save();
		this.context.font = NEURAL_NETWORK_FONT;
		this.context.fillStyle = TEXT_COLOR;
		this.drawText(text, coordinates, "center", "middle");
		this.context.restore();
	}

	getInputLayerTextCoordinates(topNeuronLocations, textYCoordinate) {
		return {x: topNeuronLocations[0].x, y: textYCoordinate};
	}

	getOutputLayerTextCoordinates(topNeuronLocations, textYCoordinate) {
		return {x: topNeuronLocations[topNeuronLocations.length-1].x, y: textYCoordinate};
	}

	getHiddenLayerTextCoordinates(topNeuronLocations, textYCoordinate) {
		let xCoord = (topNeuronLocations[0].x + topNeuronLocations[topNeuronLocations.length-1].x)/2;
		return {x: xCoord, y: textYCoordinate};
	}

	findTopmostNeuronHeight(topNeuronLocations) {
		let height = 100000;
		for(var i = 0; i < topNeuronLocations.length; i++) {
			if(topNeuronLocations[i].y <= height) {
				height = topNeuronLocations[i].y;
			}
		}
		return height;
	}

	getHiddenLayerText(topNeuronLocations) {
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

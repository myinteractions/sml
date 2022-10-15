
// Geometry

function windowToCanvas(canvas, x, y) {
	var bbox = canvas.getBoundingClientRect();
	return { x: x - bbox.left * (canvas.width / bbox.width),
			 y: y - bbox.top * (canvas.height / bbox.height)
	};
}

function drawLine(context, startX, startY, endX, endY, strokeStyle, lineWidth) {
	context.beginPath();
	context.lineWidth = lineWidth;
	context.strokeStyle = strokeStyle;
	context.moveTo(startX, startY);
	context.lineTo(endX, endY);
	context.stroke();
}

function drawCircle(context, centerX, centerY, radius, fillStyle, strokeStyle, strokeWidth) {
	// draw outline of circle
	context.beginPath();
	context.lineWidth = strokeWidth;
	context.strokeStyle = strokeStyle;
	context.arc(centerX, centerY, radius, 0, Math.PI*2, false);
	context.stroke();

	// fill circle with color
	context.beginPath();
	context.fillStyle = fillStyle;
	context.arc(centerX, centerY, radius, 0, Math.PI*2, false);
	context.fill();
}

function pointIsWithinCircle(pointX, pointY, centerX, centerY, circleRadius) {
	let distanceX = pointX - centerX;
	let distanceY = pointY - centerY;
	if( Math.sqrt( distanceX*distanceX + distanceY*distanceY) < circleRadius ) {
		return true;
	} else {
		return false;
	}
}

function pointIsOnTheLine(pointX, pointY, startX, startY, endX, endY, slopeMargin, cutOffDistance) {
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

class Calculator {

	randomIntegerBetween(low, high) {
		return this.randomDecimalBetween(low, high, 0);
	}

	roundDecimalTo(number, decimalDigits) {
		let intermediateNumber = number * Math.pow(10, decimalDigits);
		let returnValue = Math.round(intermediateNumber)/Math.pow(10, decimalDigits);
		if(returnValue == -0) {
			returnValue = 0;
		}
		return returnValue;
	}

	roundArrayDecimalsTo(decimalArray, decimalDigits) {
		let roundedArray = decimalArray;
		for(var i=0; i < roundedArray.length; i++) {
			roundedArray[i] = this.roundDecimalTo(decimalArray[i], decimalDigits);
		}
		return roundedArray;
	}

	randomDecimalBetween(low, high, decimalDigits) {
		let number = (high - low) * Math.random() + low;
		return this.roundDecimalTo(number, decimalDigits);
	}

	randomNumberBetween(low, high) {
		return (high - low) * Math.random() + low;
	}

	dotProduct(array1, array2) {
		var dotProduct = 0;
		if(array1.length == array2.length) {
			for(var i=0; i < array1.length; i++) {
				dotProduct = dotProduct + array1[i] * array2[i];
			}
		}
		return dotProduct;
	}

	sigmoid(value) {
		return 1/(1+ Math.exp(-value));
	}

	arraySum(array) {
		let sum = 0;
		for(var i=0; i < array.length; i++) {
			sum += array[i];
		}
		return sum;
	}
		
	getStringMaxLengthIndex(stringArray) {
		let  maxStringLength = 0, index = 0;
		for(var i=0; i < stringArray.length; i++) {
			if(stringArray[i].length > maxStringLength) {
				maxStringLength = stringArray[i].length;
				index = i;

			}
		}
		return index;
	}
}

class BoundingShape {
	constructor(context) {
		this.context = context;
	}
}

class BoundingRectangle extends BoundingShape {
	constructor(context) {
		super(context);
	}

	fillRectangle(centerCoordinates, width, height, fillStyle) {
		this.context.save();
		this.context.fillStyle = fillStyle;
		this.context.translate(centerCoordinates.x, centerCoordinates.y);
		this.context.fillRect(- width/2, - height/2, width, height);
		this.context.restore();
	}

	drawRoundedRectangle(cornerX, cornerY, width, height, cornerRadius, strokeStyle, fillStyle, lineWidth) {
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

	createRoundedRectangle(cornerX, cornerY, width, height, cornerRadius) {
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

class TextHandler {
	constructor(context) {
		this.context = context;
		this.calculator = new Calculator();
		this.boundingShape;
	}	

	drawText(text, coordinates, alignment, baseline) {
		this.context.textAlign = alignment;
		this.context.textBaseline = baseline;
		this.context.fillText(text, coordinates.x, coordinates.y)
	}

	drawPopupText(text, coordinates) {
		let height = this.context.measureText('M').width + 8;
		var yPosition, adjustedCoordinates;
		for(var i=0; i < text.length; i++) {
			yPosition = coordinates.y + i*height;
			adjustedCoordinates = {x:coordinates.x, y: yPosition};
			this.drawText(text[i], adjustedCoordinates, "left", "middle");
		}
	}

	getDotProductAsStringArray(firstArray, secondArray) {
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

	getStringAsUnicodeSuperscript(numberString) {
		let asUnicode = "";
		for(var i=0; i < numberString.length; i++) {
			asUnicode = asUnicode + this.asUnicodeSuperscript(numberString[i]);
		}
		return asUnicode;
	}

	asUnicodeSuperscript(character) {
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

const MAIN_TEXT_FONT = "15px Helvetica";
const SUPERSCRIPT_TEXT_FONT = "11px Helvetica";
const NEURON_INTERNAL_FONT = "19px Helvetica";
const NEURAL_NETWORK_FONT = "22px Helvetica";
const TEXT_COLOR = "dimgray";
const WEIGHT_POPUP_FILL = "mintcream";
const WEIGHT_POPUP_STROKE = "deepskyblue";
const WEIGHT_POPUP_LINE_WIDTH = 1;

class WeightTextHandler extends TextHandler {
	constructor(context) {
		super(context);
		this.boundingShape = new BoundingRectangle(context);
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
const NEURON_POPUP_STROKE = "tan";
const NEURON_POPUP_LINE_WIDTH = 1;

class NeuronTextHandler extends TextHandler {
	constructor(context) {
		super(context);
		this.boundingShape = new BoundingRectangle(context);
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

class NeuralNetworkTextHandler extends TextHandler {
	constructor(context) {
		super(context);
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
			drawLine(this.context, firstLineX, yHeight - 20, firstLineX, yHeight + 60, strokeStyle, lineWidth);
			drawLine(this.context, secondLineX, yHeight - 20, secondLineX, yHeight + 60, strokeStyle, lineWidth);
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

class NeuralNetworkElement {
    constructor(context) {
        this.context = context;
        this.textHandler;
        this.calculator = new Calculator();
    }
}
	
// Class Weight

const WEIGHT_COLOR = 'deepskyblue';
const WEIGHT_WIDTH = 0.5;
const WEIGHT_SLOPE_MARGIN = 0.05;

let Redraw_Neural_Network_For_Weight_Hover = false;

const NEURON_RADIUS = 25;

class Weight extends NeuralNetworkElement {
	constructor(context) {
		super(context);
		this.value;
		this.mouseIsHoveringOnWeight = false;
		this.textHandler = new WeightTextHandler(context);
	}

	initializeWeight() {
		let rawValue = this.calculator.randomNumberBetween(-0.9, 0.9);
		this.value = this.calculator.roundDecimalTo(rawValue, 3);
	}

	drawWeight(startX, startY, endX, endY) {
		drawLine(this.context, startX, startY, endX, endY, WEIGHT_COLOR, WEIGHT_WIDTH);
		this.textHandler.drawWeightText(this.value, startX, startY, endX, endY);
	}

	highlightWeight(pointX, pointY, startX, startY, endX, endY, previousNeuronOutput) {
		if( pointIsOnTheLine(pointX, pointY, startX, startY, endX, endY, WEIGHT_SLOPE_MARGIN, NEURON_RADIUS) ) {
			if(this.mouseIsHoveringOnWeight == false) {
				this.mouseIsHoveringOnWeight = true;
				this.showWeightPopup(pointX, pointY, previousNeuronOutput);
			}
		} else {
			if(this.mouseIsHoveringOnWeight == true) {
				this.mouseIsHoveringOnWeight = false;
				Redraw_Neural_Network_For_Weight_Hover = true;
			}	
		}
	}

	showWeightPopup(pointX, pointY, previousNeuronOutput) {
		this.textHandler.drawWeightPopup(pointX, pointY, this.value, previousNeuronOutput);
	}

	getValue() {
		return this.value;
	}
}

// Class Neuron

const NEURON_FILL_STYLE = 'lightyellow';
const INPUT_LAYER_NEURON_FILL_STYLE = 'papayawhip';
const NEURON_STROKE_STYLE = 'tan';
const NEURON_STROKE_WIDTH = 2;

let Redraw_Neural_Network_For_Neuron_Hover = false;

class Neuron extends NeuralNetworkElement {

	constructor(context) {
		super(context);
		this.xPosition;
		this.yPosition;

		this.incomingWeights = null; // array of Weight objects
		this.textHandler = new NeuronTextHandler(context);
		this.output = this.calculator.randomDecimalBetween(0, 1, 2);
		this.mouseIsHoveringOnNeuron = false;
	}

	getIncomingWeights() {
		return incomingWeights;
	}

	getIncomingWeightsAsValues() {
		let values = new Array(this.incomingWeights.length);
		for(var i=0; i < values.length; i++) {
			values[i] = this.incomingWeights[i].getValue();
		}
		return values;
	}

	setCenterLocation(x, y) {
		this.xPosition = x;
		this.yPosition = y;
	}

	initializeWeights(numWeights) {
		this.incomingWeights = new Array(numWeights);
		for(var i=0; i < numWeights; i++) {
			this.incomingWeights[i] = new Weight(this.context);
			this.incomingWeights[i].initializeWeight();
		}
	}

	setOutputAsRandomIntegerBetween(low, high) {
		this.output = this.calculator.randomIntegerBetween(low, high);
	}

	calculateOutput(previousLayer) {
		if(this.incomingWeights != null && previousLayer != null) {
			let values = this.getIncomingWeightsAsValues();
			let previousLayerOutputs = previousLayer.getOutputsAsArray();
			let dotProduct = this.calculator.dotProduct(values, previousLayerOutputs); 
			let outputValue = this.calculator.sigmoid(dotProduct);
			this.output = this.calculator.roundDecimalTo(outputValue, 2);
		}
	}

	drawWeights(previousLayer) {
		for(var i=0; i < previousLayer.numNeurons(); i++) {
			var startingNeuron = previousLayer.getIthNeuron(i);
			this.connectTo(startingNeuron, this.incomingWeights[i]);
		}
	}

	connectTo(neuron, weight) {
		weight.drawWeight(neuron.xPosition, neuron.yPosition, this.xPosition, this.yPosition);
	}

	drawNeuron() {
		if(this.incomingWeights == null) {
			drawCircle(this.context, this.xPosition, this.yPosition, NEURON_RADIUS, INPUT_LAYER_NEURON_FILL_STYLE, NEURON_STROKE_STYLE, NEURON_STROKE_WIDTH);
		} else {
			drawCircle(this.context, this.xPosition, this.yPosition, NEURON_RADIUS, NEURON_FILL_STYLE, NEURON_STROKE_STYLE, NEURON_STROKE_WIDTH);
		}
		this.textHandler.drawNeuronInternalText(this.output, this.xPosition, this.yPosition);
	}

	highlightNeuron(pointX, pointY, previousLayer) {
		if( pointIsWithinCircle(pointX, pointY, this.xPosition, this.yPosition, NEURON_RADIUS )) {
			this.mouseIsHoveringOnNeuron = true;
			this.showNeuronPopup(previousLayer);
		} else {
			if(this.mouseIsHoveringOnNeuron == true) {
				this.mouseIsHoveringOnNeuron = false;
				Redraw_Neural_Network_For_Neuron_Hover = true;
			}
		}
	}

	highlightSelectedWeight(pointX, pointY, previousLayer) {
		if(this.incomingWeights != null) {
			for(var i=0; i < this.incomingWeights.length; i++) {
				var previousNeuron = previousLayer.getIthNeuron(i);
				this.incomingWeights[i].highlightWeight(pointX, pointY, previousNeuron.getXPosition(), previousNeuron.getYPosition(), 
												   this.getXPosition(), this.getYPosition(), previousNeuron.getOutput() );
			}
		}
	}

	showNeuronPopup(previousLayer) {
		if(previousLayer == null) {
			this.textHandler.drawFirstLayerNeuronPopup(this.xPosition, this.yPosition, NEURON_RADIUS, this.output);
		} else {
			let weightValuesArray = this.getIncomingWeightsAsValues();
			let previousLayerOutputs = previousLayer.getOutputsAsArray();
			this.textHandler.drawNeuronPopup(this.xPosition, this.yPosition, NEURON_RADIUS, weightValuesArray, previousLayerOutputs);
		}
	}

	getXPosition() {
		return this.xPosition;
	}

	getYPosition() {
		return this.yPosition;
	}

	getOutput() {
		return this.output;
	}
}

// Class NeuronLayer

const VERTICAL_DISTANCE_BETWEEN_NEURON_CENTERS = 140;

class NeuronLayer extends NeuralNetworkElement {

	constructor(context, numNeuronsInLayer) {
		super(context);
		this.neurons = new Array(numNeuronsInLayer);

		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i] = new Neuron(this.context);
		}

		this.previousLayer = null;
	}

	setPreviousLayer(previousNeuronLayer) {
		this.previousLayer = previousNeuronLayer;
	}

	initializeNeurons(topNeuronLocation) {
		this.neurons[0].setCenterLocation(topNeuronLocation.x, topNeuronLocation.y);
		if(this.numNeurons() > 1) {
			for(var i=1; i < this.neurons.length; i++) {
				this.neurons[i].setCenterLocation(topNeuronLocation.x, topNeuronLocation.y + i*VERTICAL_DISTANCE_BETWEEN_NEURON_CENTERS);
			}
		}

		if(this.previousLayer != null) {
			for(var i=0; i < this.neurons.length; i++) {
				this.neurons[i].initializeWeights(this.previousLayer.numNeurons());
			}
		}

		if(this.previousLayer == null) {
			for(var i=0; i < this.neurons.length; i++) {
				this.neurons[i].setOutputAsRandomIntegerBetween(-5,5);
			}	
		}

		if(this.previousLayer != null) {
			for(var i=0; i < this.neurons.length; i++) {
				this.neurons[i].calculateOutput(this.previousLayer);
			}
		}
	}

	drawWeights() {
		if(this.previousLayer != null) {
			for(var i=0; i < this.neurons.length; i++) {
				this.neurons[i].drawWeights(this.previousLayer);
			}
		}
	}

	drawNeurons() {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].drawNeuron();
		}
	}

	locateNeuron(x,y) {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].highlightNeuron(x, y, this.previousLayer);
		}
	}

	locateWeight(x,y) {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].highlightSelectedWeight(x, y, this.previousLayer);
		}
	}

	getIthNeuron(i) {
		return this.neurons[i];
	}

	getOutputsAsArray() {
		let outputs = new Array(this.numNeurons());
		for(var i=0; i < outputs.length; i++) {
			outputs[i] = this.neurons[i].output;
		}
		return outputs;
	}

	numNeurons() {
		return this.neurons.length;
	}
}


// Class NeuralNetwork

let NEURONS_IN_EACH_LAYER = [2, 3, 2, 1];
let TOP_NEURON_LOCATIONS = [{x:150, y:180}, {x:400,y:130}, {x:650,y:180}, {x:900,y:230}];

class NeuralNetwork extends NeuralNetworkElement {
	constructor(context) {
		super(context);
		this.neuronLayers = new Array();
		this.textHandler = new NeuralNetworkTextHandler(context);
	}

	initializeNeuronLayers() {
		let neuronsInEachLayer = NEURONS_IN_EACH_LAYER;
		
		for(var i=0; i < neuronsInEachLayer.length; i++) {
			this.neuronLayers[i] = new NeuronLayer(this.context, neuronsInEachLayer[i]);
		}

		for(var i=1; i < this.neuronLayers.length; i++) {
			this.neuronLayers[i].setPreviousLayer(this.neuronLayers[i-1]);
		}

		// if neuronsInEachLayer.length != TOP_NEURON_LOCATIONS.length throw Exception
		for(var i=0; i < this.neuronLayers.length; i++) {
			this.neuronLayers[i].initializeNeurons(TOP_NEURON_LOCATIONS[i]);
		}
	}

	drawNeuralNetwork() {
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		for(var i=0; i < this.neuronLayers.length; i++) {
			this.neuronLayers[i].drawWeights();
		}

		for(var i=0; i < this.neuronLayers.length; i++) {
			this.neuronLayers[i].drawNeurons();
		}

		this.textHandler.handleNeuralNetworkText(TOP_NEURON_LOCATIONS);
	}

	highlightWeightOrNeuronOnMouseHover(x,y) {
		this.highlightWeightOnMouseHover(x,y);
		this.highlightNeuronOnMouseHover(x,y);
	}

	highlightWeightOnMouseHover(x,y) {
		for(var i=0; i < this.neuronLayers.length; i++) {
			this.neuronLayers[i].locateWeight(x,y);
			if(Redraw_Neural_Network_For_Weight_Hover == true) {
				this.drawNeuralNetwork();
				Redraw_Neural_Network_For_Weight_Hover = false;
			} 
		}
	}

	highlightNeuronOnMouseHover(x,y) {
		for(var i=0; i < this.neuronLayers.length; i++) {
			this.neuronLayers[i].locateNeuron(x,y);
			if(Redraw_Neural_Network_For_Neuron_Hover == true) {
				this.drawNeuralNetwork();
				Redraw_Neural_Network_For_Neuron_Hover = false;
			} 
		}
	}
}

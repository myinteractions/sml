
/**
 * Copyright 2022 by Sandeep Jain. All Rights Reserved.
 */

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

	calculateXORErrorFunctionValue(xorOutputDataContainer) {
		return 0.5 * ( this.getDifferenceSquared(0, xorOutputDataContainer[0]) + 
					   this.getDifferenceSquared(1, xorOutputDataContainer[1]) +
					   this.getDifferenceSquared(1, xorOutputDataContainer[2]) +
					   this.getDifferenceSquared(0, xorOutputDataContainer[3]) );
	}

	getDifferenceSquared(value_1, value_2) {
		return (value_1 - value_2) ** 2;
	}

	getMaximumAbsoluteDifferenceBetweenArrayValues(array_1, array_2) {
		var maximumAbsoluteDifference = 0, absoluteDifference;
		for(var i=0; i < array_1.length; i++) {
			absoluteDifference = Math.abs(array_1[i] - array_2[i]);
			maximumAbsoluteDifference = Math.max(absoluteDifference, maximumAbsoluteDifference);
		}
		return maximumAbsoluteDifference;
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

class EncapsulatedNumber {
	constructor(value, roundTo) {
		this.calculator = new Calculator();
		this.value = this.calculator.roundDecimalTo(value, roundTo);
	}

	getValue() {
		return this.value;
	}

	getValueAsString() {
		return this.value.toString();
	}

	setValue(value, roundTo) {
		this.value = this.calculator.roundDecimalTo(value, roundTo);
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

const WEIGHT_EDITOR_FILL = "white";
const WEIGHT_EDITOR_STROKE = "deepskyblue";
const WEIGHT_EDITOR_LINE_WIDTH = 1;

class WeightTextHandler extends TextHandler {
	constructor(context) {
		super(context);
		this.boundingShape = new BoundingRectangle(context);

		// XOR Neural Network Variables
		this.textLine = new TextLine();
		this.textCursor = new TextCursor();
	    this.drawingSurfaceImageData;
	    this.encapsulatedWeightValue;
	    this.enteredWeightString;

		this.blinkingInterval;
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
		let width = textMetrics.width + 20;
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

	// XOR Neural Network Functions
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

const NEURAL_NETWORK_RECTANGLE_STROKE = "lavender";
const NEURAL_NETWORK_RECTANGLE_FILL = "lavenderblush";
const NEURAL_NETWORK_RECTANGLE_LINE_WIDTH = "1";

class NeuralNetworkTextHandler extends TextHandler {
	constructor(context) {
		super(context);
		this.boundingShape = new BoundingRectangle(context);
	}

	drawBoundingRectangle(text, coordinates) {
		this.context.font = MAIN_TEXT_FONT;
		let maxLengthIndex = this.calculator.getStringMaxLengthIndex(text);
		let textMetrics = this.context.measureText(text[maxLengthIndex]);
		let width = textMetrics.width + 20;
		let height = (this.context.measureText('M').width + 8) * text.length + 12;
		this.boundingShape.drawRoundedRectangle(coordinates.x-7, coordinates.y-14, width, height, 5, NEURAL_NETWORK_RECTANGLE_STROKE, 
			                                    NEURAL_NETWORK_RECTANGLE_FILL, NEURAL_NETWORK_RECTANGLE_LINE_WIDTH);
	}

	showIterations(topNeuronLocations, numIterations) {
		let text = ["Iterations: " + numIterations];
		let coordinates = this.getIterationsTextCoordinates(topNeuronLocations);
		this.context.font = MAIN_TEXT_FONT;
		// this.drawBoundingRectangle(text, coordinates);
		this.drawPopupText(text, coordinates);
	}

	getIterationsTextCoordinates(topNeuronLocations) {
		let xCoordinate = topNeuronLocations[topNeuronLocations.length-1].x + 90;
		let yCoordinate = topNeuronLocations[topNeuronLocations.length-1].y - 180;
		return {x: xCoordinate, y: yCoordinate};
	}

	drawXORErrorOutputText(topNeuronLocations, xorOutputDataContainer) {
		let text = new Array();
		text[0] = "Error = "
		text[1] = "(1/2) x ["
		text[2] = this.getErrorStringFragment(0, xorOutputDataContainer[0]) + " +";
		text[3] = this.getErrorStringFragment(1, xorOutputDataContainer[1]) + " +";
		text[4] = this.getErrorStringFragment(1, xorOutputDataContainer[2]) + " +";
		text[5] = this.getErrorStringFragment(0, xorOutputDataContainer[3]) + " ]";
		text[6] = "= " + this.calculator.roundDecimalTo(this.calculator.calculateXORErrorFunctionValue(xorOutputDataContainer), 2);
		let coordinates = this.getXORErrorTextCoordinates(topNeuronLocations);
		this.context.font = MAIN_TEXT_FONT;
		// this.drawBoundingRectangle(text, coordinates);
		this.drawPopupText(text, coordinates);
	}

	getXORErrorTextCoordinates(topNeuronLocations) {
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
		// this.drawBoundingRectangle(text, coordinates);
		this.drawPopupText(text, coordinates);
	}

	getOutputsTextCoordinates(topNeuronLocations) {
		let xCoordinate = topNeuronLocations[topNeuronLocations.length-1].x;;
		let yCoordinate = topNeuronLocations[topNeuronLocations.length-1].y + 60;
		return {x: xCoordinate, y: yCoordinate};
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
		this.mouseIsHoveringOnWeight = false;
		this.textHandler = new WeightTextHandler(context);

		// Modified for XOR Neural Network
		this.encapsulatedWeightValue;
		this.previousValue;
	}

	initializeWeight() {
		let rawValue = this.calculator.randomNumberBetween(-2.0, 2.0);
		this.encapsulatedWeightValue = new EncapsulatedNumber(rawValue, 3);
	}

	drawWeight(startX, startY, endX, endY) {
		drawLine(this.context, startX, startY, endX, endY, WEIGHT_COLOR, WEIGHT_WIDTH);
		this.textHandler.drawWeightText(this.encapsulatedWeightValue.getValue(), startX, startY, endX, endY);
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

	getValue() {
		return this.encapsulatedWeightValue.getValue();
	}

/*
	showWeightPopup(pointX, pointY, previousNeuronOutput) {
		this.textHandler.drawWeightPopup(pointX, pointY, this.value, previousNeuronOutput);
	}
*/

	// Modified for XOR Neural Network
	showWeightPopup(pointX, pointY, previousNeuronOutput) {
		this.textHandler.drawWeightPopupForAcceptingNewWeight(pointX, pointY, this.encapsulatedWeightValue);
	}

	// XOR Neural Network Functions
	propagateKeypressEventToHighlightedWeight(eventObject) {
		if(this.mouseIsHoveringOnWeight == true) {
			this.textHandler.handleKeypressEvent(eventObject);
		}
	}

	propagateKeydownEventToHighlightedWeight(eventObject) {
		if(this.mouseIsHoveringOnWeight == true) {
			this.textHandler.handleKeydownEvent(eventObject);
		}
	}

	// For XOR Neural Network Training

	updateWeight( nextNeuronDelta, previousNeuronOutput, learningRate ) {
		this.previousValue = this.getValue();
		let updatedValue = this.previousValue + ( learningRate * nextNeuronDelta * previousNeuronOutput );
		this.encapsulatedWeightValue.setValue(updatedValue, 3);
	}
}

// Class Neuron

const NEURON_FILL_STYLE = 'lightyellow';
const INPUT_LAYER_NEURON_FILL_STYLE = 'papayawhip';
const NEURON_STROKE_STYLE = 'tan';
const NEURON_STROKE_WIDTH = 2;

let Redraw_Neural_Network_For_Neuron_Hover = false;

class Neuron extends NeuralNetworkElement {

	constructor(context, iIndex) {
		super(context);
		this.xPosition;
		this.yPosition;

		this.incomingWeights = null; // array of Weight objects
		this.textHandler = new NeuronTextHandler(context);
		this.output = this.calculator.randomDecimalBetween(0, 1, 2);
		this.mouseIsHoveringOnNeuron = false;

		// For XOR Neural Network
		this.temporaryOutput;

		// For XOR Neural Network Training
		this.delta;
		this.myIndex = iIndex;
	}

	getIncomingWeights() {
		return this.incomingWeights;
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

	drawNeuron(previousLayer) {
		if(this.incomingWeights == null) {
			drawCircle(this.context, this.xPosition, this.yPosition, NEURON_RADIUS, INPUT_LAYER_NEURON_FILL_STYLE, NEURON_STROKE_STYLE, NEURON_STROKE_WIDTH);
		} else {
			drawCircle(this.context, this.xPosition, this.yPosition, NEURON_RADIUS, NEURON_FILL_STYLE, NEURON_STROKE_STYLE, NEURON_STROKE_WIDTH);
		}
		this.calculateOutput(previousLayer);
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

	setOutput(output) {
		this.output = output;
	}

	// XOR Neural Network Functions
	propagateKeypressEventToHighlightedWeight(eventObject) {
		if(this.incomingWeights != null) {
			for(var i=0; i < this.incomingWeights.length; i++) {
				this.incomingWeights[i].propagateKeypressEventToHighlightedWeight(eventObject);
			}
		}
	}

	propagateKeydownEventToHighlightedWeight(eventObject) {
		if(this.incomingWeights != null) {
			for(var i=0; i < this.incomingWeights.length; i++) {
				this.incomingWeights[i].propagateKeydownEventToHighlightedWeight(eventObject);
			}
		}
	}

	setTemporaryOutput(temporaryOutput) {
		this.temporaryOutput = temporaryOutput;
	}

	getTemporaryOutput() {
		return this.temporaryOutput;
	}

	calculateTemporaryOutput(previousLayer) {
		if(this.incomingWeights != null && previousLayer != null) {
			let values = this.getIncomingWeightsAsValues();
			let previousLayerTemporaryOutputs = previousLayer.getTemporaryOutputsAsArray();
			let dotProduct = this.calculator.dotProduct(values, previousLayerTemporaryOutputs); 
			let temporaryOutputValue = this.calculator.sigmoid(dotProduct);
			this.temporaryOutput = this.calculator.roundDecimalTo(temporaryOutputValue, 2);
		}
	}

	// For XOR Neural Network Training
	getDelta() {
		return this.delta;
	}

	calculateOutputLayerNeuronDelta(desiredOutputValue) {
		let theDelta = this.output * (1 - this.output) * (desiredOutputValue - this.output);
		this.delta = this.calculator.roundDecimalTo(theDelta, 6);
	}

	calculateHiddenLayerNeuronDelta(nextLayer) {
		if(nextLayer != null) {
			let values = this.getOutgoingWeightValuesToEachNextLayerNeuron(nextLayer);
			let nextLayerDeltas = nextLayer.getDeltasAsArray();
			let dotProduct = this.calculator.dotProduct(values, nextLayerDeltas);
			let theDelta = this.output * (1 - this.output) * dotProduct;
			this.delta = this.calculator.roundDecimalTo(theDelta, 6);
		}
	}

	getOutgoingWeightValuesToEachNextLayerNeuron(nextLayer) {
		let weightValues = new Array(nextLayer.numNeurons());
		for(var j=0; j < nextLayer.numNeurons(); j++) {
			var neuronIncomingWeights = nextLayer.neurons[j].getIncomingWeights();
			weightValues[j] = neuronIncomingWeights[this.myIndex].getValue();
		}
		return weightValues;
	}

	updateNeuronWeights(previousLayer, learningRate) {
		for(var i=0; i < previousLayer.numNeurons(); i++) {
			this.incomingWeights[i].updateWeight( this.getDelta(), previousLayer.neurons[i].getOutput(), learningRate );
		}
	}
}

// Class NeuronLayer

const VERTICAL_DISTANCE_BETWEEN_NEURON_CENTERS = 140;

class NeuronLayer extends NeuralNetworkElement {

	constructor(context, numNeuronsInLayer) {
		super(context);
		this.neurons = new Array(numNeuronsInLayer);

		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i] = new Neuron(this.context, i);
		}

		this.previousLayer = null;

		// For XOR Neural Network Training
		this.nextLayer = null;
	}

	setPreviousLayer(previousNeuronLayer) {
		this.previousLayer = previousNeuronLayer;
	}

	initializeNeurons(topNeuronLocation, inputArray) {
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

		// Code that uses the inputArray argument to initialize the neural network inputs
		if(this.previousLayer == null) {
			for(var i=0; i < this.neurons.length; i++) {
				this.neurons[i].setOutput( inputArray[i] );
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
			this.neurons[i].drawNeuron(this.previousLayer);
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

	// XOR Neural Network Functions
	propagateKeypressEventToHighlightedWeight(eventObject) {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].propagateKeypressEventToHighlightedWeight(eventObject);
		}
	}

	propagateKeydownEventToHighlightedWeight(eventObject) {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].propagateKeydownEventToHighlightedWeight(eventObject);
		}
	}

	setIthNeuronValue(i, value) {
		if( i < this.numNeurons() ) {
			this.neurons[i].setOutput(value);
		}
	}

	setIthNeuronTemporaryOutput(i, temporaryOutput) {
		if( i < this.numNeurons() ) {
			this.neurons[i].setTemporaryOutput(temporaryOutput);
		}
	}

	getTemporaryOutputsAsArray() {
		let temporaryOutputs = new Array(this.numNeurons());
		for(var i=0; i < temporaryOutputs.length; i++) {
			temporaryOutputs[i] = this.neurons[i].temporaryOutput;
		}
		return temporaryOutputs;
	}

	calculateTemporaryOutputs() {
		if(this.previousLayer != null) {
			for(var i=0; i < this.numNeurons(); i++) {
				this.neurons[i].calculateTemporaryOutput(this.previousLayer);
			}
		}
	}

	// XOR Neural Network Training
	setNextLayer(nextNeuronLayer) {
		this.nextLayer = nextNeuronLayer;
	}

	getDeltasAsArray() {
		let deltas = new Array(this.numNeurons());
		for(var i=0; i < deltas.length; i++) {
			deltas[i] = this.neurons[i].delta;
		}
		return deltas;
	}

	calculateOutputLayerDeltas(desiredOutputValuesArray) {
		for(var i=0; i < this.numNeurons(); i++) {
			this.neurons[i].calculateOutputLayerNeuronDelta(desiredOutputValuesArray[i]);
		}
	}

	calculateHiddenLayerDeltas() {
		for(var i=0; i < this.numNeurons(); i++) {
			this.neurons[i].calculateHiddenLayerNeuronDelta(this.nextLayer);
		}
	}

	updateLayerWeights(learningRate) {
		for(var i=0; i < this.numNeurons(); i++) {
			this.neurons[i].updateNeuronWeights(this.previousLayer, learningRate);
		}
	}

	runLayerForwards() {
		if(this.previousLayer != null) {
			for(var i=0; i < this.numNeurons(); i++) {
				this.neurons[i].calculateOutput(this.previousLayer);
			}
		}
	}

	setNeuronOutputValues(valuesArray) {
		if( valuesArray.length === this.numNeurons() ) {
			for(var i = 0; i < this.numNeurons(); i++) {
				this.setIthNeuronValue(i, valuesArray[i]);
			}
		}
	}
}

// Class NeuralNetwork

const NEURONS_IN_EACH_LAYER = [2, 3, 1];
const TOP_NEURON_LOCATIONS = [{x:150, y:180}, {x:400,y:130}, {x:650,y:260}];
const DEFAULT_LEARNING_RATE = 0.15;

class TrainingData {
	constructor(numberOfExamples) {
		this.inputs = new Array(numberOfExamples);
		this.outputs = new Array(numberOfExamples);
		this.myNumberOfExamples = numberOfExamples;
	}

	numberOfExamples() {
		return this.myNumberOfExamples;
	}

	getIthInputArray(i) {
		return this.inputs[i];
	}

	getIthOutputArray(i) {
		return this.outputs[i];
	}
}

class XORNeuralNetwork extends NeuralNetworkElement {
	constructor(context) {
		super(context);
		this.neuronLayers = new Array();
		this.textHandler = new NeuralNetworkTextHandler(context);

		// XOR Neural Network
		this.xorNextStep = 0;
		this.xorOutputDataContainer = new Array(4);
		this.trainingData;
		this.numberOfLayers;

		this.theLearningRate = DEFAULT_LEARNING_RATE;

		this.Is_Running = false;
		this.iterations = 0;
		this.totalIterations = 0;
		this.errorMargin;
		this.intervalId;
		this.selectedExampleIndex;

		this.initializeTrainingData();
	}

	initializeTrainingData() {
		this.trainingData = new TrainingData(4);

		this.trainingData.inputs[0] = [0,0];
		this.trainingData.outputs[0] = [0];

		this.trainingData.inputs[1] = [0,1];
		this.trainingData.outputs[1] = [1];

		this.trainingData.inputs[2] = [1,0];
		this.trainingData.outputs[2] = [1];

		this.trainingData.inputs[3] = [1,1];
		this.trainingData.outputs[3] = [0];
	}

	initializeNeuronLayers() {
		this.numberOfLayers = NEURONS_IN_EACH_LAYER.length;
		let neuronsInEachLayer = NEURONS_IN_EACH_LAYER;
		this.xorNextStep = 0;
		this.totalIterations = 0;
		this.selectedExampleIndex = this.selectRandomExampleIndex();
		
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i] = new NeuronLayer(this.context, neuronsInEachLayer[i]);
		}

		for(var i=1; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].setPreviousLayer(this.neuronLayers[i-1]);
		}

		for(var i=0; i < this.numberOfLayers-1; i++) {
			this.neuronLayers[i].setNextLayer(this.neuronLayers[i+1]);
		}

		// if neuronsInEachLayer.length != TOP_NEURON_LOCATIONS.length throw Exception
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].initializeNeurons(TOP_NEURON_LOCATIONS[i], this.trainingData.getIthInputArray(this.selectedExampleIndex));
		}

		this.fillXOROutputDataContainer();
	}

	drawNeuralNetwork() {
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].drawWeights();
		}

		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].drawNeurons();
		}

		this.textHandler.handleNeuralNetworkText(TOP_NEURON_LOCATIONS);
		this.fillXOROutputDataContainer();
		this.textHandler.drawXORErrorOutputText(TOP_NEURON_LOCATIONS, this.xorOutputDataContainer);
		let actualAndDesiredOutputs = this.getActualAndDesiredOutputValues();
		this.textHandler.drawActualAndDesiredOutputs(TOP_NEURON_LOCATIONS, actualAndDesiredOutputs);
	}

	getActualAndDesiredOutputValues() {
		let actualOutputValue = this.neuronLayers[this.numberOfLayers-1].neurons[0].getOutput();
		let desiredOutputArray = this.trainingData.getIthOutputArray(this.selectedExampleIndex);
		let desiredOutputValue = desiredOutputArray[0];
		return {actual: actualOutputValue, desired: desiredOutputValue};
	}

	highlightWeightOrNeuronOnMouseHover(x,y) {
		this.highlightWeightOnMouseHover(x,y);
		this.highlightNeuronOnMouseHover(x,y);
	}

	highlightWeightOnMouseHover(x,y) {
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].locateWeight(x,y);
			if(Redraw_Neural_Network_For_Weight_Hover == true) {
				this.drawNeuralNetwork();
				Redraw_Neural_Network_For_Weight_Hover = false;
			} 
		}
	}

	highlightNeuronOnMouseHover(x,y) {
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].locateNeuron(x,y);
			if(Redraw_Neural_Network_For_Neuron_Hover == true) {
				this.drawNeuralNetwork();
				Redraw_Neural_Network_For_Neuron_Hover = false;
			} 
		}
	}

	// XOR Neural Network Functions
	propagateKeypressEventToHighlightedWeight(eventObject) {
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].propagateKeypressEventToHighlightedWeight(eventObject);
		}
	}

	propagateKeydownEventToHighlightedWeight(eventObject) {
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].propagateKeydownEventToHighlightedWeight(eventObject);
		}

		if (eventObject.keyCode === 13) { // enter key
   			this.drawNeuralNetwork();
   		}
	}

	takeXORNextStep() {
		this.selectedExampleIndex = this.xorNextStep;
		switch(this.xorNextStep) {
			case 0:
				this.setXORInputLayerValues(0, 0);
				break;
			case 1:
				this.setXORInputLayerValues(0, 1);
				break;
			case 2:
				this.setXORInputLayerValues(1, 0);
				break;
			case 3:
				this.setXORInputLayerValues(1, 1);
				break;
		}
		this.xorNextStep = this.xorNextStep + 1;
		if(this.xorNextStep == 4) {
			this.xorNextStep = 0;
		}
		this.drawNeuralNetwork();
	}

	setXORInputLayerValues(value_1, value_2) {
		this.neuronLayers[0].setIthNeuronValue(0, value_1);
		this.neuronLayers[0].setIthNeuronValue(1, value_2);
	}

	fillXOROutputDataContainer() {
		this.setXORInputLayerTemporaryValues(0, 0);
		this.propagateTemporaryValuesFromInputToOutputLayer();
		this.xorOutputDataContainer[0] = this.getXORTemporaryOutputValue();

		this.setXORInputLayerTemporaryValues(0, 1);
		this.propagateTemporaryValuesFromInputToOutputLayer();
		this.xorOutputDataContainer[1] = this.getXORTemporaryOutputValue();

		this.setXORInputLayerTemporaryValues(1, 0);
		this.propagateTemporaryValuesFromInputToOutputLayer();
		this.xorOutputDataContainer[2] = this.getXORTemporaryOutputValue();

		this.setXORInputLayerTemporaryValues(1, 1);
		this.propagateTemporaryValuesFromInputToOutputLayer();
		this.xorOutputDataContainer[3] = this.getXORTemporaryOutputValue();
	}

	getXORTemporaryOutputValue() {
		return this.neuronLayers[this.numberOfLayers-1].neurons[0].getTemporaryOutput();
	}

	setXORInputLayerTemporaryValues(value_1, value_2) {
		this.neuronLayers[0].setIthNeuronTemporaryOutput(0, value_1);
		this.neuronLayers[0].setIthNeuronTemporaryOutput(1, value_2);
	}

	propagateTemporaryValuesFromInputToOutputLayer() {
		for(var i=1; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].calculateTemporaryOutputs();
		}
	}

	// For XOR Neural Network Training
	isRunning() {
		return this.Is_Running;
	}
	
	runTraining(maxIterations, booleanAddToTotalIterations) {
		this.Is_Running = true;
		var iterations = 0;;
		do {
			iterations++;
			this.selectedExampleIndex = this.selectRandomExampleIndex();
			this.runNetworkForwards( this.trainingData.getIthInputArray(this.selectedExampleIndex) );
			this.backPropagateDeltas(this.trainingData.getIthOutputArray(this.selectedExampleIndex));
			this.updateNetworkWeights(this.theLearningRate);
		} while(iterations < maxIterations);
		if(booleanAddToTotalIterations == true) {
			this.totalIterations += iterations;
		}
		this.runNetworkForwards( this.trainingData.getIthInputArray(this.selectedExampleIndex) );
		this.backPropagateDeltas(this.trainingData.getIthOutputArray(this.selectedExampleIndex));
		this.drawNeuralNetwork();
		this.Is_Running = false;
	}

	pauseTraining() {
		this.Is_Running = false;
	}

	selectRandomExampleIndex() {
		return this.calculator.randomIntegerBetween(0, this.trainingData.numberOfExamples()-1);
	}

	runNetworkForwards(inputValuesArray) {
		this.neuronLayers[0].setNeuronOutputValues(inputValuesArray);
		for(var i=1; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].runLayerForwards();
		}
	}

	backPropagateDeltas(desiredOutputValuesArray) {
		let outputLayerIndex = this.numberOfLayers - 1;
		this.neuronLayers[outputLayerIndex].calculateOutputLayerDeltas(desiredOutputValuesArray);

		for(var i=outputLayerIndex-1; i > 0; i--) {
			this.neuronLayers[i].calculateHiddenLayerDeltas();
		}
	}

	setNeuralNetworkLearningRate(learningRate) {
		this.theLearningRate = learningRate;
	}

	updateNetworkWeights(learningRate) {
		for(var i=this.numberOfLayers-1; i > 0; i--) {
			this.neuronLayers[i].updateLayerWeights(learningRate);
		}
	}

	calculateXORError() {
		let desiredOutputsArray = [0, 1, 1, 0];
		this.fillXOROutputDataContainer();
		let error = this.calculator.getMaximumAbsoluteDifferenceBetweenArrayValues(desiredOutputsArray, this.xorOutputDataContainer);
		return error;
	}
}

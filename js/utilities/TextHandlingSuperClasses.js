

import {Calculator} from './Calculator.js';

export class BoundingShape {
	constructor(context) {
		this.context = context;
	}
}

export class BoundingRectangle extends BoundingShape {
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

export class TextHandler {

	constructor(context) {
		this.context = context;
		this.calculator = new Calculator();
		this.boundingShape = new BoundingRectangle(context);
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

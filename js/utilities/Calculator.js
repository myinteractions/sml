
export class Calculator {

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

	calculateErrorFunctionValue(trainingData, outputDataContainer) {
		return 0.5 * ( this.getDifferenceSquared(trainingData.getIthOutputValue(0), outputDataContainer[0]) +
					   this.getDifferenceSquared(trainingData.getIthOutputValue(1), outputDataContainer[1]) +
					   this.getDifferenceSquared(trainingData.getIthOutputValue(2), outputDataContainer[2]) +
					   this.getDifferenceSquared(trainingData.getIthOutputValue(3), outputDataContainer[3]) );
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

export class EncapsulatedNumber {
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

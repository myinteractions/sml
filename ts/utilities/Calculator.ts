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
 * @fileoverview  Contains the Calculator and EncapsulatedNumber classes
 *
 * @author Sandeep Jain
 */

import {TrainingData} from "../nn/TrainingData";

/*****************************************************************/
/**
 * The Calculator class implements calculations to be done on numbers or arrays.
 */
export class Calculator {

	/**
	 * Returns a random integer between the parameter low and the parameter high.
	 *
	 * @param {number} low    The starting number for the random integer
	 * @param {number} high   The ending number for the random integer
	 * @returns {number}      The random integer returned
	 */
	public randomIntegerBetween(low: number, high: number): number {
		return this.randomDecimalBetween(low, high, 0);
	}

	/**
	 * Rounds the decimal given by theNumber to the number of decimal digits given
	 * by decimalDigits.
	 *
	 * @param {number} theNumber       The decimal number to be rounded
	 * @param {number} decimalDigits   The number of digits to round to
	 * @returns {number}      		   The rounded number
	 */
	public roundDecimalTo(theNumber: number, decimalDigits: number): number {
		let intermediateNumber = theNumber * Math.pow(10, decimalDigits);
		let returnValue = Math.round(intermediateNumber)/Math.pow(10, decimalDigits);
		if(returnValue == -0) {
			returnValue = 0;
		}
		return returnValue;
	}

	/**
	 * Rounds each decimal in the array decimalArray to the number of decimal digits given
	 * by decimalDigits.
	 *
	 * @param {number[]} decimalArray  The decimal number to be rounded
	 * @param {number} decimalDigits   The number of digits to round to
	 * @returns {number[]}      	   The rounded array
	 */
	public roundArrayDecimalsTo(decimalArray: number[], decimalDigits: number): number[] {
		let roundedArray = decimalArray;
		for(var i=0; i < roundedArray.length; i++) {
			roundedArray[i] = this.roundDecimalTo(decimalArray[i], decimalDigits);
		}
		return roundedArray;
	}

	/**
	 * Returns a random decimal between the parameter low and the parameter high, rounded to a 
	 * certain number of decimal digits.
	 *
	 * @param {number} low    			 The starting number for the random decimal
	 * @param {number} high   			 The ending number for the random decimal
	 * @param {number} decimalDigits 	 The number of digits to round to
	 * @returns {number}      			 The random decimal returned
	 */
	public randomDecimalBetween(low: number, high: number, decimalDigits: number): number {
		let number = (high - low) * Math.random() + low;
		return this.roundDecimalTo(number, decimalDigits);
	}

	/**
	 * Returns a random decimal between the parameter low and the parameter high, not rounded
	 *
	 * @param {number} low    The starting number for the random decimal
	 * @param {number} high   The ending number for the random decimal
	 * @returns {number}      The random decimal returned
	 */
	public randomNumberBetween(low: number, high: number): number {
		return (high - low) * Math.random() + low;
	}

	/**
	 * Returns the dot product between two arrays. The dot product is the overall sum
	 * of the element wise products between the two arrays.
	 *
	 * @param {number[]} array1    The first array
	 * @param {number[]} array2    The second array
	 * @returns {number}      	   The dot product
	 */
	public dotProduct(array1: number[], array2: number[]): number {
		var dotProduct = 0;
		if(array1.length == array2.length) {
			for(var i=0; i < array1.length; i++) {
				dotProduct = dotProduct + array1[i] * array2[i];
			}
		}
		return dotProduct;
	}

	/**
	 * Returns the sigmoid of a value, defined as 1/(1+e^(-value))
	 *
	 * @param {number} value    The numerical value
	 * @returns {number}      	The sigmoid
	 */
	public sigmoid(value: number): number {
		return 1/(1+ Math.exp(-value));
	}

	/**
	 * Returns the sum of all the elements of an array
	 *
	 * @param {number[]} array  The array
	 * @returns {number}      	The sum of the elements of the array
	 */
	public arraySum(array: number[]): number {
		let sum = 0;
		for(var i=0; i < array.length; i++) {
			sum += array[i];
		}
		return sum;
	}

	/**
	 * Returns the index into an array of strings, for which the indexed string has the
	 * maximum length of all the strings in the array.
	 *
	 * @param {number[]} stringArray  The array of strings
	 * @returns {number}      	      The index for the string with maximum length
	 */
	public getStringMaxLengthIndex(stringArray: string[]): number {
		let  maxStringLength = 0, index = 0;
		for(var i=0; i < stringArray.length; i++) {
			if(stringArray[i].length > maxStringLength) {
				maxStringLength = stringArray[i].length;
				index = i;

			}
		}
		return index;
	}

	/**
	 * Calculates the neural network error function value for training a neural network. Note that this
	 * method assumes that it is getting 4 training samples, for 1 neural network output neuron. The
	 * desired outputs are contained in the trainingData object, and the actual outputs are contained
	 * in the outputDataContainer array.
	 *
	 * @param {TrainingData} trainingData     The object containing the input and output training samples
	 * @param {number[]} outputDataContainer  The actual outputs
	 * @returns {number} The error function value, which is half the sum of the squared differences between the
	 *                   actual and desired outputs for each of 4 training samples.
	 */
	public calculateErrorFunctionValue(trainingData: TrainingData, outputDataContainer: number[]): number {
		return 0.5 * ( this.getDifferenceSquared(trainingData.getIthOutputValue(0), outputDataContainer[0]) +
					   this.getDifferenceSquared(trainingData.getIthOutputValue(1), outputDataContainer[1]) +
					   this.getDifferenceSquared(trainingData.getIthOutputValue(2), outputDataContainer[2]) +
					   this.getDifferenceSquared(trainingData.getIthOutputValue(3), outputDataContainer[3]) );
	}

	/**
	 * Returns the square of the difference between two numbers
	 *
	 * @param {number} value_1   The first numerical value
	 * @param {number} value_2   The second numerical value
	 * @returns {number}      	 The square of the difference between them
	 */
	public getDifferenceSquared(value_1: number, value_2: number): number {
		return (value_1 - value_2) ** 2;
	}

	/**
	 * Given 2 arrays, returns the maximum of the absolute value of the difference between corresponding
	 * elements of each array.
	 *
	 * @param {number} array_1   The first array
	 * @param {number} array_2   The second array
	 * @returns {number}      	 The maximum of the absolute value of the 
	 */
	public getMaximumAbsoluteDifferenceBetweenArrayValues(array_1: number[], array_2: number[]): number {
		var maximumAbsoluteDifference = 0, absoluteDifference = 0;
		for(var i=0; i < array_1.length; i++) {
			absoluteDifference = Math.abs(array_1[i] - array_2[i]);
			maximumAbsoluteDifference = Math.max(absoluteDifference, maximumAbsoluteDifference);
		}
		return maximumAbsoluteDifference;
	}
}

/*****************************************************************/
/**
 * The purpose of the EncapsulatedNumber class is to serve as a wrapper around
 * a primitive number type. It includes a Calculator class to round the contained
 * number to a specified number of decimal places.
 */
export class EncapsulatedNumber {

	/**
	 * A private Calculator, to perform operations on the encapsulated number
	 */
	private calculator: Calculator;

	/**
	 * The encapsulated number
	 */
	private value: number;

	/**
	 * @param {number} value       The value to be encapsulated
	 * @param {number} roundTo     The number of digits to round the decimal value to
	 * @constructor
	 */
	constructor(value: number, roundTo: number) {
		this.calculator = new Calculator();
		this.value = this.calculator.roundDecimalTo(value, roundTo);
	}

	/**
	 * @returns {number}	The encapsulated value 
	 */
	public getValue(): number {
		return this.value;
	}

	/**
	 * @returns {number}	The encapsulated value, as a string
	 */
	public getValueAsString(): string {
		return this.value.toString();
	}

	/**
	 * Sets the encapsulated value, to be rounded to a specified number of digits.
	 * 
	 * @param {number} value The value to be encapsulated
	 * @param {number} roundTo The number of digits to round the decimal value to
	 */
	public setValue(value: number, roundTo: number): void {
		this.value = this.calculator.roundDecimalTo(value, roundTo);
	}
}

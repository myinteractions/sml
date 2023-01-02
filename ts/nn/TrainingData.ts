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
 * @fileoverview  Contains the TrainingData class, which manages the data on which the neural network
 * 				  is to be trained.
 *
 * @author Sandeep Jain
 */

/*****************************************************************/
/**
 * The TrainingData class maintains the data on which the neural network is to be trained,
 * for this application. This application assumes that there will be 2 input neurons,
 * and 1 output neuron.
 */
export class TrainingData {

	/**
	 * The number of examples in the training set
	 */
	private myNumberOfExamples: number;

	/**
	 * The set of values fed into the input neurons
	 */
	private inputs: number[][];

	/**
	 * The training values that the output neurons are to be trained on
	 */
	private outputs: number[][];

	constructor() {
		this.myNumberOfExamples = 4;
		this.inputs = new Array(this.myNumberOfExamples);
		this.outputs = new Array(this.myNumberOfExamples);
	}

	/**
	 * @returns Returns the number of examples
	 */
	public numberOfExamples(): number {
		return this.myNumberOfExamples;
	}

	/**
	 * Given a parameter i, returns the ith array of input training values
	 * 
	 * @param {number} i The set of input training values to return
	 * @returns {number[]} The ith array of training values
	 */
	public getIthInputArray(i: number): number[] {
		return this.inputs[i];
	}

	/**
	 * Given a parameter i, returns the ith array of output training values
	 * 
	 * @param {number} i The set of output training values to return
	 * @returns {number[]} The ith array of training values
	 */
	public getIthOutputArray(i: number): number[] {
		return this.outputs[i];
	}

	/**
	 * This application assumes only 1 output training neuron. Given a parameter i, returns
	 * the training value of that output neuron.
	 * 
	 * @param {number} i The ith output value to return
	 * @returns {number} The output value
	 */
    public getIthOutputValue(i: number): number {
        return this.outputs[i][0];
    }

	/**
	 * Sets the input and output values corresponding to the training data for this application
	 */
    public initializeForThisApplication(): void {
		this.inputs[0] = [0,0];
		this.outputs[0] = [0];

		this.inputs[1] = [0,1];
		this.outputs[1] = [1];

		this.inputs[2] = [1,0];
		this.outputs[2] = [1];

		this.inputs[3] = [1,1];
		this.outputs[3] = [0];
    }
}
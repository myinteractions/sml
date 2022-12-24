
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
 * @fileoverview  Contains the BasicNeuralNetworkElement, BasicWeight, BasicNeuron, BasicNeuronLayer,
 * 				  and BasicNeuralNetwork classes. A BasicNeuralNetwork can only display a neural network,
 * 				  not train it. Values from the input layer feed forward to the output layer being 
 * 				  multiplied by the weights and transformed by the neurons. If you hover over the weights
 * 				  or neurons you see descriptive popup rectangles containing text that describe what
 * 				  the weight or neuron is doing. But that is all that a basic neural network can do.
 *
 * @author Sandeep Jain
 */

import {Coordinates, Geometry} from '../utilities/Geometry.js';
import {Calculator} from '../utilities/Calculator.js';
import {BasicWeightTextHandler, BasicNeuronTextHandler, BasicNeuralNetworkTextHandler} from './BasicTextHandlers.js';
import {INPUT_LAYER_NEURON_FILL_STYLE} from './BasicTextHandlers.js';

/*****************************************************************/
/**
 * The abstract BasicNeuralNetworkElement class contains objects that are used by all the
 * derived neural network classes.
 */
abstract class BasicNeuralNetworkElement {

	/**
	 * The context object is responsible for all drawing operations on the canvas
	 */	
	protected context: CanvasRenderingContext2D;

	/**
	 * The Calculator implements calculations to be done on numbers or arrays
	 */
	protected calculator: Calculator;

	/**
	 * The Geometry class is responsible for basic geometrical operations
	 */
	protected geometry: Geometry;

	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.calculator = new Calculator();
		this.geometry = new Geometry(context);
    }
}

/**
 * The difference between the slope of the line representing the weight and the slope of the line 
 * from the coordinates of the mouse to the beginning of the weight line.
 */
export const WEIGHT_SLOPE_MARGIN = 0.05;

/**
 * The color of the line that represents the weight
 */
const WEIGHT_COLOR = 'deepskyblue';

/**
 * The width of the line that represents the weight
 */
const WEIGHT_WIDTH = 0.5;

/**
 * A global variable which is read and set in the BasicWeight class and the BasicNeuralNetwork class.
 */
let Redraw_Neural_Network_For_Weight_Hover = false;

/*****************************************************************/
/**
 * The BasicWeight class implements a weight which has a value, which displays
 * itself as a line connecting two neurons with the value on top of it, and which
 * throws up some self descriptive text when the user's mouse hovers on top of the
 * weight line.
 */
export class BasicWeight extends BasicNeuralNetworkElement {

	/**
	 * True is the mouse is hovering over the weight, false otherwise
	 */
	protected  mouseIsHoveringOnWeight: boolean;

	/**
	 * Displays all weight related text and the enclosing bounding rectangles
	 */
	protected textHandler: BasicWeightTextHandler;

	/**
	 * The numerical value of the weight
	 */
	private value: number;

	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */
	constructor(context: CanvasRenderingContext2D) {
		super(context);
		this.value;
		this.mouseIsHoveringOnWeight = false;
		this.textHandler = new BasicWeightTextHandler(context);
	}

	/**
	 * Initializes the weight value to a random number
	 */
	public initializeWeight(): void {
		let rawValue = this.calculator.randomNumberBetween(-0.9, 0.9);
		this.value = this.calculator.roundDecimalTo(rawValue, 3);
	}

	/**
	 * Draws the line corresponding to the weight and also the value of the weight, to be sitting on the
	 * line
	 * 
	 * @param {number} startX The x coordinate of the starting point of the weight
	 * @param {number} startY The y coordinate of the starting point of the weight
	 * @param {number} endX The x coordinate of the ending point of the weight
	 * @param {number} endY The y coordinate of the ending point of the weight
	 */
	public drawWeight(startX: number, startY: number, endX: number, endY: number): void {
		this.geometry.drawLine(startX, startY, endX, endY, WEIGHT_COLOR, WEIGHT_WIDTH);
		this.textHandler.drawWeightText(this.getValue(), startX, startY, endX, endY);
	}

	/**
	 * Shows a popup consisting of a bounding rectangle and text within it, which describes what 
	 * the weight is doing, if the mouse happens to be hovering over the weight. If the mouse is
	 * no longer hovering over the weight, the popup disappears.
	 * 
	 * @param {number} pointX 
	 * @param {number} pointY 
	 * @param {number} startX 
	 * @param {number} startY 
	 * @param {number} endX 
	 * @param {number} endY 
	 * @param {number} previousNeuronOutput 
	 */
	public highlightWeight(pointX: number, pointY: number, startX: number, startY: number, endX: number, 
		            endY: number, previousNeuronOutput: number): void {
		if( this.geometry.pointIsOnTheLine(pointX, pointY, startX, startY, endX, endY, WEIGHT_SLOPE_MARGIN, NEURON_RADIUS) ) {
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

	/**
	 * @returns The value of the weight
	 */
	public getValue(): number {
		return this.value;
	}

	/**
	 * Calls the BasicWeightTextHandler to show the weight popup at the approximate coordinates of the mouse.
	 * 
	 * @param {number} pointX The x coordinate of the mouse position
	 * @param {number} pointY The y coordinate of the mouse position
	 * @param {number} previousNeuronOutput The value of the output of the neuron feeding into the weight
	 */
	protected showWeightPopup(pointX: number, pointY: number, previousNeuronOutput: number): void {
		this.textHandler.drawWeightPopup(pointX, pointY, this.value, previousNeuronOutput);
	}
}

/**
 * The internal color of the neuron
 */
export const NEURON_FILL_STYLE = 'lightyellow';

/**
 * The color of the outline of the neuron
 */
export const NEURON_STROKE_STYLE = 'tan';

/**
 * The width of the outline of the neuron
 */
export const NEURON_STROKE_WIDTH = 2;

/**
 * The radius of the neuron
 */
export const NEURON_RADIUS = 25;

/**
 * A global variable which is read and set in the BasicNeuron class and the BasicNeuralNetwork class.
 */
let Redraw_Neural_Network_For_Neuron_Hover = false;

/*****************************************************************/
/**
 * The BasicNeuron class implements a neuron which displays its output value
 * inside the circular shape of the neuron, and which throws up a popup of text
 * inside a rounded rectangle describing how the output is computed from the
 * outputs of the previous layer neurons and the weights connecting them to this
 * neuron, when the user's mouse hovers over the circular shape of the neuron.
 */
export class BasicNeuron extends BasicNeuralNetworkElement {

	/**
	 * The numerical value of the eoutput of the neuron
	 */
	protected output: number;

	/**
	 * The x coordinate of the location of the neuron on the canvas
	 */
	protected xPosition: number;

	/**
	 * The y coordinate of the location of the neuron on the canvas
	 */
	protected yPosition: number;

	/**
	 * The array of weights feeding into the neuron, from the previous layer of neurons
	 */
	protected incomingWeights: BasicWeight[] | null;

	/**
	 * Handles all display of text associated with the neuron
	 */
	protected textHandler: BasicNeuronTextHandler;

	/**
	 * True if the mouse is hovering over a particular neuron, false otherwise
	 */
	protected mouseIsHoveringOnNeuron: boolean;

	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */
    constructor(context: CanvasRenderingContext2D) {
		super(context);
		this.xPosition;
		this.yPosition;

		this.incomingWeights = null; // array of BasicWeight objects
		this.textHandler = new BasicNeuronTextHandler(context);
		this.output = this.calculator.randomDecimalBetween(0, 1, 2);
		this.mouseIsHoveringOnNeuron = false;
	}

	/**
	 * @returns {BasicWeight[]} Returns the array of incoming weights
	 */
	public getIncomingWeights(): BasicWeight[] {
		return this.incomingWeights;
	}

	/**
	 * Converts the array of incoming BasicWeight objects into an array of numbers and returns it
	 * 
	 * @returns {number[]} The array of weights, as an array of numbers
	 */
	public getIncomingWeightsAsValues(): number[] {
		let values = new Array(this.incomingWeights.length);
		for(var i=0; i < values.length; i++) {
			values[i] = this.incomingWeights[i].getValue();
		}
		return values;
	}

	/**
	 * Sets the location of the center of the neuron
	 * 
	 * @param {number} x The x coordinate of the center with respect to the canvas 
	 * @param {number} y The y coordinate of the center with respect to the canvas 
	 */
	public setCenterLocation(x: number, y: number): void {
		this.xPosition = x;
		this.yPosition = y;
	}

	/**
	 * Initalizes the weights feeding into the neuron
	 * 
	 * @param {number} numWeights The number of weights feeding into the neuron 
	 */
	public initializeWeights(numWeights: number): void {
		this.incomingWeights = new Array(numWeights);
		for(var i=0; i < numWeights; i++) {
			this.incomingWeights[i] = new BasicWeight(this.context);
			this.incomingWeights[i].initializeWeight();
		}
	}

	/**
	 * If the neuron is an input layer neuron, sets it output to a random integer between low and high
	 * 
	 * @param low The minimum value of the random integer
	 * @param high The maximum value of the random integer
	 */
	public setOutputAsRandomIntegerBetween(low: number, high: number): void {
		this.output = this.calculator.randomIntegerBetween(low, high);
	}

	/**
	 * Calculates the output value of the neuron
	 * 
	 * @param {BasicNeuronLayer} previousLayer The previous layer of neurons
	 */
	public calculateOutput(previousLayer: BasicNeuronLayer): void {
		if(this.incomingWeights != null && previousLayer != null) {
			let values = this.getIncomingWeightsAsValues();
			let previousLayerOutputs = previousLayer.getOutputsAsArray();
			let dotProduct = this.calculator.dotProduct(values, previousLayerOutputs); 
			let outputValue = this.calculator.sigmoid(dotProduct);
			this.output = this.calculator.roundDecimalTo(outputValue, 2);
		}
	}

	/**
	 * Draws the weights feeding into the neuron from the previous layer of neurons
	 * 
	 * @param {BasicNeuronLayer} previousLayer The previous layer of neurons
	 */
	public drawWeights(previousLayer: BasicNeuronLayer): void {
		for(var i=0; i < previousLayer.numNeurons(); i++) {
			let startingNeuron = previousLayer.getIthNeuron(i);
			this.connectTo(startingNeuron, this.incomingWeights[i]);
		}
	}

	/**
	 * Draws a BasicNeuron
	 */
	public drawBasicNeuron(): void {
		if(this.incomingWeights == null) {
			this.geometry.drawCircle(this.xPosition, this.yPosition, NEURON_RADIUS, INPUT_LAYER_NEURON_FILL_STYLE, NEURON_STROKE_STYLE, NEURON_STROKE_WIDTH);
		} else {
			this.geometry.drawCircle(this.xPosition, this.yPosition, NEURON_RADIUS, NEURON_FILL_STYLE, NEURON_STROKE_STYLE, NEURON_STROKE_WIDTH);
		}
		this.textHandler.drawNeuronInternalText(this.output, this.xPosition, this.yPosition);
	}

	/**
	 * If the mouse is within the outline of the neuron, throws up a popup describing the calculation being 
	 * done by the neuron.
	 * 
	 * @param pointX The x coordinate of the mouse position with respect to the canvas
	 * @param pointY The y coordinate of the mouse position with respect to the canvas
	 * @param previousLayer The previous layer of neurons 
	 */
	public highlightNeuron(pointX: number, pointY: number, previousLayer: BasicNeuronLayer): void {
		if( this.geometry.pointIsWithinCircle(pointX, pointY, this.xPosition, this.yPosition, NEURON_RADIUS )) {
			this.mouseIsHoveringOnNeuron = true;
			this.showNeuronPopup(previousLayer);
		} else {
			if(this.mouseIsHoveringOnNeuron == true) {
				this.mouseIsHoveringOnNeuron = false;
				Redraw_Neural_Network_For_Neuron_Hover = true;
			}
		}
	}

	/**
	 * Goes through each of the incoming weights, and highlights it if the mouse is hovering over it.
	 * 
	 * @param pointX The x coordinate of the mouse position with respect to the canvas
	 * @param pointY The y coordinate of the mouse position with respect to the canvas
	 * @param previousLayer The previous layer of neurons
	 */
	public highlightSelectedWeight(pointX: number, pointY: number, previousLayer: BasicNeuronLayer): void {
		if(this.incomingWeights != null) {
			for(var i=0; i < this.incomingWeights.length; i++) {
				let previousNeuron = previousLayer.getIthNeuron(i);
				this.incomingWeights[i].highlightWeight(pointX, pointY, previousNeuron.getXPosition(), previousNeuron.getYPosition(), 
												   this.getXPosition(), this.getYPosition(), previousNeuron.getOutput() );
			}
		}
	}

	/**
	 * @returns Returns the x coordinate of the center of the neuron
	 */
	public getXPosition(): number {
		return this.xPosition;
	}

	/**
	 * @returns Returns the y coordinate of the center of the neuron
	 */
	public getYPosition(): number {
		return this.yPosition;
	}

	/**
	 * @returns Returns the output value of the neuron
	 */
	public getOutput(): number {
		return this.output;
	}

	/**
	 * Sets the output value of the neuron
	 * 
	 * @param {number} output The output value to set, of the neuron
	 */
	public setOutput(output: number): void {
		this.output = output;
	}

	/**
	 * Calls the BasicNeuronTextHandler to display the popup text describing the calculation being done
	 * by the neuron, within its bounding rectangle.
	 * 
	 * @param previousLayer The previous layer of neurons
	 */
	private showNeuronPopup(previousLayer: BasicNeuronLayer): void {
		if(previousLayer == null) {
			this.textHandler.drawFirstLayerNeuronPopup(this.xPosition, this.yPosition, NEURON_RADIUS, this.output);
		} else {
			let weightValuesArray = this.getIncomingWeightsAsValues();
			let previousLayerOutputs = previousLayer.getOutputsAsArray();
			this.textHandler.drawNeuronPopup(this.xPosition, this.yPosition, NEURON_RADIUS, weightValuesArray, previousLayerOutputs);
		}
	}
	
	/**
	 * Draws a weight between this neuron and another neuron
	 * 
	 * @param {BasicNeuron} neuron The neuron to draw the weight to 
	 * @param {BasicWeight} weight The weight object which contains the logic for drawing the weight
	 */
	private connectTo(neuron: BasicNeuron, weight: BasicWeight): void {
		weight.drawWeight(neuron.xPosition, neuron.yPosition, this.xPosition, this.yPosition);
	}
}

/**
 * Each layer of neurons is drawn vertically on the canvas. This value specifies the distance
 * between the centers of the neurons in each layer.
 */
export const VERTICAL_DISTANCE_BETWEEN_NEURON_CENTERS = 140;

/*****************************************************************/
/**
 * The BasicNeuronLayer class initializes the BasicNeurons within it, and
 * the BasicWeights connecting into each of those BasicNeurons, from the
 * neurons in the previous BasicNeuronLayer.
 */
export class BasicNeuronLayer extends BasicNeuralNetworkElement {

	/**
	 * The neurons within the layer, as an array
	 */
	protected neurons: BasicNeuron[];

	/**
	 * The previous layer of neurons
	 */
	protected previousLayer: BasicNeuronLayer | null;

	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations
	 * @param {number} numNeuronsInLayer The number of neurons in the layer     
	 * @constructor
	 */
	constructor(context: CanvasRenderingContext2D, numNeuronsInLayer: number) {
		super(context);
		this.neurons = new Array(numNeuronsInLayer);

		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i] = new BasicNeuron(this.context);
		}

		this.previousLayer = null;
	}

	/**
	 * Sets the previous layer to the specified BasicNeuronLayer.
	 * 
	 * @param {BasicNeuronLayer} previousNeuronLayer The specified previous layer 
	 */
	public setPreviousLayer(previousNeuronLayer: BasicNeuronLayer): void {
		this.previousLayer = previousNeuronLayer;
	}

	/**
	 * Initializes the BasicNeurons in this neuron layer, along with the weights feeding into them.
	 * 
	 * @param topNeuronLocation The coordinates of the location of the top most neuron in this neuron layer
	 */
	public initializeBasicNeurons(topNeuronLocation: Coordinates): void {
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

	/**
	 * Asks the neurons in this layer to draw the weights feeding into them
	 */
	public drawWeights(): void {
		if(this.previousLayer != null) {
			for(var i=0; i < this.neurons.length; i++) {
				this.neurons[i].drawWeights(this.previousLayer);
			}
		}
	}

	/**
	 * Asks each of the neurons in this layer to draw themselves
	 */
	public drawNeurons(): void {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].drawBasicNeuron();
		}
	}

	/**
	 * Passes on the message to the neurons in this layer, to throw up the self-descriptive
	 * popup, if the user's mouse is hovering over any of them.
	 * 
	 * @param {number} x The x coordinate of the user's mouse 
	 * @param {number} y The y coordinate of the user's mouse
	 */
	public locateNeuron(x: number, y: number): void {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].highlightNeuron(x, y, this.previousLayer);
		}
	}

	/**
	 * Passes on the message to the weights feeding into the neurons in this layer, to throw
	 * up the self descriptive popup, if the users's mouse is hovering on any of the weights.
	 * 
	 * @param {number} x The x coordinate of the user's mouse 
	 * @param {number} y The y coordinate of the user's mouse
	 */
	public locateWeight(x: number, y: number): void {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].highlightSelectedWeight(x, y, this.previousLayer);
		}
	}

	/**
	 * Returns neuron number i, in the array of neurons in this layer.
	 * 
	 * @param {number} i Neuron number i 
	 * @returns {BasicNeuron} A BasicNeuron
	 */
	public getIthNeuron(i: number): BasicNeuron {
		return this.neurons[i];
	}

	/**
	 * Returns the outputs from the neurons in this layer, as an array of numbers.
	 * 
	 * @returns {number[]}
	 */
	public getOutputsAsArray(): number[] {
		let outputs = new Array(this.numNeurons());
		for(var i=0; i < outputs.length; i++) {
			outputs[i] = this.neurons[i].getOutput();
		}
		return outputs;
	}

	/**
	 * @returns Returns the number of neurons in this layer 
	 */
	public numNeurons(): number {
		return this.neurons.length;
	}
}

/**
 * The number of neurons in each layer of the neural network
 */
const NEURONS_IN_EACH_LAYER = [2, 3, 2, 1];

/**
 * The x and y coordinates of the centers of the top most neurons in each layer of 
 * the neural network
 */
const TOP_NEURON_LOCATIONS = [{x:150, y:180}, {x:400,y:130}, {x:650,y:180}, {x:900,y:230}];

/*****************************************************************/
/**
 * The BasicNeuralNetwork class maintains an array of BasicNeuronLayers, along
 * with a BasicNeuralNetworkTextHandler. If the user's mouse hovers over a 
 * weight or neuron, the BasicNeuralNetwork class coordinates with the BasicWeight
 * and BasicNeuron classes respectively to throw up a popup describing the computation
 * being done by the BasicWeight or BasicNeuron.
 */
export class BasicNeuralNetwork extends BasicNeuralNetworkElement {

	/**
	 * Each BasicNeuronLayer maintains an array of neurons, which in turn define the neural network
	 */
	protected neuronLayers: BasicNeuronLayer[];

	/**
	 * The BasicNeuralNetworkTextHandler displays the text associated with the neural network
	 */
	protected textHandler: BasicNeuralNetworkTextHandler;

	/**
	 * The number of layers in the neural network
	 */
	protected numberOfLayers: number;

	/**
	 * @param {CanvasRenderingContext2D} context Responsible for all 2 dimensional drawing operations     
	 * @constructor
	 */
	constructor(context: CanvasRenderingContext2D) {
		super(context);
		this.neuronLayers = new Array();
		this.textHandler = new BasicNeuralNetworkTextHandler(context);
		this.numberOfLayers;
	}

	/**
	 * Creates the BasicNeuronLayers of the network, and then goes through the layers, initializing
	 * the neurons in each of the layers.
	 */
	public initializeNeuronLayers(): void {
		this.numberOfLayers = NEURONS_IN_EACH_LAYER.length;
		let neuronsInEachLayer = NEURONS_IN_EACH_LAYER;
		
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i] = new BasicNeuronLayer(this.context, neuronsInEachLayer[i]);
		}

		for(var i=1; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].setPreviousLayer(this.neuronLayers[i-1]);
		}

		// neuronsInEachLayer.length must equal TOP_NEURON_LOCATIONS.length
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].initializeBasicNeurons(TOP_NEURON_LOCATIONS[i]);
		}
	}

	/**
	 * Draws the weights and neurons of the neural network, and also the text to be associated
	 * with the neural network.
	 */
	public drawNeuralNetwork(): void {
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].drawWeights();
		}

		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].drawNeurons();
		}

		this.textHandler.handleNeuralNetworkText(TOP_NEURON_LOCATIONS);
	}

	/**
	 * Every time the mouse moves on the canvas, this function is called. 
	 * 
	 * @param {number} x The x coordinate of the location of the mouse
	 * @param {number} y The y coordinate of the location of the mouse
	 */
	public highlightWeightOrNeuronOnMouseHover(x: number, y: number): void {
		this.highlightWeightOnMouseHover(x,y);
		this.highlightNeuronOnMouseHover(x,y);
	}

	/**
	 * Every time the mouse moves on the canvas, the highlightWeightOrNeuronOnMouseHover
	 * function calls this function. It propogates the request, through the neuron layers,
	 * through the neurons in them, to the weights, which then throw up a popup describing
	 * the calculation being done by a particular weight, if the mouse happens to be
	 * hovering over that weight.
	 * 
	 * @param {number} x The x coordinate of the location of the mouse
	 * @param {number} y The y coordinate of the location of the mouse
	 */
	protected highlightWeightOnMouseHover(x: number, y: number): void {
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].locateWeight(x,y);
			if(Redraw_Neural_Network_For_Weight_Hover == true) {
				this.drawNeuralNetwork();
				Redraw_Neural_Network_For_Weight_Hover = false;
			} 
		}
	}

	/**
	 * Every time the mouse moves on the canvas, the highlightWeightOrNeuronOnMouseHover
	 * function calls this function. It propogates the request, through the neuron layers,
	 * to the neurons in them, which then throw up a popup describing the calculation being 
	 * done by a particular neuron, if the mouse happens to be hovering over that neuron.
	 * 
	 * @param {number} x The x coordinate of the location of the mouse
	 * @param {number} y The y coordinate of the location of the mouse
	 */
	protected highlightNeuronOnMouseHover(x: number, y: number): void {
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].locateNeuron(x,y);
			if(Redraw_Neural_Network_For_Neuron_Hover == true) {
				this.drawNeuralNetwork();
				Redraw_Neural_Network_For_Neuron_Hover = false;
			} 
		}
	}
}


import {Geometry} from '../utilities/Geometry.js';
import {Calculator} from '../utilities/Calculator.js';
import {BasicWeightTextHandler, BasicNeuronTextHandler, BasicNeuralNetworkTextHandler} from './BasicTextHandlers.js';
import {INPUT_LAYER_NEURON_FILL_STYLE} from './BasicTextHandlers.js';

class BasicNeuralNetworkElement {
    constructor(context) {
        this.context = context;
        this.textHandler;
        this.calculator = new Calculator();
		this.geometry = new Geometry(context);
    }
}
	
// Class Weight

const WEIGHT_COLOR = 'deepskyblue';
const WEIGHT_WIDTH = 0.5;
export const WEIGHT_SLOPE_MARGIN = 0.05;

let Redraw_Neural_Network_For_Weight_Hover = false;

export const NEURON_RADIUS = 25;

export class BasicWeight extends BasicNeuralNetworkElement {
	constructor(context) {
		super(context);
		this.value;
		this.mouseIsHoveringOnWeight = false;
		this.textHandler = new BasicWeightTextHandler(context);
	}

	initializeWeight() {
		let rawValue = this.calculator.randomNumberBetween(-0.9, 0.9);
		this.value = this.calculator.roundDecimalTo(rawValue, 3);
	}

	drawWeight(startX, startY, endX, endY) {
		this.geometry.drawLine(startX, startY, endX, endY, WEIGHT_COLOR, WEIGHT_WIDTH);
		this.textHandler.drawWeightText(this.getValue(), startX, startY, endX, endY);
	}

	highlightWeight(pointX, pointY, startX, startY, endX, endY, previousNeuronOutput) {
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

	showWeightPopup(pointX, pointY, previousNeuronOutput) {
		this.textHandler.drawWeightPopup(pointX, pointY, this.value, previousNeuronOutput);
	}

	getValue() {
		return this.value;
	}
}

// Class Neuron

export const NEURON_FILL_STYLE = 'lightyellow';
export const NEURON_STROKE_STYLE = 'tan';
export const NEURON_STROKE_WIDTH = 2;

let Redraw_Neural_Network_For_Neuron_Hover = false;

export class BasicNeuron extends BasicNeuralNetworkElement {

	constructor(context) {
		super(context);
		this.xPosition;
		this.yPosition;

		this.incomingWeights = null; // array of Weight objects
		this.textHandler = new BasicNeuronTextHandler(context);
		this.output = this.calculator.randomDecimalBetween(0, 1, 2);
		this.mouseIsHoveringOnNeuron = false;
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
			this.incomingWeights[i] = new BasicWeight(this.context);
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
			this.geometry.drawCircle(this.xPosition, this.yPosition, NEURON_RADIUS, INPUT_LAYER_NEURON_FILL_STYLE, NEURON_STROKE_STYLE, NEURON_STROKE_WIDTH);
		} else {
			this.geometry.drawCircle(this.xPosition, this.yPosition, NEURON_RADIUS, NEURON_FILL_STYLE, NEURON_STROKE_STYLE, NEURON_STROKE_WIDTH);
		}
		this.textHandler.drawNeuronInternalText(this.output, this.xPosition, this.yPosition);
	}

	highlightNeuron(pointX, pointY, previousLayer) {
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

export const VERTICAL_DISTANCE_BETWEEN_NEURON_CENTERS = 140;

export class BasicNeuronLayer extends BasicNeuralNetworkElement {

	constructor(context, numNeuronsInLayer) {
		super(context);
		this.neurons = new Array(numNeuronsInLayer);

		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i] = new BasicNeuron(this.context);
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

const NEURONS_IN_EACH_LAYER = [2, 3, 2, 1];
const TOP_NEURON_LOCATIONS = [{x:150, y:180}, {x:400,y:130}, {x:650,y:180}, {x:900,y:230}];

export class BasicNeuralNetwork extends BasicNeuralNetworkElement {
	constructor(context) {
		super(context);
		this.neuronLayers = new Array();
		this.textHandler = new BasicNeuralNetworkTextHandler(context);
		this.numberOfLayers;
	}

	initializeNeuronLayers() {
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
			this.neuronLayers[i].initializeNeurons(TOP_NEURON_LOCATIONS[i]);
		}
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
}


/**
 * Copyright 2022 by Sandeep Jain. All Rights Reserved.
 */

import {EncapsulatedNumber} from '../utilities/Calculator.js';
import {BasicWeight, BasicNeuron, BasicNeuronLayer, BasicNeuralNetwork} from '../basic_nn/BasicNeuralNetworkElements.js';
import {NEURON_FILL_STYLE, NEURON_STROKE_STYLE, NEURON_STROKE_WIDTH, NEURON_RADIUS} from '../basic_nn/BasicNeuralNetworkElements.js';
import {VERTICAL_DISTANCE_BETWEEN_NEURON_CENTERS} from '../basic_nn/BasicNeuralNetworkElements.js';
import {INPUT_LAYER_NEURON_FILL_STYLE} from '../basic_nn/BasicTextHandlers.js';
import {WeightTextHandler, NeuronTextHandler, NeuralNetworkTextHandler} from './TextHandlers.js';
import {TrainingData} from './TrainingData.js';

// Class Weight

export class Weight extends BasicWeight {
	constructor(context) {
		super(context);
		this.textHandler = new WeightTextHandler(context);

		// Modified for General Neural Network
		this.encapsulatedWeightValue;
		this.previousValue;
	}

	initializeWeight() {
		let rawValue = this.calculator.randomNumberBetween(-2.0, 2.0);
		this.encapsulatedWeightValue = new EncapsulatedNumber(rawValue, 3);
	}

	getValue() {
		return this.encapsulatedWeightValue.getValue();
	}

	// Modified for General Neural Network
	showWeightPopup(pointX, pointY, previousNeuronOutput) {
		this.textHandler.drawWeightPopupForAcceptingNewWeight(pointX, pointY, this.encapsulatedWeightValue);
	}

	// General Neural Network Functions
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

	// For General Neural Network Training

	updateWeight( nextNeuronDelta, previousNeuronOutput, learningRate ) {
		this.previousValue = this.getValue();
		let updatedValue = this.previousValue + ( learningRate * nextNeuronDelta * previousNeuronOutput );
		this.encapsulatedWeightValue.setValue(updatedValue, 3);
	}
}

// Class Neuron

export class Neuron extends BasicNeuron
{
	constructor(context, iIndex) {
		super(context);

		this.textHandler = new NeuronTextHandler(context);

		// For General Neural Network
		this.temporaryOutput;

		// For General Neural Network Training
		this.delta;
		this.myIndex = iIndex;
	}


	initializeWeights(numWeights) {
		this.incomingWeights = new Array(numWeights);
		for(var i=0; i < numWeights; i++) {
			this.incomingWeights[i] = new Weight(this.context);
			this.incomingWeights[i].initializeWeight();
		}
	}

	drawNeuron(previousLayer) {
		if(this.incomingWeights == null) {
			this.geometry.drawCircle(this.xPosition, this.yPosition, NEURON_RADIUS, INPUT_LAYER_NEURON_FILL_STYLE, NEURON_STROKE_STYLE, NEURON_STROKE_WIDTH);
		} else {
			this.geometry.drawCircle(this.xPosition, this.yPosition, NEURON_RADIUS, NEURON_FILL_STYLE, NEURON_STROKE_STYLE, NEURON_STROKE_WIDTH);
		}
		this.calculateOutput(previousLayer);
		this.textHandler.drawNeuronInternalText(this.output, this.xPosition, this.yPosition);
	}

	setOutput(output) {
		this.output = output;
	}

	// General Neural Network Functions
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

	// For General Neural Network Training
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

export class NeuronLayer extends BasicNeuronLayer {

	constructor(context, numNeuronsInLayer) {
		super(context, numNeuronsInLayer);

		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i] = new Neuron(this.context, i);
		}

		// For General Neural Network Training
		this.nextLayer = null;
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

	drawNeurons() {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].drawNeuron(this.previousLayer);
		}
	}

	// General Neural Network Functions
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
export const DEFAULT_LEARNING_RATE = 0.15;

export class NeuralNetwork extends BasicNeuralNetwork {
	constructor(context) {
		super(context);
		this.textHandler = new NeuralNetworkTextHandler(context);

		// General Neural Network
		this.trainingData = new TrainingData();
		this.trainingData.initializeForThisApplication();

		this.nextStep = 0;
		this.outputDataContainer = new Array(this.trainingData.numberOfExamples());
		this.numberOfLayers;

		this.theLearningRate = DEFAULT_LEARNING_RATE;

		this.Is_Running = false;
		this.iterations = 0;
		this.totalIterations = 0;
		this.errorMargin;
		this.intervalId;
		this.selectedExampleIndex;
	}

	initializeNeuronLayers() {
		this.numberOfLayers = NEURONS_IN_EACH_LAYER.length;
		let neuronsInEachLayer = NEURONS_IN_EACH_LAYER;
		this.nextStep = 0;
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

		this.fillOutputDataContainer();
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
		this.fillOutputDataContainer();
		this.textHandler.drawErrorOutputText(this.trainingData, this.outputDataContainer, TOP_NEURON_LOCATIONS);
		let actualAndDesiredOutputs = this.getActualAndDesiredOutputValues();
		this.textHandler.drawActualAndDesiredOutputs(TOP_NEURON_LOCATIONS, actualAndDesiredOutputs);
	}

	getActualAndDesiredOutputValues() {
		let actualOutputValue = this.neuronLayers[this.numberOfLayers-1].neurons[0].getOutput();
		let desiredOutputArray = this.trainingData.getIthOutputArray(this.selectedExampleIndex);
		let desiredOutputValue = desiredOutputArray[0];
		return {actual: actualOutputValue, desired: desiredOutputValue};
	}

	// Neural Network Functions
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

	takeNextStep() {
		this.selectedExampleIndex = this.nextStep;
		switch(this.nextStep) {
			case 0:
				this.setInputLayerValues(this.trainingData.getIthInputArray(0));
				break;
			case 1:
				this.setInputLayerValues(this.trainingData.getIthInputArray(1));
				break;
			case 2:
				this.setInputLayerValues(this.trainingData.getIthInputArray(2));
				break;
			case 3:
				this.setInputLayerValues(this.trainingData.getIthInputArray(3));
				break;
		}
		this.nextStep = this.nextStep + 1;
		if(this.nextStep == this.trainingData.numberOfExamples()) {
			this.nextStep = 0;
		}
		this.drawNeuralNetwork();
	}

	setInputLayerValues(ithInputArray) {
		this.neuronLayers[0].setIthNeuronValue(0, ithInputArray[0]);
		this.neuronLayers[0].setIthNeuronValue(1, ithInputArray[1]);
	}

	fillOutputDataContainer() {
		this.setInputLayerTemporaryValues(this.trainingData.getIthInputArray(0));
		this.propagateTemporaryValuesFromInputToOutputLayer();
		this.outputDataContainer[0] = this.getTemporaryOutputValue();

		this.setInputLayerTemporaryValues(this.trainingData.getIthInputArray(1));
		this.propagateTemporaryValuesFromInputToOutputLayer();
		this.outputDataContainer[1] = this.getTemporaryOutputValue();

		this.setInputLayerTemporaryValues(this.trainingData.getIthInputArray(2));
		this.propagateTemporaryValuesFromInputToOutputLayer();
		this.outputDataContainer[2] = this.getTemporaryOutputValue();

		this.setInputLayerTemporaryValues(this.trainingData.getIthInputArray(3));
		this.propagateTemporaryValuesFromInputToOutputLayer();
		this.outputDataContainer[3] = this.getTemporaryOutputValue();
	}

	getTemporaryOutputValue() {
		return this.neuronLayers[this.numberOfLayers-1].neurons[0].getTemporaryOutput();
	}

	setInputLayerTemporaryValues(ithInputArray) {
		this.neuronLayers[0].setIthNeuronTemporaryOutput(0, ithInputArray[0]);
		this.neuronLayers[0].setIthNeuronTemporaryOutput(1, ithInputArray[1]);
	}

	propagateTemporaryValuesFromInputToOutputLayer() {
		for(var i=1; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].calculateTemporaryOutputs();
		}
	}

	// For Neural Network Training
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
}

export class NeuralNetworkTrainer extends NeuralNetwork {
	constructor(context) {
		super(context);
	}

	drawNeuralNetwork() {
		super.drawNeuralNetwork();
		this.textHandler.showIterations(TOP_NEURON_LOCATIONS, this.totalIterations);
	}

	highlightWeightOrNeuronOnMouseHover(x,y) {
		if(this.isRunning() == false) {
			this.highlightWeightOnMouseHover(x,y);
			this.highlightNeuronOnMouseHover(x,y);
		}
	}
}

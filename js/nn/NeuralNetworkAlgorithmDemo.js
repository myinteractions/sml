
import {MAIN_TEXT_FONT} from '../basic_nn/BasicTextHandlers.js';
import {NEURON_POPUP_STROKE, INPUT_LAYER_NEURON_FILL_STYLE, NEURON_POPUP_LINE_WIDTH} from '../basic_nn/BasicTextHandlers.js';
import {WeightTextHandler, NeuronTextHandler} from './TextHandlers.js';
import {WEIGHT_SLOPE_MARGIN, NEURON_RADIUS} from '../basic_nn/BasicNeuralNetworkElements.js';
import {Weight, Neuron, NeuronLayer, NeuralNetworkTrainer} from './NeuralNetworkElements.js';

class WeightTextHandlerWithAlgorithm extends WeightTextHandler {
	constructor(context) {
		super(context);
	}

	drawWeightPopup(mouseX, mouseY, currentWeightValue, previousWeightValue, previousNeuronOutput, nextNeuronDelta, learningRate) {
		let coordinates = {x: mouseX, y: mouseY};
		previousWeightValue = currentWeightValue - (learningRate * previousNeuronOutput * nextNeuronDelta);
		previousWeightValue = this.calculator.roundDecimalTo(previousWeightValue, 3);
		let text1 = "Weight on previous iteration: " + previousWeightValue;
		let text2 = "Updated weight:";
		nextNeuronDelta = this.calculator.roundDecimalTo(nextNeuronDelta, 3);
		let text3 = "" + previousWeightValue + " + ( " + learningRate + " x " + previousNeuronOutput + " x " + nextNeuronDelta + " )";
		let text4 = "= " + currentWeightValue;
		let text = [text1, text2, text3, text4]; 
		this.drawPopupBoundingRectangle(text, coordinates);   
		this.drawWeightPopupText(text, coordinates);
	}
}

class NeuronTextHandlerWithAlgorithm extends NeuronTextHandler {
	constructor(context) {
		super(context);
	}

	drawFirstLayerNeuronDeltaPopup(centerX, centerY, neuronRadius, outputValue) {
		this.context.font = MAIN_TEXT_FONT;
		let coordinates = {x: centerX + neuronRadius + 15, y: centerY};
		let text1 = "Input value = " + outputValue;
		let text2 = "No delta";
		let text = [text1, text2];
		this.drawFirstLayerPopupBoundingRectangle(text, coordinates);
		this.drawPopupText(text, coordinates, "left", "middle");
	}

	drawFirstLayerPopupBoundingRectangle(text, coordinates) {
		this.context.font = MAIN_TEXT_FONT;
		let maxLengthIndex = this.calculator.getStringMaxLengthIndex(text);
		let textMetrics = this.context.measureText(text[maxLengthIndex]);
		let width = textMetrics.width + 20;
		let height = (this.context.measureText('M').width + 8) * text.length + 5;
		this.boundingShape.drawRoundedRectangle(coordinates.x-5, coordinates.y-12, width, height, 5, NEURON_POPUP_STROKE, 
												INPUT_LAYER_NEURON_FILL_STYLE, NEURON_POPUP_LINE_WIDTH);
	}

	drawOutputLayerNeuronDeltaPopup(centerX, centerY, neuronRadius, outputValue, desiredOutput, deltaValue) {
		this.context.font = MAIN_TEXT_FONT;
		let coordinates = {x: centerX + neuronRadius + 15, y: centerY};
		let text1 = "delta = " + this.calculator.roundDecimalTo(deltaValue, 3);
		let text2 = "calculation:";
		let text3 = "" + outputValue + " x (1 - " + outputValue + ") x (" + desiredOutput + " - " + outputValue + ")";
		let text = [text1, text2, text3];
		this.drawPopupBoundingRectangle(text, coordinates);
		this.drawPopupText(text, coordinates, "left", "middle");
	}

	drawNeuronDeltaPopup(centerX, centerY, neuronRadius, weightValuesArray, nextLayerDeltas, outputValue, deltaValue) {
		this.context.font = MAIN_TEXT_FONT;
		let coordinates = {x: centerX + neuronRadius + 15, y: centerY};
		let text1 = "delta = " + this.calculator.roundDecimalTo(deltaValue, 3);
		let text2 = "calculation:";
		let text3 = "" + outputValue + " x (1 - " + outputValue + ") x (";
		let text4 = this.getArrayMultiplicationAsStringArray(weightValuesArray, nextLayerDeltas);
		let text = [text1, text2, text3];
		text = text.concat(text4);
		this.drawPopupBoundingRectangle(text, coordinates);
		this.drawPopupText(text, coordinates, "left", "middle");
	}

	getArrayMultiplicationAsStringArray(firstArray, secondArray) {
		let textStringArray = new Array(firstArray.length);

		for(var i=0; i < firstArray.length; i++) {
			textStringArray[i] = "" + this.calculator.roundDecimalTo(firstArray[i],3) + " x " + this.calculator.roundDecimalTo(secondArray[i],3);
			if(i < firstArray.length - 1) {
				textStringArray[i] = textStringArray[i] + " +";
			} else {
				textStringArray[i] = textStringArray[i] + " )";
			}
		}

		return textStringArray;
	}
}

let Redraw_Neural_Network_For_Weight_Hover = false;

class WeightTrainerWithAlgorithm extends Weight {
	constructor(context) {
		super(context);
		this.textHandler = new WeightTextHandlerWithAlgorithm(context);
	}

	highlightWeight(pointX, pointY, startX, startY, endX, endY, previousNeuronOutput, nextNeuronDelta, learningRate) {
		if( this.geometry.pointIsOnTheLine(pointX, pointY, startX, startY, endX, endY, WEIGHT_SLOPE_MARGIN, NEURON_RADIUS) ) {
			if(this.mouseIsHoveringOnWeight == false) {
				this.mouseIsHoveringOnWeight = true;
				this.showWeightPopup(pointX, pointY, previousNeuronOutput, nextNeuronDelta, learningRate);
			}
		} else {
			if(this.mouseIsHoveringOnWeight == true) {
				this.mouseIsHoveringOnWeight = false;
				Redraw_Neural_Network_For_Weight_Hover = true;
			}	
		}
	}

	showWeightPopup(pointX, pointY, previousNeuronOutput, nextNeuronDelta, learningRate) {
		this.textHandler.drawWeightPopup(pointX, pointY, this.getValue(), this.previousValue, previousNeuronOutput, nextNeuronDelta, learningRate);
	}
}

let Redraw_Neural_Network_For_Neuron_Hover = false;

class NeuronTrainerWithAlgorithm extends Neuron {
	constructor(context, iIndex) {
		super(context, iIndex);
		this.textHandler = new NeuronTextHandlerWithAlgorithm(context);
	}

	initializeWeights(numWeights) {
		this.incomingWeights = new Array(numWeights);
		for(var i=0; i < numWeights; i++) {
			this.incomingWeights[i] = new WeightTrainerWithAlgorithm(this.context);
			this.incomingWeights[i].initializeWeight();
		}
	}

	highlightNeuron(pointX, pointY, previousLayer, nextLayer, desiredOutputsArray) {
		if( this.geometry.pointIsWithinCircle(pointX, pointY, this.xPosition, this.yPosition, NEURON_RADIUS )) {
			this.mouseIsHoveringOnNeuron = true;
			this.showNeuronPopup(previousLayer, nextLayer, desiredOutputsArray);
		} else {
			if(this.mouseIsHoveringOnNeuron == true) {
				this.mouseIsHoveringOnNeuron = false;
				Redraw_Neural_Network_For_Neuron_Hover = true;
			}
		}
	}

	highlightSelectedWeight(pointX, pointY, previousLayer, learningRate) {
		if(this.incomingWeights != null) {
			for(var i=0; i < this.incomingWeights.length; i++) {
				var previousNeuron = previousLayer.getIthNeuron(i);
				this.incomingWeights[i].highlightWeight(pointX, pointY, previousNeuron.getXPosition(), previousNeuron.getYPosition(), 
										this.getXPosition(), this.getYPosition(), previousNeuron.getOutput(), this.getDelta(), learningRate );
			}
		}
	}

	showNeuronPopup(previousLayer, nextLayer, desiredOutputsArray) {
		if(previousLayer == null) {
			this.textHandler.drawFirstLayerNeuronDeltaPopup(this.xPosition, this.yPosition, NEURON_RADIUS, this.output);
		} else if(nextLayer == null) {
			this.textHandler.drawOutputLayerNeuronDeltaPopup(this.xPosition, this.yPosition, NEURON_RADIUS, this.output, 
															 desiredOutputsArray[this.myIndex], this.delta);
		} else {
			let weightValuesArray = this.getOutgoingWeightValuesToEachNextLayerNeuron(nextLayer);
			let nextLayerDeltas = nextLayer.getDeltasAsArray();
			this.textHandler.drawNeuronDeltaPopup(this.xPosition, this.yPosition, NEURON_RADIUS, 
												  weightValuesArray, nextLayerDeltas, this.output, this.delta);
		}
	}
}

class NeuronLayerTrainerWithAlgorithm extends NeuronLayer {
	constructor(context, numNeuronsInLayer) {
		super(context, numNeuronsInLayer);
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i] = new NeuronTrainerWithAlgorithm(this.context, i);
		}
	}

	locateNeuron(x, y, desiredOutputsArray) {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].highlightNeuron(x, y, this.previousLayer, this.nextLayer, desiredOutputsArray);
		}
	}

	locateWeight(x,y, learningRate) {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].highlightSelectedWeight(x, y, this.previousLayer, learningRate);
		}
	}
}

let NEURONS_IN_EACH_LAYER_FOR_ALGORITHM = [2, 2, 3, 1];
let TOP_NEURON_LOCATIONS_FOR_ALGORITHM = [{x:150, y:180}, {x:400,y:180}, {x:650,y:130}, {x:900,y:260}];

export class NeuralNetworkTrainerWithAlgorithm extends NeuralNetworkTrainer {
	constructor(context) {
		super(context);
	}

	initializeNeuronLayers() {
		this.numberOfLayers = NEURONS_IN_EACH_LAYER_FOR_ALGORITHM.length;
		let neuronsInEachLayer = NEURONS_IN_EACH_LAYER_FOR_ALGORITHM;
		this.nextStep = 0;
		this.totalIterations = 0;
		this.selectedExampleIndex = this.selectRandomExampleIndex();
		
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i] = new NeuronLayerTrainerWithAlgorithm(this.context, neuronsInEachLayer[i]);
		}

		for(var i=1; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].setPreviousLayer(this.neuronLayers[i-1]);
		}

		for(var i=0; i < this.numberOfLayers-1; i++) {
			this.neuronLayers[i].setNextLayer(this.neuronLayers[i+1]);
		}

		// if neuronsInEachLayer.length != TOP_NEURON_LOCATIONS_FOR_ALGORITHM.length throw Exception
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].initializeNeurons(TOP_NEURON_LOCATIONS_FOR_ALGORITHM[i], this.trainingData.getIthInputArray(this.selectedExampleIndex));
		}

		this.runTraining(2, false);
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

		this.fillOutputDataContainer();
		this.textHandler.drawErrorOutputText(this.trainingData, this.outputDataContainer, TOP_NEURON_LOCATIONS_FOR_ALGORITHM);

		this.textHandler.showIterations(TOP_NEURON_LOCATIONS_FOR_ALGORITHM, this.totalIterations);
		let actualAndDesiredOutputs = this.getActualAndDesiredOutputValues();
		this.textHandler.drawActualAndDesiredOutputs(TOP_NEURON_LOCATIONS_FOR_ALGORITHM, actualAndDesiredOutputs);
	}


	highlightNeuronOnMouseHover(x,y) {
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].locateNeuron(x, y, this.trainingData.getIthOutputArray( this.selectedExampleIndex) );
			if(Redraw_Neural_Network_For_Neuron_Hover == true) {
				this.drawNeuralNetwork();
				Redraw_Neural_Network_For_Neuron_Hover = false;
			} 
		}
	}

	highlightWeightOnMouseHover(x,y) {
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].locateWeight(x,y, this.theLearningRate);
			if(Redraw_Neural_Network_For_Weight_Hover == true) {
				this.drawNeuralNetwork();
				Redraw_Neural_Network_For_Weight_Hover = false;
			} 
		}
	}
}
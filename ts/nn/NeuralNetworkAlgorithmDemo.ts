
import {Coordinates} from '../utilities/Geometry.js';
import {MAIN_TEXT_FONT} from '../basic_nn/BasicTextHandlers.js';
import {NEURON_POPUP_STROKE, INPUT_LAYER_NEURON_FILL_STYLE, NEURON_POPUP_LINE_WIDTH} from '../basic_nn/BasicTextHandlers.js';
import {WeightTextHandler, NeuronTextHandler} from './TextHandlers.js';
import {WEIGHT_SLOPE_MARGIN, NEURON_RADIUS} from '../basic_nn/BasicNeuralNetworkElements.js';
import {Weight, Neuron, NeuronLayer, NeuralNetworkTrainer} from './NeuralNetworkElements.js';

class WeightTextHandlerWithAlgorithm extends WeightTextHandler {
	constructor(context: CanvasRenderingContext2D) {
		super(context);
	}

	public drawAlgorithmWeightPopup(mouseX: number, mouseY: number, currentWeightValue: number, previousWeightValue: number, 
		                     previousNeuronOutput: number, nextNeuronDelta: number, learningRate: number): void {
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
	constructor(context: CanvasRenderingContext2D) {
		super(context);
	}

	public drawFirstLayerNeuronDeltaPopup(centerX: number, centerY: number, neuronRadius: number, outputValue: number): void {
		this.context.font = MAIN_TEXT_FONT;
		let coordinates = {x: centerX + neuronRadius + 15, y: centerY};
		let text1 = "Input value = " + outputValue;
		let text2 = "No delta";
		let text = [text1, text2];
		this.drawTheFirstLayerPopupBoundingRectangle(text, coordinates);
		this.drawPopupText(text, coordinates);
	}

	public drawOutputLayerNeuronDeltaPopup(centerX: number, centerY: number, neuronRadius: number, outputValue: number, 
		                            desiredOutput: number, deltaValue: number): void {
		this.context.font = MAIN_TEXT_FONT;
		let coordinates = {x: centerX + neuronRadius + 15, y: centerY};
		let text1 = "delta = " + this.calculator.roundDecimalTo(deltaValue, 3);
		let text2 = "calculation:";
		let text3 = "" + outputValue + " x (1 - " + outputValue + ") x (" + desiredOutput + " - " + outputValue + ")";
		let text = [text1, text2, text3];
		this.drawPopupBoundingRectangle(text, coordinates);
		this.drawPopupText(text, coordinates);
	}

	public drawNeuronDeltaPopup(centerX: number, centerY: number, neuronRadius: number, 
		                 weightValuesArray: number[], nextLayerDeltas: number[], outputValue: number, 
						 deltaValue: number): void {
		this.context.font = MAIN_TEXT_FONT;
		let coordinates = {x: centerX + neuronRadius + 15, y: centerY};
		let text1 = "delta = " + this.calculator.roundDecimalTo(deltaValue, 3);
		let text2 = "calculation:";
		let text3 = "" + outputValue + " x (1 - " + outputValue + ") x (";
		let text4 = this.getArrayMultiplicationAsStringArray(weightValuesArray, nextLayerDeltas);
		let text = [text1, text2, text3];
		text = text.concat(text4);
		this.drawPopupBoundingRectangle(text, coordinates);
		this.drawPopupText(text, coordinates);
	}

	private drawTheFirstLayerPopupBoundingRectangle(text: string[], coordinates: Coordinates): void {
		this.context.font = MAIN_TEXT_FONT;
		let maxLengthIndex = this.calculator.getStringMaxLengthIndex(text);
		let textMetrics = this.context.measureText(text[maxLengthIndex]);
		let width = textMetrics.width + 20;
		let height = (this.context.measureText('M').width + 8) * text.length + 5;
		this.boundingShape.drawRoundedRectangle(coordinates.x-5, coordinates.y-12, width, height, 5, NEURON_POPUP_STROKE, 
												INPUT_LAYER_NEURON_FILL_STYLE, NEURON_POPUP_LINE_WIDTH);
	}

	private getArrayMultiplicationAsStringArray(firstArray: number[], secondArray: number[]): string[] {
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
	textHandler: WeightTextHandlerWithAlgorithm;

	constructor(context: CanvasRenderingContext2D) {
		super(context);
		this.textHandler = new WeightTextHandlerWithAlgorithm(context);
	}

	public highlightAlgorithmWeight(pointX: number, pointY: number, startX: number, startY: number, endX: number, endY: number, 
		                     previousNeuronOutput: number, nextNeuronDelta: number, learningRate: number): void {
		if( this.geometry.pointIsOnTheLine(pointX, pointY, startX, startY, endX, endY, WEIGHT_SLOPE_MARGIN, NEURON_RADIUS) ) {
			if(this.mouseIsHoveringOnWeight == false) {
				this.mouseIsHoveringOnWeight = true;
				this.showAlgorithmWeightPopup(pointX, pointY, previousNeuronOutput, nextNeuronDelta, learningRate);
			}
		} else {
			if(this.mouseIsHoveringOnWeight == true) {
				this.mouseIsHoveringOnWeight = false;
				Redraw_Neural_Network_For_Weight_Hover = true;
			}	
		}
	}

	private showAlgorithmWeightPopup(pointX: number, pointY: number, previousNeuronOutput: number, 
		                     nextNeuronDelta: number, learningRate: number): void {
		this.textHandler.drawAlgorithmWeightPopup(pointX, pointY, this.getValue(), this.previousValue, previousNeuronOutput, nextNeuronDelta, learningRate);
	}
}

let Redraw_Neural_Network_For_Neuron_Hover = false;

class NeuronTrainerWithAlgorithm extends Neuron {
	protected textHandler: NeuronTextHandlerWithAlgorithm;
	protected incomingWeights: WeightTrainerWithAlgorithm[];

	constructor(context: CanvasRenderingContext2D, iIndex: number) {
		super(context, iIndex);
		this.textHandler = new NeuronTextHandlerWithAlgorithm(context);
	}

	public initializeWeights(numWeights: number): void {
		this.incomingWeights = new Array(numWeights);
		for(var i=0; i < numWeights; i++) {
			this.incomingWeights[i] = new WeightTrainerWithAlgorithm(this.context);
			this.incomingWeights[i].initializeWeight();
		}
	}

	public highlightAlgorithmNeuron(pointX: number, pointY: number, previousLayer: NeuronLayerTrainerWithAlgorithm, 
		                     nextLayer: NeuronLayerTrainerWithAlgorithm, desiredOutputsArray: number[]): void {
		if( this.geometry.pointIsWithinCircle(pointX, pointY, this.xPosition, this.yPosition, NEURON_RADIUS )) {
			this.mouseIsHoveringOnNeuron = true;
			this.showAlgorithmNeuronPopup(previousLayer, nextLayer, desiredOutputsArray);
		} else {
			if(this.mouseIsHoveringOnNeuron == true) {
				this.mouseIsHoveringOnNeuron = false;
				Redraw_Neural_Network_For_Neuron_Hover = true;
			}
		}
	}

	public highlightAlgorithmSelectedWeight(pointX: number, pointY: number, 
		                             previousLayer: NeuronLayerTrainerWithAlgorithm, learningRate: number): void {
		if(this.incomingWeights != null) {
			for(var i=0; i < this.incomingWeights.length; i++) {
				var previousNeuron = previousLayer.getIthNeuron(i);
				this.incomingWeights[i].highlightAlgorithmWeight(pointX, pointY, previousNeuron.getXPosition(), previousNeuron.getYPosition(), 
										this.getXPosition(), this.getYPosition(), previousNeuron.getOutput(), this.getDelta(), learningRate );
			}
		}
	}

	private showAlgorithmNeuronPopup(previousLayer: NeuronLayerTrainerWithAlgorithm, nextLayer: NeuronLayerTrainerWithAlgorithm,
		                                    desiredOutputsArray: number[]): void {
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
	public neurons: NeuronTrainerWithAlgorithm[];
    protected  nextLayer: NeuronLayerTrainerWithAlgorithm;
	protected  previousLayer: NeuronLayerTrainerWithAlgorithm;

	constructor(context: CanvasRenderingContext2D, numNeuronsInLayer: number) {
		super(context, numNeuronsInLayer);
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i] = new NeuronTrainerWithAlgorithm(this.context, i);
		}
	}

	public locateAlgorithmNeuron(x: number, y: number, desiredOutputsArray: number[]): void {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].highlightAlgorithmNeuron(x, y, this.previousLayer, this.nextLayer, desiredOutputsArray);
		}
	}

	public locateAlgorithmWeight(x: number, y: number, learningRate: number): void {
		for(var i=0; i < this.neurons.length; i++) {
			this.neurons[i].highlightAlgorithmSelectedWeight(x, y, this.previousLayer, learningRate);
		}
	}
}

const NEURONS_IN_EACH_LAYER_FOR_ALGORITHM = [2, 2, 3, 1];
const TOP_NEURON_LOCATIONS_FOR_ALGORITHM = [{x:150, y:180}, {x:400,y:180}, {x:650,y:130}, {x:900,y:260}];

export class NeuralNetworkTrainerWithAlgorithm extends NeuralNetworkTrainer {
	protected neuronLayers: NeuronLayerTrainerWithAlgorithm[];

	constructor(context: CanvasRenderingContext2D) {
		super(context);
	}

	public initializeNeuronLayers(): void {
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

	public drawNeuralNetwork(): void {
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


	protected highlightNeuronOnMouseHover(x: number, y: number): void {
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].locateAlgorithmNeuron(x, y, this.trainingData.getIthOutputArray( this.selectedExampleIndex) );
			if(Redraw_Neural_Network_For_Neuron_Hover == true) {
				this.drawNeuralNetwork();
				Redraw_Neural_Network_For_Neuron_Hover = false;
			} 
		}
	}

	protected highlightWeightOnMouseHover(x: number, y: number): void {
		for(var i=0; i < this.numberOfLayers; i++) {
			this.neuronLayers[i].locateAlgorithmWeight(x,y, this.theLearningRate);
			if(Redraw_Neural_Network_For_Weight_Hover == true) {
				this.drawNeuralNetwork();
				Redraw_Neural_Network_For_Weight_Hover = false;
			} 
		}
	}
}
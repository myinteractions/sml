
class XORNeuralNetworkTrainer extends XORNeuralNetwork {
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
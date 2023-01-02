export class TrainingData {
	constructor() {
		this.myNumberOfExamples = 4;
        this.inputs = new Array(this.myNumberOfExamples);
        this.outputs = new Array(this.myNumberOfExamples);
	}

	numberOfExamples() {
		return this.myNumberOfExamples;
	}

	getIthInputArray(i) {
		return this.inputs[i];
	}

	getIthOutputArray(i) {
		return this.outputs[i];
	}

    getIthOutputValue(i) {
        return this.outputs[i][0];
    }

    initializeForThisApplication() {
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
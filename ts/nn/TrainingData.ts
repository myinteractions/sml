export class TrainingData {
	private myNumberOfExamples: number;
	private inputs: number[][];
	private outputs: number[][];

	constructor() {
		this.myNumberOfExamples = 4;
		this.inputs = new Array(this.myNumberOfExamples);
		this.outputs = new Array(this.myNumberOfExamples);
	}

	public numberOfExamples(): number {
		return this.myNumberOfExamples;
	}

	public getIthInputArray(i: number): number[] {
		return this.inputs[i];
	}

	public getIthOutputArray(i: number): number[] {
		return this.outputs[i];
	}

    public getIthOutputValue(i: number): number {
        return this.outputs[i][0];
    }

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
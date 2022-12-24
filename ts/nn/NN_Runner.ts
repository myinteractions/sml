
import {windowToCanvas} from '../utilities/Geometry.js';
import {NeuralNetwork, NeuralNetworkTrainer} from './NeuralNetworkElements.js';
import {DEFAULT_LEARNING_RATE} from './NeuralNetworkElements.js';
import {NeuralNetworkTrainerWithAlgorithm} from './NeuralNetworkAlgorithmDemo.js';

/**
 * Operating Code for Canvas a
 */
const canvas_a: HTMLCanvasElement = document.getElementById('canvas_a') as HTMLCanvasElement;
const context_a: CanvasRenderingContext2D = canvas_a.getContext('2d');

const randomizeButton_a: HTMLButtonElement = document.getElementById('randomizeButton_a') as HTMLButtonElement;
const nextInputButton_a: HTMLButtonElement = document.getElementById('nextInputButton_a') as HTMLButtonElement;

const nn_a = new NeuralNetwork(context_a);
nn_a.initializeNeuronLayers();
nn_a.drawNeuralNetwork();

canvas_a.onmousemove = function (e: MouseEvent) {
    const location = windowToCanvas(canvas_a, e.clientX, e.clientY);
    nn_a.highlightWeightOrNeuronOnMouseHover(location.x, location.y);
};

randomizeButton_a.onclick = function (e: MouseEvent) {
    nn_a.initializeNeuronLayers();
    nn_a.drawNeuralNetwork();
};

nextInputButton_a.onclick = function (e: MouseEvent) {
    nn_a.takeNextStep();
};

/**
 * Operating Code for Canvas b
 */

const canvas_b: HTMLCanvasElement = document.getElementById('canvas_b') as HTMLCanvasElement;
const context_b: CanvasRenderingContext2D = canvas_b.getContext('2d');

const runTrainingButton_b: HTMLButtonElement = document.getElementById('runTrainingButton_b') as HTMLButtonElement;
const nextInputButton_b: HTMLButtonElement = document.getElementById('nextInputButton_b') as HTMLButtonElement;
const randomizeButton_b: HTMLButtonElement = document.getElementById('randomizeButton_b') as HTMLButtonElement;

const nn_b = new NeuralNetworkTrainer(context_b);
nn_b.initializeNeuronLayers();
nn_b.drawNeuralNetwork();

canvas_b.onmousemove = function (e: MouseEvent) {
    var location = windowToCanvas(canvas_b, e.clientX, e.clientY);
    nn_b.highlightWeightOrNeuronOnMouseHover(location.x, location.y);
};

document.onkeypress = function (e: KeyboardEvent) {
    nn_a.propagateKeypressEventToHighlightedWeight(e);
    nn_b.propagateKeypressEventToHighlightedWeight(e);
}

document.onkeydown = function (e: KeyboardEvent) {
    nn_a.propagateKeydownEventToHighlightedWeight(e);
    nn_b.propagateKeydownEventToHighlightedWeight(e);
}

randomizeButton_b.onclick = function () {
    nn_b.initializeNeuronLayers();
    nn_b.drawNeuralNetwork();
};

nextInputButton_b.onclick = function () {
    nn_b.takeNextStep();
};

runTrainingButton_b.onclick = function () {
    nn_b.runTraining(DEFAULT_MAX_TRAINING_RUNS, true);
};

const DEFAULT_MAX_TRAINING_RUNS = 50000;

/**
 * Operating Code for Canvas c
 */

const canvas_c: HTMLCanvasElement = document.getElementById('canvas_c') as HTMLCanvasElement;
const context_c = canvas_c.getContext('2d');

const runTrainingButton_c: HTMLButtonElement = document.getElementById('runTrainingButton_c') as HTMLButtonElement;
const defaultsButton_c: HTMLButtonElement = document.getElementById('defaultsButton_c') as HTMLButtonElement;
const randomizeButton_c: HTMLButtonElement = document.getElementById('randomizeButton_c') as HTMLButtonElement;
const iterationsSelect: HTMLSelectElement = document.getElementById("iterationsSelect") as HTMLSelectElement;
const learningRateSelect: HTMLSelectElement = document.getElementById("learningRateSelect") as HTMLSelectElement;

const nn_c = new NeuralNetworkTrainerWithAlgorithm(context_c);
nn_c.initializeNeuronLayers();
nn_c.drawNeuralNetwork();

canvas_c.onmousemove = function (e: MouseEvent) {
    var location = windowToCanvas(canvas_c, e.clientX, e.clientY);
    nn_c.highlightWeightOrNeuronOnMouseHover(location.x, location.y);
};

randomizeButton_c.onclick = function () {
    nn_c.initializeNeuronLayers();
    nn_c.drawNeuralNetwork();
};

runTrainingButton_c.onclick = function () {
    nn_c.runTraining( parseFloat(iterationsSelect.value), true);
}

defaultsButton_c.onclick = function() {
    setDropDownsToDefaultValues();
}

function setDropDownsToDefaultValues(): void {
    if( parseFloat(learningRateSelect.value) != DEFAULT_LEARNING_RATE) {
        learningRateSelect.value = DEFAULT_LEARNING_RATE.toString();
        setLearningRate();
    }
    iterationsSelect.value = DEFAULT_MAX_TRAINING_RUNS.toString();
}

learningRateSelect.onchange = setLearningRate;
setLearningRate();

function setLearningRate(): void {
    nn_c.setNeuralNetworkLearningRate( parseFloat(learningRateSelect.value) );
    nn_c.runTraining(2, false);
}

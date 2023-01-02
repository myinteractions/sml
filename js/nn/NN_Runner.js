
import {windowToCanvas} from '../utilities/Geometry.js';
import {NeuralNetwork, NeuralNetworkTrainer} from './NeuralNetworkElements.js';
import {DEFAULT_LEARNING_RATE} from './NeuralNetworkElements.js';
import {NeuralNetworkTrainerWithAlgorithm} from './NeuralNetworkAlgorithmDemo.js';

/**
 * Operating Code for Canvas a
 */
let canvas_a = document.getElementById('canvas_a');
let context_a = canvas_a.getContext('2d');

let randomizeButton_a = document.getElementById('randomizeButton_a');
let nextInputButton_a = document.getElementById('nextInputButton_a');

let nn_a = new NeuralNetwork(context_a);
nn_a.initializeNeuronLayers();
nn_a.drawNeuralNetwork();

canvas_a.onmousemove = function (e) {
    var location = windowToCanvas(canvas_a, e.clientX, e.clientY);
    nn_a.highlightWeightOrNeuronOnMouseHover(location.x, location.y);
};

randomizeButton_a.onclick = function (e) {
    nn_a.initializeNeuronLayers();
    nn_a.drawNeuralNetwork();
};

nextInputButton_a.onclick = function (e) {
    nn_a.takeNextStep();
};

/**
 * Operating Code for Canvas b
 */

let canvas_b = document.getElementById('canvas_b');
let context_b = canvas_b.getContext('2d');

let runTrainingButton_b = document.getElementById('runTrainingButton_b');
let nextInputButton_b = document.getElementById('nextInputButton_b');
let randomizeButton_b = document.getElementById('randomizeButton_b');

let nn_b = new NeuralNetworkTrainer(context_b);
nn_b.initializeNeuronLayers();
nn_b.drawNeuralNetwork();

canvas_b.onmousemove = function (e) {
    var location = windowToCanvas(canvas_b, e.clientX, e.clientY);
    nn_b.highlightWeightOrNeuronOnMouseHover(location.x, location.y);
};

document.onkeypress = function (e) {
    nn_a.propagateKeypressEventToHighlightedWeight(e);
    nn_b.propagateKeypressEventToHighlightedWeight(e);
}

document.onkeydown = function (e) {
    nn_a.propagateKeydownEventToHighlightedWeight(e);
    nn_b.propagateKeydownEventToHighlightedWeight(e);
}

randomizeButton_b.onclick = function (e) {
    nn_b.initializeNeuronLayers();
    nn_b.drawNeuralNetwork();
};

nextInputButton_b.onclick = function (e) {
    nn_b.takeNextStep();
};

runTrainingButton_b.onclick = function (e) {
    nn_b.runTraining(DEFAULT_MAX_TRAINING_RUNS, true);
};

const DEFAULT_MAX_TRAINING_RUNS = 50000;

/**
 * Operating Code for Canvas c
 */

let canvas_c = document.getElementById('canvas_c');
let context_c = canvas_c.getContext('2d');

let runTrainingButton_c = document.getElementById('runTrainingButton_c');
let defaultsButton_c = document.getElementById('defaultsButton_c');
let randomizeButton_c = document.getElementById('randomizeButton_c');

let nn_c = new NeuralNetworkTrainerWithAlgorithm(context_c);
nn_c.initializeNeuronLayers();
nn_c.drawNeuralNetwork();

canvas_c.onmousemove = function (e) {
    var location = windowToCanvas(canvas_c, e.clientX, e.clientY);
    nn_c.highlightWeightOrNeuronOnMouseHover(location.x, location.y);
};

randomizeButton_c.onclick = function (e) {
    nn_c.initializeNeuronLayers();
    nn_c.drawNeuralNetwork();
};

runTrainingButton_c.onclick = function (e) {
    nn_c.runTraining( parseFloat(iterationsSelect.value), true);
}

defaultsButton_c.onclick = function(e) {
    setDropDownsToDefaultValues();
}

function setDropDownsToDefaultValues() {
    if( parseFloat(learningRateSelect.value) != DEFAULT_LEARNING_RATE) {
        learningRateSelect.value = DEFAULT_LEARNING_RATE;
        setLearningRate();
    }
    iterationsSelect.value = DEFAULT_MAX_TRAINING_RUNS;
}

learningRateSelect.onchange = setLearningRate;
setLearningRate();
function setLearningRate() {
    nn_c.setNeuralNetworkLearningRate( parseFloat(learningRateSelect.value) );
    nn_c.runTraining(2, false);
}

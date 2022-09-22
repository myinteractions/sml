
/**
 * Operating Code for Canvas a
 */
let xor_canvas_a = document.getElementById('xor_canvas_a');
let xor_context_a = xor_canvas_a.getContext('2d');

let xorRandomizeButton_a = document.getElementById('xorRandomizeButton_a');
let xorNextInputButton_a = document.getElementById('xorNextInputButton_a');

let xor_nn_a = new XORNeuralNetwork(xor_context_a);
xor_nn_a.initializeNeuronLayers();
xor_nn_a.drawNeuralNetwork();

xor_canvas_a.onmousemove = function (e) {
    var location = windowToCanvas(xor_canvas_a, e.clientX, e.clientY);
    xor_nn_a.highlightWeightOrNeuronOnMouseHover(location.x, location.y);
};

xorRandomizeButton_a.onclick = function (e) {
    xor_nn_a.initializeNeuronLayers();
    xor_nn_a.drawNeuralNetwork();
};

xorNextInputButton_a.onclick = function (e) {
    xor_nn_a.takeXORNextStep();
};


/**
 * Operating Code for Canvas b
 */
let xor_canvas_b = document.getElementById('xor_canvas_b');
let xor_context_b = xor_canvas_b.getContext('2d');

let xorRunTrainingButton_b = document.getElementById('xorRunTrainingButton_b');
let xorNextInputButton_b = document.getElementById('xorNextInputButton_b');
let xorRandomizeButton_b = document.getElementById('xorRandomizeButton_b');

let xor_nn_b = new XORNeuralNetworkTrainer(xor_context_b);
xor_nn_b.initializeNeuronLayers();
xor_nn_b.drawNeuralNetwork();

xor_canvas_b.onmousemove = function (e) {
    var location = windowToCanvas(xor_canvas_b, e.clientX, e.clientY);
    xor_nn_b.highlightWeightOrNeuronOnMouseHover(location.x, location.y);
};

document.onkeypress = function (e) {
    xor_nn_a.propagateKeypressEventToHighlightedWeight(e);
    xor_nn_b.propagateKeypressEventToHighlightedWeight(e);
}

document.onkeydown = function (e) {
    xor_nn_a.propagateKeydownEventToHighlightedWeight(e);
    xor_nn_b.propagateKeydownEventToHighlightedWeight(e);
}

xorRandomizeButton_b.onclick = function (e) {
    xor_nn_b.initializeNeuronLayers();
    xor_nn_b.drawNeuralNetwork();
};

xorNextInputButton_b.onclick = function (e) {
    xor_nn_b.takeXORNextStep();
};

xorRunTrainingButton_b.onclick = function (e) {
    xor_nn_b.runTraining(DEFAULT_MAX_TRAINING_RUNS, true);
};

const DEFAULT_MAX_TRAINING_RUNS = 50000;
/**
 * Operating Code for Canvas c
 */
let xor_canvas_c = document.getElementById('xor_canvas_c');
let xor_context_c = xor_canvas_c.getContext('2d');

let xorRunTrainingButton_c = document.getElementById('xorRunTrainingButton_c');
let xorDefaultsButton_c = document.getElementById('xorDefaultsButton_c');
let xorRandomizeButton_c = document.getElementById('xorRandomizeButton_c');

let xor_nn_c = new XORNeuralNetworkTrainerWithAlgorithm(xor_context_c);
xor_nn_c.initializeNeuronLayers();
xor_nn_c.drawNeuralNetwork();

xor_canvas_c.onmousemove = function (e) {
    var location = windowToCanvas(xor_canvas_c, e.clientX, e.clientY);
    xor_nn_c.highlightWeightOrNeuronOnMouseHover(location.x, location.y);
};

xorRandomizeButton_c.onclick = function (e) {
    xor_nn_c.initializeNeuronLayers();
    xor_nn_c.drawNeuralNetwork();
};

xorRunTrainingButton_c.onclick = function (e) {
    xor_nn_c.runTraining( parseFloat(iterationsSelect.value), true);
}

xorDefaultsButton_c.onclick = function(e) {
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
    xor_nn_c.setNeuralNetworkLearningRate( parseFloat(learningRateSelect.value) );
    xor_nn_c.runTraining(2, false);
}


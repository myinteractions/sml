var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

var randomizeButton = document.getElementById('randomizeButton');

let nn = new NeuralNetwork(context);
nn.initializeNeuronLayers();
nn.drawNeuralNetwork();

canvas.onmousemove = function (e) {
    var location = windowToCanvas(canvas, e.clientX, e.clientY);
    nn.highlightWeightOrNeuronOnMouseHover(location.x, location.y);
};

randomizeButton.onclick = function (e) {
    nn.initializeNeuronLayers();
    nn.drawNeuralNetwork();
};



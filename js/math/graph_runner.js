var function_context = document.getElementById('graph_function_canvas').getContext('2d');

var lineButton = document.getElementById('lineButton');
var squaredButton = document.getElementById('squaredButton');
var sigmoidButton = document.getElementById('sigmoidButton');

var theSlider = document.getElementById('myRange');
theSlider.value = 0;

let lineFunction = new LineFunction(function_context, 0.5);
let squaredFunction = new SquaredFunction(function_context);
let sigmoidFunction = new SigmoidFunction(function_context);
sigmoidFunction.drawFunction(theSlider);

let SELECTED_FUNCTION = "SIGMOID";

lineButton.onclick = function (e) {
    SELECTED_FUNCTION = "LINE";
    theSlider.value = 0;
    lineFunction.drawFunction(theSlider);
};

squaredButton.onclick = function (e) {
    SELECTED_FUNCTION = "SQUARED";
    theSlider.value = 0;
    squaredFunction.drawFunction(theSlider);
};

sigmoidButton.onclick = function (e) {
    SELECTED_FUNCTION = "SIGMOID";
    theSlider.value = 0;
    sigmoidFunction.drawFunction(theSlider);
};

theSlider.oninput = function() {
    if(SELECTED_FUNCTION == "SIGMOID") {
        sigmoidFunction.drawFunction(theSlider);
    } else if (SELECTED_FUNCTION == "SQUARED") {
        squaredFunction.drawFunction(theSlider);
    } else if (SELECTED_FUNCTION == "LINE") {
        lineFunction.drawFunction(theSlider);
    }
} 





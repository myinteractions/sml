
import {windowToCanvas} from '../utilities/Geometry.js';
import {BasicNeuralNetwork} from './BasicNeuralNetworkElements.js';

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement,
      context: CanvasRenderingContext2D = canvas.getContext('2d');

const randomizeButton: HTMLButtonElement = document.getElementById('randomizeButton') as HTMLButtonElement;

const nn = new BasicNeuralNetwork(context);
nn.initializeNeuronLayers();
nn.drawNeuralNetwork();

canvas.onmousemove = function (e: MouseEvent): void {
    const location = windowToCanvas(canvas, e.clientX, e.clientY);
    nn.highlightWeightOrNeuronOnMouseHover(location.x, location.y);
};

randomizeButton.onclick = function (): void {
    nn.initializeNeuronLayers();
    nn.drawNeuralNetwork();
};



import {Geometry, Coordinates} from '../utilities/Geometry.js';
import {Calculator} from '../utilities/Calculator.js';

class GraphGeometry {
	context: CanvasRenderingContext2D;
	geometry: Geometry;

	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
		this.geometry = new Geometry(context);
	}

	drawLine(startingCoordinates: Coordinates, endingCoordinates: Coordinates, strokeStyle: string, 
		     lineWidth: number) {
		this.context.save();
		this.geometry.drawLine(startingCoordinates.x, startingCoordinates.y, endingCoordinates.x, endingCoordinates.y,
							   strokeStyle, lineWidth);
		this.context.restore();
	}

	drawCircle(centerCoordinates: Coordinates, radius: number, fillStyle: string, strokeStyle: string, strokeWidth: number) {
		this.context.save();
		this.geometry.drawCircle(centerCoordinates.x, centerCoordinates.y, radius, fillStyle, strokeStyle, strokeWidth);
		this.context.restore();
	}
}

const FUNCTION_TEXT_FONT = "16px Helvetica";
const EXPONENTIAL_TEXT_FONT = "12px Helvetica";
const FUNCTION_TEXT_COLOR = "black";

class GraphTextHandler {
	constructor(context) {
		this.context = context;
		this.geometry = new GraphGeometry(context);
		this.calculator = new Calculator();

		this.topLeft = {x: 50, y: 50};
		this.f_of_x = {x: 0, y: 25};
	}

	drawText(text, coordinates, alignment, baseline) {
		this.context.textAlign = alignment;
		this.context.textBaseline = baseline;
		this.context.fillText(text, coordinates.x, coordinates.y)
	}
}

class SigmoidTextHandler extends GraphTextHandler {
	constructor(context) {
		super(context);

		this.sigmoidFractionStartingCoordinates = {x: 105, y: 25};
	}

	drawSigmoidText(axisXValue, axisYValue) {
		this.context.save();
		this.context.translate(this.topLeft.x, this.topLeft.y);
		this.context.font = FUNCTION_TEXT_FONT;
		this.context.fillStyle = FUNCTION_TEXT_COLOR;
		this.draw_f_of_x(axisXValue);
		this.drawSigmoidFraction(axisXValue);
		this.drawEqualsYValue(axisYValue);
		this.context.restore();
	}

	draw_f_of_x(axisXValue) {
		this.drawText("f(  " + axisXValue + "  ) ", this.f_of_x, "left", "middle");	
		this.drawText("=", {x: this.f_of_x.x + 85, y: this.f_of_x.y}, "left", "middle");
	}

	drawSigmoidFraction(axisXValue) {
		let endingCoordinates = {x: this.sigmoidFractionStartingCoordinates.x + 100, y: this.sigmoidFractionStartingCoordinates.y};
		this.geometry.drawLine(this.sigmoidFractionStartingCoordinates, endingCoordinates, FUNCTION_TEXT_COLOR, 1.5);
		let numeratorX = (endingCoordinates.x + this.sigmoidFractionStartingCoordinates.x) / 2;
		let numeratorY = this.f_of_x.y - 12;
		let numeratorCoordinates = {x: numeratorX, y: numeratorY};
		this.drawText("1", numeratorCoordinates, "right", "middle");
		let denominatorX = (endingCoordinates.x + this.sigmoidFractionStartingCoordinates.x) / 2.4;
		let denominatorY = this.f_of_x.y + 20;
		let denominatorCoordinates = {x: denominatorX, y: denominatorY};
		this.drawText("1 + e", denominatorCoordinates, "center", "middle");
		this.context.save();
		this.context.font = EXPONENTIAL_TEXT_FONT;
		let exponentialX = (endingCoordinates.x + this.sigmoidFractionStartingCoordinates.x) / 2;
		let exponentialY = this.f_of_x.y + 20;
		let exponentialCoordinates = {x: exponentialX, y: exponentialY};
		this.drawText("- ( " + axisXValue + " )",  exponentialCoordinates, "left", "bottom");
		this.context.restore();
	}

	drawEqualsYValue(axisYValue) {
		let equalsX = this.sigmoidFractionStartingCoordinates.x + 125;
		let equalsY = this.sigmoidFractionStartingCoordinates.y;
		let equalsCoordinates = {x: equalsX, y: equalsY};
		this.drawText(" =   " + axisYValue, equalsCoordinates, "left", "middle");
	}
}

class SquaredTextHandler extends GraphTextHandler {
	constructor(context) {
		super(context);
	}

	drawSquaredText(axisXValue, axisYValue) {
		this.context.save();
		this.context.translate(this.topLeft.x, this.topLeft.y);
		this.context.font = FUNCTION_TEXT_FONT;
		this.context.fillStyle = FUNCTION_TEXT_COLOR;
		this.draw_f_of_x(axisXValue);
		this.drawSquaredExpression(axisXValue);
		this.drawEqualsYValue(axisYValue);
		this.context.restore();
	}

	draw_f_of_x(axisXValue) {
		this.drawText("f(  " + axisXValue + "  ) ", this.f_of_x, "left", "middle");	
		this.drawText("=", {x: this.f_of_x.x + 80, y: this.f_of_x.y}, "left", "middle");
	}

	drawSquaredExpression(axisXValue) {
		let squaredCoordinates = {x: this.f_of_x.x + 100, y: this.f_of_x.y};
		this.drawText("(" + axisXValue + ")", squaredCoordinates, "left", "middle");
		this.context.save();
		this.context.font = EXPONENTIAL_TEXT_FONT;
		let exponentialCoordinates = {x: squaredCoordinates.x + 50, y: squaredCoordinates.y};
		this.drawText("2", exponentialCoordinates, "left", "bottom");
		this.context.restore();
	}

	drawEqualsYValue(axisYValue) {
		let equalsX = this.f_of_x.x + 175;
		let equalsY = this.f_of_x.y;
		let equalsCoordinates = {x: equalsX, y: equalsY};
		let yValue = this.calculator.roundDecimalTo(axisYValue, 4);
		this.drawText(" =   " + yValue, equalsCoordinates, "left", "middle");
	}
}

class LineTextHandler extends GraphTextHandler {
	constructor(context) {
		super(context);
	}

	drawLineText(axisXValue, axisYValue) {
		this.context.save();
		this.context.translate(this.topLeft.x, this.topLeft.y);
		this.context.font = FUNCTION_TEXT_FONT;
		this.context.fillStyle = FUNCTION_TEXT_COLOR;
		this.draw_f_of_x(axisXValue);
		this.drawLineExpression(axisXValue);
		this.drawEqualsYValue(axisYValue);
		this.context.restore();
	}

	draw_f_of_x(axisXValue) {
		this.drawText("f(  " + axisXValue + "  ) ", this.f_of_x, "left", "middle");	
		this.drawText("=", {x: this.f_of_x.x + 80, y: this.f_of_x.y}, "left", "middle");
	}

	drawLineExpression(axisXValue) {
		let fractionStartingCoordinates = {x: this.f_of_x.x + 100, y: this.f_of_x.y};
		let fractionEndingCoordinates = {x: this.f_of_x.x + 130, y: this.f_of_x.y};
		this.geometry.drawLine(fractionStartingCoordinates, fractionEndingCoordinates, FUNCTION_TEXT_COLOR, 1.5);
		let numeratorCoordinates = {x: (fractionStartingCoordinates.x + fractionEndingCoordinates.x) / 2, y: this.f_of_x.y - 12};
		this.drawText("1", numeratorCoordinates, "center", "middle");
		let denominatorCoordinates = {x: (fractionStartingCoordinates.x + fractionEndingCoordinates.x) / 2, y: this.f_of_x.y + 12};
		this.drawText("2", denominatorCoordinates, "center", "middle");	
		this.drawText("times", {x: this.f_of_x.x + 155, y: this.f_of_x.y}, "center", "middle");
		this.drawText(axisXValue, {x: this.f_of_x.x + 180, y: this.f_of_x.y}, "left", "middle");
	}

	drawEqualsYValue(axisYValue) {
		let equalsX = this.f_of_x.x + 225;
		let equalsY = this.f_of_x.y;
		let equalsCoordinates = {x: equalsX, y: equalsY};
		this.drawText(" =  " + axisYValue, equalsCoordinates, "left", "middle");
	}
}

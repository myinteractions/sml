
function windowToCanvas(canvas, x, y) {
	var bbox = canvas.getBoundingClientRect();
	return { x: x - bbox.left * (canvas.width / bbox.width),
			 y: y - bbox.top * (canvas.height / bbox.height)
	};
}

class GraphCalculator {
	roundDecimalTo(number, decimalDigits) {
		let intermediateNumber = number * Math.pow(10, decimalDigits);
		let returnValue = Math.round(intermediateNumber)/Math.pow(10, decimalDigits);
		if(returnValue == -0) {
			returnValue = 0;
		}
		return returnValue;
	}
}

class Geometry {
	constructor(context) {
		this.context = context;
	}

	drawLine(startingCoordinates, endingCoordinates, strokeStyle, lineWidth) {
		this.context.save();
		this.context.beginPath();
		this.context.lineWidth = lineWidth;
		this.context.strokeStyle = strokeStyle;
		this.context.moveTo(startingCoordinates.x, startingCoordinates.y);
		this.context.lineTo(endingCoordinates.x, endingCoordinates.y);
		this.context.stroke();
		this.context.restore();
	}

	drawCircle(centerCoordinates, radius, fillStyle, strokeStyle, strokeWidth) {
		this.context.save();
		// draw outline of circle
		this.context.beginPath();
		this.context.lineWidth = strokeWidth;
		this.context.strokeStyle = strokeStyle;
		this.context.arc(centerCoordinates.x, centerCoordinates.y, radius, 0, Math.PI*2, false);
		this.context.stroke();

		// fill circle with color
		this.context.beginPath();
		this.context.fillStyle = fillStyle;
		this.context.arc(centerCoordinates.x, centerCoordinates.y, radius, 0, Math.PI*2, false);
		this.context.fill();

		this.context.restore();
	}
}

const FUNCTION_TEXT_FONT = "16px Helvetica";
const EXPONENTIAL_TEXT_FONT = "12px Helvetica";
const FUNCTION_TEXT_COLOR = "black";

class GraphTextHandler {
	constructor(context) {
		this.context = context;
		this.geometry = new Geometry(context);
		this.calculator = new GraphCalculator();

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

class Axes {
	constructor(context) {
		this.context = context;
		this.geometry = new Geometry(context);
		this.graphTextHandler = new GraphTextHandler(context);

		// basic properties
		this.origin;
		this.leftExtent;
		this.rightExtent;
		this.bottomExtent;
		this.topExtent;
		this.horizontalTickSpacing;
		this.verticalTickSpacing;

		// style related properties
		this.axisColor;
		this.tickColor;
		this.labelColor;
		this.axisWidth;
		this.tickLength;
		this.labelFont;
		this.spaceBetweenLabelsAndAxes;
	}

	getOrigin() {
		return origin;
	}

	setBasicProperties(origin, leftExtent, rightExtent, bottomExtent, topExtent, horizontalTickSpacing, verticalTickSpacing) {
		this.origin = origin;
		this.leftExtent = leftExtent;
		this.rightExtent = rightExtent;
		this.bottomExtent = bottomExtent;
		this.topExtent = topExtent;
		this.horizontalTickSpacing = horizontalTickSpacing;
		this.verticalTickSpacing = verticalTickSpacing;
	}

	setStyle(axisColor, tickColor, labelColor, axisWidth, tickLength, labelFont, spaceBetweenLabelsAndAxes) {
		this.axisColor = axisColor;
		this.tickColor = tickColor;
		this.labelColor = labelColor;
		this.axisWidth = axisWidth;
		this.tickLength = tickLength;
		this.labelFont = labelFont;
		this.spaceBetweenLabelsAndAxes = spaceBetweenLabelsAndAxes;
	}

	drawAxes() {
		this.drawHorizontalAxis();
		this.drawVerticalAxis();
		this.drawHorizontalTicks();
		this.drawVerticalTicks();
		this.context.save();
		this.context.font = this.labelFont;
		this.context.fillStyle = this.labelColor;
		this.drawHorizontalLabels();
		this.drawVerticalLabels();
		this.context.restore();
	}

	drawHorizontalAxis() {
		let startingX = this.origin.x - this.leftExtent;
		let startingY = this.origin.y;
		let endingX = this.origin.x + this.rightExtent;
		let endingY = this.origin.y;
		let startingPoint = {x: startingX, y: startingY};
		let endingPoint = {x: endingX, y: endingY};
		this.geometry.drawLine(startingPoint, endingPoint, this.axisColor, this.axisWidth);
	}

	drawVerticalAxis() {
		let startingX = this.origin.x;
		let startingY = this.origin.y + this.bottomExtent;
		let endingX = this.origin.x;
		let endingY = this.origin.y - this.topExtent;
		let startingPoint = {x: startingX, y: startingY};
		let endingPoint = {x: endingX, y: endingY};
		this.geometry.drawLine(startingPoint, endingPoint, this.axisColor, this.axisWidth);
	}

	drawHorizontalTicks() {
		let numberOfLeftTicks = Math.floor(this.leftExtent/this.horizontalTickSpacing);
		let numberOfRightTicks = Math.floor(this.rightExtent/this.horizontalTickSpacing);
		for(var i = 0; i < numberOfLeftTicks; i++) {
			this.drawLeftTick(i);
		}
		for(var i = 0; i < numberOfRightTicks; i++) {
			this.drawRightTick(i);
		}
	}

	drawLeftTick(tickNumber) {
		let startingX = this.origin.x - tickNumber * this.horizontalTickSpacing;
		let startingY = this.origin.y + this.tickLength/2;
		let endingX = startingX;
		let endingY = this.origin.y - this.tickLength/2;
		let startingPoint = {x: startingX, y: startingY};
		let endingPoint = {x: endingX, y: endingY};
		this.geometry.drawLine(startingPoint, endingPoint, this.tickColor, this.axisWidth);
	}

	drawRightTick(tickNumber) {
		let startingX = this.origin.x + tickNumber * this.horizontalTickSpacing;
		let startingY = this.origin.y + this.tickLength/2;
		let endingX = startingX;
		let endingY = this.origin.y - this.tickLength/2;
		let startingPoint = {x: startingX, y: startingY};
		let endingPoint = {x: endingX, y: endingY};
		this.geometry.drawLine(startingPoint, endingPoint, this.tickColor, this.axisWidth);
	}

	drawVerticalTicks() {
		let numberOfLowerTicks = Math.floor(this.bottomExtent/this.verticalTickSpacing);
		let numberOfUpperTicks = Math.floor(this.topExtent/this.verticalTickSpacing);
		for(var i = 0; i < numberOfLowerTicks; i++) {
			this.drawLowerTick(i);
		}
		for(var i = 0; i < numberOfUpperTicks; i++) {
			this.drawUpperTick(i);
		}
	}

	drawLowerTick(tickNumber) {
		let startingX = this.origin.x - this.tickLength/2;
		let startingY = this.origin.y + tickNumber * this.verticalTickSpacing;
		let endingX = this.origin.x + this.tickLength/2;
		let endingY = startingY;
		let startingPoint = {x: startingX, y: startingY};
		let endingPoint = {x: endingX, y: endingY};
		this.geometry.drawLine(startingPoint, endingPoint, this.tickColor, this.axisWidth);
	}

	drawUpperTick(tickNumber) {
		let startingX = this.origin.x - this.tickLength/2;
		let startingY = this.origin.y - tickNumber * this.verticalTickSpacing;
		let endingX = this.origin.x + this.tickLength/2;
		let endingY = startingY;
		let startingPoint = {x: startingX, y: startingY};
		let endingPoint = {x: endingX, y: endingY};
		this.geometry.drawLine(startingPoint, endingPoint, this.tickColor, this.axisWidth);
	}

	drawHorizontalLabels() {
		let numberOfLeftLabels = Math.floor(this.leftExtent/this.horizontalTickSpacing);
		let numberOfRightLabels = Math.floor(this.rightExtent/this.horizontalTickSpacing);
		for(var i = 1; i < numberOfLeftLabels; i++) {
			this.drawLeftLabel(i);
		}
		for(var i = 1; i < numberOfRightLabels; i++) {
			this.drawRightLabel(i);
		}
	}

	drawLeftLabel(tickNumber) {
		let xCoordinate = this.origin.x - tickNumber * this.horizontalTickSpacing;;
		let yCoordinate = this.origin.y + this.spaceBetweenLabelsAndAxes;
		let coordinates = {x: xCoordinate, y: yCoordinate};
		this.graphTextHandler.drawText("-" + tickNumber, coordinates, "center", "middle");
	}

	drawRightLabel(tickNumber) {
		let xCoordinate = this.origin.x + tickNumber * this.horizontalTickSpacing;;
		let yCoordinate = this.origin.y + this.spaceBetweenLabelsAndAxes;
		let coordinates = {x: xCoordinate, y: yCoordinate};
		this.graphTextHandler.drawText("" + tickNumber, coordinates, "center", "middle");
	}

	drawVerticalLabels() {
		let numberOfLowerLabels = Math.floor(this.bottomExtent/this.verticalTickSpacing);
		let numberOfUpperLabels = Math.floor(this.topExtent/this.verticalTickSpacing);
		for(var i=1; i < numberOfLowerLabels; i++) {
			this.drawLowerLabel(i);
		}
		for(var i=1; i < numberOfUpperLabels; i++) {
			this.drawUpperLabel(i);
		}
	}

	drawLowerLabel(tickNumber) {
		let xCoordinate = this.origin.x - this.spaceBetweenLabelsAndAxes;
		let yCoordinate = this.origin.y + tickNumber * this.verticalTickSpacing;
		let coordinates = {x: xCoordinate, y: yCoordinate};
		this.graphTextHandler.drawText("-" + tickNumber, coordinates, "center", "middle");
	}

	drawUpperLabel(tickNumber) {
		let xCoordinate = this.origin.x - this.spaceBetweenLabelsAndAxes;
		let yCoordinate = this.origin.y - tickNumber * this.verticalTickSpacing;
		let coordinates = {x: xCoordinate, y: yCoordinate};
		this.graphTextHandler.drawText("" + tickNumber, coordinates, "center", "middle");
	}
 }

const AXIS_COLOR = "blue";
const TICK_COLOR = "blue";
const LABEL_COLOR = "dimgray";
const AXIS_WIDTH = 0.5;
const TICK_LENGTH = 10;
const LABEL_FONT = "11px Helvetica";
const SPACE_BETWEEN_LABELS_AND_AXES = 15;

const FUNCTION_COLOR = "navy";
const FUNCTION_WIDTH = 1.4;

class Function {
	constructor(context) {
 		this.context = context;
 		this.myAxes = new Axes(context);
 		this.geometry = new Geometry(context);
 		this.calculator = new GraphCalculator();
 		this.graphTextHandler;

 		this.myAxes.setStyle(AXIS_COLOR, TICK_COLOR, LABEL_COLOR, AXIS_WIDTH, TICK_LENGTH, LABEL_FONT, SPACE_BETWEEN_LABELS_AND_AXES);

 		this.currentX = 0;
 		this.currentY = 0;
	}

	drawFunction() {
		this.context.clearRect(0,0,this.context.canvas.width, this.context.canvas.height);
		this.myAxes.drawAxes();
		this.drawSubclassFunction();
		this.drawCurrentCoordinates();
	}

	drawCurrentCoordinates() {
		this.context.save();
		this.context.translate(this.Axis_Origin.x, this.Axis_Origin.y);
		let currentCoordinates = {x: this.currentX, y: this.currentY};
		this.geometry.drawCircle(currentCoordinates, 4, "white", "black", 1);
		this.context.restore();
	}

	drawSubclassFunction() {
		this.context.save();
		this.context.translate(this.Axis_Origin.x, this.Axis_Origin.y);
		let previousX = -this.Left_Starting_Point;
		let previousY = this.calculateFunctionValue(previousX);
		var newX, newY, previousCoordinates, newCoordinates;
		for(var x= -this.Left_Starting_Point+1; x <= this.Right_Ending_Point; x++) {
			newX = x;
			newY = this.calculateFunctionValue(newX);
			previousCoordinates = {x: previousX, y: previousY};
			newCoordinates = {x: newX, y: newY};
			this.geometry.drawLine(previousCoordinates, newCoordinates, FUNCTION_COLOR, FUNCTION_WIDTH);
			previousX = newX;
			previousY = newY;
		}
		this.context.restore();
	}
}

class LineFunction extends Function {
	constructor(context, slope) {
		super(context);
		this.graphTextHandler = new LineTextHandler(context);

		this.slope = slope;

		this.Axis_Origin = {x:this.context.canvas.width/2, y:this.context.canvas.height/2};
		this.Left_Extent = 300;
		this.Right_Extent = 300;
		this.Bottom_Extent = 180;
		this.Top_Extent = 180;
		this.Horizontal_Tick_Spacing = 25;
		this.Vertical_Tick_Spacing = 25;

		this.Left_Starting_Point = this.Horizontal_Tick_Spacing * 12;
		this.Right_Ending_Point = this.Horizontal_Tick_Spacing * 12;

		this.myAxes.setBasicProperties(this.Axis_Origin, this.Left_Extent, this.Right_Extent, this.Bottom_Extent, this.Top_Extent, 
			                      this.Horizontal_Tick_Spacing, this.Vertical_Tick_Spacing);
	}

	drawFunction(slider) {
		this.setSliderRelatedValues(slider);
		this.currentX = slider.value;
		this.currentY = this.calculateFunctionValue(this.currentX);
		super.drawFunction();
		this.drawGraphText();
	}

	drawGraphText() {
		let xValue = this.calculator.roundDecimalTo(this.currentX / this.Horizontal_Tick_Spacing, 2);
		let yValue = this.calculateExactFunctionValue(xValue);
		this.graphTextHandler.drawLineText(xValue, yValue);
	}

	setSliderRelatedValues(slider) {
		slider.style.width = "650px";
		slider.min = -this.Left_Starting_Point;
		slider.max = this.Right_Ending_Point;
	}

	calculateFunctionValue(x){
		return -this.Vertical_Tick_Spacing * (this.slope * (x/this.Horizontal_Tick_Spacing));
	}

	calculateExactFunctionValue(x) {
		return this.slope * x;
	}
}

class SquaredFunction extends Function {
	constructor(context) {
		super(context);
		this.graphTextHandler = new SquaredTextHandler(context);

		this.Axis_Origin = {x:this.context.canvas.width/2, y:this.context.canvas.height/2 + this.context.canvas.height/4};
		this.Left_Extent = 300;
		this.Right_Extent = 300;
		this.Bottom_Extent = 100;
		this.Top_Extent = 300;
		this.Horizontal_Tick_Spacing = 25;
		this.Vertical_Tick_Spacing = 25;

		this.Left_Starting_Point = this.Horizontal_Tick_Spacing * 3.4;
		this.Right_Ending_Point = this.Horizontal_Tick_Spacing * 3.4;

		this.myAxes.setBasicProperties(this.Axis_Origin, this.Left_Extent, this.Right_Extent, this.Bottom_Extent, this.Top_Extent, 
			                      this.Horizontal_Tick_Spacing, this.Vertical_Tick_Spacing);
	}

	drawFunction(slider) {
		this.setSliderRelatedValues(slider);
		this.currentX = slider.value;
		this.currentY = this.calculateFunctionValue(this.currentX);
		super.drawFunction();
		this.drawGraphText();
	}

	drawGraphText() {
		let xValue = this.calculator.roundDecimalTo(this.currentX / this.Horizontal_Tick_Spacing, 2);
		let yValue = this.calculateExactFunctionValue(xValue);
		this.graphTextHandler.drawSquaredText(xValue, yValue);
	}

	setSliderRelatedValues(slider) {
		slider.style.width = "190px";
		slider.min = -this.Left_Starting_Point;
		slider.max = this.Right_Ending_Point;
	}

	calculateFunctionValue(x){
		return -this.Vertical_Tick_Spacing * ((x/this.Horizontal_Tick_Spacing) * (x/this.Horizontal_Tick_Spacing));
	}

	calculateExactFunctionValue(x) {
		return x ** 2;
	}
}

class SigmoidFunction extends Function {
	constructor(context) {
		super(context);
		this.graphTextHandler = new SigmoidTextHandler(context);

		this.Axis_Origin = {x:this.context.canvas.width/2, y:this.context.canvas.height/2 + this.context.canvas.height/4};
		this.Left_Extent = 300;
		this.Right_Extent = 300;
		this.Bottom_Extent = 100;
		this.Top_Extent = 180;
		this.Horizontal_Tick_Spacing = 25;
		this.Vertical_Tick_Spacing = 90;

		this.Left_Starting_Point = this.Horizontal_Tick_Spacing * 12;
		this.Right_Ending_Point = this.Horizontal_Tick_Spacing * 12;

		this.myAxes.setBasicProperties(this.Axis_Origin, this.Left_Extent, this.Right_Extent, this.Bottom_Extent, this.Top_Extent, 
			                      this.Horizontal_Tick_Spacing, this.Vertical_Tick_Spacing);
	}

	drawFunction(slider) {
		this.setSliderRelatedValues(slider);
		this.currentX = slider.value;
		this.currentY = this.calculateFunctionValue(this.currentX);
		super.drawFunction();
		this.drawGraphText();
		this.drawSupportingLine();
	}

	drawGraphText() {
		let xValue = this.calculator.roundDecimalTo(this.currentX / this.Horizontal_Tick_Spacing, 2);
		let yValue = this.calculateExactFunctionValue(xValue);
		this.graphTextHandler.drawSigmoidText(xValue, yValue);
	}

	setSliderRelatedValues(slider) {
		slider.style.width = "650px";
		slider.min = -this.Left_Starting_Point;
		slider.max = this.Right_Ending_Point;
	}

	calculateFunctionValue(x){
		return -this.Vertical_Tick_Spacing * (1 / (1 + Math.exp(-x/this.Horizontal_Tick_Spacing)));
	}

	calculateExactFunctionValue(x) {
		return (1 / (1 + Math.exp(-x)));
	}

	drawSupportingLine() {
		let startingX = this.Axis_Origin.x - this.Left_Extent;
		let startingY = this.Axis_Origin.y - this.Vertical_Tick_Spacing;
		let endingX = this.Axis_Origin.x + this.Right_Extent;
		let endingY = startingY;
		let startingPoint = {x: startingX, y: startingY};
		let endingPoint = {x: endingX, y: endingY};
		this.geometry.drawLine(startingPoint, endingPoint, AXIS_COLOR, 0.2);
	}
}
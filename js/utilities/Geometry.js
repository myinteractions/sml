
// Geometry

export function windowToCanvas(canvas, x, y) {
	var bbox = canvas.getBoundingClientRect();
	return { x: x - bbox.left * (canvas.width / bbox.width),
			 y: y - bbox.top * (canvas.height / bbox.height)
	};
}

export class Geometry {

	constructor(context) {
		this.context = context;
	}

	drawLine(startX, startY, endX, endY, strokeStyle, lineWidth) {
		this.context.beginPath();
		this.context.lineWidth = lineWidth;
		this.context.strokeStyle = strokeStyle;
		this.context.moveTo(startX, startY);
		this.context.lineTo(endX, endY);
		this.context.stroke();
	}

	drawCircle(centerX, centerY, radius, fillStyle, strokeStyle, strokeWidth) {
		// draw outline of circle
		this.context.beginPath();
		this.context.lineWidth = strokeWidth;
		this.context.strokeStyle = strokeStyle;
		this.context.arc(centerX, centerY, radius, 0, Math.PI*2, false);
		this.context.stroke();

		// fill circle with color
		this.context.beginPath();
		this.context.fillStyle = fillStyle;
		this.context.arc(centerX, centerY, radius, 0, Math.PI*2, false);
		this.context.fill();
	}

	pointIsWithinCircle(pointX, pointY, centerX, centerY, circleRadius) {
		let distanceX = pointX - centerX;
		let distanceY = pointY - centerY;
		if( Math.sqrt( distanceX*distanceX + distanceY*distanceY) < circleRadius ) {
			return true;
		} else {
			return false;
		}
	}

	pointIsOnTheLine(pointX, pointY, startX, startY, endX, endY, slopeMargin, cutOffDistance) {
		let lineSlope = (startY - endY)/(endX - startX);
		let pointSlope = (startY - pointY)/(pointX - startX);
		let distanceFromStart = Math.sqrt( (pointX - startX)**2 + (pointY - startY)**2 );
		let distanceFromEnd = Math.sqrt( (pointX - endX)**2 + (pointY - endY)**2 );

		if( Math.abs(lineSlope - pointSlope) < slopeMargin && distanceFromStart > cutOffDistance && distanceFromEnd > cutOffDistance) {
			if(lineSlope == 0) {
				if(pointX <= endX && pointX >= startX) {
					return true;
				}
			} else if( lineSlope > 0 ) {
				if(pointY <= startY && pointY >= endY && pointX <= endX && pointX >= startX) {
					return true;
				}
			} else {
				if (pointY >= startY && pointY <= endY && pointX <= endX && pointX >= startX) {
					return true;
				}
			}
		}
		return false;
	}
}

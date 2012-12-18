function Canvas (drawingarea) {
	
	var parentElement = document.getElementById(drawingarea.container);
	
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('id', 'canvas');
	this.canvas.setAttribute('width', drawingarea.width);
	this.canvas.setAttribute('height', drawingarea.height);
	
	this.canvas = parentElement.appendChild(this.canvas);
	
	this.ctx = this.canvas.getContext('2d');
	
}

Canvas.prototype.drawPolygon = function (points,style,x,y) {
	
	//if (!x || !y) {console.error('canvas.drawPolygon: invalid coordinates x: ' + x + ', y: ' + y); return false; };

	var ctx = this.ctx;
	var i = points.length-1;

	// if the points provided don't close the shape then copy the first point to the end
	if ( points[0] != points[i] ) { i = points.push( [points[0][0],points[0][1]] ) - 1; }
	
	ctx.fillStyle = style['fill'];
	
	ctx.save();
	ctx.translate(x,y);
	
	ctx.beginPath();
	ctx.moveTo(points[i][0],points[i][1]);
	while (i--) {
		ctx.lineTo(points[i][0],points[i][1]);
	}
	ctx.fill();
	ctx.restore();

}

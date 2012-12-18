function Grid (width, height, rows, columns, tilewidth, tileheight, tilegap, moveCostMultipliers) {
	
	this.nodes = [];  // absolute position of the node in screen coordinates.
	this.visible = [];
	this.walkable = [];
	this.moveCostMultiplier = moveCostMultipliers || [];
	
	for (var i = 0; i < (columns+rows); i++) {
		this.nodes[i] = [];
		this.visible[i] = [];
		this.walkable[i] = [];
		this.moveCostMultiplier[i] =[];
		for (var j = 0; j < rows; j++) {
			x = (i * (2*tilewidth+tilegap)) - ((j * (2*tilewidth+tilegap)/2));
			y = (j * ((2*tileheight) + (Math.cos(30*(Math.PI/180)) * tilegap)));
			this.nodes[i][j] = [x,y];
			this.moveCostMultiplier[i][j] = 1;
			this.walkable[i][j] = this.visible[i][j] = (x >= 0 && x <= width) && (y >= 0 && y <= height);
		}
	}	
}
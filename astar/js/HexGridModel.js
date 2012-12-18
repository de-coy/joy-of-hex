function HexGridModel (drawingArea,tile) {
	
	this.nodes = [];  // x,y position of the node
	this.visible = [];

	this.columns = Math.floor(drawingArea.width / ((2 * tile.height) + tile.gap));
	this.rows = Math.floor(drawingArea.height / ((2 * tile.radius) + tile.gap));
	
	var i = this.columns+this.rows;
	while (i--) {

		this.nodes[ i ] = [];
		this.visible[ i ] = [];
		
		var j = this.rows;
		while (j--) {
		
			x = ( i * ( 2 * tile.radius + tile.gap ) ) - (( j * ( 2 * tile.radius + tile.gap )/2));
			y = ( j * ( ( 2 * tile.height ) + ( Math.cos( 30 * ( Math.PI/180 ) ) * tile.gap )));
			
			this.nodes[i][j] = [x,y];
			this.visible[i][j] = (x >= 0 && x <= drawingArea.width) && (y >= 0 && y <= drawingArea.height);
			
		}
		
	}

}

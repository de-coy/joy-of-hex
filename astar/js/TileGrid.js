/**
 * @author de.coy
 */

TileGrid = function ( tileGeometry, tileSpacing, width, height, drawfunction ) {

		this.nodeIds = [];
		this.nodes = [];  // x,y position of the node
		this.visible = [];
		
		var tileData = tileGeometry.params;
	
		this.columns = Math.floor( width / ( ( 2 * tileData.innerRadius ) + tileSpacing ) );
		this.rows = Math.floor( height / ( ( 2 * tileData.outerRadius ) + tileSpacing ) );
		
		var i = this.columns+this.rows;
		while (i--) {
	
			this.nodes[ i ] = [];
			this.visible[ i ] = [];
			
			var j = this.rows;
			while (j--) {
			
				x = ( i * ( 2 * tileData.outerRadius + tileSpacing ) ) - (( j * ( 2 * tileData.outerRadius + tileSpacing )/2));
				y = ( j * ( ( 2 * tileData.innerRadius ) + ( Math.cos( 30 * ( Math.PI/180 ) ) * tileSpacing )));
				
				this.nodes[i][j] = [x,y];
				if ( (x >= 0 && x <= width) && (y >= 0 && y <= height) ) {
					this.visible[ i ][ j ] = true;
					this.nodeIds.push( [ i, j ] );
				};
				
			}
			
		}
		
		
		var i = this.nodeIds.length;
		while ( i-- ) {
			var x = this.nodeIds[i][0];
			var y = this.nodeIds[i][1];
		}
		
		return this;


};


TileGrid.prototype.constructor = THREE.TileGrid;

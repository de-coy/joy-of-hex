/**
 * @author de.coy
 */

PolyTile = function ( sides, radius, rotation, extrudeAmount ) {

	// Polytile extends THREE.Shape
	THREE.Shape.call( this );
	
	var sides = sides;
	
	var outerRadius = radius;
	var innerRadius = Math.cos( 30 * (Math.PI/180) ) * outerRadius;
	
	var rotation = rotation;
	
	var polygon = new RegularPolygon ( sides, radius, rotation );
	
	var points = polygon.points();
	
	var i = points.length - 1;
	
	// if the points provided don't close the shape then copy the first point to the end and update 
	if ( points[ 0 ] != points[ i ] ){ i = points.push( [ points[ 0 ][ 0 ],points[ 0 ][ 1 ] ] ) - 1; }

	this.moveTo( points[ i ][ 0 ], points[ i ][ 1 ]);
	while (i--) {
		this.lineTo( points[ i ][ 0 ], points[ i ][ 1 ]);
	}
	
	var geometry = this.extrude( 	{	amount: extrudeAmount,
										bevelEnabled: false		});
	geometry.params = {
		sides : sides,
		outerRadius : outerRadius,
		innerRadius : innerRadius,
		rotation : rotation
	};
	
						
	return geometry;

};


PolyTile.prototype = new THREE.Shape();
PolyTile.prototype.constructor = THREE.PolyTile;

/**
 * @author de.coy
 */

PolyTile = function ( tileOptions ) {

	// Polytile extends THREE.Shape
	THREE.Shape.call( this );
	
	var sides = tileOptions.sides;
	var outerRadius = tileOptions.radius;
	var innerRadius = Math.cos( 30 * (Math.PI/180) ) * outerRadius;
	var rotation = tileOptions.rotation;
	var extrudeAmount = tileOptions.extrudeAmount; 
	
	var polygon = new RegularPolygon ( sides, outerRadius, rotation );
	var points = polygon.points();

	// Move to the last point in the 
	this.moveTo( points[ points.length -1 ][ 0 ], points[ points.length -1 ][ 1 ]);
	
	var i = 0;
	while (i < points.length) {
		this.lineTo( points[ i ][ 0 ], points[ i ][ 1 ]);
		i++;
	} // while loop that imitaes a for loop is FAST see http://jsperf.com/loops/73
	
	var geometry = this.extrude( 	{	amount: extrudeAmount,
										bevelEnabled: false		});
	geometry.params = {
		sides : sides,
		outerRadius : outerRadius,
		innerRadius : innerRadius,
		rotation : rotation,
		extrudeAmount : extrudeAmount
	};
						
	return geometry;

};


PolyTile.prototype = new THREE.Shape();
PolyTile.prototype.constructor = THREE.PolyTile;

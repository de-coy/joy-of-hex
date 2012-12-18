function RegularPolygon (sides, radius, rotation) {
	
	var numberOfSides = sides || 6,
		radius = radius || 100,
		
		rotation = rotation * (Math.PI/180),
	
		theta = (360/numberOfSides)*(Math.PI/180),
	
		points = [];
	
	for (var i = numberOfSides; i > 0; i--) {
		points[i-1] = [
			Math.round((radius * Math.cos(theta * i))*100)/100,
			Math.round((radius * Math.sin(theta * i))*100)/100
		];
	}
	
	if (rotation) {
		for (var i = points.length; i > 0; i--) {
			points[i-1] = rotatePoint(rotation,points[i-1])
		}
	}
	
	function rotatePoint(ang,pos) {
	    return [
	        (pos[0] * Math.cos(ang)) - (pos[1] * Math.sin(ang)),
	        (pos[0] * Math.sin(ang)) + (pos[1] * Math.cos(ang))
	    ];
	}
	
	this.points = function () {
		if (points) {
			return points;
		}
	}

}
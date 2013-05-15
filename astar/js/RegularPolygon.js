function RegularPolygon (sides, radius, rotation) {
	
	var numberOfSides = sides || 6,
		radius = radius || 10,
		rotation = rotation * (Math.PI/180),
		theta = (360/numberOfSides)*(Math.PI/180),
		points = [],
		i = 0;
	
	while ( i < numberOfSides ){
	    points[i] = [
            Math.round((radius * Math.cos(theta * i))*100)/100,
            Math.round((radius * Math.sin(theta * i))*100)/100
        ];
        i++;
	}
	
	if (rotation) {
	    i = 0;
	    while (i < points.length){
	        points[i] = rotatePoint(rotation,points[i]);
	        i++;
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
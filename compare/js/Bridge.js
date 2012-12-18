function Bridge (home, destination) {
	
	if (!home || !destination) {
		return false;
	} 
	
	var home = {
			"x" : home[0],
			"y" : home[1]
		},
	
		destination = {
			"x" : destination[0],
			"y" : destination[1]
		};
}

Bridge.prototype.home = function (pos) {
	if (pos) {
		this.home.x = pos[0];
		this.home.y = pos[1];
	} else {
		return this.home;
	}
}

Bridge.prototype.destination = function (pos) {
	if (pos) {
		this.destination.x = pos[0];
		this.destination.y = pos[1];
	} else {
		return this.destination;
	}
}
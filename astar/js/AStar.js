function AStar (grid, start, finish) {
	
	var nodes = grid.nodes,
		walkable = grid.visible,
		
		sortedFScores = [], // [f,x,y]
		
		neighbors = [],
		f, g, h,
		nX,nY,
		stepX,stepY,
		parent, 
		
		path = [],
		
		sX = start[0],
		sY = start[1],
		fX = finish[0],
		fY = finish[1],
		x  = sX,
		y  = sY,
		
		nodeScores = array2D( nodes.length, nodes[0].length, [0,0,0] ), // [f,g,h]
		openList   = array2D( nodes.length, nodes[0].length, false ), // true or false
		closedList = array2D( nodes.length, nodes[0].length, false ), // true or false
		nodeParent = array2D( nodes.length, nodes[0].length, false ); // true or false
		
	edges = function (x,y) {
		return [	[x,		y-1],
					[x+1,	y  ],
					[x+1,	y+1],
					[x,		y+1],
					[x-1,	y  ],
					[x-1,	y-1]];
	} 
	
	bridges = function (x,y) {
		return [	[x-1,   y-2],
					[x+1,	y-1],
					[x+2,	y+1],
					[x+1,   y+2],
					[x-1,	y+1],
					[x-2,	y+1]];
	}

	
	
	// This JS implementation of A* is based on the following source:
	// http://www.policyalmanac.org/games/aStarTutorial.htm
	
	if (!walkable[sX][sY] || !walkable[fX][fY] ) { console.error('Start or finish node is not visible.'); return false };

	// calculate F = G(distance from start) + H(estimated distance to finish)
	h = heuristic(x,y,sX,sY,fX,fY);
	g = nodeScores[x][y][1];
	f = g + h;

	addToOpenList(x,y,f,g,h);
	
	while ( !closedList[fX][fY] || sortedFScores.length != 0) {
		if (sortedFScores.length == 0) {break};
		// Get the node with the lowest F cost node from the open list.
		// if (sortedFScores.length > 0) {console.log(sortedFScores[0])};
		x = sortedFScores[0][1];
		y = sortedFScores[0][2];
		sortedFScores.shift();
		
		// move the node from the open list to the closed list
		openList[x][y] = false;
		closedList[x][y] = true;
		
		// calculate the neighbors of the current node
		// neighbors = calulateHexGridneighbors(x,y,true);
		neighbors = edges(x,y);
		// for each neighbor
		for (var i = neighbors.length-1; i >= 0; i--) {
			// that is walkable and not on the closed list
			nX = neighbors[i][0];
			nY = neighbors[i][1];
			if ( nX >= 0 && nY >= 0 && walkable[nX][nY] && !closedList[nX][nY] ) {
				
				h = heuristic(nX,nY,sX,sY,fX,fY);
				g = (nodeScores[nX][nY][1] + nodeScores[x][y][1]);
				f = g + h;
				
				// if it is not on the open list then add it 
				if (!openList[nX][nY]) {
					
					addToOpenList(nX,nY,f,g,h,x,y);
				} else { // it is on the openList
					
					// if this a shorter path than the one already on the list then overwrite it 
					if (g < nodeScores[nX][nY][1]) { 
						
						addToOpenList(nX,nY,f,g,h,x,y);
						
					}
				}	
			}
		}
	}
	
	// Calculate the path by following the parents from the finish to the start
	
	stepX = fX;
	stepY = fY;
	path.unshift([fX,fY]);
	
	while ( !(stepX == sX && stepY == sY) ) {
		
		parent = nodeParent[stepX][stepY];
		stepX = parent[0];
		stepY = parent[1];
		path.unshift( [ stepX, stepY ] );
		
	}
	
	path.unshift([sX,sY]);
	
	return path;
	
	
	
	
	
	
	//////////HELPER FUNCTIONS FOLLOW



	this.path = function () {
		return path;
	}
	
	
	
	

	function addToOpenList(x,y,f,g,h,pX,pY) {
		openList[x][y] = true;
		nodeParent[x][y] = [pX,pY];
		nodeScores[x][y] = [f,g,h];
		sortedFScores.push([f,x,y]);
		sortedFScores.sort(fSort);
	}



	

	function heuristic(x,y,sX,sY,fX,fY) {
		// This heuristic calculation uses the Euclidean distance to the finish
		// It favors nodes which fall along the direct path between the start 
		// and finish nodes by weighting the score using the cross product.
		// Thanks to http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html#breaking-ties 
		var dx1 = x - fX,
			dy1 = y - fY,
			dx2 = sX - fX,
			dy2 = sY - fY,
			cross = Math.abs(dx1*dy2 - dx2*dy1);
		return Math.sqrt(Math.pow((x - fX), 2) + Math.pow((y - fY), 2)) + cross*0.01;
	}
	



	
	function fSort(nodeA,nodeB) {
		if (nodeA[0] == nodeB[0]) { return 0 };
		if (nodeA[0] < nodeB[0]) { return -1 } else { return 1 };
	}
	



	
	function array2D(rows, columns, initialvalue){
		
		var array2D = [];
		
		for (var i = rows-1; i >= 0; i-- ) {
			array2D[ i ] = [];
			for ( var j = columns-1; j >= 0; j-- ) {
				array2D[ i ][ j ] = initialvalue;
			}
		}
		
		return array2D;
		
	}
	
}
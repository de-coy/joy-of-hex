$(document).ready(function() {

    // Setup the data for the drawing area
    // <div id="drawingarea"></div>
    var drawingArea = {
        "container" : 'drawingarea',
        "width" : 400, //window.innerWidth - 0,
        "height" : 400 //window.innerHeight - 5)
    }

    // Setup the tile data
    var tile = {
        "sides" : 6,
        "radius" : 12,
        "rotation" : 30
    }

    // TODO: only far a hexagon, need to make this generic
    tile.height = (tile.radius * Math.sqrt(3) / 2);

    /* this will move to CSS */
    var tileStyle = {
        "fill" : "#666666",
        "class" : "hex"
    }

    var tileHighlightStyle = {
        "fill" : "#FFFFFF"
    }

    var keyMap = {};

    // create a hexagonal tile
    var hexagon = new RegularPolygon(tile.sides, tile.radius, tile.rotation);

    // Create the basic grid data
    var gridData = {};
    gridData.gap = tile.radius / 4;
    gridData.columns = Math.floor(drawingArea.width / ((2 * tile.height) + gridData.gap));
    gridData.rows = Math.floor(drawingArea.height / ((2 * tile.radius) + gridData.gap));

    console.info('columns: ' + gridData.columns + ', rows: ' + gridData.rows);

    // create the grid
    grid = new Grid(drawingArea.width, drawingArea.height, gridData.rows, gridData.columns, tile.radius, tile.height, gridData.gap);

    // generate key map (why does this overshoot?)
    for(var i = 48; i <= 122; i++) {
        var c = gridData.columns - 7, r = gridData.rows - 2;
        c = Math.floor(Math.random() * c);
        r = Math.floor(Math.random() * r);
        keyMap[i.toString()] = [c + r, r];
    }
	
	
	console.time('WebGL');
    var webGL = new WebGL(drawingArea);
    webGL.createTileGeometry(tile.sides,tile.radius,tile.rotation,tileStyle.fill,tileHighlightStyle.fill);
    
    console.time('SVG');
	var svg = new SVG(drawingArea);
	console.time('Canvas');
    var canvas = new Canvas(drawingArea);
    draw();
    console.timeEnd('SVG');
    console.timeEnd('Canvas');
    webGL.animate();
    console.timeEnd('WebGL');


    function draw() {
		
		// Create a SVG Polygon within a Def element as a reference for cloning
        var svgHex = svg.createPolygon('hex', hexagon.points(), tileStyle);
        var svgHexLight = svg.createPolygon('hexlight', hexagon.points(), tileHighlightStyle);

        svg.createDef(svgHex);
        svg.createDef(svgHexLight);

        // Clone the hexagon to create a seed element for future clones
        // var seed = svg.createFromDef('hex', 'seed', {"x" : -100,"y" : -100});
        // generate clones for each visible node in the grid
        for(var i = 0; i < grid.nodes.length - 1; i++) {
            for(var j = 0; j < grid.nodes[i].length - 1; j++) {
                if(grid.visible[i][j]) {
                	drawNode(i, j);
                }
            }
        }
        
    }
    
    
    
    
    
    function drawNode(x, y) {
		svg.clone(svg.createFromDef('hex', 'seed', {"x" : -100,"y" : -100}), x + "_" + y, grid.nodes[x][y][0], grid.nodes[x][y][1]);
		canvas.drawPolygon(hexagon.points(), tileStyle, grid.nodes[x][y][0], grid.nodes[x][y][1]);
		webGL.drawTile(x, y, grid.nodes[x][y][0], grid.nodes[x][y][1]);
	}





    function drawPath(start, finish) {
        
        console.time('astar');
    	var path = new AStar(grid, start, finish);
    	console.info('Drawing path: ' + path);
    	console.timeEnd('astar');
    	
        var i = 0;
        var l = path.length;
        console.time('svg-anim');
        animate();

        function animate() {
            if(i == l-1) {
                console.timeEnd('svg-anim');
                return
            };
            i++;
            grid.walkable[path[i][0]][path[i][1]] = false;
            
            j = path[i][0];
            k = path[i][1];
            x = grid.nodes[j][k][0];
            y = grid.nodes[j][k][1];
            
            // SVG
            svg.setElementXLink(j + "_" + k, '#hexlight');
            // CANVAS
            canvas.drawPolygon(hexagon.points(), tileHighlightStyle, x, y );
            // WEBGL
            webGL.highlightTile(j,k);
            
            requestAnimationFrame(function(){
            	animate()
            });

        }

    }






    var keyPath = [];
    var first;
    document.onkeypress = keyPressHandler;
	
	addEventHandler(document.getElementById(drawingArea.container),'click',clickHandler);
	
	function addEventHandler(obj,type,fn)
	{
	    if(obj.addEventListener) {
	        obj.addEventListener(type,fn,false);
	    }
	    else if (obj.attachEvent) {
	        obj.attachEvent("on"+type,fn);
	    }
	    else {
			element['on' + eventName] = handler;
		}
	
	}

    function keyPressHandler(e) {

        // 32 		space
        // 48-57	numbers
        // 65-90	uppercase
        // 97-122	lowercase
        // charCode 0 keyCode 13 enter

        if(((e.keyCode == 0) || (e.keyCode >= 48 && e.keyCode <= 122) )) {
            if(e.charCode == 32) {
                // space has been pressed so close the shape
                console.log('space');
                keyPath.push(first);
            }
            if((e.charCode >= 48 && e.charCode <= 57) || (e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122)) {
                if(!first) {
                    first = keyMap[e.charCode]
                };
                keyPath.push(keyMap[e.charCode]);
            }

        }

        if(e.keyCode == 13) {
            // enter has been pressed
            console.log('enter');
        }

        if(keyPath.length == 2) {
            drawPath(keyPath[0],keyPath[1]);
            keyPath[0] = keyPath[1];
            keyPath.pop();
        }

    }



    var clickPath = [];

    function clickHandler(e) {
    	console.log(e);
    	var clickTarget = e.target.id; //e.target.correspondingUseElement.id
    	var clickNodeName = e.target.nodeName; //e.target.correspondingUseElement.nodeName
		if (clickNodeName == 'use' ) {
	        clickTarget = clickTarget.split('#');
	        clickTarget = clickTarget[0].split('_');
	        clickPath.push([parseInt(clickTarget[0]), parseInt(clickTarget[1])]);
	
	        if(clickPath.length == 2) {
	            drawPath(clickPath[0],clickPath[1]);
	            clickPath[0] = clickPath[1];
	            clickPath.pop();
	        }
	   }
    }

});

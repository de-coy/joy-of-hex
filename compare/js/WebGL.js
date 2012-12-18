function WebGL(drawingArea) {
	
	//// PUBLIC
	this.drawingArea = drawingArea,
	this.camera,
	this.scene,
	this.renderer,
	this.partcle,
	this.particles = [],
	this.particleCount,
	this.meshes = [],
	this.hMeshes = [],
	this.tileShape,
	
	this.tileMaterial,
	this.tileHighlightMaterial,
	
	this.clickCount = 0;
	
	
		
	////CONSTANTS
	var cos30 = Math.cos( 30 * (Math.PI/180) ),
		sin30 = Math.sin( 30 * (Math.PI/180) );
	
	
		
	////SWITCHES
	this.stats = true;
	this.rotate = false;
	this.ortho = false;
	
	
	////PRIVATE
	var pointlight1,
		pointlight2,
		geometry,
		container;
	
	
	
	//SCENE & RENDERER
	
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize( this.drawingArea.width, this.drawingArea.height );
	
	container = document.getElementById( this.drawingArea.container );
	container.appendChild( this.renderer.domElement );
	
	this.scene = new THREE.Scene();
	
	if (this.stats) {
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild( stats.domElement );
	}
	
	
	
	
	////LIGHTS
	
	var lights = [];
	
	pointlight = new THREE.PointLight( 0xDDDDDD );
	pointlight.position.x = 0;
	pointlight.position.y = 0;
	pointlight.position.z = 400;
	pointlight.intensity = 1;
	this.scene.add(pointlight);
	
	
	pointlight = new THREE.PointLight( 0xDDDDDD );
	pointlight.position.x = 800;
	pointlight.position.y = 300;
	pointlight.position.z = 400;
	pointlight.intensity = 1;
	this.scene.add(pointlight);

	
	////CAMERA
	this.camera = new THREE.PerspectiveCamera(22.66666, this.drawingArea.width / this.drawingArea.height, 1, 10000);
	this.camera.position.x = drawingArea.width / 2;
	this.camera.position.y = -(drawingArea.height / 2);
	this.camera.position.z = 1000;
	
	if (this.ortho) {
		this.camera = new THREE.OrthographicCamera(0,this.drawingArea.width,0,this.drawingArea.height,0.1,10000);

	}
	
	
	////MATERIALS
	this.extrudeSettings = {	amount: 4,
								bevelEnabled: false,
								bevelSegments: 2,
								steps: 2
							};

}




WebGL.prototype.toString = function () {
	return 'WebGL Object';
}




WebGL.prototype.createTileGeometry = function (sides,scale,rotation,fill,highlightfill) {
	
	this.tileMaterial = new THREE.MeshPhongMaterial({
		color : fill.replace('#','0x'),
	});
	
	this.tileHighlightMaterial = new THREE.MeshPhongMaterial({
		color : highlightfill.replace('#','0x'),
	});
	
	var hexagon = new RegularPolygon(sides,scale,rotation);
	var points = hexagon.points(); 
	var shape = new THREE.Shape();
	
	var i = points.length-1;

	// if the points provided don't close the shape then copy the first point to the end and update 
	if ( points[0] != points[i] ){ i = points.push( [points[0][0],points[0][1]] ) - 1; }

	shape.moveTo(points[i][0],points[i][1]);
	while (i--) {
		shape.lineTo(points[i][0],points[i][1]);
	}
		
	var hex3d = shape.extrude( this.extrudeSettings );
	
	this.tileShape = hex3d;
	
}





WebGL.prototype.drawTile = function (i, j, x, y) {
	
	var mesh = new THREE.Mesh( this.tileShape, this.tileMaterial );
	mesh.position.x = x;
	mesh.position.y = -y;
	mesh.position.z = 0;
	this.meshes[i + '_' + j] = mesh;
	this.scene.add( this.meshes[i + '_' + j] );
	
}





WebGL.prototype.highlightTile = function (i, j) {
	
	if (this.clickCount > 20 ) { this.rotate = true };
	this.meshes[i + '_' + j].materials[0] = this.tileHighlightMaterial;
	this.clickCount += 1;
	
}





WebGL.prototype.preRender = function () {
	for (mesh in this.meshes) {
		this.scene.add( this.meshes[mesh] );
	}
}





WebGL.prototype.render = function () {
 
	this.renderer.render(this.scene, this.camera);

}





WebGL.prototype.animate = function () {

	if (this.rotate) {
		for (mesh in this.meshes) {
			this.meshes[mesh].rotation.x += 0.01;
			this.meshes[mesh].rotation.y += 0.02;
			//this.meshes[mesh].rotation.z += 0.01;
		}
	}

	
	// RENDER
	this.renderer.render(this.scene, this.camera);
	
	
	// Include examples/js/RequestAnimationFrame.js for cross-browser compatibility.
	requestAnimationFrame(this.animate.bind(this));
	
	if (this.stats) { stats.update() };

}




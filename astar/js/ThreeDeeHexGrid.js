/**
 * @author de.coy
 */

function ThreeDeeHexGrid() {
	
	
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	
	////PRIVATE
	var DRAWINGAREA = {
					div: 'drawingarea',
					width: window.innerWidth,
					height: window.innerHeight
			};
				
	var TILESHAPE = {
					sides: 6,
					radius: 12,
					height: null,
					rotation: 30,
					gap: 0,
					extrudeAmount: 4
			};
			
	TILESHAPE.height = Math.cos( 30 * (Math.PI/180) ) * TILESHAPE.radius;
	
	var CAMERAVIEWINGANGLE = 35;
	var CAMERAZPOS = (DRAWINGAREA.width/2) / ( Math.tan( (CAMERAVIEWINGANGLE) * (Math.PI/180) ) ) * 1.35;
	
	this.scene,
	this.renderer,
	
	this.meshes = [],
	this.sprites = [],

	this.tile = new PolyTile ( TILESHAPE ),
	this.grid = new TileGrid( this.tile, 0, DRAWINGAREA.width, DRAWINGAREA.height, this.drawTile );


	this.mouse = { x: -100, y: -100 },
	
	this.tileMaterial,
	this.tileStrokeMaterial,
	this.tileHighlightMaterial,
	
	this.projector = new THREE.Projector(),
	this.obj,
	
	this.clickQueue = [],
	this.pathQueue = [];


	////SWITCHES
	this.stats = true,
	this.fog = true,
	this.gridRepair = true;
	
	
	////PRVIATE
	var that = this;
	
	
	//SCENE & RENDERER
	this.container = document.getElementById( DRAWINGAREA.div );
	this.renderer = new THREE.WebGLRenderer( { antialias: false } );
	this.renderer.setSize( DRAWINGAREA.width, DRAWINGAREA.height );
	this.container.appendChild( this.renderer.domElement );
	
	
	
	this.scene = new THREE.Scene();
	
	if (this.stats) {
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		this.container.appendChild( stats.domElement );
	}
	
	if (this.fog) {
		this.scene.fog = new THREE.Fog ( 0x000000, 0, CAMERAZPOS * 5 );
	}
	
	
	////LIGHTS
	var lights = [];
	
	var pointlight = new THREE.PointLight( 0xFFFFFF, 1, 2000 );
	pointlight.position.x = 0;
	pointlight.position.y = 0;
	pointlight.position.z = 400;
	this.scene.add( pointlight );	
	
	pointlight = new THREE.PointLight( 0xFFFFFF, 1, 2000 );
	pointlight.position.x = DRAWINGAREA.width;
	pointlight.position.y = DRAWINGAREA.height/2;
	pointlight.position.z = 400;
	this.scene.add( pointlight );
	
	
	////CAMERA
	this.camera = new THREE.PerspectiveCamera( CAMERAVIEWINGANGLE, DRAWINGAREA.width / DRAWINGAREA.height, 1, 10000 );
	this.camera.position.x = (DRAWINGAREA.width / 2);
	this.camera.position.y = -(DRAWINGAREA.height / 2);
	this.camera.position.z = CAMERAZPOS;
	this.scene.add( this.camera );

	
	////MATERIALS
	this.tileColor = 0x666666;
	this.tileHighlightColor = 0x14C5FF;

	this.tileMaterial = new THREE.MeshPhongMaterial({
		color : this.tileColor
	})
	
	this.tileHighlightMaterial = new THREE.MeshPhongMaterial({
		color : this.tileHighlightColor
	})

	// create the grid geometry
	for(var i = 0; i < this.grid.nodes.length - 1; i++) {
	    for(var j = 0; j < this.grid.nodes[ i ].length - 1; j++) {
	        if( this.grid.visible[ i ][ j ] ) {
	        	this.drawTile( i, j, this.grid.nodes[ i ][ j ][ 0 ], this.grid.nodes[ i ][ j ][ 1 ] );
	        }
	    }
	}
	
	//bind click events and link to pathfinder
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );

	function onDocumentMouseMove( event ) {

		event.preventDefault();

		that.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		that.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	}
	
	function onDocumentMouseDown( event ) {

		event.preventDefault();

		if ( that.obj ) {
			
			that.clickQueue.push(that.obj.index);
			that.obj.lit = true;
			
			if ( that.clickQueue.length > 1 ) {
				
				that.pathQueue = that.pathQueue.concat( new AStar( that.grid, that.clickQueue[ 0 ], that.clickQueue[ 1 ] ) );
				that.clickQueue.shift();
				
			}
			
		}
 
	}


}


ThreeDeeHexGrid.prototype.drawTile = function ( i, j, x, y ) {
		
		var mesh = new THREE.Mesh( this.tile, this.tileMaterial );
		mesh.position.x = x;
		mesh.position.y = -y;
		mesh.position.z = 0;
		mesh.animRate = 1; 
		mesh.index = [ i, j ];
		
		this.meshes[ i + '_' + j ] = mesh;
		this.scene.add( this.meshes[ i + '_' + j ] );
		
	}

ThreeDeeHexGrid.prototype.highlightTile = function ( mesh ) {
		
		mesh.materials[0] = this.tileHighlightMaterial;
		
	}



ThreeDeeHexGrid.prototype.render = function () {
	 
		this.renderer.render( this.scene, this.camera );
	
	}



ThreeDeeHexGrid.prototype.animate = function () {
		
		if ( this.pathQueue.length > 1 ) {
			
			var i = this.pathQueue[ 0 ][ 0 ],
				j = this.pathQueue[ 0 ][ 1 ];
			
			this.meshes[ i + '_' + j ].lit = true;
			this.meshes[ i + '_' + j ].hit = true;
			this.grid.visible[ i ][ j ] = false;

			this.pathQueue.shift();
			
		}

		for ( mesh in this.meshes ) {
			
			if ( this.meshes[mesh].hit ) {
				
				this.meshes[mesh].materials[0] = this.tileHighlightMaterial;
				
				if ( this.gridRepair = true && this.meshes[mesh].position.z >= this.camera.position.z * 10000) {
					
					this.meshes[mesh].hit = false;
					this.meshes[mesh].lit = false;
					this.meshes[mesh].position.z = 0;
					this.meshes[mesh].scale.z = 1;
					this.meshes[mesh].animRate = 1;
					
					id = mesh.split( '_' );
					i  = id[0];
					j  = id[1];
					this.grid.visible[ i ][ j ] = true;
					
				}
				
				rr = this.meshes[mesh].animRate / 8;
				this.meshes[mesh].position.z += 10 * rr;
				this.meshes[mesh].scale.z += 1 * rr;
				this.meshes[mesh].animRate += rr;
				
			} else {
				
				if ( !this.meshes[mesh].lit ) {
					
					this.meshes[mesh].materials[0] = this.tileMaterial;
					
				}
			
			}
			
		}
		
		
		// Detect mouse over
		vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
		this.projector.unprojectVector( vector, this.camera );

		ray = new THREE.Ray( this.camera.position, vector.subSelf( this.camera.position ).normalize() );
	
		intersects = ray.intersectScene( this.scene );
		
		if ( intersects.length > 0 ) { 
			this.obj = intersects[0].object;
			this.obj.materials[0] = this.tileHighlightMaterial
		};
		
		// RENDER
		this.renderer.render(this.scene, this.camera);
		
		
		// Include examples/js/RequestAnimationFrame.js for cross-browser compatibility.
		requestAnimationFrame(this.animate.bind(this));
		
		if (this.stats) { stats.update() };
	
	}






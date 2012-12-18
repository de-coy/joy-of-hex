// ThreeExtras.js r45 - http://github.com/mrdoob/three.js
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ColorUtils = {
	
	adjustHSV : function ( color, h, s, v ) {

		var hsv = THREE.ColorUtils.__hsv;
		
		THREE.ColorUtils.rgbToHsv( color, hsv );

		hsv.h = THREE.ColorUtils.clamp( hsv.h + h, 0, 1 );
		hsv.s = THREE.ColorUtils.clamp( hsv.s + s, 0, 1 );
		hsv.v = THREE.ColorUtils.clamp( hsv.v + v, 0, 1 );
		
		color.setHSV( hsv.h, hsv.s, hsv.v );

	},
	
	// based on MochiKit implementation by Bob Ippolito

	rgbToHsv : function ( color, hsv ) {

		var r = color.r;
		var g = color.g;
		var b = color.b;
		
		var max = Math.max( Math.max( r, g ), b );
		var min = Math.min( Math.min( r, g ), b );

		var hue;
		var saturation;
		var value = max;

		if ( min == max )	{

			hue = 0;
			saturation = 0;

		} else {

			var delta = ( max - min );
			saturation = delta / max;

			if ( r == max )	{

				hue = ( g - b ) / delta;

			} else if ( g == max ) {

				hue = 2 + ( ( b - r ) / delta );

			} else	{

				hue = 4 + ( ( r - g ) / delta );
			}

			hue /= 6;

			if ( hue < 0 ) {

				hue += 1;

			}
			
			if ( hue > 1 ) {

				hue -= 1;

			}

		}
		
		if ( hsv === undefined ) {
			
			hsv = { h: 0, s: 0, v: 0 };

		}
		
		hsv.h = hue;
		hsv.s = saturation;
		hsv.v = value;
		
		return hsv;

	},
	
	clamp: function ( x, a, b ) { 
		
		return x < a ? a : ( x > b ? b : x ); 

	}

};

THREE.ColorUtils.__hsv = { h: 0, s: 0, v: 0 };/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.GeometryUtils = {
	
	merge: function ( geometry1, object2 /* mesh | geometry */ ) {

		var matrix, matrixRotation,
		vertexOffset = geometry1.vertices.length,
		uvPosition = geometry1.faceVertexUvs[ 0 ].length,
		geometry2 = object2 instanceof THREE.Mesh ? object2.geometry : object2,
		vertices1 = geometry1.vertices,
		vertices2 = geometry2.vertices,
		faces1 = geometry1.faces,
		faces2 = geometry2.faces,
		uvs1 = geometry1.faceVertexUvs[ 0 ],
		uvs2 = geometry2.faceVertexUvs[ 0 ];

		if ( object2 instanceof THREE.Mesh ) {

			object2.matrixAutoUpdate && object2.updateMatrix();

			matrix = object2.matrix;
			matrixRotation = new THREE.Matrix4();
			matrixRotation.extractRotation( matrix, object2.scale );

		}

		// vertices

		for ( var i = 0, il = vertices2.length; i < il; i ++ ) {

			var vertex = vertices2[ i ];

			var vertexCopy = new THREE.Vertex( vertex.position.clone() );

			if ( matrix ) matrix.multiplyVector3( vertexCopy.position );

			vertices1.push( vertexCopy );

		}

		// faces

		for ( i = 0, il = faces2.length; i < il; i ++ ) {

			var face = faces2[ i ], faceCopy, normal, color,
			faceVertexNormals = face.vertexNormals,
			faceVertexColors = face.vertexColors;

			if ( face instanceof THREE.Face3 ) {

				faceCopy = new THREE.Face3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );

			} else if ( face instanceof THREE.Face4 ) {

				faceCopy = new THREE.Face4( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset, face.d + vertexOffset );

			}

			faceCopy.normal.copy( face.normal );

			if ( matrixRotation ) matrixRotation.multiplyVector3( faceCopy.normal );

			for ( var j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

				normal = faceVertexNormals[ j ].clone();

				if ( matrixRotation ) matrixRotation.multiplyVector3( normal );

				faceCopy.vertexNormals.push( normal );

			}

			faceCopy.color.copy( face.color );

			for ( var j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

				color = faceVertexColors[ j ];
				faceCopy.vertexColors.push( color.clone() );

			}

			faceCopy.materials = face.materials.slice();

			faceCopy.centroid.copy( face.centroid );
			if ( matrix ) matrix.multiplyVector3( faceCopy.centroid );

			faces1.push( faceCopy );

		}

		// uvs

		for ( i = 0, il = uvs2.length; i < il; i ++ ) {

			var uv = uvs2[ i ], uvCopy = [];

			for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( new THREE.UV( uv[ j ].u, uv[ j ].v ) );

			}

			uvs1.push( uvCopy );

		}

	},

	clone: function ( geometry ) {

		var cloneGeo = new THREE.Geometry();

		var i, il;

		var vertices = geometry.vertices,
			faces = geometry.faces,
			uvs = geometry.faceVertexUvs[ 0 ];

		// vertices

		for ( i = 0, il = vertices.length; i < il; i ++ ) {

			var vertex = vertices[ i ];
			var vertexCopy = new THREE.Vertex( vertex.position.clone() );

			cloneGeo.vertices.push( vertexCopy );

		}

		// faces

		for ( i = 0, il = faces.length; i < il; i ++ ) {

			var face = faces[ i ], faceCopy, normal, color,
			faceVertexNormals = face.vertexNormals,
			faceVertexColors = face.vertexColors;

			if ( face instanceof THREE.Face3 ) {

				faceCopy = new THREE.Face3( face.a, face.b, face.c );

			} else if ( face instanceof THREE.Face4 ) {

				faceCopy = new THREE.Face4( face.a, face.b, face.c, face.d );

			}

			faceCopy.normal.copy( face.normal );

			for ( var j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

				normal = faceVertexNormals[ j ];
				faceCopy.vertexNormals.push( normal.clone() );

			}

			faceCopy.color.copy( face.color );

			for ( var j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

				color = faceVertexColors[ j ];
				faceCopy.vertexColors.push( color.clone() );

			}

			faceCopy.materials = face.materials.slice();

			faceCopy.centroid.copy( face.centroid );

			cloneGeo.faces.push( faceCopy );

		}

		// uvs

		for ( i = 0, il = uvs.length; i < il; i ++ ) {

			var uv = uvs[ i ], uvCopy = [];

			for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( new THREE.UV( uv[ j ].u, uv[ j ].v ) );

			}

			cloneGeo.faceVertexUvs[ 0 ].push( uvCopy );

		}

		return cloneGeo;

	},

	// Get random point in triangle (via barycentric coordinates)
	// 	(uniform distribution)
	// 	http://www.cgafaq.info/wiki/Random_Point_In_Triangle

	randomPointInTriangle: function( vectorA, vectorB, vectorC ) {

		var a, b, c,
			point = new THREE.Vector3(),
			tmp = THREE.GeometryUtils.__v1;

		a = THREE.GeometryUtils.random();
		b = THREE.GeometryUtils.random();

		if ( ( a + b ) > 1 ) {

			a = 1 - a;
			b = 1 - b;

		}

		c = 1 - a - b;

		point.copy( vectorA );
		point.multiplyScalar( a );

		tmp.copy( vectorB );
		tmp.multiplyScalar( b );

		point.addSelf( tmp );

		tmp.copy( vectorC );
		tmp.multiplyScalar( c );

		point.addSelf( tmp );

		return point;

	},

	// Get random point in face (triangle / quad)
	// (uniform distribution)

	randomPointInFace: function( face, geometry, useCachedAreas ) {

		var vA, vB, vC, vD;

		if ( face instanceof THREE.Face3 ) {

			vA = geometry.vertices[ face.a ].position;
			vB = geometry.vertices[ face.b ].position;
			vC = geometry.vertices[ face.c ].position;

			return THREE.GeometryUtils.randomPointInTriangle( vA, vB, vC );

		} else if ( face instanceof THREE.Face4 ) {

			vA = geometry.vertices[ face.a ].position;
			vB = geometry.vertices[ face.b ].position;
			vC = geometry.vertices[ face.c ].position;
			vD = geometry.vertices[ face.d ].position;

			var area1, area2;

			if ( useCachedAreas ) {

				if ( face._area1 && face._area2 ) {

					area1 = face._area1;
					area2 = face._area2;

				} else {

					area1 = THREE.GeometryUtils.triangleArea( vA, vB, vD );
					area2 = THREE.GeometryUtils.triangleArea( vB, vC, vD );

					face._area1 = area1;
					face._area2 = area2;

				}

			} else {

				area1 = THREE.GeometryUtils.triangleArea( vA, vB, vD ),
				area2 = THREE.GeometryUtils.triangleArea( vB, vC, vD );

			}

			var r = THREE.GeometryUtils.random() * ( area1 + area2 );

			if ( r < area1 ) {

				return THREE.GeometryUtils.randomPointInTriangle( vA, vB, vD );

			} else {

				return THREE.GeometryUtils.randomPointInTriangle( vB, vC, vD );

			}

		}

	},

	// Get uniformly distributed random points in mesh
	// 	- create array with cumulative sums of face areas
	//  - pick random number from 0 to total area
	//  - find corresponding place in area array by binary search
	//	- get random point in face

	randomPointsInGeometry: function( geometry, n ) {

		var face, i,
			faces = geometry.faces,
			vertices = geometry.vertices,
			il = faces.length,
			totalArea = 0,
			cumulativeAreas = [],
			vA, vB, vC, vD;

		// precompute face areas

		for ( i = 0; i < il; i ++ ) {

			face = faces[ i ];

			if ( face instanceof THREE.Face3 ) {

				vA = vertices[ face.a ].position;
				vB = vertices[ face.b ].position;
				vC = vertices[ face.c ].position;

				face._area = THREE.GeometryUtils.triangleArea( vA, vB, vC );

			} else if ( face instanceof THREE.Face4 ) {

				vA = vertices[ face.a ].position;
				vB = vertices[ face.b ].position;
				vC = vertices[ face.c ].position;
				vD = vertices[ face.d ].position;

				face._area1 = THREE.GeometryUtils.triangleArea( vA, vB, vD );
				face._area2 = THREE.GeometryUtils.triangleArea( vB, vC, vD );

				face._area = face._area1 + face._area2;

			}

			totalArea += face._area;

			cumulativeAreas[ i ] = totalArea;

		}

		// binary search cumulative areas array

		function binarySearchIndices( value ) {

			function binarySearch( start, end ) {

				// return closest larger index
				// if exact number is not found

				if ( end < start )
					return start;

				var mid = start + Math.floor( ( end - start ) / 2 );

				if ( cumulativeAreas[ mid ] > value ) {

					return binarySearch( start, mid - 1 );

				} else if ( cumulativeAreas[ mid ] < value ) {

					return binarySearch( mid + 1, end );

				} else {

					return mid;

				}

			}

			var result = binarySearch( 0, cumulativeAreas.length - 1 )
			return result;

		}

		// pick random face weighted by face area

		var r, index,
			result = [];

		var stats = {};

		for ( i = 0; i < n; i ++ ) {

			r = THREE.GeometryUtils.random() * totalArea;

			index = binarySearchIndices( r );

			result[ i ] = THREE.GeometryUtils.randomPointInFace( faces[ index ], geometry, true );

			if ( ! stats[ index ] ) {

				stats[ index ] = 1;

			} else {

				stats[ index ] += 1;

			}

		}

		return result;

	},

	// Get triangle area (by Heron's formula)
	// 	http://en.wikipedia.org/wiki/Heron%27s_formula

	triangleArea: function( vectorA, vectorB, vectorC ) {

		var s, a, b, c,
			tmp = THREE.GeometryUtils.__v1;

		tmp.sub( vectorA, vectorB );
		a = tmp.length();

		tmp.sub( vectorA, vectorC );
		b = tmp.length();

		tmp.sub( vectorB, vectorC );
		c = tmp.length();

		s = 0.5 * ( a + b + c );

		return Math.sqrt( s * ( s - a ) * ( s - b ) * ( s - c ) );

	},

	// Get 16 bits of randomness
	// (standard Math.random() creates repetitive patterns when applied over larger space)

	random16: function() {

		return ( 65280 * Math.random() + 255 * Math.random() ) / 65535;

	},

	center: function( geometry ) {

		geometry.computeBoundingBox();

		var matrix = new THREE.Matrix4();

		var dx = -0.5 * ( geometry.boundingBox.x[ 1 ] + geometry.boundingBox.x[ 0 ] );
		var dy = -0.5 * ( geometry.boundingBox.y[ 1 ] + geometry.boundingBox.y[ 0 ] );
		var dz = -0.5 * ( geometry.boundingBox.z[ 1 ] + geometry.boundingBox.z[ 0 ] );

		matrix.setTranslation( dx, dy, dz );

		geometry.applyMatrix( matrix );

		geometry.computeBoundingBox();

	}


};

THREE.GeometryUtils.random = THREE.GeometryUtils.random16;

THREE.GeometryUtils.__v1 = new THREE.Vector3();
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ImageUtils = {

	loadTexture: function ( path, mapping, callback ) {

		var image = new Image(), texture = new THREE.Texture( image, mapping );

		image.onload = function () { texture.needsUpdate = true; if ( callback ) callback( this ); };
		image.crossOrigin = '';
		image.src = path;

		return texture;

	},

	loadTextureCube: function ( array, mapping, callback ) {

		var i, l, images = [], texture = new THREE.Texture( images, mapping );

		images.loadCount = 0;

		for ( i = 0, l = array.length; i < l; ++i ) {

			images[ i ] = new Image();
			images[ i ].onload = function () {

				images.loadCount += 1; 
				if ( images.loadCount == 6 ) texture.needsUpdate = true; 
				if ( callback ) callback( this );

			};

			images[ i ].crossOrigin = '';
			images[ i ].src = array[ i ];

		}

		return texture;

	},

	getNormalMap: function ( image, depth ) {

		// Adapted from http://www.paulbrunt.co.uk/lab/heightnormal/

		var cross = function ( a, b ) {

			return [ a[ 1 ] * b[ 2 ] - a[ 2 ] * b[ 1 ], a[ 2 ] * b[ 0 ] - a[ 0 ] * b[ 2 ], a[ 0 ] * b[ 1 ] - a[ 1 ] * b[ 0 ] ];

		}

		var subtract = function ( a, b ) {

			return [ a[ 0 ] - b[ 0 ], a[ 1 ] - b[ 1 ], a[ 2 ] - b[ 2 ] ];

		}

		var normalize = function ( a ) {

			var l = Math.sqrt( a[ 0 ] * a[ 0 ] + a[ 1 ] * a[ 1 ] + a[ 2 ] * a[ 2 ] );
			return [ a[ 0 ] / l, a[ 1 ] / l, a[ 2 ] / l ];

		}

		var depth = depth | 1;
		var width = image.width;
		var height = image.height;

		var canvas = document.createElement( 'canvas' );
		canvas.width = width;
		canvas.height = height;

		var context = canvas.getContext( '2d' );
		context.drawImage( image, 0, 0 );

		var data = context.getImageData( 0, 0, width, height ).data;
		var imageData = context.createImageData( width, height );
		var output = imageData.data;

		for ( var x = 0; x < width; x ++ ) {

			for ( var y = 1; y < height; y ++ ) {

				var ly = y - 1 < 0 ? height - 1 : y - 1;
				var uy = ( y + 1 ) % height;
				var lx = x - 1 < 0 ? width - 1 : x - 1;
				var ux = ( x + 1 ) % width;

				var points = [];
				var origin = [ 0, 0, data[ ( y * width + x ) * 4 ] / 255 * depth ];
				points.push( [ - 1, 0, data[ ( y * width + lx ) * 4 ] / 255 * depth ] );
				points.push( [ - 1, - 1, data[ ( ly * width + lx ) * 4 ] / 255 * depth ] );
				points.push( [ 0, - 1, data[ ( ly * width + x ) * 4 ] / 255 * depth ] );
				points.push( [  1, - 1, data[ ( ly * width + ux ) * 4 ] / 255 * depth ] );
				points.push( [ 1, 0, data[ ( y * width + ux ) * 4 ] / 255 * depth ] );
				points.push( [ 1, 1, data[ ( uy * width + ux ) * 4 ] / 255 * depth ] );
				points.push( [ 0, 1, data[ ( uy * width + x ) * 4 ] / 255 * depth ] );
				points.push( [ - 1, 1, data[ ( uy * width + lx ) * 4 ] / 255 * depth ] );

				var normals = [];
				var num_points = points.length;

				for ( var i = 0; i < num_points; i ++ ) {

					var v1 = points[ i ];
					var v2 = points[ ( i + 1 ) % num_points ];
					v1 = subtract( v1, origin );
					v2 = subtract( v2, origin );
					normals.push( normalize( cross( v1, v2 ) ) );

				}

				var normal = [ 0, 0, 0 ];

				for ( var i = 0; i < normals.length; i ++ ) {

					normal[ 0 ] += normals[ i ][ 0 ];
					normal[ 1 ] += normals[ i ][ 1 ];
					normal[ 2 ] += normals[ i ][ 2 ];

				}

				normal[ 0 ] /= normals.length;
				normal[ 1 ] /= normals.length;
				normal[ 2 ] /= normals.length;

				var idx = ( y * width + x ) * 4;

				output[ idx ] = ( ( normal[ 0 ] + 1.0 ) / 2.0 * 255 ) | 0;
				output[ idx + 1 ] = ( ( normal[ 1 ] + 1.0 / 2.0 ) * 255 ) | 0;
				output[ idx + 2 ] = ( normal[ 2 ] * 255 ) | 0;
				output[ idx + 3 ] = 255;

			}

		}

		context.putImageData( imageData, 0, 0 );

		return canvas;

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SceneUtils = {

	showHierarchy : function ( root, visible ) {

		THREE.SceneUtils.traverseHierarchy( root, function( node ) { node.visible = visible; } );

	},

	traverseHierarchy : function ( root, callback ) {

		var n, i, l = root.children.length;

		for ( i = 0; i < l; i ++ ) {

			n = root.children[ i ];

			callback( n );

			THREE.SceneUtils.traverseHierarchy( n, callback );

		}

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 *
 * ShaderUtils currently contains:
 *
 *	fresnel
 *	normal
 * 	cube
 *
 */

if ( THREE.WebGLRenderer ) {

THREE.ShaderUtils = {

	lib: {

		/* -------------------------------------------------------------------------
		//	Fresnel shader
		//	- based on Nvidia Cg tutorial
		 ------------------------------------------------------------------------- */

		'fresnel': {

			uniforms: {

				"mRefractionRatio": { type: "f", value: 1.02 },
				"mFresnelBias": { type: "f", value: 0.1 },
				"mFresnelPower": { type: "f", value: 2.0 },
				"mFresnelScale": { type: "f", value: 1.0 },
				"tCube": { type: "t", value: 1, texture: null }

			},

			fragmentShader: [

				"uniform samplerCube tCube;",

				"varying vec3 vReflect;",
				"varying vec3 vRefract[3];",
				"varying float vReflectionFactor;",

				"void main() {",

					"vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",
					"vec4 refractedColor = vec4( 1.0, 1.0, 1.0, 1.0 );",

					"refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;",
					"refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;",
					"refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;",
					"refractedColor.a = 1.0;",

					"gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );",

				"}"

			].join("\n"),

			vertexShader: [

				"uniform float mRefractionRatio;",
				"uniform float mFresnelBias;",
				"uniform float mFresnelScale;",
				"uniform float mFresnelPower;",

				"varying vec3 vReflect;",
				"varying vec3 vRefract[3];",
				"varying float vReflectionFactor;",

				"void main() {",

					"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
					"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",

					"vec3 nWorld = normalize ( mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal );",

					"vec3 I = mPosition.xyz - cameraPosition;",

					"vReflect = reflect( I, nWorld );",
					"vRefract[0] = refract( normalize( I ), nWorld, mRefractionRatio );",
					"vRefract[1] = refract( normalize( I ), nWorld, mRefractionRatio * 0.99 );",
					"vRefract[2] = refract( normalize( I ), nWorld, mRefractionRatio * 0.98 );",
					"vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), nWorld ), mFresnelPower );",

					"gl_Position = projectionMatrix * mvPosition;",

				"}"

			].join("\n")

		},

		/* -------------------------------------------------------------------------
		//	Normal map shader
		//		- Blinn-Phong
		//		- normal + diffuse + specular + AO + displacement + reflection + shadow maps
		//		- point and directional lights (use with "lights: true" material option)
		 ------------------------------------------------------------------------- */

		'normal' : {

			uniforms: THREE.UniformsUtils.merge( [

				THREE.UniformsLib[ "fog" ],
				THREE.UniformsLib[ "lights" ],
				THREE.UniformsLib[ "shadowmap" ],

				{

				"enableAO"		  : { type: "i", value: 0 },
				"enableDiffuse"	  : { type: "i", value: 0 },
				"enableSpecular"  : { type: "i", value: 0 },
				"enableReflection": { type: "i", value: 0 },

				"tDiffuse"	   : { type: "t", value: 0, texture: null },
				"tCube"		   : { type: "t", value: 1, texture: null },
				"tNormal"	   : { type: "t", value: 2, texture: null },
				"tSpecular"	   : { type: "t", value: 3, texture: null },
				"tAO"		   : { type: "t", value: 4, texture: null },
				"tDisplacement": { type: "t", value: 5, texture: null },

				"uNormalScale": { type: "f", value: 1.0 },

				"uDisplacementBias": { type: "f", value: 0.0 },
				"uDisplacementScale": { type: "f", value: 1.0 },

				"uDiffuseColor": { type: "c", value: new THREE.Color( 0xeeeeee ) },
				"uSpecularColor": { type: "c", value: new THREE.Color( 0x111111 ) },
				"uAmbientColor": { type: "c", value: new THREE.Color( 0x050505 ) },
				"uShininess": { type: "f", value: 30 },
				"uOpacity": { type: "f", value: 1 },

				"uReflectivity": { type: "f", value: 0.5 },

				"uOffset" : { type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"uRepeat" : { type: "v2", value: new THREE.Vector2( 1, 1 ) }

				}

			] ),

			fragmentShader: [

				"uniform vec3 uAmbientColor;",
				"uniform vec3 uDiffuseColor;",
				"uniform vec3 uSpecularColor;",
				"uniform float uShininess;",
				"uniform float uOpacity;",

				"uniform bool enableDiffuse;",
				"uniform bool enableSpecular;",
				"uniform bool enableAO;",
				"uniform bool enableReflection;",

				"uniform sampler2D tDiffuse;",
				"uniform sampler2D tNormal;",
				"uniform sampler2D tSpecular;",
				"uniform sampler2D tAO;",

				"uniform samplerCube tCube;",

				"uniform float uNormalScale;",
				"uniform float uReflectivity;",

				"varying vec3 vTangent;",
				"varying vec3 vBinormal;",
				"varying vec3 vNormal;",
				"varying vec2 vUv;",

				"uniform vec3 ambientLightColor;",

				"#if MAX_DIR_LIGHTS > 0",
					"uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
					"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",
				"#endif",

				"#if MAX_POINT_LIGHTS > 0",
					"uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];",
					"varying vec4 vPointLight[ MAX_POINT_LIGHTS ];",
				"#endif",

				"varying vec3 vViewPosition;",

				THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
				THREE.ShaderChunk[ "fog_pars_fragment" ],

				"void main() {",

					"gl_FragColor = vec4( vec3( 1.0 ), uOpacity );",

					"vec3 specularTex = vec3( 1.0 );",

					"vec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;",
					"normalTex.xy *= uNormalScale;",
					"normalTex = normalize( normalTex );",

					"if( enableDiffuse )",
						"gl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );",

					"if( enableAO )",
						"gl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;",

					"if( enableSpecular )",
						"specularTex = texture2D( tSpecular, vUv ).xyz;",

					"mat3 tsb = mat3( vTangent, vBinormal, vNormal );",
					"vec3 finalNormal = tsb * normalTex;",

					"vec3 normal = normalize( finalNormal );",
					"vec3 viewPosition = normalize( vViewPosition );",

					// point lights

					"#if MAX_POINT_LIGHTS > 0",

						"vec3 pointDiffuse = vec3( 0.0 );",
						"vec3 pointSpecular = vec3( 0.0 );",

						"for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {",

							"vec3 pointVector = normalize( vPointLight[ i ].xyz );",
							"vec3 pointHalfVector = normalize( vPointLight[ i ].xyz + viewPosition );",
							"float pointDistance = vPointLight[ i ].w;",

							"float pointDotNormalHalf = dot( normal, pointHalfVector );",
							"float pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );",

							"float pointSpecularWeight = 0.0;",
							"if ( pointDotNormalHalf >= 0.0 )",
								"pointSpecularWeight = specularTex.r * pow( pointDotNormalHalf, uShininess );",

							"pointDiffuse += pointDistance * pointLightColor[ i ] * uDiffuseColor * pointDiffuseWeight;",
							"pointSpecular += pointDistance * pointLightColor[ i ] * uSpecularColor * pointSpecularWeight;",

						"}",

					"#endif",

					// directional lights

					"#if MAX_DIR_LIGHTS > 0",

						"vec3 dirDiffuse = vec3( 0.0 );",
						"vec3 dirSpecular = vec3( 0.0 );",

						"for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {",

							"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );",

							"vec3 dirVector = normalize( lDirection.xyz );",
							"vec3 dirHalfVector = normalize( lDirection.xyz + viewPosition );",

							"float dirDotNormalHalf = dot( normal, dirHalfVector );",
							"float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",

							"float dirSpecularWeight = 0.0;",
							"if ( dirDotNormalHalf >= 0.0 )",
								"dirSpecularWeight = specularTex.r * pow( dirDotNormalHalf, uShininess );",

							"dirDiffuse += directionalLightColor[ i ] * uDiffuseColor * dirDiffuseWeight;",
							"dirSpecular += directionalLightColor[ i ] * uSpecularColor * dirSpecularWeight;",

						"}",

					"#endif",

					// all lights contribution summation

					"vec3 totalDiffuse = vec3( 0.0 );",
					"vec3 totalSpecular = vec3( 0.0 );",

					"#if MAX_DIR_LIGHTS > 0",

						"totalDiffuse += dirDiffuse;",
						"totalSpecular += dirSpecular;",

					"#endif",

					"#if MAX_POINT_LIGHTS > 0",

						"totalDiffuse += pointDiffuse;",
						"totalSpecular += pointSpecular;",

					"#endif",

					"gl_FragColor.xyz = gl_FragColor.xyz * totalDiffuse + totalSpecular + ambientLightColor * uAmbientColor;",

					"if ( enableReflection ) {",

						"vec3 wPos = cameraPosition - vViewPosition;",
						"vec3 vReflect = reflect( normalize( wPos ), normal );",
						"vec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",
						"gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, uReflectivity );",

					"}",

					THREE.ShaderChunk[ "shadowmap_fragment" ],
					THREE.ShaderChunk[ "fog_fragment" ],

				"}"

			].join("\n"),

			vertexShader: [

				"attribute vec4 tangent;",

				"uniform vec2 uOffset;",
				"uniform vec2 uRepeat;",

				"#ifdef VERTEX_TEXTURES",

					"uniform sampler2D tDisplacement;",
					"uniform float uDisplacementScale;",
					"uniform float uDisplacementBias;",

				"#endif",

				"varying vec3 vTangent;",
				"varying vec3 vBinormal;",
				"varying vec3 vNormal;",
				"varying vec2 vUv;",

				"#if MAX_POINT_LIGHTS > 0",

					"uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];",
					"uniform float pointLightDistance[ MAX_POINT_LIGHTS ];",

					"varying vec4 vPointLight[ MAX_POINT_LIGHTS ];",

				"#endif",

				"varying vec3 vViewPosition;",

				THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

				"void main() {",

					"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

					"vViewPosition = -mvPosition.xyz;",

					"vNormal = normalize( normalMatrix * normal );",

					// tangent and binormal vectors

					"vTangent = normalize( normalMatrix * tangent.xyz );",

					"vBinormal = cross( vNormal, vTangent ) * tangent.w;",
					"vBinormal = normalize( vBinormal );",

					"vUv = uv * uRepeat + uOffset;",

					// point lights

					"#if MAX_POINT_LIGHTS > 0",

						"for( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {",

							"vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );",

							"vec3 lVector = lPosition.xyz - mvPosition.xyz;",

							"float lDistance = 1.0;",

							"if ( pointLightDistance[ i ] > 0.0 )",
								"lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );",

							"lVector = normalize( lVector );",

							"vPointLight[ i ] = vec4( lVector, lDistance );",

						"}",

					"#endif",

					// displacement mapping

					"#ifdef VERTEX_TEXTURES",

						"vec3 dv = texture2D( tDisplacement, uv ).xyz;",
						"float df = uDisplacementScale * dv.x + uDisplacementBias;",
						"vec4 displacedPosition = vec4( vNormal.xyz * df, 0.0 ) + mvPosition;",
						"gl_Position = projectionMatrix * displacedPosition;",

					"#else",

						"gl_Position = projectionMatrix * mvPosition;",

					"#endif",

					THREE.ShaderChunk[ "shadowmap_vertex" ],

				"}"

			].join("\n")

		},

		/* -------------------------------------------------------------------------
		//	Cube map shader
		 ------------------------------------------------------------------------- */

		'cube': {

			uniforms: { "tCube": { type: "t", value: 1, texture: null } },

			vertexShader: [

				"varying vec3 vViewPosition;",

				"void main() {",

					"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",
					"vViewPosition = cameraPosition - mPosition.xyz;",

					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"uniform samplerCube tCube;",

				"varying vec3 vViewPosition;",

				"void main() {",

					"vec3 wPos = cameraPosition - vViewPosition;",
					"gl_FragColor = textureCube( tCube, vec3( - wPos.x, wPos.yz ) );",

				"}"

			].join("\n")

		}

	}

};

};/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Extensible curve object
 *
 * This file contains following classes:
 *
 * -- 2d classes --
 * THREE.Curve
 * THREE.LineCurve
 * THREE.QuadraticBezierCurve
 * THREE.CubicBezierCurve
 * THREE.SplineCurve
 * THREE.ArcCurve
 * 
 * -- 3d classes --
 * THREE.LineCurve3
 * THREE.QuadraticBezierCurve3
 * THREE.CubicBezierCurve3
 * THREE.SplineCurve3
 *
 **/

/**************************************************************
 *	Abstract Curve base class
 **************************************************************/

THREE.Curve = function () {

};

// Virtual base class method to overwrite and implement in subclasses
//	- t [0 .. 1]

THREE.Curve.prototype.getPoint = function ( t ) {

	console.log( "Warning, getPoint() not implemented!" );
	return null;

};

// Get point at relative position in curve according to arc length
// - u [0 .. 1]

THREE.Curve.prototype.getPointAt = function ( u ) {

	var t = this.getUtoTmapping( u );
	return this.getPoint( t );

};

// Get sequence of points using getPoint( t )

THREE.Curve.prototype.getPoints = function ( divisions ) {

	if ( !divisions ) divisions = 5;

	var d, pts = [];

	for ( d = 0; d <= divisions; d ++ ) {

		pts.push( this.getPoint( d / divisions ) );

	};

	return pts;

};

// Get sequence of points using getPointAt( u )

THREE.Curve.prototype.getSpacedPoints = function ( divisions ) {

	if ( !divisions ) divisions = 5;

	var d, pts = [];

	for ( d = 0; d <= divisions; d ++ ) {

		pts.push( this.getPointAt( d / divisions ) );

	};

	return pts;

};

// Get total curve length

THREE.Curve.prototype.getLength = function () {

	var lengths = this.getLengths();
	return lengths[ lengths.length - 1 ];

};

// Get list of cumulative segment lengths

THREE.Curve.prototype.getLengths = function ( divisions ) {

	if ( !divisions ) divisions = 200;

	if ( this.cacheArcLengths && ( this.cacheArcLengths.length == divisions + 1 ) ) {

		//console.log( "cached", this.cacheArcLengths );
		return this.cacheArcLengths;

	}

	var cache = [];
	var current, last = this.getPoint( 0 );
	var p, sum = 0;

	cache.push( 0 );

	for ( p = 1; p <= divisions; p ++ ) {

		current = this.getPoint ( p / divisions );
		sum += current.distanceTo( last );
		cache.push( sum );
		last = current;

	}

	this.cacheArcLengths = cache;

	return cache; // { sums: cache, sum:sum }; Sum is in the last element.

};

// Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equi distance

THREE.Curve.prototype.getUtoTmapping = function ( u, distance ) {

	var arcLengths = this.getLengths();

	var i = 0, il = arcLengths.length;

	var targetArcLength; // The targeted u distance value to get

	if ( distance ) {

		targetArcLength = distance;

	} else {

		targetArcLength = u * arcLengths[ il - 1 ];

	}

	// // TODO Should do binary search + sub division + interpolation when needed
	// time = Date.now();
	// while ( i < il ) {
	//
	// 	i++;
	//
	// 	if ( targetArcLength < arcLengths[ i ] ) break;
	//
	// }
	//
	// i--;
	// console.log('o' , i, Date.now()- time);

	time = Date.now();

	// binary search for the index with largest value smaller than target u distance

	var low = 0, high = il - 1, comparison;

	while ( low <= high ) {

		i = Math.floor( low + ( high - low ) / 2 ); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

	  	comparison = arcLengths[ i ] - targetArcLength;

	  	if ( comparison < 0 ) {

			low = i + 1;
			continue;

		} else if ( comparison > 0 ) {

			high = i - 1;
			continue;

		} else {

			high = i;
			break;

			// DONE

		}

	}

	i = high;

	//console.log('b' , i, low, high, Date.now()- time);

	if ( arcLengths[ i ] == targetArcLength ) {

		var t = i / ( il - 1 );
		return t;

	}

	// we could get finer grain at lengths, or use simple interpolatation between two points

	var lengthBefore = arcLengths[ i ];
    var lengthAfter = arcLengths[ i + 1 ];

    var segmentLength = lengthAfter - lengthBefore;

    // determine where we are between the 'before' and 'after' points

    var segmentFraction = ( targetArcLength - lengthBefore ) / segmentLength;

    // add that fractional amount to t

    t = ( i + segmentFraction ) / ( il -1 );

	return t;

};

// In case any sub curve does not implement its tangent / normal finding,
// we get 2 points with a small delta and find a gradient of the 2 points
// which seems to make a reasonable approximation

THREE.Curve.prototype.getNormalVector = function( t ) {

	var vec = this.getTangent( t );

	return new THREE.Vector2( -vec.y , vec.x );

};

// Returns a unit vector tangent at t

THREE.Curve.prototype.getTangent = function( t ) {

	var delta = 0.0001;
	var t1 = t - delta;
	var t2 = t + delta;

	// Capping in case of danger

	if ( t1 < 0 ) t1 = 0;
	if ( t2 > 1 ) t2 = 1;

	var pt1 = this.getPoint( t1 );
	var pt2 = this.getPoint( t2 );

	var vec = new THREE.Vector2();
	vec.sub( pt2, pt1 );
	return vec.unit();

};


/**************************************************************
 *	Line
 **************************************************************/

THREE.LineCurve = function ( v1, v2 ) {

	if ( ! ( v1 instanceof THREE.Vector2 ) ) {

		// Fall back for old constuctor signature - should be removed over time

		THREE.LineCurve.oldConstructor.apply( this, arguments );
		return;

	}

	this.v1 = v1;
	this.v2 = v2;

};

THREE.LineCurve.oldConstructor = function ( x1, y1, x2, y2 ) {

	this.constructor( new THREE.Vector2( x1, y1 ), new THREE.Vector2( x2, y2 ) );

};

THREE.LineCurve.prototype = new THREE.Curve();
THREE.LineCurve.prototype.constructor = THREE.LineCurve;

THREE.LineCurve.prototype.getPoint = function ( t ) {

	var point = new THREE.Vector2();

	point.sub( this.v2, this.v1 );
	point.multiplyScalar( t ).addSelf( this.v1 );

	return point;

	// 	var dx = this.x2 - this.x1;
	// 	var dy = this.y2 - this.y1;
	//
	// 	var tx = this.x1 + dx * t;
	// 	var ty = this.y1 + dy * t;
	//
	// 	return new THREE.Vector2( tx, ty );

};

// Line curve is linear, so we can overwrite default getPointAt

THREE.LineCurve.prototype.getPointAt = function ( u ) {

	return this.getPoint( u );

};

THREE.LineCurve.prototype.getTangent = function( t ) {

	var tangent = new THREE.Vector2();

	tangent.sub( this.v2, this.v1 );
	tangent.normalize();

	return tangent;

};

/**************************************************************
 *	Quadratic Bezier curve
 **************************************************************/


THREE.QuadraticBezierCurve = function ( v0, v1, v2 ) {

	if ( !( v1 instanceof THREE.Vector2 ) ) {

		var args = Array.prototype.slice.call( arguments );

		v0 = new THREE.Vector2( args[ 0 ], args[ 1 ] );
		v1 = new THREE.Vector2( args[ 2 ], args[ 3 ] );
		v2 = new THREE.Vector2( args[ 4 ], args[ 5 ] );

	}

	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;

};

THREE.QuadraticBezierCurve.prototype = new THREE.Curve();
THREE.QuadraticBezierCurve.prototype.constructor = THREE.QuadraticBezierCurve;


THREE.QuadraticBezierCurve.prototype.getPoint = function ( t ) {

	var tx, ty;

	tx = THREE.Shape.Utils.b2( t, this.v0.x, this.v1.x, this.v2.x );
	ty = THREE.Shape.Utils.b2( t, this.v0.y, this.v1.y, this.v2.y );

	return new THREE.Vector2( tx, ty );

};


THREE.QuadraticBezierCurve.prototype.getTangent = function( t ) {

	// iterate sub segments
	// 	get lengths for sub segments
	// 	if segment is bezier
	//		perform subdivisions

	// var x0, y0, x1, y1, x2, y2;

	// x0 = this.actions[ 0 ].args[ 0 ];
	// y0 = this.actions[ 0 ].args[ 1 ];
	//
	// x1 = this.actions[ 1 ].args[ 0 ];
	// y1 = this.actions[ 1 ].args[ 1 ];
	//
	// x2 = this.actions[ 1 ].args[ 2 ];
	// y2 = this.actions[ 1 ].args[ 3 ];

	var tx, ty;

	tx = THREE.Curve.Utils.tangentQuadraticBezier( t, this.v0.x, this.v1.x, this.v2.x );
	ty = THREE.Curve.Utils.tangentQuadraticBezier( t, this.v0.y, this.v1.y, this.v2.y );

	// returns unit vector

	var tangent = new THREE.Vector2( tx, ty );
	tangent.normalize();

	return tangent;

};


/**************************************************************
 *	Cubic Bezier curve
 **************************************************************/

THREE.CubicBezierCurve = function ( v0, v1, v2, v3 ) {

	if ( ! ( v1 instanceof THREE.Vector2 ) ) {

		var args = Array.prototype.slice.call( arguments );

		v0 = new THREE.Vector2( args[ 0 ], args[ 1 ] );
		v1 = new THREE.Vector2( args[ 2 ], args[ 3 ] );
		v2 = new THREE.Vector2( args[ 4 ], args[ 5 ] );
		v3 = new THREE.Vector2( args[ 6 ], args[ 7 ] );

	}

	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3;

};

THREE.CubicBezierCurve.prototype = new THREE.Curve();
THREE.CubicBezierCurve.prototype.constructor = THREE.CubicBezierCurve;

THREE.CubicBezierCurve.prototype.getPoint = function ( t ) {

	var tx, ty;

	tx = THREE.Shape.Utils.b3( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x );
	ty = THREE.Shape.Utils.b3( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y );

	return new THREE.Vector2( tx, ty );

};

THREE.CubicBezierCurve.prototype.getTangent = function( t ) {

	var tx, ty;

	tx = THREE.Curve.Utils.tangentCubicBezier( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x );
	ty = THREE.Curve.Utils.tangentCubicBezier( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y );

	// return normal unit vector

	var tangent = new THREE.Vector2( tx, ty );
	tangent.normalize();

	return tangent;

};


/**************************************************************
 *	Spline curve
 **************************************************************/

THREE.SplineCurve = function ( points /* array of Vector2 */ ) {

	this.points = points;

};

THREE.SplineCurve.prototype = new THREE.Curve();
THREE.SplineCurve.prototype.constructor = THREE.SplineCurve;

THREE.SplineCurve.prototype.getPoint = function ( t ) {

	var v = new THREE.Vector2();
	var c = [];
	var points = this.points, point, intPoint, weight;
	point = ( points.length - 1 ) * t;

	intPoint = Math.floor( point );
	weight = point - intPoint;

	c[ 0 ] = intPoint == 0 ? intPoint : intPoint - 1;
	c[ 1 ] = intPoint;
	c[ 2 ] = intPoint > points.length - 2 ? intPoint : intPoint + 1;
	c[ 3 ] = intPoint > points.length - 3 ? intPoint : intPoint + 2;

	v.x = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].x, points[ c[ 1 ] ].x, points[ c[ 2 ] ].x, points[ c[ 3 ] ].x, weight );
	v.y = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].y, points[ c[ 1 ] ].y, points[ c[ 2 ] ].y, points[ c[ 3 ] ].y, weight );

	return v;

};

/**************************************************************
 *	Arc curve
 **************************************************************/

THREE.ArcCurve = function ( aX, aY, aRadius,
							aStartAngle, aEndAngle,
							aClockwise ) {

	this.aX = aX;
	this.aY = aY;

	this.aRadius = aRadius;

	this.aStartAngle = aStartAngle;
	this.aEndAngle = aEndAngle;

	this.aClockwise = aClockwise;

};

THREE.ArcCurve.prototype = new THREE.Curve();
THREE.ArcCurve.prototype.constructor = THREE.ArcCurve;

THREE.ArcCurve.prototype.getPoint = function ( t ) {

	var deltaAngle = this.aEndAngle - this.aStartAngle;

	if ( !this.aClockwise ) {

		t = 1 - t;

	}

	var angle = this.aStartAngle + t * deltaAngle;

	var tx = this.aX + this.aRadius * Math.cos( angle );
	var ty = this.aY + this.aRadius * Math.sin( angle );

	return new THREE.Vector2( tx, ty );

};

/**************************************************************
 *	Utils
 **************************************************************/

THREE.Curve.Utils = {

	tangentQuadraticBezier: function ( t, p0, p1, p2 ) {

		return 2 * ( 1 - t ) * ( p1 - p0 ) + 2 * t * ( p2 - p1 );

	},

	// Puay Bing, thanks for helping with this derivative!

	tangentCubicBezier: function (t, p0, p1, p2, p3 ) {

		return -3 * p0 * (1 - t) * (1 - t)  +
			3 * p1 * (1 - t) * (1-t) - 6 *t *p1 * (1-t) +
			6 * t *  p2 * (1-t) - 3 * t * t * p2 +
			3 * t * t * p3;
	},


	tangentSpline: function ( t, p0, p1, p2, p3 ) {

		// To check if my formulas are correct

		var h00 = 6 * t * t - 6 * t; 	// derived from 2t^3 − 3t^2 + 1
		var h10 = 3 * t * t - 4 * t + 1; // t^3 − 2t^2 + t
		var h01 = -6 * t * t + 6 * t; 	// − 2t3 + 3t2
		var h11 = 3 * t * t - 2 * t;	// t3 − t2

		return h00 + h10 + h01 + h11;

	},

	// Catmull-Rom

	interpolate: function( p0, p1, p2, p3, t ) {

		var v0 = ( p2 - p0 ) * 0.5;
		var v1 = ( p3 - p1 ) * 0.5;
		var t2 = t * t;
		var t3 = t * t2;
		return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

	}

};


/*
getPoint DONE
getLength DONE
getLengths DONE

curve.getPoints(); DONE
curve.getPointAtArcLength(t); DONE
curve.transform(params);
curve.getTangentAt(t); DONE
*/

/**************************************************************
 *	3D Curves
 **************************************************************/

// A Factory method for creating new curve subclasses

THREE.Curve.create = function( constructor, getPointFunc ) {

    var subClass = constructor;

	subClass.prototype = new THREE.Curve();

	subClass.prototype.constructor = constructor;
    subClass.prototype.getPoint = getPointFunc;

	return subClass;

};


/**************************************************************
 *	Line3D
 **************************************************************/

THREE.LineCurve3 = THREE.Curve.create(

	function ( v1, v2 ) {

		this.v1 = v1;
		this.v2 = v2;

	},

	function ( t ) {

		var r = new THREE.Vector3();


		r.sub( v2, v1 ); // diff
		r.multiplyScalar( t );
		r.addSelf( this.v1 );

		return r;

	}

);


/**************************************************************
 *	Quadratic Bezier 3D curve
 **************************************************************/

THREE.QuadraticBezierCurve3 = THREE.Curve.create(

	function ( v0, v1, v2 ) {

		this.v0 = v0;
		this.v1 = v1;
		this.v2 = v2;

	},

	function ( t ) {

		var tx, ty, tz;

		tx = THREE.Shape.Utils.b2( t, this.v0.x, this.v1.x, this.v2.x );
		ty = THREE.Shape.Utils.b2( t, this.v0.y, this.v1.y, this.v2.y );
		tz = THREE.Shape.Utils.b2( t, this.v0.z, this.v1.z, this.v2.z );

		return new THREE.Vector3( tx, ty, tz );

	}

);



/**************************************************************
 *	Cubic Bezier 3D curve
 **************************************************************/

THREE.CubicBezierCurve3 = THREE.Curve.create(

	function ( v0, v1, v2, v3 ) {

		this.v0 = v0;
		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;

	},

	function ( t ) {

		var tx, ty, tz;

		tx = THREE.Shape.Utils.b3( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x );
		ty = THREE.Shape.Utils.b3( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y );
		tz = THREE.Shape.Utils.b3( t, this.v0.z, this.v1.z, this.v2.z, this.v3.z );

		return new THREE.Vector3( tx, ty, tz );

	}

);



/**************************************************************
 *	Spline 3D curve
 **************************************************************/


THREE.SplineCurve3 = THREE.Curve.create(

	function ( points /* array of Vector3 */) {

		this.points = points;
		
	},

	function ( t ) {

		var v = new THREE.Vector3();
		var c = [];
		var points = this.points, point, intPoint, weight;
		point = ( points.length - 1 ) * t;

		intPoint = Math.floor( point );
		weight = point - intPoint;

		c[ 0 ] = intPoint == 0 ? intPoint : intPoint - 1;
		c[ 1 ] = intPoint;
		c[ 2 ] = intPoint > points.length - 2 ? intPoint : intPoint + 1;
		c[ 3 ] = intPoint > points.length - 3 ? intPoint : intPoint + 2;

		v.x = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].x, points[ c[ 1 ] ].x, points[ c[ 2 ] ].x, points[ c[ 3 ] ].x, weight );
		v.y = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].y, points[ c[ 1 ] ].y, points[ c[ 2 ] ].y, points[ c[ 3 ] ].y, weight );
		v.z = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].z, points[ c[ 1 ] ].z, points[ c[ 2 ] ].z, points[ c[ 3 ] ].z, weight );

		return v;

	}

);
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 **/

/**************************************************************
 *	Curved Path - a curve path is simply a array of connected
 *  curves, but retains the api of a curve
 **************************************************************/

THREE.CurvePath = function () {

	this.curves = [];
	this.bends = [];

};

THREE.CurvePath.prototype = new THREE.Curve();
THREE.CurvePath.prototype.constructor = THREE.CurvePath;

THREE.CurvePath.prototype.add = function ( curve ) {

	this.curves.push( curve );

};

THREE.CurvePath.prototype.checkConnection = function() {

};

// Add a line curve  if start and end of lines are not connected

THREE.CurvePath.prototype.closePath = function() {

};

// To get accurate point with reference to
// entire path distance at time t,
// following has to be done:

// 1. Length of each sub path have to be known
// 2. Locate and identify type of curve
// 3. Get t for the curve
// 4. Return curve.getPointAt(t')

THREE.CurvePath.prototype.getPoint = function( t ) {

	var d = t * this.getLength();
	var curveLengths = this.getCurveLengths();
	var i = 0, diff, curve;

	// To think about boundaries points.

	while ( i < curveLengths.length ) {

		if ( curveLengths[ i ] >= d ) {

			diff = curveLengths[ i ] - d;
			curve = this.curves[ i ];

			var u = 1 - diff / curve.getLength();

			return curve.getPointAt( u );

			break;
		}

		i ++;

	}

	return null;

	// loop where sum != 0, sum > d , sum+1 <d

};

/*
THREE.CurvePath.prototype.getTangent = function( t ) {
};*/


// We cannot use the default THREE.Curve getPoint() with getLength() because in
// THREE.Curve, getLength() depends on getPoint() but in THREE.CurvePath
// getPoint() depends on getLength

THREE.CurvePath.prototype.getLength = function() {

	var lens = this.getCurveLengths();
	return lens[ lens.length - 1 ];

};

// Compute lengths and cache them
// We cannot overwrite getLengths() because UtoT mapping uses it.

THREE.CurvePath.prototype.getCurveLengths = function() {

	// We use cache values if curves and cache array are same length

	if ( this.cacheLengths && this.cacheLengths.length == this.curves.length ) {

		return this.cacheLengths;

	};

	// Get length of subsurve
	// Push sums into cached array

	var lengths = [], sums = 0;
	var i, il = this.curves.length;

	for ( i = 0; i < il; i ++ ) {

		sums += this.curves[ i ].getLength();
		lengths.push( sums );

	}

	this.cacheLengths = lengths;

	return lengths;

};



// Returns min and max coordinates, as well as centroid

THREE.CurvePath.prototype.getBoundingBox = function () {

	var points = this.getPoints();

	var maxX, maxY;
	var minX, minY;

	maxX = maxY = Number.NEGATIVE_INFINITY;
	minX = minY = Number.POSITIVE_INFINITY;

	var p, i, il, sum;

	sum = new THREE.Vector2();

	for ( i = 0, il = points.length; i < il; i ++ ) {

		p = points[ i ];

		if ( p.x > maxX ) maxX = p.x;
		else if ( p.x < minX ) minX = p.x;

		if ( p.y > maxY ) maxY = p.y;
		else if ( p.y < maxY ) minY = p.y;

		sum.addSelf( p.x, p.y );

	}

	return {

		minX: minX,
		minY: minY,
		maxX: maxX,
		maxY: maxY,
		centroid: sum.divideScalar( il )

	};

};

/**************************************************************
 *	Create Geometries Helpers
 **************************************************************/

/// Generate geometry from path points (for Line or ParticleSystem objects)

THREE.CurvePath.prototype.createPointsGeometry = function( divisions ) {

    var pts = this.getPoints( divisions, true );
	return this.createGeometry( pts );

};

// Generate geometry from equidistance sampling along the path

THREE.CurvePath.prototype.createSpacedPointsGeometry = function( divisions ) {

    var pts = this.getSpacedPoints( divisions, true );
	return this.createGeometry( pts );

};

THREE.CurvePath.prototype.createGeometry = function( points ) {

	var geometry = new THREE.Geometry();

    for( var i = 0; i < points.length; i ++ ) {

        geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( points[ i ].x, points[ i ].y, 0 ) ) );

    }

    return geometry;

};


/**************************************************************
 *	Bend / Wrap Helper Methods
 **************************************************************/

// Wrap path / Bend modifiers?

THREE.CurvePath.prototype.addWrapPath = function ( bendpath ) {

	this.bends.push( bendpath );

};

THREE.CurvePath.prototype.getTransformedPoints = function( segments, bends ) {

	var oldPts = this.getPoints( segments ); // getPoints getSpacedPoints
	var i, il;

	if ( !bends ) {

		bends = this.bends;

	}

	for ( i = 0, il = bends.length; i < il; i ++ ) {

		oldPts = this.getWrapPoints( oldPts, bends[ i ] );

	}

	return oldPts;

};

THREE.CurvePath.prototype.getTransformedSpacedPoints = function( segments, bends ) {

	var oldPts = this.getSpacedPoints( segments );

	var i, il;

	if ( !bends ) {

		bends = this.bends;

	}

	for ( i = 0, il = bends.length; i < il; i ++ ) {

		oldPts = this.getWrapPoints( oldPts, bends[ i ] );

	}

	return oldPts;

};

// This returns getPoints() bend/wrapped around the contour of a path.
// Read http://www.planetclegg.com/projects/WarpingTextToSplines.html

THREE.CurvePath.prototype.getWrapPoints = function ( oldPts, path ) {

	var bounds = this.getBoundingBox();

	var i, il, p, oldX, oldY, xNorm;

	for ( i = 0, il = oldPts.length; i < il; i ++ ) {

		p = oldPts[ i ];

		oldX = p.x;
		oldY = p.y;

		var xNorm = oldX/ bounds.maxX;

		// If using actual distance, for length > path, requires line extrusions
		//xNorm = path.getUtoTmapping(xNorm, oldX); // 3 styles. 1) wrap stretched. 2) wrap stretch by arc length 3) warp by actual distance

		xNorm = path.getUtoTmapping( xNorm, oldX );

		// check for out of bounds?

		var pathPt = path.getPoint( xNorm );
		var normal = path.getNormalVector( xNorm ).multiplyScalar( oldY );

		p.x = pathPt.x + normal.x;
		p.y = pathPt.y + normal.y;

	}

	return oldPts;

};

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Creates free form 2d path using series of points, lines or curves.
 *
 **/

THREE.Path = function ( points ) {

	THREE.CurvePath.call(this);

	this.actions = [];

	if ( points ) {

		this.fromPoints( points );

	}

};

THREE.Path.prototype = new THREE.CurvePath();
THREE.Path.prototype.constructor = THREE.Path;


THREE.PathActions = {

	MOVE_TO: 'moveTo',
	LINE_TO: 'lineTo',
	QUADRATIC_CURVE_TO: 'quadraticCurveTo', // Bezier quadratic curve
	BEZIER_CURVE_TO: 'bezierCurveTo', 		// Bezier cubic curve
	CSPLINE_THRU: 'splineThru',				// Catmull-rom spline
	ARC: 'arc'								// Circle

};

// TODO Clean up PATH API

// Create path using straight lines to connect all points
// - vectors: array of Vector2

THREE.Path.prototype.fromPoints = function ( vectors ) {

	this.moveTo( vectors[ 0 ].x, vectors[ 0 ].y );

	var v, vlen = vectors.length;

	for ( v = 1; v < vlen; v++ ) {

		this.lineTo( vectors[ v ].x, vectors[ v ].y );

	};

};

// startPath() endPath()?

THREE.Path.prototype.moveTo = function ( x, y ) {

	var args = Array.prototype.slice.call( arguments );
	this.actions.push( { action: THREE.PathActions.MOVE_TO, args: args } );

};

THREE.Path.prototype.lineTo = function ( x, y ) {

	var args = Array.prototype.slice.call( arguments );

	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];

	var curve = new THREE.LineCurve( new THREE.Vector2( x0, y0 ), new THREE.Vector2( x, y ) );
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.LINE_TO, args: args } );

};

THREE.Path.prototype.quadraticCurveTo = function( aCPx, aCPy, aX, aY ) {

	var args = Array.prototype.slice.call( arguments );

	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];

	var curve = new THREE.QuadraticBezierCurve( new THREE.Vector2( x0, y0 ),
												new THREE.Vector2( aCPx, aCPy ),
												new THREE.Vector2( aX, aY ) );
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.QUADRATIC_CURVE_TO, args: args } );

};

THREE.Path.prototype.bezierCurveTo = function( aCP1x, aCP1y,
                                               aCP2x, aCP2y,
                                               aX, aY ) {

	var args = Array.prototype.slice.call( arguments );

	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];

	var curve = new THREE.CubicBezierCurve( new THREE.Vector2( x0, y0 ),
											new THREE.Vector2( aCP1x, aCP1y ),
											new THREE.Vector2( aCP2x, aCP2y ),
											new THREE.Vector2( aX, aY ) );
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.BEZIER_CURVE_TO, args: args } );

};

THREE.Path.prototype.splineThru = function( pts /*Array of Vector*/ ) {

	var args = Array.prototype.slice.call( arguments );
	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];
//---
	var npts = [ new THREE.Vector2( x0, y0 ) ];
	Array.prototype.push.apply( npts, pts );

	var curve = new THREE.SplineCurve( npts );
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.CSPLINE_THRU, args: args } );

};

// FUTURE: Change the API or follow canvas API?
// TODO ARC ( x, y, x - radius, y - radius, startAngle, endAngle )

THREE.Path.prototype.arc = function ( aX, aY, aRadius,
									  aStartAngle, aEndAngle, aClockwise ) {

	var args = Array.prototype.slice.call( arguments );

	var curve = new THREE.ArcCurve( aX, aY, aRadius,
									aStartAngle, aEndAngle, aClockwise );
	this.curves.push( curve );

	// console.log( 'arc', args );

	this.actions.push( { action: THREE.PathActions.ARC, args: args } );

 };


THREE.Path.prototype.getSpacedPoints = function ( divisions, closedPath ) {

	if ( !divisions ) divisions = 40;

	var points = [];

	for ( var i = 0; i < divisions; i ++ ) {

		points.push( this.getPoint( i / divisions ) );

		//if( !this.getPoint( i / divisions ) ) throw "DIE";

	}

	// if ( closedPath ) {
	//
	// 	points.push( points[ 0 ] );
	//
	// }

	return points;

};

/* Return an array of vectors based on contour of the path */

THREE.Path.prototype.getPoints = function( divisions, closedPath ) {

	divisions = divisions || 12;

	var points = [];

	var i, il, item, action, args;
	var cpx, cpy, cpx2, cpy2, cpx1, cpy1, cpx0, cpy0,
		laste, j,
		t, tx, ty;

	for ( i = 0, il = this.actions.length; i < il; i ++ ) {

		item = this.actions[ i ];

		action = item.action;
		args = item.args;

		switch( action ) {

		case THREE.PathActions.MOVE_TO:

			// points.push( new THREE.Vector2( args[ 0 ], args[ 1 ] ) );

			break;

		case THREE.PathActions.LINE_TO:

			points.push( new THREE.Vector2( args[ 0 ], args[ 1 ] ) );

			break;

		case THREE.PathActions.QUADRATIC_CURVE_TO:

			cpx  = args[ 2 ];
			cpy  = args[ 3 ];

			cpx1 = args[ 0 ];
			cpy1 = args[ 1 ];

			if ( points.length > 0 ) {

				laste = points[ points.length - 1 ];

				cpx0 = laste.x;
				cpy0 = laste.y;

			} else {

				laste = this.actions[ i - 1 ].args;

				cpx0 = laste[ laste.length - 2 ];
				cpy0 = laste[ laste.length - 1 ];

			}

			for ( j = 1; j <= divisions; j ++ ) {

				t = j / divisions;

				tx = THREE.Shape.Utils.b2( t, cpx0, cpx1, cpx );
				ty = THREE.Shape.Utils.b2( t, cpy0, cpy1, cpy );

				points.push( new THREE.Vector2( tx, ty ) );

		  	}

			break;

		case THREE.PathActions.BEZIER_CURVE_TO:

			cpx  = args[ 4 ];
			cpy  = args[ 5 ];

			cpx1 = args[ 0 ];
			cpy1 = args[ 1 ];

			cpx2 = args[ 2 ];
			cpy2 = args[ 3 ];

			if ( points.length > 0 ) {

				laste = points[ points.length - 1 ];

				cpx0 = laste.x;
				cpy0 = laste.y;

			} else {

				laste = this.actions[ i - 1 ].args;

				cpx0 = laste[ laste.length - 2 ];
				cpy0 = laste[ laste.length - 1 ];

			}


			for ( j = 1; j <= divisions; j ++ ) {

				t = j / divisions;

				tx = THREE.Shape.Utils.b3( t, cpx0, cpx1, cpx2, cpx );
				ty = THREE.Shape.Utils.b3( t, cpy0, cpy1, cpy2, cpy );

				points.push( new THREE.Vector2( tx, ty ) );

			}

			break;

		case THREE.PathActions.CSPLINE_THRU:

			laste = this.actions[ i - 1 ].args;

			var last = new THREE.Vector2( laste[ laste.length - 2 ], laste[ laste.length - 1 ] );
			var spts = [ last ];

			var n = divisions * args[ 0 ].length;

			spts = spts.concat( args[ 0 ] );

			var spline = new THREE.SplineCurve( spts );

			for ( j = 1; j <= n; j ++ ) {

				points.push( spline.getPointAt( j / n ) ) ;

			}

			break;

		case THREE.PathActions.ARC:

			laste = this.actions[ i - 1 ].args;

			var aX = args[ 0 ], aY = args[ 1 ],
				aRadius = args[ 2 ],
				aStartAngle = args[ 3 ], aEndAngle = args[ 4 ],
				aClockwise = !!args[ 5 ];

			var lastx = laste[ laste.length - 2 ],
				lasty = laste[ laste.length - 1 ];

			if ( laste.length == 0 ) {

				lastx = lasty = 0;

			}


			var deltaAngle = aEndAngle - aStartAngle;
			var angle;
			var tdivisions = divisions * 2;
			var t;

			for ( j = 1; j <= tdivisions; j ++ ) {

				t = j / tdivisions;

				if ( !aClockwise ) {

					t = 1 - t;

				}

				angle = aStartAngle + t * deltaAngle;

				tx = lastx + aX + aRadius * Math.cos( angle );
				ty = lasty + aY + aRadius * Math.sin( angle );

				//console.log('t', t, 'angle', angle, 'tx', tx, 'ty', ty);

				points.push( new THREE.Vector2( tx, ty ) );

			}

			//console.log(points);

		  break;

		} // end switch

	}

	if ( closedPath ) {

		points.push( points[ 0 ] );

	}

	return points;

};



// This was used for testing purposes. Should be removed soon.

THREE.Path.prototype.transform = function( path, segments ) {

	var bounds = this.getBoundingBox();
	var oldPts = this.getPoints( segments ); // getPoints getSpacedPoints

	//console.log( path.cacheArcLengths() );
	//path.getLengths(400);
	//segments = 40;

	return this.getWrapPoints( oldPts, path );

};

// Read http://www.tinaja.com/glib/nonlingr.pdf
// nonlinear transforms

THREE.Path.prototype.nltransform = function( a, b, c, d, e, f ) {

	// a - horizontal size
	// b - lean
	// c - x offset
	// d - vertical size
	// e - climb
	// f - y offset

	var oldPts = this.getPoints();

	var i, il, p, oldX, oldY;

	for ( i = 0, il = oldPts.length; i < il; i ++ ) {

		p = oldPts[i];

		oldX = p.x;
		oldY = p.y;

		p.x = a * oldX + b * oldY + c;
		p.y = d * oldY + e * oldX + f;

	}

	return oldPts;

};


// FUTURE Export JSON Format

/* Draws this path onto a 2d canvas easily */

THREE.Path.prototype.debug = function( canvas ) {

	var bounds = this.getBoundingBox();

	if ( !canvas ) {

		canvas = document.createElement( "canvas" );

		canvas.setAttribute( 'width',  bounds.maxX + 100 );
		canvas.setAttribute( 'height', bounds.maxY + 100 );

		document.body.appendChild( canvas );

	}

	var ctx = canvas.getContext( "2d" );
	ctx.fillStyle = "white";
	ctx.fillRect( 0, 0, canvas.width, canvas.height );

	ctx.strokeStyle = "black";
	ctx.beginPath();

	var i, il, item, action, args;

	// Debug Path

	for ( i = 0, il = this.actions.length; i < il; i ++ ) {

		item = this.actions[ i ];

		args = item.args;
		action = item.action;

		// Short hand for now

		if ( action != THREE.PathActions.CSPLINE_THRU ) {

			ctx[ action ].apply( ctx, args );

		}

		/*
		switch ( action ) {

			case THREE.PathActions.MOVE_TO:

				ctx[ action ]( args[ 0 ], args[ 1 ] );
				break;

			case THREE.PathActions.LINE_TO:

				ctx[ action ]( args[ 0 ], args[ 1 ] );
				break;

			case THREE.PathActions.QUADRATIC_CURVE_TO:

				ctx[ action ]( args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ] );
				break;

			case THREE.PathActions.CUBIC_CURVE_TO:

				ctx[ action ]( args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ] );
				break;

		}
		*/

	}

	ctx.stroke();
	ctx.closePath();

	// Debug Points

	ctx.strokeStyle = "red";

	/* TO CLEAN UP */

	var p, points = this.getPoints();

	//var theta = -90 /180 * Math.PI;
	//var p, points = this.transform( 0.866, - 0.866,0, 0.500 , 0.50,-50 );

	//0.866, - 0.866,0, 0.500 , 0.50,-50

	// Math.cos(theta),Math.sin(theta),100,
	// Math.cos(theta),-Math.sin(theta),-50

	// translate, scale, rotation


	for ( i = 0, il = points.length; i < il; i ++ ) {

		p = points[ i ];

		ctx.beginPath();
		ctx.arc( p.x, p.y, 1.5, 0, Math.PI * 2, false );
		ctx.stroke();
		ctx.closePath();

	}

};

// Breaks path into shapes

THREE.Path.prototype.toShapes = function() {

	var i, il, item, action, args;

	var subPaths = [], lastPath = new THREE.Path();

	for ( i = 0, il = this.actions.length; i < il; i ++ ) {

		item = this.actions[ i ];

		args = item.args;
		action = item.action;

		if ( action == THREE.PathActions.MOVE_TO ) {

			if ( lastPath.actions.length != 0 ) {

				subPaths.push( lastPath );
				lastPath = new THREE.Path();

			}

		}

		lastPath[ action ].apply( lastPath, args );

	}

	if ( lastPath.actions.length != 0 ) {

		subPaths.push( lastPath );

	}

	//console.log(subPaths);

	if ( subPaths.length == 0 ) return [];

	var holesFirst = !THREE.Shape.Utils.isClockWise( subPaths[ 0 ].getPoints() );

	var tmpPath, tmpShape, shapes = [];

	//console.log("Holes first", holesFirst);

	if ( holesFirst ) {

		tmpShape = new THREE.Shape();

		for ( i = 0, il = subPaths.length; i < il; i ++ ) {

			tmpPath = subPaths[ i ];

			if ( THREE.Shape.Utils.isClockWise( tmpPath.getPoints() ) ) {

				tmpShape.actions = tmpPath.actions;
				tmpShape.curves = tmpPath.curves;

				shapes.push( tmpShape );
				tmpShape = new THREE.Shape();

				//console.log('cw', i);

			} else {

				tmpShape.holes.push( tmpPath );

				//console.log('ccw', i);

			}

		}

	} else {

		// Shapes first

		for ( i = 0, il = subPaths.length; i < il; i ++ ) {

			tmpPath = subPaths[ i ];

			if ( THREE.Shape.Utils.isClockWise( tmpPath.getPoints() ) ) {


				if ( tmpShape ) shapes.push( tmpShape );

				tmpShape = new THREE.Shape();
				tmpShape.actions = tmpPath.actions;
				tmpShape.curves = tmpPath.curves;

			} else {

				tmpShape.holes.push( tmpPath );

			}

		}

		shapes.push( tmpShape );

	}

	//console.log("shape", shapes);

	return shapes;

};
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Defines a 2d shape plane using paths.
 **/

// STEP 1 Create a path.
// STEP 2 Turn path into shape.
// STEP 3 ExtrudeGeometry takes in Shape/Shapes
// STEP 3a - Extract points from each shape, turn to vertices
// STEP 3b - Triangulate each shape, add faces.

THREE.Shape = function ( ) {

	THREE.Path.apply( this, arguments );
	this.holes = [];

};

THREE.Shape.prototype = new THREE.Path();
THREE.Shape.prototype.constructor = THREE.Path;

// Convenience method to return ExtrudeGeometry

THREE.Shape.prototype.extrude = function ( options ) {

	var extruded = new THREE.ExtrudeGeometry( this, options );
	return extruded;

};

// Get points of holes

THREE.Shape.prototype.getPointsHoles = function ( divisions ) {

	var i, il = this.holes.length, holesPts = [];

	for ( i = 0; i < il; i ++ ) {

		holesPts[ i ] = this.holes[ i ].getTransformedPoints( divisions, this.bends );

	}

	return holesPts;

};

// Get points of holes (spaced by regular distance)

THREE.Shape.prototype.getSpacedPointsHoles = function ( divisions ) {

	var i, il = this.holes.length, holesPts = [];

	for ( i = 0; i < il; i ++ ) {

		holesPts[ i ] = this.holes[ i ].getTransformedSpacedPoints( divisions, this.bends );

	}

	return holesPts;

};


// Get points of shape and holes (keypoints based on segments parameter)

THREE.Shape.prototype.extractAllPoints = function ( divisions ) {

	return {

		shape: this.getTransformedPoints( divisions ),
		holes: this.getPointsHoles( divisions )

	};

};

//
// THREE.Shape.prototype.extractAllPointsWithBend = function ( divisions, bend ) {
//
// 	return {
//
// 		shape: this.transform( bend, divisions ),
// 		holes: this.getPointsHoles( divisions, bend )
//
// 	};
//
// };

// Get points of shape and holes (spaced by regular distance)

THREE.Shape.prototype.extractAllSpacedPoints = function ( divisions ) {

	return {

		shape: this.getTransformedSpacedPoints( divisions ),
		holes: this.getSpacedPointsHoles( divisions )

	};

};

/**************************************************************
 *	Utils
 **************************************************************/

THREE.Shape.Utils = {

	/*
		contour - array of vector2 for contour
		holes   - array of array of vector2
	*/

	removeHoles: function ( contour, holes ) {

		var shape = contour.concat(); // work on this shape
		var allpoints = shape.concat();

		/* For each isolated shape, find the closest points and break to the hole to allow triangulation */


		var prevShapeVert, nextShapeVert,
			prevHoleVert, nextHoleVert,
			holeIndex, shapeIndex,
			shapeId, shapeGroup,
			h, h2,
			hole, shortest, d,
			p, pts1, pts2,
			tmpShape1, tmpShape2,
			tmpHole1, tmpHole2,
			verts = [];

		for ( h = 0; h < holes.length; h ++ ) {

			hole = holes[ h ];

			/*
			shapeholes[ h ].concat(); // preserves original
			holes.push( hole );
			*/

			Array.prototype.push.apply( allpoints, hole );

			shortest = Number.POSITIVE_INFINITY;


			// Find the shortest pair of pts between shape and hole

			// Note: Actually, I'm not sure now if we could optimize this to be faster than O(m*n)
			// Using distanceToSquared() intead of distanceTo() should speed a little
			// since running square roots operations are reduced.

			for ( h2 = 0; h2 < hole.length; h2 ++ ) {

				pts1 = hole[ h2 ];
				var dist = [];

				for ( p = 0; p < shape.length; p++ ) {

					pts2 = shape[ p ];
					d = pts1.distanceToSquared( pts2 );
					dist.push( d );

					if ( d < shortest ) {

						shortest = d;
						holeIndex = h2;
						shapeIndex = p;

					}

				}

			}

			//console.log("shortest", shortest, dist);

			prevShapeVert = ( shapeIndex - 1 ) >= 0 ? shapeIndex - 1 : shape.length - 1;
			prevHoleVert = ( holeIndex - 1 ) >= 0 ? holeIndex - 1 : hole.length - 1;

			var areaapts = [

				hole[ holeIndex ],
				shape[ shapeIndex ],
				shape[ prevShapeVert ]

			];

			var areaa = THREE.FontUtils.Triangulate.area( areaapts );

			var areabpts = [

				hole[ holeIndex ],
				hole[ prevHoleVert ],
				shape[ shapeIndex ]

			];

			var areab = THREE.FontUtils.Triangulate.area( areabpts );

			var shapeOffset = 1;
			var holeOffset = -1;

			var oldShapeIndex = shapeIndex, oldHoleIndex = holeIndex;
			shapeIndex += shapeOffset;
			holeIndex += holeOffset;

			if ( shapeIndex < 0 ) { shapeIndex += shape.length;  }
			shapeIndex %= shape.length;

			if ( holeIndex < 0 ) { holeIndex += hole.length;  }
			holeIndex %= hole.length;

			prevShapeVert = ( shapeIndex - 1 ) >= 0 ? shapeIndex - 1 : shape.length - 1;
			prevHoleVert = ( holeIndex - 1 ) >= 0 ? holeIndex - 1 : hole.length - 1;

			areaapts = [

				hole[ holeIndex ],
				shape[ shapeIndex ],
				shape[ prevShapeVert ]

			];

			var areaa2 = THREE.FontUtils.Triangulate.area( areaapts );

			areabpts = [

				hole[ holeIndex ],
				hole[ prevHoleVert ],
				shape[ shapeIndex ]

			];

			var areab2 = THREE.FontUtils.Triangulate.area( areabpts );
			//console.log(areaa,areab ,areaa2,areab2, ( areaa + areab ),  ( areaa2 + areab2 ));

			if ( ( areaa + areab ) > ( areaa2 + areab2 ) ) {

				// In case areas are not correct.
				//console.log("USE THIS");

				shapeIndex = oldShapeIndex;
				holeIndex = oldHoleIndex ;

				if ( shapeIndex < 0 ) { shapeIndex += shape.length;  }
				shapeIndex %= shape.length;

				if ( holeIndex < 0 ) { holeIndex += hole.length;  }
				holeIndex %= hole.length;

				prevShapeVert = ( shapeIndex - 1 ) >= 0 ? shapeIndex - 1 : shape.length - 1;
				prevHoleVert = ( holeIndex - 1 ) >= 0 ? holeIndex - 1 : hole.length - 1;

			} else {

				//console.log("USE THAT ")

			}

			tmpShape1 = shape.slice( 0, shapeIndex );
			tmpShape2 = shape.slice( shapeIndex );
			tmpHole1 = hole.slice( holeIndex );
			tmpHole2 = hole.slice( 0, holeIndex );

			// Should check orders here again?

			var trianglea = [

				hole[ holeIndex ],
				shape[ shapeIndex ],
				shape[ prevShapeVert ]

			];

			var triangleb = [

				hole[ holeIndex ] ,
				hole[ prevHoleVert ],
				shape[ shapeIndex ]

			];

			verts.push( trianglea );
			verts.push( triangleb );

			shape = tmpShape1.concat( tmpHole1 ).concat( tmpHole2 ).concat( tmpShape2 );

		}

		return {

			shape:shape, 		/* shape with no holes */
			isolatedPts: verts, /* isolated faces */
			allpoints: allpoints

		}


	},

	triangulateShape: function ( contour, holes ) {

		var shapeWithoutHoles = THREE.Shape.Utils.removeHoles( contour, holes );

		var shape = shapeWithoutHoles.shape,
			allpoints = shapeWithoutHoles.allpoints,
			isolatedPts = shapeWithoutHoles.isolatedPts;

		var triangles = THREE.FontUtils.Triangulate( shape, false ); // True returns indices for points of spooled shape

		// To maintain reference to old shape, one must match coordinates, or offset the indices from original arrays. It's probably easier to do the first.

		//console.log( "triangles",triangles, triangles.length );
		//console.log( "allpoints",allpoints, allpoints.length );

		var i, il, f, face,
			key, index,
			allPointsMap = {},
			isolatedPointsMap = {};

		// prepare all points map

		for ( i = 0, il = allpoints.length; i < il; i ++ ) {

			key = allpoints[ i ].x + ":" + allpoints[ i ].y;

			if ( allPointsMap[ key ] !== undefined ) {

				console.log( "Duplicate point", key );

			}

			allPointsMap[ key ] = i;

		}

		// check all face vertices against all points map

		for ( i = 0, il = triangles.length; i < il; i ++ ) {

			face = triangles[ i ];

			for ( f = 0; f < 3; f ++ ) {

				key = face[ f ].x + ":" + face[ f ].y;

				index = allPointsMap[ key ];

				if ( index !== undefined ) {

					face[ f ] = index;

				}

			}

		}

		// check isolated points vertices against all points map

		for ( i = 0, il = isolatedPts.length; i < il; i ++ ) {

			face = isolatedPts[ i ];

			for ( f = 0; f < 3; f ++ ) {

				key = face[ f ].x + ":" + face[ f ].y;

				index = allPointsMap[ key ];

				if ( index !== undefined ) {

					face[ f ] = index;

				}

			}

		}

		return triangles.concat( isolatedPts );

	}, // end triangulate shapes

	/*
	triangulate2 : function( pts, holes ) {

		// For use with Poly2Tri.js

		var allpts = pts.concat();
		var shape = [];
		for (var p in pts) {
			shape.push(new js.poly2tri.Point(pts[p].x, pts[p].y));
		}

		var swctx = new js.poly2tri.SweepContext(shape);

		for (var h in holes) {
			var aHole = holes[h];
			var newHole = []
			for (i in aHole) {
				newHole.push(new js.poly2tri.Point(aHole[i].x, aHole[i].y));
				allpts.push(aHole[i]);
			}
			swctx.AddHole(newHole);
		}

		var find;
		var findIndexForPt = function (pt) {
			find = new THREE.Vector2(pt.x, pt.y);
			var p;
			for (p=0, pl = allpts.length; p<pl; p++) {
				if (allpts[p].equals(find)) return p;
			}
			return -1;
		};

		// triangulate
		js.poly2tri.sweep.Triangulate(swctx);

		var triangles =  swctx.GetTriangles();
		var tr ;
		var facesPts = [];
		for (var t in triangles) {
			tr =  triangles[t];
			facesPts.push([
				findIndexForPt(tr.GetPoint(0)),
				findIndexForPt(tr.GetPoint(1)),
				findIndexForPt(tr.GetPoint(2))
					]);
		}


	//	console.log(facesPts);
	//	console.log("triangles", triangles.length, triangles);

		// Returns array of faces with 3 element each
	return facesPts;
	},
*/

	isClockWise: function ( pts ) {

		return THREE.FontUtils.Triangulate.area( pts ) < 0;

	},

	// Bezier Curves formulas obtained from
	// http://en.wikipedia.org/wiki/B%C3%A9zier_curve

	// Quad Bezier Functions

	b2p0: function ( t, p ) {

		var k = 1 - t;
		return k * k * p;

	},

	b2p1: function ( t, p ) {

		return 2 * ( 1 - t ) * t * p;

	},

	b2p2: function ( t, p ) {

		return t * t * p;

	},

	b2: function ( t, p0, p1, p2 ) {

		return this.b2p0( t, p0 ) + this.b2p1( t, p1 ) + this.b2p2( t, p2 );

	},

	// Cubic Bezier Functions

	b3p0: function ( t, p ) {

		var k = 1 - t;
		return k * k * k * p;

	},

	b3p1: function ( t, p ) {

		var k = 1 - t;
		return 3 * k * k * t * p;

	},

	b3p2: function ( t, p ) {

		var k = 1 - t;
		return 3 * k * t * t * p;

	},

	b3p3: function ( t, p ) {

		return t * t * t * p;

	},

	b3: function ( t, p0, p1, p2, p3 ) {

		return this.b3p0( t, p0 ) + this.b3p1( t, p1 ) + this.b3p2( t, p2 ) +  this.b3p3( t, p3 );

	}

};

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * TextPath
 *
 **/

THREE.TextPath = function ( text, parameters ) {

	THREE.Path.call( this );

	this.parameters = parameters || {};

	this.set( text );

};

THREE.TextPath.prototype.set = function ( text, parameters ) {

	this.text = text;

	var parameters = parameters || this.parameters;

	var size = parameters.size !== undefined ? parameters.size : 100;
	var curveSegments = parameters.curveSegments !== undefined ? parameters.curveSegments: 4;

	var font = parameters.font !== undefined ? parameters.font : "helvetiker";
	var weight = parameters.weight !== undefined ? parameters.weight : "normal";
	var style = parameters.style !== undefined ? parameters.style : "normal";

	THREE.FontUtils.size = size;
	THREE.FontUtils.divisions = curveSegments;

	THREE.FontUtils.face = font;
	THREE.FontUtils.weight = weight;
	THREE.FontUtils.style = style;

};



THREE.TextPath.prototype.toShapes = function () {

	// Get a Font data json object

	var data = THREE.FontUtils.drawText( this.text );

	var paths = data.paths;
	var shapes = [];

	for ( var p = 0, pl = paths.length; p < pl; p ++ ) {

		Array.prototype.push.apply( shapes, paths[ p ].toShapes() );

	}

	return shapes;

	//console.log(path);
	//console.log(fontShapes);

	// Either find actions or curves.

	//var text3d = new THREE.ExtrudeGeometry( shapes , { amount: 20, bevelEnabled:true, bevelThickness:3	} );

	//return text3d;

};
/**
 * @author mikael emtinger / http://gomo.se/
 */

THREE.AnimationHandler = (function() {

	var playing = [];
	var library = {};
	var that    = {};


	//--- update ---

	that.update = function( deltaTimeMS ) {

		for( var i = 0; i < playing.length; i++ )
			playing[ i ].update( deltaTimeMS );

	};


	//--- add ---

	that.addToUpdate = function( animation ) {

		if( playing.indexOf( animation ) === -1 )
			playing.push( animation );

	};


	//--- remove ---

	that.removeFromUpdate = function( animation ) {

		var index = playing.indexOf( animation );

		if( index !== -1 )
			playing.splice( index, 1 );

	};


	//--- add ---

	that.add = function( data ) {

		if( library[ data.name ] !== undefined )
			console.log( "THREE.AnimationHandler.add: Warning! " + data.name + " already exists in library. Overwriting." );

		library[ data.name ] = data;
		initData( data );

	};


	//--- get ---

	that.get = function( name ) {

		if( typeof name === "string" ) {

			if( library[ name ] ) {

				return library[ name ];

			} else {

				console.log( "THREE.AnimationHandler.get: Couldn't find animation " + name );
				return null;

			}

		} else {

			// todo: add simple tween library

		}

	};

	//--- parse ---

	that.parse = function( root ) {

		// setup hierarchy

		var hierarchy = [];

		if ( root instanceof THREE.SkinnedMesh ) {

			for( var b = 0; b < root.bones.length; b++ ) {

				hierarchy.push( root.bones[ b ] );

			}

		} else {

			parseRecurseHierarchy( root, hierarchy );

		}

		return hierarchy;

	};

	var parseRecurseHierarchy = function( root, hierarchy ) {

		hierarchy.push( root );

		for( var c = 0; c < root.children.length; c++ )
			parseRecurseHierarchy( root.children[ c ], hierarchy );

	}


	//--- init data ---

	var initData = function( data ) {

		if( data.initialized === true )
			return;


		// loop through all keys

		for( var h = 0; h < data.hierarchy.length; h ++ ) {

			for( var k = 0; k < data.hierarchy[ h ].keys.length; k ++ ) {

				// remove minus times

				if( data.hierarchy[ h ].keys[ k ].time < 0 )
					data.hierarchy[ h ].keys[ k ].time = 0;


				// create quaternions

				if( data.hierarchy[ h ].keys[ k ].rot !== undefined &&
				 !( data.hierarchy[ h ].keys[ k ].rot instanceof THREE.Quaternion ) ) {

					var quat = data.hierarchy[ h ].keys[ k ].rot;
					data.hierarchy[ h ].keys[ k ].rot = new THREE.Quaternion( quat[0], quat[1], quat[2], quat[3] );

				}
			}


			// prepare morph target keys

			if( data.hierarchy[ h ].keys[ 0 ].morphTargets !== undefined ) {

				// get all used

				var usedMorphTargets = {};

				for( var k = 0; k < data.hierarchy[ h ].keys.length; k ++ ) {

					for( var m = 0; m < data.hierarchy[ h ].keys[ k ].morphTargets.length; m ++ ) {

						var morphTargetName = data.hierarchy[ h ].keys[ k ].morphTargets[ m ];
						usedMorphTargets[ morphTargetName ] = -1;

					}

				}

				data.hierarchy[ h ].usedMorphTargets = usedMorphTargets;


				// set all used on all frames

				for( var k = 0; k < data.hierarchy[ h ].keys.length; k ++ ) {

					var influences = {};

					for( var morphTargetName in usedMorphTargets ) {

						for( var m = 0; m < data.hierarchy[ h ].keys[ k ].morphTargets.length; m ++ ) {

							if( data.hierarchy[ h ].keys[ k ].morphTargets[ m ] === morphTargetName ) {

								influences[ morphTargetName ] = data.hierarchy[ h ].keys[ k ].morphTargetsInfluences[ m ];
								break;

							}

						}

						if( m === data.hierarchy[ h ].keys[ k ].morphTargets.length ) {

							influences[ morphTargetName ] = 0;

						}

					}

					data.hierarchy[ h ].keys[ k ].morphTargetsInfluences = influences;

				}

			}


			// remove all keys that are on the same time

			for( var k = 1; k < data.hierarchy[ h ].keys.length; k ++ ) {

				if( data.hierarchy[ h ].keys[ k ].time === data.hierarchy[ h ].keys[ k - 1 ].time ) {

					data.hierarchy[ h ].keys.splice( k, 1 );
					k --;

				}

			}


			// set index

			for( var k = 1; k < data.hierarchy[ h ].keys.length; k ++ ) {

				data.hierarchy[ h ].keys[ k ].index = k;

			}

		}


		// JIT

		var lengthInFrames = parseInt( data.length * data.fps, 10 );

		data.JIT = {};
		data.JIT.hierarchy = [];

		for( var h = 0; h < data.hierarchy.length; h ++ )
			data.JIT.hierarchy.push( new Array( lengthInFrames ) );


		// done

		data.initialized = true;

	};


	// interpolation types

	that.LINEAR = 0;
	that.CATMULLROM = 1;
	that.CATMULLROM_FORWARD = 2;

	return that;

}());
/**
 * @author mikael emtinger / http://gomo.se/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Animation = function( root, data, interpolationType, JITCompile ) {

	this.root = root;
	this.data = THREE.AnimationHandler.get( data );
	this.hierarchy = THREE.AnimationHandler.parse( root );
	this.currentTime = 0;
	this.timeScale = 1;
	this.isPlaying = false;
	this.isPaused = true;
	this.loop = true;
	this.interpolationType = interpolationType !== undefined ? interpolationType : THREE.AnimationHandler.LINEAR;
	this.JITCompile = JITCompile !== undefined ? JITCompile : true;

	this.points = [];
	this.target = new THREE.Vector3();

};

// Play

THREE.Animation.prototype.play = function( loop, startTimeMS ) {

	if( !this.isPlaying ) {

		this.isPlaying = true;
		this.loop = loop !== undefined ? loop : true;
		this.currentTime = startTimeMS !== undefined ? startTimeMS : 0;


		// reset key cache

		var h, hl = this.hierarchy.length,
			object;
		
		for ( h = 0; h < hl; h++ ) {

			object = this.hierarchy[ h ];
			
			if ( this.interpolationType !== THREE.AnimationHandler.CATMULLROM_FORWARD ) {

				object.useQuaternion = true;

			}
			
			object.matrixAutoUpdate = true;

			if ( object.animationCache === undefined ) {

				object.animationCache = {};
				object.animationCache.prevKey = { pos: 0, rot: 0, scl: 0 };
				object.animationCache.nextKey = { pos: 0, rot: 0, scl: 0 };
				object.animationCache.originalMatrix = object instanceof THREE.Bone ? object.skinMatrix : object.matrix;

			}

			var prevKey = object.animationCache.prevKey;
			var nextKey = object.animationCache.nextKey;

			prevKey.pos = this.data.hierarchy[ h ].keys[ 0 ];
			prevKey.rot = this.data.hierarchy[ h ].keys[ 0 ];
			prevKey.scl = this.data.hierarchy[ h ].keys[ 0 ];

			nextKey.pos = this.getNextKeyWith( "pos", h, 1 );
			nextKey.rot = this.getNextKeyWith( "rot", h, 1 );
			nextKey.scl = this.getNextKeyWith( "scl", h, 1 );

		}

		this.update( 0 );

	}

	this.isPaused = false;

	THREE.AnimationHandler.addToUpdate( this );

};



// Pause

THREE.Animation.prototype.pause = function() {

	if( this.isPaused ) {
		
		THREE.AnimationHandler.addToUpdate( this );
		
	} else {
		
		THREE.AnimationHandler.removeFromUpdate( this );
		
	}
	
	this.isPaused = !this.isPaused;

};


// Stop

THREE.Animation.prototype.stop = function() {

	this.isPlaying = false;
	this.isPaused  = false;
	THREE.AnimationHandler.removeFromUpdate( this );
	
	
	// reset JIT matrix and remove cache
	
	for ( var h = 0; h < this.hierarchy.length; h++ ) {
		
		if ( this.hierarchy[ h ].animationCache !== undefined ) {
			
			if( this.hierarchy[ h ] instanceof THREE.Bone ) {
			
				this.hierarchy[ h ].skinMatrix = this.hierarchy[ h ].animationCache.originalMatrix;
				
			} else {
				
				this.hierarchy[ h ].matrix = this.hierarchy[ h ].animationCache.originalMatrix;

			}
			
			
			delete this.hierarchy[ h ].animationCache;

		}

	}
 	
};


// Update

THREE.Animation.prototype.update = function( deltaTimeMS ) {

	// early out

	if( !this.isPlaying ) return;


	// vars

	var types = [ "pos", "rot", "scl" ];
	var type;
	var scale;
	var vector;
	var prevXYZ, nextXYZ;
	var prevKey, nextKey;
	var object;
	var animationCache;
	var frame;
	var JIThierarchy = this.data.JIT.hierarchy;
	var currentTime, unloopedCurrentTime;
	var currentPoint, forwardPoint, angle;
	

	// update
	
	this.currentTime += deltaTimeMS * this.timeScale;

	unloopedCurrentTime = this.currentTime;
	currentTime         = this.currentTime = this.currentTime % this.data.length;
	frame               = parseInt( Math.min( currentTime * this.data.fps, this.data.length * this.data.fps ), 10 );


	// update

	for ( var h = 0, hl = this.hierarchy.length; h < hl; h++ ) {

		object = this.hierarchy[ h ];
		animationCache = object.animationCache;
	
		// use JIT?
	
		if ( this.JITCompile && JIThierarchy[ h ][ frame ] !== undefined ) {

			if( object instanceof THREE.Bone ) {
				
				object.skinMatrix = JIThierarchy[ h ][ frame ];
				
				object.matrixAutoUpdate = false;
				object.matrixWorldNeedsUpdate = false;

			} else {
			
				object.matrix = JIThierarchy[ h ][ frame ];
				
				object.matrixAutoUpdate = false;
				object.matrixWorldNeedsUpdate = true;

			}
			
		// use interpolation
	
		} else {

			// make sure so original matrix and not JIT matrix is set

			if ( this.JITCompile ) {
				
				if( object instanceof THREE.Bone ) {
					
					object.skinMatrix = object.animationCache.originalMatrix;
					
				} else {
					
					object.matrix = object.animationCache.originalMatrix;
					
				}

			}


			// loop through pos/rot/scl

			for ( var t = 0; t < 3; t++ ) {

				// get keys

				type    = types[ t ];
				prevKey = animationCache.prevKey[ type ];
				nextKey = animationCache.nextKey[ type ];

				// switch keys?

				if ( nextKey.time <= unloopedCurrentTime ) {

					// did we loop?

					if ( currentTime < unloopedCurrentTime ) {

						if ( this.loop ) {

							prevKey = this.data.hierarchy[ h ].keys[ 0 ];
							nextKey = this.getNextKeyWith( type, h, 1 );

							while( nextKey.time < currentTime ) {
	
								prevKey = nextKey;
								nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );
	
							}

						} else {

							this.stop();
							return;

						}

					} else {

						do {

							prevKey = nextKey;
							nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );

						} while( nextKey.time < currentTime )

					}

					animationCache.prevKey[ type ] = prevKey;
					animationCache.nextKey[ type ] = nextKey;

				}


				object.matrixAutoUpdate = true;
				object.matrixWorldNeedsUpdate = true;

				scale = ( currentTime - prevKey.time ) / ( nextKey.time - prevKey.time );
				prevXYZ = prevKey[ type ];
				nextXYZ = nextKey[ type ];


				// check scale error

				if ( scale < 0 || scale > 1 ) {

					console.log( "THREE.Animation.update: Warning! Scale out of bounds:" + scale + " on bone " + h ); 
					scale = scale < 0 ? 0 : 1;

				}

				// interpolate

				if ( type === "pos" ) {

					vector = object.position; 

					if( this.interpolationType === THREE.AnimationHandler.LINEAR ) {
						
						vector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
						vector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
						vector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

					} else if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
							    this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {						
		
						this.points[ 0 ] = this.getPrevKeyWith( "pos", h, prevKey.index - 1 )[ "pos" ];
						this.points[ 1 ] = prevXYZ;
						this.points[ 2 ] = nextXYZ;
						this.points[ 3 ] = this.getNextKeyWith( "pos", h, nextKey.index + 1 )[ "pos" ];

						scale = scale * 0.33 + 0.33;

						currentPoint = this.interpolateCatmullRom( this.points, scale );
						
						vector.x = currentPoint[ 0 ];
						vector.y = currentPoint[ 1 ];
						vector.z = currentPoint[ 2 ];
						
						if( this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {
							
							forwardPoint = this.interpolateCatmullRom( this.points, scale * 1.01 );							
							
							this.target.set( forwardPoint[ 0 ], forwardPoint[ 1 ], forwardPoint[ 2 ] );
							this.target.subSelf( vector );
							this.target.y = 0;
							this.target.normalize();
							
							angle = Math.atan2( this.target.x, this.target.z );
							object.rotation.set( 0, angle, 0 );
							
						}

					}

				} else if ( type === "rot" ) {

					THREE.Quaternion.slerp( prevXYZ, nextXYZ, object.quaternion, scale );

				} else if( type === "scl" ) {

					vector = object.scale;
					
					vector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
					vector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
					vector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

				}

			}

		}

	}

	// update JIT?

	if ( this.JITCompile ) {
		
		if ( JIThierarchy[ 0 ][ frame ] === undefined ) {
	
			this.hierarchy[ 0 ].update( undefined, true );
	
			for ( var h = 0; h < this.hierarchy.length; h++ ) {
	
				if( this.hierarchy[ h ] instanceof THREE.Bone ) {
	
					JIThierarchy[ h ][ frame ] = this.hierarchy[ h ].skinMatrix.clone();
					
				} else {
	
					JIThierarchy[ h ][ frame ] = this.hierarchy[ h ].matrix.clone();
				
				}
	
			}
	
		}

	}

};

// Catmull-Rom spline
 
THREE.Animation.prototype.interpolateCatmullRom = function ( points, scale ) {

	var c = [], v3 = [],
	point, intPoint, weight, w2, w3,
	pa, pb, pc, pd;
	
	point = ( points.length - 1 ) * scale;
	intPoint = Math.floor( point );
	weight = point - intPoint;

	c[ 0 ] = intPoint == 0 ? intPoint : intPoint - 1;
	c[ 1 ] = intPoint;
	c[ 2 ] = intPoint > points.length - 2 ? intPoint : intPoint + 1;
	c[ 3 ] = intPoint > points.length - 3 ? intPoint : intPoint + 2;

	pa = points[ c[ 0 ] ];
	pb = points[ c[ 1 ] ];
	pc = points[ c[ 2 ] ];
	pd = points[ c[ 3 ] ];

	w2 = weight * weight;
	w3 = weight * w2;
	
	v3[ 0 ] = this.interpolate( pa[ 0 ], pb[ 0 ], pc[ 0 ], pd[ 0 ], weight, w2, w3 );
	v3[ 1 ] = this.interpolate( pa[ 1 ], pb[ 1 ], pc[ 1 ], pd[ 1 ], weight, w2, w3 );
	v3[ 2 ] = this.interpolate( pa[ 2 ], pb[ 2 ], pc[ 2 ], pd[ 2 ], weight, w2, w3 );
	
	return v3;

};

THREE.Animation.prototype.interpolate = function( p0, p1, p2, p3, t, t2, t3 ) {

	var v0 = ( p2 - p0 ) * 0.5,
		v1 = ( p3 - p1 ) * 0.5;

	return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

};



// Get next key with

THREE.Animation.prototype.getNextKeyWith = function( type, h, key ) {
	
	var keys = this.data.hierarchy[ h ].keys;
	
	if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
		 this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {
			 
		key = key < keys.length - 1 ? key : keys.length - 1;

	} else {
		
		key = key % keys.length;

	}

	for ( ; key < keys.length; key++ ) {

		if ( keys[ key ][ type ] !== undefined ) {

			return keys[ key ];

		}

	}

	return this.data.hierarchy[ h ].keys[ 0 ];

};

// Get previous key with

THREE.Animation.prototype.getPrevKeyWith = function( type, h, key ) {
	
	var keys = this.data.hierarchy[ h ].keys;
	
	if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
		 this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {
			 
		key = key > 0 ? key : 0;

	} else {
		
		key = key >= 0 ? key : key + keys.length;

	}


	for ( ; key >= 0; key-- ) {

		if ( keys[ key ][ type ] !== undefined ) {

			return keys[ key ];

		}

	}

	return this.data.hierarchy[ h ].keys[ keys.length - 1 ];

};
/**
 * Camera for rendering cube maps
 *	- renders scene into axis-aligned cube
 *
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CubeCamera = function ( near, far, height, resolution ) {

	var fov = 90, aspect = 1;

	this.cameraPX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraNX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraPY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraNY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraPZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraNZ = new THREE.PerspectiveCamera( fov, aspect, near, far );

	this.cameraPXTarget = new THREE.Vector3( 0, 0, 0 );
	this.cameraNXTarget = new THREE.Vector3( 0, 0, 0 );
	this.cameraPYTarget = new THREE.Vector3( 0, 0, 0 );
	this.cameraNYTarget = new THREE.Vector3( 0, 0, 0 );
	this.cameraPZTarget = new THREE.Vector3( 0, 0, 0 );
	this.cameraNZTarget = new THREE.Vector3( 0, 0, 0 );

	this.height = height;
	this.position = new THREE.Vector3( 0, height, 0 );

	this.cameraPX.position = this.position;
	this.cameraNX.position = this.position;
	this.cameraPY.position = this.position;
	this.cameraNY.position = this.position;
	this.cameraPZ.position = this.position;
	this.cameraNZ.position = this.position;

	this.cameraPY.up.set( 0, 0, 1 );
	this.cameraPZ.up.set( 0, -1, 0 );
	this.cameraNZ.up.set( 0, -1, 0 );

	this.renderTarget = new THREE.WebGLRenderTargetCube( resolution, resolution, { format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter } );

	this.updatePosition = function ( position ) {

		this.position.x = position.x;
		this.position.z = position.z;

		this.cameraPXTarget.add( this.position, new THREE.Vector3( -1,  0,  0 ) );
		this.cameraNXTarget.add( this.position, new THREE.Vector3(  1,  0,  0 ) );

		this.cameraPYTarget.add( this.position, new THREE.Vector3(  0,  1,  0 ) );
		this.cameraNYTarget.add( this.position, new THREE.Vector3(  0, -1,  0 ) );

		this.cameraPZTarget.add( this.position, new THREE.Vector3(  0,  0,  1 ) );
		this.cameraNZTarget.add( this.position, new THREE.Vector3(  0,  0, -1 ) );

		this.cameraPX.lookAt( this.cameraPXTarget );
		this.cameraNX.lookAt( this.cameraNXTarget );

		this.cameraPY.lookAt( this.cameraPYTarget );
		this.cameraNY.lookAt( this.cameraNYTarget );

		this.cameraPZ.lookAt( this.cameraPZTarget );
		this.cameraNZ.lookAt( this.cameraNZTarget );

	};

	this.updateCubeMap = function ( renderer, scene ) {

		var cubeTarget = this.renderTarget;

		renderer.setFaceCulling( "back", "cw" );

		scene.scale.y = -1;
		scene.position.y = 2 * this.height;
		scene.updateMatrix();

		cubeTarget.activeCubeFace = 0;
		renderer.render( scene, this.cameraPX, cubeTarget );

		cubeTarget.activeCubeFace = 1;
		renderer.render( scene, this.cameraNX, cubeTarget );

		scene.scale.y = 1;
		scene.position.y = 0;
		scene.updateMatrix();

		scene.scale.x = -1;
		scene.updateMatrix();

		cubeTarget.activeCubeFace = 2;
		renderer.render( scene, this.cameraPY, cubeTarget );

		scene.scale.x = 1;
		scene.updateMatrix();

		renderer.setFaceCulling( "back", "ccw" );

		cubeTarget.activeCubeFace = 3;
		renderer.render( scene, this.cameraNY, cubeTarget );

		scene.scale.x = -1;
		scene.updateMatrix();

		renderer.setFaceCulling( "back", "cw" );

		cubeTarget.activeCubeFace = 4;
		renderer.render( scene, this.cameraPZ, cubeTarget );

		cubeTarget.activeCubeFace = 5;
		renderer.render( scene, this.cameraNZ, cubeTarget );

		scene.scale.x = 1;
		scene.updateMatrix();

		renderer.setFaceCulling( "back", "ccw" );

	};

};

THREE.FirstPersonCamera = function () {

	console.warn( 'DEPRECATED: FirstPersonCamera() is FirstPersonControls().' );

};
THREE.PathCamera = function () {

	console.warn( 'DEPRECATED: PathCamera() is PathControls().' );

};
THREE.FlyCamera = function () {

	console.warn( 'DEPRECATED: FlyCamera() is FlyControls().' );

};
THREE.RollCamera = function () {

	console.warn( 'DEPRECATED: RollCamera() is RollControls().' );

};
THREE.TrackballCamera = function () {

	console.warn( 'DEPRECATED: TrackballCamera() is TrackballControls().' );

};
/*
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog 
 * 
 *	A handy general perpose camera, for setting FOV, Lens Focal Length,  
 *		and switching between perspective and orthographic views easily.
 *
 */


THREE.CombinedCamera = function ( width, height, fov, near, far, orthonear, orthofar ) {

	THREE.Camera.call( this );

	// We could also handle the projectionMatrix internally, but just wanted to test nested camera objects
	this.cameraO = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 	orthonear, orthofar );
	this.cameraP = new THREE.PerspectiveCamera( fov, width/height, near, far );

	this.toPerspective();

};

THREE.CombinedCamera.prototype = new THREE.Camera();
THREE.CombinedCamera.prototype.constructor = THREE.CoolCamera;

THREE.CombinedCamera.prototype.toPerspective = function () {

	this.near = this.cameraP.near;
	this.far = this.cameraP.far;
	this.projectionMatrix = this.cameraP.projectionMatrix;

};

THREE.CombinedCamera.prototype.toOrthographic = function () {

	this.near = this.cameraO.near;
	this.far = this.cameraO.far;
	this.projectionMatrix = this.cameraO.projectionMatrix;

};

THREE.CombinedCamera.prototype.setFov = function(fov) {

	this.cameraP.fov = fov;
	this.cameraP.updateProjectionMatrix();
	this.toPerspective();

};

/*
* Uses Focal Length (in mm) to estimate and set FOV
* 35mm (fullframe) camera is used if frame size is not specified;
* Formula based on http://www.bobatkins.com/photography/technical/field_of_view.html
*/
THREE.CombinedCamera.prototype.setLens = function(focalLength, framesize) {

	if (!framesize) framesize = 43.25; // 36x24mm

	var fov = 2 * Math.atan( framesize / (focalLength * 2));
	fov = 180 / Math.PI * fov;
	this.setFov(fov);

	return fov;
};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, domElement ) {

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;

	this.noFly = false;
	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.lastUpdate = new Date().getTime();
	this.tdiff = 0;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.freeze = false;

	this.mouseDragOn = false;

	if ( this.domElement === document ) {

		this.viewHalfX = window.innerWidth / 2;
		this.viewHalfY = window.innerHeight / 2;

	} else {

		this.viewHalfX = this.domElement.offsetWidth / 2;
		this.viewHalfY = this.domElement.offsetHeight / 2;
		this.domElement.setAttribute( 'tabindex', -1 );

	}

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;

			}

		}

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.mouseDragOn = false;

	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;

		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}

	};

	this.onKeyDown = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

			case 81: this.freeze = !this.freeze; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

		}

	};

	this.update = function() {

		var now = new Date().getTime();
		this.tdiff = ( now - this.lastUpdate ) / 1000;
		this.lastUpdate = now;

		if ( !this.freeze ) {


			if ( this.heightSpeed ) {

				var y = clamp( this.object.position.y, this.heightMin, this.heightMax );
				var delta = y - this.heightMin;

				this.autoSpeedFactor = this.tdiff * ( delta * this.heightCoef );

			} else {

				this.autoSpeedFactor = 0.0;

			}

			var actualMoveSpeed = this.tdiff * this.movementSpeed;

			if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
			if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

			if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
			if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

			if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
			if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

			var actualLookSpeed = this.tdiff * this.lookSpeed;

			if ( !this.activeLook ) {

				actualLookSpeed = 0;

			}

			this.lon += this.mouseX * actualLookSpeed;
			if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed;

			this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
			this.phi = ( 90 - this.lat ) * Math.PI / 180;
			this.theta = this.lon * Math.PI / 180;

			var targetPosition = this.target,
				position = this.object.position;

			targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
			targetPosition.y = position.y + 100 * Math.cos( this.phi );
			targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		}

		var verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}

		this.lon += this.mouseX * actualLookSpeed;
		if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = ( 90 - this.lat ) * Math.PI / 180;

		this.theta = this.lon * Math.PI / 180;

		if ( this.constrainVertical ) {

			this.phi = map_linear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( targetPosition );

	};


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
	this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
	this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	function map_linear( x, sa, sb, ea, eb ) {

		return ( x  - sa ) * ( eb - ea ) / ( sb - sa ) + ea;

	};

	function clamp_bottom( x, a ) {

		return x < a ? a : x;

	};

	function clamp( x, a, b ) {

		return x < a ? a : ( x > b ? b : x );

	};

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.PathControls = function ( object, domElement ) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.id = "PathControls" + THREE.PathControlsIdCounter ++;

	// API

	this.duration = 10 * 1000; // milliseconds
	this.waypoints = [];

	this.useConstantSpeed = true;
	this.resamplingCoef = 50;

	this.debugPath = new THREE.Object3D();
	this.debugDummy = new THREE.Object3D();

	this.animationParent = new THREE.Object3D();

	this.lookSpeed = 0.005;
	this.lookVertical = true;
	this.lookHorizontal = true;
	this.verticalAngleMap   = { srcRange: [ 0, 2 * Math.PI ], dstRange: [ 0, 2 * Math.PI ] };
	this.horizontalAngleMap = { srcRange: [ 0, 2 * Math.PI ], dstRange: [ 0, 2 * Math.PI ] };

	// internals

	this.target = new THREE.Object3D();

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;

	this.phi = 0;
	this.theta = 0;

	if ( this.domElement === document ) {

		this.viewHalfX = window.innerWidth / 2;
		this.viewHalfY = window.innerHeight / 2;

	} else {

		this.viewHalfX = this.domElement.offsetWidth / 2;
		this.viewHalfY = this.domElement.offsetHeight / 2;
		this.domElement.setAttribute( 'tabindex', -1 );

	}

	var PI2 = Math.PI * 2,
		PI180 = Math.PI / 180;

	// methods

	this.update = function () {

		var srcRange, dstRange;

		if( this.lookHorizontal ) this.lon += this.mouseX * this.lookSpeed;
		if( this.lookVertical )   this.lat -= this.mouseY * this.lookSpeed;

		this.lon = Math.max( 0, Math.min( 360, this.lon ) );
		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );

		this.phi = ( 90 - this.lat ) * PI180;
		this.theta = this.lon * PI180;

		this.phi = normalize_angle_rad( this.phi );

		// constrain vertical look angle

		srcRange = this.verticalAngleMap.srcRange;
		dstRange = this.verticalAngleMap.dstRange;

		var tmpPhi = map_linear( this.phi, srcRange[ 0 ], srcRange[ 1 ], dstRange[ 0 ], dstRange[ 1 ] );
		var tmpPhiFullRange = dstRange[ 1 ] - dstRange[ 0 ];
		var tmpPhiNormalized = ( tmpPhi - dstRange[ 0 ] ) / tmpPhiFullRange;

		this.phi = QuadraticEaseInOut( tmpPhiNormalized ) * tmpPhiFullRange + dstRange[ 0 ];

		// constrain horizontal look angle

		srcRange = this.horizontalAngleMap.srcRange;
		dstRange = this.horizontalAngleMap.dstRange;

		var tmpTheta = map_linear( this.theta, srcRange[ 0 ], srcRange[ 1 ], dstRange[ 0 ], dstRange[ 1 ] );
		var tmpThetaFullRange = dstRange[ 1 ] - dstRange[ 0 ];
		var tmpThetaNormalized = ( tmpTheta - dstRange[ 0 ] ) / tmpThetaFullRange;

		this.theta = QuadraticEaseInOut( tmpThetaNormalized ) * tmpThetaFullRange + dstRange[ 0 ];

		var targetPosition = this.target.position,
			position = this.object.position;

		targetPosition.x = 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = 100 * Math.cos( this.phi );
		targetPosition.z = 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( this.target.position );

	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;

		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}

	};

	// utils

	function normalize_angle_rad( a ) {

		var b = a % PI2;
		return b >= 0 ? b : b + PI2;

	};

	function cap( x, a, b ) {

		return ( x < a ) ? a : ( ( x > b ) ? b : x );

	};

	function map_linear( x, sa, sb, ea, eb ) {

		return ( x  - sa ) * ( eb - ea ) / ( sb - sa ) + ea;

	};

	function distance( a, b ) {

		var dx = a[ 0 ] - b[ 0 ],
			dy = a[ 1 ] - b[ 1 ],
			dz = a[ 2 ] - b[ 2 ];

		return Math.sqrt( dx * dx + dy * dy + dz * dz );

	};

	function QuadraticEaseInOut ( k ) {

		if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
		return - 0.5 * ( --k * ( k - 2 ) - 1 );

	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	function initAnimationPath( parent, spline, name, duration ) {

		var animationData = {

		   name: name,
		   fps: 0.6,
		   length: duration,

		   hierarchy: []

		};

		var i,
			parentAnimation, childAnimation,
			path = spline.getControlPointsArray(),
			sl = spline.getLength(),
			pl = path.length,
			t = 0,
			first = 0,
			last  = pl - 1;

		parentAnimation = { parent: -1, keys: [] };
		parentAnimation.keys[ first ] = { time: 0,        pos: path[ first ], rot: [ 0, 0, 0, 1 ], scl: [ 1, 1, 1 ] };
		parentAnimation.keys[ last  ] = { time: duration, pos: path[ last ],  rot: [ 0, 0, 0, 1 ], scl: [ 1, 1, 1 ] };

		for ( i = 1; i < pl - 1; i++ ) {

			// real distance (approximation via linear segments)

			t = duration * sl.chunks[ i ] / sl.total;

			// equal distance

			//t = duration * ( i / pl );

			// linear distance

			//t += duration * distance( path[ i ], path[ i - 1 ] ) / sl.total;

			parentAnimation.keys[ i ] = { time: t, pos: path[ i ] };

		}

		animationData.hierarchy[ 0 ] = parentAnimation;

		THREE.AnimationHandler.add( animationData );

		return new THREE.Animation( parent, name, THREE.AnimationHandler.CATMULLROM_FORWARD, false );

	};


	function createSplineGeometry( spline, n_sub ) {

		var i, index, position,
			geometry = new THREE.Geometry();

		for ( i = 0; i < spline.points.length * n_sub; i ++ ) {

			index = i / ( spline.points.length * n_sub );
			position = spline.getPoint( index );

			geometry.vertices[ i ] = new THREE.Vertex( new THREE.Vector3( position.x, position.y, position.z ) );

		}

		return geometry;

	};

	function createPath( parent, spline ) {

		var lineGeo = createSplineGeometry( spline, 10 ),
			particleGeo = createSplineGeometry( spline, 10 ),
			lineMat = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 3 } );
			lineObj = new THREE.Line( lineGeo, lineMat );
			particleObj = new THREE.ParticleSystem( particleGeo, new THREE.ParticleBasicMaterial( { color: 0xffaa00, size: 3 } ) );

		lineObj.scale.set( 1, 1, 1 );
		parent.add( lineObj );

		particleObj.scale.set( 1, 1, 1 );
		parent.add( particleObj );

		var waypoint,
			geo = new THREE.SphereGeometry( 1, 16, 8 ),
			mat = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

		for ( i = 0; i < spline.points.length; i++ ) {

			waypoint = new THREE.Mesh( geo, mat );
			waypoint.position.copy( spline.points[ i ] );
			parent.add( waypoint );

		}

	};

	this.init = function ( ) {

		// constructor

		this.spline = new THREE.Spline();
		this.spline.initFromArray( this.waypoints );

		if ( this.useConstantSpeed ) {

			this.spline.reparametrizeByArcLength( this.resamplingCoef );

		}

		if ( this.createDebugDummy ) {

			var dummyParentMaterial = new THREE.MeshLambertMaterial( { color: 0x0077ff } ),
			dummyChildMaterial  = new THREE.MeshLambertMaterial( { color: 0x00ff00 } ),
			dummyParentGeo = new THREE.CubeGeometry( 10, 10, 20 ),
			dummyChildGeo  = new THREE.CubeGeometry( 2, 2, 10 );

			this.animationParent = new THREE.Mesh( dummyParentGeo, dummyParentMaterial );

			var dummyChild = new THREE.Mesh( dummyChildGeo, dummyChildMaterial );
			dummyChild.position.set( 0, 10, 0 );

			this.animation = initAnimationPath( this.animationParent, this.spline, this.id, this.duration );

			this.animationParent.add( this.object );
			this.animationParent.add( this.target );
			this.animationParent.add( dummyChild );

		} else {

			this.animation = initAnimationPath( this.animationParent, this.spline, this.id, this.duration );
			this.animationParent.add( this.target );
			this.animationParent.add( this.object );

		}

		if ( this.createDebugPath ) {

			createPath( this.debugPath, this.spline );

		}

		this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );

	};

};

THREE.PathControlsIdCounter = 0;
/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */

THREE.FlyControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', -1 );

	// API

	this.movementSpeed = 1.0;
	this.rollSpeed = 0.005;

	this.dragToLook = false;
	this.autoForward = false;

	// disable default target object behavior

	this.object.useQuaternion = true;

	// internals

	this.tmpQuaternion = new THREE.Quaternion();

	this.mouseStatus = 0;

	this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );

	this.lastUpdate = -1;
	this.tdiff = 0;

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.keydown = function( event ) {

		if ( event.altKey ) {

			return;

		}

		switch( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = .1; break;

			case 87: /*W*/ this.moveState.forward = 1; break;
			case 83: /*S*/ this.moveState.back = 1; break;

			case 65: /*A*/ this.moveState.left = 1; break;
			case 68: /*D*/ this.moveState.right = 1; break;

			case 82: /*R*/ this.moveState.up = 1; break;
			case 70: /*F*/ this.moveState.down = 1; break;

			case 38: /*up*/ this.moveState.pitchUp = 1; break;
			case 40: /*down*/ this.moveState.pitchDown = 1; break;

			case 37: /*left*/ this.moveState.yawLeft = 1; break;
			case 39: /*right*/ this.moveState.yawRight = 1; break;

			case 81: /*Q*/ this.moveState.rollLeft = 1; break;
			case 69: /*E*/ this.moveState.rollRight = 1; break;

		}

		this.updateMovementVector();
		this.updateRotationVector();

	};

	this.keyup = function( event ) {

		switch( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = 1; break;

			case 87: /*W*/ this.moveState.forward = 0; break;
			case 83: /*S*/ this.moveState.back = 0; break;

			case 65: /*A*/ this.moveState.left = 0; break;
			case 68: /*D*/ this.moveState.right = 0; break;

			case 82: /*R*/ this.moveState.up = 0; break;
			case 70: /*F*/ this.moveState.down = 0; break;

			case 38: /*up*/ this.moveState.pitchUp = 0; break;
			case 40: /*down*/ this.moveState.pitchDown = 0; break;

			case 37: /*left*/ this.moveState.yawLeft = 0; break;
			case 39: /*right*/ this.moveState.yawRight = 0; break;

			case 81: /*Q*/ this.moveState.rollLeft = 0; break;
			case 69: /*E*/ this.moveState.rollRight = 0; break;

		}

		this.updateMovementVector();
		this.updateRotationVector();

	};

	this.mousedown = function( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.dragToLook ) {

			this.mouseStatus ++;

		} else {

			switch ( event.button ) {

				case 0: this.object.moveForward = true; break;
				case 2: this.object.moveBackward = true; break;

			}

		}

	};

	this.mousemove = function( event ) {

		if ( !this.dragToLook || this.mouseStatus > 0 ) {

			var container = this.getContainerDimensions();
			var halfWidth  = container.size[ 0 ] / 2;
			var halfHeight = container.size[ 1 ] / 2;

			this.moveState.yawLeft   = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
			this.moveState.pitchDown =   ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

			this.updateRotationVector();

		}

	};

	this.mouseup = function( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.dragToLook ) {

			this.mouseStatus --;

			this.moveState.yawLeft = this.moveState.pitchDown = 0;

		} else {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.updateRotationVector();

	};

	this.update = function( parentMatrixWorld, forceUpdate, camera ) {

		var now = new Date().getTime();

		if ( this.lastUpdate == -1 ) this.lastUpdate = now;

		this.tdiff = ( now - this.lastUpdate ) / 1000;
		this.lastUpdate = now;

		var moveMult = this.tdiff * this.movementSpeed;
		var rotMult = this.tdiff * this.rollSpeed;

		this.object.translateX( this.moveVector.x * moveMult );
		this.object.translateY( this.moveVector.y * moveMult );
		this.object.translateZ( this.moveVector.z * moveMult );

		this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
		this.object.quaternion.multiplySelf( this.tmpQuaternion );

		this.object.matrix.setPosition( this.object.position );
		this.object.matrix.setRotationFromQuaternion( this.object.quaternion );
		this.object.matrixWorldNeedsUpdate = true;


	};

	this.updateMovementVector = function() {

		var forward = ( this.moveState.forward || ( this.autoForward && !this.moveState.back ) ) ? 1 : 0;

		this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
		this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
		this.moveVector.z = ( -forward + this.moveState.back );

		//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

	};

	this.updateRotationVector = function() {

		this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
		this.rotationVector.y = ( -this.moveState.yawRight  + this.moveState.yawLeft );
		this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

		//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

	};

	this.getContainerDimensions = function() {

		if ( this.domElement != document ) {

			return {
				size	: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
				offset	: [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
			};

		} else {

			return {
				size	: [ window.innerWidth, window.innerHeight ],
				offset	: [ 0, 0 ]
			};

		}

	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.domElement.addEventListener( 'mousemove', bind( this, this.mousemove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.mousedown ), false );
	this.domElement.addEventListener( 'mouseup',   bind( this, this.mouseup ), false );

	this.domElement.addEventListener( 'keydown', bind( this, this.keydown ), false );
	this.domElement.addEventListener( 'keyup',   bind( this, this.keyup ), false );

	this.updateMovementVector();
	this.updateRotationVector();

};
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.RollControls = function ( object, domElement ) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.mouseLook = true;
	this.autoForward = false;

	this.lookSpeed = 1;
	this.movementSpeed = 1;
	this.rollSpeed = 1;

	this.constrainVertical = [ -0.9, 0.9 ];

	// disable default target object behavior

	this.object.matrixAutoUpdate = false;

	// internals

	this.forward = new THREE.Vector3( 0, 0, 1 );
	this.roll = 0;

	this.lastUpdate = -1;
	this.delta = 0;

	var xTemp = new THREE.Vector3();
	var yTemp = new THREE.Vector3();
	var zTemp = new THREE.Vector3();
	var rollMatrix = new THREE.Matrix4();

	var doRoll = false, rollDirection = 1, forwardSpeed = 0, sideSpeed = 0, upSpeed = 0;

	var mouseX = 0, mouseY = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	// custom update

	this.update = function() {

		var now = new Date().getTime();

		if ( this.lastUpdate == -1 ) this.lastUpdate = now;

		this.delta = ( now - this.lastUpdate ) / 1000;
		this.lastUpdate = now;

		if ( this.mouseLook ) {

			var actualLookSpeed = this.delta * this.lookSpeed;

			this.rotateHorizontally( actualLookSpeed * mouseX );
			this.rotateVertically( actualLookSpeed * mouseY );

		}

		var actualSpeed = this.delta * this.movementSpeed;
		var forwardOrAuto = ( forwardSpeed > 0 || ( this.autoForward && ! ( forwardSpeed < 0 ) ) ) ? 1 : forwardSpeed;

		this.object.translateZ( -actualSpeed * forwardOrAuto );
		this.object.translateX( actualSpeed * sideSpeed );
		this.object.translateY( actualSpeed * upSpeed );

		if( doRoll ) {

			this.roll += this.rollSpeed * this.delta * rollDirection;

		}

		// cap forward up / down

		if( this.forward.y > this.constrainVertical[ 1 ] ) {

			this.forward.y = this.constrainVertical[ 1 ];
			this.forward.normalize();

		} else if( this.forward.y < this.constrainVertical[ 0 ] ) {

			this.forward.y = this.constrainVertical[ 0 ];
			this.forward.normalize();

		}


		// construct unrolled camera matrix

		zTemp.copy( this.forward );
		yTemp.set( 0, 1, 0 );

		xTemp.cross( yTemp, zTemp ).normalize();
		yTemp.cross( zTemp, xTemp ).normalize();

		this.object.matrix.n11 = xTemp.x; this.object.matrix.n12 = yTemp.x; this.object.matrix.n13 = zTemp.x;
		this.object.matrix.n21 = xTemp.y; this.object.matrix.n22 = yTemp.y; this.object.matrix.n23 = zTemp.y;
		this.object.matrix.n31 = xTemp.z; this.object.matrix.n32 = yTemp.z; this.object.matrix.n33 = zTemp.z;

		// calculate roll matrix

		rollMatrix.identity();
		rollMatrix.n11 = Math.cos( this.roll ); rollMatrix.n12 = -Math.sin( this.roll );
		rollMatrix.n21 = Math.sin( this.roll ); rollMatrix.n22 =  Math.cos( this.roll );

		// multiply camera with roll

		this.object.matrix.multiplySelf( rollMatrix );
		this.object.matrixWorldNeedsUpdate = true;

		// set position

		this.object.matrix.n14 = this.object.position.x;
		this.object.matrix.n24 = this.object.position.y;
		this.object.matrix.n34 = this.object.position.z;


	};

	this.translateX = function ( distance ) {

		this.object.position.x += this.object.matrix.n11 * distance;
		this.object.position.y += this.object.matrix.n21 * distance;
		this.object.position.z += this.object.matrix.n31 * distance;

	};

	this.translateY = function ( distance ) {

		this.object.position.x += this.object.matrix.n12 * distance;
		this.object.position.y += this.object.matrix.n22 * distance;
		this.object.position.z += this.object.matrix.n32 * distance;

	};

	this.translateZ = function ( distance ) {

		this.object.position.x -= this.object.matrix.n13 * distance;
		this.object.position.y -= this.object.matrix.n23 * distance;
		this.object.position.z -= this.object.matrix.n33 * distance;

	};


	this.rotateHorizontally = function ( amount ) {

		// please note that the amount is NOT degrees, but a scale value

		xTemp.set( this.object.matrix.n11, this.object.matrix.n21, this.object.matrix.n31 );
		xTemp.multiplyScalar( amount );

		this.forward.subSelf( xTemp );
		this.forward.normalize();

	};

	this.rotateVertically = function ( amount ) {

		// please note that the amount is NOT degrees, but a scale value

		yTemp.set( this.object.matrix.n12, this.object.matrix.n22, this.object.matrix.n32 );
		yTemp.multiplyScalar( amount );

		this.forward.addSelf( yTemp );
		this.forward.normalize();

	};

	function onKeyDown( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ forwardSpeed = 1; break;

			case 37: /*left*/
			case 65: /*A*/ sideSpeed = -1; break;

			case 40: /*down*/
			case 83: /*S*/ forwardSpeed = -1; break;

			case 39: /*right*/
			case 68: /*D*/ sideSpeed = 1; break;

			case 81: /*Q*/ doRoll = true; rollDirection = 1; break;
			case 69: /*E*/ doRoll = true; rollDirection = -1; break;

			case 82: /*R*/ upSpeed = 1; break;
			case 70: /*F*/ upSpeed = -1; break;

		}

	};

	function onKeyUp( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ forwardSpeed = 0; break;

			case 37: /*left*/
			case 65: /*A*/ sideSpeed = 0; break;

			case 40: /*down*/
			case 83: /*S*/ forwardSpeed = 0; break;

			case 39: /*right*/
			case 68: /*D*/ sideSpeed = 0; break;

			case 81: /*Q*/ doRoll = false; break;
			case 69: /*E*/ doRoll = false; break;

			case 82: /*R*/ upSpeed = 0; break;
			case 70: /*F*/ upSpeed = 0; break;

		}

	};

	function onMouseMove( event ) {

		mouseX = ( event.clientX - windowHalfX ) / window.innerWidth;
		mouseY = ( event.clientY - windowHalfY ) / window.innerHeight;

	};

	function onMouseDown ( event ) {

		event.preventDefault();
		event.stopPropagation();

		switch ( event.button ) {

			case 0: forwardSpeed = 1; break;
			case 2: forwardSpeed = -1; break;

		}

	};

	function onMouseUp ( event ) {

		event.preventDefault();
		event.stopPropagation();

		switch ( event.button ) {

			case 0: forwardSpeed = 0; break;
			case 2: forwardSpeed = 0; break;

		}

	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', onMouseMove, false );
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mouseup', onMouseUp, false );
	this.domElement.addEventListener( 'keydown', onKeyDown, false );
	this.domElement.addEventListener( 'keyup', onKeyUp, false );

};
/**
 * @author Eberhard Graether / http://egraether.com/
 */

THREE.TrackballControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.screen = { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0 };
	this.radius = ( this.screen.width + this.screen.height ) / 4;

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noZoom = false;
	this.noPan = false;

	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

	// internals

	this.target = new THREE.Vector3( 0, 0, 0 );

	var _keyPressed = false,
	_state = this.STATE.NONE,

	_eye = new THREE.Vector3(),

	_rotateStart = new THREE.Vector3(),
	_rotateEnd = new THREE.Vector3(),

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();


	// methods

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.getMouseOnScreen = function( clientX, clientY ) {

		return new THREE.Vector2(
			( clientX - this.screen.offsetLeft ) / this.radius * 0.5,
			( clientY - this.screen.offsetTop ) / this.radius * 0.5
		);

	};

	this.getMouseProjectionOnBall = function( clientX, clientY ) {

		var mouseOnBall = new THREE.Vector3(
			( clientX - this.screen.width * 0.5 - this.screen.offsetLeft ) / this.radius,
			( this.screen.height * 0.5 + this.screen.offsetTop - clientY ) / this.radius,
			0.0
		);

		var length = mouseOnBall.length();

		if ( length > 1.0 ) {

			mouseOnBall.normalize();

		} else {

			mouseOnBall.z = Math.sqrt( 1.0 - length * length );

		}

		_eye.copy( this.object.position ).subSelf( this.target );

		var projection = this.object.up.clone().setLength( mouseOnBall.y );
		projection.addSelf( this.object.up.clone().crossSelf( _eye ).setLength( mouseOnBall.x ) );
		projection.addSelf( _eye.setLength( mouseOnBall.z ) );

		return projection;

	};

	this.rotateCamera = function() {

		var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

		if ( angle ) {

			var axis = ( new THREE.Vector3() ).cross( _rotateStart, _rotateEnd ).normalize(),
				quaternion = new THREE.Quaternion();

			angle *= this.rotateSpeed;

			quaternion.setFromAxisAngle( axis, -angle );

			quaternion.multiplyVector3( _eye );
			quaternion.multiplyVector3( this.object.up );

			quaternion.multiplyVector3( _rotateEnd );

			if ( this.staticMoving ) {

				_rotateStart = _rotateEnd;

			} else {

				quaternion.setFromAxisAngle( axis, angle * ( this.dynamicDampingFactor - 1.0 ) );
				quaternion.multiplyVector3( _rotateStart );

			}

		}

	};

	this.zoomCamera = function() {

		var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * this.zoomSpeed;

		if ( factor !== 1.0 && factor > 0.0 ) {

			_eye.multiplyScalar( factor );

			if ( this.staticMoving ) {

				_zoomStart = _zoomEnd;

			} else {

				_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

			}

		}

	};

	this.panCamera = function() {

		var mouseChange = _panEnd.clone().subSelf( _panStart );

		if ( mouseChange.lengthSq() ) {

			mouseChange.multiplyScalar( _eye.length() * this.panSpeed );

			var pan = _eye.clone().crossSelf( this.object.up ).setLength( mouseChange.x );
			pan.addSelf( this.object.up.clone().setLength( mouseChange.y ) );

			this.object.position.addSelf( pan );
			this.target.addSelf( pan );

			if ( this.staticMoving ) {

				_panStart = _panEnd;

			} else {

				_panStart.addSelf( mouseChange.sub( _panEnd, _panStart ).multiplyScalar( this.dynamicDampingFactor ) );

			}

		}

	};

	this.checkDistances = function() {

		if ( !this.noZoom || !this.noPan ) {

			if ( this.object.position.lengthSq() > this.maxDistance * this.maxDistance ) {

				this.object.position.setLength( this.maxDistance );

			}

			if ( _eye.lengthSq() < this.minDistance * this.minDistance ) {

				this.object.position.add( this.target, _eye.setLength( this.minDistance ) );

			}

		}

	};

	this.update = function() {

		_eye.copy( this.object.position ).subSelf( this.target );

		this.rotateCamera();

		if ( !this.noZoom ) {

			this.zoomCamera();

		}

		if ( !this.noPan ) {

			this.panCamera();

		}

		this.object.position.add( this.target, _eye );

		this.checkDistances();

		this.object.lookAt( this.target );

	};


	// listeners

	function keydown( event ) {

		if ( _state !== this.STATE.NONE ) {

			return;

		} else if ( event.keyCode === this.keys[ this.STATE.ROTATE ] ) {

			_state = this.STATE.ROTATE;

		} else if ( event.keyCode === this.keys[ this.STATE.ZOOM ] && !this.noZoom ) {

			_state = this.STATE.ZOOM;

		} else if ( event.keyCode === this.keys[ this.STATE.PAN ] && !this.noPan ) {

			_state = this.STATE.PAN;

		}

		if ( _state !== this.STATE.NONE ) {

			_keyPressed = true;

		}

	};

	function keyup( event ) {

		if ( _state !== this.STATE.NONE ) {

			_state = this.STATE.NONE;

		}

	};

	function mousedown( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( _state === this.STATE.NONE ) {

			_state = event.button;

			if ( _state === this.STATE.ROTATE ) {

				_rotateStart = _rotateEnd = this.getMouseProjectionOnBall( event.clientX, event.clientY );

			} else if ( _state === this.STATE.ZOOM && !this.noZoom ) {

				_zoomStart = _zoomEnd = this.getMouseOnScreen( event.clientX, event.clientY );

			} else if ( !this.noPan ) {

				_panStart = _panEnd = this.getMouseOnScreen( event.clientX, event.clientY );

			}

		}

	};

	function mousemove( event ) {

		if ( _keyPressed ) {

			_rotateStart = _rotateEnd = this.getMouseProjectionOnBall( event.clientX, event.clientY );
			_zoomStart = _zoomEnd = this.getMouseOnScreen( event.clientX, event.clientY );
			_panStart = _panEnd = this.getMouseOnScreen( event.clientX, event.clientY );

			_keyPressed = false;

		}

		if ( _state === this.STATE.NONE ) {

			return;

		} else if ( _state === this.STATE.ROTATE ) {

			_rotateEnd = this.getMouseProjectionOnBall( event.clientX, event.clientY );

		} else if ( _state === this.STATE.ZOOM && !this.noZoom ) {

			_zoomEnd = this.getMouseOnScreen( event.clientX, event.clientY );

		} else if ( _state === this.STATE.PAN && !this.noPan ) {

			_panEnd = this.getMouseOnScreen( event.clientX, event.clientY );

		}

	};

	function mouseup( event ) {

		event.preventDefault();
		event.stopPropagation();

		_state = this.STATE.NONE;

	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, mousemove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, mousedown ), false );
	this.domElement.addEventListener( 'mouseup',   bind( this, mouseup ), false );

	window.addEventListener( 'keydown', bind( this, keydown ), false );
	window.addEventListener( 'keyup',   bind( this, keyup ), false );

};

THREE.TrackballControls.prototype.STATE = { NONE : -1, ROTATE : 0, ZOOM : 1, PAN : 2 };
/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Cube.as
 */

THREE.CubeGeometry = function ( width, height, depth, segmentsWidth, segmentsHeight, segmentsDepth, materials, sides ) {

	THREE.Geometry.call( this );

	var scope = this,
	width_half = width / 2,
	height_half = height / 2,
	depth_half = depth / 2;

	if ( materials !== undefined ) {

		if ( materials instanceof Array ) {

			this.materials = materials;

		} else {

			this.materials = [];

			for ( var i = 0; i < 6; i ++ ) {

				this.materials.push( [ materials ] );

			}

		}

	} else {

		this.materials = [];

	}

	this.sides = { px: true, nx: true, py: true, ny: true, pz: true, nz: true };

	if( sides != undefined ) {

		for( var s in sides ) {

			if ( this.sides[ s ] != undefined ) {

				this.sides[ s ] = sides[ s ];

			}

		}

	}

	this.sides.px && buildPlane( 'z', 'y', - 1, - 1, depth, height, width_half, this.materials[ 0 ] ); // px
	this.sides.nx && buildPlane( 'z', 'y',   1, - 1, depth, height, - width_half, this.materials[ 1 ] );   // nx
	this.sides.py && buildPlane( 'x', 'z',   1,   1, width, depth, height_half, this.materials[ 2 ] );   // py
	this.sides.ny && buildPlane( 'x', 'z',   1, - 1, width, depth, - height_half, this.materials[ 3 ] ); // ny
	this.sides.pz && buildPlane( 'x', 'y',   1, - 1, width, height, depth_half, this.materials[ 4 ] );   // pz
	this.sides.nz && buildPlane( 'x', 'y', - 1, - 1, width, height, - depth_half, this.materials[ 5 ] ); // nz

	this.mergeVertices();

	function buildPlane( u, v, udir, vdir, width, height, depth, material ) {

		var w, ix, iy,
		gridX = segmentsWidth || 1,
		gridY = segmentsHeight || 1,
		width_half = width / 2,
		height_half = height / 2,
		offset = scope.vertices.length;

		if ( ( u == 'x' && v == 'y' ) || ( u == 'y' && v == 'x' ) ) {

			w = 'z';

		} else if ( ( u == 'x' && v == 'z' ) || ( u == 'z' && v == 'x' ) ) {

			w = 'y';
			gridY = segmentsDepth || 1;

		} else if ( ( u == 'z' && v == 'y' ) || ( u == 'y' && v == 'z' ) ) {

			w = 'x';
			gridX = segmentsDepth || 1;

		}

		var gridX1 = gridX + 1,
		gridY1 = gridY + 1,
		segment_width = width / gridX,
		segment_height = height / gridY;

		for( iy = 0; iy < gridY1; iy++ ) {

			for( ix = 0; ix < gridX1; ix++ ) {

				var vector = new THREE.Vector3();
				vector[ u ] = ( ix * segment_width - width_half ) * udir;
				vector[ v ] = ( iy * segment_height - height_half ) * vdir;
				vector[ w ] = depth;

				scope.vertices.push( new THREE.Vertex( vector ) );

			}

		}

		for( iy = 0; iy < gridY; iy++ ) {

			for( ix = 0; ix < gridX; ix++ ) {

				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * ( iy + 1 );
				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = ( ix + 1 ) + gridX1 * iy;

				scope.faces.push( new THREE.Face4( a + offset, b + offset, c + offset, d + offset, null, null, material ) );
				scope.faceVertexUvs[ 0 ].push( [
							new THREE.UV( ix / gridX, iy / gridY ),
							new THREE.UV( ix / gridX, ( iy + 1 ) / gridY ),
							new THREE.UV( ( ix + 1 ) / gridX, ( iy + 1 ) / gridY ),
							new THREE.UV( ( ix + 1 ) / gridX, iy / gridY )
						] );

			}

		}

	}


	this.computeCentroids();
	this.computeFaceNormals();

};

THREE.CubeGeometry.prototype = new THREE.Geometry();
THREE.CubeGeometry.prototype.constructor = THREE.CubeGeometry;
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.CylinderGeometry = function ( radiusTop, radiusBottom, height, segmentsRadius, segmentsHeight, openEnded ) {

	THREE.Geometry.call( this );

	var radiusTop = radiusTop != null ? radiusTop : 20;
	var radiusBottom = radiusBottom != null ? radiusBottom : 20;
	var height = height || 100;
	var heightHalf = height / 2;
	var segmentsX = segmentsRadius || 8;
	var segmentsY = segmentsHeight || 1;

	var x, y, vertices = [], uvs = [];

	for ( y = 0; y <= segmentsY; y ++ ) {

		var verticesRow = [];
		var uvsRow = [];

		var v = y / segmentsY;
		var radius = v * ( radiusBottom - radiusTop ) + radiusTop;

		for ( x = 0; x <= segmentsX; x ++ ) {

			var u = x / segmentsX;

			var xpos = radius * Math.sin( u * Math.PI * 2 );
			var ypos = - v * height + heightHalf;
			var zpos = radius * Math.cos( u * Math.PI * 2 );

			this.vertices.push( new THREE.Vertex( new THREE.Vector3( xpos, ypos, zpos ) ) );

			verticesRow.push( this.vertices.length - 1 );
			uvsRow.push( new THREE.UV( u, v ) );

		}

		vertices.push( verticesRow );
		uvs.push( uvsRow );

	}

	for ( y = 0; y < segmentsY; y ++ ) {

		for ( x = 0; x < segmentsX; x ++ ) {

			var v1 = vertices[ y ][ x ];
			var v2 = vertices[ y + 1 ][ x ];
			var v3 = vertices[ y + 1 ][ x + 1 ];
			var v4 = vertices[ y ][ x + 1 ];

			// FIXME: These normals aren't right for cones.

			var n1 = this.vertices[ v1 ].position.clone().setY( 0 ).normalize();
			var n2 = this.vertices[ v2 ].position.clone().setY( 0 ).normalize();
			var n3 = this.vertices[ v3 ].position.clone().setY( 0 ).normalize();
			var n4 = this.vertices[ v4 ].position.clone().setY( 0 ).normalize();

			var uv1 = uvs[ y ][ x ].clone();
			var uv2 = uvs[ y + 1 ][ x ].clone();
			var uv3 = uvs[ y + 1 ][ x + 1 ].clone();
			var uv4 = uvs[ y ][ x + 1 ].clone();

			this.faces.push( new THREE.Face4( v1, v2, v3, v4, [ n1, n2, n3, n4 ] ) );
			this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3, uv4 ] );

		}

	}

	// top cap

	if ( !openEnded && radiusTop > 0 ) {

		this.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, heightHalf, 0 ) ) );

		for ( x = 0; x < segmentsX; x ++ ) {

			var v1 = vertices[ 0 ][ x ];
			var v2 = vertices[ 0 ][ x + 1 ];
			var v3 = this.vertices.length - 1;

			var n1 = new THREE.Vector3( 0, 1, 0 );
			var n2 = new THREE.Vector3( 0, 1, 0 );
			var n3 = new THREE.Vector3( 0, 1, 0 );

			var uv1 = uvs[ 0 ][ x ].clone();
			var uv2 = uvs[ 0 ][ x + 1 ].clone();
			var uv3 = new THREE.UV( uv2.u, 0 );

			this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
			this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

		}

	}

	// bottom cap

	if ( !openEnded && radiusBottom > 0 ) {

		this.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, - heightHalf, 0 ) ) );

		for ( x = 0; x < segmentsX; x ++ ) {

			var v1 = vertices[ y ][ x + 1 ];
			var v2 = vertices[ y ][ x ];
			var v3 = this.vertices.length - 1;

			var n1 = new THREE.Vector3( 0, - 1, 0 );
			var n2 = new THREE.Vector3( 0, - 1, 0 );
			var n3 = new THREE.Vector3( 0, - 1, 0 );

			var uv1 = uvs[ y ][ x + 1 ].clone();
			var uv2 = uvs[ y ][ x ].clone();
			var uv3 = new THREE.UV( uv2.u, 1 );

			this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
			this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

		}

	}

	this.computeCentroids();
	this.computeFaceNormals();

}
THREE.CylinderGeometry.prototype = new THREE.Geometry();
THREE.CylinderGeometry.prototype.constructor = THREE.CylinderGeometry;
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Creates extruded geometry from a path shape.
 *
 * parameters = {
 *
 *  size: 			<float>, 	// size of the text
 *  height: 		<float>, 	// thickness to extrude text
 *  curveSegments: 	<int>,		// number of points on the curves
 *  steps: 			<int>,		// number of points for z-side extrusions
 *
 *  font: 			<string>,		// font name
 *  weight: 		<string>,		// font weight (normal, bold)
 *  style: 			<string>,		// font style  (normal, italics)
 *
 *  bevelEnabled:	<bool>,			// turn on bevel
 *  bevelThickness: <float>, 		// how deep into text bevel goes
 *  bevelSize:		<float>, 		// how far from text outline is bevel
 *  bevelSegments:	<int>, 			// number of bevel layers
 *
 *  extrudePath:	<THREE.CurvePath>	// path to extrude shape along
 *  bendPath:		<THREE.CurvePath> 	// path to bend the geometry around
 *
 *  material:		 <THREE.Material>	// material for front and back faces
 *  extrudeMaterial: <THREE.Material>	// material for extrusion and beveled faces
 *
 *  }
  **/

THREE.ExtrudeGeometry = function( shapes, options ) {

	if( typeof( shapes ) == "undefined" ) {

		shapes = [];
		return;

	}

	THREE.Geometry.call( this );

	shapes = shapes instanceof Array ? shapes : [ shapes ];

	var s, sl = shapes.length, shape;

	this.shapebb = shapes[ sl - 1 ].getBoundingBox();

	for ( s = 0; s < sl; s ++ ) {

		shape = shapes[ s ];

		this.addShape( shape, options );

	}


	this.computeCentroids();
	this.computeFaceNormals();

	// can't really use automatic vertex normals
	// as then front and back sides get smoothed too
	// should do separate smoothing just for sides

	//this.computeVertexNormals();

	//console.log( "took", ( Date.now() - startTime ) );

};

THREE.ExtrudeGeometry.prototype = new THREE.Geometry();
THREE.ExtrudeGeometry.prototype.constructor = THREE.ExtrudeGeometry;


THREE.ExtrudeGeometry.prototype.addShape = function( shape, options ) {

	var amount = options.amount !== undefined ? options.amount : 100;

	var bevelThickness = options.bevelThickness !== undefined ? options.bevelThickness : 6; // 10
	var bevelSize = options.bevelSize !== undefined ? options.bevelSize : bevelThickness - 2; // 8
	var bevelSegments = options.bevelSegments !== undefined ? options.bevelSegments : 3;

	var bevelEnabled = options.bevelEnabled !== undefined ? options.bevelEnabled : true; // false

	var curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;

	var steps = options.steps !== undefined ? options.steps : 1;

	var bendPath = options.bendPath;

	var extrudePath = options.extrudePath;
	var extrudePts, extrudeByPath = false;

	var useSpacedPoints = options.useSpacedPoints !== undefined ? options.useSpacedPoints : false;

	var material = options.material;
	var extrudeMaterial = options.extrudeMaterial;

	var shapebb = this.shapebb;
	//shapebb = shape.getBoundingBox();


	if ( extrudePath ) {

		extrudePts = extrudePath.getPoints( curveSegments );
		steps = extrudePts.length;
		extrudeByPath = true;
		bevelEnabled = false; // bevels not supported for path extrusion

	}

	// Safeguards if bevels are not enabled

	if ( !bevelEnabled ) {

		bevelSegments = 0;
		bevelThickness = 0;
		bevelSize = 0;

	}


	// TODO, extrude by path's tangents? also via 3d path?

	// Variables initalization

	var ahole, h, hl; // looping of holes
	var scope = this;
	var bevelPoints = [];

	var shapesOffset = this.vertices.length;


	if ( bendPath ) {

		shape.addWrapPath( bendPath );

	}

	var shapePoints;

	if ( !useSpacedPoints ) {

	  	shapePoints = shape.extractAllPoints( curveSegments ); //

	} else {

		// QN - Would it be better to pass useSpacePoints parameter to shape, just like bendpath ?

		shapePoints = shape.extractAllSpacedPoints( curveSegments ) // for points with equal divisions

	}

    var vertices = shapePoints.shape;
	var holes = shapePoints.holes;

	var reverse = !THREE.Shape.Utils.isClockWise( vertices ) ;

	if ( reverse ) {

		vertices = vertices.reverse();

		// Maybe we should also check if holes are in the opposite direction, just to be safe ...

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];

			if ( THREE.Shape.Utils.isClockWise( ahole ) ) {

				holes[ h ] = ahole.reverse();

			}

		}

		reverse = false; // If vertices are in order now, we shouldn't need to worry about them again (hopefully)!

	}


	var faces = THREE.Shape.Utils.triangulateShape ( vertices, holes );
	//var faces = THREE.Shape.Utils.triangulate2( vertices, holes );

	// Would it be better to move points after triangulation?
	// shapePoints = shape.extractAllPointsWithBend( curveSegments, bendPath );
	// 	vertices = shapePoints.shape;
	// 	holes = shapePoints.holes;

	//console.log(faces);

	////
	///   Handle Vertices
	////

	var contour = vertices; // vertices has all points but contour has only points of circumference

	for ( h = 0, hl = holes.length;  h < hl; h ++ ) {

		ahole = holes[ h ];

		vertices = vertices.concat( ahole );

	}


	var i, il;

	function scalePt2 ( pt, vec, size ) {

		if ( !vec ) console.log( "die" );

		return vec.clone().multiplyScalar( size ).addSelf( pt );

	}

	var b, bs, t, z,
		vert, vlen = vertices.length,
		face, flen = faces.length,
		cont, clen = contour.length;


	//------
	// Find directions for point movement
	//

	var RAD_TO_DEGREES = 180 / Math.PI;


	function getBevelVec( pt_i, pt_j, pt_k ) {

		// Algorithm 2

		return getBevelVec2( pt_i, pt_j, pt_k );

	}

	function getBevelVec1( pt_i, pt_j, pt_k ) {

		var anglea = Math.atan2( pt_j.y - pt_i.y, pt_j.x - pt_i.x );
		var angleb = Math.atan2( pt_k.y - pt_i.y, pt_k.x - pt_i.x );

		if ( anglea > angleb ) {

			angleb += Math.PI * 2;

		}

		anglec = ( anglea + angleb ) / 2;


		//console.log('angle1', anglea * RAD_TO_DEGREES,'angle2', angleb * RAD_TO_DEGREES, 'anglec', anglec *RAD_TO_DEGREES);

		var x = - Math.cos( anglec );
		var y = - Math.sin( anglec );

		var vec = new THREE.Vector2( x, y ); //.normalize();

		return vec;

	}

	function getBevelVec2( pt_i, pt_j, pt_k ) {

		var a = THREE.ExtrudeGeometry.__v1,
			b = THREE.ExtrudeGeometry.__v2,
			v_hat = THREE.ExtrudeGeometry.__v3,
			w_hat = THREE.ExtrudeGeometry.__v4,
			p = THREE.ExtrudeGeometry.__v5,
			q = THREE.ExtrudeGeometry.__v6,
			v, w,
			v_dot_w_hat, q_sub_p_dot_w_hat,
			s, intersection;

		// good reading for line-line intersection
		// http://sputsoft.com/blog/2010/03/line-line-intersection.html

		// define a as vector j->i
		// define b as vectot k->i

		a.set( pt_i.x - pt_j.x, pt_i.y - pt_j.y );
		b.set( pt_i.x - pt_k.x, pt_i.y - pt_k.y );

		// get unit vectors

		v = a.normalize();
		w = b.normalize();

		// normals from pt i

		v_hat.set( -v.y, v.x );
		w_hat.set( w.y, -w.x );

		// pts from i

		p.copy( pt_i ).addSelf( v_hat );
		q.copy( pt_i ).addSelf( w_hat );

		if ( p.equals( q ) ) {

			//console.log("Warning: lines are straight");
			return w_hat.clone();

		}

		// Points from j, k. helps prevents points cross overover most of the time

		p.copy( pt_j ).addSelf( v_hat );
		q.copy( pt_k ).addSelf( w_hat );

		v_dot_w_hat = v.dot( w_hat );
		q_sub_p_dot_w_hat = q.subSelf( p ).dot( w_hat );

		// We should not reach these conditions

		if ( v_dot_w_hat == 0 ) {

			console.log( "Either infinite or no solutions!" );

			if ( q_sub_p_dot_w_hat == 0 ) {

				console.log( "Its finite solutions." );

			} else {

				console.log( "Too bad, no solutions." );

			}

		}

		s = q_sub_p_dot_w_hat / v_dot_w_hat;

		if ( s < 0 ) {

			// in case of emergecy, revert to algorithm 1.

			return getBevelVec1( pt_i, pt_j, pt_k );

		}

		intersection = v.multiplyScalar( s ).addSelf( p );

		return intersection.subSelf( pt_i ).clone(); // Don't normalize!, otherwise sharp corners become ugly

	}

	var contourMovements = [];

	for ( i = 0, il = contour.length, j = il-1, k = i + 1; i < il; i++, j++, k++ ) {

		if ( j == il ) j = 0;
		if ( k == il ) k = 0;

		//  (j)---(i)---(k)
		// console.log('i,j,k', i, j , k)

		var pt_i = contour[ i ];
		var pt_j = contour[ j ];
		var pt_k = contour[ k ];

		contourMovements[ i ]= getBevelVec( contour[ i ], contour[ j ], contour[ k ] );

	}

	var holesMovements = [], oneHoleMovements, verticesMovements = contourMovements.concat();

	for ( h = 0, hl = holes.length; h < hl; h++ ) {

		ahole = holes[ h ];

		oneHoleMovements = [];

		for ( i = 0, il = ahole.length, j = il - 1, k = i + 1; i < il; i++, j++, k++ ) {

			if ( j == il ) j = 0;
			if ( k == il ) k = 0;

			//  (j)---(i)---(k)
			oneHoleMovements[ i ]= getBevelVec( ahole[ i ], ahole[ j ], ahole[ k ] );

		}

		holesMovements.push( oneHoleMovements );
		verticesMovements = verticesMovements.concat( oneHoleMovements );

	}


	// Loop bevelSegments, 1 for the front, 1 for the back

	for ( b = 0; b < bevelSegments; b ++ ) {
	//for ( b = bevelSegments; b > 0; b -- ) {

		t = b / bevelSegments;
		z = bevelThickness * ( 1 - t );

		//z = bevelThickness * t;
		bs = bevelSize * ( Math.sin ( t * Math.PI/2 ) ) ; // curved
		//bs = bevelSize * t ; // linear

		// contract shape

		for ( i = 0, il = contour.length; i < il; i ++ ) {

			vert = scalePt2( contour[ i ], contourMovements[ i ], bs );
			//vert = scalePt( contour[ i ], contourCentroid, bs, false );
			v( vert.x, vert.y,  - z );

		}

		// expand holes

		for ( h = 0, hl = holes.length; h < hl; h++ ) {

			ahole = holes[ h ];
			oneHoleMovements = holesMovements[ h ];

			for ( i = 0, il = ahole.length; i < il; i++ ) {

				vert = scalePt2( ahole[ i ], oneHoleMovements[ i ], bs );
				//vert = scalePt( ahole[ i ], holesCentroids[ h ], bs, true );

				v( vert.x, vert.y,  -z );

			}

		}

	}

	bs = bevelSize;

	// Back facing vertices

	for ( i = 0; i < vlen; i ++ ) {

		vert = bevelEnabled ? scalePt2( vertices[ i ], verticesMovements[ i ], bs ) : vertices[ i ];

		if ( !extrudeByPath ) {

			v( vert.x, vert.y, 0 );

		} else {

			v( vert.x, vert.y + extrudePts[ 0 ].y, extrudePts[ 0 ].x );

		}

	}

	// Add stepped vertices...
	// Including front facing vertices

	var s;

	for ( s = 1; s <= steps; s ++ ) {

		for ( i = 0; i < vlen; i ++ ) {

			vert = bevelEnabled ? scalePt2( vertices[ i ], verticesMovements[ i ], bs ) : vertices[ i ];

			if ( !extrudeByPath ) {

				v( vert.x, vert.y, amount / steps * s );

			} else {

				v( vert.x, vert.y + extrudePts[ s - 1 ].y, extrudePts[ s - 1 ].x );

			}

		}

	}


	// Add bevel segments planes

	//for ( b = 1; b <= bevelSegments; b ++ ) {
	for ( b = bevelSegments - 1; b >= 0; b -- ) {

		t = b / bevelSegments;
		z = bevelThickness * ( 1 - t );
		//bs = bevelSize * ( 1-Math.sin ( ( 1 - t ) * Math.PI/2 ) );
		bs = bevelSize * Math.sin ( t * Math.PI/2 ) ;

		// contract shape

		for ( i = 0, il = contour.length; i < il; i ++ ) {

			vert = scalePt2( contour[ i ], contourMovements[ i ], bs );
			v( vert.x, vert.y,  amount + z );

		}

		// expand holes

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];
			oneHoleMovements = holesMovements[ h ];

			for ( i = 0, il = ahole.length; i < il; i++ ) {

				vert = scalePt2( ahole[ i ], oneHoleMovements[ i ], bs );

				if ( !extrudeByPath ) {

					v( vert.x, vert.y,  amount + z );

				} else {

					v( vert.x, vert.y + extrudePts[ steps - 1 ].y, extrudePts[ steps - 1 ].x + z );

				}

			}

		}

	}


	////
	///   Handle Faces
	////

	// Bottom faces

	if ( bevelEnabled ) {

		var layer = 0 ; // steps + 1
		var offset = vlen * layer;

		for ( i = 0; i < flen; i ++ ) {

			face = faces[ i ];
			f3( face[ 2 ]+ offset, face[ 1 ]+ offset, face[ 0 ] + offset );

		}

		layer = steps + bevelSegments * 2;
		offset = vlen * layer;

		// Top faces

		for ( i = 0; i < flen; i ++ ) {

			face = faces[ i ];
			f3( face[ 0 ] + offset, face[ 1 ] + offset, face[ 2 ] + offset );

		}

	} else {

		for ( i = 0; i < flen; i++ ) {

			face = faces[ i ];
			f3( face[ 2 ], face[ 1 ], face[ 0 ] );

		}

		// Top faces

		for ( i = 0; i < flen; i ++ ) {

			face = faces[ i ];
			f3( face[ 0 ] + vlen * steps, face[ 1 ] + vlen * steps, face[ 2 ] + vlen * steps );

		}

	}

	var tmpPt;
	var j, k, l, m;

	var layeroffset = 0;

	// Sides faces

	sidewalls( contour );
	layeroffset += contour.length;

	for ( h = 0, hl = holes.length;  h < hl; h ++ ) {

		ahole = holes[ h ];
		sidewalls( ahole );

		//, true
		layeroffset += ahole.length;

	}

	// Create faces for the z-sides of the shape

	function sidewalls( contour ) {

		i = contour.length;

		while ( --i >= 0 ) {

			tmpPt = contour[ i ];

			j = i;
			k = i - 1;

			if ( k < 0 ) k = contour.length - 1;

			//console.log('b', i,j, i-1, k,vertices.length);

			var s = 0, sl = steps  + bevelSegments * 2;

			for ( s = 0; s < sl; s ++ ) {

				var slen1 = vlen * s;
				var slen2 = vlen * ( s + 1 );
				var a = layeroffset + j + slen1,
					b = layeroffset + k + slen1,
					c = layeroffset + k + slen2,
					d = layeroffset + j + slen2;

				f4( a, b, c, d );

				if ( extrudeMaterial ) {

					var v1 = s / sl;
					var v2 = ( s + 1 ) / sl;

					var ztol = ( amount + bevelThickness * 2 );

					var u1 = ( scope.vertices[ a ].position.z + bevelThickness ) / ztol;
					var u2 = ( scope.vertices[ d ].position.z + bevelThickness ) / ztol;

					//console.log(vy1, vy2);

					scope.faceVertexUvs[ 0 ].push( [
						new THREE.UV( u1, v1 ),
						new THREE.UV( u2, v1 ),
						new THREE.UV( u2, v2 ),
						new THREE.UV( u1, v2 )
					] );
				}


			}

		}

	}


	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	}

	function f3( a, b, c ) {

		a += shapesOffset;
		b += shapesOffset;
		c += shapesOffset;

		scope.faces.push( new THREE.Face3( a, b, c, null, null, material ) );
		//normal, color, materials

		if ( material ) {

			var mx = shapebb.minX, my = shapebb.minY;

			var uy = shapebb.maxY; // - shapebb.minY;
			var ux = shapebb.maxX; // - shapebb.minX;

			var ax = scope.vertices[ a ].position.x,
				ay = scope.vertices[ a ].position.y,

				bx = scope.vertices[ b ].position.x,
				by = scope.vertices[ b ].position.y,

				cx = scope.vertices[ c ].position.x,
				cy = scope.vertices[ c ].position.y;

			scope.faceVertexUvs[ 0 ].push( [

				new THREE.UV( ax / ux, ay / uy ),
				new THREE.UV( bx / ux, by / uy ),
				new THREE.UV( cx / ux, cy / uy ),

			] );
		}

	}

	function f4( a, b, c, d ) {

		a += shapesOffset;
		b += shapesOffset;
		c += shapesOffset;
		d += shapesOffset;

 		scope.faces.push( new THREE.Face4( a, b, c, d, null, null, extrudeMaterial ) );

	}

};


THREE.ExtrudeGeometry.__v1 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v2 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v3 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v4 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v5 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v6 = new THREE.Vector2();/**
 * @author oosmoxiecode

 * uvs are messed up in this one, and commented away for now. There is an ugly "seam" by the shared vertices
 * when it "wraps" around, that needs to be fixed. It�s because they share the first and the last vertices
 * so it draws the entire texture on the seam-faces, I think...
 */

THREE.IcosahedronGeometry = function ( subdivisions ) {

	var scope = this;
	var tempScope = new THREE.Geometry();
	var tempFaces;
	this.subdivisions = subdivisions || 0;

	//var temp_uv = [];

	THREE.Geometry.call(this);

	// create 12 vertices of a Icosahedron
	var t = (1 + Math.sqrt(5)) / 2;

	v(-1,  t,  0);
	v( 1,  t,  0);
	v(-1, -t,  0);
	v( 1, -t,  0);

	v( 0, -1,  t);
	v( 0,  1,  t);
	v( 0, -1, -t);
	v( 0,  1, -t);

	v( t,  0, -1);
	v( t,  0,  1);
	v(-t,  0, -1);
	v(-t,  0,  1);

	// 5 faces around point 0
	f3(0, 11, 5, tempScope);
	f3(0, 5, 1, tempScope);
	f3(0, 1, 7, tempScope);
	f3(0, 7, 10, tempScope);
	f3(0, 10, 11, tempScope);

	// 5 adjacent faces
	f3(1, 5, 9, tempScope);
	f3(5, 11, 4, tempScope);
	f3(11, 10, 2, tempScope);
	f3(10, 7, 6, tempScope);
	f3(7, 1, 8, tempScope);

	// 5 faces around point 3
	f3(3, 9, 4, tempScope);
	f3(3, 4, 2, tempScope);
	f3(3, 2, 6, tempScope);
	f3(3, 6, 8, tempScope);
	f3(3, 8, 9, tempScope);

	// 5 adjacent faces
	f3(4, 9, 5, tempScope);
	f3(2, 4, 11, tempScope);
	f3(6, 2, 10, tempScope);
	f3(8, 6, 7, tempScope);
	f3(9, 8, 1, tempScope);

	// subdivide faces to refine the triangles
	for (var i=0; i < this.subdivisions; i++) {
		tempFaces = new THREE.Geometry();
		for (var tri in tempScope.faces) {
			// replace each triangle by 4 triangles
			var a = getMiddlePoint(tempScope.faces[tri].a, tempScope.faces[tri].b);
			var b = getMiddlePoint(tempScope.faces[tri].b, tempScope.faces[tri].c);
			var c = getMiddlePoint(tempScope.faces[tri].c, tempScope.faces[tri].a);

			f3(tempScope.faces[tri].a, a, c, tempFaces);
			f3(tempScope.faces[tri].b, b, a, tempFaces);
			f3(tempScope.faces[tri].c, c, b, tempFaces);
			f3(a, b, c, tempFaces);
		}
		tempScope.faces = tempFaces.faces;
		//tempScope.uvs = tempFaces.uvs;
	}

	scope.faces = tempScope.faces;
	//scope.uvs = tempScope.uvs;

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

	function v( x, y, z ) {
		var length = Math.sqrt(x * x + y * y + z * z);
		var i = scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x/length, y/length, z/length ) ) );

		//var uv = getUv(x, y, z);
		//temp_uv.push(uv);

		return i-1;
	}

	function f3( a, b, c, inscope ) {
		inscope.faces.push( new THREE.Face3( a, b, c ) );

		/*inscope.uvs.push( [new THREE.UV( temp_uv[a].u, temp_uv[a].v ),
						   new THREE.UV( temp_uv[b].u, temp_uv[b].v ),
						   new THREE.UV( temp_uv[c].u, temp_uv[c].v )
						  ] );
		*/
	}

	function getMiddlePoint(p1,p2) {
		var pos1 = scope.vertices[p1].position;
		var pos2 = scope.vertices[p2].position;

		var x = (pos1.x + pos2.x) / 2;
		var y = (pos1.y + pos2.y) / 2;
		var z = (pos1.z + pos2.z) / 2;

		var i = v(x, y, z);
		return i;
	}

	/*function getUv(x,y,z) {

		var u,v;
		var px,py,pz,d;

		d = Math.sqrt( x*x+y*y+z*z );

		px = x/d;
		py = y/d;
		pz = z/d;

		var normalisedX = 0;
		var normalisedZ = -1;

		if (((px * px) + (pz * pz)) > 0) {
			normalisedX = Math.sqrt((px * px) / ((px * px) + (pz * pz)));

			if (px < 0) {
				normalisedX = -normalisedX;
			}

			normalisedZ = Math.sqrt((pz * pz) / ((px * px) + (pz * pz)));

			if (pz < 0)	{
				normalisedZ = -normalisedZ;
			}
		}

		if (normalisedZ == 0) {
			u = ((normalisedX * Math.PI) / 2);
		} else {
			u = Math.atan(normalisedX / normalisedZ);

			if (normalisedZ < 0) {
				u += Math.PI;
			}
		}

		if (u < 0) {
			u += 2 * Math.PI;
		}

		u /= 2 * Math.PI;
		v = (-py + 1) / 2;

		return {u:u,v:v};
	}*/

}

THREE.IcosahedronGeometry.prototype = new THREE.Geometry();
THREE.IcosahedronGeometry.prototype.constructor = THREE.IcosahedronGeometry;
/**
 * @author astrodud / http://astrodud.isgreat.org/
 */

THREE.LatheGeometry = function ( points, steps, angle ) {

	THREE.Geometry.call( this );

	this.steps = steps || 12;
	this.angle = angle || 2 * Math.PI;

	var stepSize = this.angle / this.steps,
	newV = [], oldInds = [], newInds = [], startInds = [],
	matrix = new THREE.Matrix4().setRotationZ( stepSize );

	for ( var j = 0; j < points.length; j ++ ) {

		this.vertices.push( new THREE.Vertex( points[ j ] ) );

		newV[ j ] = points[ j ].clone();
		oldInds[ j ] = this.vertices.length - 1;

	}

	for ( var r = 0; r <= this.angle + 0.001; r += stepSize ) { // need the +0.001 for it go up to angle

		for ( var j = 0; j < newV.length; j ++ ) {

			if ( r < this.angle ) {

				newV[ j ] = matrix.multiplyVector3( newV[ j ].clone() );
				this.vertices.push( new THREE.Vertex( newV[ j ] ) );
				newInds[ j ] = this.vertices.length - 1;

			} else {

				newInds = startInds; // wrap it up!

			}

		}

		if ( r == 0 ) startInds = oldInds;

		for ( var j = 0; j < oldInds.length - 1; j ++ ) {

			this.faces.push( new THREE.Face4( newInds[ j ], newInds[ j + 1 ], oldInds[ j + 1 ], oldInds[ j ] ) );
			this.faceVertexUvs[ 0 ].push( [

				new THREE.UV( 1 - r / this.angle, j / points.length ),
				new THREE.UV( 1 - r / this.angle, ( j + 1 ) / points.length ),
				new THREE.UV( 1 - ( r - stepSize ) / this.angle, ( j + 1 ) / points.length ),
				new THREE.UV( 1 - ( r - stepSize ) / this.angle, j / points.length )

			] );

		}

		oldInds = newInds;
		newInds = [];

	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

};

THREE.LatheGeometry.prototype = new THREE.Geometry();
THREE.LatheGeometry.prototype.constructor = THREE.LatheGeometry;
/**
 * Octahedrons have 8 sides. This octahedron supports subdivision.
 * 
 * Vertices have 'smooth' normals, 
 * to make a sharp edge choose a material that uses face normals instead.
 *
 * @author daniel.deady@knectar.com
 * @param radius
 * @param detail Final number of triangles = 4^detail * 8
 */

THREE.OctahedronGeometry = function ( radius, detail ) {

	THREE.Geometry.call( this );

	detail = isFinite(detail) ? detail : 3; // allow a zero value

	var that = this; // ugly scope hack

	prepare( new THREE.Vector3( +1, 0, 0 ) ); // right
	prepare( new THREE.Vector3( -1, 0, 0 ) ); // left
	prepare( new THREE.Vector3( 0, +1, 0 ) ); // up
	prepare( new THREE.Vector3( 0, -1, 0 ) ); // down
	prepare( new THREE.Vector3( 0, 0, +1 ) ); // front
	prepare( new THREE.Vector3( 0, 0, -1 ) ); // back
	var midpoints = [], p = this.vertices;

	// careful to output faces counter-clockwise, that is required for meshes
	make( p[0], p[2], p[4], detail );
	make( p[0], p[4], p[3], detail );
	make( p[0], p[3], p[5], detail );
	make( p[0], p[5], p[2], detail );
	make( p[1], p[2], p[5], detail );
	make( p[1], p[5], p[3], detail );
	make( p[1], p[3], p[4], detail );
	make( p[1], p[4], p[2], detail );

	/**
	 * Project vector onto sphere's surface
	 */
	function prepare( vector ) {

		var normal = vector.clone().normalize();
		var vertex = new THREE.Vertex( normal.clone().multiplyScalar( radius ) );
		vertex.index = that.vertices.push( vertex ) - 1;

		// Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.
		var u = azimuth( vector ) / 2 / Math.PI + 0.5;
		var v = inclination( vector ) / Math.PI + 0.5;
		vertex.uv = new THREE.UV( u, v );

		return vertex;

	}

	/**
	 * Approximate a curved face with recursively sub-divided triangles.
	 */
	function make( v1, v2, v3, detail ) {

		if ( detail < 1 ) {

			var face = new THREE.Face3( v1.index, v2.index, v3.index, [ v1.position, v2.position, v3.position ] );
			face.centroid.addSelf( v1.position ).addSelf( v2.position ).addSelf( v3.position ).divideScalar( 3 );
			face.normal = face.centroid.clone().normalize();
			that.faces.push( face );

			var azi = azimuth( face.centroid );
			that.faceVertexUvs[ 0 ].push( [ 
				correctUV( v1.uv, v1.position, azi ),
				correctUV( v2.uv, v2.position, azi ),
				correctUV( v3.uv, v3.position, azi )
			] );

		}
		else {

			detail -= 1;
			// split triangle into 4 smaller triangles
			make( v1, midpoint( v1, v2 ), midpoint( v1, v3 ), detail ); // top quadrant
			make( midpoint( v1, v2 ), v2, midpoint( v2, v3 ), detail ); // left quadrant
			make( midpoint( v1, v3 ), midpoint( v2, v3 ), v3, detail ); // right quadrant
			make( midpoint( v1, v2 ), midpoint( v2, v3 ), midpoint( v1, v3 ), detail ); // center quadrant

		}

	}

	function midpoint( v1, v2 ) {

		if ( !midpoints[ v1.index ] ) midpoints[ v1.index ] = [];
		if ( !midpoints[ v2.index ] ) midpoints[ v2.index ] = [];
		var mid = midpoints[ v1.index ][ v2.index ];
		if ( mid === undefined ) {
			// generate mean point and project to surface with prepare()
			midpoints[ v1.index ][ v2.index ] = midpoints[ v2.index ][ v1.index ] = mid = prepare( 
				new THREE.Vector3().add( v1.position, v2.position ).divideScalar( 2 ) 
			);
		}
		return mid;

	}

	/**
	 * Angle around the Y axis, counter-clockwise when looking from above.
	 */
	function azimuth( vector ) {

		return Math.atan2( vector.z, -vector.x );

	}

	/**
	 * Angle above the XZ plane.
	 */
	function inclination( vector ) {

		return Math.atan2( -vector.y, Math.sqrt( ( vector.x * vector.x ) + ( vector.z * vector.z ) ) );

	}

	/**
	 * Texture fixing helper. Spheres have some odd behaviours.
	 */
	function correctUV( uv, vector, azimuth ) {

		if ( (azimuth < 0) && (uv.u === 1) ) uv = new THREE.UV( uv.u - 1, uv.v );
		if ( (vector.x === 0) && (vector.z === 0) ) uv = new THREE.UV( azimuth / 2 / Math.PI + 0.5, uv.v );
		return uv;

	}

	this.boundingSphere = { radius: radius };

};

THREE.OctahedronGeometry.prototype = new THREE.Geometry();
THREE.OctahedronGeometry.prototype.constructor = THREE.OctahedronGeometry;
/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */

THREE.PlaneGeometry = function ( width, height, segmentsWidth, segmentsHeight ) {

	THREE.Geometry.call( this );

	var ix, iy,
	width_half = width / 2,
	height_half = height / 2,
	gridX = segmentsWidth || 1,
	gridY = segmentsHeight || 1,
	gridX1 = gridX + 1,
	gridY1 = gridY + 1,
	segment_width = width / gridX,
	segment_height = height / gridY;


	for( iy = 0; iy < gridY1; iy++ ) {

		for( ix = 0; ix < gridX1; ix++ ) {

			var x = ix * segment_width - width_half;
			var y = iy * segment_height - height_half;

			this.vertices.push( new THREE.Vertex( new THREE.Vector3( x, - y, 0 ) ) );

		}

	}

	for( iy = 0; iy < gridY; iy++ ) {

		for( ix = 0; ix < gridX; ix++ ) {

			var a = ix + gridX1 * iy;
			var b = ix + gridX1 * ( iy + 1 );
			var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
			var d = ( ix + 1 ) + gridX1 * iy;

			this.faces.push( new THREE.Face4( a, b, c, d ) );
			this.faceVertexUvs[ 0 ].push( [
						new THREE.UV( ix / gridX, iy / gridY ),
						new THREE.UV( ix / gridX, ( iy + 1 ) / gridY ),
						new THREE.UV( ( ix + 1 ) / gridX, ( iy + 1 ) / gridY ),
						new THREE.UV( ( ix + 1 ) / gridX, iy / gridY )
					] );

		}

	}

	this.computeCentroids();
	this.computeFaceNormals();

};

THREE.PlaneGeometry.prototype = new THREE.Geometry();
THREE.PlaneGeometry.prototype.constructor = THREE.PlaneGeometry;
/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Sphere.as
 */

THREE.SphereGeometry = function ( radius, segmentsWidth, segmentsHeight ) {

	THREE.Geometry.call( this );

	var radius = radius || 50,
	gridX = segmentsWidth || 8,
	gridY = segmentsHeight || 6;

	var i, j, pi = Math.PI;
	var iHor = Math.max( 3, gridX );
	var iVer = Math.max( 2, gridY );
	var aVtc = [];

	for ( j = 0; j < ( iVer + 1 ) ; j++ ) {

		var fRad1 = j / iVer;
		var fZ = radius * Math.cos( fRad1 * pi );
		var fRds = radius * Math.sin( fRad1 * pi );
		var aRow = [];
		var oVtx = 0;

		for ( i = 0; i < iHor; i++ ) {

			var fRad2 = 2 * i / iHor;
			var fX = fRds * Math.sin( fRad2 * pi );
			var fY = fRds * Math.cos( fRad2 * pi );

			if ( !( ( j == 0 || j == iVer ) && i > 0 ) ) {

				oVtx = this.vertices.push( new THREE.Vertex( new THREE.Vector3( fY, fZ, fX ) ) ) - 1;

			}

			aRow.push( oVtx );

		}

		aVtc.push( aRow );

	}

	var n1, n2, n3, iVerNum = aVtc.length;

	for ( j = 0; j < iVerNum; j++ ) {

		var iHorNum = aVtc[ j ].length;

		if ( j > 0 ) {

			for ( i = 0; i < iHorNum; i++ ) {

				var bEnd = i == ( iHorNum - 1 );
				var aP1 = aVtc[ j ][ bEnd ? 0 : i + 1 ];
				var aP2 = aVtc[ j ][ ( bEnd ? iHorNum - 1 : i ) ];
				var aP3 = aVtc[ j - 1 ][ ( bEnd ? iHorNum - 1 : i ) ];
				var aP4 = aVtc[ j - 1 ][ bEnd ? 0 : i + 1 ];

				var fJ0 = j / ( iVerNum - 1 );
				var fJ1 = ( j - 1 ) / ( iVerNum - 1 );
				var fI0 = ( i + 1 ) / iHorNum;
				var fI1 = i / iHorNum;

				var aP1uv = new THREE.UV( 1 - fI0, fJ0 );
				var aP2uv = new THREE.UV( 1 - fI1, fJ0 );
				var aP3uv = new THREE.UV( 1 - fI1, fJ1 );
				var aP4uv = new THREE.UV( 1 - fI0, fJ1 );

				if ( j < ( aVtc.length - 1 ) ) {

					n1 = this.vertices[ aP1 ].position.clone();
					n2 = this.vertices[ aP2 ].position.clone();
					n3 = this.vertices[ aP3 ].position.clone();
					n1.normalize();
					n2.normalize();
					n3.normalize();

					this.faces.push( new THREE.Face3( aP1, aP2, aP3, [ new THREE.Vector3( n1.x, n1.y, n1.z ), new THREE.Vector3( n2.x, n2.y, n2.z ), new THREE.Vector3( n3.x, n3.y, n3.z ) ] ) );

					this.faceVertexUvs[ 0 ].push( [ aP1uv, aP2uv, aP3uv ] );

				}

				if ( j > 1 ) {

					n1 = this.vertices[aP1].position.clone();
					n2 = this.vertices[aP3].position.clone();
					n3 = this.vertices[aP4].position.clone();
					n1.normalize();
					n2.normalize();
					n3.normalize();

					this.faces.push( new THREE.Face3( aP1, aP3, aP4, [ new THREE.Vector3( n1.x, n1.y, n1.z ), new THREE.Vector3( n2.x, n2.y, n2.z ), new THREE.Vector3( n3.x, n3.y, n3.z ) ] ) );

					this.faceVertexUvs[ 0 ].push( [ aP1uv, aP3uv, aP4uv ] );

				}

			}
		}
	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

	this.boundingSphere = { radius: radius };

};

THREE.SphereGeometry.prototype = new THREE.Geometry();
THREE.SphereGeometry.prototype.constructor = THREE.SphereGeometry;
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author alteredq / http://alteredqualia.com/
 *
 * For creating 3D text geometry in three.js
 *
 * Text = 3D Text
 *
 * parameters = {
 *  size: 			<float>, 	// size of the text
 *  height: 		<float>, 	// thickness to extrude text
 *  curveSegments: 	<int>,		// number of points on the curves
 *
 *  font: 			<string>,		// font name
 *  weight: 		<string>,		// font weight (normal, bold)
 *  style: 			<string>,		// font style  (normal, italics)
 *
 *  bevelEnabled:	<bool>,			// turn on bevel
 *  bevelThickness: <float>, 		// how deep into text bevel goes
 *  bevelSize:		<float>, 		// how far from text outline is bevel
 *
 *  bend:			<bool>			// bend according to hardcoded curve (generates bendPath)
 *  bendPath:       <curve>         // wraps text according to bend Path
 *  }
 *
 * It uses techniques used in:
 *
 * 	typeface.js and canvastext
 * 		For converting fonts and rendering with javascript
 *		http://typeface.neocracy.org
 *
 *	Triangulation ported from AS3
 *		Simple Polygon Triangulation
 *		http://actionsnippet.com/?p=1462
 *
 * 	A Method to triangulate shapes with holes
 *		http://www.sakri.net/blog/2009/06/12/an-approach-to-triangulating-polygons-with-holes/
 *
 */

THREE.TextGeometry = function ( text, parameters ) {

	var textPath = new THREE.TextPath( text, parameters );
	var textShapes = textPath.toShapes();

	// translate parameters to ExtrudeGeometry API

	parameters.amount = parameters.height !== undefined ? parameters.height : 50;

	// defaults

	if ( parameters.bevelThickness === undefined ) parameters.bevelThickness = 10;
	if ( parameters.bevelSize === undefined ) parameters.bevelSize = 8;
	if ( parameters.bevelEnabled === undefined ) parameters.bevelEnabled = false;

	if ( parameters.bend ) {

		var b = textShapes[ textShapes.length - 1 ].getBoundingBox();
		var max = b.maxX;

		parameters.bendPath = new THREE.QuadraticBezierCurve( new THREE.Vector2( 0, 0 ),
															  new THREE.Vector2( max / 2, 120 ),
															  new THREE.Vector2( max, 0 ) );

	}

	// // Bend Testings.
	//
	// var path = new THREE.CurvePath();
	//
	// path.add(new THREE.CubicBezierCurve(
	// 		new THREE.Vector2(0, 0),
	//   		new THREE.Vector2(10, 100),
	// 		new THREE.Vector2(200, -10),
	// 		new THREE.Vector2(300, 0)
	// 	));
	//
	// path.add(new THREE.QuadraticBezierCurve(
	// 	new THREE.Vector2(300, 0),
	//   		new THREE.Vector2(450, -10),
	// 	new THREE.Vector2(500, 100)
	// ));
	//
	// parameters.bendPath = path;

	// var path = new THREE.CurvePath();
	// 	path.add(new THREE.LineCurve( 0, 50,  250, 150));
	// 	path.add(new THREE.LineCurve( 250, 150,  400, 50));
	// path.add(new THREE.LineCurve( 400, 50,  0, 50));
	// 	parameters.bendPath = path;

	// var path = new THREE.ArcCurve(0, 0, 200, Math.PI * 0, Math.PI * 2, true);
	// 		parameters.bendPath = path;

	// var path = new THREE.SplineCurve([
	// 		new THREE.Vector2(0, 0),
	// 		new THREE.Vector2(100, 40),
	// 		new THREE.Vector2(200, 0),
	// 		new THREE.Vector2(400, 20)
	// 	]);
	//
	// console.log(path);
	//
	// path = new THREE.LineCurve( new THREE.Vector2(0, 0),  new THREE.Vector2(400, 100));

	// var bend = new THREE.Path();
	// 	bend.moveTo(0,0);
	// 	bend.quadraticCurveTo( 500, 100, 1000, 0 );
	//
	// 	parameters.bendPath = bend;



	THREE.ExtrudeGeometry.call( this, textShapes, parameters );

};

THREE.TextGeometry.prototype = new THREE.ExtrudeGeometry();
THREE.TextGeometry.prototype.constructor = THREE.TextGeometry;


/*
	// TextGeometry wrapper

	var text3d = new TextGeometry( text, options );

	// Complete manner

	var textPath = new TextPath( text, options );
	var textShapes = textPath.toShapes();
	var text3d = new ExtrudeGeometry( textShapes, options );

	// Factory Method

	var textShapes = FontUtils.getTextShapes( text, options );
	text3d = new ExtrudeGeometry( textShapes, options );

*/


THREE.FontUtils = {

	faces : {},

	// Just for now. face[weight][style]

	face : "helvetiker",
	weight: "normal",
	style : "normal",
	size : 150,
	divisions : 10,

	getFace : function() {

		return this.faces[ this.face ][ this.weight ][ this.style ];

	},

	getTextShapes: function( text, options ) {

		var textPath = new TextPath( text, options );
		var textShapes = textPath.toShapes();
		return textShapes;

	},

	loadFace : function( data ) {

		var family = data.familyName.toLowerCase();

		var ThreeFont = this;

		ThreeFont.faces[ family ] = ThreeFont.faces[ family ] || {};

		ThreeFont.faces[ family ][ data.cssFontWeight ] = ThreeFont.faces[ family ][ data.cssFontWeight ] || {};
		ThreeFont.faces[ family ][ data.cssFontWeight ][ data.cssFontStyle ] = data;

		var face = ThreeFont.faces[ family ][ data.cssFontWeight ][ data.cssFontStyle ] = data;

		return data;

	},

	drawText : function( text ) {

		var characterPts = [], allPts = [];

		// RenderText

		var i, p,
			face = this.getFace(),
			scale = this.size / face.resolution,
			offset = 0,
			chars = String( text ).split( '' ),
			length = chars.length;

		var fontPaths = [];

		for ( i = 0; i < length; i ++ ) {

			var path = new THREE.Path();

			var ret = this.extractGlyphPoints( chars[ i ], face, scale, offset, path );
			offset += ret.offset;
			//characterPts.push( ret.points );
			//allPts = allPts.concat( ret.points );
			fontPaths.push( ret.path );

		}

		// get the width

		var width = offset / 2;
		//
		// for ( p = 0; p < allPts.length; p++ ) {
		//
		// 	allPts[ p ].x -= width;
		//
		// }

		//var extract = this.extractPoints( allPts, characterPts );
		//extract.contour = allPts;

		//extract.paths = fontPaths;
		//extract.offset = width;

		return { paths : fontPaths, offset : width };

	},




	extractGlyphPoints : function( c, face, scale, offset, path ) {

		var pts = [];

		var i, i2,
			outline, action, length,
			scaleX, scaleY,
			x, y, cpx, cpy, cpx0, cpy0, cpx1, cpy1, cpx2, cpy2,
			laste,
			glyph = face.glyphs[ c ] || face.glyphs[ ctxt.options.fallbackCharacter ];

		if ( !glyph ) return;

		if ( glyph.o ) {

			outline = glyph._cachedOutline || ( glyph._cachedOutline = glyph.o.split( ' ' ) );
			length = outline.length;

			scaleX = scale;
			scaleY = scale;

			for ( i = 0; i < length; ) {

				action = outline[ i ++ ];

				//console.log( action );

				switch( action ) {

				case 'm':

					// Move To

					x = outline[ i++ ] * scaleX + offset;
					y = outline[ i++ ] * scaleY;

					pts.push( new THREE.Vector2( x, y ) );

					path.moveTo( x, y );
					break;

				case 'l':

					// Line To

					x = outline[ i++ ] * scaleX + offset;
					y = outline[ i++ ] * scaleY;
					pts.push( new THREE.Vector2( x, y ) );
					path.lineTo(x,y);
					break;

				case 'q':

					// QuadraticCurveTo

					cpx  = outline[ i++ ] * scaleX + offset;
					cpy  = outline[ i++ ] * scaleY;
					cpx1 = outline[ i++ ] * scaleX + offset;
					cpy1 = outline[ i++ ] * scaleY;

					path.quadraticCurveTo(cpx1, cpy1, cpx, cpy);

					laste = pts[ pts.length - 1 ];

					if ( laste ) {

						cpx0 = laste.x;
						cpy0 = laste.y;

						for ( i2 = 1, divisions = this.divisions; i2 <= divisions; i2++ ) {

							var t = i2 / divisions;
							var tx = THREE.Shape.Utils.b2( t, cpx0, cpx1, cpx );
							var ty = THREE.Shape.Utils.b2( t, cpy0, cpy1, cpy );
							pts.push( new THREE.Vector2( tx, ty ) );

					  }

				  }

				  break;

				case 'b':

					// Cubic Bezier Curve

					cpx  = outline[ i++ ] *  scaleX + offset;
					cpy  = outline[ i++ ] *  scaleY;
					cpx1 = outline[ i++ ] *  scaleX + offset;
					cpy1 = outline[ i++ ] * -scaleY;
					cpx2 = outline[ i++ ] *  scaleX + offset;
					cpy2 = outline[ i++ ] * -scaleY;

					path.bezierCurveTo( cpx, cpy, cpx1, cpy1, cpx2, cpy2 );

					laste = pts[ pts.length - 1 ];

					if ( laste ) {

						cpx0 = laste.x;
						cpy0 = laste.y;

						for ( i2 = 1, divisions = this.divisions; i2 <= divisions; i2++ ) {

							var t = i2 / divisions;
							var tx = THREE.Shape.Utils.b3( t, cpx0, cpx1, cpx2, cpx );
							var ty = THREE.Shape.Utils.b3( t, cpy0, cpy1, cpy2, cpy );
							pts.push( new THREE.Vector2( tx, ty ) );

						}

					}

					break;

				}

			}
		}



		return { offset: glyph.ha*scale, points:pts, path:path};
	}

};



/**
 * This code is a quick port of code written in C++ which was submitted to
 * flipcode.com by John W. Ratcliff  // July 22, 2000
 * See original code and more information here:
 * http://www.flipcode.com/archives/Efficient_Polygon_Triangulation.shtml
 *
 * ported to actionscript by Zevan Rosser
 * www.actionsnippet.com
 *
 * ported to javascript by Joshua Koo
 * http://www.lab4games.net/zz85/blog
 *
 */


( function( namespace ) {

	var EPSILON = 0.0000000001;

	// takes in an contour array and returns

	var process = function( contour, indices ) {

		var n = contour.length;

		if ( n < 3 ) return null;

		var result = [],
			verts = [],
			vertIndices = [];

		/* we want a counter-clockwise polygon in verts */

		var u, v, w;

		if ( area( contour ) > 0.0 ) {

			for ( v = 0; v < n; v++ ) verts[ v ] = v;

		} else {

			for ( v = 0; v < n; v++ ) verts[ v ] = ( n - 1 ) - v;

		}

		var nv = n;

		/*  remove nv - 2 vertices, creating 1 triangle every time */

		var count = 2 * nv;   /* error detection */

		for( v = nv - 1; nv > 2; ) {

			/* if we loop, it is probably a non-simple polygon */

			if ( ( count-- ) <= 0 ) {

				//** Triangulate: ERROR - probable bad polygon!

				//throw ( "Warning, unable to triangulate polygon!" );
				//return null;
				// Sometimes warning is fine, especially polygons are triangulated in reverse.
				console.log( "Warning, unable to triangulate polygon!" );

				if ( indices ) return vertIndices;
				return result;

			}

			/* three consecutive vertices in current polygon, <u,v,w> */

			u = v; 	 	if ( nv <= u ) u = 0;     /* previous */
			v = u + 1;  if ( nv <= v ) v = 0;     /* new v    */
			w = v + 1;  if ( nv <= w ) w = 0;     /* next     */

			if ( snip( contour, u, v, w, nv, verts ) ) {

				var a, b, c, s, t;

				/* true names of the vertices */

				a = verts[ u ];
				b = verts[ v ];
				c = verts[ w ];

				/* output Triangle */

				/*
				result.push( contour[ a ] );
				result.push( contour[ b ] );
				result.push( contour[ c ] );
				*/
				result.push( [ contour[ a ],
					contour[ b ],
					contour[ c ] ] );


				vertIndices.push( [ verts[ u ], verts[ v ], verts[ w ] ] );

				/* remove v from the remaining polygon */

				for( s = v, t = v + 1; t < nv; s++, t++ ) {

					verts[ s ] = verts[ t ];

				}

				nv--;

				/* reset error detection counter */

				count = 2 * nv;

			}

		}

		if ( indices ) return vertIndices;
		return result;

	};

	// calculate area of the contour polygon

	var area = function ( contour ) {

		var n = contour.length;
		var a = 0.0;

		for( var p = n - 1, q = 0; q < n; p = q++ ) {

			a += contour[ p ].x * contour[ q ].y - contour[ q ].x * contour[ p ].y;

		}

		return a * 0.5;

	};

	// see if p is inside triangle abc

	var insideTriangle = function( ax, ay,
								   bx, by,
								   cx, cy,
								   px, py ) {

		  var aX, aY, bX, bY;
		  var cX, cY, apx, apy;
		  var bpx, bpy, cpx, cpy;
		  var cCROSSap, bCROSScp, aCROSSbp;

		  aX = cx - bx;  aY = cy - by;
		  bX = ax - cx;  bY = ay - cy;
		  cX = bx - ax;  cY = by - ay;
		  apx= px  -ax;  apy= py - ay;
		  bpx= px - bx;  bpy= py - by;
		  cpx= px - cx;  cpy= py - cy;

		  aCROSSbp = aX*bpy - aY*bpx;
		  cCROSSap = cX*apy - cY*apx;
		  bCROSScp = bX*cpy - bY*cpx;

		  return ( (aCROSSbp >= 0.0) && (bCROSScp >= 0.0) && (cCROSSap >= 0.0) );

	};


	var snip = function ( contour, u, v, w, n, verts ) {

		var p;
		var ax, ay, bx, by;
		var cx, cy, px, py;

		ax = contour[ verts[ u ] ].x;
		ay = contour[ verts[ u ] ].y;

		bx = contour[ verts[ v ] ].x;
		by = contour[ verts[ v ] ].y;

		cx = contour[ verts[ w ] ].x;
		cy = contour[ verts[ w ] ].y;

		if ( EPSILON > (((bx-ax)*(cy-ay)) - ((by-ay)*(cx-ax))) ) return false;

			for ( p = 0; p < n; p++ ) {

				if( (p == u) || (p == v) || (p == w) ) continue;

				px = contour[ verts[ p ] ].x
				py = contour[ verts[ p ] ].y

				if ( insideTriangle( ax, ay, bx, by, cx, cy, px, py ) ) return false;

		  }

		  return true;

	};


	namespace.Triangulate = process;
	namespace.Triangulate.area = area;

	return namespace;

})(THREE.FontUtils);

// To use the typeface.js face files, hook up the API
self._typeface_js = { faces: THREE.FontUtils.faces, loadFace: THREE.FontUtils.loadFace };
/**
 * @author oosmoxiecode
 * @author mr.doob / http://mrdoob.com/
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3DLite/src/away3dlite/primitives/Torus.as?r=2888
 */

THREE.TorusGeometry = function ( radius, tube, segmentsR, segmentsT, arc ) {

	THREE.Geometry.call( this );

	var scope = this;

	this.radius = radius || 100;
	this.tube = tube || 40;
	this.segmentsR = segmentsR || 8;
	this.segmentsT = segmentsT || 6;
	this.arc = arc || Math.PI * 2;

	var center = new THREE.Vector3(), uvs = [], normals = [];

	for ( var j = 0; j <= this.segmentsR; j ++ ) {

		for ( var i = 0; i <= this.segmentsT; i ++ ) {

			var u = i / this.segmentsT * this.arc;
			var v = j / this.segmentsR * Math.PI * 2;

			center.x = this.radius * Math.cos( u );
			center.y = this.radius * Math.sin( u );

			var vector = new THREE.Vector3();
			vector.x = ( this.radius + this.tube * Math.cos( v ) ) * Math.cos( u );
			vector.y = ( this.radius + this.tube * Math.cos( v ) ) * Math.sin( u );
			vector.z = this.tube * Math.sin( v );

			this.vertices.push( new THREE.Vertex( vector ) );

			uvs.push( new THREE.UV( i / this.segmentsT, 1 - j / this.segmentsR ) );
			normals.push( vector.clone().subSelf( center ).normalize() );

		}
	}


	for ( var j = 1; j <= this.segmentsR; j ++ ) {

		for ( var i = 1; i <= this.segmentsT; i ++ ) {

			var a = ( this.segmentsT + 1 ) * j + i - 1;
			var b = ( this.segmentsT + 1 ) * ( j - 1 ) + i - 1;
			var c = ( this.segmentsT + 1 ) * ( j - 1 ) + i;
			var d = ( this.segmentsT + 1 ) * j + i;

			var face = new THREE.Face4( a, b, c, d, [ normals[ a ], normals[ b ], normals[ c ], normals[ d ] ] );
			face.normal.addSelf( normals[ a ] );
			face.normal.addSelf( normals[ b ] );
			face.normal.addSelf( normals[ c ] );
			face.normal.addSelf( normals[ d ] );
			face.normal.normalize();

			this.faces.push( face );

			this.faceVertexUvs[ 0 ].push( [ uvs[ a ].clone(), uvs[ b ].clone(), uvs[ c ].clone(), uvs[ d ].clone() ] );
		}

	}

	this.computeCentroids();

};

THREE.TorusGeometry.prototype = new THREE.Geometry();
THREE.TorusGeometry.prototype.constructor = THREE.TorusGeometry;
/**
 * @author oosmoxiecode
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3D/src/away3d/primitives/TorusKnot.as?spec=svn2473&r=2473
 */

THREE.TorusKnotGeometry = function ( radius, tube, segmentsR, segmentsT, p, q, heightScale ) {

	THREE.Geometry.call( this );

	var scope = this;

	this.radius = radius || 200;
	this.tube = tube || 40;
	this.segmentsR = segmentsR || 64;
	this.segmentsT = segmentsT || 8;
	this.p = p || 2;
	this.q = q || 3;
	this.heightScale = heightScale || 1;
	this.grid = new Array(this.segmentsR);

	var tang = new THREE.Vector3();
	var n = new THREE.Vector3();
	var bitan = new THREE.Vector3();

	for ( var i = 0; i < this.segmentsR; ++ i ) {

		this.grid[ i ] = new Array( this.segmentsT );

		for ( var j = 0; j < this.segmentsT; ++ j ) {

			var u = i / this.segmentsR * 2 * this.p * Math.PI;
			var v = j / this.segmentsT * 2 * Math.PI;
			var p = getPos( u, v, this.q, this.p, this.radius, this.heightScale );
			var p2 = getPos( u + 0.01, v, this.q, this.p, this.radius, this.heightScale );
			var cx, cy;

			tang.x = p2.x - p.x; tang.y = p2.y - p.y; tang.z = p2.z - p.z;
			n.x = p2.x + p.x; n.y = p2.y + p.y; n.z = p2.z + p.z; 
			bitan.cross( tang, n );
			n.cross( bitan, tang );
			bitan.normalize();
			n.normalize();

			cx = - this.tube * Math.cos( v ); // TODO: Hack: Negating it so it faces outside.
			cy = this.tube * Math.sin( v );

			p.x += cx * n.x + cy * bitan.x;
			p.y += cx * n.y + cy * bitan.y;
			p.z += cx * n.z + cy * bitan.z;

			this.grid[ i ][ j ] = vert( p.x, p.y, p.z );

		}

	}

	for ( var i = 0; i < this.segmentsR; ++ i ) {

		for ( var j = 0; j < this.segmentsT; ++ j ) {

			var ip = ( i + 1 ) % this.segmentsR;
			var jp = ( j + 1 ) % this.segmentsT;
			var a = this.grid[ i ][ j ]; 
			var b = this.grid[ ip ][ j ];
			var c = this.grid[ ip ][ jp ];
			var d = this.grid[ i ][ jp ]; 

			var uva = new THREE.UV( i / this.segmentsR, j / this.segmentsT );
			var uvb = new THREE.UV( ( i + 1 ) / this.segmentsR, j / this.segmentsT );
			var uvc = new THREE.UV( ( i + 1 ) / this.segmentsR, ( j + 1 ) / this.segmentsT );
			var uvd = new THREE.UV( i / this.segmentsR, ( j + 1 ) / this.segmentsT );

			this.faces.push( new THREE.Face4( a, b, c, d ) );
			this.faceVertexUvs[ 0 ].push( [ uva,uvb,uvc, uvd ] );

		}
	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

	function vert( x, y, z ) {

		return scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) ) - 1;

	}

	function getPos( u, v, in_q, in_p, radius, heightScale ) {

		var cu = Math.cos( u );
		var cv = Math.cos( v );
		var su = Math.sin( u );
		var quOverP = in_q / in_p * u;
		var cs = Math.cos( quOverP );

		var tx = radius * ( 2 + cs ) * 0.5 * cu;
		var ty = radius * ( 2 + cs ) * su * 0.5;
		var tz = heightScale * radius * Math.sin( quOverP ) * 0.5;

		return new THREE.Vector3( tx, ty, tz );

	}

};

THREE.TorusKnotGeometry.prototype = new THREE.Geometry();
THREE.TorusKnotGeometry.prototype.constructor = THREE.TorusKnotGeometry;
/*
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog 
 * 
 *	Subdivision Geometry Modifier 
 *		using Catmull-Clark Subdivision Surfaces
 *		for creating smooth geometry meshes
 *
 *	Note: a modifier modifies vertices and faces of geometry,
 *		so use THREE.GeometryUtils.clone() if orignal geoemtry needs to be retained
 * 
 *	Readings: 
 *		http://en.wikipedia.org/wiki/Catmull%E2%80%93Clark_subdivision_surface
 *		http://www.rorydriscoll.com/2008/08/01/catmull-clark-subdivision-the-basics/
 */

THREE.SubdivisionModifier = function( subdivisions ) {
	
	this.subdivisions = (subdivisions === undefined ) ? 1 : subdivisions;
	
	// Settings
	this.useOldVertexColors = false;
	this.supportUVs = true;
	
};

//THREE.SubdivisionModifier.prototype = new THREE.Modifier();

THREE.SubdivisionModifier.prototype.constructor = THREE.SubdivisionModifier;

// Applies the "modify" pattern
THREE.SubdivisionModifier.prototype.modify = function ( geometry ) {
	
	var repeats = this.subdivisions;
	
	while ( repeats-- > 0 ) {
		this.smooth( geometry );
	}
	
};

// Performs an iteration of Catmull-Clark Subdivision
THREE.SubdivisionModifier.prototype.smooth = function ( oldGeometry ) {
	
	//console.log( 'running smooth' );
	
	// New set of vertices, faces and uvs
	var newVertices = [], newFaces = [], newUVs = [];
	
	function v( x, y, z ) {
		newVertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
	}
	
	var scope = this;

	function f4( a, b, c, d, oldFace, orders ) {
		
		// TODO move vertex selection over here!
		
		var newFace = new THREE.Face4( a, b, c, d, null, oldFace.color, oldFace.material );
		
		if (scope.useOldVertexColors) {
			
			newFace.vertexColors = []; 
			
			var color, tmpColor, order;
			for (var i=0;i<4;i++) {
				order = orders[i];
				
				color = new THREE.Color(),
				color.setRGB(0,0,0);
				
				for (var j=0, jl=0; j<order.length;j++) {
					tmpColor = oldFace.vertexColors[order[j]-1];
					color.r += tmpColor.r;
					color.g += tmpColor.g;
					color.b += tmpColor.b;
				}
				
				color.r /= order.length;
				color.g /= order.length;
				color.b /= order.length;
				
				newFace.vertexColors[i] = color;
				
			}
			
		}
		
		newFaces.push( newFace );
		
		if (!scope.supportUVs || uvForVertices.length!=0) {
			newUVs.push( [
				uvForVertices[a],
				uvForVertices[b],
				uvForVertices[c],
				uvForVertices[d]
			] );
			
		}
	}
	
	function edge_hash( a, b ) {

		return Math.min( a, b ) + "_" + Math.max( a, b );

	};
	
	function computeEdgeFaces( geometry ) {

		function addToMap( map, hash, i ) {

			if ( map[ hash ] === undefined ) {

				map[ hash ] = [];
				
			} 
			
			map[ hash ].push( i );

		};

		var i, il, v1, v2, j, k,
			face, faceIndices, faceIndex,
			edge,
			hash,
			vfMap = {};

		// construct vertex -> face map

		for( i = 0, il = geometry.faces.length; i < il; i ++ ) {

			face = geometry.faces[ i ];

			if ( face instanceof THREE.Face3 ) {

				hash = edge_hash( face.a, face.b );
				addToMap( vfMap, hash, i );

				hash = edge_hash( face.b, face.c );
				addToMap( vfMap, hash, i );

				hash = edge_hash( face.c, face.a );
				addToMap( vfMap, hash, i );

			} else if ( face instanceof THREE.Face4 ) {

				hash = edge_hash( face.a, face.b );
				addToMap( vfMap, hash, i );

				hash = edge_hash( face.b, face.c );
				addToMap( vfMap, hash, i );

				hash = edge_hash( face.c, face.d );
				addToMap( vfMap, hash, i );
				
				hash = edge_hash( face.d, face.a );
				addToMap( vfMap, hash, i );

			}

		}

		// extract faces
		
		// var edges = [];
		// 
		// var numOfEdges = 0;
		// for (i in vfMap) {
		// 	numOfEdges++;
		// 	
		// 	edge = vfMap[i];
		// 	edges.push(edge);
		// 	
		// }
		
		//console.log('vfMap', vfMap, 'geometry.edges',geometry.edges, 'numOfEdges', numOfEdges);

		return vfMap;

	};
	
	var originalPoints = oldGeometry.vertices;
	var originalFaces = oldGeometry.faces;
	
	var newPoints = originalPoints.concat(); // Vertices
		
	var facePoints = [], edgePoints = {};
	
	var uvForVertices = [];
	
	// Step 1
	//	For each face, add a face point
	//	Set each face point to be the centroid of all original points for the respective face.
	
	var i, il, j, jl, face;
	
	// For Uvs
	var uvs = oldGeometry.faceVertexUvs[0];
	var abcd = 'abcd', vertice;
	
	for (i=0, il = uvs.length; i<il; i++ ) {
		for (j=0,jl=uvs[i].length;j<jl;j++) {
			vertice = originalFaces[i][abcd.charAt(j)];
			
			if (!uvForVertices[vertice]) {
				uvForVertices[vertice] = uvs[i][j];
			} else {
				//console.log('dup', 	uvForVertices[vertice]);
			}
			
			
		}
	}
			
	var avgUv ;
	for (i=0, il = originalFaces.length; i<il ;i++) {
		face = originalFaces[i];
		facePoints.push(face.centroid);
		newPoints.push( new THREE.Vertex(face.centroid) );
		
		
		if (!scope.supportUVs || uvForVertices.length==0) continue;
		
		// Prepare subdivided uv
		
		avgUv = new THREE.UV();
		
		if ( face instanceof THREE.Face3 ) {
			avgUv.u = uvForVertices[face.a].u + uvForVertices[face.b].u + uvForVertices[face.c].u;
			avgUv.v = uvForVertices[face.a].v + uvForVertices[face.b].v + uvForVertices[face.c].v;
			avgUv.u /= 3;
			avgUv.v /= 3;
			
		} else if ( face instanceof THREE.Face4 ) {
			avgUv.u = uvForVertices[face.a].u + uvForVertices[face.b].u + uvForVertices[face.c].u + uvForVertices[face.d].u;
			avgUv.v = uvForVertices[face.a].v + uvForVertices[face.b].v + uvForVertices[face.c].v + uvForVertices[face.d].v;
			avgUv.u /= 4;
			avgUv.v /= 4;
		}
	
		uvForVertices.push(avgUv);
	}

	// Step 2
	//	For each edge, add an edge point.
	//	Set each edge point to be the average of the two neighbouring face points and its two original endpoints.
	
	var vfMap = computeEdgeFaces ( oldGeometry );
	var edge, faceIndexA, faceIndexB, avg;
	
	//console.log('vfMap', vfMap);

	var edgeCount = 0;
	var originalVerticesLength = originalPoints.length;
	var edgeVertex, edgeVertexA, edgeVertexB;
	for (i in vfMap) {
		edge = vfMap[i];
		
		faceIndexA = edge[0]; // face index a
		faceIndexB = edge[1]; // face index b
		
		edgeVertex = i.split('_');
		edgeVertexA = edgeVertex[0];
		edgeVertexB = edgeVertex[1];
		
		
		avg = new THREE.Vector3();
		
		//console.log(i, faceIndexB,facePoints[faceIndexB]);
		
		if (edge.length!=2) {
			//console.log('warning, ', i, 'edge has only 1 connecting face', edge);
			
			avg.addSelf(originalPoints[edgeVertexA].position);
			avg.addSelf(originalPoints[edgeVertexB].position);
			
			avg.multiplyScalar(0.5);
			
		} else {
		
			avg.addSelf(facePoints[faceIndexA]);
			avg.addSelf(facePoints[faceIndexB]);
		
			avg.addSelf(originalPoints[edgeVertexA].position);
			avg.addSelf(originalPoints[edgeVertexB].position);
		
			avg.multiplyScalar(0.25);
		
		}
		
		edgePoints[i] = originalVerticesLength + originalFaces.length + edgeCount;
		
		newPoints.push( new THREE.Vertex(avg) );
	
		edgeCount ++;
		
		if (!scope.supportUVs || uvForVertices.length==0) continue;
		
		// Prepare subdivided uv
		
		avgUv = new THREE.UV();
		
		avgUv.u = uvForVertices[edgeVertexA].u + uvForVertices[edgeVertexB].u;
		avgUv.v = uvForVertices[edgeVertexA].v + uvForVertices[edgeVertexB].v;
		avgUv.u /= 2;
		avgUv.v /= 2;
	
		uvForVertices.push(avgUv);
		
	}
	
	// Step 3
	//	For each face point, add an edge for every edge of the face, 
	//	connecting the face point to each edge point for the face.
	
	
	var facePt, currentVerticeIndex;
	
	var hashAB, hashBC, hashCD, hashDA, hashCA;
	
	
	for (i=0, il = facePoints.length; i<il ;i++) { // for every face
		facePt = facePoints[i];
		face = originalFaces[i];
		currentVerticeIndex = originalVerticesLength+ i;
		
		if ( face instanceof THREE.Face3 ) {
			
			// create 3 face4s
			
			hashAB = edge_hash( face.a, face.b );
			hashBC = edge_hash( face.b, face.c );
			hashCA = edge_hash( face.c, face.a );
			
			f4( currentVerticeIndex, edgePoints[hashAB], face.b, edgePoints[hashBC], face, ['123', '12', '2', '23'] );
			f4( currentVerticeIndex, edgePoints[hashBC], face.c, edgePoints[hashCA], face, ['123', '23', '3', '31'] );
			f4( currentVerticeIndex, edgePoints[hashCA], face.a, edgePoints[hashAB], face, ['123', '31', '1', '12'] );
			
		} else if ( face instanceof THREE.Face4 ) {
			// create 4 face4s
			
			hashAB = edge_hash( face.a, face.b );
			hashBC = edge_hash( face.b, face.c );
			hashCD = edge_hash( face.c, face.d );
			hashDA = edge_hash( face.d, face.a );
			
			f4( currentVerticeIndex, edgePoints[hashAB], face.b, edgePoints[hashBC], face, ['1234', '12', '2', '23']  );
			f4( currentVerticeIndex, edgePoints[hashBC], face.c, edgePoints[hashCD], face, ['1234', '23', '3', '34']  );
			f4( currentVerticeIndex, edgePoints[hashCD], face.d, edgePoints[hashDA], face, ['1234', '34', '4', '41']  );
			f4( currentVerticeIndex, edgePoints[hashDA], face.a, edgePoints[hashAB], face, ['1234', '41', '1', '12']  );

				
		} else {
			console.log('face should be a face!', face);
		}
	}
	
	newVertices = newPoints;
	
	// console.log('original ', oldGeometry.vertices.length, oldGeometry.faces.length );
	// console.log('new points', newPoints.length, 'faces', newFaces.length );
	
	// Step 4
	
	//	For each original point P, 
	//		take the average F of all n face points for faces touching P, 
	//		and take the average R of all n edge midpoints for edges touching P, 
	//		where each edge midpoint is the average of its two endpoint vertices. 
	//	Move each original point to the point
	
	
	
	var vertexEdgeMap = {};
	var vertexFaceMap = {};
	
	var addVertexEdgeMap = function(vertex, edge) {
		if (vertexEdgeMap[vertex]===undefined) {
			vertexEdgeMap[vertex] = [];
		}
		
		vertexEdgeMap[vertex].push(edge);
	};
	
	var addVertexFaceMap = function(vertex, face) {
		if (vertexFaceMap[vertex]===undefined) {
			vertexFaceMap[vertex] = {};
		}
		
		vertexFaceMap[vertex][face] = null;
	};
	
	// Prepares vertexEdgeMap and vertexFaceMap
	for (i in vfMap) { // This is for every edge
		edge = vfMap[i];
		
		edgeVertex = i.split('_');
		edgeVertexA = edgeVertex[0];
		edgeVertexB = edgeVertex[1];
		
		addVertexEdgeMap(edgeVertexA, [edgeVertexA, edgeVertexB] );
		addVertexEdgeMap(edgeVertexB, [edgeVertexA, edgeVertexB] );
		
		faceIndexA = edge[0]; // face index a
		faceIndexB = edge[1]; // face index b
		
		addVertexFaceMap(edgeVertexA, faceIndexA);
		if (faceIndexB) addVertexFaceMap(edgeVertexA, faceIndexB);
		else addVertexFaceMap(edgeVertexA, faceIndexA);
		
		addVertexFaceMap(edgeVertexB, faceIndexA);
		if (faceIndexB) addVertexFaceMap(edgeVertexB, faceIndexB);
		else addVertexFaceMap(edgeVertexB, faceIndexA);
		
	}
	
	//console.log('vertexEdgeMap',vertexEdgeMap, 'vertexFaceMap', vertexFaceMap);
	
	var F = new THREE.Vector3();
	var R = new THREE.Vector3();

	var n;
	for (i=0, il = originalPoints.length; i<il; i++) {
		// (F + 2R + (n-3)P) / n
		
		if (vertexEdgeMap[i]===undefined) continue;
		
		F.set(0,0,0);
		R.set(0,0,0);
		var newPos =  new THREE.Vector3(0,0,0);
		
		var f =0;
		for (j in vertexFaceMap[i]) {
			
			F.addSelf(facePoints[j]);
			f++;
		}
		
		F.divideScalar(f);
		
		n = vertexEdgeMap[i].length;
		
		for (j=0; j<n;j++) {
			edge = vertexEdgeMap[i][j];
			var midPt = originalPoints[edge[0]].position.clone().addSelf(originalPoints[edge[1]].position).divideScalar(2);
			R.addSelf(midPt);
			// R.addSelf(originalPoints[edge[0]].position);
			// R.addSelf(originalPoints[edge[1]].position);
		}
		
		R.divideScalar(n)
		
		newPos.addSelf(originalPoints[i].position);
		newPos.multiplyScalar(n - 3);
		
		newPos.addSelf(F);
		newPos.addSelf(R.multiplyScalar(2));
		newPos.divideScalar(n);
		
		newVertices[i].position = newPos;
		
		
	}
	
	var newGeometry = oldGeometry; // Let's pretend the old geometry is now new :P
	
	newGeometry.vertices = newVertices;
	newGeometry.faces = newFaces;
	newGeometry.faceVertexUvs[ 0 ] = newUVs;
	
	delete newGeometry.__tmpVertices; // makes __tmpVertices undefined :P
	
	newGeometry.computeCentroids();
	newGeometry.computeFaceNormals();
	newGeometry.computeVertexNormals();
	
};/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Loader = function ( showStatus ) {

	this.showStatus = showStatus;
	this.statusDomElement = showStatus ? THREE.Loader.prototype.addStatusElement() : null;

	this.onLoadStart = function () {};
	this.onLoadProgress = function() {};
	this.onLoadComplete = function () {};

};

THREE.Loader.prototype = {

	constructor: THREE.Loader,

	addStatusElement: function () {

		var e = document.createElement( "div" );

		e.style.position = "absolute";
		e.style.right = "0px";
		e.style.top = "0px";
		e.style.fontSize = "0.8em";
		e.style.textAlign = "left";
		e.style.background = "rgba(0,0,0,0.25)";
		e.style.color = "#fff";
		e.style.width = "120px";
		e.style.padding = "0.5em 0.5em 0.5em 0.5em";
		e.style.zIndex = 1000;

		e.innerHTML = "Loading ...";

		return e;

	},

	updateProgress: function ( progress ) {

		var message = "Loaded ";

		if ( progress.total ) {

			message += ( 100 * progress.loaded / progress.total ).toFixed(0) + "%";


		} else {

			message += ( progress.loaded / 1000 ).toFixed(2) + " KB";

		}

		this.statusDomElement.innerHTML = message;

	},

	extractUrlbase: function ( url ) {

		var parts = url.split( '/' );
		parts.pop();
		return parts.length < 1 ? '' : parts.join( '/' ) + '/';

	},

	init_materials: function ( scope, materials, texture_path ) {

		scope.materials = [];

		for ( var i = 0; i < materials.length; ++ i ) {

			scope.materials[ i ] = [ THREE.Loader.prototype.createMaterial( materials[ i ], texture_path ) ];

		}

	},

	hasNormals: function ( scope ) {

		var m, i, il = scope.materials.length;

		for( i = 0; i < il; i++ ) {

			m = scope.materials[ i ][ 0 ];

			if ( m instanceof THREE.ShaderMaterial ) return true;

		}

		return false;

	},

	createMaterial: function ( m, texture_path ) {

		function is_pow2( n ) {

			var l = Math.log( n ) / Math.LN2;
			return Math.floor( l ) == l;

		}

		function nearest_pow2( n ) {

			var l = Math.log( n ) / Math.LN2;
			return Math.pow( 2, Math.round(  l ) );

		}

		function load_image( where, url ) {

			var image = new Image();

			image.onload = function () {

				if ( !is_pow2( this.width ) || !is_pow2( this.height ) ) {

					var w = nearest_pow2( this.width ),
						h = nearest_pow2( this.height );

					where.image.width = w;
					where.image.height = h;
					where.image.getContext("2d").drawImage( this, 0, 0, w, h );

				} else {

					where.image = this;

				}

				where.needsUpdate = true;

			};

			image.src = url;

		}

		function create_texture( where, name, sourceFile, repeat, offset, wrap ) {

			var texture = document.createElement( 'canvas' );

			where[ name ] = new THREE.Texture( texture );
			where[ name ].sourceFile = sourceFile;

			if( repeat ) {

				where[ name ].repeat.set( repeat[ 0 ], repeat[ 1 ] );

				if ( repeat[ 0 ] != 1 ) where[ name ].wrapS = THREE.RepeatWrapping;
				if ( repeat[ 1 ] != 1 ) where[ name ].wrapT = THREE.RepeatWrapping;

			}

			if( offset ) {

				where[ name ].offset.set( offset[ 0 ], offset[ 1 ] );

			}

			if( wrap ) {

				var wrapMap = {
				"repeat" 	: THREE.RepeatWrapping,
				"mirror"	: THREE.MirroredRepeatWrapping
				}

				if ( wrapMap[ wrap[ 0 ] ] !== undefined ) where[ name ].wrapS = wrapMap[ wrap[ 0 ] ];
				if ( wrapMap[ wrap[ 1 ] ] !== undefined ) where[ name ].wrapT = wrapMap[ wrap[ 1 ] ];

			}

			load_image( where[ name ], texture_path + "/" + sourceFile );

		}

		function rgb2hex( rgb ) {

			return ( rgb[ 0 ] * 255 << 16 ) + ( rgb[ 1 ] * 255 << 8 ) + rgb[ 2 ] * 255;

		}

		var material, mtype, mpars,
			color, specular, ambient,
			vertexColors;

		// defaults

		mtype = "MeshLambertMaterial";

		// vertexColors

		mpars = { color: 0xeeeeee, opacity: 1.0, map: null, lightMap: null, normalMap: null, wireframe: m.wireframe };

		// parameters from model file

		if ( m.shading ) {

			if ( m.shading == "Phong" ) mtype = "MeshPhongMaterial";
			else if ( m.shading == "Basic" ) mtype = "MeshBasicMaterial";

		}

		if ( m.blending ) {

			if ( m.blending == "Additive" ) mpars.blending = THREE.AdditiveBlending;
			else if ( m.blending == "Subtractive" ) mpars.blending = THREE.SubtractiveBlending;
			else if ( m.blending == "Multiply" ) mpars.blending = THREE.MultiplyBlending;

		}

		if ( m.transparent !== undefined || m.opacity < 1.0 ) {

			mpars.transparent = m.transparent;

		}

		if ( m.depthTest !== undefined ) {

			mpars.depthTest = m.depthTest;

		}

		if ( m.vertexColors !== undefined ) {

			if ( m.vertexColors == "face" ) {

				mpars.vertexColors = THREE.FaceColors;

			} else if ( m.vertexColors ) {

				mpars.vertexColors = THREE.VertexColors;

			}

		}

		// colors

		if ( m.colorDiffuse ) {

			mpars.color = rgb2hex( m.colorDiffuse );

		} else if ( m.DbgColor ) {

			mpars.color = m.DbgColor;

		}

		if ( m.colorSpecular ) {

			mpars.specular = rgb2hex( m.colorSpecular );

		}

		if ( m.colorAmbient ) {

			mpars.ambient = rgb2hex( m.colorAmbient );

		}

		// modifiers

		if ( m.transparency ) {

			mpars.opacity = m.transparency;

		}

		if ( m.specularCoef ) {

			mpars.shininess = m.specularCoef;

		}

		// textures

		if ( m.mapDiffuse && texture_path ) {

			create_texture( mpars, "map", m.mapDiffuse, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap );

		}

		if ( m.mapLight && texture_path ) {

			create_texture( mpars, "lightMap", m.mapLight, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap );

		}

		if ( m.mapNormal && texture_path ) {

			create_texture( mpars, "normalMap", m.mapNormal, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap );

		}

		if ( m.mapSpecular && texture_path ) {

			create_texture( mpars, "specularMap", m.mapSpecular, m.mapSpecularRepeat, m.mapSpecularOffset, m.mapSpecularWrap );

		}

		// special case for normal mapped material

		if ( m.mapNormal ) {

			var shader = THREE.ShaderUtils.lib[ "normal" ];
			var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

			var diffuse = mpars.color;
			var specular = mpars.specular;
			var ambient = mpars.ambient;
			var shininess = mpars.shininess;

			uniforms[ "tNormal" ].texture = mpars.normalMap;

			if ( m.mapNormalFactor ) {

				uniforms[ "uNormalScale" ].value = m.mapNormalFactor;

			}

			if ( mpars.map ) {

				uniforms[ "tDiffuse" ].texture = mpars.map;
				uniforms[ "enableDiffuse" ].value = true;

			}

			if ( mpars.specularMap ) {

				uniforms[ "tSpecular" ].texture = mpars.specularMap;
				uniforms[ "enableSpecular" ].value = true;

			}

			if ( mpars.lightMap ) {

				uniforms[ "tAO" ].texture = mpars.lightMap;
				uniforms[ "enableAO" ].value = true;

			}

			// for the moment don't handle displacement texture

			uniforms[ "uDiffuseColor" ].value.setHex( diffuse );
			uniforms[ "uSpecularColor" ].value.setHex( specular );
			uniforms[ "uAmbientColor" ].value.setHex( ambient );

			uniforms[ "uShininess" ].value = shininess;

			if ( mpars.opacity ) {

				uniforms[ "uOpacity" ].value = mpars.opacity;

			}

			var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true, fog: true };

			material = new THREE.ShaderMaterial( parameters );

		} else {

			material = new THREE[ mtype ]( mpars );

		}

		return material;

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.BinaryLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

};

THREE.BinaryLoader.prototype = new THREE.Loader();
THREE.BinaryLoader.prototype.constructor = THREE.BinaryLoader;
THREE.BinaryLoader.prototype.supr = THREE.Loader.prototype;


// Load models generated by slim OBJ converter with BINARY option (converter_obj_three_slim.py -t binary)
//  - binary models consist of two files: JS and BIN
//  - parameters
//		- model (required)
//		- callback (required)
//		- bin_path (optional: if not specified, binary file will be assumed to be in the same folder as JS model file)
//		- texture_path (optional: if not specified, textures will be assumed to be in the same folder as JS model file)

THREE.BinaryLoader.prototype.load = function( parameters ) {

	// #1 load JS part via web worker

	//  This isn't really necessary, JS part is tiny,
	//  could be done by more ordinary means.

	var url = parameters.model,
		callback = parameters.callback,
		texture_path = parameters.texture_path ? parameters.texture_path : THREE.Loader.prototype.extractUrlbase( url ),
		bin_path = parameters.bin_path ? parameters.bin_path : THREE.Loader.prototype.extractUrlbase( url ),

		s = (new Date).getTime(),
		worker = new Worker( url ),
		callback_progress = this.showProgress ? THREE.Loader.prototype.updateProgress : null;

	worker.onmessage = function( event ) {

		var materials = event.data.materials,
			buffers = event.data.buffers;

		// #2 load BIN part via Ajax

		//  For some reason it is faster doing loading from here than from within the worker.
		//  Maybe passing of ginormous string as message between threads is costly?
		//  Also, worker loading huge data by Ajax still freezes browser. Go figure,
		//  worker with baked ascii JSON data keeps browser more responsive.

		THREE.BinaryLoader.prototype.loadAjaxBuffers( buffers, materials, callback, bin_path, texture_path, callback_progress );

	};

	worker.onerror = function (event) {

		alert( "worker.onerror: " + event.message + "\n" + event.data );
		event.preventDefault();

	};

	worker.postMessage( s );

};

// Binary AJAX parser based on Magi binary loader
// https://github.com/kig/magi

// Should look more into HTML5 File API
// See also other suggestions by Gregg Tavares
// https://groups.google.com/group/o3d-discuss/browse_thread/thread/a8967bc9ce1e0978

THREE.BinaryLoader.prototype.loadAjaxBuffers = function( buffers, materials, callback, bin_path, texture_path, callback_progress ) {

	var xhr = new XMLHttpRequest(),
		url = bin_path + "/" + buffers;

	var length = 0;

	xhr.onreadystatechange = function() {

		if ( xhr.readyState == 4 ) {

			if ( xhr.status == 200 || xhr.status == 0 ) {

				THREE.BinaryLoader.prototype.createBinModel( xhr.responseText, callback, texture_path, materials );

			} else {

				alert( "Couldn't load [" + url + "] [" + xhr.status + "]" );

			}

		} else if ( xhr.readyState == 3 ) {

			if ( callback_progress ) {

				if ( length == 0 ) {

					length = xhr.getResponseHeader( "Content-Length" );

				}

				callback_progress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState == 2 ) {

			length = xhr.getResponseHeader( "Content-Length" );

		}

	};

	xhr.open("GET", url, true);
	xhr.overrideMimeType("text/plain; charset=x-user-defined");
	xhr.setRequestHeader("Content-Type", "text/plain");
	xhr.send(null);

};

THREE.BinaryLoader.prototype.createBinModel = function ( data, callback, texture_path, materials ) {

	var Model = function ( texture_path ) {

		//var s = (new Date).getTime();

		var scope = this,
			currentOffset = 0,
			md,
			normals = [],
			uvs = [],
			tri_b, tri_c, tri_m, tri_na, tri_nb, tri_nc,
			quad_b, quad_c, quad_d, quad_m, quad_na, quad_nb, quad_nc, quad_nd,
			tri_uvb, tri_uvc, quad_uvb, quad_uvc, quad_uvd,
			start_tri_flat, start_tri_smooth, start_tri_flat_uv, start_tri_smooth_uv,
			start_quad_flat, start_quad_smooth, start_quad_flat_uv, start_quad_smooth_uv,
			tri_size, quad_size,
			len_tri_flat, len_tri_smooth, len_tri_flat_uv, len_tri_smooth_uv,
			len_quad_flat, len_quad_smooth, len_quad_flat_uv, len_quad_smooth_uv;


		THREE.Geometry.call( this );

		THREE.Loader.prototype.init_materials( scope, materials, texture_path );

		md = parseMetaData( data, currentOffset );
		currentOffset += md.header_bytes;

		// cache offsets

		tri_b   = md.vertex_index_bytes,
		tri_c   = md.vertex_index_bytes*2,
		tri_m   = md.vertex_index_bytes*3,
		tri_na  = md.vertex_index_bytes*3 + md.material_index_bytes,
		tri_nb  = md.vertex_index_bytes*3 + md.material_index_bytes + md.normal_index_bytes,
		tri_nc  = md.vertex_index_bytes*3 + md.material_index_bytes + md.normal_index_bytes*2,

		quad_b  = md.vertex_index_bytes,
		quad_c  = md.vertex_index_bytes*2,
		quad_d  = md.vertex_index_bytes*3,
		quad_m  = md.vertex_index_bytes*4,
		quad_na = md.vertex_index_bytes*4 + md.material_index_bytes,
		quad_nb = md.vertex_index_bytes*4 + md.material_index_bytes + md.normal_index_bytes,
		quad_nc = md.vertex_index_bytes*4 + md.material_index_bytes + md.normal_index_bytes*2,
		quad_nd = md.vertex_index_bytes*4 + md.material_index_bytes + md.normal_index_bytes*3,

		tri_uvb = md.uv_index_bytes,
		tri_uvc = md.uv_index_bytes * 2,

		quad_uvb = md.uv_index_bytes,
		quad_uvc = md.uv_index_bytes * 2,
		quad_uvd = md.uv_index_bytes * 3;

		// buffers sizes

		tri_size =  md.vertex_index_bytes * 3 + md.material_index_bytes;
		quad_size = md.vertex_index_bytes * 4 + md.material_index_bytes;

		len_tri_flat      = md.ntri_flat      * ( tri_size );
		len_tri_smooth    = md.ntri_smooth    * ( tri_size + md.normal_index_bytes * 3 );
		len_tri_flat_uv   = md.ntri_flat_uv   * ( tri_size + md.uv_index_bytes * 3 );
		len_tri_smooth_uv = md.ntri_smooth_uv * ( tri_size + md.normal_index_bytes * 3 + md.uv_index_bytes * 3 );

		len_quad_flat      = md.nquad_flat      * ( quad_size );
		len_quad_smooth    = md.nquad_smooth    * ( quad_size + md.normal_index_bytes * 4 );
		len_quad_flat_uv   = md.nquad_flat_uv   * ( quad_size + md.uv_index_bytes * 4 );
		len_quad_smooth_uv = md.nquad_smooth_uv * ( quad_size + md.normal_index_bytes * 4 + md.uv_index_bytes * 4 );

		// read buffers

		currentOffset += init_vertices( currentOffset );
		currentOffset += init_normals( currentOffset );
		currentOffset += init_uvs( currentOffset );

		start_tri_flat 		= currentOffset;
		start_tri_smooth    = start_tri_flat    + len_tri_flat;
		start_tri_flat_uv   = start_tri_smooth  + len_tri_smooth;
		start_tri_smooth_uv = start_tri_flat_uv + len_tri_flat_uv;

		start_quad_flat     = start_tri_smooth_uv + len_tri_smooth_uv;
		start_quad_smooth   = start_quad_flat     + len_quad_flat;
		start_quad_flat_uv  = start_quad_smooth   + len_quad_smooth;
		start_quad_smooth_uv= start_quad_flat_uv  +len_quad_flat_uv;

		// have to first process faces with uvs
		// so that face and uv indices match

		init_triangles_flat_uv( start_tri_flat_uv );
		init_triangles_smooth_uv( start_tri_smooth_uv );

		init_quads_flat_uv( start_quad_flat_uv );
		init_quads_smooth_uv( start_quad_smooth_uv );

		// now we can process untextured faces

		init_triangles_flat( start_tri_flat );
		init_triangles_smooth( start_tri_smooth );

		init_quads_flat( start_quad_flat );
		init_quads_smooth( start_quad_smooth );

		this.computeCentroids();
		this.computeFaceNormals();

		if ( THREE.Loader.prototype.hasNormals( this ) ) this.computeTangents();

		//var e = (new Date).getTime();

		//log( "binary data parse time: " + (e-s) + " ms" );

		function parseMetaData( data, offset ) {

			var metaData = {

				'signature'               :parseString( data, offset, 8 ),
				'header_bytes'            :parseUChar8( data, offset + 8 ),

				'vertex_coordinate_bytes' :parseUChar8( data, offset + 9 ),
				'normal_coordinate_bytes' :parseUChar8( data, offset + 10 ),
				'uv_coordinate_bytes'     :parseUChar8( data, offset + 11 ),

				'vertex_index_bytes'      :parseUChar8( data, offset + 12 ),
				'normal_index_bytes'      :parseUChar8( data, offset + 13 ),
				'uv_index_bytes'          :parseUChar8( data, offset + 14 ),
				'material_index_bytes'    :parseUChar8( data, offset + 15 ),

				'nvertices'    :parseUInt32( data, offset + 16 ),
				'nnormals'     :parseUInt32( data, offset + 16 + 4*1 ),
				'nuvs'         :parseUInt32( data, offset + 16 + 4*2 ),

				'ntri_flat'      :parseUInt32( data, offset + 16 + 4*3 ),
				'ntri_smooth'    :parseUInt32( data, offset + 16 + 4*4 ),
				'ntri_flat_uv'   :parseUInt32( data, offset + 16 + 4*5 ),
				'ntri_smooth_uv' :parseUInt32( data, offset + 16 + 4*6 ),

				'nquad_flat'      :parseUInt32( data, offset + 16 + 4*7 ),
				'nquad_smooth'    :parseUInt32( data, offset + 16 + 4*8 ),
				'nquad_flat_uv'   :parseUInt32( data, offset + 16 + 4*9 ),
				'nquad_smooth_uv' :parseUInt32( data, offset + 16 + 4*10 )

			};

			/*
			log( "signature: " + metaData.signature );

			log( "header_bytes: " + metaData.header_bytes );
			log( "vertex_coordinate_bytes: " + metaData.vertex_coordinate_bytes );
			log( "normal_coordinate_bytes: " + metaData.normal_coordinate_bytes );
			log( "uv_coordinate_bytes: " + metaData.uv_coordinate_bytes );

			log( "vertex_index_bytes: " + metaData.vertex_index_bytes );
			log( "normal_index_bytes: " + metaData.normal_index_bytes );
			log( "uv_index_bytes: " + metaData.uv_index_bytes );
			log( "material_index_bytes: " + metaData.material_index_bytes );

			log( "nvertices: " + metaData.nvertices );
			log( "nnormals: " + metaData.nnormals );
			log( "nuvs: " + metaData.nuvs );

			log( "ntri_flat: " + metaData.ntri_flat );
			log( "ntri_smooth: " + metaData.ntri_smooth );
			log( "ntri_flat_uv: " + metaData.ntri_flat_uv );
			log( "ntri_smooth_uv: " + metaData.ntri_smooth_uv );

			log( "nquad_flat: " + metaData.nquad_flat );
			log( "nquad_smooth: " + metaData.nquad_smooth );
			log( "nquad_flat_uv: " + metaData.nquad_flat_uv );
			log( "nquad_smooth_uv: " + metaData.nquad_smooth_uv );

			var total = metaData.header_bytes
					  + metaData.nvertices * metaData.vertex_coordinate_bytes * 3
					  + metaData.nnormals * metaData.normal_coordinate_bytes * 3
					  + metaData.nuvs * metaData.uv_coordinate_bytes * 2
					  + metaData.ntri_flat * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes )
					  + metaData.ntri_smooth * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.normal_index_bytes*3 )
					  + metaData.ntri_flat_uv * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.uv_index_bytes*3 )
					  + metaData.ntri_smooth_uv * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.normal_index_bytes*3 + metaData.uv_index_bytes*3 )
					  + metaData.nquad_flat * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes )
					  + metaData.nquad_smooth * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.normal_index_bytes*4 )
					  + metaData.nquad_flat_uv * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.uv_index_bytes*4 )
					  + metaData.nquad_smooth_uv * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.normal_index_bytes*4 + metaData.uv_index_bytes*4 );
			log( "total bytes: " + total );
			*/

			return metaData;

		};

		function parseString( data, offset, length ) {

			return data.substr( offset, length );

		};

		function parseFloat32( data, offset ) {

			var b3 = parseUChar8( data, offset ),
				b2 = parseUChar8( data, offset + 1 ),
				b1 = parseUChar8( data, offset + 2 ),
				b0 = parseUChar8( data, offset + 3 ),

				sign = 1 - ( 2 * ( b0 >> 7 ) ),
				exponent = ((( b0 << 1 ) & 0xff) | ( b1 >> 7 )) - 127,
				mantissa = (( b1 & 0x7f ) << 16) | (b2 << 8) | b3;

				if (mantissa == 0 && exponent == -127)
					return 0.0;

				return sign * ( 1 + mantissa * Math.pow( 2, -23 ) ) * Math.pow( 2, exponent );

		};

		function parseUInt32( data, offset ) {

			var b0 = parseUChar8( data, offset ),
				b1 = parseUChar8( data, offset + 1 ),
				b2 = parseUChar8( data, offset + 2 ),
				b3 = parseUChar8( data, offset + 3 );

			return (b3 << 24) + (b2 << 16) + (b1 << 8) + b0;

		};

		function parseUInt16( data, offset ) {

			var b0 = parseUChar8( data, offset ),
				b1 = parseUChar8( data, offset + 1 );

			return (b1 << 8) + b0;

		};

		function parseSChar8( data, offset ) {

			var b = parseUChar8( data, offset );
			return b > 127 ? b - 256 : b;

		};

		function parseUChar8( data, offset ) {

			return data.charCodeAt( offset ) & 0xff;

		};

		function init_vertices( start ) {

			var i, x, y, z,
				stride = md.vertex_coordinate_bytes * 3,
				end = start + md.nvertices * stride;

			for( i = start; i < end; i += stride ) {

				x = parseFloat32( data, i );
				y = parseFloat32( data, i + md.vertex_coordinate_bytes );
				z = parseFloat32( data, i + md.vertex_coordinate_bytes*2 );

				vertex( scope, x, y, z );

			}

			return md.nvertices * stride;

		};

		function init_normals( start ) {

			var i, x, y, z,
				stride = md.normal_coordinate_bytes * 3,
				end = start + md.nnormals * stride;

			for( i = start; i < end; i += stride ) {

				x = parseSChar8( data, i );
				y = parseSChar8( data, i + md.normal_coordinate_bytes );
				z = parseSChar8( data, i + md.normal_coordinate_bytes*2 );

				normals.push( x/127, y/127, z/127 );

			}

			return md.nnormals * stride;

		};

		function init_uvs( start ) {

			var i, u, v,
				stride = md.uv_coordinate_bytes * 2,
				end = start + md.nuvs * stride;

			for( i = start; i < end; i += stride ) {

				u = parseFloat32( data, i );
				v = parseFloat32( data, i + md.uv_coordinate_bytes );

				uvs.push( u, v );

			}

			return md.nuvs * stride;

		};

		function add_tri( i ) {

			var a, b, c, m;

			a = parseUInt32( data, i );
			b = parseUInt32( data, i + tri_b );
			c = parseUInt32( data, i + tri_c );

			m = parseUInt16( data, i + tri_m );

			f3( scope, a, b, c, m );

		};

		function add_tri_n( i ) {

			var a, b, c, m, na, nb, nc;

			a  = parseUInt32( data, i );
			b  = parseUInt32( data, i + tri_b );
			c  = parseUInt32( data, i + tri_c );

			m  = parseUInt16( data, i + tri_m );

			na = parseUInt32( data, i + tri_na );
			nb = parseUInt32( data, i + tri_nb );
			nc = parseUInt32( data, i + tri_nc );

			f3n( scope, normals, a, b, c, m, na, nb, nc );

		};

		function add_quad( i ) {

			var a, b, c, d, m;

			a = parseUInt32( data, i );
			b = parseUInt32( data, i + quad_b );
			c = parseUInt32( data, i + quad_c );
			d = parseUInt32( data, i + quad_d );

			m = parseUInt16( data, i + quad_m );

			f4( scope, a, b, c, d, m );

		};

		function add_quad_n( i ) {

			var a, b, c, d, m, na, nb, nc, nd;

			a  = parseUInt32( data, i );
			b  = parseUInt32( data, i + quad_b );
			c  = parseUInt32( data, i + quad_c );
			d  = parseUInt32( data, i + quad_d );

			m  = parseUInt16( data, i + quad_m );

			na = parseUInt32( data, i + quad_na );
			nb = parseUInt32( data, i + quad_nb );
			nc = parseUInt32( data, i + quad_nc );
			nd = parseUInt32( data, i + quad_nd );

			f4n( scope, normals, a, b, c, d, m, na, nb, nc, nd );

		};

		function add_uv3( i ) {

			var uva, uvb, uvc, u1, u2, u3, v1, v2, v3;

			uva = parseUInt32( data, i );
			uvb = parseUInt32( data, i + tri_uvb );
			uvc = parseUInt32( data, i + tri_uvc );

			u1 = uvs[ uva*2 ];
			v1 = uvs[ uva*2 + 1 ];

			u2 = uvs[ uvb*2 ];
			v2 = uvs[ uvb*2 + 1 ];

			u3 = uvs[ uvc*2 ];
			v3 = uvs[ uvc*2 + 1 ];

			uv3( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3 );

		};

		function add_uv4( i ) {

			var uva, uvb, uvc, uvd, u1, u2, u3, u4, v1, v2, v3, v4;

			uva = parseUInt32( data, i );
			uvb = parseUInt32( data, i + quad_uvb );
			uvc = parseUInt32( data, i + quad_uvc );
			uvd = parseUInt32( data, i + quad_uvd );

			u1 = uvs[ uva*2 ];
			v1 = uvs[ uva*2 + 1 ];

			u2 = uvs[ uvb*2 ];
			v2 = uvs[ uvb*2 + 1 ];

			u3 = uvs[ uvc*2 ];
			v3 = uvs[ uvc*2 + 1 ];

			u4 = uvs[ uvd*2 ];
			v4 = uvs[ uvd*2 + 1 ];

			uv4( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3, u4, v4 );

		};

		function init_triangles_flat( start ) {

			var i, stride = md.vertex_index_bytes * 3 + md.material_index_bytes,
				end = start + md.ntri_flat * stride;

			for( i = start; i < end; i += stride ) {

				add_tri( i );

			}

			return end - start;

		}

		function init_triangles_flat_uv( start ) {

			var i, offset = md.vertex_index_bytes * 3 + md.material_index_bytes,
				stride = offset + md.uv_index_bytes * 3,
				end = start + md.ntri_flat_uv * stride;

			for( i = start; i < end; i += stride ) {

				add_tri( i );
				add_uv3( i + offset );

			}

			return end - start;

		};

		function init_triangles_smooth( start ) {

			var i, stride = md.vertex_index_bytes * 3 + md.material_index_bytes + md.normal_index_bytes * 3,
				end = start + md.ntri_smooth * stride;

			for( i = start; i < end; i += stride ) {

				add_tri_n( i );

			}

			return end - start;

		};

		function init_triangles_smooth_uv( start ) {

			var i, offset = md.vertex_index_bytes * 3 + md.material_index_bytes + md.normal_index_bytes * 3,
				stride = offset + md.uv_index_bytes * 3,
				end = start + md.ntri_smooth_uv * stride;

			for( i = start; i < end; i += stride ) {

				add_tri_n( i );
				add_uv3( i + offset );

			}

			return end - start;

		};

		function init_quads_flat( start ) {

			var i, stride = md.vertex_index_bytes * 4 + md.material_index_bytes,
				end = start + md.nquad_flat * stride;

			for( i = start; i < end; i += stride ) {

				add_quad( i );

			}

			return end - start;

		};

		function init_quads_flat_uv( start ) {

			var i, offset = md.vertex_index_bytes * 4 + md.material_index_bytes,
				stride = offset + md.uv_index_bytes * 4,
				end = start + md.nquad_flat_uv * stride;

			for( i = start; i < end; i += stride ) {

				add_quad( i );
				add_uv4( i + offset );

			}

			return end - start;

		};

		function init_quads_smooth( start ) {

			var i, stride = md.vertex_index_bytes * 4 + md.material_index_bytes + md.normal_index_bytes * 4,
				end = start + md.nquad_smooth * stride;

			for( i = start; i < end; i += stride ) {

				add_quad_n( i );

			}

			return end - start;

		};

		function init_quads_smooth_uv( start ) {

			var i, offset = md.vertex_index_bytes * 4 + md.material_index_bytes + md.normal_index_bytes * 4,
				stride = offset + md.uv_index_bytes * 4,
				end = start + md.nquad_smooth_uv * stride;

			for( i = start; i < end; i += stride ) {

				add_quad_n( i );
				add_uv4( i + offset );

			}

			return end - start;

		};

	};

	function vertex ( scope, x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	};

	function f3 ( scope, a, b, c, mi ) {

		var material = scope.materials[ mi ];
		scope.faces.push( new THREE.Face3( a, b, c, null, null, material ) );

	};

	function f4 ( scope, a, b, c, d, mi ) {

		var material = scope.materials[ mi ];
		scope.faces.push( new THREE.Face4( a, b, c, d, null, null, material ) );

	};

	function f3n ( scope, normals, a, b, c, mi, na, nb, nc ) {

		var material = scope.materials[ mi ],
			nax = normals[ na*3     ],
			nay = normals[ na*3 + 1 ],
			naz = normals[ na*3 + 2 ],

			nbx = normals[ nb*3     ],
			nby = normals[ nb*3 + 1 ],
			nbz = normals[ nb*3 + 2 ],

			ncx = normals[ nc*3     ],
			ncy = normals[ nc*3 + 1 ],
			ncz = normals[ nc*3 + 2 ];

		scope.faces.push( new THREE.Face3( a, b, c,
						  [new THREE.Vector3( nax, nay, naz ),
						   new THREE.Vector3( nbx, nby, nbz ),
						   new THREE.Vector3( ncx, ncy, ncz )],
						  null,
						  material ) );

	};

	function f4n ( scope, normals, a, b, c, d, mi, na, nb, nc, nd ) {

		var material = scope.materials[ mi ],
			nax = normals[ na*3     ],
			nay = normals[ na*3 + 1 ],
			naz = normals[ na*3 + 2 ],

			nbx = normals[ nb*3     ],
			nby = normals[ nb*3 + 1 ],
			nbz = normals[ nb*3 + 2 ],

			ncx = normals[ nc*3     ],
			ncy = normals[ nc*3 + 1 ],
			ncz = normals[ nc*3 + 2 ],

			ndx = normals[ nd*3     ],
			ndy = normals[ nd*3 + 1 ],
			ndz = normals[ nd*3 + 2 ];

		scope.faces.push( new THREE.Face4( a, b, c, d,
						  [new THREE.Vector3( nax, nay, naz ),
						   new THREE.Vector3( nbx, nby, nbz ),
						   new THREE.Vector3( ncx, ncy, ncz ),
						   new THREE.Vector3( ndx, ndy, ndz )],
						  null,
						  material ) );

	};

	function uv3 ( where, u1, v1, u2, v2, u3, v3 ) {

		var uv = [];
		uv.push( new THREE.UV( u1, v1 ) );
		uv.push( new THREE.UV( u2, v2 ) );
		uv.push( new THREE.UV( u3, v3 ) );
		where.push( uv );

	};

	function uv4 ( where, u1, v1, u2, v2, u3, v3, u4, v4 ) {

		var uv = [];
		uv.push( new THREE.UV( u1, v1 ) );
		uv.push( new THREE.UV( u2, v2 ) );
		uv.push( new THREE.UV( u3, v3 ) );
		uv.push( new THREE.UV( u4, v4 ) );
		where.push( uv );

	};

	Model.prototype = new THREE.Geometry();
	Model.prototype.constructor = Model;

	callback( new Model( texture_path ) );

};
/**
 * @author Tim Knip / http://www.floorplanner.com/ / tim at floorplanner.com
 */

THREE.ColladaLoader = function () {

	var COLLADA = null;
	var scene = null;
	var daeScene;

	var readyCallbackFunc = null;

 	var sources = {};
	var images = {};
	var animations = {};
	var controllers = {};
	var geometries = {};
	var materials = {};
	var effects = {};

	var visualScenes;
	var baseUrl;
	var morphs;
	var skins;

	var flip_uv = true;
	var preferredShading = THREE.SmoothShading;

	function load ( url, readyCallback ) {

		if ( document.implementation && document.implementation.createDocument ) {

			var namespaceURL = "http://www.collada.org/2005/11/COLLADASchema";
			var rootTagName = "COLLADA";

			var xmldoc = document.implementation.createDocument( namespaceURL, rootTagName, null );
			var me = this;

			// force reloading
			// (should be configurable? sometimes caching is desirable)

			url += "?rnd=" + Math.random();

			var req = new XMLHttpRequest();

			if( req.overrideMimeType ) {

				// need this? yes... if extension is other then *.xml :-S

				req.overrideMimeType( "text/xml" );

			}

			req.onreadystatechange = function() {

				if( req.readyState == 4 ) {

					if( req.status == 0 || req.status == 200 ) {

						readyCallbackFunc = readyCallback;
						parse( req.responseXML, undefined, url );

					}

				}

			}

			req.open( "GET", url, true );
			req.send( null );

		} else {

			alert( "Don't know how to parse XML!" );

		}

	};

	function parse ( doc, callBack, url ) {

		COLLADA = doc;
		callBack = callBack || readyCallbackFunc;

		if ( url !== undefined ) {

			var parts = url.split( '/' );
			parts.pop();
			baseUrl = parts.length < 1 ? '' : parts.join( '/' ) + '/';

		}

		images = parseLib( "//dae:library_images/dae:image", _Image, "image" );
		materials = parseLib( "//dae:library_materials/dae:material", Material, "material") ;
		effects = parseLib( "//dae:library_effects/dae:effect", Effect, "effect" );
		geometries = parseLib( "//dae:library_geometries/dae:geometry", Geometry, "geometry" );
		controllers = parseLib( "//dae:library_controllers/dae:controller", Controller, "controller" );
		animations = parseLib( "//dae:library_animations/dae:animation", Animation, "animation" );
		visualScenes = parseLib( ".//dae:library_visual_scenes/dae:visual_scene", VisualScene, "visual_scene" );

		morphs = [];
		skins = [];

		daeScene = parseScene();
		scene = new THREE.Object3D();

		for ( var i = 0; i < daeScene.nodes.length; i ++ ) {

			scene.add( createSceneGraph( daeScene.nodes[ i ] ) );

		}

		createAnimations();

		var result = {

			scene: scene,
			morphs: morphs,
			skins: skins,
			dae: {
				images: images,
				materials: materials,
				effects: effects,
				geometries: geometries,
				controllers: controllers,
				animations: animations,
				visualScenes: visualScenes,
				scene: daeScene
			}

		};

		if ( callBack ) {

			callBack( result );

		}

		return result;

	};

	function setPreferredShading ( shading ) {

		preferredShading = shading;

	};

	function parseLib ( q, classSpec, prefix ) {

		var elements = COLLADA.evaluate(q,
										COLLADA,
										_nsResolver,
										XPathResult.ORDERED_NODE_ITERATOR_TYPE,
										null) ;

		var lib = {};
		var element = elements.iterateNext();
		var i = 0;

		while ( element ) {

			var daeElement = ( new classSpec() ).parse( element );
			if ( daeElement.id.length == 0 ) daeElement.id = prefix + ( i++ );
			lib[ daeElement.id ] = daeElement;
			element = elements.iterateNext();

		}

		return lib;

	};

	function parseScene () {

		var sceneElement = COLLADA.evaluate( ".//dae:scene/dae:instance_visual_scene",
			COLLADA,
			_nsResolver,
			XPathResult.ORDERED_NODE_ITERATOR_TYPE,
			null ).iterateNext();

		if ( sceneElement ) {

			var url = sceneElement.getAttribute( 'url' ).replace( /^#/, '' );
			return visualScenes[ url ];

		} else {

			return null;

		}

	};

	function createAnimations () {

		calcAnimationBounds();

		for ( var animation_id in animations ) {

			createAnimation( animations[ animation_id ] );

		}

	};

	function createAnimation ( animation ) {

	};

	function calcAnimationBounds () {

		var start = 1000000;
		var end = -start;
		var frames = 0;

		for ( var id in animations ) {

			var animation = animations[ id ];

			for ( var i = 0; i < animation.sampler.length; i ++ ) {

				var sampler = animation.sampler[ i ];
				sampler.create();

				start = Math.min( start, sampler.startTime );
				end = Math.max( end, sampler.endTime );
				frames = Math.max( frames, sampler.input.length );

			}

		}

		return { start:start, end:end, frames:frames };

	};

	function createMorph ( geometry, ctrl ) {

		var morphCtrl = ctrl instanceof InstanceController ? controllers[ ctrl.url ] : ctrl;

		if ( !morphCtrl || !morphCtrl.morph ) {

			console.log("could not find morph controller!");
			return;

		}

		var morph = morphCtrl.morph;

		for ( var i = 0; i < morph.targets.length; i ++ ) {

			var target_id = morph.targets[ i ];
			var daeGeometry = geometries[ target_id ];

			if ( !daeGeometry.mesh ||
				 !daeGeometry.mesh.primitives ||
				 !daeGeometry.mesh.primitives.length ) {
				 continue;
			}

			var target = daeGeometry.mesh.primitives[ 0 ].geometry;

			if ( target.vertices.length === geometry.vertices.length ) {

				geometry.morphTargets.push( { name: "target_1", vertices: target.vertices } );

			}

		}

		geometry.morphTargets.push( { name: "target_Z", vertices: geometry.vertices } );

	};

	function createSkin ( geometry, ctrl, applyBindShape ) {

		var skinCtrl = controllers[ ctrl.url ];

		if ( !skinCtrl || !skinCtrl.skin ) {

			console.log( "could not find skin controller!" );
			return;

		}

		if ( !ctrl.skeleton || !ctrl.skeleton.length ) {

			console.log( "could not find the skeleton for the skin!" );
			return;

		}

		var skin = skinCtrl.skin;
		var skeleton = daeScene.getChildById( ctrl.skeleton[ 0 ] );
		var hierarchy = [];

		applyBindShape = applyBindShape !== undefined ? applyBindShape : true;

		var bones = [];
		geometry.skinWeights = [];
		geometry.skinIndices = [];

		createBones( geometry.bones, skin, hierarchy, skeleton, null, -1 );
		createWeights( skin, geometry.bones, geometry.skinIndices, geometry.skinWeights );

		/*
		geometry.animation = {
			name: 'take_001',
			fps: 30,
			length: 2,
			JIT: true,
			hierarchy: hierarchy
		};
		*/

		if ( applyBindShape ) {

			for ( var i = 0; i < geometry.vertices.length; i ++ ) {

				skin.bindShapeMatrix.multiplyVector3( geometry.vertices[ i ].position );

			}

		}

	};

	function setupSkeleton ( node, bones, frame, parent ) {

		node.world = node.world || new THREE.Matrix4();
		node.world.copy( node.matrix );

		if ( node.channels && node.channels.length ) {

			var channel = node.channels[ 0 ];
			var m = channel.sampler.output[ frame ];

			if ( m instanceof THREE.Matrix4 ) {

				node.world.copy( m );

			}

		}

		if ( parent ) {

			node.world.multiply( parent, node.world );

		}

		bones.push( node );

		for ( var i = 0; i < node.nodes.length; i ++ ) {

			setupSkeleton( node.nodes[ i ], bones, frame, node.world );

		}

	};

	function setupSkinningMatrices ( bones, skin ) {

		// FIXME: this is dumb...

		for ( var i = 0; i < bones.length; i ++ ) {

			var bone = bones[ i ];
			var found = -1;

			if ( bone.type != 'JOINT' ) continue;

			for ( var j = 0; j < skin.joints.length; j ++ ) {

				if ( bone.sid == skin.joints[ j ] ) {

					found = j;
					break;

				}

			}

			if ( found >= 0 ) {

				var inv = skin.invBindMatrices[ found ];

				bone.invBindMatrix = inv;
				bone.skinningMatrix = new THREE.Matrix4();
				bone.skinningMatrix.multiply(bone.world, inv); // (IBMi * JMi)

				bone.weights = [];

				for ( var j = 0; j < skin.weights.length; j ++ ) {

					for (var k = 0; k < skin.weights[ j ].length; k ++) {

						var w = skin.weights[ j ][ k ];

						if ( w.joint == found ) {

							bone.weights.push( w );

						}

					}

				}

			} else {

				throw 'ColladaLoader: Could not find joint \'' + bone.sid + '\'.';

			}

		}

	};

	function applySkin ( geometry, instanceCtrl, frame ) {

		var skinController = controllers[ instanceCtrl.url ];

		frame = frame !== undefined ? frame : 40;

		if ( !skinController || !skinController.skin ) {

			console.log( 'ColladaLoader: Could not find skin controller.' );
			return;

		}

		if ( !instanceCtrl.skeleton || !instanceCtrl.skeleton.length ) {

			console.log( 'ColladaLoader: Could not find the skeleton for the skin. ' );
			return;

		}

		var animationBounds = calcAnimationBounds();
		var skeleton = daeScene.getChildById( instanceCtrl.skeleton[0], true ) ||
					   daeScene.getChildBySid( instanceCtrl.skeleton[0], true );

		var i, j, w, vidx, weight;
		var v = new THREE.Vector3(), o, s;

		// move vertices to bind shape

		for ( i = 0; i < geometry.vertices.length; i ++ ) {

			skinController.skin.bindShapeMatrix.multiplyVector3( geometry.vertices[i].position );

		}

		// process animation, or simply pose the rig if no animation

		for ( frame = 0; frame < animationBounds.frames; frame ++ ) {

			var bones = [];
			var skinned = [];

			// zero skinned vertices

			for ( i = 0; i < geometry.vertices.length; i++ ) {

				skinned.push( new THREE.Vertex( new THREE.Vector3() ) );

			}

			// process the frame and setup the rig with a fresh
			// transform, possibly from the bone's animation channel(s)

			setupSkeleton( skeleton, bones, frame );
			setupSkinningMatrices( bones, skinController.skin );

			// skin 'm

			for ( i = 0; i < bones.length; i ++ ) {

				if ( bones[ i ].type != 'JOINT' ) continue;

				for ( j = 0; j < bones[ i ].weights.length; j ++ ) {

					w = bones[ i ].weights[ j ];
					vidx = w.index;
					weight = w.weight;

					o = geometry.vertices[vidx];
					s = skinned[vidx];

					v.x = o.position.x;
					v.y = o.position.y;
					v.z = o.position.z;

					bones[i].skinningMatrix.multiplyVector3(v);

					s.position.x += (v.x * weight);
					s.position.y += (v.y * weight);
					s.position.z += (v.z * weight);

				}

			}

			geometry.morphTargets.push( { name: "target_" + frame, vertices: skinned } );

		}

	};

	function createSceneGraph ( node, parent ) {

		var obj = new THREE.Object3D();
		var skinned = false;
		var skinController;
		var morphController;
		var i;

		obj.name = node.id || "";
		obj.matrixAutoUpdate = false;
		obj.matrix = node.matrix;

		// FIXME: controllers

		for ( i = 0; i < node.controllers.length; i ++ ) {

			var controller = controllers[ node.controllers[ i ].url ];

			switch ( controller.type ) {

				case 'skin':

					if ( geometries[ controller.skin.source ] ) {

						var inst_geom = new InstanceGeometry();

						inst_geom.url = controller.skin.source;
						inst_geom.instance_material = node.controllers[ i ].instance_material;

						node.geometries.push( inst_geom );
						skinned = true;
						skinController = node.controllers[ i ];

					} else if ( controllers[ controller.skin.source ] ) {

						// urgh: controller can be chained
						// handle the most basic case...

						var second = controllers[ controller.skin.source ];
						morphController = second;
					//	skinController = node.controllers[i];

						if ( second.morph && geometries[ second.morph.source ] ) {

							var inst_geom = new InstanceGeometry();

							inst_geom.url = second.morph.source;
							inst_geom.instance_material = node.controllers[ i ].instance_material;

							node.geometries.push( inst_geom );

						}

					}

					break;

				case 'morph':

					if ( geometries[ controller.morph.source ] ) {

						var inst_geom = new InstanceGeometry();

						inst_geom.url = controller.morph.source;
						inst_geom.instance_material = node.controllers[ i ].instance_material;

						node.geometries.push( inst_geom );
						morphController = node.controllers[ i ];

					}

					console.log( 'ColladaLoader: Morph-controller partially supported.' );

				default:
					break;

			}

		}

		// FIXME: multi-material mesh?
		// geometries

		for ( i = 0; i < node.geometries.length; i ++ ) {

			var instance_geometry = node.geometries[i];
			var instance_materials = instance_geometry.instance_material;
			var geometry = geometries[instance_geometry.url];
			var used_materials = {};
			var num_materials = 0;
			var first_material;

			if ( geometry ) {

				if ( !geometry.mesh || !geometry.mesh.primitives )
					continue;

				if ( obj.name.length == 0 ) {

					obj.name = geometry.id;

				}

				// collect used fx for this geometry-instance

				if ( instance_materials ) {

					for ( j = 0; j < instance_materials.length; j ++ ) {

						var inst_material = instance_materials[j];
						var effect_id = materials[inst_material.target].instance_effect.url;
						var shader = effects[effect_id].shader;

						shader.material.opacity = !shader.material.opacity ? 1 : shader.material.opacity;
						used_materials[inst_material.symbol] = shader.material;
						first_material = shader.material;
						num_materials ++;

					}

				}

				var mesh;
				var material = first_material || new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.FlatShading } );
				var geom = geometry.mesh.geometry3js;

				if ( num_materials > 1 ) {

					material = new THREE.MeshFaceMaterial();

					for ( j = 0; j < geom.faces.length; j ++ ) {

						var face = geom.faces[ j ];
						face.materials = [ used_materials[ face.daeMaterial ] ];

					}

				}

				if ( skinController !== undefined) {

					applySkin( geom, skinController );

					material.morphTargets = true;

					mesh = new THREE.SkinnedMesh( geom, material );
					mesh.skeleton = skinController.skeleton;
					mesh.skinController = controllers[ skinController.url ];
					mesh.skinInstanceController = skinController;
					mesh.name = 'skin_' + skins.length;

					skins.push( mesh );

				} else if ( morphController !== undefined ) {

					createMorph( geom, morphController );

					material.morphTargets = true;

					mesh = new THREE.Mesh( geom, material );
					mesh.name = 'morph_' + morphs.length;

					morphs.push( mesh );

				} else {

					mesh = new THREE.Mesh( geom, material );

				}

				obj.add( mesh );

			}

		}

		for ( i = 0; i < node.nodes.length; i ++ ) {

			obj.add( createSceneGraph( node.nodes[i], node ) );

		}

		return obj;

	};

	function getJointId( skin, id ) {

		for ( var i = 0; i < skin.joints.length; i ++ ) {

			if ( skin.joints[ i ] == id ) {

				return i;

			}

		}

	};

	function getLibraryNode( id ) {

		return COLLADA.evaluate(".//dae:library_nodes//dae:node[@id='"+id+"']",
								COLLADA,
								_nsResolver,
								XPathResult.ORDERED_NODE_ITERATOR_TYPE,
								null).iterateNext();

	};

	function getChannelsForNode (node ) {

		var channels = [];
		var startTime = 1000000;
		var endTime = -1000000;

		for ( var id in animations ) {

			var animation = animations[id];

			for ( var i = 0; i < animation.channel.length; i ++ ) {

				var channel = animation.channel[i];
				var sampler = animation.sampler[i];
				var id = channel.target.split('/')[0];

				if ( id == node.id ) {

					sampler.create();
					channel.sampler = sampler;
					startTime = Math.min(startTime, sampler.startTime);
					endTime = Math.max(endTime, sampler.endTime);
					channels.push(channel);

				}

			}

		}

		if ( channels.length ) {

			node.startTime = startTime;
			node.endTime = endTime;

		}

		return channels;

	};

	function calcFrameDuration( node ) {

		var minT = 10000000;

		for ( i = 0; i < node.channels.length; i ++ ) {

			var sampler = node.channels[i].sampler;

			for (var j = 0; j < sampler.input.length - 1; j ++ ) {

				var t0 = sampler.input[j];
				var t1 = sampler.input[j+1];
				minT = Math.min(minT, t1 - t0);

			}
		}

		return minT;

	};

	function calcMatrixAt( node, t ) {

		var animated = {};

		var i, j;

		for ( i = 0; i < node.channels.length; i ++ ) {

			var channel = node.channels[ i ];
			animated[ channel.sid ] = channel;

		}

		var matrix = new THREE.Matrix4();

		for ( i = 0; i < node.transforms.length; i ++ ) {

			var transform = node.transforms[i];
			var channel = animated[transform.sid];

			if ( channel !== undefined ) {

				var sampler = channel.sampler;
				var value;

				for ( var j = 0; j < sampler.input.length - 1; j ++ ) {

					if ( sampler.input[j+1] > t ) {

						value = sampler.output[j];
						//console.log(value.flatten)
						break;

					}

				}

				if ( value !== undefined ) {

					if ( value instanceof THREE.Matrix4 ) {

						matrix = matrix.multiply( matrix, value );

					} else {

						// FIXME: handle other types

						matrix = matrix.multiply( matrix, transform.matrix );

					}

				} else {

					matrix = matrix.multiply( matrix, transform.matrix );

				}

			} else {

				matrix = matrix.multiply( matrix, transform.matrix );

			}

		}

		return matrix;

	};

	function bakeAnimations ( node ) {

		if ( node.channels && node.channels.length ) {

			var frameDuration = calcFrameDuration( node );
			var t, matrix;
			var keys = [];

			for ( t = node.startTime; t < node.endTime; t += frameDuration ) {

				matrix = calcMatrixAt( node, t );

				//keys.push({time: t, mat: matrix.flatten()})

				keys.push({
					time: t,
					pos: [matrix.n14, matrix.n24, matrix.n34],
					rotq: [0, 0, 0, 1],
					scl: [1,1,1]
				});

			}

			node.keys = keys;

		}

	};

	function _Image() {

		this.id = "";
		this.init_from = "";

	};

	_Image.prototype.parse = function(element) {

		this.id = element.getAttribute('id');

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeName == 'init_from' ) {

				this.init_from = child.textContent;

			}

		}

		return this;

	};

	function Controller() {

		this.id = "";
		this.name = "";
		this.type = "";
		this.skin = null;
		this.morph = null;

	};

	Controller.prototype.parse = function( element ) {

		this.id = element.getAttribute('id');
		this.name = element.getAttribute('name');
		this.type = "none";

		for ( var i = 0; i < element.childNodes.length; i++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'skin':

					this.skin = (new Skin()).parse(child);
					this.type = child.nodeName;
					break;

				case 'morph':

					this.morph = (new Morph()).parse(child);
					this.type = child.nodeName;
					break;

				default:
					break;

			}
		}

		return this;

	};

	function Morph() {

		this.method = null;
		this.source = null;
		this.targets = null;
		this.weights = null;

	};

	Morph.prototype.parse = function( element ) {

		var sources = {};
		var inputs = [];
		var i;

		this.method = element.getAttribute( 'method' );
		this.source = element.getAttribute( 'source' ).replace( /^#/, '' );

		for ( i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'source':

					var source = ( new Source() ).parse( child );
					sources[ source.id ] = source;
					break;

				case 'targets':

					inputs = this.parseInputs( child );
					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

		for ( i = 0; i < inputs.length; i ++ ) {

			var input = inputs[ i ];
			var source = sources[ input.source ];

			switch ( input.semantic ) {

				case 'MORPH_TARGET':

					this.targets = source.read();
					break;

				case 'MORPH_WEIGHT':

					this.weights = source.read();
					break;

				default:
					break;

			}
		}

		return this;

	};

	Morph.prototype.parseInputs = function(element) {

		var inputs = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1) continue;

			switch ( child.nodeName ) {

				case 'input':

					inputs.push( (new Input()).parse(child) );
					break;

				default:
					break;
			}
		}

		return inputs;

	};

	function Skin() {

		this.source = "";
		this.bindShapeMatrix = null;
		this.invBindMatrices = [];
		this.joints = [];
		this.weights = [];

	};

	Skin.prototype.parse = function( element ) {

		var sources = {};
		var joints, weights;

		this.source = element.getAttribute( 'source' ).replace( /^#/, '' );
		this.invBindMatrices = [];
		this.joints = [];
		this.weights = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'bind_shape_matrix':

					var f = _floats(child.textContent);
					this.bindShapeMatrix = new THREE.Matrix4();
					this.bindShapeMatrix.set(
						f[0], f[1], f[2], f[3],
						f[4], f[5], f[6], f[7],
						f[8], f[9], f[10], f[11],
						f[12], f[13], f[14], f[15]
						);
					break;

				case 'source':

					var src = new Source().parse(child);
					sources[ src.id ] = src;
					break;

				case 'joints':

					joints = child;
					break;

				case 'vertex_weights':

					weights = child;
					break;

				default:

					console.log( child.nodeName );
					break;

			}
		}

		this.parseJoints( joints, sources );
		this.parseWeights( weights, sources );

		return this;

	};

	Skin.prototype.parseJoints = function ( element, sources ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'input':

					var input = ( new Input() ).parse( child );
					var source = sources[ input.source ];

					if ( input.semantic == 'JOINT' ) {

						this.joints = source.read();

					} else if ( input.semantic == 'INV_BIND_MATRIX' ) {

						this.invBindMatrices = source.read();

					}

					break;

				default:
					break;
			}

		}

	};

	Skin.prototype.parseWeights = function ( element, sources ) {

		var v, vcount, inputs = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'input':

					inputs.push( ( new Input() ).parse( child ) );
					break;

				case 'v':

					v = _ints( child.textContent );
					break;

				case 'vcount':

					vcount = _ints( child.textContent );
					break;

				default:
					break;

			}

		}

		var index = 0;

		for ( var i = 0; i < vcount.length; i ++ ) {

			var numBones = vcount[i];
			var vertex_weights = [];

			for ( var j = 0; j < numBones; j++ ) {

				var influence = {};

				for ( var k = 0; k < inputs.length; k ++ ) {

					var input = inputs[ k ];
					var value = v[ index + input.offset ];

					switch ( input.semantic ) {

						case 'JOINT':

							influence.joint = value;//this.joints[value];
							break;

						case 'WEIGHT':

							influence.weight = sources[ input.source ].data[ value ];
							break;

						default:
							break;

					}

				}

				vertex_weights.push( influence );
				index += inputs.length;
			}

			for ( var j = 0; j < vertex_weights.length; j ++ ) {

				vertex_weights[ j ].index = i;

			}

			this.weights.push( vertex_weights );

		}

	};

	function VisualScene () {

		this.id = "";
		this.name = "";
		this.nodes = [];
		this.scene = new THREE.Object3D();

	};

	VisualScene.prototype.getChildById = function( id, recursive ) {

		for ( var i = 0; i < this.nodes.length; i ++ ) {

			var node = this.nodes[ i ].getChildById( id, recursive );

			if ( node ) {

				return node;

			}

		}

		return null;

	};

	VisualScene.prototype.getChildBySid = function( sid, recursive ) {

		for ( var i = 0; i < this.nodes.length; i ++ ) {

			var node = this.nodes[ i ].getChildBySid( sid, recursive );

			if ( node ) {

				return node;

			}

		}

		return null;

	};

	VisualScene.prototype.parse = function( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );
		this.nodes = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'node':

					this.nodes.push( ( new Node() ).parse( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Node() {

		this.id = "";
		this.name = "";
		this.sid = "";
		this.nodes = [];
		this.controllers = [];
		this.transforms = [];
		this.geometries = [];
		this.channels = [];
		this.matrix = new THREE.Matrix4();

	};

	Node.prototype.getChannelForTransform = function( transformSid ) {

		for ( var i = 0; i < this.channels.length; i ++ ) {

			var channel = this.channels[i];
			var parts = channel.target.split('/');
			var id = parts.shift();
			var sid = parts.shift();
			var dotSyntax = (sid.indexOf(".") >= 0);
			var arrSyntax = (sid.indexOf("(") >= 0);
			var arrIndices;
			var member;

			if ( dotSyntax ) {

				parts = sid.split(".");
				sid = parts.shift();
				member = parts.shift();

			} else if ( arrSyntax ) {

				arrIndices = sid.split("(");
				sid = arrIndices.shift();

				for ( var j = 0; j < arrIndices.length; j ++ ) {

					arrIndices[ j ] = parseInt( arrIndices[ j ].replace( /\)/, '' ) );

				}

			}

			if ( sid == transformSid ) {

				channel.info = { sid: sid, dotSyntax: dotSyntax, arrSyntax: arrSyntax, arrIndices: arrIndices };
				return channel;

			}

		}

		return null;

	};

	Node.prototype.getChildById = function ( id, recursive ) {

		if ( this.id == id ) {

			return this;

		}

		if ( recursive ) {

			for ( var i = 0; i < this.nodes.length; i ++ ) {

				var n = this.nodes[ i ].getChildById( id, recursive );

				if ( n ) {

					return n;

				}

			}

		}

		return null;

	};

	Node.prototype.getChildBySid = function ( sid, recursive ) {

		if ( this.sid == sid ) {

			return this;

		}

		if ( recursive ) {

			for ( var i = 0; i < this.nodes.length; i ++ ) {

				var n = this.nodes[ i ].getChildBySid( sid, recursive );

				if ( n ) {

					return n;

				}

			}
		}

		return null;

	};

	Node.prototype.getTransformBySid = function ( sid ) {

		for ( var i = 0; i < this.transforms.length; i ++ ) {

			if ( this.transforms[ i ].sid == sid ) return this.transforms[ i ];

		}

		return null;

	};

	Node.prototype.parse = function( element ) {

		var url;

		this.id = element.getAttribute('id');
		this.sid = element.getAttribute('sid');
		this.name = element.getAttribute('name');
		this.type = element.getAttribute('type');

		this.type = this.type == 'JOINT' ? this.type : 'NODE';

		this.nodes = [];
		this.transforms = [];
		this.geometries = [];
		this.controllers = [];
		this.matrix = new THREE.Matrix4();

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'node':

					this.nodes.push( ( new Node() ).parse( child ) );
					break;

				case 'instance_camera':

					break;

				case 'instance_controller':

					this.controllers.push( ( new InstanceController() ).parse( child ) );
					break;

				case 'instance_geometry':

					this.geometries.push( ( new InstanceGeometry() ).parse( child ) );
					break;

				case 'instance_light':

					break;

				case 'instance_node':

					url = child.getAttribute( 'url' ).replace( /^#/, '' );
					var iNode = getLibraryNode( url );

					if ( iNode ) {

						this.nodes.push( ( new Node() ).parse( iNode )) ;

					}

					break;

				case 'rotate':
				case 'translate':
				case 'scale':
				case 'matrix':
				case 'lookat':
				case 'skew':

					this.transforms.push( ( new Transform() ).parse( child ) );
					break;

				case 'extra':
					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

		this.channels = getChannelsForNode( this );
		bakeAnimations( this );

		this.updateMatrix();

		return this;

	};

	Node.prototype.updateMatrix = function () {

		this.matrix.identity();

		for ( var i = 0; i < this.transforms.length; i ++ ) {

			this.matrix.multiply( this.matrix, this.transforms[ i ].matrix );

		}

	};

	function Transform () {

		this.sid = "";
		this.type = "";
		this.data = [];
		this.matrix = new THREE.Matrix4();

	};

	Transform.prototype.parse = function ( element ) {

		this.sid = element.getAttribute( 'sid' );
		this.type = element.nodeName;
		this.data = _floats( element.textContent );

		this.updateMatrix();

		return this;

	};

	Transform.prototype.updateMatrix = function () {

		var angle = 0;

		this.matrix.identity();

		switch ( this.type ) {

			case 'matrix':

				this.matrix.set(
					this.data[0], this.data[1], this.data[2], this.data[3],
					this.data[4], this.data[5], this.data[6], this.data[7],
					this.data[8], this.data[9], this.data[10], this.data[11],
					this.data[12], this.data[13], this.data[14], this.data[15]
					);
				break;

			case 'translate':

				this.matrix.setTranslation(this.data[0], this.data[1], this.data[2]);
				break;

			case 'rotate':

				angle = this.data[3] * (Math.PI / 180.0);
				this.matrix.setRotationAxis(new THREE.Vector3(this.data[0], this.data[1], this.data[2]), angle);
				break;

			case 'scale':

				this.matrix.setScale(this.data[0], this.data[1], this.data[2]);
				break;

			default:
				break;

		}

		return this.matrix;

	};

	function InstanceController() {

		this.url = "";
		this.skeleton = [];
		this.instance_material = [];

	};

	InstanceController.prototype.parse = function ( element ) {

		this.url = element.getAttribute('url').replace(/^#/, '');
		this.skeleton = [];
		this.instance_material = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if (child.nodeType != 1) continue;

			switch ( child.nodeName ) {

				case 'skeleton':

					this.skeleton.push( child.textContent.replace(/^#/, '') );
					break;

				case 'bind_material':

					var instances = COLLADA.evaluate(".//dae:instance_material",
														child,
														_nsResolver,
														XPathResult.ORDERED_NODE_ITERATOR_TYPE,
														null);

					if ( instances ) {

						var instance = instances.iterateNext();

						while ( instance ) {

							this.instance_material.push((new InstanceMaterial()).parse(instance));
							instance = instances.iterateNext();

						}

					}

					break;

				case 'extra':
					break;

				default:
					break;

			}
		}

		return this;

	};

	function InstanceMaterial () {

		this.symbol = "";
		this.target = "";

	};

	InstanceMaterial.prototype.parse = function ( element ) {

		this.symbol = element.getAttribute('symbol');
		this.target = element.getAttribute('target').replace(/^#/, '');
		return this;

	};

	function InstanceGeometry() {

		this.url = "";
		this.instance_material = [];

	};

	InstanceGeometry.prototype.parse = function ( element ) {

		this.url = element.getAttribute('url').replace(/^#/, '');
		this.instance_material = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1 ) continue;

			if ( child.nodeName == 'bind_material' ) {

				var instances = COLLADA.evaluate(".//dae:instance_material",
					child,
					_nsResolver,
					XPathResult.ORDERED_NODE_ITERATOR_TYPE,
					null);

				if ( instances ) {

					var instance = instances.iterateNext();

					while ( instance ) {

						this.instance_material.push( (new InstanceMaterial()).parse(instance) );
						instance = instances.iterateNext();

					}

				}

				break;

			}

		}

		return this;

	};

	function Geometry() {

		this.id = "";
		this.mesh = null;

	};

	Geometry.prototype.parse = function ( element ) {

		this.id = element.getAttribute('id');

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];

			switch ( child.nodeName ) {

				case 'mesh':

					this.mesh = (new Mesh(this)).parse(child);
					break;

				case 'extra':

					// console.log( child );
					break;

				default:
					break;
			}
		}

		return this;

	};

	function Mesh( geometry ) {

		this.geometry = geometry.id;
		this.primitives = [];
		this.vertices = null;
		this.geometry3js = null;

	};

	Mesh.prototype.parse = function( element ) {

		this.primitives = [];

		var i, j;

		for ( i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'source':

					_source( child );
					break;

				case 'vertices':

					this.vertices = ( new Vertices() ).parse( child );
					break;

				case 'triangles':

					this.primitives.push( ( new Triangles().parse( child ) ) );
					break;

				case 'polygons':

					console.warn( 'polygon holes not yet supported!' );

				case 'polylist':

					this.primitives.push( ( new Polylist().parse( child ) ) );
					break;

				default:
					break;

			}

		}

		var vertex_store = {};

		function get_vertex ( v, index )  {

			var hash = _hash_vector3( v.position );

			if ( vertex_store[ hash ] === undefined ) {

				vertex_store[ hash ] = { v: v, index: index };

			}

			return vertex_store[ hash ];

		}

		this.geometry3js = new THREE.Geometry();

		var vertexData = sources[ this.vertices.input['POSITION'].source ].data;

		for ( i = 0, j = 0; i < vertexData.length; i += 3, j ++ ) {

			var v = new THREE.Vertex( new THREE.Vector3( vertexData[ i ], vertexData[ i + 1 ], vertexData[ i + 2 ] ) );
			get_vertex( v, j );
			this.geometry3js.vertices.push( v );

		}

		for ( i = 0; i < this.primitives.length; i ++ ) {

			primitive = this.primitives[ i ];
			primitive.setVertices( this.vertices );
			this.handlePrimitive( primitive, this.geometry3js, vertex_store );

		}

		this.geometry3js.computeCentroids();
		this.geometry3js.computeFaceNormals();
		this.geometry3js.computeVertexNormals();
		this.geometry3js.computeBoundingBox();

		return this;

	};

	Mesh.prototype.handlePrimitive = function( primitive, geom, vertex_store ) {

		var i = 0, j, k, p = primitive.p, inputs = primitive.inputs;
		var input, index, idx32;
		var vcIndex = 0, vcount = 3;
		var texture_sets = [];

		for ( j = 0; j < inputs.length; j ++ ) {

			input = inputs[ j ];

			switch ( input.semantic ) {

				case 'TEXCOORD':
					texture_sets.push( input.set );
					break;

			}

		}

		while ( i < p.length ) {

			var vs = [];
			var ns = [];
			var ts = {};
			var cs = [];

			if ( primitive.vcount ) {

				vcount = primitive.vcount[ vcIndex ++ ];

			}

			for ( j = 0; j < vcount; j ++ ) {

				for ( k = 0; k < inputs.length; k ++ ) {

					input = inputs[ k ];
					source = sources[ input.source ];

					index = p[ i + ( j * inputs.length ) + input.offset ];
					numParams = source.accessor.params.length;
					idx32 = index * numParams;

					switch ( input.semantic ) {

						case 'VERTEX':

							var hash = _hash_vector3( geom.vertices[ index ].position );
							vs.push( vertex_store[ hash ].index );

							break;

						case 'NORMAL':

							ns.push( new THREE.Vector3( source.data[ idx32 ], source.data[ idx32 + 1 ], source.data[ idx32 + 2 ] ) );

							break;

						case 'TEXCOORD':

							if ( ts[ input.set ] === undefined ) ts[ input.set ] = [];
							ts[ input.set ].push( new THREE.UV( source.data[ idx32 ], source.data[ idx32 + 1 ] ) );

							break;

						case 'COLOR':

							cs.push( new THREE.Color().setRGB( source.data[ idx32 ], source.data[ idx32 + 1 ], source.data[ idx32 + 2 ] ) );

							break;

						default:
							break;

					}

				}

			}


			var face, uv;

			if ( vcount == 3 ) {

				face = new THREE.Face3( vs[0], vs[1], vs[2], [ ns[0], ns[1], ns[2] ], cs.length ? cs : new THREE.Color() );

			} else if ( vcount == 4 ) {

				face = new THREE.Face4( vs[0], vs[1], vs[2], vs[3], [ ns[0], ns[1], ns[2], ns[3] ], cs.length ? cs : new THREE.Color() );

			}
			
			face.daeMaterial = primitive.material;
			geom.faces.push( face );

			for ( k = 0; k < texture_sets.length; k ++ ) {

				uv = ts[ texture_sets[ k ] ];
				geom.faceVertexUvs[ k ].push( [ uv[0], uv[1], uv[2] ] );

			}

			i += inputs.length * vcount;

		}

	};


	function Polylist () {
	};

	Polylist.prototype = new Triangles();
	Polylist.prototype.constructor = Polylist;

	function Triangles( flip_uv ) {

		this.material = "";
		this.count = 0;
		this.inputs = [];
		this.vcount = null;
		this.p = [];
		this.geometry = new THREE.Geometry();

	};

	Triangles.prototype.setVertices = function ( vertices ) {

		for ( var i = 0; i < this.inputs.length; i ++ ) {

			if ( this.inputs[ i ].source == vertices.id ) {

				this.inputs[ i ].source = vertices.input[ 'POSITION' ].source;

			}

		}

	};

	Triangles.prototype.parse = function ( element ) {

		this.inputs = [];
		this.material = element.getAttribute( 'material' );
		this.count = _attr_as_int( element, 'count', 0 );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'input':

					this.inputs.push( ( new Input() ).parse( element.childNodes[ i ] ) );
					break;

				case 'vcount':

					this.vcount = _ints( child.textContent );
					break;

				case 'p':

					this.p = _ints( child.textContent );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Accessor() {

		this.source = "";
		this.count = 0;
		this.stride = 0;
		this.params = [];

	};

	Accessor.prototype.parse = function ( element ) {

		this.params = [];
		this.source = element.getAttribute( 'source' );
		this.count = _attr_as_int( element, 'count', 0 );
		this.stride = _attr_as_int( element, 'stride', 0 );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeName == 'param' ) {

				var param = {};
				param[ 'name' ] = child.getAttribute( 'name' );
				param[ 'type' ] = child.getAttribute( 'type' );
				this.params.push( param );

			}

		}

		return this;

	};

	function Vertices() {

		this.input = {};

	};

	Vertices.prototype.parse = function ( element ) {

		this.id = element.getAttribute('id');

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			if ( element.childNodes[i].nodeName == 'input' ) {

				input = (new Input()).parse(element.childNodes[i]);
				this.input[input.semantic] = input;

			}

		}

		return this;

	};

	function Input () {

		this.semantic = "";
		this.offset = 0;
		this.source = "";
		this.set = 0;

	};

	Input.prototype.parse = function ( element ) {

		this.semantic = element.getAttribute('semantic');
		this.source = element.getAttribute('source').replace(/^#/, '');
		this.set = _attr_as_int(element, 'set', -1);
		this.offset = _attr_as_int(element, 'offset', 0);

		if ( this.semantic == 'TEXCOORD' && this.set < 0 ) {

			this.set = 0;

		}

		return this;

	};

	function Source ( id ) {

		this.id = id;
		this.type = null;

	};

	Source.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];

			switch ( child.nodeName ) {

				case 'bool_array':

					this.data = _bools( child.textContent );
					this.type = child.nodeName;
					break;

				case 'float_array':

					this.data = _floats( child.textContent );
					this.type = child.nodeName;
					break;

				case 'int_array':

					this.data = _ints( child.textContent );
					this.type = child.nodeName;
					break;

				case 'IDREF_array':
				case 'Name_array':

					this.data = _strings( child.textContent );
					this.type = child.nodeName;
					break;

				case 'technique_common':

					for ( var j = 0; j < child.childNodes.length; j ++ ) {

						if ( child.childNodes[ j ].nodeName == 'accessor' ) {

							this.accessor = ( new Accessor() ).parse( child.childNodes[ j ] );
							break;

						}
					}
					break;

				default:
					// console.log(child.nodeName);
					break;

			}

		}

		return this;

	};

	Source.prototype.read = function () {

		var result = [];

		//for (var i = 0; i < this.accessor.params.length; i++) {

			var param = this.accessor.params[ 0 ];

			//console.log(param.name + " " + param.type);

			switch ( param.type ) {

				case 'IDREF':
				case 'Name': case 'name':
				case 'float':

					return this.data;

				case 'float4x4':

					for ( var j = 0; j < this.data.length; j += 16 ) {

						var s = this.data.slice( j, j + 16 );
						var m = new THREE.Matrix4();
						m.set(
							s[0], s[1], s[2], s[3],
							s[4], s[5], s[6], s[7],
							s[8], s[9], s[10], s[11],
							s[12], s[13], s[14], s[15]
							);
						result.push( m );
					}

					break;

				default:

					console.log( 'ColladaLoader: Source: Read dont know how to read ' + param.type + '.' );
					break;

			}

		//}

		return result;

	};

	function Material () {

		this.id = "";
		this.name = "";
		this.instance_effect = null;

	};

	Material.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			if ( element.childNodes[ i ].nodeName == 'instance_effect' ) {

				this.instance_effect = ( new InstanceEffect() ).parse( element.childNodes[ i ] );
				break;

			}

		}

		return this;

	};

	function ColorOrTexture () {

		this.color = new THREE.Color( 0 );
		this.color.setRGB( Math.random(), Math.random(), Math.random() );
		this.color.a = 1.0;

		this.texture = null;
		this.texcoord = null;

	};

	ColorOrTexture.prototype.isColor = function () {

		return ( this.texture == null );

	};

	ColorOrTexture.prototype.isTexture = function () {

		return ( this.texture != null );

	};

	ColorOrTexture.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'color':

					var rgba = _floats( child.textContent );
					this.color = new THREE.Color(0);
					this.color.setRGB( rgba[0], rgba[1], rgba[2] );
					this.color.a = rgba[3];
					break;

				case 'texture':

					this.texture = child.getAttribute('texture');
					this.texcoord = child.getAttribute('texcoord');
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Shader ( type, effect ) {

		this.type = type;
		this.effect = effect;
		this.material = null;

	};

	Shader.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'ambient':
				case 'emission':
				case 'diffuse':
				case 'specular':
				case 'transparent':

					this[ child.nodeName ] = ( new ColorOrTexture() ).parse( child );
					break;

				case 'shininess':
				case 'reflectivity':
				case 'transparency':

					var f = evaluateXPath( child, ".//dae:float" );

					if ( f.length > 0 )
						this[ child.nodeName ] = parseFloat( f[ 0 ].textContent );

					break;

				default:
					break;

			}

		}

		this.create();
		return this;

	};

	Shader.prototype.create = function() {

		var props = {};
		var transparent = ( this['transparency'] !== undefined && this['transparency'] < 1.0 );

		for ( var prop in this ) {

			switch ( prop ) {

				case 'ambient':
				case 'emission':
				case 'diffuse':
				case 'specular':

					var cot = this[prop];

					if ( cot instanceof ColorOrTexture ) {

						if ( cot.isTexture() ) {

							if ( this.effect.sampler && this.effect.surface ) {

								if ( this.effect.sampler.source == this.effect.surface.sid ) {

									var image = images[this.effect.surface.init_from];

									if ( image ) {

										props['map'] = THREE.ImageUtils.loadTexture(baseUrl + image.init_from);
										props['map'].wrapS = THREE.RepeatWrapping;
										props['map'].wrapT = THREE.RepeatWrapping;
										props['map'].repeat.x = 1;
										props['map'].repeat.y = -1;

									}

								}

							}

						} else {

							if ( prop == 'diffuse' ) {

								props[ 'color' ] = cot.color.getHex();

							} else if ( !transparent ) {

								props[ prop ] = cot.color.getHex();

							}

						}

					}

					break;

				case 'shininess':
				case 'reflectivity':

					props[ prop ] = this[ prop ];
					break;

				case 'transparency':

					if ( transparent ) {

						props[ 'transparent' ] = true;
						props[ 'opacity' ] = this[ prop ];
						transparent = true;

					}

					break;

				default:
					break;

			}

		}

		props[ 'shading' ] = preferredShading;
		this.material = new THREE.MeshLambertMaterial( props );

		switch ( this.type ) {

			case 'constant':
			case 'lambert':
				break;

			case 'phong':
			case 'blinn':

			default:

				/*
				if ( !transparent ) {

				//	this.material = new THREE.MeshPhongMaterial(props);

				}
				*/

				break;

		}

		return this.material;

	};

	function Surface ( effect ) {

		this.effect = effect;
		this.init_from = null;
		this.format = null;

	};

	Surface.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'init_from':

					this.init_from = child.textContent;
					break;

				case 'format':

					this.format = child.textContent;
					break;

				default:

					console.log( "unhandled Surface prop: " + child.nodeName );
					break;

			}

		}

		return this;

	};

	function Sampler2D ( effect ) {

		this.effect = effect;
		this.source = null;
		this.wrap_s = null;
		this.wrap_t = null;
		this.minfilter = null;
		this.magfilter = null;
		this.mipfilter = null;

	};

	Sampler2D.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'source':

					this.source = child.textContent;
					break;

				case 'minfilter':

					this.minfilter = child.textContent;
					break;

				case 'magfilter':

					this.magfilter = child.textContent;
					break;

				case 'mipfilter':

					this.mipfilter = child.textContent;
					break;

				case 'wrap_s':

					this.wrap_s = child.textContent;
					break;

				case 'wrap_t':

					this.wrap_t = child.textContent;
					break;

				default:

					console.log( "unhandled Sampler2D prop: " + child.nodeName );
					break;

			}

		}

		return this;

	};

	function Effect () {

		this.id = "";
		this.name = "";
		this.shader = null;
		this.surface = null;
		this.sampler = null;

	};

	Effect.prototype.create = function () {

		if ( this.shader == null ) {

			return null;

		}

	};

	Effect.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );
		this.shader = null;

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'profile_COMMON':

					this.parseTechnique( this.parseProfileCOMMON( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	Effect.prototype.parseNewparam = function ( element ) {

		var sid = element.getAttribute( 'sid' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'surface':

					this.surface = ( new Surface( this ) ).parse( child );
					this.surface.sid = sid;
					break;

				case 'sampler2D':

					this.sampler = ( new Sampler2D( this ) ).parse( child );
					this.sampler.sid = sid;
					break;

				case 'extra':

					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

	};

	Effect.prototype.parseProfileCOMMON = function ( element ) {

		var technique;

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'profile_COMMON':

					this.parseProfileCOMMON( child );
					break;

				case 'technique':

					technique = child;
					break;

				case 'newparam':

					this.parseNewparam( child );
					break;

				case 'extra':
					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

		return technique;

	};

	Effect.prototype.parseTechnique= function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'lambert':
				case 'blinn':
				case 'phong':

					this.shader = ( new Shader( child.nodeName, this ) ).parse( child );
					break;

				default:
					break;

			}

		}

	};

	function InstanceEffect () {

		this.url = "";

	};

	InstanceEffect.prototype.parse = function ( element ) {

		this.url = element.getAttribute( 'url' ).replace( /^#/, '' );
		return this;

	};

	function Animation() {

		this.id = "";
		this.name = "";
		this.source = {};
		this.sampler = [];
		this.channel = [];

	};

	Animation.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );
		this.source = {};

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'source':

					var src = ( new Source() ).parse( child );
					this.source[ src.id ] = src;
					break;

				case 'sampler':

					this.sampler.push( ( new Sampler( this ) ).parse( child ) );
					break;

				case 'channel':

					this.channel.push( ( new Channel( this ) ).parse( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Channel( animation ) {

		this.animation = animation;
		this.source = "";
		this.target = "";
		this.sid = null;
		this.dotSyntax = null;
		this.arrSyntax = null;
		this.arrIndices = null;
		this.member = null;

	};

	Channel.prototype.parse = function ( element ) {

		this.source = element.getAttribute( 'source' ).replace( /^#/, '' );
		this.target = element.getAttribute( 'target' );

		var parts = this.target.split( '/' );

		var id = parts.shift();
		var sid = parts.shift();

		var dotSyntax = ( sid.indexOf(".") >= 0 );
		var arrSyntax = ( sid.indexOf("(") >= 0 );

		var arrIndices;
		var member;

		if ( dotSyntax ) {

			parts = sid.split(".");
			sid = parts.shift();
			member = parts.shift();

		} else if ( arrSyntax ) {

			arrIndices = sid.split("(");
			sid = arrIndices.shift();

			for (var j = 0; j < arrIndices.length; j ++ ) {

				arrIndices[j] = parseInt( arrIndices[j].replace(/\)/, '') );

			}

		}

		this.sid = sid;
		this.dotSyntax = dotSyntax;
		this.arrSyntax = arrSyntax;
		this.arrIndices = arrIndices;
		this.member = member;

		return this;

	};

	function Sampler ( animation ) {

		this.id = "";
		this.animation = animation;
		this.inputs = [];
		this.input = null;
		this.output = null;
		this.interpolation = null;
		this.startTime = null;
		this.endTime = null;
		this.duration = 0;

	};

	Sampler.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.inputs = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'input':

					this.inputs.push( (new Input()).parse( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	Sampler.prototype.create = function () {

		for ( var i = 0; i < this.inputs.length; i ++ ) {

			var input = this.inputs[ i ];
			var source = this.animation.source[ input.source ];

			switch ( input.semantic ) {

				case 'INPUT':

					this.input = source.read();
					break;

				case 'OUTPUT':

					this.output = source.read();
					break;

				case 'INTERPOLATION':

					this.interpolation = source.read();
					break;

				case 'IN_TANGENT':

					break;

				case 'OUT_TANGENT':

					break;

				default:

					console.log(input.semantic);
					break;

			}

		}

		this.startTime = 0;
		this.endTime = 0;
		this.duration = 0;

		if ( this.input.length ) {

			this.startTime = 100000000;
			this.endTime = -100000000;

			for ( var i = 0; i < this.input.length; i ++ ) {

				this.startTime = Math.min( this.startTime, this.input[ i ] );
				this.endTime = Math.max( this.endTime, this.input[ i ] );

			}

			this.duration = this.endTime - this.startTime;

		}

	};

	function _source ( element ) {

		var id = element.getAttribute( 'id' );

		if ( sources[ id ] != undefined ) {

			return sources[ id ];

		}

		sources[ id ] = ( new Source(id )).parse( element );
		return sources[ id ];

	};

	function _nsResolver ( nsPrefix ) {

		if ( nsPrefix == "dae" ) {

			return "http://www.collada.org/2005/11/COLLADASchema";

		}

		return null;

	};

	function _bools ( str ) {

		var raw = _strings( str );
		var data = [];

		for ( var i = 0; i < raw.length; i ++ ) {

			data.push( (raw[i] == 'true' || raw[i] == '1') ? true : false );

		}

		return data;

	};

	function _floats ( str ) {

		var raw = _strings(str);
		var data = [];

		for ( var i = 0; i < raw.length; i ++ ) {

			data.push( parseFloat( raw[ i ] ) );

		}

		return data;

	};

	function _ints ( str ) {

		var raw = _strings( str );
		var data = [];

		for ( var i = 0; i < raw.length; i ++ ) {

			data.push( parseInt( raw[ i ], 10 ) );

		}

		return data;

	};

	function _strings ( str ) {

		return _trimString( str ).split( /\s+/ );

	};

	function _trimString ( str ) {

		return str.replace( /^\s+/, "" ).replace( /\s+$/, "" );

	};

	function _attr_as_float ( element, name, defaultValue ) {

		if ( element.hasAttribute( name ) ) {

			return parseFloat( element.getAttribute( name ) );

		} else {

			return defaultValue;

		}

	};

	function _attr_as_int ( element, name, defaultValue ) {

		if ( element.hasAttribute( name ) ) {

			return parseInt( element.getAttribute( name ), 10) ;

		} else {

			return defaultValue;

		}

	};

	function _attr_as_string ( element, name, defaultValue ) {

		if ( element.hasAttribute( name ) ) {

			return element.getAttribute( name );

		} else {

			return defaultValue;

		}

	};

	function _format_float ( f, num ) {

		if ( f === undefined ) {

			var s = '0.';

			while ( s.length < num + 2 ) {

				s += '0';

			}

			return s;

		}

		num = num || 2;

		var parts = f.toString().split( '.' );
		parts[ 1 ] = parts.length > 1 ? parts[ 1 ].substr( 0, num ) : "0";

		while( parts[ 1 ].length < num ) {

			parts[ 1 ] += '0';

		}

		return parts.join( '.' );

	};

	function _hash_vertex ( v, n, t0, t1, precision ) {

		precision = precision || 2;

		var s = v instanceof THREE.Vertex ? _hash_vector3( v.position, precision ) : _hash_vector3( v, precision );

		if ( n === undefined ) {

			s += '_0.00,0.00,0.00';

		} else {

			s += '_' + _hash_vector3( n, precision );

		}

		if ( t0 === undefined ) {

			s += '_0.00,0.00';

		} else {

			s += '_' + _hash_uv( t0, precision );

		}

		if ( t1 === undefined ) {

			s += '_0.00,0.00';

		} else {

			s += '_' + _hash_uv( t1, precision );

		}

		return s;

	};

	function _hash_uv ( uv, num ) {

		var s = '';

		s += _format_float( uv.u, num ) + ',';
		s += _format_float( uv.v, num );

		return s;

	};

	function _hash_vector3 ( vec, num ) {

		var s = '';

		s += _format_float( vec.x, num ) + ',';
		s += _format_float( vec.y, num ) + ',';
		s += _format_float( vec.z, num );

		return s;

	};

	function evaluateXPath ( node, query ) {

		var instances = COLLADA.evaluate(query,
			node,
			_nsResolver,
			XPathResult.ORDERED_NODE_ITERATOR_TYPE,
			null);

		var inst = instances.iterateNext();
		var result = [];

		while ( inst ) {

			result.push( inst );
			inst = instances.iterateNext();

		}

		return result;

	};

	return {

		load: load,
		setPreferredShading: setPreferredShading,
		applySkin: applySkin,
		geometries : geometries

	};

};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.JSONLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

};

THREE.JSONLoader.prototype = new THREE.Loader();
THREE.JSONLoader.prototype.constructor = THREE.JSONLoader;
THREE.JSONLoader.prototype.supr = THREE.Loader.prototype;


/**
 * Load models generated by slim OBJ converter with ASCII option (converter_obj_three_slim.py -t ascii)
 *  - parameters
 *  - model (required)
 *  - callback (required)
 *  - texture_path (optional: if not specified, textures will be assumed to be in the same folder as JS model file)
 */

THREE.JSONLoader.prototype.load = function ( parameters ) {

	var scope = this,
		url = parameters.model,
		callback = parameters.callback,
		texture_path = parameters.texture_path ? parameters.texture_path : this.extractUrlbase( url ),
		worker = new Worker( url );

	worker.onmessage = function ( event ) {

		scope.createModel( event.data, callback, texture_path );
		scope.onLoadComplete();

	};

	this.onLoadStart();
	worker.postMessage( new Date().getTime() );

};

THREE.JSONLoader.prototype.createModel = function ( json, callback, texture_path ) {

	var scope = this,
	geometry = new THREE.Geometry(),
	scale = ( json.scale !== undefined ) ? 1.0 / json.scale : 1.0;

	this.init_materials( geometry, json.materials, texture_path );

	parseModel( scale );

	parseSkin();
	parseMorphing( scale );

	geometry.computeCentroids();
	geometry.computeFaceNormals();

	if ( this.hasNormals( geometry ) ) geometry.computeTangents();


	function parseModel( scale ) {

		if ( json.version === undefined || json.version != 2 ) {

			console.error( 'Deprecated file format.' );
			return;

		}

		function isBitSet( value, position ) {

			return value & ( 1 << position );

		};

		var i, j, fi,

		offset, zLength, nVertices,

		colorIndex, normalIndex, uvIndex, materialIndex,

		type,
		isQuad,
		hasMaterial,
		hasFaceUv, hasFaceVertexUv,
		hasFaceNormal, hasFaceVertexNormal,
		hasFaceColor, hasFaceVertexColor,

		vertex, face, color, normal,

		uvLayer, uvs, u, v,

		faces = json.faces,
		vertices = json.vertices,
		normals = json.normals,
		colors = json.colors,

		nUvLayers = 0;

		// disregard empty arrays

		for ( i = 0; i < json.uvs.length; i++ ) {

			if ( json.uvs[ i ].length ) nUvLayers ++;

		}

		for ( i = 0; i < nUvLayers; i++ ) {

			geometry.faceUvs[ i ] = [];
			geometry.faceVertexUvs[ i ] = [];

		}

		offset = 0;
		zLength = vertices.length;

		while ( offset < zLength ) {

			vertex = new THREE.Vertex();

			vertex.position.x = vertices[ offset ++ ] * scale;
			vertex.position.y = vertices[ offset ++ ] * scale;
			vertex.position.z = vertices[ offset ++ ] * scale;

			geometry.vertices.push( vertex );

		}

		offset = 0;
		zLength = faces.length;

		while ( offset < zLength ) {

			type = faces[ offset ++ ];


			isQuad          	= isBitSet( type, 0 );
			hasMaterial         = isBitSet( type, 1 );
			hasFaceUv           = isBitSet( type, 2 );
			hasFaceVertexUv     = isBitSet( type, 3 );
			hasFaceNormal       = isBitSet( type, 4 );
			hasFaceVertexNormal = isBitSet( type, 5 );
			hasFaceColor	    = isBitSet( type, 6 );
			hasFaceVertexColor  = isBitSet( type, 7 );

			//console.log("type", type, "bits", isQuad, hasMaterial, hasFaceUv, hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor);

			if ( isQuad ) {

				face = new THREE.Face4();

				face.a = faces[ offset ++ ];
				face.b = faces[ offset ++ ];
				face.c = faces[ offset ++ ];
				face.d = faces[ offset ++ ];

				nVertices = 4;

			} else {

				face = new THREE.Face3();

				face.a = faces[ offset ++ ];
				face.b = faces[ offset ++ ];
				face.c = faces[ offset ++ ];

				nVertices = 3;

			}

			if ( hasMaterial ) {

				materialIndex = faces[ offset ++ ];
				face.materials = geometry.materials[ materialIndex ];

			}

			// to get face <=> uv index correspondence

			fi = geometry.faces.length;

			if ( hasFaceUv ) {

				for ( i = 0; i < nUvLayers; i++ ) {

					uvLayer = json.uvs[ i ];

					uvIndex = faces[ offset ++ ];

					u = uvLayer[ uvIndex * 2 ];
					v = uvLayer[ uvIndex * 2 + 1 ];

					geometry.faceUvs[ i ][ fi ] = new THREE.UV( u, v );

				}

			}

			if ( hasFaceVertexUv ) {

				for ( i = 0; i < nUvLayers; i++ ) {

					uvLayer = json.uvs[ i ];

					uvs = [];

					for ( j = 0; j < nVertices; j ++ ) {

						uvIndex = faces[ offset ++ ];

						u = uvLayer[ uvIndex * 2 ];
						v = uvLayer[ uvIndex * 2 + 1 ];

						uvs[ j ] = new THREE.UV( u, v );

					}

					geometry.faceVertexUvs[ i ][ fi ] = uvs;

				}

			}

			if ( hasFaceNormal ) {

				normalIndex = faces[ offset ++ ] * 3;

				normal = new THREE.Vector3();

				normal.x = normals[ normalIndex ++ ];
				normal.y = normals[ normalIndex ++ ];
				normal.z = normals[ normalIndex ];

				face.normal = normal;

			}

			if ( hasFaceVertexNormal ) {

				for ( i = 0; i < nVertices; i++ ) {

					normalIndex = faces[ offset ++ ] * 3;

					normal = new THREE.Vector3();

					normal.x = normals[ normalIndex ++ ];
					normal.y = normals[ normalIndex ++ ];
					normal.z = normals[ normalIndex ];

					face.vertexNormals.push( normal );

				}

			}


			if ( hasFaceColor ) {

				colorIndex = faces[ offset ++ ];

				color = new THREE.Color( colors[ colorIndex ] );
				face.color = color;

			}


			if ( hasFaceVertexColor ) {

				for ( i = 0; i < nVertices; i++ ) {

					colorIndex = faces[ offset ++ ];

					color = new THREE.Color( colors[ colorIndex ] );
					face.vertexColors.push( color );

				}

			}

			geometry.faces.push( face );

		}

	};

	function parseSkin() {

		var i, l, x, y, z, w, a, b, c, d;

		if ( json.skinWeights ) {

			for ( i = 0, l = json.skinWeights.length; i < l; i += 2 ) {

				x = json.skinWeights[ i     ];
				y = json.skinWeights[ i + 1 ];
				z = 0;
				w = 0;

				geometry.skinWeights.push( new THREE.Vector4( x, y, z, w ) );

			}

		}

		if ( json.skinIndices ) {

			for ( i = 0, l = json.skinIndices.length; i < l; i += 2 ) {

				a = json.skinIndices[ i     ];
				b = json.skinIndices[ i + 1 ];
				c = 0;
				d = 0;

				geometry.skinIndices.push( new THREE.Vector4( a, b, c, d ) );

			}

		}

		geometry.bones = json.bones;
		geometry.animation = json.animation;

	};

	function parseMorphing( scale ) {

		if ( json.morphTargets !== undefined ) {

			var i, l, v, vl, x, y, z, dstVertices, srcVertices;

			for ( i = 0, l = json.morphTargets.length; i < l; i++ ) {

				geometry.morphTargets[ i ] = {};
				geometry.morphTargets[ i ].name = json.morphTargets[ i ].name;
				geometry.morphTargets[ i ].vertices = [];

				dstVertices = geometry.morphTargets[ i ].vertices;
				srcVertices = json.morphTargets [ i ].vertices;

				for( v = 0, vl = srcVertices.length; v < vl; v += 3 ) {

					x = srcVertices[ v ] * scale;
					y = srcVertices[ v + 1 ] * scale;
					z = srcVertices[ v + 2 ] * scale;

					dstVertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

				}

			}

		}

		if ( json.morphColors !== undefined ) {

			var i, l, c, cl, dstColors, srcColors, color;

			for ( i = 0, l = json.morphColors.length; i < l; i++ ) {

				geometry.morphColors[ i ] = {};
				geometry.morphColors[ i ].name = json.morphColors[ i ].name;
				geometry.morphColors[ i ].colors = [];

				dstColors = geometry.morphColors[ i ].colors;
				srcColors = json.morphColors [ i ].colors;

				for ( c = 0, cl = srcColors.length; c < cl; c += 3 ) {

					color = new THREE.Color( 0xffaa00 );
					color.setRGB( srcColors[ c ], srcColors[ c + 1 ], srcColors[ c + 2 ] );
					dstColors.push( color );

				}

			}

		}

	};

	callback( geometry );

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SceneLoader = function () {

	this.onLoadStart = function () {};
	this.onLoadProgress = function() {};
	this.onLoadComplete = function () {};

	this.callbackSync = function () {};
	this.callbackProgress = function () {};

};

THREE.SceneLoader.prototype = {

	load : function ( url, callbackFinished ) {

		var scope = this;

		var worker = new Worker( url );
		worker.postMessage( 0 );

		var urlBase = THREE.Loader.prototype.extractUrlbase( url );

		worker.onmessage = function( event ) {

			var dg, dm, dd, dl, dc, df, dt,
				g, o, m, l, p, c, t, f, tt, pp,
				geometry, material, camera, fog,
				texture, images,
				materials, light,
				data, binLoader, jsonLoader,
				counter_models, counter_textures,
				total_models, total_textures,
				result;

			data = event.data;

			binLoader = new THREE.BinaryLoader();
			jsonLoader = new THREE.JSONLoader();

			counter_models = 0;
			counter_textures = 0;

			result = {

				scene: new THREE.Scene(),
				geometries: {},
				materials: {},
				textures: {},
				objects: {},
				cameras: {},
				lights: {},
				fogs: {},
				triggers: {},
				empties: {}

			};

			// find out if there are some colliders

			var hasColliders = false;

			for( dd in data.objects ) {

				o = data.objects[ dd ];

				if ( o.meshCollider )  {

					hasColliders = true;
					break;

				}

			}

			if ( hasColliders ) {

				result.scene.collisions = new THREE.CollisionSystem();

			}

			if ( data.transform ) {

				var position = data.transform.position,
					rotation = data.transform.rotation,
					scale = data.transform.scale;

				if ( position )
					result.scene.position.set( position[ 0 ], position[ 1 ], position [ 2 ] );

				if ( rotation )
					result.scene.rotation.set( rotation[ 0 ], rotation[ 1 ], rotation [ 2 ] );

				if ( scale )
					result.scene.scale.set( scale[ 0 ], scale[ 1 ], scale [ 2 ] );

				if ( position || rotation || scale )
					result.scene.updateMatrix();

			}

			function get_url( source_url, url_type ) {

				if ( url_type == "relativeToHTML" ) {

					return source_url;

				} else {

					return urlBase + "/" + source_url;

				}

			};

			function handle_objects() {

				for( dd in data.objects ) {

					if ( !result.objects[ dd ] ) {

						o = data.objects[ dd ];

						if ( o.geometry !== undefined ) {

							geometry = result.geometries[ o.geometry ];

							// geometry already loaded

							if ( geometry ) {

								var hasNormals = false;

								materials = [];
								for( i = 0; i < o.materials.length; i++ ) {

									materials[ i ] = result.materials[ o.materials[i] ];

									hasNormals = materials[ i ] instanceof THREE.ShaderMaterial;

								}

								if ( hasNormals ) {

									geometry.computeTangents();

								}

								p = o.position;
								r = o.rotation;
								q = o.quaternion;
								s = o.scale;

								// turn off quaternions, for the moment

								q = 0;

								if ( materials.length == 0 ) {

									materials[ 0 ] = new THREE.MeshFaceMaterial();

								}

								// dirty hack to handle meshes with multiple materials
								// just use face materials defined in model

								if ( materials.length > 1 ) {

									materials = [ new THREE.MeshFaceMaterial() ];

								}

								object = new THREE.Mesh( geometry, materials );
								object.name = dd;
								object.position.set( p[0], p[1], p[2] );

								if ( q ) {

									object.quaternion.set( q[0], q[1], q[2], q[3] );
									object.useQuaternion = true;

								} else {

									object.rotation.set( r[0], r[1], r[2] );

								}

								object.scale.set( s[0], s[1], s[2] );
								object.visible = o.visible;

								result.scene.add( object );

								result.objects[ dd ] = object;

								if ( o.meshCollider ) {

									var meshCollider = THREE.CollisionUtils.MeshColliderWBox( object );
									result.scene.collisions.colliders.push( meshCollider );

								}

								if ( o.castsShadow ) {

									//object.visible = true;
									//object.materials = [ new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ];

									var shadow = new THREE.ShadowVolume( geometry )
									result.scene.add( shadow );

									shadow.position = object.position;
									shadow.rotation = object.rotation;
									shadow.scale = object.scale;

								}

								if ( o.trigger && o.trigger.toLowerCase() != "none" ) {

									var trigger = {
									"type" 		: o.trigger,
									"object"	: o
									};

									result.triggers[ object.name ] = trigger;

								}

							}

						// pure Object3D

						} else {

							p = o.position;
							r = o.rotation;
							q = o.quaternion;
							s = o.scale;

							// turn off quaternions, for the moment

							q = 0;

							object = new THREE.Object3D();
							object.name = dd;
							object.position.set( p[0], p[1], p[2] );

							if ( q ) {

								object.quaternion.set( q[0], q[1], q[2], q[3] );
								object.useQuaternion = true;

							} else {

								object.rotation.set( r[0], r[1], r[2] );

							}

							object.scale.set( s[0], s[1], s[2] );
							object.visible = ( o.visible !== undefined ) ? o.visible : false;

							result.scene.add( object );

							result.objects[ dd ] = object;
							result.empties[ dd ] = object;

							if ( o.trigger && o.trigger.toLowerCase() != "none" ) {

								var trigger = {
								"type" 		: o.trigger,
								"object"	: o
								};

								result.triggers[ object.name ] = trigger;

							}

						}

					}

				}

			};

			function handle_mesh( geo, id ) {

				result.geometries[ id ] = geo;
				handle_objects();

			};

			function create_callback( id ) {

				return function( geo ) {

					handle_mesh( geo, id );

					counter_models -= 1;

					scope.onLoadComplete();

					async_callback_gate();

				}

			};

			function create_callback_embed( id ) {

				return function( geo ) {

					result.geometries[ id ] = geo;

				}

			};

			function async_callback_gate() {

				var progress = {

					totalModels		: total_models,
					totalTextures	: total_textures,
					loadedModels	: total_models - counter_models,
					loadedTextures	: total_textures - counter_textures

				};

				scope.callbackProgress( progress, result );

				scope.onLoadProgress();

				if( counter_models == 0 && counter_textures == 0 ) {

					callbackFinished( result );

				}

			};

			var callbackTexture = function( images ) {

				counter_textures -= 1;
				async_callback_gate();

				scope.onLoadComplete();

			};

			// first go synchronous elements

			// cameras

			for( dc in data.cameras ) {

				c = data.cameras[ dc ];

				if ( c.type == "perspective" ) {

					camera = new THREE.PerspectiveCamera( c.fov, c.aspect, c.near, c.far );

				} else if ( c.type == "ortho" ) {

					camera = new THREE.OrthographicCamera( c.left, c.right, c.top, c.bottom, c.near, c.far );

				}

				p = c.position;
				t = c.target;
				camera.position.set( p[0], p[1], p[2] );
				camera.target = new THREE.Vector3( t[0], t[1], t[2] );

				result.cameras[ dc ] = camera;

			}

			// lights

			var hex, intensity;

			for ( dl in data.lights ) {

				l = data.lights[ dl ];

				hex = ( l.color !== undefined ) ? l.color : 0xffffff;
				intensity = ( l.intensity !== undefined ) ? l.intensity : 1;

				if ( l.type == "directional" ) {

					p = l.direction;

					light = new THREE.DirectionalLight( hex, intensity );
					light.position.set( p[0], p[1], p[2] );
					light.position.normalize();

				} else if ( l.type == "point" ) {

					p = l.position;
					d = l.distance;

					light = new THREE.PointLight( hex, intensity, d );
					light.position.set( p[0], p[1], p[2] );

				} else if ( l.type == "ambient" ) {

					light = new THREE.AmbientLight( hex );

				}

				result.scene.add( light );

				result.lights[ dl ] = light;

			}

			// fogs

			for( df in data.fogs ) {

				f = data.fogs[ df ];

				if ( f.type == "linear" ) {

					fog = new THREE.Fog( 0x000000, f.near, f.far );

				} else if ( f.type == "exp2" ) {

					fog = new THREE.FogExp2( 0x000000, f.density );

				}

				c = f.color;
				fog.color.setRGB( c[0], c[1], c[2] );

				result.fogs[ df ] = fog;

			}

			// defaults

			if ( result.cameras && data.defaults.camera ) {

				result.currentCamera = result.cameras[ data.defaults.camera ];

			}

			if ( result.fogs && data.defaults.fog ) {

				result.scene.fog = result.fogs[ data.defaults.fog ];

			}

			c = data.defaults.bgcolor;
			result.bgColor = new THREE.Color();
			result.bgColor.setRGB( c[0], c[1], c[2] );

			result.bgColorAlpha = data.defaults.bgalpha;

			// now come potentially asynchronous elements

			// geometries

			// count how many models will be loaded asynchronously

			for( dg in data.geometries ) {

				g = data.geometries[ dg ];

				if ( g.type == "bin_mesh" || g.type == "ascii_mesh" ) {

					counter_models += 1;

					scope.onLoadStart();

				}

			}

			total_models = counter_models;

			for ( dg in data.geometries ) {

				g = data.geometries[ dg ];

				if ( g.type == "cube" ) {

					geometry = new THREE.CubeGeometry( g.width, g.height, g.depth, g.segmentsWidth, g.segmentsHeight, g.segmentsDepth, null, g.flipped, g.sides );
					result.geometries[ dg ] = geometry;

				} else if ( g.type == "plane" ) {

					geometry = new THREE.PlaneGeometry( g.width, g.height, g.segmentsWidth, g.segmentsHeight );
					result.geometries[ dg ] = geometry;

				} else if ( g.type == "sphere" ) {

					geometry = new THREE.SphereGeometry( g.radius, g.segmentsWidth, g.segmentsHeight );
					result.geometries[ dg ] = geometry;

				} else if ( g.type == "cylinder" ) {

					geometry = new THREE.CylinderGeometry( g.topRad, g.botRad, g.height, g.radSegs, g.heightSegs );
					result.geometries[ dg ] = geometry;

				} else if ( g.type == "torus" ) {

					geometry = new THREE.TorusGeometry( g.radius, g.tube, g.segmentsR, g.segmentsT );
					result.geometries[ dg ] = geometry;

				} else if ( g.type == "icosahedron" ) {

					geometry = new THREE.IcosahedronGeometry( g.subdivisions );
					result.geometries[ dg ] = geometry;

				} else if ( g.type == "bin_mesh" ) {

					binLoader.load( { model: get_url( g.url, data.urlBaseType ),
									  callback: create_callback( dg )
									} );

				} else if ( g.type == "ascii_mesh" ) {

					jsonLoader.load( { model: get_url( g.url, data.urlBaseType ),
									   callback: create_callback( dg )
									} );

				} else if ( g.type == "embedded_mesh" ) {

					var modelJson = data.embeds[ g.id ],
						texture_path = "";

					if ( modelJson ) {

						jsonLoader.createModel( modelJson, create_callback_embed( dg ), texture_path );

					}

				}

			}

			// textures

			// count how many textures will be loaded asynchronously

			for( dt in data.textures ) {

				tt = data.textures[ dt ];

				if( tt.url instanceof Array ) {

					counter_textures += tt.url.length;

					for( var n = 0; n < tt.url.length; n ++ ) {

						scope.onLoadStart();

					}

				} else {

					counter_textures += 1;

					scope.onLoadStart();

				}

			}

			total_textures = counter_textures;

			for( dt in data.textures ) {

				tt = data.textures[ dt ];

				if ( tt.mapping != undefined && THREE[ tt.mapping ] != undefined  ) {

					tt.mapping = new THREE[ tt.mapping ]();

				}

				if( tt.url instanceof Array ) {

					var url_array = [];

					for( var i = 0; i < tt.url.length; i ++ ) {

						url_array[ i ] = get_url( tt.url[ i ], data.urlBaseType );

					}

					texture = THREE.ImageUtils.loadTextureCube( url_array, tt.mapping, callbackTexture );

				} else {

					texture = THREE.ImageUtils.loadTexture( get_url( tt.url, data.urlBaseType ), tt.mapping, callbackTexture );

					if ( THREE[ tt.minFilter ] != undefined )
						texture.minFilter = THREE[ tt.minFilter ];

					if ( THREE[ tt.magFilter ] != undefined )
						texture.magFilter = THREE[ tt.magFilter ];


					if ( tt.repeat ) {

						texture.repeat.set( tt.repeat[ 0 ], tt.repeat[ 1 ] );

						if ( tt.repeat[ 0 ] != 1 ) texture.wrapS = THREE.RepeatWrapping;
						if ( tt.repeat[ 1 ] != 1 ) texture.wrapT = THREE.RepeatWrapping;

					}

					if ( tt.offset ) {

						texture.offset.set( tt.offset[ 0 ], tt.offset[ 1 ] );

					}

					// handle wrap after repeat so that default repeat can be overriden

					if ( tt.wrap ) {

						var wrapMap = {
						"repeat" 	: THREE.RepeatWrapping,
						"mirror"	: THREE.MirroredRepeatWrapping
						}

						if ( wrapMap[ tt.wrap[ 0 ] ] !== undefined ) texture.wrapS = wrapMap[ tt.wrap[ 0 ] ];
						if ( wrapMap[ tt.wrap[ 1 ] ] !== undefined ) texture.wrapT = wrapMap[ tt.wrap[ 1 ] ];

					}

				}

				result.textures[ dt ] = texture;

			}

			// materials

			for ( dm in data.materials ) {

				m = data.materials[ dm ];

				for ( pp in m.parameters ) {

					if ( pp == "envMap" || pp == "map" || pp == "lightMap" ) {

						m.parameters[ pp ] = result.textures[ m.parameters[ pp ] ];

					} else if ( pp == "shading" ) {

						m.parameters[ pp ] = ( m.parameters[ pp ] == "flat" ) ? THREE.FlatShading : THREE.SmoothShading;

					} else if ( pp == "blending" ) {

						m.parameters[ pp ] = THREE[ m.parameters[ pp ] ] ? THREE[ m.parameters[ pp ] ] : THREE.NormalBlending;

					} else if ( pp == "combine" ) {

						m.parameters[ pp ] = ( m.parameters[ pp ] == "MixOperation" ) ? THREE.MixOperation : THREE.MultiplyOperation;

					} else if ( pp == "vertexColors" ) {

						if ( m.parameters[ pp ] == "face" ) {

							m.parameters[ pp ] = THREE.FaceColors;

						// default to vertex colors if "vertexColors" is anything else face colors or 0 / null / false

						} else if ( m.parameters[ pp ] )   {

							m.parameters[ pp ] = THREE.VertexColors;

						}

					}

				}

				if ( m.parameters.opacity !== undefined && m.parameters.opacity < 1.0 ) {

					m.parameters.transparent = true;

				}

				if ( m.parameters.normalMap ) {

					var shader = THREE.ShaderUtils.lib[ "normal" ];
					var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

					var diffuse = m.parameters.color;
					var specular = m.parameters.specular;
					var ambient = m.parameters.ambient;
					var shininess = m.parameters.shininess;

					uniforms[ "tNormal" ].texture = result.textures[ m.parameters.normalMap ];

					if ( m.parameters.normalMapFactor ) {

						uniforms[ "uNormalScale" ].value = m.parameters.normalMapFactor;

					}

					if ( m.parameters.map ) {

						uniforms[ "tDiffuse" ].texture = m.parameters.map;
						uniforms[ "enableDiffuse" ].value = true;

					}

					if ( m.parameters.lightMap ) {

						uniforms[ "tAO" ].texture = m.parameters.lightMap;
						uniforms[ "enableAO" ].value = true;

					}

					if ( m.parameters.specularMap ) {

						uniforms[ "tSpecular" ].texture = result.textures[ m.parameters.specularMap ];
						uniforms[ "enableSpecular" ].value = true;

					}

					uniforms[ "uDiffuseColor" ].value.setHex( diffuse );
					uniforms[ "uSpecularColor" ].value.setHex( specular );
					uniforms[ "uAmbientColor" ].value.setHex( ambient );

					uniforms[ "uShininess" ].value = shininess;

					if ( m.parameters.opacity ) {

						uniforms[ "uOpacity" ].value = m.parameters.opacity;

					}

					var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true, fog: true };

					material = new THREE.ShaderMaterial( parameters );

				} else {

					material = new THREE[ m.type ]( m.parameters );

				}

				result.materials[ dm ] = material;

			}

			// objects ( synchronous init of procedural primitives )

			handle_objects();

			// synchronous callback

			scope.callbackSync( result );

		};

	},

	constructor : THREE.SceneLoader

};
/**
 * Loader for UTF8 encoded models generated by:
 *	http://code.google.com/p/webgl-loader/
 *
 * Limitations:
 *  - number of vertices < 65536 (this is after optimizations in compressor, input OBJ may have even less)
 *	- models must have normals and texture coordinates
 *  - texture coordinates must be only from <0,1>
 *  - no materials support yet
 *  - models are scaled and offset (copy numbers from compressor and use them as parameters in UTF8Loader.load() )
 *
 * @author alteredq / http://alteredqualia.com/
 * @author won3d / http://twitter.com/won3d
 */

THREE.UTF8Loader = function ( ) {

};

THREE.UTF8Loader.prototype = new THREE.UTF8Loader();
THREE.UTF8Loader.prototype.constructor = THREE.UTF8Loader;


// Load UTF8 compressed models generated by objcompress
//  - parameters
//		- model (required)
//		- callback (required)

THREE.UTF8Loader.prototype.load = function( parameters ) {

	var xhr = new XMLHttpRequest(),
		url = parameters.model,

		callback = parameters.callback,
		callback_progress = null,

		scale = parameters.scale !== undefined ? parameters.scale : 1,
		offsetX = parameters.offsetX !== undefined ? parameters.offsetX : 0,
		offsetY = parameters.offsetY !== undefined ? parameters.offsetY : 0,
		offsetZ = parameters.offsetZ !== undefined ? parameters.offsetZ : 0;

	var length = 0;

	xhr.onreadystatechange = function() {

		if ( xhr.readyState == 4 ) {

			if ( xhr.status == 200 || xhr.status == 0 ) {

				THREE.UTF8Loader.prototype.createModel( xhr.responseText, callback, scale, offsetX, offsetY, offsetZ );

			} else {

				alert( "Couldn't load [" + url + "] [" + xhr.status + "]" );

			}

		} else if ( xhr.readyState == 3 ) {

			if ( callback_progress ) {

				if ( length == 0 ) {

					length = xhr.getResponseHeader( "Content-Length" );

				}

				callback_progress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState == 2 ) {

			length = xhr.getResponseHeader( "Content-Length" );

		}

	}

	xhr.open( "GET", url, true );
	xhr.send( null );

};

// UTF-8 decoder from webgl-loader
// http://code.google.com/p/webgl-loader/

// Copyright 2011 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License. You
// may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing
// permissions and limitations under the License.

THREE.UTF8Loader.prototype.decompressMesh = function ( str ) {

	var num_verts = str.charCodeAt( 0 );

	if ( num_verts >= 0xE000 ) {

		num_verts -= 0x0800;

	}

	num_verts ++;

	var attribs_out = new Float32Array( 8 * num_verts );

	var offset = 1;

	for ( var i = 0; i < 8; i ++ ) {

		var prev_attrib = 0;

		for ( var j = 0; j < num_verts; ++ j ) {

			var code = str.charCodeAt( j + offset );

			prev_attrib += ( code >> 1 ) ^ ( - ( code & 1 ) );

			attribs_out[ 8 * j + i ] = prev_attrib;

		}

		offset += num_verts;

	}

	var num_indices = str.length - offset;

	var indices_out = new Uint16Array( num_indices );

	var index_high_water_mark = 0;

	for ( var i = 0; i < num_indices; i ++ ) {

		var code = str.charCodeAt( i + offset );

		indices_out[ i ] = index_high_water_mark - code;

		if ( code == 0 ) {

			index_high_water_mark ++;

		}

	}

	return [ attribs_out, indices_out ];

};

THREE.UTF8Loader.prototype.createModel = function ( data, callback, scale, offsetX, offsetY, offsetZ ) {

	var Model = function ( texture_path ) {

		//var s = (new Date).getTime();

		var scope = this;

		scope.materials = [];

		THREE.Geometry.call( this );

		var buffers = THREE.UTF8Loader.prototype.decompressMesh( data );

		var normals = [],
			uvs = [];

		init_vertices( buffers[ 0 ], 8, 0 );
		init_uvs( buffers[ 0 ], 8, 3 );
		init_normals( buffers[ 0 ], 8, 5 );

		init_faces( buffers[ 1 ] );

		this.computeCentroids();
		this.computeFaceNormals();
		//this.computeTangents();

		//var e = (new Date).getTime();

		//console.log( "utf8 data parse time: " + (e-s) + " ms" );

		function init_vertices( data, stride, offset ) {

			var i, x, y, z,
				end = data.length;

			for( i = offset; i < end; i += stride ) {

				x = data[ i ];
				y = data[ i + 1 ];
				z = data[ i + 2 ];

				// fix scale and offsets

				x = ( x / 16383 ) * scale;
				y = ( y / 16383 ) * scale;
				z = ( z / 16383 ) * scale;

				x += offsetX;
				y += offsetY;
				z += offsetZ;

				vertex( scope, x, y, z );

			}

		};

		function init_normals( data, stride, offset ) {

			var i, x, y, z,
				end = data.length;

			for( i = offset; i < end; i += stride ) {

				x = data[ i ];
				y = data[ i + 1 ];
				z = data[ i + 2 ];

				// normalize to <-1,1>

				x = ( x - 512 ) / 511;
				y = ( y - 512 ) / 511;
				z = ( z - 512 ) / 511;

				normals.push( x, y, z );

			}

		};

		function init_uvs( data, stride, offset ) {

			var i, u, v,
				end = data.length;

			for( i = offset; i < end; i += stride ) {

				u = data[ i ];
				v = data[ i + 1 ];

				// normalize to <0,1>

				u /= 1023;
				v /= 1023;

				uvs.push( u, 1 - v );

			}

		};

		function init_faces( indices ) {

			var i,
				a, b, c,
				u1, v1, u2, v2, u3, v3,
				m,
				end = indices.length;

			m = 0; // all faces defaulting to material 0

			for( i = 0; i < end; i += 3 ) {

				a = indices[ i ];
				b = indices[ i + 1 ];
				c = indices[ i + 2 ];

				f3n( scope, normals, a, b, c, m, a, b, c );

				u1 = uvs[ a * 2 ];
				v1 = uvs[ a * 2 + 1 ];

				u2 = uvs[ b * 2 ];
				v2 = uvs[ b * 2 + 1 ];

				u3 = uvs[ c * 2 ];
				v3 = uvs[ c * 2 + 1 ];

				uv3( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3 );

			}


		}

	};

	function vertex ( scope, x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	};

	function f3n ( scope, normals, a, b, c, mi, na, nb, nc ) {

		var material = scope.materials[ mi ],

			nax = normals[ na * 3     ],
			nay = normals[ na * 3 + 1 ],
			naz = normals[ na * 3 + 2 ],

			nbx = normals[ nb * 3     ],
			nby = normals[ nb * 3 + 1 ],
			nbz = normals[ nb * 3 + 2 ],

			ncx = normals[ nc * 3     ],
			ncy = normals[ nc * 3 + 1 ],
			ncz = normals[ nc * 3 + 2 ];

		var na = new THREE.Vector3( nax, nay, naz ),
			nb = new THREE.Vector3( nbx, nby, nbz ),
			nc = new THREE.Vector3( ncx, ncy, ncz );

		scope.faces.push( new THREE.Face3( a, b, c, [ na, nb, nc ], null, material ) );

	};

	function uv3 ( where, u1, v1, u2, v2, u3, v3 ) {

		var uv = [];
		uv.push( new THREE.UV( u1, v1 ) );
		uv.push( new THREE.UV( u2, v2 ) );
		uv.push( new THREE.UV( u3, v3 ) );
		where.push( uv );

	};


	Model.prototype = new THREE.Geometry();
	Model.prototype.constructor = Model;

	callback( new Model() );

};
/**
 * @author sroucheray / http://sroucheray.org/
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Axes = function () {

	THREE.Object3D.call( this );

	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices.push( new THREE.Vertex() );
	lineGeometry.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 100, 0 ) ) );

	var coneGeometry = new THREE.CylinderGeometry( 0, 5, 25, 5, 1 );

	// x

	var line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color : 0xff0000 } ) );
	line.rotation.z = - Math.PI / 2;
	this.add( line );

	var cone = new THREE.Mesh( coneGeometry, new THREE.MeshBasicMaterial( { color : 0xff0000 } ) );
	cone.position.x = 100;
	cone.rotation.z = - Math.PI / 2;
	this.add( cone );

	// y

	var line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color : 0x00ff00 } ) );
	this.add( line );

	var cone = new THREE.Mesh( coneGeometry, new THREE.MeshBasicMaterial( { color : 0x00ff00 } ) );
	cone.position.y = 100;
	this.add( cone );

	// z

	var line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color : 0x0000ff } ) );
	line.rotation.x = Math.PI / 2;
	this.add( line );

	var cone = new THREE.Mesh( coneGeometry, new THREE.MeshBasicMaterial( { color : 0x0000ff } ) );
	cone.position.z = 100;
	cone.rotation.x = Math.PI / 2;
	this.add( cone );

};

THREE.Axes.prototype = new THREE.Object3D();
THREE.Axes.prototype.constructor = THREE.Axes;
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Port of greggman's ThreeD version of marching cubes to Three.js
 * http://webglsamples.googlecode.com/hg/blob/blob.html
 */

// do not crash if somebody includes the file in oldie browser

THREE.MarchingCubes = function ( resolution, materials ) {

	THREE.Object3D.call( this );

	this.materials = materials instanceof Array ? materials : [ materials ];

	// functions have to be object properties
	// prototype functions kill performance
	// (tested and it was 4x slower !!!)

	this.init = function( resolution ) {

		// parameters

		this.isolation = 80.0;

		// size of field, 32 is pushing it in Javascript :)

		this.size = resolution;
		this.size2 = this.size * this.size;
		this.size3 = this.size2 * this.size;
		this.halfsize = this.size / 2.0;

		// deltas

		this.delta = 2.0 / this.size;
		this.yd = this.size;
		this.zd = this.size2;

		this.field = new Float32Array( this.size3 );
		this.normal_cache = new Float32Array( this.size3 * 3 );

		// temp buffers used in polygonize

		this.vlist = new Float32Array( 12 * 3 );
		this.nlist = new Float32Array( 12 * 3 );

		this.firstDraw = true;

		// immediate render mode simulator

		this.maxCount = 4096; // TODO: find the fastest size for this buffer
		this.count = 0;
		this.hasPos = false;
		this.hasNormal = false;

		this.positionArray = new Float32Array( this.maxCount * 3 );
		this.normalArray   = new Float32Array( this.maxCount * 3 );		

	};

	///////////////////////
	// Polygonization
	///////////////////////

	this.lerp = function( a, b, t ) { return a + ( b - a ) * t; };

	this.VIntX = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x + mu * this.delta;
		pout[ offset + 1 ] = y;
		pout[ offset + 2 ] = z;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q + 3 ], mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q + 4 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q + 5 ], mu );

	};

	this.VIntY = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x;
		pout[ offset + 1 ] = y + mu * this.delta;
		pout[ offset + 2 ] = z;

		var q2 = q + this.yd * 3;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q2 ],     mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q2 + 1 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q2 + 2 ], mu );

	};

	this.VIntZ = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x;
		pout[ offset + 1 ] = y;
		pout[ offset + 2 ] = z + mu * this.delta;

		var q2 = q + this.zd * 3;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q2 ],     mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q2 + 1 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q2 + 2 ], mu );

	};

	this.compNorm = function( q ) {

		var q3 = q * 3;

		if ( this.normal_cache [ q3 ] == 0.0 ) {

			this.normal_cache[ q3     ] = this.field[ q - 1  ] 	    - this.field[ q + 1 ];
			this.normal_cache[ q3 + 1 ] = this.field[ q - this.yd ] - this.field[ q + this.yd ];
			this.normal_cache[ q3 + 2 ] = this.field[ q - this.zd ] - this.field[ q + this.zd ];

		}

	};

	// Returns total number of triangles. Fills triangles.
	// (this is where most of time is spent - it's inner work of O(n3) loop )

	this.polygonize = function( fx, fy, fz, q, isol, render_callback ) {

		// cache indices
		var q1 = q + 1,
			qy = q + this.yd,
			qz = q + this.zd,
			q1y = q1 + this.yd,
			q1z = q1 + this.zd,
			qyz = q + this.yd + this.zd,
			q1yz = q1 + this.yd + this.zd;

		var cubeindex = 0,
			field0 = this.field[ q ],
			field1 = this.field[ q1 ],
			field2 = this.field[ qy ],
			field3 = this.field[ q1y ],
			field4 = this.field[ qz ],
			field5 = this.field[ q1z ],
			field6 = this.field[ qyz ],
			field7 = this.field[ q1yz ];

		if ( field0 < isol ) cubeindex |= 1;
		if ( field1 < isol ) cubeindex |= 2;
		if ( field2 < isol ) cubeindex |= 8;
		if ( field3 < isol ) cubeindex |= 4;
		if ( field4 < isol ) cubeindex |= 16;
		if ( field5 < isol ) cubeindex |= 32;
		if ( field6 < isol ) cubeindex |= 128;
		if ( field7 < isol ) cubeindex |= 64;

		// if cube is entirely in/out of the surface - bail, nothing to draw

		var bits = THREE.edgeTable[ cubeindex ];
		if ( bits == 0 ) return 0;

		var d = this.delta,
			fx2 = fx + d, 
			fy2 = fy + d, 
			fz2 = fz + d;

		// top of the cube

		if ( bits & 1 ) { 

			this.compNorm( q );
			this.compNorm( q1 );
			this.VIntX( q * 3, this.vlist, this.nlist, 0, isol, fx, fy, fz, field0, field1 );

		};

		if ( bits & 2 ) { 

			this.compNorm( q1 );  
			this.compNorm( q1y );  
			this.VIntY( q1 * 3, this.vlist, this.nlist, 3, isol, fx2, fy, fz, field1, field3 );

		};

		if ( bits & 4 ) { 

			this.compNorm( qy ); 
			this.compNorm( q1y );  
			this.VIntX( qy * 3, this.vlist, this.nlist, 6, isol, fx, fy2, fz, field2, field3 ); 

		};

		if ( bits & 8 ) { 

			this.compNorm( q );
			this.compNorm( qy );
			this.VIntY( q * 3, this.vlist, this.nlist, 9, isol, fx, fy, fz, field0, field2 );

		};

		// bottom of the cube

		if ( bits & 16 )  { 

			this.compNorm( qz );
			this.compNorm( q1z );
			this.VIntX( qz * 3, this.vlist, this.nlist, 12, isol, fx, fy, fz2, field4, field5 ); 

		};

		if ( bits & 32 )  { 

			this.compNorm( q1z );  
			this.compNorm( q1yz ); 
			this.VIntY( q1z * 3,  this.vlist, this.nlist, 15, isol, fx2, fy, fz2, field5, field7 ); 

		};

		if ( bits & 64 ) {

			this.compNorm( qyz );
			this.compNorm( q1yz );
			this.VIntX( qyz * 3, this.vlist, this.nlist, 18, isol, fx, fy2, fz2, field6, field7 ); 

		};

		if ( bits & 128 ) {

			this.compNorm( qz );
			this.compNorm( qyz );
			this.VIntY( qz * 3,  this.vlist, this.nlist, 21, isol, fx, fy, fz2, field4, field6 ); 

		};

		// vertical lines of the cube

		if ( bits & 256 ) {

			this.compNorm( q );
			this.compNorm( qz );
			this.VIntZ( q * 3, this.vlist, this.nlist, 24, isol, fx, fy, fz, field0, field4 );

		};

		if ( bits & 512 ) {

			this.compNorm( q1 );
			this.compNorm( q1z );
			this.VIntZ( q1 * 3,  this.vlist, this.nlist, 27, isol, fx2, fy,  fz, field1, field5 ); 

		};

		if ( bits & 1024 ) {

			this.compNorm( q1y );
			this.compNorm( q1yz );
			this.VIntZ( q1y * 3, this.vlist, this.nlist, 30, isol, fx2, fy2, fz, field3, field7 ); 

		};

		if ( bits & 2048 ) { 

			this.compNorm( qy );
			this.compNorm( qyz );
			this.VIntZ( qy * 3, this.vlist, this.nlist, 33, isol, fx,  fy2, fz, field2, field6 ); 

		};

		cubeindex <<= 4;  // re-purpose cubeindex into an offset into triTable

		var o1, o2, o3, numtris = 0, i = 0;

		// here is where triangles are created

		while ( THREE.triTable[ cubeindex + i ] != -1 ) {

			o1 = cubeindex + i;
			o2 = o1 + 1;
			o3 = o1 + 2;

			this.posnormtriv( this.vlist, this.nlist,
							  3 * THREE.triTable[ o1 ],
							  3 * THREE.triTable[ o2 ],
							  3 * THREE.triTable[ o3 ],
							  render_callback );

			i += 3;
			numtris ++;

		}

		return numtris;

	};

	/////////////////////////////////////
	// Immediate render mode simulator
	/////////////////////////////////////

	this.posnormtriv = function( pos, norm, o1, o2, o3, render_callback ) {

		var c = this.count * 3;

		this.positionArray[ c ] = pos[ o1 ];
		this.positionArray[ c + 1 ] = pos[ o1 + 1 ];
		this.positionArray[ c + 2 ] = pos[ o1 + 2 ];

		this.positionArray[ c + 3 ] = pos[ o2 ];
		this.positionArray[ c + 4 ] = pos[ o2 + 1 ];
		this.positionArray[ c + 5 ] = pos[ o2 + 2 ];

		this.positionArray[ c + 6 ] = pos[ o3 ];
		this.positionArray[ c + 7 ] = pos[ o3 + 1 ];
		this.positionArray[ c + 8 ] = pos[ o3 + 2 ];

		this.normalArray[ c ] = norm[ o1 ]; 
		this.normalArray[ c + 1 ] = norm[ o1 + 1 ];
		this.normalArray[ c + 2 ] = norm[ o1 + 2 ];

		this.normalArray[ c + 3 ] = norm[ o2 ]; 
		this.normalArray[ c + 4 ] = norm[ o2 + 1 ];
		this.normalArray[ c + 5 ] = norm[ o2 + 2 ];

		this.normalArray[ c + 6 ] = norm[ o3 ]; 
		this.normalArray[ c + 7 ] = norm[ o3 + 1 ];
		this.normalArray[ c + 8 ] = norm[ o3 + 2 ];

		this.hasPos = true;
		this.hasNormal = true;

		this.count += 3;

		if ( this.count >= this.maxCount - 3 ) {

			render_callback( this );

		}

	};

	this.begin = function( ) {

		this.count = 0;
		this.hasPos = false;
		this.hasNormal = false;

	};

	this.end = function( render_callback ) {

		if ( this.count == 0 )
			return;

		for ( var i = this.count * 3; i < this.positionArray.length; i++ )
			this.positionArray[ i ] = 0.0;

		render_callback( this );

	};

	/////////////////////////////////////
	// Metaballs
	/////////////////////////////////////

	// Adds a reciprocal ball (nice and blobby) that, to be fast, fades to zero after
	// a fixed distance, determined by strength and subtract.

	this.addBall = function( ballx, bally, ballz, strength, subtract ) {

		// Let's solve the equation to find the radius:
		// 1.0 / (0.000001 + radius^2) * strength - subtract = 0
		// strength / (radius^2) = subtract
		// strength = subtract * radius^2
		// radius^2 = strength / subtract
		// radius = sqrt(strength / subtract)

		var radius = this.size * Math.sqrt( strength / subtract ),
			zs = ballz * this.size,
			ys = bally * this.size,
			xs = ballx * this.size;

		var min_z = Math.floor( zs - radius ); if ( min_z < 1 ) min_z = 1;
		var max_z = Math.floor( zs + radius ); if ( max_z > this.size - 1 ) max_z = this.size - 1;
		var min_y = Math.floor( ys - radius ); if ( min_y < 1 ) min_y = 1;
		var max_y = Math.floor( ys + radius ); if ( max_y > this.size - 1 ) max_y = this.size - 1;
		var min_x = Math.floor( xs - radius ); if ( min_x < 1  ) min_x = 1;
		var max_x = Math.floor( xs + radius ); if ( max_x > this.size - 1 ) max_x = this.size - 1;


		// Don't polygonize in the outer layer because normals aren't
		// well-defined there.

		var x, y, z, y_offset, z_offset, fx, fy, fz, fz2, fy2, val;

		for ( z = min_z; z < max_z; z++ ) {

			z_offset = this.size2 * z,
			fz = z / this.size - ballz,
			fz2 = fz * fz;

			for ( y = min_y; y < max_y; y++ ) {

				y_offset = z_offset + this.size * y;
				fy = y / this.size - bally;
				fy2 = fy * fy;

				for ( x = min_x; x < max_x; x++ ) {

					fx = x / this.size - ballx;
					val = strength / ( 0.000001 + fx*fx + fy2 + fz2 ) - subtract;
					if ( val > 0.0 ) this.field[ y_offset + x ] += val;

				}

			}

		}

	};

	this.addPlaneX = function( strength, subtract ) {

		var x, y, z, xx, val, xdiv, cxy,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( x = 0; x < dist; x++ ) {

			xdiv = x / size;
			xx = xdiv * xdiv;
			val = strength / ( 0.0001 + xx ) - subtract;

			if ( val > 0.0 ) {

				for ( y = 0; y < size; y++ ) {

					cxy = x + y * yd;

					for ( z = 0; z < size; z++ ) {

						field[ zd * z + cxy ] += val;

					}

				}

			}

		}

	};

	this.addPlaneY = function( strength, subtract ) {

		var x, y, z, yy, val, ydiv, cy, cxy,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( y = 0; y < dist; y++ ) {

			ydiv = y / size;
			yy = ydiv * ydiv;
			val = strength / ( 0.0001 + yy ) - subtract;

			if ( val > 0.0 ) {

				cy = y * yd;

				for ( x = 0; x < size; x++ ) {

					cxy = cy + x;

					for ( z = 0; z < size; z++ )
						field[ zd * z + cxy ] += val;

				}

			}

		}

	};

	this.addPlaneZ = function( strength, subtract ) {

		var x, y, z, zz, val, zdiv, cz, cyz;

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( z = 0; z < dist; z++ ) {

			zdiv = z / size;
			zz = zdiv * zdiv;
			val = strength / ( 0.0001 + zz ) - subtract;
			if ( val > 0.0 ) {

				cz = zd * z;

				for ( y = 0; y < size; y++ ) {

						cyz = cz + y * yd;

						for ( x = 0; x < size; x++ )
							field[ cyz + x ] += val;

				}

			}

		}

	};

	/////////////////////////////////////
	// Updates
	/////////////////////////////////////

	this.reset = function() {

		var i;

		// wipe the normal cache

		for ( i = 0; i < this.size3; i++ ) {

			this.normal_cache[ i * 3 ] = 0.0;
			this.field[ i ] = 0.0;

		}

	};

	this.render = function( render_callback ) {

		this.begin();

		// Triangulate. Yeah, this is slow.

		var q, x, y, z, fx, fy, fz, y_offset, z_offset, smin2 = this.size - 2;

		for ( z = 1; z < smin2; z++ ) {

			z_offset = this.size2 * z;
			fz = ( z - this.halfsize ) / this.halfsize; //+ 1

			for ( y = 1; y < smin2; y++ ) {

				y_offset = z_offset + this.size * y;
				fy = ( y - this.halfsize ) / this.halfsize; //+ 1

				for ( x = 1; x < smin2; x++ ) {

					fx = ( x - this.halfsize ) / this.halfsize; //+ 1
					q = y_offset + x;

					this.polygonize( fx, fy, fz, q, this.isolation, render_callback );

				}

			}

		}

		this.end( render_callback );

	};

	this.generateGeometry = function() {

		var start = 0, geo = new THREE.Geometry();
		var normals = [];

		var geo_callback = function( object ) {

			var i, x, y, z, vertex, position, normal, 
				face, a, b, c, na, nb, nc;


			for ( i = 0; i < object.count; i++ ) {

				a = i * 3;
				b = a + 1;
				c = a + 2;

				x = object.positionArray[ a ];
				y = object.positionArray[ b ];
				z = object.positionArray[ c ];
				position = new THREE.Vector3( x, y, z );

				x = object.normalArray[ a ];
				y = object.normalArray[ b ];
				z = object.normalArray[ c ];
				normal = new THREE.Vector3( x, y, z );
				normal.normalize();

				vertex = new THREE.Vertex( position );

				geo.vertices.push( vertex );
				normals.push( normal );

			}

			nfaces = object.count / 3;

			for ( i = 0; i < nfaces; i++ ) {

				a = ( start + i ) * 3;
				b = a + 1;
				c = a + 2;

				na = normals[ a ];
				nb = normals[ b ];
				nc = normals[ c ];

				face = new THREE.Face3( a, b, c, [ na, nb, nc ] );

				geo.faces.push( face );

			}

			start += nfaces;
			object.count = 0;

		};

		this.render( geo_callback );

		// console.log( "generated " + geo.faces.length + " triangles" );

		return geo;

	};

	this.init( resolution );

};

THREE.MarchingCubes.prototype = new THREE.Object3D();
THREE.MarchingCubes.prototype.constructor = THREE.MarchingCubes;


/////////////////////////////////////
// Marching cubes lookup tables
/////////////////////////////////////

// These tables are straight from Paul Bourke's page:
// http://local.wasp.uwa.edu.au/~pbourke/geometry/polygonise/
// who in turn got them from Cory Gene Bloyd.

THREE.edgeTable = new Int32Array([
0x0  , 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
0x190, 0x99 , 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
0x230, 0x339, 0x33 , 0x13a, 0x636, 0x73f, 0x435, 0x53c,
0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
0x3a0, 0x2a9, 0x1a3, 0xaa , 0x7a6, 0x6af, 0x5a5, 0x4ac,
0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
0x460, 0x569, 0x663, 0x76a, 0x66 , 0x16f, 0x265, 0x36c,
0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff , 0x3f5, 0x2fc,
0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55 , 0x15c,
0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc ,
0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
0xcc , 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
0x15c, 0x55 , 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
0x2fc, 0x3f5, 0xff , 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
0x36c, 0x265, 0x16f, 0x66 , 0x76a, 0x663, 0x569, 0x460,
0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa , 0x1a3, 0x2a9, 0x3a0,
0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33 , 0x339, 0x230,
0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99 , 0x190,
0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0])

THREE.triTable = new Int32Array([
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1,
3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1,
3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1,
3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1,
9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1,
9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1,
8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1,
9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1,
3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1,
1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1,
4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1,
4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1,
2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1,
9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1,
10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1,
4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1,
5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1,
5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1,
9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1,
0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1,
1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1,
10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1,
8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1,
2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1,
7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1,
9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1,
2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1,
11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1,
9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1,
5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1,
11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1,
11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1,
9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1,
5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1,
2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1,
6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1,
0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1,
3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1,
6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1,
6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1,
1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1,
8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1,
7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1,
3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1,
0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1,
9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1,
8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1,
5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1,
0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1,
6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1,
10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1,
10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1,
8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1,
1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1,
0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1,
10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1,
0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1,
3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1,
6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1,
9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1,
8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1,
3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1,
6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1,
0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1,
10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1,
10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1,
1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1,
2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1,
7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1,
7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1,
2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1,
1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1,
11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1,
8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1,
0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1,
7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1,
7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1,
2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1,
1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1,
10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1,
10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1,
0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1,
7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1,
6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1,
8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1,
9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1,
6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1,
4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1,
10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1,
8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1,
0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1,
1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1,
8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1,
10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1,
4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1,
10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1,
9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1,
7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1,
3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1,
7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1,
3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1,
6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1,
9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1,
1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1,
4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1,
7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1,
6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1,
3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1,
0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1,
6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1,
0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1,
11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1,
6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1,
5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1,
9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1,
1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1,
1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1,
10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1,
0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1,
5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1,
10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1,
11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1,
9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1,
7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1,
2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1,
8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1,
9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1,
9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1,
1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1,
9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1,
9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1,
5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1,
0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1,
10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1,
2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1,
0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1,
0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1,
9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1,
5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1,
3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1,
5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1,
8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1,
0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1,
9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1,
1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1,
3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1,
4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1,
9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1,
11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1,
11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1,
2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1,
9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1,
3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1,
1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1,
4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1,
4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1,
0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1,
3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1,
3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1,
0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1,
9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1,
1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
/**
 * @author bartek drozdz / http://everyday3d.com/
 */

THREE.PlaneCollider = function( point, normal ) {

	this.point = point;
	this.normal = normal;

};


THREE.SphereCollider = function( center, radius ) {

	this.center = center;
	this.radius = radius;
	this.radiusSq = radius * radius;

};

THREE.BoxCollider = function( min, max ) {

	this.min = min;
	this.max = max;
	this.dynamic = true;

	this.normal = new THREE.Vector3();

};

THREE.MeshCollider = function( mesh, box ) {

	this.mesh = mesh;
	this.box = box;
	this.numFaces = this.mesh.geometry.faces.length;

	this.normal = new THREE.Vector3();

};

THREE.CollisionSystem = function() {

	this.collisionNormal = new THREE.Vector3();
	this.colliders = [];
	this.hits = [];

	// console.log("Collision system init / 004");

};

THREE.Collisions = new THREE.CollisionSystem();

THREE.CollisionSystem.prototype.merge = function( collisionSystem ) {

	Array.prototype.push.apply( this.colliders, collisionSystem.colliders );
	Array.prototype.push.apply( this.hits, collisionSystem.hits );

};

THREE.CollisionSystem.prototype.rayCastAll = function( ray ) {

	ray.direction.normalize();

	this.hits.length = 0;

	var i, l, d, collider,
		ld = 0;

	for ( i = 0, l = this.colliders.length; i < l; i++ ) {

		collider = this.colliders[ i ];

		d = this.rayCast( ray, collider );

		if ( d < Number.MAX_VALUE ) {

			collider.distance = d;

			if ( d > ld )
				this.hits.push( collider );
			else
				this.hits.unshift( collider );

			ld = d;

		}

	}

	return this.hits;

};

THREE.CollisionSystem.prototype.rayCastNearest = function( ray ) {

	var cs = this.rayCastAll( ray );

	if( cs.length == 0 ) return null;

	var i = 0;

	while( cs[ i ] instanceof THREE.MeshCollider ) {

        var dist_index = this.rayMesh ( ray, cs[ i ] );

		if( dist_index.dist < Number.MAX_VALUE ) {

			cs[ i ].distance = dist_index.dist;
            cs[ i ].faceIndex = dist_index.faceIndex;
			break;

		}

		i++;

	}

	if ( i > cs.length ) return null;

	return cs[ i ];

};

THREE.CollisionSystem.prototype.rayCast = function( ray, collider ) {

	if ( collider instanceof THREE.PlaneCollider )
		return this.rayPlane( ray, collider );

	else if ( collider instanceof THREE.SphereCollider )
		return this.raySphere( ray, collider );

	else if ( collider instanceof THREE.BoxCollider )
		return this.rayBox( ray, collider );

	else if ( collider instanceof THREE.MeshCollider && collider.box )
		return this.rayBox( ray, collider.box );

};

THREE.CollisionSystem.prototype.rayMesh = function( r, me ) {

	var rt = this.makeRayLocal( r, me.mesh );

	var d = Number.MAX_VALUE;
    var nearestface;

	for( var i = 0; i < me.numFaces; i++ ) {
        var face = me.mesh.geometry.faces[i];
        var p0 = me.mesh.geometry.vertices[ face.a ].position;
        var p1 = me.mesh.geometry.vertices[ face.b ].position;
        var p2 = me.mesh.geometry.vertices[ face.c ].position;
        var p3 = face instanceof THREE.Face4 ? me.mesh.geometry.vertices[ face.d ].position : null;

        if (face instanceof THREE.Face3) {
            var nd = this.rayTriangle( rt, p0, p1, p2, d, this.collisionNormal, me.mesh );

            if( nd < d ) {

                d = nd;
                nearestface = i;
                me.normal.copy( this.collisionNormal );
                me.normal.normalize();

            }
        
        }
        
        else if (face instanceof THREE.Face4) {
            
            var nd = this.rayTriangle( rt, p0, p1, p3, d, this.collisionNormal, me.mesh );
            
            if( nd < d ) {

                d = nd;
                nearestface = i;
                me.normal.copy( this.collisionNormal );
                me.normal.normalize();

            }
            
            nd = this.rayTriangle( rt, p1, p2, p3, d, this.collisionNormal, me.mesh );
            
            if( nd < d ) {

                d = nd;
                nearestface = i;
                me.normal.copy( this.collisionNormal );
                me.normal.normalize();

            }
            
        }

	}

	return {dist: d, faceIndex: nearestface};

};

THREE.CollisionSystem.prototype.rayTriangle = function( ray, p0, p1, p2, mind, n, mesh ) {

	var e1 = THREE.CollisionSystem.__v1,
		e2 = THREE.CollisionSystem.__v2;
	
	n.set( 0, 0, 0 );

	// do not crash on quads, fail instead

	e1.sub( p1, p0 );
	e2.sub( p2, p1 );
	n.cross( e1, e2 )

	var dot = n.dot( ray.direction );
	if ( !( dot < 0 ) ) {
		
		if ( mesh.doubleSided || mesh.flipSided ) {
		
			n.multiplyScalar (-1.0);
			dot *= -1.0;
		
		} else {
			
			return Number.MAX_VALUE;
		
		}
	
	}

	var d = n.dot( p0 );
	var t = d - n.dot( ray.origin );

	if ( !( t <= 0 ) ) return Number.MAX_VALUE;
	if ( !( t >= dot * mind ) ) return Number.MAX_VALUE;

	t = t / dot;

	var p = THREE.CollisionSystem.__v3;

	p.copy( ray.direction );
	p.multiplyScalar( t );
	p.addSelf( ray.origin );

	var u0, u1, u2, v0, v1, v2;

	if ( Math.abs( n.x ) > Math.abs( n.y ) ) {

		if ( Math.abs( n.x ) > Math.abs( n.z ) ) {

			u0 = p.y  - p0.y;
			u1 = p1.y - p0.y;
			u2 = p2.y - p0.y;

			v0 = p.z  - p0.z;
			v1 = p1.z - p0.z;
			v2 = p2.z - p0.z;

		} else {

			u0 = p.x  - p0.x;
			u1 = p1.x - p0.x;
			u2 = p2.x - p0.x;

			v0 = p.y  - p0.y;
			v1 = p1.y - p0.y;
			v2 = p2.y - p0.y;

		}

	} else {

		if( Math.abs( n.y ) > Math.abs( n.z ) ) {

			u0 = p.x  - p0.x;
			u1 = p1.x - p0.x;
			u2 = p2.x - p0.x;

			v0 = p.z  - p0.z;
			v1 = p1.z - p0.z;
			v2 = p2.z - p0.z;

		} else {

			u0 = p.x  - p0.x;
			u1 = p1.x - p0.x;
			u2 = p2.x - p0.x;

			v0 = p.y  - p0.y;
			v1 = p1.y - p0.y;
			v2 = p2.y - p0.y;

		}

	}

	var temp = u1 * v2 - v1 * u2;
	if( !(temp != 0) ) return Number.MAX_VALUE;
	//console.log("temp: " + temp);
	temp = 1 / temp;

	var alpha = ( u0 * v2 - v0 * u2 ) * temp;
	if( !(alpha >= 0) ) return Number.MAX_VALUE;
	//console.log("alpha: " + alpha);

	var beta = ( u1 * v0 - v1 * u0 ) * temp;
	if( !(beta >= 0) ) return Number.MAX_VALUE;
	//console.log("beta: " + beta);

	var gamma = 1 - alpha - beta;
	if( !(gamma >= 0) ) return Number.MAX_VALUE;
	//console.log("gamma: " + gamma);

	return t;

};

THREE.CollisionSystem.prototype.makeRayLocal = function( ray, m ) {

	var mt = THREE.CollisionSystem.__m;
	THREE.Matrix4.makeInvert( m.matrixWorld, mt );

	var rt = THREE.CollisionSystem.__r;
	rt.origin.copy( ray.origin );
	rt.direction.copy( ray.direction );

	mt.multiplyVector3( rt.origin );
	mt.rotateAxis( rt.direction );
	rt.direction.normalize();
	//m.localRay = rt;

	return rt;

};

THREE.CollisionSystem.prototype.rayBox = function( ray, ab ) {

	var rt;

	if ( ab.dynamic && ab.mesh && ab.mesh.matrixWorld ) {

		rt = this.makeRayLocal( ray, ab.mesh );

	} else {

		rt = THREE.CollisionSystem.__r;
		rt.origin.copy( ray.origin );
		rt.direction.copy( ray.direction );

	}

	var xt = 0, yt = 0, zt = 0;
	var xn = 0, yn = 0, zn = 0;
	var ins = true;

	if( rt.origin.x < ab.min.x ) {

		xt = ab.min.x - rt.origin.x;
		//if(xt > ray.direction.x) return return Number.MAX_VALUE;
		xt /= rt.direction.x;
		ins = false;
		xn = -1;

	} else if( rt.origin.x > ab.max.x ) {

		xt = ab.max.x - rt.origin.x;
		//if(xt < ray.direction.x) return return Number.MAX_VALUE;
		xt /= rt.direction.x;
		ins = false;
		xn = 1;

	}

	if( rt.origin.y < ab.min.y ) {

		yt = ab.min.y - rt.origin.y;
		//if(yt > ray.direction.y) return return Number.MAX_VALUE;
		yt /= rt.direction.y;
		ins = false;
		yn = -1;

	} else if( rt.origin.y > ab.max.y ) {

		yt = ab.max.y - rt.origin.y;
		//if(yt < ray.direction.y) return return Number.MAX_VALUE;
		yt /= rt.direction.y;
		ins = false;
		yn = 1;

	}

	if( rt.origin.z < ab.min.z ) {

		zt = ab.min.z - rt.origin.z;
		//if(zt > ray.direction.z) return return Number.MAX_VALUE;
		zt /= rt.direction.z;
		ins = false;
		zn = -1;

	} else if( rt.origin.z > ab.max.z ) {

		zt = ab.max.z - rt.origin.z;
		//if(zt < ray.direction.z) return return Number.MAX_VALUE;
		zt /= rt.direction.z;
		ins = false;
		zn = 1;

	}

	if( ins ) return -1;

	var which = 0;
	var t = xt;

	if( yt > t ) {

		which = 1;
		t = yt;

	}

	if ( zt > t ) {

		which = 2;
		t = zt;

	}

	switch( which ) {

		case 0:

			var y = rt.origin.y + rt.direction.y * t;
			if ( y < ab.min.y || y > ab.max.y ) return Number.MAX_VALUE;
			var z = rt.origin.z + rt.direction.z * t;
			if ( z < ab.min.z || z > ab.max.z ) return Number.MAX_VALUE;
			ab.normal.set( xn, 0, 0 );
			break;

		case 1:

			var x = rt.origin.x + rt.direction.x * t;
			if ( x < ab.min.x || x > ab.max.x ) return Number.MAX_VALUE;
			var z = rt.origin.z + rt.direction.z * t;
			if ( z < ab.min.z || z > ab.max.z ) return Number.MAX_VALUE;
			ab.normal.set( 0, yn, 0) ;
			break;

		case 2:

			var x = rt.origin.x + rt.direction.x * t;
			if ( x < ab.min.x || x > ab.max.x ) return Number.MAX_VALUE;
			var y = rt.origin.y + rt.direction.y * t;
			if ( y < ab.min.y || y > ab.max.y ) return Number.MAX_VALUE;
			ab.normal.set( 0, 0, zn );
			break;

	}

	return t;

};

THREE.CollisionSystem.prototype.rayPlane = function( r, p ) {

	var t = r.direction.dot( p.normal );
	var d = p.point.dot( p.normal );
	var ds;

	if( t < 0 ) ds = ( d - r.origin.dot( p.normal ) ) / t;
	else return Number.MAX_VALUE;

	if( ds > 0 ) return ds;
	else return Number.MAX_VALUE;

};

THREE.CollisionSystem.prototype.raySphere = function( r, s ) {

	var e = s.center.clone().subSelf( r.origin );
	if ( e.lengthSq < s.radiusSq ) return -1;

	var a = e.dot( r.direction.clone() );
	if ( a <= 0 ) return Number.MAX_VALUE;

	var t = s.radiusSq - ( e.lengthSq() - a * a );
	if ( t >= 0 ) return Math.abs( a ) - Math.sqrt( t );

	return Number.MAX_VALUE;

};

THREE.CollisionSystem.__v1 = new THREE.Vector3();
THREE.CollisionSystem.__v2 = new THREE.Vector3();
THREE.CollisionSystem.__v3 = new THREE.Vector3();
THREE.CollisionSystem.__nr = new THREE.Vector3();
THREE.CollisionSystem.__m = new THREE.Matrix4();
THREE.CollisionSystem.__r = new THREE.Ray();
/**
 * @author bartek drozdz / http://everyday3d.com/
 */

THREE.CollisionUtils = {};

// @params m THREE.Mesh
// @returns CBox dynamic Object Bounding Box

THREE.CollisionUtils.MeshOBB = function( m ) {

	m.geometry.computeBoundingBox();
	var b = m.geometry.boundingBox;
	var min = new THREE.Vector3( b.x[0], b.y[0], b.z[0] );
	var max = new THREE.Vector3( b.x[1], b.y[1], b.z[1] );
	var box = new THREE.BoxCollider( min, max );
	box.mesh = m;
	return box;

}

// @params m THREE.Mesh
// @returns CBox static Axis-Aligned Bounding Box
//
// The AABB is calculated based on current
// position of the object (assumes it won't move)

THREE.CollisionUtils.MeshAABB = function( m ) {

	var box = THREE.CollisionUtils.MeshOBB( m );
	box.min.addSelf( m.position );
	box.max.addSelf( m.position );
	box.dynamic = false;
	return box;

};

// @params m THREE.Mesh
// @returns CMesh with aOOB attached (that speeds up intersection tests)

THREE.CollisionUtils.MeshColliderWBox = function( m ) {

	var mc = new THREE.MeshCollider( m, THREE.CollisionUtils.MeshOBB( m ) );

	return mc;

};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author marklundin / http://mark-lundin.com/
 */

if ( THREE.WebGLRenderer ) {

	THREE.AnaglyphWebGLRenderer = function ( parameters ) {

		THREE.WebGLRenderer.call( this, parameters );

		var _this = this, _setSize = this.setSize, _render = this.render;

		var _cameraL = new THREE.PerspectiveCamera(),
			_cameraR = new THREE.PerspectiveCamera();

		var eyeRight = new THREE.Matrix4(),
			eyeLeft = new THREE.Matrix4(),
			focalLength = 125,
			aspect, near, fov;

		_cameraL.matrixAutoUpdate = _cameraR.matrixAutoUpdate = false;

		var _params = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat };

		var _renderTargetL = new THREE.WebGLRenderTarget( 512, 512, _params ),
			_renderTargetR = new THREE.WebGLRenderTarget( 512, 512, _params );

		var _camera = new THREE.PerspectiveCamera( 53, 1, 1, 10000 );
		_camera.position.z = 2;

		_material = new THREE.ShaderMaterial( {

			uniforms: {

				"mapLeft": { type: "t", value: 0, texture: _renderTargetL },
				"mapRight": { type: "t", value: 1, texture: _renderTargetR }

			},

			vertexShader: [

				"varying vec2 vUv;",

				"void main() {",

					"vUv = vec2( uv.x, 1.0 - uv.y );",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"uniform sampler2D mapLeft;",
				"uniform sampler2D mapRight;",
				"varying vec2 vUv;",

				"void main() {",

					"vec4 colorL, colorR;",
					"vec2 uv = vUv;",

					"colorL = texture2D( mapLeft, uv );",
					"colorR = texture2D( mapRight, uv );",

					// http://3dtv.at/Knowhow/AnaglyphComparison_en.aspx

					"gl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;",

				"}"

				].join("\n")

		} );

		var _scene = new THREE.Scene();
		_scene.add( new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), _material ) );

		this.setSize = function ( width, height ) {

			_setSize.call( _this, width, height );

			_renderTargetL.width = width;
			_renderTargetL.height = height;

			_renderTargetR.width = width;
			_renderTargetR.height = height;

		};

		/*
		 * Renderer now uses an asymmetric perspective projection (http://paulbourke.net/miscellaneous/stereographics/stereorender/).
		 * Each camera is offset by the eye seperation and its projection matrix is also skewed asymetrically back to converge on the same
		 * projection plane. Added a focal length parameter to, this is where the parallax is equal to 0.
		 */

		this.render = function ( scene, camera, renderTarget, forceClear ) {

			camera.update( null, true );

			var hasCameraChanged = aspect !== camera.aspect || near !== camera.near || fov !== camera.fov;

			if( hasCameraChanged ) {

				aspect = camera.aspect;
				near = camera.near;
				fov = camera.fov;

				var projectionMatrix = camera.projectionMatrix.clone(),
					eyeSep = focalLength / 30 * 0.5,
					eyeSepOnProjection = eyeSep * near / focalLength,
					ymax = near * Math.tan( fov * Math.PI / 360 ),
					xmin, xmax;

				//translate xOffset

				eyeRight.n14 = eyeSep;
				eyeLeft.n14 = -eyeSep;

				//For left eye

				xmin = -ymax * aspect + eyeSepOnProjection;
				xmax = ymax * aspect + eyeSepOnProjection;
				projectionMatrix.n11 = 2 * near / ( xmax - xmin );
				projectionMatrix.n13 = ( xmax + xmin ) / ( xmax - xmin );
				_cameraL.projectionMatrix = projectionMatrix.clone();

				//for right eye

				xmin = -ymax * aspect - eyeSepOnProjection;
				xmax = ymax * aspect - eyeSepOnProjection;
				projectionMatrix.n11 = 2 * near / ( xmax - xmin );
				projectionMatrix.n13 = ( xmax + xmin ) / ( xmax - xmin );
				_cameraR.projectionMatrix = projectionMatrix.clone();

			}

			_cameraL.matrix = camera.matrixWorld.clone().multiplySelf( eyeLeft );
			_cameraL.update( null, true );
			_cameraL.position.copy( camera.position );
			_cameraL.near = near;
			_cameraL.far = camera.far;
			_render.call( _this, scene, _cameraL, _renderTargetL, true );

			_cameraR.matrix = camera.matrixWorld.clone().multiplySelf( eyeRight );
			_cameraR.update( null, true );
			_cameraR.position.copy( camera.position );
			_cameraR.near = near;
			_cameraR.far = camera.far;
			_render.call( _this, scene, _cameraR, _renderTargetR, true );

			_render.call( _this, _scene, _camera );

		};

	};

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

if ( THREE.WebGLRenderer ) {

	THREE.CrosseyedWebGLRenderer = function ( parameters ) {

		THREE.WebGLRenderer.call( this, parameters );

		this.autoClear = false;

		var _this = this, _setSize = this.setSize, _render = this.render;

		var _width, _height;

		var _cameraL = new THREE.PerspectiveCamera();
		_cameraL.target = new THREE.Vector3( 0, 0, 0 );

		var _cameraR = new THREE.PerspectiveCamera();
		_cameraR.target = new THREE.Vector3( 0, 0, 0 );

		_this.separation = 10;
		if ( parameters && parameters.separation !== undefined ) _this.separation = parameters.separation;

		var SCREEN_WIDTH  = window.innerWidth;
		var SCREEN_HEIGHT = window.innerHeight;
		var HALF_WIDTH = SCREEN_WIDTH / 2;

		this.setSize = function ( width, height ) {

			_setSize.call( _this, width, height );

			_width = width/2;
			_height = height;

		};

		this.render = function ( scene, camera, renderTarget, forceClear ) {

			this.clear();

			_cameraL.fov = camera.fov;
			_cameraL.aspect = 0.5 * camera.aspect;
			_cameraL.near = camera.near;
			_cameraL.far = camera.far;
			_cameraL.updateProjectionMatrix();

			_cameraL.position.copy( camera.position );
			_cameraL.target.copy( camera.target );
			_cameraL.translateX( _this.separation );
			_cameraL.lookAt( _cameraL.target );

			_cameraR.projectionMatrix = _cameraL.projectionMatrix;

			_cameraR.position.copy( camera.position );
			_cameraR.target.copy( camera.target );
			_cameraR.translateX( - _this.separation );
			_cameraR.lookAt( _cameraR.target );

			this.setViewport( 0, 0, _width, _height );
			_render.call( _this, scene, _cameraL );

			this.setViewport( _width, 0, _width, _height );
			_render.call( _this, scene, _cameraR, false );

		};

	};

}

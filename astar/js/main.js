$(document).ready(function() {
	
	console.time('WebGL');
    var webGL = new ThreeDeeHexGrid();
    webGL.animate();
    console.timeEnd('WebGL');

});

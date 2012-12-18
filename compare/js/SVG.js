function SVG (drawingarea) {
	
	var parentElement = document.getElementById(drawingarea.container);

	this.svgns = "http://www.w3.org/2000/svg";
	this.xlinkns = "http://www.w3.org/1999/xlink";
	this.version = "1.1";
	
	this.canvas = document.createElementNS(this.svgns, 'svg');
	this.canvas.setAttribute('id', 'svg');
	this.canvas.setAttribute('width', drawingarea.width);
	this.canvas.setAttribute('height', drawingarea.height);
	this.canvas.setAttribute('version', this.version);
	this.canvas.setAttribute('xmlns:xlink', this.xlinkns);
	
	this.canvas = parentElement.appendChild(this.canvas);
	
}


SVG.prototype.createGroup = function (id) {
	
	var svgns = this.svgns;
	
	var svgGroup = document.createElementNS( svgns, 'g');
	svgGroup.setAttribute('id', id);

	return svgGroup;
	
}



SVG.prototype.createDef = function (element) {
	
	if (this.defs) {
		var defs = this.defs;
	} else {
		var defs = document.createElementNS(this.svgns, 'defs');
		this.defs = this.canvas.appendChild(defs);
	}
	
	return this.defs.appendChild(element);
	
}



SVG.prototype.createPolygon = function (id, points, styles) {
	
	var svgns = this.svgns;
	
	var svgPolygon = document.createElementNS( svgns, 'polygon');
	svgPolygon.setAttribute('id', id);
	svgPolygon.setAttribute('points', points);
	
	for (style in styles) {
		svgPolygon.setAttribute(style, styles[style]);
	}
	
	return svgPolygon;
	
}

SVG.prototype.createFilter = function (id, type, attrs) {
	
	var svgns = this.svgns;
	
	var svgFilter = document.createElementNS( svgns, 'filter');
	svgFilter.setAttribute('id', id);
	svgFilter.setAttribute('x', 0);
	svgFilter.setAttribute('y', 0);
	
	var filter = document.createElementNS( svgns, type);
	for (attr in attrs) {
		filter.setAttribute(attr, attrs[attr]);
	}
	
	svgFilter.appendChild(filter);
	
	return svgFilter;
	
}

SVG.prototype.createAnimation = function (id, type, attrs) {
	
	type = type || 'animate';
	
	attrs = attrs || {
		"attributeName" : "opacity",
		"attributeType" : "CSS",
		"values" : "0;1;0",
		"dur" : "10s",
		"repeatCount" : "indefinite"
	}
	
	var svgns = this.svgns;
	
	var svgAnimate = document.createElementNS( svgns, type);
	for (attr in attrs) {
		svgAnimate.setAttribute(attr,attrs[attr]);
	}
	
	return svgAnimate;
	
}



SVG.prototype.createFromDef = function (seed, id, newattributes) {
	
	var svgns = this.svgns;
	
	var id = id || "000";
	
	var svgUse = document.createElementNS( svgns, 'use');	
	svgUse.setAttribute('id', id);
	svgUse.setAttributeNS(this.xlinkns, "href", '#' + seed);
	
	if(newattributes){
		for (newattribute in newattributes) {
			svgUse.setAttribute(newattribute, newattributes[newattribute] );
		}
	}
	this.canvas.appendChild(svgUse);
	return svgUse;
	
}



SVG.prototype.setElementXLink = function (id, newHref) {
	var element = document.getElementById(id);
	element.setAttributeNS(this.xlinkns, "href", newHref);
} 



SVG.prototype.clone = function (seed, id, x, y) {
	
	var clone = seed.cloneNode(false);
	clone.setAttribute('id', id );
	clone.setAttribute('x', x );
	clone.setAttribute('y', y );
	this.canvas.appendChild(clone);
	return clone;
}
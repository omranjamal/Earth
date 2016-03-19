(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (options) {
	var geo = new THREE.SphereGeometry(
		options.radius,
		options.segmentation,
		options.segmentation
	);

	var mat  = new THREE.MeshPhongMaterial({
		color: 0xffffff
	});

	mat.shininess = 20;

	mat.map = THREE.ImageUtils.loadTexture('images/color.jpg');
	mat.bumpMap = THREE.ImageUtils.loadTexture('images/bump.jpg');
	mat.bumpScale = 13;

	mat.specularMap = THREE.ImageUtils.loadTexture('images/specular.jpg');
	mat.specular  = new THREE.Color('gray');

	var earth = new THREE.Mesh(geo, mat);

	var geometry = new THREE.SphereGeometry(
		options.radius*1.1,
		options.segmentation,
		options.segmentation
	);

	var material  = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
		opacity: 1,
		transparent: true,
		depthWrite: true
	});

	material.map = THREE.ImageUtils.loadTexture('images/clouds.png');

	var clouds = new THREE.Mesh(geometry, material);
	earth.add(clouds);



	var wire_geo = new THREE.IcosahedronGeometry(
		options.radius*1.5,
		1
	);

	var wire_mat = new THREE.MeshBasicMaterial({
		color: 0x000000,
		wireframe: true,
		opacity: 0.3,
		transparent: true,
		wireframeLinewidth: 20
	});

	var wire = new THREE.Mesh(wire_geo, wire_mat);

	this.wire_model = wire;
	this.model = earth;
};
},{}],2:[function(require,module,exports){
var options = {
	radius: 160,
	segmentation: 32,
	position: {
		x: 0,
		y: 0,
		z: 0
	}
};


var width = $('#planet').width();
var height = $('#planet').height();


var Earth = require('./earth.js');


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
	75,
	width/height,
	0.1,
	10000
);

camera.position.z = 500;
// camera.lookAt(new THREE.Vector3(0,0,0));

// INIT MODELS
var models = new Earth(options);
var earth = models.model;
earth.rotation.x = (20/180)*Math.PI;

var wire = models.wire_model;

// ADD TO SCENE
scene.add(earth);
scene.add(wire);


// LIGHTS
var ambient_light = new THREE.AmbientLight(0x9f717c);
var directional_light = new THREE.DirectionalLight(0xffeba8, 0.9);
directional_light.position.set(1, 1, 1);

scene.add(ambient_light);
scene.add(directional_light);


var fx_vars = {
	bobbing: 0
};

var fx = {
	rotate: function () {
		earth.rotation.y += 0.005;
		wire.rotation.y += 0.002;
	},
	bobbing: function () {
		earth.position.y = Math.sin(fx_vars.bobbing)*30;
		wire.position.y = Math.sin(fx_vars.bobbing)*15;
		fx_vars.bobbing = (fx_vars.bobbing+0.02)%6.28;
	}
};

var renderer = new THREE.WebGLRenderer({
	canvas: $('#planet')[0],
	alpha: true
});

renderer.setSize(
	width,
	height
);

var render = function() {
	requestAnimationFrame(render);

	for (var i in fx) {
		fx[i]();
	}

	renderer.render(scene, camera);
};

render();
},{"./earth.js":1}]},{},[2]);

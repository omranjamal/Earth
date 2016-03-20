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
	mat.bumpScale = 9;

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
		color: 0x00707d,
		wireframe: true,
		opacity: 0.7,
		transparent: true,
		wireframeLinewidth: 2
	});

	var wire = new THREE.Mesh(wire_geo, wire_mat);

	this.wire_model = wire;
	this.model = earth;
};
},{}],2:[function(require,module,exports){
module.exports = function (options) {
	var geo = new THREE.SphereGeometry(
		options.radius*0.2,
		options.segmentation,
		options.segmentation
	);

	var mat  = new THREE.MeshLambertMaterial({
		color: 0xffffff
	});

	mat.map = THREE.ImageUtils.loadTexture('images/moon_color.jpg');
	mat.bumpMap = THREE.ImageUtils.loadTexture('images/moon_bump.jpg');
	mat.bumpScale = 7;

	var moon = new THREE.Mesh(geo, mat);
	this.model = moon;
};
},{}],3:[function(require,module,exports){
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
var Moon = require('./moon.js');


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
earth.castShadow = true;
earth.recieveShadow = true;

var wire = models.wire_model;

var moon = (new Moon(options)).model;
moon.castShadow = true;
moon.recieveShadow = true;

// ADD TO SCENE
scene.add(earth);
scene.add(wire);
scene.add(moon);


// PARTICLES
var party_mat = new THREE.ParticleBasicMaterial({
	color: 0xffffff,
	size: 10,
	blending: THREE.AdditiveBlending,
	transparent: true,
	map: THREE.ImageUtils.loadTexture('images/point.png'),
});

var party = new THREE.ParticleSystem(wire.geometry, party_mat);
var party_stars = new THREE.ParticleSystem(
	new THREE.IcosahedronGeometry(1000, 5),
	party_mat
);

scene.add(party);
scene.add(party_stars);


// LIGHTS
var ambient_light = new THREE.AmbientLight(0xffffff);
var directional_light = new THREE.DirectionalLight(0xffffff, 0.9);
directional_light.position.set(1, 1, 0.5);
directional_light.castShadow = true;

scene.add(ambient_light);
scene.add(directional_light);


var fx_vars = {
	bobbing: 0,
	orbit: 0,
	moon_rot: 0
};

var fx = {
	rotate: function () {
		earth.rotation.y += 0.005;
		party.rotation.y = wire.rotation.y += 0.002;
		party.rotation.x = wire.rotation.x += 0.001;
	},
	bobbing: function () {
		earth.position.y = Math.sin(fx_vars.bobbing)*30;

		party.position.y = wire.position.y = Math.sin(fx_vars.bobbing)*15;
		party.position.x = wire.position.x = Math.sin(fx_vars.bobbing)*15;



		fx_vars.bobbing = (fx_vars.bobbing+0.02)%6.28;
	},
	moon_rotation: function () {
		moon.rotation.y = fx_vars.moon_rot;
		fx_vars.moon_rot = (fx_vars.moon_rot+0.008)%6.28;
	},
	moon_orbit: function () {
		moon.position.x = -1*Math.cos(fx_vars.orbit)*250;
		moon.position.y = Math.cos(fx_vars.orbit)*100;
		moon.position.z = Math.sin(fx_vars.orbit)*250;

		fx_vars.orbit = (fx_vars.orbit+0.008)%6.28;
	}
};

var renderer = new THREE.WebGLRenderer({
	canvas: $('#planet')[0],
	alpha: true,
	antialias: true
});

renderer.setSize(
	width,
	height
);

renderer.shadowMapEnabled = true;

var render = function() {
	requestAnimationFrame(render);

	for (var i in fx) {
		fx[i]();
	}

	renderer.render(scene, camera);
};

for (var i in wire.geometry.vertices) {
	wire.geometry.vertices[i].last = 1;
}

var wire_radius = options.radius*1.5;

setInterval(function () {
	var len = wire.geometry.vertices.length;
	var vertex = Math.floor(Math.random()*len);
	var scale = Math.random()*0.1*wire.geometry.vertices[vertex].last;

	if (wire.geometry.vertices[vertex].distanceTo(wire.position) < wire_radius*0.8 && scale < 0) {
		scale *= -1;
	}

	wire.geometry.vertices[vertex].add(wire.geometry.vertices[vertex].clone().multiplyScalar(scale));

	wire.geometry.vertices[vertex].last *= -1;
	wire.geometry.verticesNeedUpdate = true;
}, 50);

render();
},{"./earth.js":1,"./moon.js":2}]},{},[3]);

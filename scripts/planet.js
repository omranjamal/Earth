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
earth.castShadow = true;

var wire = models.wire_model;

var floor = new THREE.Mesh(
	new THREE.BoxGeometry(1500, 2000, 20),
	new THREE.MeshLambertMaterial({
		color: 0x8b0045,
		opacity: 0.4,
		transparent: true
	})
);

floor.receiveShadow = true;

floor.position.y = -300;
floor.rotation.x = Math.PI/2;

// ADD TO SCENE
scene.add(earth);
scene.add(wire);


var party_mat = new THREE.ParticleBasicMaterial({
	color: 0xffffff,
	size: 10,
	blending: THREE.AdditiveBlending,
	transparent: true,
	map: THREE.ImageUtils.loadTexture('images/point.png'),
});

var party = new THREE.ParticleSystem(wire.geometry, party_mat);

scene.add(party);

// var party_geo = new THREE.PlaneGeometry(5, 5);

// for (var j in wire.geometry.vertices) {
// 	var party = new THREE.Mesh(party_geo, party_mat);
// 	party.position = (wire.geometry.vertices[j]);
// 	scene.add(party);
// }


// LIGHTS
var ambient_light = new THREE.AmbientLight(0x9f717c);
var directional_light = new THREE.DirectionalLight(0xffeba8, 0.9);
directional_light.position.set(1, 1, 0.5);
directional_light.castShadow = true;

scene.add(ambient_light);
scene.add(directional_light);


var fx_vars = {
	bobbing: 0
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

setInterval(function () {
	var len = wire.geometry.vertices.length;
	var vertex = Math.floor(Math.random()*len);
	var scale = Math.random()*0.1*wire.geometry.vertices[vertex].last;

	wire.geometry.vertices[vertex].add(wire.geometry.vertices[vertex].clone().multiplyScalar(scale));

	wire.geometry.vertices[vertex].last *= -1;
	wire.geometry.verticesNeedUpdate = true;
}, 100);

render();
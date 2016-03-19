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
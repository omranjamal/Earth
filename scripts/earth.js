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
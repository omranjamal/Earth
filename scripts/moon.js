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
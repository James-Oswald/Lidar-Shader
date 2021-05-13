

let camera, controls, house;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({antialias: false});
const loader = new THREE.OBJLoader();
const clock = new THREE.Clock();


function error(msg)
{
	console.log(msg);
}

function progress(xhr)
{
	console.log((xhr.loaded / xhr.total * 100) + "% loaded");
}

function init(vertexShader, fragmentShader){
    let width  = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1);

    sunlight = new THREE.AmbientLight(0xffffff);
	scene.add(sunlight);
    
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    document.body.appendChild(renderer.domElement);

    /*
    controls = new THREE.FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 10;
	controls.domElement = renderer.domElement;
	controls.rollSpeed = Math.PI / 5
	controls.autoForward = false;
	controls.dragToLook = false;
    */

    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath("res/");
	mtlLoader.load("res/farmhouse.mtl", function(materials) 
	{
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		//objLoader.setPath("res/");
		objLoader.load("res/farmhouse.obj", function(object) 
		{
            house = object;
            house.position.y = -10;
            house.position.z = -60;
            scene.add(house);
		}, progress, error);
	}, progress, error);
    animate();
}

function animate(){
	requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if(house)
        house.rotation.y += delta
    //controls.update(delta);
	renderer.render(scene, camera);
}

//Handle resizing
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

Promise.all([
    fetch("res/vert.glsl"),
    fetch("res/frag.glsl")
]).then(res =>
    Promise.all(res.map(r=>r.text()))
).then(data =>
    init(...data)
).catch(err =>
    console.log(err)
);
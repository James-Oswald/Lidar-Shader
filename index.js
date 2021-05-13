
//Code for the camera scene
function initCamera(){
    let canvas = document.getElementById("camera");
    let camera, house;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({antialias: false, canvas:canvas});
    const loader = new THREE.OBJLoader();
    const clock = new THREE.Clock();
    let width  = canvas.clientWidth;
    let height = canvas.clientHeight;
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1);
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    //MTLLoader is dumb and forces us to illuminate with ambient lighting, refuses to read illum in the .mtl file
    sunlight = new THREE.AmbientLight(0xffffff);
	scene.add(sunlight);

    //Load the object
    let error = function(msg){console.log(msg);}
    let progress = function(xhr){console.log((xhr.loaded / xhr.total * 100) + "% loaded");}
    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath("res/");
	mtlLoader.load("res/farmhouse.mtl", function(materials) 
	{
		materials.preload();
		let objLoader = new THREE.OBJLoader();
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
        camera.aspect = canvas.clientWidth/canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
}



//Code for the camera scene
function initLidar(){
    let canvas = document.getElementById("lidar");
    let camera, house;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({antialias: false, canvas:canvas});
    const loader = new THREE.OBJLoader();
    const clock = new THREE.Clock();
    let width  = canvas.clientWidth;
    let height = canvas.clientHeight;
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1);
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);

    //Load the object
    let error = function(msg){console.log(msg);}
    let progress = function(xhr){console.log((xhr.loaded / xhr.total * 100) + "% loaded");}
    loader.load("res/farmhouse.obj", function(object) 
    {
        house = object;
        house.position.y = -10;
        house.position.z = -60;
        //scene.add(house);
        //Load in our shaders
        Promise.all([
            fetch("lidarVert.glsl"),
            fetch("lidarFrag.glsl")
        ])
        .then(res => Promise.all(res.map(r=>r.text())))
        .then(data =>{
            const material = new THREE.ShaderMaterial({vertexShader:data[0],fragmentShader:data[1]});
            //Three.js makes copying materials to objects loaded via OBJLoader painful, see
            //https://stackoverflow.com/questions/16200082/assigning-materials-to-an-objloader-model-in-three-js
            house.traverse(function(child){
                if (child instanceof THREE.Mesh)
                    child.material = material;
            });
            console.log(house);
            scene.add(house);
        })
        .catch(err => console.log(err));
        
    }, progress, error);
    animate();

    function animate(){
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if(house)
            house.rotation.y += delta
        renderer.render(scene, camera);
    }

    //Handle resizing
    window.addEventListener('resize', onWindowResize, false );
    function onWindowResize(){
        camera.aspect = canvas.clientWidth/canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
}

initCamera();
initLidar();
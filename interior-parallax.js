/**
 * Three.js interior mapping component
 * Author: Mohsen Heydari
 * mods to be an aframe component and to use 6 png or equirectangular image by Kyle Baker
 */
// import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js'


AFRAME.registerComponent('interior-parallax', {
  schema: {
    // px = positive x, nx = negative x, etc.
    equirectangular: {type:"string", default:""},
    path: {type:"string", default:""},
    px: {type:"string", default:"https://cdn.glitch.global/42044d7c-847c-4275-8e47-bc5ebbeb3640/ao1z9-sve70-001.png?v=1677364876129"}, 
    nx: {type:"string", default:"https://cdn.glitch.global/42044d7c-847c-4275-8e47-bc5ebbeb3640/ao1z9-sve70-002.png?v=1677364877590"}, 
    py: {type:"string", default:"https://cdn.glitch.global/42044d7c-847c-4275-8e47-bc5ebbeb3640/ao1z9-sve70-003.png?v=1677364880161"}, 
    ny: {type:"string", default:"https://cdn.glitch.global/42044d7c-847c-4275-8e47-bc5ebbeb3640/ao1z9-sve70-004.png?v=1677364883136"}, 
    pz: {type:"string", default:"https://cdn.glitch.global/42044d7c-847c-4275-8e47-bc5ebbeb3640/ao1z9-sve70-005.png?v=1677364885826"}, 
    nz: {type:"string", default:"https://cdn.glitch.global/42044d7c-847c-4275-8e47-bc5ebbeb3640/ao1z9-sve70-006.png?v=1677364888191"},
  },
  async init() {
        // plane
    const vertexShader = await loadFile('./shaders/vertex.glsl')
    const fragmentShader = await loadFile('./shaders/fragment.glsl')

    // trying to do this without .dds
    // see: https://threejs.org/docs/#api/en/textures/CubeTexture
    // const cubeMap = await loadFile('./textures/cube.dds')
    let textureEquirec;
    let windowMat;

    console.log(this.el.id)
    if (this.data.equirectangular) {
        console.warn("experimental/untested use of equirectangular instead of cube")
        const textureLoader = new THREE.TextureLoader();

				textureEquirec = textureLoader.load( 
          this.data.equirectangular
          // 'textures/2294472375_24a3b8ef46_o.jpg' 
        );
				textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
				textureEquirec.encoding = THREE.sRGBEncoding;
        console.log('loaded equirec texture:', textureEquirec)
        
        let waited;
        console.log("waiting")
        let waitPromise = new Promise((resolve, reject) => {
          waited = resolve;
        })
        setTimeout(() => {
          waited();
        }, 2000)
        await waitPromise;
        console.log("finished waiting")
        const formatted = new THREE.WebGLCubeRenderTarget(
            textureEquirec.source.data.height // try setTimeout, source is undefined immediately but defined shortly after for some reason
            // 3437 // hardcoding for now....
        ).fromEquirectangularTexture(AFRAME.scenes[0].renderer, textureEquirec);

        console.log('EXPERIMENTAL equirec to cube result?', formatted.texture);

        // this part is a guess, no idea if shader will allow this
        windowMat = new THREE.ShaderMaterial(
            {
                uniforms: { 
                    cubeMap: {value: formatted.texture }
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            }
        )
    }

    else if (this.data.px) {
        console.log("using cube not equirect")
      
        const loader = new THREE.CubeTextureLoader();
      
        if (this.data.path) {
          loader.setPath( 
            this.data.path
            // 'https://cdn.glitch.global/42044d7c-847c-4275-8e47-bc5ebbeb3640/' 
          );
        }

        const cubeMap = loader.load( [
          this.data.px,this.data.nx,
          this.data.py,this.data.ny,
          this.data.pz,this.data.nz,
          // 'ao1z9-sve70-001.png?v=1677364876129', 'ao1z9-sve70-002.png?v=1677364877590',
          // 'ao1z9-sve70-003.png?v=1677364880161', 'ao1z9-sve70-004.png?v=1677364883136',
          // 'ao1z9-sve70-005.png?v=1677364885826', 'ao1z9-sve70-006.png?v=1677364888191'
        ] );

        // from original example, they do this:
        // const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: cubeMap } );

        // end attempt to replicate without dds added by kyle

        cubeMap.encoding = THREE.sRGBEncoding  

        console.log("using cubemap:", cubeMap)

        windowMat = new THREE.ShaderMaterial(
            {
                uniforms: { 
                    cubeMap: {value: cubeMap }
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            }
        )
    }

    else {
      throw new Error("cannot generate parallax without source image(s)")
    }


    const windowGeometry = this.el.components.geometry.geometry; // new THREE.PlaneGeometry(1, 1)
    if (windowGeometry.type !== 'PlaneGeometry') {
      throw new Error("interior parallax is only designed to work with PlaneGeometry (a-plane)")
    }
    windowGeometry.computeTangents()
    this.el.components.material.material = windowMat; // give it the old college try?
    
    // assuming the 'model-loaded' event already fired
    let mesh = this.el.getObject3D('mesh')
    // assuming you want all nodes to have the same material        
    // var material = new THREE.MeshLambertMaterial({
    //   color: this.data.color,
    // });
        
    mesh.traverse(function(node) {
      // change only the mesh nodes
      if(node.type != "Mesh") return;
      // apply material and clean up
      let tmp = node.material
      node.material = windowMat
      tmp.dispose();
    })
    
    // Mesh
    // windowMesh = new THREE.Mesh(windowGeometry, windowMat)
    // scene.add(windowMesh)
  }
})



function loadFile(filename) {
    return new Promise((resolve, reject) => {
        let loader
        if(filename.endsWith('.dds')){
            loader = new THREE.DDSLoader()
        }
      else{
            loader = new THREE.FileLoader()
        }
         
        loader.load(filename, 
            data => { resolve(data); }, 
            null, 
            error => {reject(error);}
        );
    });
}

// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// const params = {
//     bottomColor: '#2c83ca',
//     surfaceColor: '#fcfcfc'
// }

// let scene, renderer, camera, 
//     controls, windowMesh, windowMat

// function initialize(){
//     // Scene
//     scene = new THREE.Scene()
//     scene.background = new THREE.Color(params.bottomColor)

//     renderer = new THREE.WebGLRenderer()
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//     camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
//     camera.position.set(0, 0, 1.5)
//     scene.add(camera)

//     // Controls
//     controls = new OrbitControls(camera, renderer.domElement)
//     controls.enableDamping = true

//     window.addEventListener('resize', onResize)

//     // Add renderer to page
//     document.body.appendChild(renderer.domElement);

//     document.addEventListener('keyup', (e)=>{
//         if(e.code === "KeyA"){
//             console.log(camera.position)
//             console.log(camera.rotation)
//         }
//     })

//     setupScene()
// }

// primarily borrowing from here:
// async function setupScene(){
//     // plane
//     const vertexShader = await loadFile('./shaders/vertex.glsl')
//     const fragmentShader = await loadFile('./shaders/fragment.glsl')

//     // trying to do this without .dds
//     // see: https://threejs.org/docs/#api/en/textures/CubeTexture
//     // const cubeMap = await loadFile('./textures/cube.dds')
    
//     const loader = new THREE.CubeTextureLoader();
//     loader.setPath( 'https://cdn.glitch.global/42044d7c-847c-4275-8e47-bc5ebbeb3640/' );

//     const cubeMap = loader.load( [
//       'ao1z9-sve70-001.png?v=1677364876129', 'ao1z9-sve70-002.png?v=1677364877590',
//       'ao1z9-sve70-003.png?v=1677364880161', 'ao1z9-sve70-004.png?v=1677364883136',
//       'ao1z9-sve70-005.png?v=1677364885826', 'ao1z9-sve70-006.png?v=1677364888191'
//     ] );

//     // from original example, they do this:
//     // const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: cubeMap } );
    
//     // end attempt to replicate without dds added by kyle
    
//     cubeMap.encoding = THREE.sRGBEncoding

//     windowMat = new THREE.ShaderMaterial(
//         {
//             uniforms: { 
//                 cubeMap: {value: cubeMap }
//             },
//             vertexShader: vertexShader,
//             fragmentShader: fragmentShader
//         }
//     )

//     const windowGeometry = new THREE.PlaneGeometry(1, 1)
//     windowGeometry.computeTangents()

//     // Mesh
//     windowMesh = new THREE.Mesh(windowGeometry, windowMat)
//     scene.add(windowMesh)
// }


// function onResize(){
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// }

// const tick = () =>
// {
//     // Update controls
//     controls.update()

//     // Render
//     renderer.render( scene, camera )

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// initialize()
// tick()


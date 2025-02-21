import './style.css'

import 'bootstrap';

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
      });
scene.background = new THREE.Color( 0xffffff);
renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.set( 0, .5, 3);

const loader = new GLTFLoader();
loader.load(
    'models/scene.glb' , function(gltf) {
    gltf.scene.scale.set(1.5,1.5,1.5);
    base.position.set(0,0,0);
    base.add(gltf.scene);
  },
  function (xhr) {
    console.log((xhr.loaded/xhr.total * 100 ) + '% loaded' );

  }, function(error){
    console.log('An error occurred')
});

let base = new THREE.Object3D();
scene.add(base);



var canvas = renderer.domElement;
var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var pointOfIntersection = new THREE.Vector3();
canvas.addEventListener("mousemove", onMouseMove, false);

function onMouseMove(event){
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, pointOfIntersection);
  base.lookAt(pointOfIntersection);
}
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)

//const controls = new OrbitControls(camera, canvas);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

// Array of background colors
const backgroundColors = [
  0xff0000, // Red
  0x00ff00, // Green
  0x0000ff, // Blue
  0xffff00, // Yellow
  0xff00ff, // Magenta
  0x00ffff, // Cyan
  0x800080, // Purple
  0xFFA500, // Orange
  0x808080, // Gray
  0x40E0D0  // Turquoise
];

let currentBackgroundColorIndex = 0;
let isFading = false;
let fadeStartTime;
const fadeDuration = 1000; // Duration of the fade in milliseconds

function changeBackgroundColor() {
    if (isFading) return;

    isFading = true;
    fadeStartTime = Date.now();

    const currentColor = new THREE.Color(scene.background);
    currentBackgroundColorIndex = (currentBackgroundColorIndex + 1) % backgroundColors.length;
    const nextColor = new THREE.Color(backgroundColors[currentBackgroundColorIndex]);


    function fadeStep() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - fadeStartTime;

        if (elapsedTime >= fadeDuration) {
            scene.background = nextColor; // Set to the final color
            isFading = false;
            return;
        }

        const progress = elapsedTime / fadeDuration; // 0 to 1
        const r = currentColor.r + (nextColor.r - currentColor.r) * progress;
        const g = currentColor.g + (nextColor.g - currentColor.g) * progress;
        const b = currentColor.b + (nextColor.b - currentColor.b) * progress;

        scene.background.setRGB(r, g, b);

        requestAnimationFrame(fadeStep); // Continue the animation
    }
    fadeStep();//Start the animation
}

// Function to handle device orientation
function handleOrientation(event) {
  if (!event.alpha ||!event.beta ||!event.gamma) return; // Check if data is available

  // Adjust these values for sensitivity
  const alpha = THREE.MathUtils.degToRad(event.alpha); 
  const beta = THREE.MathUtils.degToRad(event.beta);
  const gamma = THREE.MathUtils.degToRad(event.gamma);

  // Calculate rotation (you might need to adjust the axes and order)
  base.rotation.set(beta, alpha, -gamma, 'YXZ'); 
}

// Check if the device is a mobile device
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  window.addEventListener('deviceorientation', handleOrientation);
} else {
  // For desktop, use mouse controls (or you can disable rotation entirely)
  canvas.addEventListener("mousemove", onMouseMove, false);
}


// Target Positions (example - you can customize these)
const targetPositions = [
  new THREE.Vector3(2, 0, 0),  // Position 1
  new THREE.Vector3(0, 2, 0),  // Position 2
  new THREE.Vector3(-2, 0, 0), // Position 3
  new THREE.Vector3(0, -2, 0), // Position 4
  new THREE.Vector3(0, 0, 0)   // Original Position
];


// Array of Element IDs (Important: These IDs MUST exist in your HTML)
const elementIds = ["navButton1", "navButton2", "navButton3", "navButton4", "originalPosition"];

const textContent = {
  "navButton1": "Commitment",
  "navButton2": "Loyalty",
  "navButton3": "Honor",
  "navButton4": "Courage",
  "originalPosition": "The Diamond"
};

let currentTextElement = null; // Keep track of the currently displayed text element

function showText(id) {
  if (currentTextElement) {
      currentTextElement.style.opacity = 0; // Fade out the previous text immediately
  }

  const textDiv = document.createElement('div');
  textDiv.id = 'model-text'; // Give it a specific ID
  textDiv.className = 'model-text'; // and a class for styling
  textDiv.textContent = textContent[id];
  document.body.appendChild(textDiv);  // Or append to a specific container

   // Create the close button (X)
   const closeButton = document.createElement('span');
   closeButton.textContent = 'X';
   closeButton.className = 'close-button'; 
   closeButton.addEventListener('click', closeText); 
   textDiv.appendChild(closeButton);

   textDiv.style.opacity = 1; // Text starts with full opacity
   currentTextElement = textDiv; // Update the current element
}

function closeText() { 
  if (currentTextElement) {
      currentTextElement.remove();
      currentTextElement = null;
  }
}


// Add Event Listeners (with camera centering, background color change, and text display)
elementIds.forEach((id, index) => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener('click', () => {
      animateToPosition(targetPositions[index]);
      changeBackgroundColor();
      setTimeout(() => {
          showText(id); 
          hideText(); // Now called after showText()
      }, 1000);
  });
  } else {
      console.error(`Element with ID '${id}' not found!`);
  }
});




// Modify animateToPosition to remove text after animation starts
function animateToPosition(targetPosition) {
  const startPosition = base.position.clone();
  const duration = 1000;
  const startTime = Date.now();

  // Remove the text element immediately when animation starts
  if (currentTextElement) {
      currentTextElement.remove();
      currentTextElement = null;
  }

  function animate() {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          base.position.lerpVectors(startPosition, targetPosition, progress); // Use "base" here

          // Center the camera during the animation
          centerCameraOnObject(base); // Use "base" here

          requestAnimationFrame(animate);
      } else {
          base.position.copy(targetPosition); // Use "base" here
          centerCameraOnObject(base); // Use "base" here
      }
  }

  animate();
}

function centerCameraOnObject(object) { // Function remains the same
  const box = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();
  box.getCenter(center);

  //controls.target.copy(center);
  const distance = box.getSize(new THREE.Vector3()).length() * 1.5;
  camera.position.set(center.x, center.y, center.z + distance);
  //controls.update();
}

function render() {
  //controls.update();
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame( animate );
 
  render();
}

animate();


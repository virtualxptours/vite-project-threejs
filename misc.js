const navButton = document.getElementById('navButton');

navButton.addEventListener('click', function() {
  // Calculate a new random position (example)
  console.log(base);
  const newPosition = new THREE.Vector3(
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5
);

// Smooth Transition using Tween.js (for the *model*)
new TWEEN.Tween(base.position)
    .to(newPosition, 500) // 500ms duration
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

// Optional: Make the camera follow the model (smoothly)
const newCameraPosition = new THREE.Vector3(
    newPosition.x + 5,
    newPosition.y + 5,
    newPosition.z + 5
);
new TWEEN.Tween(camera.position)
.to(newCameraPosition, 1000)
.easing(TWEEN.Easing.Cubic.InOut)
.onUpdate(() => {
  camera.lookAt(base.position);
})
.start();
});


function animate() {
  requestAnimationFrame(animate);


  controls.update();
  TWEEN.update();

  renderer.render(scene, camera);
}

animate()



//part 1 - set up basic tween.js examples
const tween = new TWEEN.Tween({x:0})
  .to({x:5}, 2000)
  .onUpdate((coords) => {
    base.position.x = coords.x;
  });
tween.start();



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
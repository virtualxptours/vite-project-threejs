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
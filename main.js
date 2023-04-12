import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//scene
const scene = new THREE.Scene();

//create sphere
const geometry = new THREE.SphereGeometry(4, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  flatShading: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(13, 15, 10);
scene.add(light);

//camera
const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height);
camera.position.z = 20;
scene.add(camera);

//renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 4;

//resize
window.addEventListener("resize", () => {
  //update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera
  camera.aspect = sizes.width / sizes.height;
  //updating bg itself. don't have to refresh
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const orientationXElement = document.getElementById("orientation-x");
const orientationYElement = document.getElementById("orientation-y");
const orientationZElement = document.getElementById("orientation-z");

const saveBtn = document.getElementById("save-btn");
const coordinatesBox = document.getElementById("coordinates-box");

let savedCoordinates = [];

function handleOrientationChange(event) {
  const { beta, gamma, alpha } = event;
  orientationXElement.textContent = beta.toFixed(2);
  orientationYElement.textContent = gamma.toFixed(2);
  orientationZElement.textContent = alpha.toFixed(2);
}

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", handleOrientationChange);
}

//save coordinates on click
saveBtn.addEventListener("click", () => {
  const coordinates = {
    x: orientationXElement.textContent,
    y: orientationYElement.textContent,
    z: orientationZElement.textContent,
    timestamp: Date.now(),
  };
  savedCoordinates.push(coordinates);

  //saved coordinates shouldn't be more than 5
  if (savedCoordinates.length > 5) {
    savedCoordinates.shift(); // remove the oldest element
  }

  const date = new Date();
const timeString = date.toLocaleString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  coordinatesBox.innerHTML = savedCoordinates
    .map(
      (c) =>
        `<div>Coordinates saved: ${new Date(
          c.timestamp
        ).toLocaleString()}: X=${c.x}, Y=${c.y}, Z=${c.z}</div>`
    )
    .join("");
  coordinatesBox.style.display = "block";
});

//adjust scene item's width/size to window's
const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

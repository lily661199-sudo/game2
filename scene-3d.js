import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const host = document.getElementById('sceneArt');
const canvas = document.getElementById('sceneCanvas');
if (!host || !canvas) throw new Error('The 3D scene canvas is missing.');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog('#30483d', 23, 52);
renderer.setClearColor('#30483d', 0);
scene.add(new THREE.HemisphereLight('#fff0cf', '#334338', 2.1));

const lanternWash = new THREE.PointLight('#ffd58a', 150, 14, 1.7);
lanternWash.position.set(-0.7, 2.2, 2.2);
scene.add(lanternWash);

const keyLight = new THREE.DirectionalLight('#f7dba0', 2.4);
keyLight.position.set(-4.5, 10, 7);
keyLight.castShadow = true;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight('#c7e0c4', 1.15);
fillLight.position.set(7, 7, -4);
scene.add(fillLight);

const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
camera.position.set(-3.6, 2.55, 18.8);
const cameraTarget = new THREE.Vector3(0.75, 4.35, -0.3);
const cameraGoal = new THREE.Vector3(-3.6, 2.55, 18.8);
camera.lookAt(cameraTarget);

function setLevelView() {
  const tower = host.classList.contains('tower-scene');
  cameraGoal.set(tower ? 4.8 : -3.6, tower ? 3.25 : 2.55, tower ? 20.5 : 18.8);
  cameraTarget.set(tower ? 3.0 : 0.75, tower ? 4.4 : 4.35, tower ? -0.2 : -0.3);
  lanternWash.position.set(tower ? 5.1 : -0.7, tower ? 5.8 : 2.2, 2.2);
  lanternWash.intensity = tower ? 195 : 150;
}
new MutationObserver(setLevelView).observe(host, { attributes: true, attributeFilter: ['class'] });

let mixer = null;
let lastFrame = performance.now();
const loader = new GLTFLoader();
loader.load('assets/3d/dream-tide-paper-harbor.glb', (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      if (node.material) node.material.needsUpdate = true;
    }
  });
  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.clipAction(gltf.animations[0]).play();
  }
  host.classList.add('paper-3d-ready');
}, undefined, (error) => {
  console.warn('Blender scene did not load; keeping the illustrated fallback.', error);
});

function resize() {
  const width = Math.max(1, host.clientWidth);
  const height = Math.max(1, host.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(host);
resize();

function draw(now) {
  requestAnimationFrame(draw);
  const delta = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;
  camera.position.lerp(cameraGoal, 1 - Math.pow(0.001, delta));
  camera.lookAt(cameraTarget);
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}
requestAnimationFrame(draw);

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
scene.fog = new THREE.Fog('#30483d', 40, 95);
renderer.setClearColor('#30483d', 0);
scene.add(new THREE.HemisphereLight('#fff0cf', '#334338', 2.1));
const lanternWash = new THREE.PointLight('#ffd58a', 42, 18, 1.7);
lanternWash.position.set(-.7, 2.2, 2.2); scene.add(lanternWash);
const keyLight = new THREE.DirectionalLight('#f7dba0', 2.4);
keyLight.position.set(-4.5, 10, 7); keyLight.castShadow = true; scene.add(keyLight);
const fillLight = new THREE.DirectionalLight('#c7e0c4', 1.15);
fillLight.position.set(7, 7, -4); scene.add(fillLight);
const camera = new THREE.PerspectiveCamera(42, 1, .1, 160);
let room = null, bounds = new THREE.Box3(new THREE.Vector3(-10,0,-10),new THREE.Vector3(10,8,10));
const cameraTarget = new THREE.Vector3(0, 2.2, 0), cameraGoal = new THREE.Vector3(-3.6, 2.8, 18.8);
camera.position.copy(cameraGoal); camera.lookAt(cameraTarget);
let mixer=null, hero=null, legs=[], chest=null, chestGlow=null, roomFloor=0, playing=false, jumping=false, jumpVelocity=0;
const held = new Set();
const move = {x:0,z:0};
const clock = new THREE.Clock();
const paper = (color,roughness=.86)=>new THREE.MeshStandardMaterial({color,roughness,flatShading:true});
function makeHero(){
  hero=new THREE.Group();
  const body=new THREE.Mesh(new THREE.ConeGeometry(.42,1.05,7),paper('#244d45'));
  body.position.y=.72; body.castShadow=true; hero.add(body);
  const scarf=new THREE.Mesh(new THREE.ConeGeometry(.31,.38,7),paper('#c58e46'));
  scarf.position.set(0,1.3,.015); scarf.castShadow=true; hero.add(scarf);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.26,10,8),paper('#e8cda1'));
  head.scale.set(1,.9,.82); head.position.y=1.33; head.castShadow=true; hero.add(head);
  const hood=new THREE.Mesh(new THREE.ConeGeometry(.31,.45,7),paper('#d4a953'));
  hood.position.set(0,1.58,0); hood.rotation.z=-.08; hood.castShadow=true; hero.add(hood);
  const eyeMat=new THREE.MeshBasicMaterial({color:'#17231f'});
  for(const x of [-.09,.09]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.025,6,6),eyeMat);eye.position.set(x,1.34,.22);hero.add(eye)}
  for(const side of [-1,1]){
    const leg=new THREE.Mesh(new THREE.CylinderGeometry(.055,.07,.37,6),paper('#493d32'));
    leg.position.set(side*.14,.24,0);leg.castShadow=true;hero.add(leg);legs.push(leg);
  }
  const lamp=new THREE.PointLight('#f6cb77',2.5,3);lamp.position.set(.3,.95,.36);hero.add(lamp);
  hero.visible=false;scene.add(hero);
}
function makeChest(){
  chest=new THREE.Group();
  const base=new THREE.Mesh(new THREE.BoxGeometry(.86,.5,.58),paper('#65452f'));
  base.position.y=.32;base.castShadow=true;base.receiveShadow=true;chest.add(base);
  const lid=new THREE.Mesh(new THREE.BoxGeometry(.9,.16,.62),paper('#9a693e'));
  lid.position.y=.66;lid.castShadow=true;chest.add(lid);
  const bandMat=paper('#d5ae68',.45);
  const band=new THREE.Mesh(new THREE.BoxGeometry(.075,.62,.63),bandMat);band.position.y=.42;chest.add(band);
  const lock=new THREE.Mesh(new THREE.TorusGeometry(.095,.027,6,12),paper('#f1d38b',.38));lock.position.set(0,.4,.33);chest.add(lock);
  const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(.2,1),new THREE.MeshBasicMaterial({color:'#ffe29e'}));orb.position.set(0,1.02,0);chest.add(orb);
  chestGlow=new THREE.PointLight('#ffcf72',1.7,5);chestGlow.position.set(0,1.1,.4);chest.add(chestGlow);
  scene.add(chest);
}
makeHero();makeChest();
function moveTarget(){
  const tower=host.classList.contains('tower-scene');
  const width=Math.max(4,bounds.max.x-bounds.min.x),depth=Math.max(5,bounds.max.z-bounds.min.z);
  roomFloor=bounds.min.y+.02;
  const stageX=tower?bounds.min.x+width*.68:bounds.min.x+width*.34;
  chest.position.set(stageX,roomFloor,bounds.min.z+depth*.6);
  const spawnX=tower?bounds.min.x+width*.25:bounds.min.x+width*.08;
  hero.position.set(spawnX,roomFloor,bounds.max.z+depth*.18);
  move.x=0;move.z=0;
  cameraGoal.set(hero.position.x-3.5,hero.position.y+2.6,hero.position.z+Math.max(12,depth*.8));
  cameraTarget.set(hero.position.x+1.7,hero.position.y+1.15,(bounds.min.z+bounds.max.z)*.42);
  lanternWash.position.set(stageX,roomFloor+2.5, chest.position.z+1);
  lanternWash.intensity=tower?195:150;
}
new MutationObserver(moveTarget).observe(host,{attributes:true,attributeFilter:['class']});
const loader=new GLTFLoader();
loader.load('assets/3d/dream-tide-paper-harbor.glb',(gltf)=>{
  room=gltf.scene;
  const rawBounds=new THREE.Box3().setFromObject(room), rawSize=rawBounds.getSize(new THREE.Vector3()), rawCenter=rawBounds.getCenter(new THREE.Vector3());
  const fitScale=Math.min(18/Math.max(rawSize.x,1),9/Math.max(rawSize.y,1),24/Math.max(rawSize.z,1));
  room.scale.setScalar(fitScale);room.position.set(-rawCenter.x*fitScale,-rawCenter.y*fitScale,-rawCenter.z*fitScale);scene.add(room);
  room.traverse(node=>{if(node.isMesh){node.castShadow=true;node.receiveShadow=true;if(node.material)node.material.needsUpdate=true}});
  bounds.setFromObject(room);if(gltf.animations.length){mixer=new THREE.AnimationMixer(room);gltf.animations.forEach(clip=>mixer.clipAction(clip).play())}
  host.classList.add('paper-3d-ready');moveTarget();hero.visible=true;
},undefined,error=>console.warn('Blender scene did not load; keeping the illustrated fallback.',error));
function projectChest(){const p=chest.position.clone().add(new THREE.Vector3(0,1.15,0)).project(camera);const x=(p.x*.5+.5)*host.clientWidth;const y=(-p.y*.5+.5)*host.clientHeight;document.documentElement.style.setProperty('--hotspot-x',`${x}px`);document.documentElement.style.setProperty('--hotspot-y',`${y}px`)}
function resize(){const width=Math.max(1,host.clientWidth),height=Math.max(1,host.clientHeight);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(host);resize();
function onKeyDown(e){const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)&&playing&&!document.getElementById('questionDialog')?.open)e.preventDefault();held.add(k);if(k==='e'&&playing&&!document.getElementById('questionDialog')?.open)window.dispatchEvent(new CustomEvent('dream-interact'))}
function onKeyUp(e){held.delete(e.key.toLowerCase())}
window.addEventListener('keydown',onKeyDown);window.addEventListener('keyup',onKeyUp);window.addEventListener('blur',()=>held.clear());
window.addEventListener('dream-game-state',e=>{playing=Boolean(e.detail?.playing);if(!playing)held.clear()});
function draw(){requestAnimationFrame(draw);const dt=Math.min(clock.getDelta(),.04);const t=clock.elapsedTime;
  const canMove=playing&&!document.getElementById('questionDialog')?.open;
  move.x=canMove?((held.has('d')||held.has('arrowright'))?1:0)-((held.has('a')||held.has('arrowleft'))?1:0):0;
  move.z=canMove?((held.has('s')||held.has('arrowdown'))?1:0)-((held.has('w')||held.has('arrowup'))?1:0):0;
  if(canMove&&held.has(' ')&&!jumping){jumping=true;jumpVelocity=5.1}
  const speed=canMove&&held.has('shift')?4.2:2.3;
  if(hero&&canMove&&(move.x||move.z)){const len=Math.hypot(move.x,move.z)||1;hero.position.x+=move.x/len*speed*dt;hero.position.z+=move.z/len*speed*dt;hero.rotation.y=Math.atan2(move.x,move.z);const stride=Math.sin(t*12*(speed>3?1.3:1));legs.forEach((leg,i)=>leg.rotation.x=stride*(i?-.45:.45));}
  if(jumping&&hero){hero.position.y+=jumpVelocity*dt;jumpVelocity-=12*dt;if(hero.position.y<=roomFloor){hero.position.y=roomFloor;jumping=false;jumpVelocity=0}}
  if(hero){const w=bounds.max.x-bounds.min.x,d=bounds.max.z-bounds.min.z;hero.position.x=THREE.MathUtils.clamp(hero.position.x,bounds.min.x+w*.025,bounds.max.x-w*.025);hero.position.z=THREE.MathUtils.clamp(hero.position.z,bounds.min.z-d*.02,bounds.max.z+d*.2);if(canMove&&!(move.x||move.z))legs.forEach(leg=>leg.rotation.x*=.82);hero.position.y=jumping?hero.position.y:roomFloor+Math.sin(t*2.2)*.025;
    const target=new THREE.Vector3(hero.position.x-3.5,hero.position.y+2.6,hero.position.z+Math.max(12,(bounds.max.z-bounds.min.z)*.8));camera.position.lerp(target,1-Math.pow(.002,dt));cameraTarget.lerp(new THREE.Vector3(hero.position.x+1.7,hero.position.y+1.15,(bounds.min.z+bounds.max.z)*.42),1-Math.pow(.002,dt));
  }
  if(chest){chest.children[4].rotation.y=t*.55;chest.children[4].position.y=1.02+Math.sin(t*2)*.07;projectChest()}
  if(mixer)mixer.update(dt);camera.lookAt(cameraTarget);renderer.render(scene,camera)
}
requestAnimationFrame(draw);



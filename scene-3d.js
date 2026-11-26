import * as THREE from 'three';

const host=document.getElementById('sceneArt'), canvas=document.getElementById('sceneCanvas');
if(!host||!canvas)throw new Error('The 3D scene canvas is missing.');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0x000000,0);
const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight('#fff0cf','#334338',2.1));
const key=new THREE.DirectionalLight('#f7dba0',2.1);key.position.set(-4,8,9);key.castShadow=true;scene.add(key);
const warm=new THREE.PointLight('#ffd58a',2.6,7,1.6);scene.add(warm);
const camera=new THREE.OrthographicCamera(-9,9,5.1,-5.1,.1,100);camera.position.set(0,1.6,20);camera.lookAt(0,-.2,0);
const paper=(color,roughness=.82)=>new THREE.MeshStandardMaterial({color,roughness,flatShading:true});
let aspect=16/9,span=18, floorY=-3.75, playing=false,jumping=false,jumpVelocity=0,hero,chest,orb,orbLight,shadow,legs=[],roomClock=0;
const held=new Set(),clock=new THREE.Clock();
function makeHero(){
 hero=new THREE.Group();
 const cloak=new THREE.Mesh(new THREE.ConeGeometry(.42,1.14,7),paper('#245147'));cloak.position.y=.7;cloak.castShadow=true;hero.add(cloak);
 const collar=new THREE.Mesh(new THREE.ConeGeometry(.32,.28,7),paper('#c89049'));collar.position.y=1.22;hero.add(collar);
 const face=new THREE.Mesh(new THREE.SphereGeometry(.255,12,9),paper('#e7cfaa'));face.scale.set(1,.9,.84);face.position.set(0,1.35,.08);face.castShadow=true;hero.add(face);
 const hood=new THREE.Mesh(new THREE.ConeGeometry(.31,.48,7),paper('#d8ad5e'));hood.position.set(0,1.59,.04);hood.castShadow=true;hero.add(hood);
 const eyeMat=new THREE.MeshBasicMaterial({color:'#20231e'});for(const x of [-.09,.09]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.024,7,6),eyeMat);eye.position.set(x,1.36,.295);hero.add(eye)}
 for(const side of [-1,1]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.06,.075,.36,7),paper('#463a31'));leg.position.set(side*.14,.18,.02);leg.castShadow=true;hero.add(leg);legs.push(leg)}
 const sleeve=new THREE.Mesh(new THREE.ConeGeometry(.105,.34,6),paper('#c89049'));sleeve.position.set(.38,.91,.04);sleeve.rotation.z=-.55;hero.add(sleeve);
 const lamp=new THREE.PointLight('#f4cb7c',1.1,2.6);lamp.position.set(.36,1,.35);hero.add(lamp);
 scene.add(hero);
 shadow=new THREE.Mesh(new THREE.CircleGeometry(.45,24),new THREE.MeshBasicMaterial({color:'#151b16',transparent:true,opacity:.27,depthWrite:false}));shadow.scale.y=.32;shadow.position.set(0,floorY+.018,.2);scene.add(shadow);
}
function makeChest(){
 chest=new THREE.Group();const wood=paper('#65472f'),trim=paper('#d0a65e',.46);
 const base=new THREE.Mesh(new THREE.BoxGeometry(.88,.48,.52),wood);base.position.y=.28;base.castShadow=true;chest.add(base);
 const lid=new THREE.Mesh(new THREE.BoxGeometry(.94,.18,.56),paper('#997044'));lid.position.y=.6;lid.castShadow=true;chest.add(lid);
 const band=new THREE.Mesh(new THREE.BoxGeometry(.08,.59,.58),trim);band.position.y=.37;chest.add(band);
 const lock=new THREE.Mesh(new THREE.TorusGeometry(.09,.026,7,14),trim);lock.position.set(0,.34,.3);chest.add(lock);
 orb=new THREE.Mesh(new THREE.OctahedronGeometry(.19,1),new THREE.MeshBasicMaterial({color:'#ffe39e'}));orb.position.set(0,1.08,0);chest.add(orb);
 orbLight=new THREE.PointLight('#ffcf72',2.2,4);orbLight.position.set(0,1,.4);chest.add(orbLight);scene.add(chest);
 const floorGlow=new THREE.Mesh(new THREE.CircleGeometry(.8,28),new THREE.MeshBasicMaterial({color:'#e8b964',transparent:true,opacity:.18,depthWrite:false}));floorGlow.scale.y=.48;floorGlow.position.set(0,.025,0);chest.add(floorGlow);
}
function layout(){const tower=host.classList.contains('tower-scene');span=10.6*aspect;floorY=-3.65;
 hero.position.set(tower?-span*.28:-span*.3,floorY,0);chest.position.set(tower?span*.28:span*.29,floorY,0);
 shadow.position.set(hero.position.x,floorY+.02,.2);warm.position.set(chest.position.x,floorY+1.5,1.1);
 camera.left=-span/2;camera.right=span/2;camera.top=5.3;camera.bottom=-5.3;camera.position.set(0,1.7,20);camera.lookAt(0,-.1,0);camera.updateProjectionMatrix();
}
makeHero();makeChest();
new MutationObserver(layout).observe(host,{attributes:true,attributeFilter:['class']});
// The Blender render supplies the full paper-diorama environment; the Three.js layer animates the hero and the clickable key chest in front.
host.classList.add('paper-3d-ready');layout();hero.visible=true;
function projectChest(){const p=chest.position.clone().add(new THREE.Vector3(0,1.12,0)).project(camera);document.documentElement.style.setProperty('--hotspot-x',`${(p.x*.5+.5)*host.clientWidth}px`);document.documentElement.style.setProperty('--hotspot-y',`${(-p.y*.5+.5)*host.clientHeight}px`)}
function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);aspect=w/h;renderer.setSize(w,h,false);layout()}
new ResizeObserver(resize).observe(host);resize();
function down(e){const k=e.key.toLowerCase();if(playing&&!document.getElementById('questionDialog')?.open&&['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();held.add(k);if(k==='e'&&playing&&!document.getElementById('questionDialog')?.open)window.dispatchEvent(new CustomEvent('dream-interact'))}
function up(e){held.delete(e.key.toLowerCase())}
window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',()=>held.clear());window.addEventListener('dream-game-state',e=>{playing=Boolean(e.detail?.playing);if(!playing)held.clear()});
function draw(){requestAnimationFrame(draw);const dt=Math.min(clock.getDelta(),.04);roomClock+=dt;const t=roomClock;const active=playing&&!document.getElementById('questionDialog')?.open;
 const dx=active?((held.has('d')||held.has('arrowright'))?1:0)-((held.has('a')||held.has('arrowleft'))?1:0):0;
 const dz=active?((held.has('s')||held.has('arrowdown'))?1:0)-((held.has('w')||held.has('arrowup'))?1:0):0;
 if(active&&held.has(' ')&&!jumping){jumping=true;jumpVelocity=5.2}
 if(hero){const speed=active&&held.has('shift')?4:2.25;hero.position.x=THREE.MathUtils.clamp(hero.position.x+dx*speed*dt,-span*.43,span*.43);hero.position.z=THREE.MathUtils.clamp(hero.position.z+dz*speed*dt,-1.2,1.2);
 if(jumping){hero.position.y+=jumpVelocity*dt;jumpVelocity-=13*dt;if(hero.position.y<=floorY){hero.position.y=floorY;jumping=false;jumpVelocity=0}}
 if(dx){hero.rotation.y=dx<0?Math.PI:0;const stride=Math.sin(t*(speed>3?17:12))*.55;legs.forEach((leg,i)=>leg.rotation.x=stride*(i?-1:1))}else legs.forEach(leg=>leg.rotation.x*=.82);
 if(!jumping)hero.position.y=floorY+Math.sin(t*2.2)*.025;shadow.position.x=hero.position.x;shadow.scale.set(.45+(hero.position.y-floorY)*.12,.14,1);
 }
 chest.position.y=floorY+Math.sin(t*1.5)*.025;orb.rotation.y=t*.7;orb.rotation.x=Math.sin(t*.6)*.15;orb.position.y=1.08+Math.sin(t*2)*.08;orbLight.intensity=1.7+Math.sin(t*2.4)*.45;
 host.style.backgroundPosition=`${50+hero.position.x/span*6}% 52%`;projectChest();renderer.render(scene,camera)
}
requestAnimationFrame(draw);


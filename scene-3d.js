import * as THREE from 'three';

const host=document.getElementById('sceneArt');
const canvas=document.getElementById('sceneCanvas');
if(!host||!canvas)throw new Error('The room scene canvas is missing.');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.18;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.setClearColor('#17211c',1);
const scene=new THREE.Scene();
scene.background=new THREE.Color('#17211c');
scene.fog=new THREE.Fog('#17211c',18,34);
scene.add(new THREE.HemisphereLight('#f7e6c5','#26392f',1.55));
const moon=new THREE.DirectionalLight('#d8e3d5',1.15);moon.position.set(-5,9,4);moon.castShadow=true;moon.shadow.mapSize.set(1024,1024);scene.add(moon);
const camera=new THREE.PerspectiveCamera(52,1,.1,100);
const world=new THREE.Group();scene.add(world);
const hero=new THREE.Group();scene.add(hero);
const keyLight=new THREE.PointLight('#ffc975',2.3,8,1.6);scene.add(keyLight);
const clock=new THREE.Clock();
const held=new Set();
const legs=[],arms=[];
let roomGroup=null,colliders=[],targetObject=null,targetLight=null,targetOrb=null,playing=false,jumping=false,jumpVelocity=0,roomTime=0,roomStage=-1;
let roomBounds={minX:-7.4,maxX:7.4,minZ:-5.6,maxZ:5.7};
let canInteract=false, cameraYaw=0, cameraPitch=.33, dragging=false,lastPointer={x:0,y:0};
const mat=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness,flatShading:true});
const woodDark=mat('#39291f'),wood=mat('#634430'),woodMid=mat('#805a3b'),brass=mat('#c5a15f',.4,.62),cream=mat('#dac9a4'),ink=mat('#243a32');
function cube(parent,name,pos,size,material,cast=true,receive=true){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),material);mesh.name=name;mesh.position.set(...pos);mesh.castShadow=cast;mesh.receiveShadow=receive;parent.add(mesh);return mesh}
function wallpaperTexture(base,accent){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,256,256);x.strokeStyle=accent;x.globalAlpha=.35;x.lineWidth=2;for(let y=0;y<=256;y+=64)for(let xx=0;xx<=256;xx+=64){x.beginPath();x.moveTo(xx+32,y+5);x.bezierCurveTo(xx+70,y+32,xx+57,y+46,xx+32,y+59);x.bezierCurveTo(xx+7,y+46,xx-6,y+32,xx+32,y+5);x.stroke();x.beginPath();x.arc(xx+32,y+32,8,0,Math.PI*2);x.stroke();x.fillStyle=accent;x.globalAlpha=.5;x.beginPath();x.arc(xx+32,y+32,2.5,0,Math.PI*2);x.fill();x.globalAlpha=.35}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,2);t.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshStandardMaterial({map:t,roughness:.94})}
function addWallDecor(x,z,style){const frame=cube(roomGroup,'antique picture frame',[x,4.05,z],[1.18,1.42,.12],woodDark);cube(roomGroup,'picture mat',[x,4.05,z+.07],[.96,1.2,.035],brass,false);cube(roomGroup,'portrait',[x,4.05,z+.095],[.82,1.06,.025],style,false);cube(roomGroup,'picture glint',[x,4.05,z+.115],[.12,.55,.015],cream,false)}
function makeWindow(x,z,y=4.05,w=2.25,h=2.65,round=false){const glass=mat('#526d71',.22,.05);glass.emissive=new THREE.Color('#66817b');glass.emissiveIntensity=.25;cube(roomGroup,'moonlit window',[x,y,z],[w,h,.12],glass,false);const trim=woodMid;if(round){const ring=new THREE.Mesh(new THREE.TorusGeometry(w*.54,.11,8,48),trim);ring.position.set(x,y,z+.12);roomGroup.add(ring)}else{cube(roomGroup,'window top',[x,y+h/2,z+.12],[w+.22,.16,.16],trim);cube(roomGroup,'window sill',[x,y-h/2,z+.12],[w+.4,.19,.22],trim);cube(roomGroup,'window left',[x-w/2,y,z+.12],[.14,h,.16],trim);cube(roomGroup,'window right',[x+w/2,y,z+.12],[.14,h,.16],trim)}cube(roomGroup,'window vertical muntin',[x,y,z+.19],[.08,h,.08],brass);cube(roomGroup,'window horizontal muntin',[x,y,z+.2],[w,.07,.08],brass)}
function makeDrawerCabinet(x,z,width=2.1,height=4.5,count=5){const g=new THREE.Group();g.position.set(x,0,z);roomGroup.add(g);cube(g,'cabinet body',[0,height/2,0],[width,height,.95],woodDark);cube(g,'cabinet crown',[0,height+.1,0],[width+.24,.22,1.1],woodMid);cube(g,'cabinet base',[0,.16,0],[width+.16,.3,1.08],woodMid);for(let i=0;i<count;i++){const y=.58+i*(height-.85)/count;for(let j=0;j<2;j++){const dw=width*.43,dx=(j?1:-1)*width*.235;cube(g,'drawer front',[dx,y,.5],[dw,.56,.12],wood);const pull=new THREE.Mesh(new THREE.TorusGeometry(.075,.025,6,12),brass);pull.position.set(dx,y,.59);g.add(pull);for(const px of [-.29,.29]){const knob=new THREE.Mesh(new THREE.SphereGeometry(.035,7,6),brass);knob.position.set(dx+px,y,.58);g.add(knob)}}}for(const xedge of [-width/2,width/2])cube(g,'cabinet carved edge',[xedge,height/2,.53],[.08,height-.3,.1],woodMid);colliders.push({x,z,hw:width/2+.22,hd:.72});return g}
function makeBookshelf(x,z){const g=new THREE.Group();g.position.set(x,0,z);roomGroup.add(g);cube(g,'bookcase back',[0,2.45,0],[2.4,4.9,.25],woodDark);for(let y=.25;y<=4.8;y+=1.12)cube(g,'bookshelf shelf',[0,y,.45],[2.55,.14,1],woodMid);for(let level=0;level<4;level++){let cursor=-1.05;for(let i=0;i<6;i++){const h=.53+(i%3)*.13,w=.2+(i%2)*.035;const book=cube(g,'old storybook',[cursor+w/2,.36+level*1.12+h/2,.31],[w,h,.56],mat(['#6b4533','#526c5d','#a07845','#454b57','#8b5746'][i%5]));cursor+=w+.07}}colliders.push({x,z,hw:1.38,hd:.72});}
function makeDesk(x,z,variant=0){const g=new THREE.Group();g.position.set(x,0,z);roomGroup.add(g);cube(g,'writing desk top',[0,1.45,0],[2.25,.16,1.05],woodMid);for(const sx of [-.87,.87]){cube(g,'desk leg',[sx,.72,0],[.15,1.35,.16],woodDark);cube(g,'drawer pedestal',[sx*.78,1.12,.08],[.48,.62,.72],wood)}cube(g,'desk drawer',[0,1.16,.57],[.62,.36,.1],wood);const knob=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),brass);knob.position.set(0,1.15,.65);g.add(knob);cube(g,'ledger book',[-.4,1.56,-.05],[.62,.08,.44],mat(variant?'#5d7280':'#7d5038'));cube(g,'coin stack',[.45,1.58,.1],[.23,.07,.23],brass);colliders.push({x,z,hw:1.28,hd:.72});}
function makeLamp(x,z,y=5.7){const chain=cube(roomGroup,'lamp chain',[x,(y+4.8)/2,z],[.035,y-4.8,.035],woodDark);const cap=new THREE.Mesh(new THREE.CylinderGeometry(.18,.28,.16,12),brass);cap.position.set(x,4.8,z);roomGroup.add(cap);const shade=new THREE.Mesh(new THREE.CylinderGeometry(.28,.58,.48,14,1,true),mat('#c5a06a',.48));shade.position.set(x,4.48,z);roomGroup.add(shade);const glow=new THREE.PointLight('#ffd486',17,9,1.6);glow.position.set(x,4.35,z);roomGroup.add(glow);return glow}
function makeChest(x,z,variant=0){const g=new THREE.Group();g.position.set(x,0,z);roomGroup.add(g);const body=cube(g,'interactive savings chest',[0,.48,0],[1.2,.82,.82],mat(variant?'#344d53':'#60402d'));body.castShadow=true;cube(g,'chest lid',[0,.96,0],[1.27,.22,.88],mat(variant?'#607f84':'#9a6b3d'));for(let xx of [-.46,.46])cube(g,'brass chest corner',[xx,.56,.43],[.1,.75,.08],brass);const lock=new THREE.Mesh(new THREE.TorusGeometry(.12,.035,8,14),brass);lock.position.set(0,.55,.46);g.add(lock);targetOrb=new THREE.Mesh(new THREE.IcosahedronGeometry(.24,1),new THREE.MeshStandardMaterial({color:'#ffe3a1',emissive:'#d9922f',emissiveIntensity:1.5,metalness:.2,roughness:.25}));targetOrb.position.set(0,1.48,0);g.add(targetOrb);targetLight=new THREE.PointLight('#ffcd72',3,6,1.6);targetLight.position.set(0,1.55,.2);g.add(targetLight);const floorGlow=new THREE.Mesh(new THREE.CircleGeometry(.9,32),new THREE.MeshBasicMaterial({color:'#e8b964',transparent:true,opacity:.17,depthWrite:false}));floorGlow.rotation.x=-Math.PI/2;floorGlow.position.set(0,.025,0);g.add(floorGlow);colliders.push({x,z,hw:.82,hd:.62});targetObject=g;return g}
function makeClock(x,z,y=5){const base=mat('#3b2d26');const disk=new THREE.Mesh(new THREE.CylinderGeometry(.56,.56,.14,32),base);disk.rotation.x=Math.PI/2;disk.position.set(x,y,z);roomGroup.add(disk);const face=new THREE.Mesh(new THREE.CircleGeometry(.47,32),cream);face.position.set(x,y,z+.09);roomGroup.add(face);for(let i=0;i<12;i++){const a=i*Math.PI/6;const tick=cube(roomGroup,'clock mark',[x+Math.sin(a)*.35,y+Math.cos(a)*.35,z+.11],[.035,.09,.02],woodDark,false);tick.rotation.z=-a}const hand=cube(roomGroup,'clock hand',[x+.03,y+.05,z+.14],[.035,.3,.025],woodDark,false);hand.rotation.z=-.28}
function makeRug(){const rug=cube(roomGroup,'woven rug',[0,.035,.1],[5.4,.035,3.5],mat('#664943'));cube(roomGroup,'rug inset',[0,.058,.1],[5.12,.025,3.22],mat('#9a7657'));cube(roomGroup,'rug inner',[0,.076,.1],[4.85,.018,2.95],mat('#344c43'));for(let x=-2.3;x<=2.31;x+=.36){const diamond=new THREE.Mesh(new THREE.OctahedronGeometry(.12,0),mat('#c59c5c'));diamond.scale.set(1,.12,1);diamond.position.set(x,.105,.1);roomGroup.add(diamond)}}
function buildRoom(stage){roomStage=stage;if(roomGroup){scene.remove(roomGroup);roomGroup.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&!Array.isArray(o.material))o.material.dispose()})}roomGroup=new THREE.Group();scene.add(roomGroup);colliders=[];targetObject=null;targetOrb=null;targetLight=null;
 const tower=stage===1,wallMat=wallpaperTexture(tower?'#253f49':'#34473b',tower?'#d1b56e':'#c8ac70');const floorMat=mat('#4b3628');
 // Enclosed dream room shell: continuous plank floor, patterned walls, panelled wainscot and ceiling beams.
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(16,14),floorMat);floor.rotation.x=-Math.PI/2;floor.position.set(0,0,0);floor.receiveShadow=true;roomGroup.add(floor);
 for(let row=0;row<15;row++){const z=-6.7+row*.92;for(let col=0;col<8;col++){const x=-7+col*2+(row%2)*.85;const plank=cube(roomGroup,'individual oak floorboard',[x,.018,z],[1.68,.045,.88],mat(['#4d382b','#58402e','#493327','#604630'][(row+col)%4]));plank.receiveShadow=true}}
 cube(roomGroup,'back wallpaper',[0,4.15,-6.98],[16,5.6,.22],wallMat,false);cube(roomGroup,'left wallpaper',[-7.98,4.15,0],[.22,5.6,14],wallMat,false);cube(roomGroup,'right wallpaper',[7.98,4.15,0],[.22,5.6,14],wallMat,false);
 for(const [x,z,w] of [[0,-6.78,16],[-7.78,0,14],[7.78,0,14]]){const side=x===0?'back':'side';cube(roomGroup,`${side} dark wainscot`,[x,1.22,z],side==='back'?[w,2.42,.28]:[.28,2.42,w],mat('#25362f'));for(let px=-7.25;px<7.5;px+=1.05)if(side==='back')cube(roomGroup,'raised wall panel',[px,1.2,-6.59],[.86,1.85,.08],mat(tower?'#39515a':'#3e5145'));for(let py=.24;py<2.4;py+=.55){if(side==='side')cube(roomGroup,'side panel rail',[x>0?7.6:-7.6,py,z],[.08,.035,w-.4],woodMid)}}
 cube(roomGroup,'back baseboard',[0,.22,-6.48],[16,.3,.22],woodMid);cube(roomGroup,'left baseboard',[-7.48,.22,0],[.22,.3,13.5],woodMid);cube(roomGroup,'right baseboard',[7.48,.22,0],[.22,.3,13.5],woodMid);
 for(let x=-7.4;x<=7.41;x+=3.7)cube(roomGroup,'ceiling cross beam',[x,6.95,0],[.18,.22,14],woodDark);
 // Furniture: tall drawer cabinet, bookshelf, work table, framed portrait, wall clock, window and aged ornaments.
 makeDrawerCabinet(-5.55,-4.9,2.15,4.35,5);makeBookshelf(5.35,-5.55);makeClock(-2.65,-6.46,4.85);addWallDecor(2.85,-6.45,mat(tower?'#547783':'#6a886a'));
 if(tower){makeWindow(0,-6.48,4.45,3.25,3.25,true);const beacon=new THREE.Group();beacon.position.set(0,3.35,-4.9);roomGroup.add(beacon);cube(beacon,'lighthouse beacon stand',[0,1.2,0],[1.8,.24,1.2],woodMid);const lamp=new THREE.Mesh(new THREE.SphereGeometry(.3,18,12),new THREE.MeshStandardMaterial({color:'#fff2b5',emissive:'#ffb948',emissiveIntensity:2}));lamp.position.set(0,1.62,0);beacon.add(lamp);const beam=new THREE.SpotLight('#f8d680',32,18,.37,.6,1.2);beam.position.set(0,1.8,.2);beam.target.position.set(2,0,-5);beacon.add(beam,beam.target);makeChest(-3.4,-1.45,1);makeLamp(-3.4,-4.7,6.3);}
 else{makeWindow(-.25,-6.48,4.45,2.6,2.6,false);makeDesk(-1.7,-2.1);makeLamp(-1.7,-2.05,5.7);makeChest(3.45,-1.35,0);makeLamp(3.45,-1.35,5.9);makeRug();makeDesk(4.8,1.8,0)}
 // Side wall sconces make the room read as an enclosed, lived-in space.
 for(const side of [-1,1])for(const z of [-3.5,1.4]){const x=side*7.72;cube(roomGroup,'wall sconce backing',[x,3.1,z],[.16,.5,.3],woodDark);const bulb=new THREE.PointLight(tower?'#8bc8d2':'#ffd18a',5,6,2);bulb.position.set(x-side*.35,3.25,z);roomGroup.add(bulb)}
 const ceiling=new THREE.Mesh(new THREE.PlaneGeometry(16,14),mat(tower?'#182a30':'#192720'));ceiling.rotation.x=Math.PI/2;ceiling.position.y=7.15;roomGroup.add(ceiling);
 roomBounds={minX:-7.15,maxX:7.15,minZ:-6.2,maxZ:5.95};
 scene.fog.color.set(tower?'#182a31':'#17211c');scene.background.set(tower?'#182a31':'#17211c');moon.color.set(tower?'#c3dbe0':'#e5d8bc');keyLight.color.set(tower?'#9bc8d0':'#f7dba0');
 hero.position.set(tower?-1.1:0,0,4.5);hero.rotation.y=Math.PI;cameraYaw=0;
 keyLight.position.set(tower?-4:4,8,5);
}
function buildHero(){
 const cloth=mat('#234d45'),gold=mat('#d5a853'),skin=mat('#ead2aa'),boots=mat('#342c26');
 const body=new THREE.Mesh(new THREE.ConeGeometry(.38,1.1,9),cloth);body.position.y=.72;body.castShadow=true;hero.add(body);
 const frontApron=cube(hero,'paper cloak front',[0,.7,.31],[.3,.55,.035],mat('#38675a'));frontApron.castShadow=true;
 const head=new THREE.Mesh(new THREE.SphereGeometry(.25,16,12),skin);head.scale.set(.9,1,.84);head.position.set(0,1.35,.045);head.castShadow=true;hero.add(head);
 const hood=new THREE.Mesh(new THREE.ConeGeometry(.32,.47,9),gold);hood.position.set(0,1.57,0);hood.rotation.x=-.12;hood.castShadow=true;hero.add(hood);
 const eyeMat=new THREE.MeshBasicMaterial({color:'#201d19'});for(const x of [-.085,.085]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.023,8,6),eyeMat);eye.position.set(x,1.36,.255);hero.add(eye)}
 for(const side of [-1,1]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.065,.22,4,8),boots);leg.position.set(side*.13,.2,0);leg.castShadow=true;hero.add(leg);legs.push(leg);const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.065,.27,4,8),cloth);arm.position.set(side*.38,.86,0);arm.rotation.z=side*.16;arm.castShadow=true;hero.add(arm);arms.push(arm)}
 const satchel=cube(hero,'little saving pouch',[.29,.43,.12],[.25,.28,.18],mat('#a26d3c'));satchel.rotation.z=-.2;
 const aura=new THREE.PointLight('#ffd17d',.9,2.4);aura.position.set(.28,1.02,.34);hero.add(aura);scene.add(hero);
}
function projectTarget(){if(!targetObject)return;const point=targetObject.position.clone().add(new THREE.Vector3(0,1.7,0));point.project(camera);const x=(point.x*.5+.5)*host.clientWidth,y=(-point.y*.5+.5)*host.clientHeight;document.documentElement.style.setProperty('--hotspot-x',`${x}px`);document.documentElement.style.setProperty('--hotspot-y',`${y}px`);const d=Math.hypot(hero.position.x-targetObject.position.x,hero.position.z-targetObject.position.z);canInteract=d<2.25;window.dreamCanInteract=canInteract;const label=document.getElementById('interactLabel');const button=document.getElementById('sceneInteract');if(label)label.textContent=canInteract?'按 E / 點擊機關':'走近發光機關';if(button)button.classList.toggle('ready',canInteract)}
function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
function layout(){resize();projectTarget()}
function onDown(e){const k=e.key.toLowerCase();if(playing&&!document.getElementById('questionDialog')?.open&&['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();held.add(k);if(k==='e'&&playing&&!document.getElementById('questionDialog')?.open){if(canInteract)window.dispatchEvent(new CustomEvent('dream-interact'));else{const text=document.getElementById('keyText');if(text)text.textContent='走近發光機關，再按 E 或點擊'}}}
function onUp(e){held.delete(e.key.toLowerCase())}
window.addEventListener('keydown',onDown);window.addEventListener('keyup',onUp);window.addEventListener('blur',()=>held.clear());window.addEventListener('dream-game-state',e=>{playing=Boolean(e.detail?.playing);if(!playing)held.clear()});
canvas.addEventListener('pointerdown',e=>{dragging=true;lastPointer={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!dragging)return;cameraYaw-= (e.clientX-lastPointer.x)*.004;cameraPitch=THREE.MathUtils.clamp(cameraPitch+(e.clientY-lastPointer.y)*.002,-.08,.72);lastPointer={x:e.clientX,y:e.clientY}});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
function collides(x,z){return colliders.some(o=>Math.abs(x-o.x)<o.hw+.34&&Math.abs(z-o.z)<o.hd+.34)}
function draw(){requestAnimationFrame(draw);const dt=Math.min(clock.getDelta(),.04);roomTime+=dt;const active=playing&&!document.getElementById('questionDialog')?.open;
 const forward=active?((held.has('w')||held.has('arrowup'))?1:0)-((held.has('s')||held.has('arrowdown'))?1:0):0;
 const side=active?((held.has('d')||held.has('arrowright'))?1:0)-((held.has('a')||held.has('arrowleft'))?1:0):0;
 if(active&&held.has(' ')&&!jumping){jumping=true;jumpVelocity=5.4}
 if(hero){const speed=active&&held.has('shift')?4.3:2.45,len=Math.hypot(side,forward)||1;const mx=side/len*speed*dt,mz=-forward/len*speed*dt;const nx=THREE.MathUtils.clamp(hero.position.x+mx,roomBounds.minX,roomBounds.maxX),nz=THREE.MathUtils.clamp(hero.position.z+mz,roomBounds.minZ,roomBounds.maxZ);if(!collides(nx,hero.position.z))hero.position.x=nx;if(!collides(hero.position.x,nz))hero.position.z=nz;
 if(side||forward){hero.rotation.y=Math.atan2(side,-forward);const gait=Math.sin(roomTime*(speed>3?16:11))*.55;legs.forEach((leg,i)=>leg.rotation.x=gait*(i?-1:1));arms.forEach((arm,i)=>arm.rotation.x=gait*(i?1:-1))}else{legs.forEach(leg=>leg.rotation.x*=.8);arms.forEach(arm=>arm.rotation.x*=.8)}
 if(jumping){hero.position.y+=jumpVelocity*dt;jumpVelocity-=13*dt;if(hero.position.y<=0){hero.position.y=0;jumping=false;jumpVelocity=0}}else hero.position.y=Math.sin(roomTime*2.1)*.018;
 }
 const desired=new THREE.Vector3(hero.position.x+Math.sin(cameraYaw)*9,4.0+cameraPitch*1.8,hero.position.z+Math.cos(cameraYaw)*9);camera.position.lerp(desired,1-Math.pow(.0007,dt));const look=new THREE.Vector3(hero.position.x,1.25,hero.position.z-2.2);camera.lookAt(look);
 if(targetObject){targetOrb.rotation.y=roomTime*.7;targetOrb.position.y=1.48+Math.sin(roomTime*2)*.09;targetLight.intensity=2.2+Math.sin(roomTime*2.6)*.5;projectTarget()}
 const beacon=roomGroup?.getObjectByName('lighthouse beacon stand');if(beacon)beacon.rotation.y=Math.sin(roomTime*.7)*.13;
 renderer.render(scene,camera)
}
function updateStage(){const stage=host.classList.contains('tower-scene')?1:0;if(stage===roomStage)return;buildRoom(stage);layout()}
new MutationObserver(updateStage).observe(host,{attributes:true,attributeFilter:['class']});
buildHero();buildRoom(0);new ResizeObserver(layout).observe(host);layout();
requestAnimationFrame(draw);

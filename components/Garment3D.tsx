"use client";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

type Garment = "Blouse" | "Salwar suit" | "Dress" | "Gown";
type Measurements = { bust:number; waist:number; hips:number; shoulder:number; sleeve:number; length:number };
const skin = "#b97958";
const skinLight = "#c98d6b";
const hair = "#211613";

export default function Garment3D({ garment, measurements, fit, color }: {
  garment:Garment; measurements:Measurements; fit:string; color:string;
}) {
  return <Canvas camera={{position:[0,-0.2,6.4],fov:35}} dpr={[1,1.5]} shadows>
    <color attach="background" args={["#eee7e0"]}/>
    <ambientLight intensity={1.35}/>
    <directionalLight position={[3,5,5]} intensity={2.4} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
    <directionalLight position={[-3,2,-3]} intensity={1.1} color="#e8b9bd"/>
    <Environment preset="studio"/>
    <group position={[0,-1.28,0]}>
      <FemaleAvatar measurements={measurements}/>
      <Cloth garment={garment} measurements={measurements} fit={fit} color={color}/>
    </group>
    <ContactShadows position={[0,-1.29,0]} opacity={.24} scale={4.5} blur={2.4}/>
    <OrbitControls target={[0,-1.2,0]} enablePan={false} minDistance={4.2} maxDistance={8} minPolarAngle={.48} maxPolarAngle={2.25}/>
  </Canvas>;
}

function FemaleAvatar({measurements}:{measurements:Measurements}) {
  const body = useMemo(()=>{
    const bust=clamp(measurements.bust/36,.78,1.42);
    const waist=clamp(measurements.waist/30,.78,1.4);
    const hips=clamp(measurements.hips/38,.78,1.4);
    const shoulder=clamp(measurements.shoulder/14,.78,1.35);
    const p:number[]=[],idx:number[]=[]; const rings=44,seg=56;
    // Smooth, softly curved body surface; garment is layered just outside this surface.
    for(let r=0;r<=rings;r++){
      const t=r/rings,y=1.03-t*1.95;
      let w:number,d:number;
      if(t<.2){const q=t/.2;w=THREE.MathUtils.lerp(.20,.34*shoulder,q);d=THREE.MathUtils.lerp(.17,.205,q);}
      else if(t<.43){const q=(t-.2)/.23;w=THREE.MathUtils.lerp(.34*shoulder,.37*bust,q);d=THREE.MathUtils.lerp(.205,.235*bust,q);}
      else if(t<.63){const q=(t-.43)/.20;w=THREE.MathUtils.lerp(.37*bust,.265*waist,q);d=THREE.MathUtils.lerp(.235*bust,.18*waist,q);}
      else if(t<.79){const q=(t-.63)/.16;w=THREE.MathUtils.lerp(.265*waist,.39*hips,q);d=THREE.MathUtils.lerp(.18*waist,.235*hips,q);}
      else {const q=(t-.79)/.21;w=THREE.MathUtils.lerp(.39*hips,.34*hips,q);d=THREE.MathUtils.lerp(.235*hips,.20*hips,q);}
      for(let s=0;s<=seg;s++){const a=s/seg*Math.PI*2;const front=Math.max(0,Math.sin(a));p.push(Math.cos(a)*w,y,Math.sin(a)*d-front*.008);}
    }
    for(let r=0;r<rings;r++)for(let s=0;s<seg;s++){const a=r*(seg+1)+s,b=a+seg+1;idx.push(a,b,a+1,b,b+1,a+1);}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();return g;
  },[measurements]);
  const skinMat = <meshStandardMaterial color={skin} roughness={.72} metalness={0}/>;
  return <group>
    <mesh geometry={body} castShadow><meshStandardMaterial color={skin} roughness={.74}/></mesh>
    {/* neck and natural head silhouette */}
    <mesh position={[0,1.13,0]}><capsuleGeometry args={[.09,.20,8,16]}/>{skinMat}</mesh>
    <mesh position={[0,1.48,0]} scale={[.225,.30,.205]} castShadow><sphereGeometry args={[1,40,32]}/><meshStandardMaterial color={skinLight} roughness={.68}/></mesh>
    {/* ears */}
    {[-1,1].map(s=><mesh key={"ear"+s} position={[s*.222,1.48,0]} scale={[.045,.075,.035]}><sphereGeometry args={[1,20,16]}/>{skinMat}</mesh>)}
    {/* facial features on the front (+Z) */}
    {[-1,1].map(s=><group key={"eye"+s}>
      <mesh position={[s*.083,1.515,.184]} scale={[.052,.029,.018]}><sphereGeometry args={[1,24,16]}/><meshStandardMaterial color="#f4e9dd" roughness={.5}/></mesh>
      <mesh position={[s*.083,1.514,.201]} scale={[.022,.024,.012]}><sphereGeometry args={[1,20,16]}/><meshStandardMaterial color="#38251e" roughness={.35}/></mesh>
      <mesh position={[s*.083,1.52,.211]} scale={[.009,.012,.006]}><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color="#15110f" roughness={.25}/></mesh>
      <mesh position={[s*.083,1.554,.188]} rotation={[0,0,s*.12]}><capsuleGeometry args={[.012,.07,4,8]}/><meshStandardMaterial color={hair} roughness={.85}/></mesh>
    </group>)}
    <mesh position={[0,1.445,.205]} rotation={[.18,0,0]} scale={[.035,.075,.04]}><sphereGeometry args={[1,20,16]}/>{skinMat}</mesh>
    <mesh position={[0,1.365,.191]} scale={[.055,.018,.015]}><sphereGeometry args={[1,20,12]}/><meshStandardMaterial color="#8d4549" roughness={.65}/></mesh>
    <mesh position={[0,1.372,.202]} scale={[.04,.006,.009]}><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color="#d58a82" roughness={.6}/></mesh>
    {/* long dark hair, back volume and swept crown */}
    <mesh position={[0,1.52,-.055]} scale={[.245,.31,.215]}><sphereGeometry args={[1,32,24]}/><meshStandardMaterial color={hair} roughness={.94}/></mesh>
    <mesh position={[0,1.30,-.105]} scale={[.205,.38,.13]}><sphereGeometry args={[1,28,20]}/><meshStandardMaterial color={hair} roughness={.92}/></mesh>
    <mesh position={[-.075,1.61,.035]} rotation={[0,0,-.24]} scale={[.14,.09,.16]}><sphereGeometry args={[1,24,18]}/><meshStandardMaterial color="#30201b" roughness={.9}/></mesh>
    {/* shoulders and arms: relaxed, slightly away from the body */}
    {[-1,1].map(s=><group key={"arm"+s}>
      <mesh position={[s*.405,.72,.005]} rotation={[0,0,s*-.12]}><capsuleGeometry args={[.09,.47,10,18]}/>{skinMat}</mesh>
      <mesh position={[s*.47,.22,.025]} rotation={[0,0,s*-.035]}><capsuleGeometry args={[.067,.48,10,18]}/><meshStandardMaterial color={skinLight} roughness={.75}/></mesh>
      <mesh position={[s*.49,-.09,.035]} scale={[.07,.105,.045]}><sphereGeometry args={[1,20,16]}/>{skinMat}</mesh>
      {[0,1,2,3].map(i=><mesh key={i} position={[s*(.47+(i-1.5)*.027),-.17,.048]} rotation={[0,0,s*(i-1.5)*.06]}><capsuleGeometry args={[.012,.075,4,8]}/>{skinMat}</mesh>)}
    </group>)}
    {/* legs below long garments, softly tapered */}
    {[-1,1].map(s=><group key={"leg"+s}>
      <mesh position={[s*.145,-1.05,.005]} rotation={[0,0,s*-.018]}><capsuleGeometry args={[.105,.78,10,18]}/><meshStandardMaterial color={skin} roughness={.76}/></mesh>
      <mesh position={[s*.15,-1.55,.045]} scale={[.105,.22,.14]}><sphereGeometry args={[1,20,16]}/><meshStandardMaterial color={skinLight} roughness={.74}/></mesh>
    </group>)}
  </group>;
}

function Cloth({garment,measurements,fit,color}:{garment:Garment;measurements:Measurements;fit:string;color:string}) {
  const geometry = useMemo(()=>{
    const bust=clamp(measurements.bust/36,.7,1.55), waist=clamp(measurements.waist/30,.7,1.6), hips=clamp(measurements.hips/38,.7,1.6);
    const shoulder=clamp(measurements.shoulder/14,.7,1.5), isBlouse=garment==="Blouse";
    const baseLength=garment==="Blouse"?.72:garment==="Salwar suit"?1.48:garment==="Dress"?1.5:1.85;
    const height=baseLength*clamp(measurements.length/(garment==="Blouse"?15:garment==="Salwar suit"?42:garment==="Dress"?40:54),.6,1.3);
    const ease=fit==="Slim"?-.015:fit==="Loose"?.065:.025, rings=48, seg=64, p:number[]=[], idx:number[]=[];
    for(let r=0;r<=rings;r++){const t=r/rings,y=1-t*height;
      let radius=t<.25?THREE.MathUtils.lerp(.25*shoulder,.42*bust,t/.25):t<.53?THREE.MathUtils.lerp(.42*bust,.31*waist,(t-.25)/.28):t<.74?THREE.MathUtils.lerp(.31*waist,.43*hips,(t-.53)/.21):THREE.MathUtils.lerp(.43*hips,.43*hips*(garment==="Gown"?1.42:garment==="Dress"||garment==="Salwar suit"?1.12:.93),(t-.74)/.26);
      if(isBlouse&&t>.74)radius*=.84;radius=Math.max(.15,radius+ease);
      for(let s=0;s<=seg;s++){const a=s/seg*Math.PI*2;const wrinkle=Math.sin(a*7+t*15)*.004+Math.sin(a*13-t*9)*.002;p.push(Math.cos(a)*(radius+wrinkle),y,Math.sin(a)*(radius+wrinkle)*.59);}
    }
    for(let r=0;r<rings;r++)for(let s=0;s<seg;s++){const a=r*(seg+1)+s,b=a+seg+1;idx.push(a,b,a+1,b,b+1,a+1);}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();return g;
  },[garment,measurements,fit]);
  const sleeveLength=clamp(measurements.sleeve/10,0,3)*.38;
  const fabricRoughness=garment==="Gown"?.26: .46;
  return <group>
    <mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial color={color} roughness={fabricRoughness} side={THREE.DoubleSide} metalness={garment==="Gown"?.06:0}/></mesh>
    {/* shoulder caps give the bodice a more tailored neckline */}
    <mesh position={[0,.965,.008]} scale={[.24,.075,.16]}><sphereGeometry args={[1,32,20]}/><meshStandardMaterial color={color} roughness={fabricRoughness}/></mesh>
    {sleeveLength>.015&&<>
      <mesh position={[-.36,.78-sleeveLength*.28,.005]} rotation={[0,0,-.52]} castShadow><capsuleGeometry args={[.085,sleeveLength,8,16]}/><meshStandardMaterial color={color} roughness={fabricRoughness}/></mesh>
      <mesh position={[.36,.78-sleeveLength*.28,.005]} rotation={[0,0,.52]} castShadow><capsuleGeometry args={[.085,sleeveLength,8,16]}/><meshStandardMaterial color={color} roughness={fabricRoughness}/></mesh>
    </>}
  </group>;
}
function clamp(v:number,min:number,max:number){return Math.max(min,Math.min(max,v));}

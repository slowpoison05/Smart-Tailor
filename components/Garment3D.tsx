"use client";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

type Garment = "Blouse" | "Salwar suit" | "Dress" | "Gown";
type Measurements = { bust:number; waist:number; hips:number; shoulder:number; sleeve:number; length:number };
export default function Garment3D({ garment, measurements, fit, color }: {
  garment:Garment; measurements:Measurements; fit:string; color:string;
}) {
  return <Canvas camera={{position:[0,1.1,5.4],fov:35}} dpr={[1,1.5]}>
    <color attach="background" args={["#f4f0eb"]}/><ambientLight intensity={1.5}/>
    <directionalLight position={[4,5,5]} intensity={2}/><directionalLight position={[-3,2,-3]} intensity={1} color="#e6b9c6"/>
    <Environment preset="studio"/><group position={[0,-1.35,0]}><Mannequin/><Cloth garment={garment} measurements={measurements} fit={fit} color={color}/></group>
    <ContactShadows position={[0,-1.38,0]} opacity={.22} scale={4.5} blur={2.4}/>
    <OrbitControls enablePan={false} minDistance={3.5} maxDistance={7.5} minPolarAngle={.4} maxPolarAngle={2.3}/>
  </Canvas>;
}
function Mannequin() {
  const mat = <meshStandardMaterial color="#d7b39c" roughness={.8}/>;
  return <group>
    <mesh position={[0,1.45,0]}><sphereGeometry args={[.23,24,20]}/>{mat}</mesh>
    <mesh position={[0,1.12,0]}><cylinderGeometry args={[.08,.09,.2,18]}/>{mat}</mesh>
    <mesh position={[0,.55,0]}><capsuleGeometry args={[.28,.58,8,18]}/><meshStandardMaterial color="#d6d0c8"/></mesh>
    <mesh position={[-.38,.55,0]} rotation={[0,0,-.1]}><capsuleGeometry args={[.07,.72,6,12]}/>{mat}</mesh>
    <mesh position={[.38,.55,0]} rotation={[0,0,.1]}><capsuleGeometry args={[.07,.72,6,12]}/>{mat}</mesh>
    <mesh position={[-.14,-.48,0]}><capsuleGeometry args={[.11,.95,8,14]}/><meshStandardMaterial color="#d6d0c8"/></mesh>
    <mesh position={[.14,-.48,0]}><capsuleGeometry args={[.11,.95,8,14]}/><meshStandardMaterial color="#d6d0c8"/></mesh>
  </group>;
}
function Cloth({garment,measurements,fit,color}:{garment:Garment;measurements:Measurements;fit:string;color:string}) {
  const geometry = useMemo(()=>{
    const bust=clamp(measurements.bust/36,.7,1.55), waist=clamp(measurements.waist/30,.7,1.6), hips=clamp(measurements.hips/38,.7,1.6);
    const shoulder=clamp(measurements.shoulder/14,.7,1.5), isBlouse=garment==="Blouse";
    const baseLength=garment==="Blouse"?.7:garment==="Salwar suit"?1.48:garment==="Dress"?1.5:1.85;
    const height=baseLength*clamp(measurements.length/(garment==="Blouse"?15:garment==="Salwar suit"?42:garment==="Dress"?40:54),.6,1.3);
    const ease=fit==="Slim"?-.04:fit==="Loose"?.08:.02, rings=32, seg=48, p:number[]=[], idx:number[]=[];
    for(let r=0;r<=rings;r++){const t=r/rings,y=1-t*height;
      let radius=t<.25?THREE.MathUtils.lerp(.25*shoulder,.42*bust,t/.25):t<.53?THREE.MathUtils.lerp(.42*bust,.31*waist,(t-.25)/.28):t<.74?THREE.MathUtils.lerp(.31*waist,.43*hips,(t-.53)/.21):THREE.MathUtils.lerp(.43*hips,.43*hips*(garment==="Gown"?1.42:garment==="Dress"||garment==="Salwar suit"?1.12:.93),(t-.74)/.26);
      if(isBlouse&&t>.74)radius*=.84; radius=Math.max(.15,radius+ease);
      for(let s=0;s<=seg;s++){const a=s/seg*Math.PI*2,wrinkle=Math.sin(a*8+t*12)*.007;p.push(Math.cos(a)*(radius+wrinkle),y,Math.sin(a)*(radius+wrinkle)*.58);}
    }
    for(let r=0;r<rings;r++)for(let s=0;s<seg;s++){const a=r*(seg+1)+s,b=a+seg+1;idx.push(a,b,a+1,b,b+1,a+1);}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();return g;
  },[garment,measurements,fit]);
  const sleeveLength=clamp(measurements.sleeve/10,0,3)*.38;
  return <group>
    <mesh geometry={geometry} castShadow><meshStandardMaterial color={color} roughness={.43} side={THREE.DoubleSide}/></mesh>
    {sleeveLength>.015&&<>
      <mesh position={[-.36,.78-sleeveLength*.28,0]} rotation={[0,0,-.52]} castShadow>
        <capsuleGeometry args={[.075,sleeveLength,6,12]}/>
        <meshStandardMaterial color={color} roughness={.43}/>
      </mesh>
      <mesh position={[.36,.78-sleeveLength*.28,0]} rotation={[0,0,.52]} castShadow>
        <capsuleGeometry args={[.075,sleeveLength,6,12]}/>
        <meshStandardMaterial color={color} roughness={.43}/>
      </mesh>
    </>}
  </group>;
}
function clamp(v:number,min:number,max:number){return Math.max(min,Math.min(max,v));}

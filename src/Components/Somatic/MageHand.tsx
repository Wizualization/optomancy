import * as THREE from 'three'
import React, { Suspense, useState, useRef, useLayoutEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { useLoader } from '@react-three/fiber'
import { Mesh } from 'three';

function HandText(props: any) {
    const { gl } = useThree()
    const [finished, setFinished] = useState(false)
    const [handdata, setHanddata] = useState(''); 
    const font = useLoader(FontLoader, '/bold.blob')
    const config = useMemo(() => ({ font, size: 40, height: 50 }), [font])
    const mesh = useRef<Mesh>(null)
    useLayoutEffect(() => {
        const size = new THREE.Vector3()
        mesh.current?.geometry.computeBoundingBox();
        mesh.current?.geometry?.boundingBox?.getSize(size);
        mesh.current?.position?.set(-size.x / 2, -size.y / 2, -1);
    }, [handdata])

    useFrame((state) => {
        if (!finished){
            const joint = (gl.xr as any).getHand(0).joints['index-finger-tip'];
            if (joint?.jointRadius !== undefined){
                setHanddata(joint.toString());
                setFinished(true);
            } 
        }
    })

    return (
        <Suspense fallback={null}>
        <group {...props} scale={[1, 1, 0.1]}>
          <mesh ref={mesh}>
            <textGeometry args={[{handdata}, config]} />
            <meshNormalMaterial />
          </mesh>
        </group>
        </Suspense>
    )
  }
  
export default HandText;
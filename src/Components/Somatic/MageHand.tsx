/**TODO: 
 * Instead of the box interactions, we want to trigger this when the user
 * is trying to record an event and log their gestures as a command.
 * Also, remove the box now that we've confirmed it works with our config.
 * See https://immersive-web.github.io/webxr-hand-input/#skeleton-joints for joint refs
 */

import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { RoundedBox, Sphere, Text, CurveModifier } from '@react-three/drei';
import { extend, reconciler, useFrame, useThree } from '@react-three/fiber';
import { BufferGeometry, CatmullRomCurve3, Line, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, SplineCurve, Vector3 } from 'three';
import { useSpring, config } from 'react-spring';

const start = new Vector3(-0.25, 1.0, -0.3)
const end = new Vector3(0.25, 1.0, -0.3)
const startEnd = new Vector3().copy(end).sub(start)

function getTargetPos(handle: Vector3) {
  return new Vector3().copy(handle).sub(start).projectOnVector(startEnd).add(start)
}

const curve = new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25)

const offset = new Vector3()

let prevPinching = false

let velocity = new Vector3(0, 0, 0)
let targetPos = getTargetPos(new Vector3(0, 0, 0))

let frame = 0

function Pinchable({ children }: any) {
  const jointNames = [
    "wrist",
  
    "thumb-metacarpal",
    "thumb-phalanx-proximal",
    "thumb-phalanx-distal",
    "thumb-tip",
  
    "index-finger-metacarpal",
    "index-finger-phalanx-proximal",
    "index-finger-phalanx-intermediate",
    "index-finger-phalanx-distal",
    "index-finger-tip",
  
    "middle-finger-metacarpal",
    "middle-finger-phalanx-proximal",
    "middle-finger-phalanx-intermediate",
    "middle-finger-phalanx-distal",
    "middle-finger-tip",
  
    "ring-finger-metacarpal",
    "ring-finger-phalanx-proximal",
    "ring-finger-phalanx-intermediate",
    "ring-finger-phalanx-distal",
    "ring-finger-tip",
  
    "pinky-finger-metacarpal",
    "pinky-finger-phalanx-proximal",
    "pinky-finger-phalanx-intermediate",
    "pinky-finger-phalanx-distal",
    "pinky-finger-tip"
  ];

  const justTheTips = [
    "thumb-tip",
    "index-finger-tip",
    "middle-finger-tip",
    "ring-finger-tip",
    "pinky-finger-tip"
  ]
  
  //may as well do it this way
  /*const tipCurves = {
    "thumb-tip": new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25),
    "index-finger-tip": new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25),
    "middle-finger-tip": new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25),
    "ring-finger-tip": new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25),
    "pinky-finger-tip": new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25)
  }*/

  const fingstart = new THREE.Vector3(0, 0, 0)
  const [curveThum, setCurveThum] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [curveIndx, setCurveIndx] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [curveMidl, setCurveMidl] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [curveRing, setCurveRing] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [curvePink, setCurvePink] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  
  const curveRefThum = useRef()
  const curveRefIndx = useRef()
  const curveRefMidl = useRef()
  const curveRefRing = useRef()
  const curveRefPink = useRef()
  


  const curve = new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25)
  
  const { gl } = useThree()
  const hand = gl.xr.getHand(1) as any
  const ref = useRef<Mesh | null>(null)
  const v = new Vector3()
  const [label, setLabel] = useState(0)

  const [props, set] = useSpring(() => ({ scale: 1, config: config.wobbly }))

  useEffect(() => {
    if (!ref.current ) return
  }, [])

  useFrame(() => {
    if (!ref.current) return

    const handle = ref.current as any
    const thumb = hand.joints['thumb-tip']
    const index = hand.joints['index-finger-tip']
    
    //actually need to do it this way
    const middle = hand.joints['middle-tip']
    const ring = hand.joints['ring-tip']
    const pinky = hand.joints['pinky-tip']

    let pinching = false
    
    frame++

    //have to do it by individual finger?
    //at some point we can probs just push those positions to a websocket instead.
    //then we can just loop.
    if(thumb){
      setCurveThum(new CatmullRomCurve3([...curveThum.points, thumb.position], false, 'catmullrom', 0.25))
    }
    if(index){
      setCurveIndx(new CatmullRomCurve3([...curveIndx.points, index.position], false, 'catmullrom', 0.25))
    }
    if(middle){
      setCurveMidl(new CatmullRomCurve3([...curveMidl.points, middle.position], false, 'catmullrom', 0.25))
    }
    if(ring){
      setCurveRing(new CatmullRomCurve3([...curveRing.points, ring.position], false, 'catmullrom', 0.25))
    }
    if(pinky){
      setCurvePink(new CatmullRomCurve3([...curvePink.points, pinky.position], false, 'catmullrom', 0.25))
    }


    /*
    for(let jointName in justTheTips){
      const thisJoint = hand.joints[jointName];
      if (thisJoint){
        tipCurves[jointName].points.append(thisJoint.position);
      }
    }
    */

    if (index && thumb) {
      const pinch = Math.max(0, 1 - index.position.distanceTo(thumb.position) / 0.1)
      pinching = pinch > 0.82
      const pointer = v.lerpVectors(index.position, thumb.position, 0.5)
      const distance = pointer.distanceTo(handle.position)

      const tDistance = 0.2
      if (distance < tDistance) {
        let scale = 1 + (0.8 - pinch) * 0.4 * (1 - distance / tDistance)
        handle.scale.set(scale, scale, scale)
      }

      handle.material.color.set(pinching ? 'hotpink' : 'white');
        
      // Save offset when starting to ping
      if (pinching && !prevPinching) {
        offset.copy(pointer).sub(handle.position)
      }

      // Move pointer to the hand
      if (pinching) {
        handle.position.copy(pointer).sub(offset)
        curve.points[1].copy(handle.position)
      }
    }

    // Released
    if (prevPinching && !pinching) {
      velocity.set(0, 0, 0)
      targetPos.copy(getTargetPos(handle.position))
    }

    // return to the position
    if (!pinching) {
      const direction = new Vector3().copy(targetPos).sub(handle.position)
      velocity.add(direction.multiplyScalar(0.05))
      velocity.multiplyScalar(0.92)
      handle.position.add(velocity)
    }

    // Update line
    curve.points[1].copy(handle.position)

    // get current position
    let value = Math.floor((getTargetPos(handle.position).sub(start).length() / startEnd.length()) * 100)
    if (frame % 5 === 0) {
      setLabel(value)
    }

    prevPinching = pinching
  })

  return (
    <>
      <Sphere args={[0.01]} position={start} />
      <Sphere args={[0.01]} position={end} />
      <RoundedBox args={[0.03, 0.08, 0.08]} radius={0.01} ref={ref} position={[0, 1.2, -0.3]}>
        <meshStandardMaterial />
        <Text fontSize={0.02} position={[0, 0.07, 0]}>
          {label}
        </Text>
      </RoundedBox>
      <CurveModifier ref={curveRefThum} curve={curveThum}>
        <mesh><Sphere args={[0.01]} position={start} /></mesh>
      </CurveModifier>
      <CurveModifier ref={curveRefIndx} curve={curveIndx}>
        <mesh><Sphere args={[0.01]} position={start} /></mesh>
      </CurveModifier>
      <CurveModifier ref={curveRefMidl} curve={curveMidl}>
        <mesh><Sphere args={[0.01]} position={start} /></mesh>
      </CurveModifier>
      <CurveModifier ref={curveRefRing} curve={curveRing}>
        <mesh><Sphere args={[0.01]} position={start} /></mesh>
      </CurveModifier>
      <CurveModifier ref={curveRefPink} curve={curvePink}>
        <mesh><Sphere args={[0.01]} position={start} /></mesh>
      </CurveModifier>

    </>
  )
}

export default Pinchable;
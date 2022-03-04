/**TODO: 
 * Instead of the box interactions, we want to trigger this when the user
 * is trying to craft an event and log their gestures as a command.
 * Also, remove the box now that we've confirmed it works with our config.
 * See https://immersive-web.github.io/webxr-hand-input/#skeleton-joints for joint refs
 */

import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { RoundedBox, Sphere, Text, CurveModifier } from '@react-three/drei';
import { extend, reconciler, useFrame, useThree } from '@react-three/fiber';
import { BufferGeometry, CatmullRomCurve3, Line, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, SplineCurve, Vector3 } from 'three';
import { useSpring, config } from 'react-spring';
import {socket} from '../../utils/Socket';
import ComputeDTW from './GestureRecognition';

const start = new Vector3(-0.25, 1.0, -0.3)
const end = new Vector3(0.25, 1.0, -0.3)
const startEnd = new Vector3().copy(end).sub(start)

function getTargetPos(handle: Vector3) {
  return new Vector3().copy(handle).sub(start).projectOnVector(startEnd).add(start)
}

//for now we will just store these for a given session but we NEED TO CONNECT TO SERVER DB
let crafted_spells:any[] = [];
let last_craft:any[] = [];

const curve = new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25)

const offset = new Vector3()

let crafting = false;
let crafting_startTime = Date.now();
let prev_craftPinching = false

let casting = false;
let casting_startTime = Date.now();
let prev_castPinching = false

let last_cast:any[] = []

let velocity = new Vector3(0, 0, 0)
let targetPos = getTargetPos(new Vector3(0, 0, 0))

let frame = 0
let prev_frame = 0

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
  const hand0 = gl.xr.getHand(0) as any
  const hand1 = gl.xr.getHand(1) as any
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
    //actually need to do it this way
    const thumb0 = hand0.joints['thumb-tip']
    const index0 = hand0.joints['index-finger-tip']
    const middle0 = hand0.joints['middle-tip']
    const ring0 = hand0.joints['ring-tip']
    const pinky0 = hand0.joints['pinky-tip']

    const thumb1 = hand1.joints['thumb-tip']
    const index1 = hand1.joints['index-finger-tip']
    const middle1 = hand1.joints['middle-tip']
    const ring1 = hand1.joints['ring-tip']
    const pinky1 = hand1.joints['pinky-tip']



    let craftPinching = false
    let castPinching = false

    if(prev_frame < frame - 5 && crafting){

      last_craft.push({
        thumb0: thumb0, 
        index0: index0, 
        middle0: middle0, 
        ring0: ring0, 
        pinky0: pinky0,
        thumb1: thumb1, 
        index1: index1, 
        middle1: middle1, 
        ring1: ring1, 
        pinky1: pinky1
      })

      socket.emit('spellcast', JSON.stringify({
        thumb0: thumb0, 
        index0: index0, 
        middle0: middle0, 
        ring0: ring0, 
        pinky0: pinky0,
        thumb1: thumb1, 
        index1: index1, 
        middle1: middle1, 
        ring1: ring1, 
        pinky1: pinky1
      }));
      prev_frame = frame;

      //stop crafting if it has been more than 5 seconds
      if(Date.now() > (crafting_startTime + 5000)){
        crafted_spells.push(last_craft);
        crafting = false;
      }

    }

    if(prev_frame < frame - 5 && casting){

      last_cast.push({
        thumb0: thumb0, 
        index0: index0, 
        middle0: middle0, 
        ring0: ring0, 
        pinky0: pinky0,
        thumb1: thumb1, 
        index1: index1, 
        middle1: middle1, 
        ring1: ring1, 
        pinky1: pinky1
      })

      prev_frame = frame;

      //stop casting if it has been more than 5 seconds
      if(Date.now() > (casting_startTime + 5000)){

        if(crafted_spells.length > 0){
          for(let crafted_spell in crafted_spells){
            ComputeDTW(last_cast, JSON.parse(crafted_spell))
          }
        }

        casting = false;
      }

    }

    frame++

    //have to do it by individual finger?
    //at some point we can probs just push those positions to a websocket instead.
    //then we can just loop.
    /*
    if(thumb0){
      setCurveThum(new CatmullRomCurve3([...curveThum.points, thumb0.position], false, 'catmullrom', 0.25))
    }
    if(index0){
      setCurveIndx(new CatmullRomCurve3([...curveIndx.points, index0.position], false, 'catmullrom', 0.25))
    }
    if(middle0){
      setCurveMidl(new CatmullRomCurve3([...curveMidl.points, middle0.position], false, 'catmullrom', 0.25))
    }
    if(ring0){
      setCurveRing(new CatmullRomCurve3([...curveRing.points, ring0.position], false, 'catmullrom', 0.25))
    }
    if(pinky0){
      setCurvePink(new CatmullRomCurve3([...curvePink.points, pinky0.position], false, 'catmullrom', 0.25))
    }
  */

    /*
    for(let jointName in justTheTips){
      const thisJoint = hand0.joints[jointName];
      if (thisJoint){
        tipCurves[jointName].points.append(thisJoint.position);
      }
    }
    */

    if (index0 && thumb0) {
      const craftPinch = Math.max(0, 1 - index0.position.distanceTo(thumb0.position) / 0.1)
      craftPinching = craftPinch > 0.82
      //we set crafting to true, but we do not require pinch to continue crafting
      if(craftPinching && !crafting && !casting){
        crafting = true;
        last_craft = [];
        crafting_startTime = Date.now();
      }
      /*
      const pointer = v.lerpVectors(index0.position, thumb0.position, 0.5)
      const distance = pointer.distanceTo(handle.position)

      const tDistance = 0.2
      if (distance < tDistance) {
        let scale = 1 + (0.8 - craftPinch) * 0.4 * (1 - distance / tDistance)
        handle.scale.set(scale, scale, scale)
      }

      handle.material.color.set(craftPinching ? 'hotpink' : 'white');
        
      // Save offset when starting to ping
      if (craftPinching && !prev_craftPinching) {
        offset.copy(pointer).sub(handle.position)
      }

      // Move pointer to the hand
      if (craftPinching) {
        handle.position.copy(pointer).sub(offset)
        curve.points[1].copy(handle.position)
      }
      */
    }

    // Released
    if (prev_craftPinching && !craftPinching) {
      velocity.set(0, 0, 0)
      targetPos.copy(getTargetPos(handle.position))
    }

    // return to the position
    if (!craftPinching) {
      const direction = new Vector3().copy(targetPos).sub(handle.position)
      velocity.add(direction.multiplyScalar(0.05))
      velocity.multiplyScalar(0.92)
      handle.position.add(velocity)
    }

  //spell casting commands
  if (index1 && thumb1) {
    const castPinch = Math.max(0, 1 - index0.position.distanceTo(thumb0.position) / 0.1)
    castPinching = castPinch > 0.82
    //we set casting to true, but we do not require pinch to continue casting
    if(castPinching && !casting && !crafting){
      last_cast = [];
      casting = true;
      casting_startTime = Date.now();
    }
  }



    // Update line
    curve.points[1].copy(handle.position)

    // get current position
    let value = Math.floor((getTargetPos(handle.position).sub(start).length() / startEnd.length()) * 100)
    if (frame % 5 === 0) {
      setLabel(value)
    }

    prev_craftPinching = craftPinching
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
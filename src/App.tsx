//We know this demo from https://codesandbox.io/s/react-xr-hands-demo-gczkp?file=/src/index.tsx works;
import { OrbitControls } from '@react-three/drei/core/OrbitControls'
import { Sky } from '@react-three/drei/core/Sky'
import ReactDOM from 'react-dom'
import React from 'react'
import { VRCanvas, Hands, DefaultXRControllers } from '@react-three/xr'
import './App.css';
import Pinchable from './Components/Somatic/MageHand';

// Not sure why other joint pos demo breaks, but https://codesandbox.io/s/47vqp?file=/src/App.tsx works.
function App() {
  return (
    <VRCanvas>
      <Pinchable />
      <Hands />
      <OrbitControls />
      <ambientLight />
      <pointLight position={[1, 1, 1]} />
      <color args={['black']} attach="background" />
      {/* <Sky sunPosition={[500, 500, 500]} /> */}
    </VRCanvas>
  );
}

export default App;

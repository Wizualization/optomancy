//We know this demo from https://codesandbox.io/s/react-xr-hands-demo-gczkp?file=/src/index.tsx works;
import ReactDOM from 'react-dom'
import React from 'react'
import { VRCanvas, Hands, DefaultXRControllers } from '@react-three/xr'
import './App.css';
import HandText from './Components/Somatic/MageHand';


// was trying
// <HandText />
// after <Hands/>, but it keeps getting caught in a suspense loop.

// Not sure why that one broke, but https://codesandbox.io/s/47vqp?file=/src/App.tsx works.
function App() {
  return (
    <div className="App">
    <VRCanvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <DefaultXRControllers />
      <Hands />
    </VRCanvas>
    </div>
  );
}

export default App;

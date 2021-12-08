import ReactDOM from 'react-dom'
import React from 'react'
import { VRCanvas, Hands, DefaultXRControllers } from '@react-three/xr'
import './App.css';

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

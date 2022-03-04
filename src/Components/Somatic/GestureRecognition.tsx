import * as THREE from 'three';
import DynamicTimeWarping from 'dynamic-time-warping';

function jointMatrixToVec(joint: any){
    let jointVec = new THREE.Vector3(1,1,1);
    jointVec.setFromMatrixPosition(joint['matrix']);
    return(jointVec)
}

function jointsToVecs(ser:any[]){
    var vecs = ser.map(o=>{
        let thumb0 = jointMatrixToVec(o['thumb0']);
        let index0 = jointMatrixToVec(o['index0']);
        let middle0 = jointMatrixToVec(o['middle0']);
        let ring0 = jointMatrixToVec(o['ring0']);
        let pinky0 = jointMatrixToVec(o['pinky0']);
        let thumb1 = jointMatrixToVec(o['thumb1']);
        let index1 = jointMatrixToVec(o['index1']);
        let middle1 = jointMatrixToVec(o['middle1']);
        let ring1 = jointMatrixToVec(o['ring1']);
        let pinky1 = jointMatrixToVec(o['pinky1']);
        return ({
            thumb0: [thumb0.x, thumb0.y, thumb0.z],
            index0: [index0.x, index0.y, index0.z],
            middle0: [middle0.x, middle0.y, middle0.z],
            ring0: [ring0.x, ring0.y, ring0.z],
            pinky0: [pinky0.x, pinky0.y, pinky0.z],
            thumb1: [thumb1.x, thumb1.y, thumb1.z],
            index1: [index1.x, index1.y, index1.z],
            middle1: [middle1.x, middle1.y, middle1.z],
            ring1: [ring1.x, ring1.y, ring1.z],
            pinky1: [pinky1.x, pinky1.y, pinky1.z]
        })
    })

    return vecs;
    
}

export default function ComputeDTW(ser1: any[], ser2: any[]){
    /* our "ser" series are actually going to be arrays of gesture objects like
    [{"thumb0": {"matrix": [], [...]}}, [...]]
    we only care about the matrices, but we need to convert them to vector3s
    */

    const vecs1 = jointsToVecs(ser1);
    const vecs2 = jointsToVecs(ser2);

    var distFunc = function( a: any, b: any) {
        return Math.abs( a - b );
    };
    var dtw = new DynamicTimeWarping(vecs1, vecs2, distFunc);
    var dist = dtw.getDistance();
    var path = dtw.getPath();
    return {dtw: dtw, dist: dist, path: path};
}

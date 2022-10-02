import { useRef } from "react";
import { Canvas, useFrame, useLoader, extend } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "three-stdlib";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Color } from "three";

extend({ OrbitControls, TransformControls });


// eslint-disable-next-line no-unused-vars
function Model() {
  const result = useLoader(GLTFLoader, "/ISS_stationary.glb");
  // You don't need to check for the presence of the result, when we're here
  // the result is guaranteed to be present since useLoader suspends the component
  return (
    <mesh>
      {/* <orbitControls />
        <transformControls /> */}
      <primitive object={result.scene} position={[10, 0, 0]} />
      {/* <meshStandardMaterial  /> */}
    </mesh>
  );
}

function ModelISS() {
  const fbx = useLoader(FBXLoader, "/ISS_model.fbx");
  return <primitive object={fbx} />;
}

function Box(props) {
  // const [bumpMap, specMap, normalMap] = useLoader(TextureLoader, [url1, url2, url2])
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const bump = useLoader(TextureLoader, "/assets/earthbump.jpg");
  const map = useLoader(TextureLoader, "/assets/earthmap.jpg");
  const spec = useLoader(TextureLoader, "/assets/earthspec.jpg");
  const planeTrailMask = useLoader(TextureLoader, "/assets/mask.png");

  const textures = {
    // thanks to https://free3d.com/user/ali_alkendi !
    bump,
    map,
    spec,
    planeTrailMask,
  };

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    // mesh.current.rotation.y += Math.PI * 1.25;
    mesh.current.rotation.y += 0.01;

    mesh.current.receiveShadow = true;
  });
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh {...props} ref={mesh} scale={1}>
      <sphereGeometry args={[2, 64, 32]} />
      <meshPhysicalMaterial
        // metalness={1}
        map={textures.map}
        roughnessMap={textures.spec}
        bumpMap={textures.bump}
        bumpScale={0.05}
        sheen={1}
        sheenRoughness={0.75}
        sheenColor={new Color("#185BCE").convertSRGBToLinear()}
        clearcoat={0.2}
        roughness={0.8}
      />
    </mesh>
  );
}

export default function Home() {
  return (
    <main className="w-full h-screen bg-gradient-to-tr from-[#192649] to-[#0D131F]">
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        {/* <ContactShadows rotation-x={Math.PI / 2} position={[0, -5, 0]} opacity={0.4} width={30} height={30} blur={1} far={15} /> */}

        {/* <Box position={[1.2, 0, 0]} /> */}
        {/* <Model/> */}
        <ModelISS />
      </Canvas>
    </main>
  );
}

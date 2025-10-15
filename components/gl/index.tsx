"use client"

import { Effects } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Particles } from "./particles"
import { VignetteShader } from "./shaders/vignetteShader"

export const GL = ({ hovering }: { hovering: boolean }) => {
  return (
    <div id="webgl">
      <Canvas
        camera={{
          position: [1.2629783123314589, 2.664606471394044, -1.8178993743288914],
          fov: 50,
          near: 0.01,
          far: 300,
        }}
      >
        <color attach="background" args={["#000"]} />
        <Particles
          speed={1.0}
          aperture={1.79}
          focus={3.8}
          size={512}
          noiseScale={0.6}
          noiseIntensity={0.52}
          timeScale={1}
          pointSize={10.0}
          opacity={0.8}
          planeScale={10.0}
          useManualTime={false}
          manualTime={0}
          introspect={hovering}
        />
        <Effects multisamping={0} disableGamma>
          <shaderPass args={[VignetteShader]} uniforms-darkness-value={1.5} uniforms-offset-value={0.4} />
        </Effects>
      </Canvas>
    </div>
  )
}

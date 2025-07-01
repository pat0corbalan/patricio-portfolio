import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Particles from 'react-tsparticles'
import { tsParticles, type Container } from 'tsparticles-engine'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Text,
  Instances,
  Instance,
  shaderMaterial,
} from '@react-three/drei'
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Vector2 } from 'three'
import { useTheme } from './ThemeContext'
import type * as React from 'react'

// Shader personalizado
declare module '@react-three/fiber' {
  interface ThreeElements {
    holographicMaterial: React.JSX.IntrinsicElements['mesh'] & {
      ref?: React.Ref<THREE.ShaderMaterial | null>
      uTime?: number
      uColor?: THREE.Color
      uOpacity?: number
      transparent?: boolean
    }
  }
}

const HolographicMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 1.0, 0.8),
    uOpacity: 0.5,
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;
    void main() {
      float glow = sin(vUv.y * 3.14 + uTime) * 0.5 + 0.5;
      vec3 color = uColor * glow;
      gl_FragColor = vec4(color, uOpacity * glow);
    }
  `
)
extend({ HolographicMaterial })

const HolographicCube: React.FC = () => {
  const { theme } = useTheme()
  const groupRef = useRef<THREE.Group>(null)
  const cubeRef = useRef<THREE.Mesh>(null)
  const haloRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.InstancedMesh>(null)
  const textRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const [text, setText] = useState('CODE')

  useEffect(() => {
    const texts = ['CODE', 'CREATE', 'ORBIT']
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % texts.length
      setText(texts[index])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useFrame(({ clock, mouse }) => {
    const time = clock.getElapsedTime()

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002
      groupRef.current.rotation.x = mouse.y * 0.2
      groupRef.current.rotation.z = mouse.x * 0.2
    }

    if (cubeRef.current) {
      cubeRef.current.rotation.y += 0.005
      cubeRef.current.rotation.x += 0.003
    }

    if (haloRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.05
      haloRef.current.scale.set(scale, scale, 0.01)
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
    }

    if (particlesRef.current) {
      const count = particlesRef.current.count
      const dummy = new THREE.Object3D()
      for (let i = 0; i < count; i++) {
        const radius = 2.5 + Math.sin(i * 0.3 + time * 0.5) * 0.5
        const theta = (i / count) * Math.PI * 2 + time * 0.3
        const phi = Math.acos(1 - 2 * (i / count)) + time * 0.1
        const x = radius * Math.sin(phi) * Math.cos(theta) + mouse.x * 0.15
        const y = radius * Math.cos(phi) + mouse.y * 0.15
        const z = radius * Math.sin(phi) * Math.sin(theta)
        dummy.position.set(x, y, z)
        dummy.scale.setScalar(0.04 + Math.sin(time + i) * 0.02)
        dummy.updateMatrix()
        particlesRef.current.setMatrixAt(i, dummy.matrix)
      }
      particlesRef.current.instanceMatrix.needsUpdate = true
    }

    if (textRef.current) {
      textRef.current.position.set(
        Math.sin(time * 0.4) * 2.8,
        Math.cos(time * 0.4) * 0.5,
        Math.cos(time * 0.4) * 2.8
      )
      textRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={cubeRef}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <holographicMaterial
          ref={materialRef}
          uColor={new THREE.Color(theme === 'dark' ? '#00ccff' : '#0066cc')}
          uOpacity={0.7}
          transparent
        />
      </mesh>
      <mesh ref={haloRef}>
        <torusGeometry args={[2, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#00ffcc"
          emissive="#00ffcc"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
      <Instances ref={particlesRef} limit={80}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={theme === 'dark' ? '#ffffff' : '#1f2937'}
          emissive={theme === 'dark' ? '#ffffff' : '#1f2937'}
          emissiveIntensity={0.6}
        />
        <Instance />
      </Instances>
      <Text
        ref={textRef}
        fontSize={0.3}
        color={theme === 'dark' ? '#00ccff' : '#0066cc'}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  )
}

const Hero: React.FC = () => {
  const { theme } = useTheme()
  const particlesRef = useRef<Container | undefined>(undefined)

  const { scrollY } = useScroll()
  const yBackground = useTransform(scrollY, [0, 500], [0, 200])

  const particlesInit = async () => {
    await tsParticles.load('tsparticles', {
      fullScreen: { enable: false },
      particles: {
        number: { value: 80, density: { enable: true, value_area: 1000 } },
        color: { value: theme === 'dark' ? '#ffffff' : '#1f2937' },
        shape: { type: 'circle' },
        opacity: {
          value: 0.8,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.3 },
        },
        size: {
          value: 4,
          random: true,
          anim: { enable: true, speed: 2, size_min: 1 },
        },
        line_linked: {
          enable: true,
          distance: 200,
          color: theme === 'dark' ? '#ffffff' : '#1f2937',
          opacity: 0.6,
          width: 1.5,
        },
        move: { enable: true, speed: 3, random: true },
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true,
        },
        modes: { grab: { distance: 200 }, push: { particles_nb: 4 } },
      },
      retina_detect: true,
    })
    particlesRef.current = tsParticles.domItem(0)
  }

  const name = 'Patricio'

  return (
    <section
      id="home"
      className="pt-24 min-h-screen flex items-center bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-purple-950 transition-colors duration-500 relative overflow-hidden"
    >
      <Particles id="tsparticles" init={particlesInit} className="absolute inset-0 z-0" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          style={{ y: yBackground }}
        />
        <div className="grid gap-12 items-center lg:grid-cols-2 relative z-10">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              Hola, soy{' '}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent dark:bg-none dark:text-white">
                {name.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            <motion.h2
              className="text-3xl lg:text-4xl font-medium text-gray-700 dark:text-gray-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Desarrollador Full Stack
            </motion.h2>

            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400 max-w-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              Apasionado por crear soluciones digitales modernas con Python, JavaScript y Tailwind CSS,
              enfocándome en rendimiento y experiencia de usuario.
            </motion.p>
          </motion.div>

          <motion.div
            className="relative w-96 h-96 mx-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <HolographicCube />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
              <EffectComposer>
                <Bloom luminanceThreshold={0.2} intensity={1.5} height={300} />
                <Glitch
                  delay={new Vector2(2, 4)}
                  duration={new Vector2(0.2, 0.5)}
                  strength={new Vector2(0.1, 0.3)}
                />
              </EffectComposer>
            </Canvas>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

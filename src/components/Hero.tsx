import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Particles from 'react-tsparticles'
import { tsParticles } from 'tsparticles-engine'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, Text, Instances, Instance, shaderMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Vector2 } from 'three'
import type { ShaderMaterial } from 'three'
import type * as React from 'react'

// Fix JSX typing for custom shader material
declare module '@react-three/fiber' {
  interface ThreeElements {
    atmosphereMaterial: React.JSX.IntrinsicElements['meshStandardMaterial']
  }
}

const AtmosphereMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0.1, 0.6, 0.8),
  },
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform vec3 uColor;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
      vec3 color = uColor * intensity;
      gl_FragColor = vec4(color, intensity * 0.5);
    }
  `
)
extend({ AtmosphereMaterial })

type AtmosphereMaterialImpl = ShaderMaterial & { uTime: number }

const CosmicPlanet: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<AtmosphereMaterialImpl | null>(null)
  const particlesRef = useRef<THREE.InstancedMesh>(null)
  const textRef = useRef<THREE.Mesh>(null)
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
    if (groupRef.current) groupRef.current.rotation.y += 0.002
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.005
      planetRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.02)
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x = Math.PI / 4
      ringsRef.current.rotation.y += 0.001
    }
    if (atmosphereRef.current) atmosphereRef.current.uTime = clock.getElapsedTime()

    if (particlesRef.current) {
      const count = particlesRef.current.count
      const dummy = new THREE.Object3D()
      for (let i = 0; i < count; i++) {
        const time = clock.getElapsedTime() * 0.5
        const radius = 3 + Math.sin(i * 0.3 + time) * 0.5
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
      const time = clock.getElapsedTime()
      textRef.current.position.set(
        Math.sin(time * 0.4) * 3.5,
        Math.cos(time * 0.4) * 0.5,
        Math.cos(time * 0.4) * 3.5
      )
      textRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={planetRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial color="#1a3c5e" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.65, 64, 64]} />
        <atmosphereMaterial ref={atmosphereRef} side={THREE.BackSide} transparent />
      </mesh>
      <mesh ref={ringsRef}>
        <torusGeometry args={[2.3, 0.1, 16, 100]} />
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={0.5} roughness={0.5} metalness={0.3} transparent opacity={0.8} />
      </mesh>
      <Instances ref={particlesRef} limit={60} range={60}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
        <Instance />
      </Instances>
      <Text ref={textRef} fontSize={0.3} color="#00ccff" anchorX="center" anchorY="middle">
        {text}
      </Text>
    </group>
  )
}

const Hero: React.FC = () => {
  const [theme, setTheme] = useState('dark')
  const titleRef = useRef<HTMLHeadingElement>(null)
  const particlesRef = useRef<ReturnType<typeof tsParticles.domItem> | null>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  useEffect(() => {
    const loadFontAndAnimate = async () => {
      try {
        await document.fonts.load('1em Inter')
        if (titleRef.current) {
          const split = new SplitText(titleRef.current, { type: 'chars, words' })
          gsap.from(split.chars, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.02,
            ease: 'power3.out',
            delay: 0.2,
          })
          return () => {
            split.revert()
          }
        }
      } catch (error) {
        console.error('Error loading font or animating title:', error)
      }
    }
    loadFontAndAnimate()
  }, [])

  const { scrollY } = useScroll()
  const yBackground = useTransform(scrollY, [0, 500], [0, 200])

  const particlesInit = async () => {
    await tsParticles.load('tsparticles', {
      fullScreen: { enable: false },
      particles: {
        number: { value: 80, density: { enable: true, value_area: 1000 } },
        color: { value: theme === 'dark' ? '#ffffff' : '#1f2937' },
        shape: { type: 'circle' },
        opacity: { value: 0.8, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3 } },
        size: { value: 4, random: true, anim: { enable: true, speed: 2, size_min: 1 } },
        line_linked: { enable: true, distance: 200, color: theme === 'dark' ? '#ffffff' : '#1f2937', opacity: 0.6, width: 1.5 },
        move: { enable: true, speed: 3, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false },
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { grab: { distance: 200, line_linked: { opacity: 0.7 } }, push: { particles_nb: 4 } },
      },
      retina_detect: true,
    })
    particlesRef.current = tsParticles.domItem(0)
  }

  return (
    <section id="home" className="pt-24 min-h-screen flex items-center bg-gradient-to-br from-gray-900 to-purple-950 dark:from-gray-100 dark:to-blue-100 transition-colors duration-500 relative overflow-hidden">
      <Particles id="tsparticles" init={particlesInit} className="absolute inset-0 z-0" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" style={{ y: yBackground }} />
        <div className="grid gap-12 items-center lg:grid-cols-2 relative z-10">
          <motion.div className="space-y-8" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <motion.h1 ref={titleRef} className="text-5xl lg:text-7xl font-bold font-sans tracking-tight text-white dark:text-gray-900">
              Hola, soy <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-t">Patricio</span>
            </motion.h1>
            <motion.h2 className="text-3xl lg:text-4xl font-medium text-gray-300 dark:text-gray-700" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
              Desarrollador Full Stack
            </motion.h2>
            <motion.p className="text-lg text-gray-400 dark:text-gray-600 max-w-lg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
              Apasionado por crear soluciones digitales modernas con Python, JavaScript y Tailwind CSS, enfocándome en rendimiento y experiencia de usuario.
            </motion.p>
          </motion.div>
          <motion.div className="relative w-96 h-96 mx-auto" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, ease: 'easeOut' }}>
            <Canvas camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 100 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <CosmicPlanet />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
              <EffectComposer>
                <Bloom luminanceThreshold={0.2} intensity={1.2} height={300} />
                <Glitch delay={new Vector2(2, 4)} duration={new Vector2(0.2, 0.5)} strength={new Vector2(0.1, 0.3)} />
              </EffectComposer>
            </Canvas>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

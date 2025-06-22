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

// Shader para la atmósfera del planeta
const AtmosphereMaterial = shaderMaterial(
  {
    uTime: { value: 0 },
    uColor: new THREE.Color(0.1, 0.6, 0.8),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
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

const CosmicPlanet: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<any>(null)
  const particlesRef = useRef<THREE.InstancedMesh>(null)
  const textRef = useRef<THREE.Mesh>(null)
  const [text, setText] = useState('CODE')

  // Animación del texto
  useEffect(() => {
    const texts = ['CODE', 'CREATE', 'ORBIT']
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % texts.length
      setText(texts[index])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Animaciones en tiempo real
  useFrame(({ clock, mouse }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += 0.005
      planetRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.02)
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.x = Math.PI / 4
      ringsRef.current.rotation.y += 0.001
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.uTime = clock.getElapsedTime()
    }

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
      {/* Planeta */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#1a3c5e"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      {/* Atmósfera */}
      <mesh>
        <sphereGeometry args={[1.65, 64, 64]} />
        <atmosphereMaterial ref={atmosphereRef} side={THREE.BackSide} transparent />
      </mesh>
      {/* Anillos */}
      <mesh ref={ringsRef}>
        <torusGeometry args={[2.3, 0.1, 16, 100]} />
        <meshStandardMaterial
          color="#00ffcc"
          emissive="#00ffcc"
          emissiveIntensity={0.5}
          roughness={0.5}
          metalness={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Partículas orbitando */}
      <Instances ref={particlesRef} limit={60} range={60}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
        <Instance />
      </Instances>
      {/* Texto 3D */}
      <Text
        ref={textRef}
        fontSize={0.3}
        color="#00ccff"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  )
}

const Hero: React.FC = () => {
  const [theme, setTheme] = useState<string>('dark')
  const titleRef = useRef<HTMLHeadingElement>(null)
  const particlesRef = useRef<any>(null)

  // Toggle theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.remove('dark')
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
    // Actualizar partículas al cambiar el tema
    if (particlesRef.current) {
      particlesRef.current.load({
        particles: {
          color: { value: newTheme === 'dark' ? '#ffffff' : '#1f2937' },
          line_linked: { color: newTheme === 'dark' ? '#ffffff' : '#1f2937' },
        },
      })
    }
  }

  // GSAP Animation for Title with font loading check
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

  // Parallax effect for background
  const { scrollY } = useScroll()
  const yBackground = useTransform(scrollY, [0, 500], [0, 200])

  // Particles configuration
  const particlesInit = async (engine: any) => {
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
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
      />
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
              ref={titleRef}
              className="text-5xl lg:text-7xl font-bold font-sans tracking-tight text-white dark:text-gray-900"
            >
              Hola, soy{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-t">
                Patricio
              </span>
            </motion.h1>
            <motion.h2
              className="text-3xl lg:text-4xl font-medium text-gray-300 dark:text-gray-700"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Desarrollador Full Stack
            </motion.h2>
            <motion.p
              className="text-lg text-gray-400 dark:text-gray-600 max-w-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Apasionado por crear soluciones digitales modernas con Python, JavaScript y Tailwind CSS, enfocándome en rendimiento y experiencia de usuario.
            </motion.p>
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="/cv/patricio-cv.pdf"
                download
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Descargar CV
              </motion.a>
              <motion.a
                href="#projects"
                className="group flex items-center gap-2 px-6 py-3 rounded-full border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Proyectos
              </motion.a>
            </div>
            <div className="flex gap-6">
              <motion.a
                href="https://github.com/pat0corbalan"
                target="_blank"
                className="hover:text-purple-400 transition-colors duration-200"
                whileHover={{ y: -5 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/patriciocorbalan"
                target="_blank"
                className="hover:text-purple-400 transition-colors duration-200"
                whileHover={{ y: -5 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </motion.a>
              <motion.a
                href="#contact"
                className="hover:text-purple-400 transition-colors duration-200"
                whileHover={{ y: -5 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </motion.a>
            </div>
          </motion.div>
          <motion.div
            className="relative w-96 h-96 mx-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <Canvas camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 100 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <CosmicPlanet />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
              <EffectComposer>
                <Bloom luminanceThreshold={0.2} intensity={1.2} height={300} />
                <Glitch delay={[2, 4]} duration={[0.2, 0.5]} strength={[0.1, 0.3]} />
              </EffectComposer>
            </Canvas>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
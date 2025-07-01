import { useEffect, useRef } from 'react'
import { tsParticles, type Container } from 'tsparticles-engine'
import Particles from 'react-tsparticles'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import ReactGA from 'react-ga4'
import { ThemeProvider, useTheme } from './components/ThemeContext'

const App: React.FC = () => {
  useEffect(() => {
    ReactGA.initialize('G-11423498231') // Reemplaza con tu Measurement ID
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
  }, [])

  const ParticlesBackground: React.FC = () => {
    const { theme } = useTheme()
    const particlesRef = useRef<Container | undefined>(null)

    const particlesInit = async () => {
      await tsParticles.load('tsparticles', {
        fullScreen: { enable: true, zIndex: -10 },
        particles: {
          number: { value: 80, density: { enable: true, area: 1000 } },
          color: { value: theme === 'dark' ? '#ffffff' : '#1f2937' },
          shape: { type: 'circle' },
          opacity: { value: 0.8, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3 } },
          size: { value: 4, random: true, anim: { enable: true, speed: 2, size_min: 1 } },
          move: { enable: true, speed: 3, random: true, out_mode: 'out' },
          line_linked: { enable: true, distance: 200, color: theme === 'dark' ? '#ffffff' : '#1f2937', opacity: 0.6, width: 1.5 },
        },
        interactivity: {
          events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
          modes: { grab: { distance: 200, line_linked: { opacity: 0.7 } }, push: { particles_nb: 4 } },
        },
        retina_detect: true,
      })
      particlesRef.current = tsParticles.domItem(0)
    }

    useEffect(() => {
      if (particlesRef.current) {
        tsParticles.load('tsparticles', {
          fullScreen: { enable: true, zIndex: -10 },
          particles: {
            number: { value: 80, density: { enable: true, area: 1000 } },
            color: { value: theme === 'dark' ? '#ffffff' : '#1f2937' },
            shape: { type: 'circle' },
            opacity: { value: 0.8, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3 } },
            size: { value: 4, random: true, anim: { enable: true, speed: 2, size_min: 1 } },
            move: { enable: true, speed: 3, random: true, out_mode: 'out' },
            line_linked: { enable: true, distance: 200, color: theme === 'dark' ? '#ffffff' : '#1f2937', opacity: 0.6, width: 1.5 },
          },
          interactivity: {
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
            modes: { grab: { distance: 200, line_linked: { opacity: 0.7 } }, push: { particles_nb: 4 } },
          },
          retina_detect: true,
        }).then(() => {
          particlesRef.current = tsParticles.domItem(0)
        })
      }
    }, [theme])

    return <Particles id="tsparticles" init={particlesInit} className="fixed inset-0 -z-10" />
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen relative">
        <ParticlesBackground />
        <CustomCursor />
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
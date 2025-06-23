import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import ReactGA from 'react-ga4'
import Particles from 'react-tsparticles'

const App: React.FC = () => {
  useEffect(() => {
    ReactGA.initialize('G-XXXXXXXXXX') // Reemplaza con tu Measurement ID
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
  }, [])

  return (
    <div className="min-h-screen relative">
      <Particles
        id="tsparticles"
        className="fixed inset-0 -z-10"
        options={{
          fullScreen: { enable: true, zIndex: -10 },
          particles: {
            number: { value: 80, density: { enable: true, area: 1000 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.8, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3 } },
            size: { value: 4, random: true, anim: { enable: true, speed: 2, size_min: 1 } },
            move: { enable: true, speed: 3, random: true, out_mode: 'out' },
            line_linked: { enable: true, distance: 200, color: '#ffffff', opacity: 0.6, width: 1.5 },
          },
          interactivity: {
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
            modes: { grab: { distance: 200, line_linked: { opacity: 0.7 } }, push: { particles_nb: 4 } },
          },
          retina_detect: true,
        }}
      />

      <CustomCursor />
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </div>
  )
}

export default App

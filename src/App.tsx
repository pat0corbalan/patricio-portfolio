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

const App: React.FC = () => {
  useEffect(() => {
    ReactGA.initialize('G-XXXXXXXXXX') // Reemplaza con tu Measurement ID
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
  }, [])

  return (
    <div className="min-h-screen">
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
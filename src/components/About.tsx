import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skills = [
  {
    category: 'Frontend',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    icon: 'M12 6v6h4m6 6H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z',
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Python', 'FastAPI', 'MongoDB'],
    icon: 'M5 12h14M5 12a7 7 0 014-6.245M19 12a7 7 0 01-4 6.245',
  },
  {
    category: 'Herramientas',
    items: ['Git', 'Docker', 'Vite', 'Figma'],
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  },
]

const About: React.FC = () => {
  const skillRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    skillRefs.current.forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, rotation: 15, y: 50 },
        {
          opacity: 1,
          rotation: 0,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.2,
        }
      )
    })
  }, [])

  return (
    <section id="about" className="py-24 bg-gray-900 dark:bg-gray-100 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl lg:text-5xl font-bold text-center text-white dark:text-gray-900 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Sobre <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Mí</span>
        </motion.h2>
        <motion.p
          className="text-lg text-gray-400 dark:text-gray-600 max-w-2xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Soy un desarrollador Full Stack apasionado por crear aplicaciones web modernas y eficientes. Con experiencia en frontend, backend y herramientas DevOps, me enfoco en ofrecer soluciones innovadoras y experiencias de usuario excepcionales.
        </motion.p>
        <div className="grid gap-8 md:grid-cols-3">
          {skills.map((skill, index) => (
            <div
              key={skill.category}
              ref={(el) => el && (skillRefs.current[index] = el)}
              className="bg-gray-800 dark:bg-white rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <svg className="w-10 h-10 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={skill.icon} />
              </svg>
              <h3 className="text-xl font-semibold text-white dark:text-gray-900 mb-4">{skill.category}</h3>
              <ul className="space-y-2">
                {skill.items.map((item) => (
                  <li key={item} className="text-gray-400 dark:text-gray-600">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
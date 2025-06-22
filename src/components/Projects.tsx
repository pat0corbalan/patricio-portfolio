import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Una plataforma de comercio electrónico moderna construida con React, Node.js y MongoDB, con pasarela de pagos integrada.',
    image: 'https://placehold.co/600x400',
    codeLink: 'https://github.com/pat0corbalan/ecommerce',
    demoLink: 'https://ecommerce-demo.com',
    category: 'Full Stack',
  },
  {
    id: 2,
    title: 'Task Manager App',
    description: 'Una aplicación de gestión de tareas con autenticación, desarrollada con Next.js y Firebase.',
    image: 'https://placehold.co/600x400',
    codeLink: 'https://github.com/pat0corbalan/task-manager',
    demoLink: 'https://task-manager-demo.com',
    category: 'Frontend',
  },
  {
    id: 3,
    title: 'API RESTful',
    description: 'Una API RESTful para gestión de usuarios, construida con Python, FastAPI y PostgreSQL.',
    image: 'https://placehold.co/600x400',
    codeLink: 'https://github.com/pat0corbalan/api-rest',
    demoLink: 'https://api-rest-demo.com',
    category: 'Backend',
  },
]

const categories = ['Todos', 'Frontend', 'Backend', 'Full Stack']

const Projects: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const projectRefs = useRef<HTMLDivElement[]>([])

  const filteredProjects = selectedCategory === 'Todos'
    ? projects
    : projects.filter(project => project.category === selectedCategory)

  useEffect(() => {
    projectRefs.current.forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, rotationY: 90, y: 100 },
        {
          opacity: 1,
          rotationY: 0,
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
  }, [filteredProjects])

  return (
    <section id="projects" className="py-24 bg-gray-900 dark:bg-gray-100 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl lg:text-5xl font-bold text-center text-white dark:text-gray-900 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Mis <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Proyectos</span>
        </motion.h2>

        {/* Filtros de Categorías */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                  : 'bg-gray-800 dark:bg-gray-200 text-gray-400 dark:text-gray-600 hover:bg-gray-700 dark:hover:bg-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Grid de Proyectos */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => el && (projectRefs.current[index] = el)}
              className="relative group bg-gray-800 dark:bg-white rounded-xl overflow-hidden shadow-lg"
            >
              {/* Imagen del Proyecto */}
              <LazyLoadImage
                src={project.image}
                alt={project.title}
                effect="blur"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay al hacer hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <p className="text-sm text-gray-300 mt-2">{project.description}</p>
                <div className="flex gap-4 mt-4">
                  <motion.a
                    href={project.codeLink}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Código
                  </motion.a>
                  <motion.a
                    href={project.demoLink}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-gray-900 text-sm transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    Demo
                  </motion.a>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
import { motion } from 'framer-motion'

const experiences = [
  {
    id: 1,
    title: 'Desarrollador Full Stack',
    company: 'Tech Solutions',
    period: '2023 - Presente',
    description: 'Desarrollo de aplicaciones web con React, Node.js y MongoDB. Implementación de CI/CD con Docker y GitHub Actions.',
  },
  {
    id: 2,
    title: 'Desarrollador Frontend',
    company: 'Startup XYZ',
    period: '2021 - 2023',
    description: 'Creación de interfaces responsivas con Next.js y Tailwind CSS. Optimización de rendimiento y SEO.',
  },
  {
    id: 3,
    title: 'Practicante de Desarrollo',
    company: 'Innovatech',
    period: '2020 - 2021',
    description: 'Soporte en el desarrollo de APIs con Python y FastAPI. Mantenimiento de bases de datos PostgreSQL.',
  },
]

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 bg-gray-900 dark:bg-gray-100 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl lg:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Mi <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Experiencia</span>
        </motion.h2>
        <div className="relative">
          {/* Línea de tiempo */}
          <div className="absolute left-4 md:left-1/2 h-full w-1 bg-purple-400 transform md:-translate-x-1/2" />
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className={`relative mb-12 flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col items-start md:items-center`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              {/* Punto en la línea de tiempo */}
              <div className="absolute left-2 md:left-1/2 w-4 h-4 bg-purple-400 rounded-full transform md:-translate-x-1/2" />
              <div className={`bg-gray-800 dark:bg-white rounded-xl p-6 shadow-lg w-full md:w-5/12 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                <h3 className="text-xl font-semibold text-white dark:text-gray-900">{exp.title}</h3>
                <p className="text-gray-400 dark:text-gray-600">{exp.company} | {exp.period}</p>
                <p className="text-gray-400 dark:text-gray-600 mt-2">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTheme } from './ThemeContext'

const navLinks = [
  { href: '#home', label: 'Inicio' },
  { href: '#about', label: 'Sobre Mí' },
  { href: '#projects', label: 'Proyectos' },
  { href: '#experience', label: 'Experiencia' },
  { href: '#contact', label: 'Contacto' },
]

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.a
          href="#home"
          className="text-2xl font-bold text-white dark:text-white0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Patricio<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">.Dev</span>
        </motion.a>

        {/* Menú Desktop */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="text-gray-300 dark:text-gray-700 hover:text-purple-400 dark:hover:text-purple-600 relative group transition-colors duration-300"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -2 }}
            >
              {link.label}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 hover:text-purple-400 dark:hover:text-purple-600 transition-colors duration-300"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: navLinks.length * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            aria-label={theme === 'dark' ? 'Modo oscuro activo' : 'Modo claro activo'}
          >
            {theme === 'dark' ? (
              // Ícono luna para modo oscuro
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              // Ícono sol para modo claro
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Menú Móvil - Botón Hamburguesa */}
        <button
          className="md:hidden text-white dark:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>

        {/* Menú Móvil - Dropdown */}
        <motion.div
          className={`absolute top-16 left-0 w-full bg-gray-900 dark:bg-gray-100 md:hidden ${isOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-4 p-4">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-gray-300 dark:text-gray-700 hover:text-purple-400 dark:hover:text-purple-600 text-lg"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.button
              onClick={() => {
                toggleTheme()
                setIsOpen(false)
              }}
              className="flex items-center gap-2 text-gray-300 dark:text-gray-700 hover:text-purple-400 dark:hover:text-purple-600 text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navLinks.length * 0.1, duration: 0.3 }}
              whileHover={{ x: 5 }}
              aria-label={theme === 'dark' ? 'Modo oscuro activo' : 'Modo claro activo'}
            >
              {theme === 'dark' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Modo Claro
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  Modo Oscuro
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </nav>
  )
}

export default Navbar

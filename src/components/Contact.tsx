import { motion } from 'framer-motion'
import { useState } from 'react'
import emailjs from '@emailjs/browser'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Enviando...')

    emailjs.send(
      'service_g1r3xtn', // Reemplaza con tu Service ID de EmailJS
      'template_2ax7m2c', // Reemplaza con tu Template ID de EmailJS
      formData,
      'Bg9HE1u3EX2V-f5Ap' // Reemplaza con tu Public Key de EmailJS
    ).then(() => {
      setStatus('Mensaje enviado con éxito!')
      setFormData({ name: '', email: '', message: '' })
    }).catch(() => {
      setStatus('Error al enviar el mensaje. Intenta de nuevo.')
    })
  }

  return (
    <section id="contact" className="py-24 bg-gray-900 dark:bg-gray-100 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl lg:text-5xl font-bold text-center mb-12 
                    bg-gradient-to-r from-purple-400 to-pink-400 
                    bg-clip-text text-transparent animated-gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Contáctame
        </motion.h2>

        <motion.div
          className="max-w-lg mx-auto bg-gray-800 dark:bg-white rounded-xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 dark:text-gray-600">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 border border-gray-700 dark:border-gray-300 text-white dark:text-gray-900 focus:ring-2 focus:ring-purple-400 outline-none transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 dark:text-gray-600">Correo</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 border border-gray-700 dark:border-gray-300 text-white dark:text-gray-900 focus:ring-2 focus:ring-purple-400 outline-none transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-400 dark:text-gray-600">Mensaje</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 border border-gray-700 dark:border-gray-300 text-white dark:text-gray-900 focus:ring-2 focus:ring-purple-400 outline-none transition-all duration-300"
              />
            </div>
            <motion.button
              type="submit"
              className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-400 hover:from-purple-400 hover:to-pink-400 text-white font-medium transition-all duration-300 animated-gradient-text"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enviar Mensaje
            </motion.button>
          </form>
          {status && (
            <motion.p
              className={`mt-4 text-center ${status.includes('éxito') ? 'text-green-400' : 'text-red-400'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {status}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
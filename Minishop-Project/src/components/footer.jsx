
import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-blue-400 mr-1">Mini</span>Shop
            </h3>
            <p className="text-gray-400">
              Your one-stop shop for all your shopping needs. Quality products at affordable prices with amazing deals.
            </p>
            <div className="flex mt-4 space-x-4">
              <motion.a
                whileHover={{ y: -3, color: "#1DA1F2" }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, color: "#1DA1F2" }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, color: "#E1306C" }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/deals"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Deals
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="text-gray-400 not-italic space-y-2">
              <p className="flex items-center">
                <MapPin size={18} className="mr-2 text-blue-400" />
                123 Shopping Street, E-Commerce City, EC 12345
              </p>
              <p className="flex items-center">
                <Mail size={18} className="mr-2 text-blue-400" />
                info@minishop.com
              </p>
              <p className="flex items-center">
                <Phone size={18} className="mr-2 text-blue-400" />
                (123) 456-7890
              </p>
            </address>
          </motion.div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} MiniShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


import { motion } from "framer-motion"

export default function CategoryList({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory("")}
          className={`category-pill ${selectedCategory === "" ? "active" : ""}`}
        >
          All Products
        </motion.button>

       
        
      </div>
    </div>
  )
}

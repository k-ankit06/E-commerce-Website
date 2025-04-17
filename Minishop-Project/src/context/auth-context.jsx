
import { createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])


  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser))
    }
  }, [currentUser])


  const signup = (email, password, name) => {

    return new Promise((resolve, reject) => {
      setTimeout(() => {

        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const existingUser = users.find((user) => user.email === email)

        if (existingUser) {
          reject(new Error("User with this email already exists"))
          return
        }

        const newUser = {
          id: Date.now().toString(),
          email,
          name,
          createdAt: new Date().toISOString(),
          orders: [],
        }

        
        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))

        
        setCurrentUser(newUser)
        toast.success("Account created successfully!")
        resolve(newUser)
      }, 1000)
    })
  }

  
  const login = (email, password) => {
 
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const user = users.find((user) => user.email === email)

        if (!user) {
          reject(new Error("User not found"))
          return
        }



        setCurrentUser(user)
        toast.success("Logged in successfully!")
        resolve(user)
      }, 1000) 
    })
  }


  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
    toast.success("Logged out successfully!")
  }


  const updateProfile = (updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
  
        const updatedUser = { ...currentUser, ...updates }
        setCurrentUser(updatedUser)


        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const updatedUsers = users.map((user) => (user.id === currentUser.id ? updatedUser : user))
        localStorage.setItem("users", JSON.stringify(updatedUsers))

        toast.success("Profile updated successfully!")
        resolve(updatedUser)
      }, 500)
    })
  }


  const addOrder = (order) => {
    if (!currentUser) return Promise.reject(new Error("User not logged in"))

    return new Promise((resolve) => {
      setTimeout(() => {
        
        const updatedUser = {
          ...currentUser,
          orders: [...(currentUser.orders || []), order],
        }
        setCurrentUser(updatedUser)

  
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const updatedUsers = users.map((user) => (user.id === currentUser.id ? updatedUser : user))
        localStorage.setItem("users", JSON.stringify(updatedUsers))

        resolve(order)
      }, 500)
    })
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateProfile,
    addOrder,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

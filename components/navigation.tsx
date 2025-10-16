"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import WalletButton from "./wallet-button"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const router = useRouter()

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Clear existing timeout
      clearTimeout(scrollTimeout)

      // Detect scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header
        setShowHeader(false)
      } else {
        // Scrolling up - show header
        setShowHeader(true)
      }

      // Set scrolled state for styling
      setIsScrolled(currentScrollY > 50)

      // Update last scroll position
      setLastScrollY(currentScrollY)

      // Show header after scrolling stops (500ms delay)
      scrollTimeout = setTimeout(() => {
        setShowHeader(true)
      }, 500)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [lastScrollY])

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Token Creator", href: "/create" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Wallet", href: "/wallet" },
    { label: "GORR Stablecoin", href: "/#gorr" },
    { label: "Documentation", href: "/#docs" },
    { label: "Admin", href: "/admin" },
    { label: "Contact", href: "/#contact" },
    { label: "About", href: "/#about" },
  ]

  const handleNavigation = (href: string) => {
    setIsMenuOpen(false)
    if (href.startsWith("/#")) {
      const id = href.substring(2)
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      router.push(href)
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{
          y: showHeader ? 0 : -100,
          opacity: showHeader ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
          delay: showHeader ? 0.1 : 0,
        }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-500 ${
          isScrolled ? "bg-black/40 backdrop-blur-xl border-b border-white/10" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/50 relative">
                <Image
                  src="/gorr-logo.svg"
                  alt="Gorrillazz Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold text-foreground tracking-tight font-sans">Gorrillazz</span>
            </motion.div>
          </Link>

          {/* Desktop Wallet Button */}
          <div className="hidden md:block">
            <WalletButton />
          </div>

          {/* Hamburger Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-50 p-2 text-foreground transition-smooth hover:scale-110"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={28} className="text-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={28} className="text-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40"
          >
            {/* Glassmorphic Background */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" />

            {/* Menu Content */}
            <div className="relative h-full flex flex-col items-center justify-center px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-16"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl shadow-primary/50 relative">
                    <Image
                      src="/gorr-logo.svg"
                      alt="Gorrillazz Logo"
                      width={170}
                      height={170}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-5xl md:text-6xl font-bold text-foreground tracking-tight font-sans">
                    Gorrillazz
                  </span>
                </div>
              </motion.div>

              {/* Navigation Links with Stagger Animation */}
              <nav className="flex flex-col items-center gap-6 mb-16">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + index * 0.08,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <button onClick={() => handleNavigation(item.href)} className="group relative block">
                      <motion.span
                        className="text-3xl md:text-5xl font-light text-foreground tracking-wider font-sans"
                        whileHover={{ scale: 1.05, x: 10 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {item.label}
                      </motion.span>
                      {/* Neon Glow on Hover */}
                      <motion.div
                        className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 -z-10"
                        transition={{ duration: 0.3 }}
                      />
                    </button>
                  </motion.div>
                ))}
              </nav>

              {/* Wallet Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + menuItems.length * 0.08, duration: 0.5 }}
                className="w-full max-w-xs"
              >
                <WalletButton />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

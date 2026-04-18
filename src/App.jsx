import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ThemeToggle from './components/ThemeToggle' 
import './index.css'
import Comments from './components/Comments'

function App() {
  return (
    <div className="min-h-screen bg-[#050A0E] text-white">
      {/* Scan line overlay */}
      <div className="scan-line" />
      <ThemeToggle />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Comments />
      <Footer />
    </div>
  )
}

export default App

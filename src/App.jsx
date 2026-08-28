
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa'
import Navbar from './Components/Navbar.jsx'
import Home from './Pages/Home.jsx'
import Location from './Pages/Location.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import ManageProducts from './Pages/ManageProducts.jsx'
import ProductDetails from './Pages/ProductDetails.jsx'
import ThemeDetails from './Pages/ThemeDetails.jsx'
import SearchResults from './Pages/SearchResults.jsx'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function App() {
  return (
    <div className="App-wrapper">
      <ScrollToTop />
      <Navbar />
      <main className="App-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<Location />} />
          <Route path="/about" element={<About />} />
          <Route path="/inquiry" element={<Contact />} />
          <Route path="/manage" element={<ManageProducts />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/theme/:themeId" element={<ThemeDetails />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
        <div className="Page-up-container">
          <button
            className="Page-up-button"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            title="Back to top"
          >
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </main>
      <footer className="Site-footer">
        <div className="Site-footer-socials" aria-label="Social links">
          <a href="https://www.instagram.com/theballoonspace/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
            <FaInstagram aria-hidden="true" />
          </a>
          <a href="https://in.pinterest.com/ganeshrathore518/" target="_blank" rel="noreferrer" aria-label="Pinterest" title="Pinterest">
            <FaPinterest aria-hidden="true" />
          </a>
          <a href="https://www.youtube.com/@Theballoonspace-0" target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube">
            <FaYoutube aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App

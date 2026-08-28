import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { useProducts } from '../context/ProductContext'
import './Navbar.css'


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const searchQuery = searchTerm.trim().toLowerCase()

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSearchTerm('')
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    if (searchQuery) navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    setIsMenuOpen(false)
  }

  return (
    <div className={`Navbar-wrapper ${isMenuOpen ? 'menu-open' : ''}`}>
        <nav className="Navbar">
            <div className="Navbar-container">
                <div className="Logo">
                    <Link to="/">
                      <span className="Logo-text">
                        <small>The Balloon</small>
                        <strong>Space</strong>
                      </span>
                    </Link>
                </div>
                <ul className={isMenuOpen ? 'active' : ''}>
                  <li className="Navbar-section-label">MAIN</li>
                    <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
                    <li><Link to="/location" onClick={handleLinkClick}>Location</Link></li>
                    <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
                  <li className="Navbar-section-label">SUPPORT</li>
                    <li><Link to="/inquiry" onClick={handleLinkClick}>Inquiry</Link></li>
                </ul>
                <form className="Navbar-search" role="search" onSubmit={handleSearch}>
                  <FiSearch aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Search products or themes"
                    aria-label="Search products or themes"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') setSearchTerm('')
                    }}
                  />
                  <button className="Navbar-search-button" type="submit">Search</button>
                </form>
                <button
                  className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                  type="button"
                  aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  aria-expanded={isMenuOpen}
                  onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    </div>
  )
}

export default Navbar
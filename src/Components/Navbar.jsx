import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import './navbar.css'

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
                    <li><NavLink to="/" end className={({ isActive }) => isActive ? 'Navbar-link-active' : undefined} onClick={handleLinkClick}>Home</NavLink></li>
                    <li><NavLink to="/location" className={({ isActive }) => isActive ? 'Navbar-link-active' : undefined} onClick={handleLinkClick}>Location</NavLink></li>
                    <li><NavLink to="/about" className={({ isActive }) => isActive ? 'Navbar-link-active' : undefined} onClick={handleLinkClick}>About</NavLink></li>
                  <li className="Navbar-section-label">SUPPORT</li>
                    <li><NavLink to="/inquiry" className={({ isActive }) => isActive ? 'Navbar-link-active' : undefined} onClick={handleLinkClick}>Inquiry</NavLink></li>
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
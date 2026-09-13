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
    <header className={`Navbar-wrapper ${isMenuOpen ? 'menu-open' : ''}`}>
      <nav className="Navbar">
        <div className="Navbar-container">
          {/* Aligned Logo */}
          <div className="Logo">
            <Link to="/" onClick={handleLinkClick} className="Logo-link">
              <img src="/images/new_logo.webp" alt="The Balloon Space" className="Logo-img" />
              <span className="Logo-text">
                <small>THE BALLOON</small>
                <strong>Space</strong>
              </span>
            </Link>
          </div>

          {/* Centered Navigation Links */}
          <ul className={`Navbar-nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? 'Navbar-link-active' : undefined)}
                onClick={handleLinkClick}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/themes"
                className={({ isActive }) => (isActive ? 'Navbar-link-active' : undefined)}
                onClick={handleLinkClick}
              >
                Themes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/location"
                className={({ isActive }) => (isActive ? 'Navbar-link-active' : undefined)}
                onClick={handleLinkClick}
              >
                Location
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? 'Navbar-link-active' : undefined)}
                onClick={handleLinkClick}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/inquiry"
                className={({ isActive }) => (isActive ? 'Navbar-link-active' : undefined)}
                onClick={handleLinkClick}
              >
                Inquiry
              </NavLink>
            </li>
          </ul>

          {/* Custom Capsule Search Bar */}
          <form className="Navbar-search-container" role="search" onSubmit={handleSearch}>
            <div className="Navbar-search-input-wrapper">
              <FiSearch className="Navbar-search-icon" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search products, themes..."
                aria-label="Search products or themes"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setSearchTerm('')
                }}
              />
            </div>
            <button className="Navbar-search-btn" type="submit">
              Search
            </button>
          </form>

          {/* Mobile Hamburger Toggle */}
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
    </header>
  )
}

export default Navbar
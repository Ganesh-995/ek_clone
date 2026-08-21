import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { useProducts } from '../context/ProductContext'
import './Navbar.css'


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const navigate = useNavigate()
  const { products } = useProducts()
  const searchQuery = searchTerm.trim().toLowerCase()
  const searchResults = searchQuery
    ? products.filter((product) => `${product.title} ${product.description || ''} ${product.bulletPoints?.join(' ') || ''}`.toLowerCase().includes(searchQuery)).slice(0, 5)
    : []

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSearchTerm('')
        setIsSearchModalOpen(false)
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
    if (searchQuery) setIsSearchModalOpen(true)
    setIsMenuOpen(false)
  }

  const handleResultClick = (productId) => {
    setSearchTerm('')
    setIsSearchModalOpen(false)
    setIsMenuOpen(false)
    navigate(`/product/${productId}`)
  }

  return (
    <div className={`Navbar-wrapper ${isMenuOpen ? 'menu-open' : ''}`}>
        <nav className="Navbar">
            <div className="Navbar-container">
                <div className="Logo">
                    <Link to="/">
                      <img src="/images/new_logo.png" height="50" alt="EK celebrations logo" />
                    </Link>
                    <span className="Logo-text">
                      <small>The Balloon</small>
                      <strong>Space</strong>
                    </span>
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
                    placeholder="Search products"
                    aria-label="Search products"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') setSearchTerm('')
                    }}
                  />
                  <button className="Navbar-search-button" type="submit">Search</button>
                </form>
                {isSearchModalOpen && (
                  <div className="SearchModal-backdrop" onClick={(event) => {
                    if (event.target === event.currentTarget) setIsSearchModalOpen(false)
                  }}>
                    <div className="SearchModal" role="dialog" aria-modal="true" aria-labelledby="search-results-title">
                      <div className="SearchModal-header">
                        <div>
                          <span className="SearchModal-kicker">Search results</span>
                          <h2 id="search-results-title">Results for “{searchTerm}”</h2>
                        </div>
                        <button className="SearchModal-close" type="button" onClick={() => setIsSearchModalOpen(false)} aria-label="Close search results">×</button>
                      </div>
                      {searchResults.length > 0 ? (
                        <div className="SearchModal-grid">
                          {searchResults.map((product) => (
                            <button className="SearchModal-result" type="button" key={product.id} onClick={() => handleResultClick(product.id)}>
                              <img src={product.image} alt="" />
                              <span>{product.title}</span>
                            </button>
                          ))}
                        </div>
                      ) : <p className="SearchModal-empty">No products found for this search.</p>}
                    </div>
                  </div>
                )}
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
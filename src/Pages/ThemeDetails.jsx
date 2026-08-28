import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaTimes, FaWhatsapp } from 'react-icons/fa'
import { useProducts } from '../context/ProductContext'
import { createThemeWhatsAppUrl } from '../utils/whatsapp'
import AskFormModal from '../Components/AskFormModal'
import './ThemeDetails.css'

const ThemeDetails = () => {
  const { themeId } = useParams()
  const navigate = useNavigate()
  const { products, themes } = useProducts()
  const theme = themes.find((item) => item.id === themeId)
  const themeProducts = theme?.images?.length
    ? theme.images
    : theme?.productIds?.map((id) => products.find((product) => product.id === id)).filter(Boolean) || []
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isAskFormOpen, setIsAskFormOpen] = useState(false)
  const themeImages = themeProducts.map((product) => typeof product === 'string' ? product : product.image).filter(Boolean)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [themeId])

  useEffect(() => {
    if (!selectedProduct) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedProduct])

  if (!theme) {
    return (
      <section className="ThemeDetails ThemeDetails-empty">
        <h1>Theme not found</h1>
        <Link to="/">Back to home</Link>
      </section>
    )
  }

  return (
    <section className="ThemeDetails">
      <button className="ThemeDetails-back" type="button" onClick={() => navigate(-1)}>
        <span aria-hidden="true">←</span> Back to themes
      </button>
      <div className="ThemeDetails-hero">
        <div className="ThemeDetails-gallery">
          {themeProducts.map((product) => (
            <button
              className="ThemeDetails-gallery-button"
              key={product.id}
              type="button"
              onClick={() => setSelectedProduct(product)}
              aria-label={`Open ${product.title} image`}
            >
              <img src={product.image} alt={product.title || theme.title} />
            </button>
          ))}
        </div>
        <div className="ThemeDetails-copy">
          <span className="ThemeDetails-kicker">Curated theme</span>
          <h1>{theme.title}</h1>
          <p>{theme.detail}</p>
          <div className="ThemeDetails-actions">
            <button className="ThemeDetails-ask" type="button" onClick={() => setIsAskFormOpen(true)}>
              Ask about this theme
            </button>
            <button
              className="ThemeDetails-whatsapp"
              type="button"
              onClick={() => window.open(createThemeWhatsAppUrl(theme, themeImages), '_blank')}
            >
              <FaWhatsapp aria-hidden="true" /> WhatsApp
            </button>
          </div>
        </div>
      </div>
      {isAskFormOpen && (
        <AskFormModal
          subject={theme.title}
          type="theme"
          images={themeImages}
          onClose={() => setIsAskFormOpen(false)}
        />
      )}
      {selectedProduct && createPortal(
        <div className="ThemeImagePopup-overlay">
          <div className="ThemeImagePopup-frame" onClick={(event) => event.stopPropagation()}>
            <button
              className="ThemeImagePopup-close"
              type="button"
              aria-label="Close image preview"
              onClick={() => setSelectedProduct(null)}
            >
              <FaTimes />
            </button>
            <img src={selectedProduct.image} alt={selectedProduct.title || theme.title} />
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}

export default ThemeDetails

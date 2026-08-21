import React, { useEffect, useRef, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import './ProductCard.css'

const ProductCard = ({ image, title, description, bulletPoints = [] }) => {
  const whatsappNumber = '917838937047'
  const [isOpen, setIsOpen] = useState(false)
  const [imageScale, setImageScale] = useState(1)
  const touchDistance = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const scrollPosition = window.scrollY
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.width = '100%'
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousBodyStyles.overflow
      document.body.style.position = previousBodyStyles.position
      document.body.style.top = previousBodyStyles.top
      document.body.style.width = previousBodyStyles.width
      document.removeEventListener('keydown', handleEscape)
      window.scrollTo(0, scrollPosition)
    }
  }, [isOpen])
  
  const handleWhatsAppClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const message = `🛍️ *Interested in this product!*\n\n📦 *${title}*\n\n🖼️ *Product Image:*\n${image}\n\nPlease provide more details!`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setIsOpen(true)
    }
  }

  const handleCardClick = () => {
    setIsOpen(true)
  }

  const updateImageScale = (nextScale) => {
    setImageScale(Math.min(2.5, Math.max(1, nextScale)))
  }

  const handleImageWheel = (event) => {
    event.preventDefault()
    updateImageScale(imageScale + (event.deltaY < 0 ? 0.2 : -0.2))
  }

  const handleImageTouchStart = (event) => {
    if (event.touches.length !== 2) return
    const [firstTouch, secondTouch] = event.touches
    touchDistance.current = Math.hypot(secondTouch.clientX - firstTouch.clientX, secondTouch.clientY - firstTouch.clientY)
  }

  const handleImageTouchMove = (event) => {
    if (event.touches.length !== 2 || !touchDistance.current) return
    event.preventDefault()
    const [firstTouch, secondTouch] = event.touches
    const nextDistance = Math.hypot(secondTouch.clientX - firstTouch.clientX, secondTouch.clientY - firstTouch.clientY)
    updateImageScale(imageScale * (nextDistance / touchDistance.current))
    touchDistance.current = nextDistance
  }

  const handleImageTouchEnd = () => {
    touchDistance.current = null
  }

  const closeModal = () => {
    setIsOpen(false)
    setImageScale(1)
  }

  return (
    <div
      className="ProductCard"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title}`}
    >
      <div className="ProductCard-image-wrapper">
        <img src={image} alt={title} className="ProductCard-image" />
      </div>
      <div className="ProductCard-info">
          <h3 className="ProductCard-title">{title}</h3>

          <button
            className="ProductCard-message-btn"
            onClick={handleWhatsAppClick}
            aria-label={`WhatsApp par ${title} ke baare mein poochein`}
            title="WhatsApp par inquiry bhejein"
          >
            <FaWhatsapp aria-hidden="true" />
            <span className="ProductCard-message-tooltip">WhatsApp</span>
          </button>
      </div>

      {isOpen && (
        <div
          className="ProductModal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <div className="ProductModal" role="dialog" aria-modal="true" aria-labelledby={`product-title-${title}`}>
            <div className="ProductModal-visual" onWheel={handleImageWheel} onTouchStart={handleImageTouchStart} onTouchMove={handleImageTouchMove} onTouchEnd={handleImageTouchEnd}>
              <span className="ProductModal-label">made for your moment</span>
              <img src={image} alt={title} style={{ transform: `scale(${imageScale})` }} />
            </div>
            <div className="ProductModal-content">
              <span className="ProductModal-kicker">Featured detail</span>
              <h2 id={`product-title-${title}`}>{title}</h2>
              <p>{description || 'A thoughtful detail to make your celebration feel extra special.'}</p>
              {bulletPoints.length > 0 && (
                <ul>
                  {bulletPoints.map((point) => <li key={point}>{point}</li>)}
                </ul>
              )}
              <div className="ProductModal-actions">
                <button className="ProductModal-action" onClick={handleWhatsAppClick}>
                  Ask about this product <span aria-hidden="true">↗</span>
                </button>
                <button className="ProductModal-back" onClick={(event) => {
                  event.stopPropagation()
                  closeModal()
                }} aria-label="Go back to products">
                  <span aria-hidden="true">←</span> Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCard

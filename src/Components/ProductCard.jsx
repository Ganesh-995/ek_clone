import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { createProductWhatsAppUrl } from '../utils/whatsapp'
import AskFormModal from './AskFormModal'
import './ProductCard.css'

const ProductCard = ({ id, image, title, description, bulletPoints = [] }) => {
  const navigate = useNavigate()
  const [isAskFormOpen, setIsAskFormOpen] = useState(false)

  const handleWhatsAppClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    window.open(createProductWhatsAppUrl({ title, image, description, bulletPoints }), '_blank')
  }

  const goToDetails = () => {
    // If this product is a bunting/banner item, route to the curated bunting page
    if (title && /bunting|banner|buntin/i.test(title)) {
      navigate('/bunting')
      return
    }
    navigate(`/product/${id}`)
  }

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToDetails()
    }
  }

  return (
    <div
      className="ProductCard"
      onClick={goToDetails}
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

          <div className="ProductCard-actions">
            <button
              className="ProductCard-ask-btn"
              onClick={(event) => { event.preventDefault(); event.stopPropagation(); setIsAskFormOpen(true) }}
              aria-label={`Ask about ${title}`}
              title="Ask about this product"
            >
              Ask
            </button>
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
      </div>
      {isAskFormOpen && <AskFormModal subject={title} images={[image]} onClose={() => setIsAskFormOpen(false)} />}
    </div>
  )
}

export default ProductCard

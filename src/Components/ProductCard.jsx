import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import './ProductCard.css'

const ProductCard = ({ id, image, title, description, bulletPoints = [] }) => {
  const whatsappNumber = '917838937047'
  const navigate = useNavigate()

  const handleWhatsAppClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const message = `🛍️ *Interested in this product!*\n\n📦 *${title}*\n\n🖼️ *Product Image:*\n${image}\n\nPlease provide more details!`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')
  }

  const goToDetails = () => {
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
  )
}

export default ProductCard

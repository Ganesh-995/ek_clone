import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaWhatsapp, FaTimes } from 'react-icons/fa'
import { useProducts } from '../context/ProductContext'
import './ProductDetails.css'

const ProductDetails = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { products } = useProducts()
  const product = products.find((item) => String(item.id) === productId)
  const [isImageOpen, setIsImageOpen] = useState(false)

  if (!product) {
    return (
      <section className="ProductDetails ProductDetails-empty">
        <span className="ProductDetails-kicker">Product unavailable</span>
        <h1>We could not find that product.</h1>
        <Link className="ProductDetails-back" to="/">Back to products</Link>
      </section>
    )
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`I am interested in ${product.title}. Please provide more details.`)
    window.open(`https://wa.me/917838937047?text=${message}`, '_blank')
  }

  return (
    <section className="ProductDetails">
      <button className="ProductDetails-back" type="button" onClick={() => navigate(-1)}>
        <span aria-hidden="true">←</span> Back to results
      </button>
      <div className="ProductDetails-content">
        <div className="ProductDetails-visual">
          <span className="ProductDetails-label">made for your moment</span>
          <img
            src={product.image}
            alt={product.title}
            className="ProductDetails-image"
            onClick={() => setIsImageOpen(true)}
          />
        </div>
        <div className="ProductDetails-copy">
          <span className="ProductDetails-kicker">Featured detail</span>
          <h1>{product.title}</h1>
          <p>{product.description || 'A thoughtful detail to make your celebration feel extra special.'}</p>
          {product.bulletPoints?.length > 0 && (
            <ul>
              {product.bulletPoints.map((point) => <li key={point}>{point}</li>)}
            </ul>
          )}
          <button className="ProductDetails-action" type="button" onClick={handleWhatsAppClick}>
            <FaWhatsapp aria-hidden="true" /> Ask about this product
          </button>
        </div>
      </div>

      {isImageOpen && createPortal(
        <div className="ImagePopup-overlay" onClick={() => setIsImageOpen(false)}>
          <div className="ImagePopup-frame" onClick={(event) => event.stopPropagation()}>
            <button
              className="ImagePopup-close"
              type="button"
              aria-label="Close image preview"
              onClick={() => setIsImageOpen(false)}
            >
              <FaTimes />
            </button>
            <img src={product.image} alt={product.title} />
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}

export default ProductDetails

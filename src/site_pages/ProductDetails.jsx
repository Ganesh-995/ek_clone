import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaWhatsapp, FaTimes } from 'react-icons/fa'
import { useProducts } from '../context/ProductContext'
import { createProductWhatsAppUrl } from '../utils/whatsapp'
import AskFormModal from '../Components/AskFormModal'
import './ProductDetails.css'

const ProductDetails = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { products } = useProducts()
  const product = products.find((item) => String(item.id) === productId)
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [isAskFormOpen, setIsAskFormOpen] = useState(false)

  useEffect(() => {
    if (!isImageOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isImageOpen])

  if (!product) {
    return (
      <section className="ProductDetails ProductDetails-empty">
        <span className="ProductDetails-kicker">Product unavailable</span>
        <h1>We could not find that product.</h1>
        <Link className="ProductDetails-back" to="/">Back to products</Link>
      </section>
    )
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
          <div className="ProductDetails-actions">
            <button className="ProductDetails-action ProductDetails-action-ask" type="button" onClick={() => setIsAskFormOpen(true)}>
              Ask about this product
            </button>
            <button
              className="ProductDetails-action ProductDetails-action-whatsapp"
              type="button"
              onClick={() => window.open(createProductWhatsAppUrl(product), '_blank')}
            >
              <FaWhatsapp aria-hidden="true" /> WhatsApp
            </button>
          </div>
        </div>
      </div>

      {isAskFormOpen && (
        <AskFormModal
          subject={product.title}
          images={[product.image]}
          onClose={() => setIsAskFormOpen(false)}
        />
      )}

      {isImageOpen && createPortal(
        <div className="ImagePopup-overlay">
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

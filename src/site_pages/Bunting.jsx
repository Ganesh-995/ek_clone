import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { FaTimes, FaWhatsapp } from 'react-icons/fa'
import './Bunting.css'
import { useProducts } from '../context/ProductContext'
import { WHATSAPP_NUMBER } from '../utils/whatsapp'

const Bunting = () => {
  const { products } = useProducts()
  const [searchParams] = useSearchParams()
  const [isImageOpen, setIsImageOpen] = useState(false)
  const selectedId = searchParams.get('item')

  const buntingItems = products.filter(p => /bunting|banner|festive/i.test(p.title)).slice(0, 6)
  const items = buntingItems.length >= 3 ? buntingItems : products.slice(0, 3)
  const selectedItem = selectedId ? products.find((item) => String(item.id) === selectedId) : null
  const main = selectedItem || items[0]
  const visibleDetails = main?.bulletPoints?.slice(0, 3) || []
  const whatsappMessage = [
    'Hanger collection',
    'Hanger',
    main?.title,
    main?.description,
    ...visibleDetails
  ].filter(Boolean).join('\n\n')
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`

  useEffect(() => {
    if (!isImageOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsImageOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isImageOpen])

  return (
    <div className="Bunting-page">
      <div className="Bunting-hero">
        <div className="Bunting-panel">
          <span className="Bunting-eyebrow">Hanger collection</span>
          <h1>Hanger</h1>
          <h2>{main?.title}</h2>
          {main?.description && <p className="Bunting-lead">{main.description}</p>}
          {visibleDetails.length > 0 && (
            <ul className="Bunting-details">
              {visibleDetails.map((point) => <li key={point}>{point}</li>)}
            </ul>
          )}
          {main && (
            <a
              className="Bunting-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>

        <div className="Bunting-art">
          <button className="Bunting-image-trigger" type="button" onClick={() => setIsImageOpen(true)} aria-label={`Open ${main?.title || 'hanger decoration'} image`}>
            <img className="Bunting-art-main" src={main?.image} alt={main?.title || 'Hanger decoration'} />
          </button>
        </div>
      </div>

      {isImageOpen && createPortal(
        <div className="BuntingImagePopup-overlay" role="presentation" onClick={() => setIsImageOpen(false)}>
          <div className="BuntingImagePopup-frame" role="dialog" aria-modal="true" aria-label={`${main?.title || 'Hanger'} image preview`} onClick={(event) => event.stopPropagation()}>
            <button className="BuntingImagePopup-close" type="button" onClick={() => setIsImageOpen(false)} aria-label="Close image preview">
              <FaTimes aria-hidden="true" />
            </button>
            <img src={main?.image} alt={main?.title || 'Hanger decoration'} />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default Bunting

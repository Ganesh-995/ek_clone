import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { createThemeWhatsAppUrl } from '../utils/whatsapp'
import AskFormModal from './AskFormModal'
import '../site_pages/Home.css'

const ThemeCard = ({ theme, products, index = 0 }) => {
  const [isAskFormOpen, setIsAskFormOpen] = useState(false)
  const images = (theme.images?.length
    ? theme.images.map((item) => typeof item === 'string' ? item : item.image).filter(Boolean)
    : theme.productIds?.map((productId) => products.find((item) => item.id === productId)?.image).filter(Boolean) || [])

  return (
    <>
      <Link className={`Theme-card Theme-card-${theme.id}${index % 2 === 1 ? ' Theme-card-reverse' : ''}`} to={`/theme/${theme.id}`}>
        <div className={`Theme-card-images Theme-card-images-${Math.min(images.length, 3)}`}>
          {images.slice(0, 3).map((image, imageIndex) => <img key={`${image}-${imageIndex}`} src={image} alt="" loading="lazy" decoding="async" className={imageIndex === 0 ? 'Theme-card-image-main' : 'Theme-card-image-sub'} />)}
        </div>
        <span className="Theme-card-badge" aria-hidden="true"><FiHeart /></span>
        <div className="Theme-card-copy">
          <h3>{theme.title} <span className="Theme-card-sparkle" aria-hidden="true">*</span></h3>
          <p className="Theme-card-desc">{theme.detail}</p>
          <div className="Theme-card-actions">
            <button className="Theme-card-ask" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setIsAskFormOpen(true) }} aria-label={`Ask about ${theme.title}`} title="Ask about this theme">
              Ask
            </button>
            <button className="Theme-card-whatsapp" type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); window.open(createThemeWhatsAppUrl(theme, images), '_blank') }} aria-label={`WhatsApp par ${theme.title} ke baare mein poochein`} title="WhatsApp par theme inquiry bhejein">
              <FaWhatsapp aria-hidden="true" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </Link>
      {isAskFormOpen && <AskFormModal subject={theme.title} type="theme" images={images} onClose={() => setIsAskFormOpen(false)} />}
    </>
  )
}

export default ThemeCard
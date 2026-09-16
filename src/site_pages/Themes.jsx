import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { useProducts } from '../context/ProductContext'
import { createThemeWhatsAppUrl } from '../utils/whatsapp'
import AskFormModal from '../Components/AskFormModal'
import './Themes.css'

function getThemeImages(theme, products) {
  return theme.images?.map((item) => typeof item === 'string' ? item : item.image).filter(Boolean)
    || theme.productIds?.map((id) => products.find((product) => product.id === id)?.image).filter(Boolean)
    || []
}

const ThemeCard = ({ theme, products, index = 0 }) => {
  const [isAskFormOpen, setIsAskFormOpen] = useState(false)
  const images = getThemeImages(theme, products)

  return (
    <>
      <Link className={`Theme-card${index % 2 === 1 ? ' Theme-card-reverse' : ''}`} to={`/theme/${theme.id}`}>
        <div className={`Theme-card-images Theme-card-images-${Math.min(images.length, 3)}`}>
          {images.slice(0, 3).map((image, imgIndex) => <img key={`${image}-${imgIndex}`} src={image} alt="" loading="lazy" decoding="async" className={imgIndex === 0 ? 'Theme-card-image-main' : 'Theme-card-image-sub'} />)}
        </div>
        <span className="Theme-card-badge" aria-hidden="true"><FiHeart /></span>
        <div className="Theme-card-copy">
          <h3>{theme.title} <span className="Theme-card-sparkle" aria-hidden="true">✦</span></h3>
          <p className="Theme-card-desc">{theme.detail}</p>
          <div className="Theme-card-actions">
            <button
              className="Theme-card-ask"
              type="button"
              onClick={(event) => { event.preventDefault(); event.stopPropagation(); setIsAskFormOpen(true) }}
              aria-label={`Ask about ${theme.title}`}
              title="Ask about this theme"
            >
              Ask
            </button>
            <button
              className="Theme-card-whatsapp"
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                window.open(createThemeWhatsAppUrl(theme, images), '_blank')
              }}
              aria-label={`WhatsApp par ${theme.title} ke baare mein poochein`}
              title="WhatsApp par theme inquiry bhejein"
            >
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

export default function Themes() {
  const { themes, products } = useProducts()
  const [currentPage, setCurrentPage] = useState(1)
  const themesPerPage = 20
  const totalPages = Math.max(1, Math.ceil(themes.length / themesPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const pageThemes = themes.slice((safePage - 1) * themesPerPage, safePage * themesPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [themes.length])

  return (
    <div className="Themes-page">
      <header className="Themes-header">
        <Link to="/">Back home</Link>
        <span>Curated for you</span>
        <h1>All <em>themes.</em></h1>
      </header>
      <div className="Theme-grid">
        {pageThemes.map((theme, index) => <ThemeCard key={theme.id} theme={theme} products={products} index={index} />)}
      </div>
      <nav className="Themes-pagination" aria-label="Theme pages">
        <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safePage === 1}>← Previous</button>
        <span>Page {safePage} of {totalPages}</span>
        <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safePage === totalPages}>Next →</button>
      </nav>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { useProducts } from '../context/ProductContext'
import { createThemeWhatsAppUrl } from '../utils/whatsapp'
import AskFormModal from '../Components/AskFormModal'
import './Themes.css'

const themeBulletColors = ['#f2897a', '#3fb950', '#e5484d']

function getThemeImages(theme, products) {
  return theme.images?.map((item) => typeof item === 'string' ? item : item.image).filter(Boolean)
    || theme.productIds?.map((id) => products.find((product) => product.id === id)?.image).filter(Boolean)
    || []
}

const ThemeCard = ({ theme, products }) => {
  const [isAskFormOpen, setIsAskFormOpen] = useState(false)
  const images = getThemeImages(theme, products)
  const bulletPoints = (theme.detail || '')
    .split(/(?<=[.!])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  return (
    <>
      <Link className="Theme-card" to={`/theme/${theme.id}`}>
        <div className="Theme-card-images">
          {images.slice(0, 3).map((image, index) => <img key={image} src={image} alt="" className={index === 0 ? 'Theme-card-image-main' : 'Theme-card-image-sub'} />)}
        </div>
        <div className="Theme-card-copy">
          <h3>{theme.title}</h3>
          <ul className="Theme-card-bullets">
            {bulletPoints.map((point, index) => (
              <li key={point}>
                <span className="Theme-card-bullet-dot" style={{ background: themeBulletColors[index % themeBulletColors.length] }} aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="Theme-card-actions">
            <span className="Theme-card-explore">Explore theme <span aria-hidden="true">↗</span></span>
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
        {pageThemes.map((theme) => <ThemeCard key={theme.id} theme={theme} products={products} />)}
      </div>
      <nav className="Themes-pagination" aria-label="Theme pages">
        <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safePage === 1}>← Previous</button>
        <span>Page {safePage} of {totalPages}</span>
        <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safePage === totalPages}>Next →</button>
      </nav>
    </div>
  )
}
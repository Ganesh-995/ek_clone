import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import './Themes.css'

function getThemeImages(theme, products) {
  return theme.images?.map((item) => typeof item === 'string' ? item : item.image).filter(Boolean)
    || theme.productIds?.map((id) => products.find((product) => product.id === id)?.image).filter(Boolean)
    || []
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
      <div className="Themes-grid">
        {pageThemes.map((theme) => {
          const images = getThemeImages(theme, products)
          return (
            <Link className="Themes-card" to={`/theme/${theme.id}`} key={theme.id}>
              <div className="Themes-card-images">
                {images.slice(0, 3).map((image, index) => <img key={image} src={image} alt="" className={index === 0 ? 'is-main' : undefined} />)}
              </div>
              <div>
                <h2>{theme.title}</h2>
                <p>{theme.detail}</p>
                <span>Explore theme</span>
              </div>
            </Link>
          )
        })}
      </div>
      <nav className="Themes-pagination" aria-label="Theme pages">
        <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safePage === 1}>Previous</button>
        <div>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button className={pageNumber === safePage ? 'is-active' : ''} type="button" key={pageNumber} onClick={() => setCurrentPage(pageNumber)} aria-current={pageNumber === safePage ? 'page' : undefined}>
              {pageNumber}
            </button>
          ))}
        </div>
        <span>Page {safePage} of {totalPages}</span>
        <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safePage === totalPages}>Next</button>
      </nav>
    </div>
  )
}
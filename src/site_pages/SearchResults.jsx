import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../Components/ProductCard'
import HangingSlider from '../Components/HangingSlider'
import ThemeCard from '../Components/ThemeCard'
import { useProducts } from '../context/ProductContext'
import './SearchResults.css'

function getThemeSearchText(theme) {
  return [
    theme.title,
    theme.name,
    theme.detail,
    theme.description,
    theme.category,
    ...(Array.isArray(theme.tags) ? theme.tags : []),
    ...(Array.isArray(theme.keywords) ? theme.keywords : [])
  ].filter(Boolean).join(' ').toLowerCase()
}

function SearchResults() {
  const [searchParams] = useSearchParams()
  const { products, themes, hangerCards } = useProducts()
  const [currentPage, setCurrentPage] = useState(1)
  const query = searchParams.get('q')?.trim() || ''
  const normalizedQuery = query.toLowerCase()
  const matchingProducts = products.filter((product) => (
    `${product.title} ${product.description || ''} ${product.bulletPoints?.join(' ') || ''}`
      .toLowerCase()
      .includes(normalizedQuery)
  ))
  const matchingHangerCards = hangerCards.map((card, index) => ({ ...card, index })).filter((card) => (
    `hanger ${card.title} ${card.description || ''}`.toLowerCase().includes(normalizedQuery)
  ))
  const matchingThemes = themes.filter((theme) => getThemeSearchText(theme).includes(normalizedQuery))
  const productsPerPage = 8
  const totalProductPages = Math.max(1, Math.ceil(matchingProducts.length / productsPerPage))
  const safePage = Math.min(currentPage, totalProductPages)
  const paginatedProducts = matchingProducts.slice((safePage - 1) * productsPerPage, safePage * productsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [normalizedQuery])

  return (
    <div className="Search-results-page">
      <header className="Search-results-header">
        <Link className="Search-results-back" to="/">← Back home</Link>
        <span className="Search-results-kicker">Search results</span>
        <h1>Results for <em>“{query}”</em></h1>
        <p>{matchingProducts.length + matchingHangerCards.length + matchingThemes.length} results found across products, hanger cards, and themes.</p>
      </header>

      {matchingThemes.length > 0 && (
        <section className="Search-results-section" aria-labelledby="matching-themes-title">
          <div className="Search-results-section-heading">
            <span>01</span>
            <h2 id="matching-themes-title">Matching <em>themes.</em></h2>
          </div>
          <div className="Theme-grid Search-results-theme-grid">
            {matchingThemes.map((theme, index) => <ThemeCard key={theme.id} theme={theme} products={products} index={index} />)}
          </div>
        </section>
      )}

      {matchingProducts.length > 0 && (
        <section className="Search-results-section" aria-labelledby="matching-products-title">
          <div className="Search-results-section-heading">
            <span>02</span>
            <h2>Matching <em id="matching-products-title">products.</em></h2>
          </div>
          <div className="Products-grid">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                title={product.title}
                description={product.description}
                bulletPoints={product.bulletPoints}
              />
            ))}
          </div>
          {totalProductPages > 1 && (
            <nav className="Search-results-pagination" aria-label="Search result pages">
              <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safePage === 1}>Previous</button>
              <div className="Search-results-page-numbers">
                {Array.from({ length: totalProductPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button className={pageNumber === safePage ? 'is-active' : ''} type="button" key={pageNumber} onClick={() => setCurrentPage(pageNumber)} aria-current={pageNumber === safePage ? 'page' : undefined}>
                    {pageNumber}
                  </button>
                ))}
              </div>
              <span>Page {safePage} of {totalProductPages}</span>
              <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalProductPages, page + 1))} disabled={safePage === totalProductPages}>Next</button>
            </nav>
          )}
        </section>
      )}

      {matchingHangerCards.length > 0 && (
        <section className="Search-results-section" aria-labelledby="matching-hangers-title">
          <div className="Search-results-section-heading">
            <span>03</span>
            <h2 id="matching-hangers-title">Matching <em>hanger cards.</em></h2>
          </div>
          <HangingSlider items={matchingHangerCards.map((card) => ({ id: `hanger-${card.index}`, title: card.title, image: card.image }))} />
        </section>
      )}

      {matchingProducts.length === 0 && matchingHangerCards.length === 0 && matchingThemes.length === 0 && (
        <div className="Search-results-empty">
          <strong>No matches yet.</strong>
          <p>Try another product or theme name.</p>
          <Link to="/">Browse the collection</Link>
        </div>
      )}
    </div>
  )
}

export default SearchResults

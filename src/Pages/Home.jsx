import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../Components/ProductCard'
import { useProducts } from '../context/ProductContext'
import { themeCards } from '../data/themes'
import './Home.css'

const Home = () => {
  const { products } = useProducts()
  const [searchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 20
  const searchTerm = searchParams.get('search')?.trim().toLowerCase() || ''
  const visibleProducts = searchTerm
    ? products.filter((product) => `${product.title} ${product.description} ${product.bulletPoints?.join(' ')}`.toLowerCase().includes(searchTerm))
    : products
  const totalPages = Math.min(100, Math.max(1, Math.ceil(visibleProducts.length / productsPerPage)))
  const safePage = Math.min(currentPage, totalPages)
  const pageStart = (safePage - 1) * productsPerPage
  const pageProducts = visibleProducts.slice(pageStart, pageStart + productsPerPage)
  const featuredProducts = pageProducts.slice(0, 10)
  const additionalProducts = pageProducts.slice(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="Home">
      <div className="Home-hero">
        <div className="Hero-copy">
          <span className="Hero-kicker">Party supplies, reimagined</span>
          <h1>Make every moment feel <em>extraordinary.</em></h1>
          <p>Bright balloons, playful details and everything you need to turn an ordinary day into your favourite memory.</p>
          <div className="Hero-actions">
            <Link className="Hero-button Hero-button-primary" to="#featured-products">Explore collection <span aria-hidden="true">↗</span></Link>
            <Link className="Hero-button Hero-button-secondary" to="/inquiry">Plan your party <span aria-hidden="true">→</span></Link>
          </div>
          <div className="Hero-proof" aria-label="Store highlights">
            <div><strong>250+</strong><span>happy celebrations</span></div>
            <div><strong>24h</strong><span>quick dispatch</span></div>
            <div><strong>4.9/5</strong><span>customer love</span></div>
          </div>
        </div>
        <div className="Hero-art" aria-hidden="true">
          <div className="Hero-sun"></div>
          <div className="Hero-orbit Hero-orbit-one"></div>
          <div className="Hero-orbit Hero-orbit-two"></div>
          <img src="/images/download - 2026-04-16T131702.195.jpg" alt="" />
          <span className="Hero-sticker Hero-sticker-top">let's celebrate!</span>
          <span className="Hero-sticker Hero-sticker-bottom">made with joy <b>✦</b></span>
        </div>
        <div className="Hero-partners" aria-label="Why customers choose us">
          <span><strong>✦</strong> Curated picks</span>
          <span><strong>✷</strong> Easy planning</span>
          <span><strong>♡</strong> Happy hosts</span>
          <span><strong>+</strong> Fresh arrivals</span>
        </div>
      </div>

      <div className="Home-container" id="featured-products">
        <h2>Featured Products</h2>
        <div className="Products-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              description={product.description}
              bulletPoints={product.bulletPoints}
            />
          ))}
          {searchTerm && visibleProducts.length === 0 && (
            <p className="Products-empty">No products found for “{searchTerm}”.</p>
          )}
        </div>
      </div>

      {additionalProducts.length > 0 && (
        <section className="Home-container Home-additional-products" aria-labelledby="additional-products-title">
          <h2 id="additional-products-title">More products</h2>
          <div className="Products-grid">
            {additionalProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                title={product.title}
                description={product.description}
                bulletPoints={product.bulletPoints}
              />
            ))}
          </div>
        </section>
      )}

      {visibleProducts.length > productsPerPage && (
        <nav className="Products-pagination" aria-label="Product pages">
          <button type="button" onClick={() => setCurrentPage(Math.max(1, safePage - 1))} disabled={safePage === 1}>Previous</button>
          <div className="Products-page-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                className={pageNumber === safePage ? 'is-active' : ''}
                type="button"
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={pageNumber === safePage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          <span className="Products-page-status">Page {safePage} of {totalPages}</span>
          <button type="button" onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))} disabled={safePage === totalPages}>Next</button>
        </nav>
      )}

      <section className="Home-themes" aria-labelledby="themes-title">
        <div className="Home-themes-heading">
          <span className="Home-section-kicker">Curated for you</span>
          <h2 id="themes-title">Find your <em>theme.</em></h2>
        </div>
        <div className="Theme-grid">
          {themeCards.map((theme) => (
            <Link className="Theme-card" key={theme.id} to={`/theme/${theme.id}`}>
              <div className="Theme-card-images">
                {theme.productIds.map((productId) => {
                  const product = products.find((item) => item.id === productId)
                  return product ? <img key={product.id} src={product.image} alt="" /> : null
                })}
              </div>
              <div className="Theme-card-copy">
                <h3>{theme.title}</h3>
                <p>{theme.detail}</p>
                <span className="Theme-card-explore">Explore theme <span aria-hidden="true">↗</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home

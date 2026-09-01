import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import ProductCard from '../Components/ProductCard'
import HangingSlider from '../Components/HangingSlider'
import { useProducts } from '../context/ProductContext'
import { createThemeWhatsAppUrl } from '../utils/whatsapp'
import AskFormModal from '../Components/AskFormModal'
import './Home.css'

const heroBubbles = [
  { size: 18, left: '8%', top: '18%', delay: 0 },
  { size: 30, left: '84%', top: '20%', delay: 1.2 },
  { size: 12, left: '18%', top: '72%', delay: 2.1 },
  { size: 24, left: '78%', top: '76%', delay: 0.7 },
  { size: 10, left: '92%', top: '52%', delay: 1.7 },
  { size: 15, left: '4%', top: '48%', delay: 2.7 }
]

const themeBulletColors = ['#f2897a', '#3fb950', '#e5484d']

const ThemeCard = ({ theme, products }) => {
  const [isAskFormOpen, setIsAskFormOpen] = useState(false)
  const images = (theme.images?.length
    ? theme.images.map((item) => typeof item === 'string' ? item : item.image).filter(Boolean)
    : theme.productIds?.map((productId) => products.find((item) => item.id === productId)?.image).filter(Boolean) || [])
  const bulletPoints = (theme.detail || '')
    .split(/(?<=[.!])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  return (
    <>
      <Link className={`Theme-card Theme-card-${theme.id}`} to={`/theme/${theme.id}`}>
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

const Home = () => {
  const { products, themes, heroImages, hangerCards } = useProducts()
  const carouselImages = [...heroImages, heroImages[0]]
  const [searchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [heroImageIndex, setHeroImageIndex] = useState(0)
  const [isCarouselTransitionEnabled, setIsCarouselTransitionEnabled] = useState(true)
  const bubbleRefs = useRef([])
  const carouselPointerStartX = useRef(null)
  const paginationPositionRef = useRef(null)
  const productsPerPage = 20
  const searchTerm = searchParams.get('search')?.trim().toLowerCase() || ''
  const visibleProducts = searchTerm
    ? products.filter((product) => `${product.title} ${product.description} ${product.bulletPoints?.join(' ')}`.toLowerCase().includes(searchTerm))
    : products
  const visibleThemes = searchTerm
    ? themes.filter((theme) => `${theme.title} ${theme.detail || ''}`.toLowerCase().includes(searchTerm))
    : themes
  const totalPages = Math.min(100, Math.max(1, Math.ceil(visibleProducts.length / productsPerPage)))
  const safePage = Math.min(currentPage, totalPages)
  const pageStart = (safePage - 1) * productsPerPage
  const pageProducts = visibleProducts.slice(pageStart, pageStart + productsPerPage)
  const featuredProducts = pageProducts
  const additionalProducts = []
  const safeHeroImageIndex = Math.min(heroImageIndex, heroImages.length)

  useEffect(() => {
    const carouselTimer = window.setInterval(() => {
      setHeroImageIndex((index) => Math.min(index + 1, heroImages.length))
    }, 6000)
    return () => window.clearInterval(carouselTimer)
  }, [])

  useEffect(() => {
    if (heroImageIndex < heroImages.length) return undefined
    const resetTimer = window.setTimeout(() => {
      setIsCarouselTransitionEnabled(false)
      setHeroImageIndex(0)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsCarouselTransitionEnabled(true))
      })
    }, 4020)
    return () => window.clearTimeout(resetTimer)
  }, [heroImageIndex])

  useEffect(() => {
    let animationFrame
    const animateBubbles = (timestamp) => {
      bubbleRefs.current.forEach((bubble, index) => {
        if (!bubble) return
        const bubbleData = heroBubbles[index]
        const time = timestamp / 1000 + bubbleData.delay
        const x = Math.sin(time * 0.8) * 10
        const y = Math.cos(time * 0.65) * 14
        const scale = 0.9 + (Math.sin(time * 0.9) + 1) * 0.08
        bubble.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      })
      animationFrame = window.requestAnimationFrame(animateBubbles)
    }
    animationFrame = window.requestAnimationFrame(animateBubbles)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  useLayoutEffect(() => {
    if (paginationPositionRef.current === null) return
    const { viewportTop } = paginationPositionRef.current
    const restore = () => {
      const pagination = document.querySelector('.Products-pagination')
      if (!pagination) return
      window.scrollBy({ top: pagination.getBoundingClientRect().top - viewportTop, left: 0, behavior: 'auto' })
    }
    restore()
    requestAnimationFrame(() => {
      restore()
      requestAnimationFrame(restore)
    })
    window.setTimeout(restore, 100)
    window.setTimeout(restore, 300)
    paginationPositionRef.current = null
  }, [currentPage])

  const holdScrollPosition = (event) => {
    event.preventDefault()
    const pagination = event.currentTarget.closest('.Products-pagination')
    paginationPositionRef.current = {
      viewportTop: pagination?.getBoundingClientRect().top ?? 0
    }
  }

  const goToPage = (event, pageNumber) => {
    event.preventDefault()
    if (paginationPositionRef.current === null) holdScrollPosition(event)
    setCurrentPage(pageNumber)
  }

  const handleCarouselPointerDown = (event) => {
    if (!event.isPrimary) return
    event.currentTarget.setPointerCapture(event.pointerId)
    carouselPointerStartX.current = event.clientX
  }

  const moveCarouselToSwipe = (distance, event) => {
    if (Math.abs(distance) < 40) return false
    carouselPointerStartX.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setHeroImageIndex((index) => distance < 0
      ? Math.min(index + 1, heroImages.length)
      : (index - 1 + heroImages.length) % heroImages.length)
    return true
  }

  const handleCarouselPointerMove = (event) => {
    if (!event.isPrimary || carouselPointerStartX.current === null) return
    moveCarouselToSwipe(event.clientX - carouselPointerStartX.current, event)
  }

  const handleCarouselPointerUp = (event) => {
    if (!event.isPrimary || carouselPointerStartX.current === null) return
    const distance = event.clientX - carouselPointerStartX.current
    moveCarouselToSwipe(distance, event)
  }

  return (
    <div className="Home">
      <div className="Home-hero">
        <div className="Hero-copy">
          <span className="Hero-kicker">
            <img src="/images/new_logo.png" alt="The Balloon Space" />
          </span>
          <h1><span>Make every moment feel</span> <em>extraordinary.</em></h1>
          <p>Bright balloons, playful details and everything you need to turn an ordinary day into your favourite memory.</p>
          <div className="Hero-proof" aria-label="Store highlights">
            <div><strong>250+</strong><span>happy celebrations</span></div>
            <div><strong>24h</strong><span>quick dispatch</span></div>
            <div><strong>4.9/5</strong><span>customer love</span></div>
          </div>
        </div>
        <div className="Hero-art">
          <div className="Hero-sun"></div>
          <div className="Hero-orbit Hero-orbit-one"></div>
          <div className="Hero-orbit Hero-orbit-two"></div>
          {heroBubbles.map((bubble, index) => (
            <span
              className="Hero-bubble"
              key={`${bubble.left}-${bubble.top}`}
              ref={(element) => { bubbleRefs.current[index] = element }}
              style={{ width: `${bubble.size}px`, height: `${bubble.size}px`, left: bubble.left, top: bubble.top }}
              aria-hidden="true"
            />
          ))}
          <div
            className="Hero-carousel"
            aria-label="Celebration gallery"
            onPointerDown={handleCarouselPointerDown}
            onPointerMove={handleCarouselPointerMove}
            onPointerUp={handleCarouselPointerUp}
            onPointerCancel={() => { carouselPointerStartX.current = null }}
          >
            <div className="Hero-carousel-viewport">
              <div
                className="Hero-carousel-track"
                style={{
                  transform: `translateX(-${safeHeroImageIndex * 100}%)`,
                  transition: isCarouselTransitionEnabled ? undefined : 'none'
                }}
              >
                {carouselImages.map((image, index) => (
                  <div className="Hero-carousel-slide" key={`${image}-${index}`}>
                    <img
                      className="Hero-carousel-image"
                      src={image}
                      alt={`Celebration decoration ${index + 1} of ${heroImages.length}`}
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              className="Hero-carousel-button Hero-carousel-button-prev"
              type="button"
              onClick={() => setHeroImageIndex((index) => (index - 1 + heroImages.length) % heroImages.length)}
              aria-label="Show previous celebration image"
            >
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button
              className="Hero-carousel-button Hero-carousel-button-next"
              type="button"
              onClick={() => setHeroImageIndex((index) => (index + 1) % heroImages.length)}
              aria-label="Show next celebration image"
            >
              <FiChevronRight aria-hidden="true" />
            </button>
            <div className="Hero-carousel-dots" aria-label="Choose celebration image">
              {heroImages.map((image, index) => (
                <button
                  className={index === heroImageIndex ? 'is-active' : ''}
                  type="button"
                  key={image}
                  onClick={() => setHeroImageIndex(index)}
                  aria-label={`Show celebration image ${index + 1}`}
                  aria-current={index === heroImageIndex ? 'true' : undefined}
                />
              ))}
            </div>
          </div>
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

      <HangingSlider
        items={hangerCards.map((card, index) => ({
          id: `hanger-${index}`,
          title: card.title,
          image: card.image
        }))}
      />

      <div className="Home-container" id="featured-products">
        <h2>Shop the <em>celebration.</em></h2>
        <div className="Products-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
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
          <h2 id="additional-products-title">More to <em>celebrate.</em></h2>
          <div className="Products-grid">
            {additionalProducts.map((product) => (
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
        </section>
      )}

      {
        <nav className="Products-pagination" aria-label="Product pages">
          <button type="button" onPointerDown={holdScrollPosition} onFocus={(event) => event.target.blur()} onClick={(event) => goToPage(event, Math.max(1, safePage - 1))} disabled={safePage === 1}>Previous</button>
          <div className="Products-page-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                className={pageNumber === safePage ? 'is-active' : ''}
                type="button"
                key={pageNumber}
                onPointerDown={holdScrollPosition}
                onFocus={(event) => event.target.blur()}
                onClick={(event) => goToPage(event, pageNumber)}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={pageNumber === safePage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          <span className="Products-page-status">Page {safePage} of {totalPages}</span>
          <button type="button" onPointerDown={holdScrollPosition} onFocus={(event) => event.target.blur()} onClick={(event) => goToPage(event, Math.min(totalPages, safePage + 1))} disabled={safePage === totalPages}>Next</button>
        </nav>
      }

      <section className="Home-themes" aria-labelledby="themes-title">
        <div className="Home-themes-heading">
          <span className="Home-section-kicker">Curated for you</span>
          <h2 id="themes-title">Find your <em>theme.</em></h2>
        </div>
        <div className="Theme-grid">
          {visibleThemes.slice(0, 4).map((theme) => <ThemeCard key={theme.id} theme={theme} products={products} />)}
        </div>
        {themes.length > 4 && <Link className="Home-more-themes" to="/themes">More Themes</Link>}
      </section>
    </div>
  )
}

export default Home

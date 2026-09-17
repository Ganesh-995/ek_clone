import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiAward, FiTruck, FiClock, FiHeart } from 'react-icons/fi'
import ProductCard from '../Components/ProductCard'
import HangingSlider from '../Components/HangingSlider'
import ThemeCard from '../Components/ThemeCard'
import { useProducts } from '../context/ProductContext'
import './Home.css'

const heroBubbles = [
  { size: 18, left: '8%', top: '18%', delay: 0 },
  { size: 30, left: '84%', top: '20%', delay: 1.2 },
  { size: 12, left: '18%', top: '72%', delay: 2.1 },
  { size: 24, left: '78%', top: '76%', delay: 0.7 },
  { size: 10, left: '92%', top: '52%', delay: 1.7 },
  { size: 15, left: '4%', top: '48%', delay: 2.7 }
]

const Home = () => {
  const { products, themes, heroImages, hangerCards } = useProducts()
  const numHeroImages = heroImages.length
  // Cloned ends for infinite loop: [Last, ...Images, First]
  const carouselImages = numHeroImages > 1
    ? [heroImages[numHeroImages - 1], ...heroImages, heroImages[0]]
    : heroImages

  const [searchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [heroImageIndex, setHeroImageIndex] = useState(numHeroImages > 1 ? 1 : 0)
  const [isCarouselTransitionEnabled, setIsCarouselTransitionEnabled] = useState(true)
  const [isCarouselHovered, setIsCarouselHovered] = useState(false)
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

  // Active dot index (0-based)
  const activeDotIndex = numHeroImages > 1
    ? (heroImageIndex - 1 + numHeroImages) % numHeroImages
    : 0

  const handleNext = () => {
    if (numHeroImages <= 1) return
    setIsCarouselTransitionEnabled(true)
    setHeroImageIndex((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (numHeroImages <= 1) return
    setIsCarouselTransitionEnabled(true)
    setHeroImageIndex((prev) => prev - 1)
  }

  const handleDotClick = (targetIndex) => {
    if (numHeroImages <= 1) return
    setIsCarouselTransitionEnabled(true)
    setHeroImageIndex(targetIndex + 1)
  }

  const handleTrackTransitionEnd = (event) => {
    if (event.propertyName && event.propertyName !== 'transform') return
    if (numHeroImages <= 1) return

    if (heroImageIndex >= numHeroImages + 1) {
      setIsCarouselTransitionEnabled(false)
      setHeroImageIndex(1)
    } else if (heroImageIndex <= 0) {
      setIsCarouselTransitionEnabled(false)
      setHeroImageIndex(numHeroImages)
    }
  }

  useEffect(() => {
    if (numHeroImages <= 1) return undefined

    if (heroImageIndex >= numHeroImages + 1) {
      const timer = window.setTimeout(() => {
        setIsCarouselTransitionEnabled(false)
        setHeroImageIndex(1)
      }, 1210)
      return () => window.clearTimeout(timer)
    } else if (heroImageIndex <= 0) {
      const timer = window.setTimeout(() => {
        setIsCarouselTransitionEnabled(false)
        setHeroImageIndex(numHeroImages)
      }, 1210)
      return () => window.clearTimeout(timer)
    }
  }, [heroImageIndex, numHeroImages])

  useEffect(() => {
    if (!isCarouselTransitionEnabled) {
      const frame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsCarouselTransitionEnabled(true)
        })
      })
      return () => window.cancelAnimationFrame(frame)
    }
  }, [isCarouselTransitionEnabled])

  useEffect(() => {
    if (numHeroImages <= 1 || isCarouselHovered) return undefined

    const carouselTimer = window.setInterval(() => {
      handleNext()
    }, 1500)
    return () => window.clearInterval(carouselTimer)
  }, [numHeroImages, isCarouselHovered, heroImageIndex])

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
    if (event.target.closest('button') || event.target.closest('a')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    carouselPointerStartX.current = event.clientX
  }

  const moveCarouselToSwipe = (distance, event) => {
    if (Math.abs(distance) < 30 || numHeroImages === 0) return false
    carouselPointerStartX.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId)
      } catch {
        // ignore
      }
    }
    if (distance < 0) {
      handleNext()
    } else {
      handlePrev()
    }
    return true
  }

  const handleCarouselPointerMove = (event) => {
    if (!event.isPrimary || carouselPointerStartX.current === null) return
    moveCarouselToSwipe(event.clientX - carouselPointerStartX.current, event)
  }

  const handleCarouselPointerUp = (event) => {
    if (!event.isPrimary || carouselPointerStartX.current === null) return
    const distance = event.clientX - carouselPointerStartX.current
    carouselPointerStartX.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId)
      } catch {
        // ignore
      }
    }
    moveCarouselToSwipe(distance, event)
  }

  return (
    <div className="Home">
      <section className="Home-hero">
        <div className="Hero-container">
          {/* Left Column: Catchy Headline, Subtext, and CTA */}
          <div className="Hero-copy">
            <span className="Hero-badge">ELEVATE YOUR CELEBRATION</span>
            <h1 className="Hero-title">
              Make every moment feel <em>extraordinary.</em>
            </h1>
            <p className="Hero-subtext">
              Bright balloons, playful details, and premium decorations curated to turn your special day into unforgettable memories.
            </p>
            <div className="Hero-actions">
              <a href="#featured-products" className="Hero-cta-btn">
                <span>Explore Collection</span>
                <FiArrowRight aria-hidden="true" />
              </a>
            </div>
            <div className="Hero-proof-bar" aria-label="Store highlights">
              <div className="Hero-proof-item">
                <strong>250+</strong>
                <span>happy celebrations</span>
              </div>
              <div className="Hero-proof-item">
                <strong>24h</strong>
                <span>quick dispatch</span>
              </div>
              <div className="Hero-proof-item">
                <strong>4.9/5</strong>
                <span>customer love</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Resolution Image Container with Soft Rounded Corners */}
          <div className="Hero-art">
            <div className="Hero-image-card">
              <div
                className="Hero-carousel"
                aria-label="Celebration gallery"
                onMouseEnter={() => setIsCarouselHovered(true)}
                onMouseLeave={() => setIsCarouselHovered(false)}
                onPointerDown={handleCarouselPointerDown}
                onPointerMove={handleCarouselPointerMove}
                onPointerUp={handleCarouselPointerUp}
                onPointerCancel={() => {
                  carouselPointerStartX.current = null
                }}
              >
                <div className="Hero-carousel-viewport">
                  <div
                    className="Hero-carousel-track"
                    onTransitionEnd={handleTrackTransitionEnd}
                    style={{
                      transform: `translateX(-${heroImageIndex * 100}%)`,
                      transition: isCarouselTransitionEnabled ? undefined : 'none'
                    }}
                  >
                    {carouselImages.map((image, index) => (
                      <div className="Hero-carousel-slide" key={`${image}-${index}`}>
                        <img
                          className="Hero-carousel-image"
                          src={image}
                          alt={`Celebration decoration ${index + 1} of ${numHeroImages}`}
                          loading={index === heroImageIndex ? 'eager' : 'lazy'}
                          decoding="async"
                          draggable="false"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="Hero-carousel-button Hero-carousel-button-prev"
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation()
                    handlePrev()
                  }}
                  aria-label="Show previous celebration image"
                >
                  <FiChevronLeft aria-hidden="true" />
                </button>
                <button
                  className="Hero-carousel-button Hero-carousel-button-next"
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation()
                    handleNext()
                  }}
                  aria-label="Show next celebration image"
                >
                  <FiChevronRight aria-hidden="true" />
                </button>
                <div
                  className="Hero-carousel-dots"
                  aria-label="Choose celebration image"
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  {heroImages.map((image, index) => (
                    <button
                      className={index === activeDotIndex ? 'is-active' : ''}
                      type="button"
                      key={`${image}-${index}`}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation()
                        handleDotClick(index)
                      }}
                      aria-label={`Show celebration image ${index + 1}`}
                      aria-current={index === activeDotIndex ? 'true' : undefined}
                    />
                  ))}
                </div>
              </div>
              <span className="Hero-sticker Hero-sticker-top">let's celebrate!</span>
              <span className="Hero-sticker Hero-sticker-bottom">made with joy <b>✦</b></span>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Features / Announcement Banner Ribbon */}
      <section className="Features-banner" aria-label="Store features and guarantees">
        <div className="Features-container">
          <div className="Feature-item">
            <div className="Feature-icon-wrapper">
              <FiAward className="Feature-icon" aria-hidden="true" />
            </div>
            <div className="Feature-text">
              <strong>Premium Craftsmanship</strong>
              <span>100% High-grade eco balloons</span>
            </div>
          </div>

          <div className="Feature-item">
            <div className="Feature-icon-wrapper">
              <FiTruck className="Feature-icon" aria-hidden="true" />
            </div>
            <div className="Feature-text">
              <strong>Express Delivery</strong>
              <span>Same-day setup & dispatch</span>
            </div>
          </div>

          <div className="Feature-item">
            <div className="Feature-icon-wrapper">
              <FiClock className="Feature-icon" aria-hidden="true" />
            </div>
            <div className="Feature-text">
              <strong>On-Time Promise</strong>
              <span>Ready before your event starts</span>
            </div>
          </div>

          <div className="Feature-item">
            <div className="Feature-icon-wrapper">
              <FiHeart className="Feature-icon" aria-hidden="true" />
            </div>
            <div className="Feature-text">
              <strong>Custom Party Themes</strong>
              <span>Tailored to your celebration vision</span>
            </div>
          </div>
        </div>
      </section>

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
          {visibleThemes.slice(0, 4).map((theme, index) => <ThemeCard key={theme.id} theme={theme} products={products} index={index} />)}
        </div>
        {themes.length > 4 && <Link className="Home-more-themes" to="/themes">More Themes</Link>}
      </section>
    </div>
  )
}

export default Home

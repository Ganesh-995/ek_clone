import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './HangingSlider.css'

const tiltPattern = [-6, 4, -3, 5, -4, 3, -5, 4]
const getPastelColor = (index) => `hsl(${(index * 137.508) % 360} 72% 91%)`
const archAmplitude = 22
const cardWidth = 120
const cardGap = 28
const scrollStep = (cardWidth + cardGap) * 2

const buildSet = (items, offset) => items.map((item, index) => {
  const arch = items.length > 1 ? archAmplitude * Math.sin((Math.PI * index) / (items.length - 1)) : 0
  return {
    item,
    localIndex: index,
    arch,
    centerX: (offset + index) * (cardWidth + cardGap) + cardWidth / 2
  }
})

const HangingSlider = ({ items }) => {
  const navigate = useNavigate()
  const viewportRef = useRef(null)

  // Card set is rendered twice back-to-back so navigation can wrap silently (1-2-3-1-2-3)
  const cards = items?.length ? [...buildSet(items, 0), ...buildSet(items, items.length)] : []
  const totalWidth = cards.length * (cardWidth + cardGap) - cardGap
  const setWidth = items?.length ? items.length * (cardWidth + cardGap) : 0

  const stringPath = cards.reduce((path, card, i) => {
    const y = 8 + card.arch
    if (i === 0) return `M ${card.centerX} ${y}`
    const prev = cards[i - 1]
    const midX = (prev.centerX + card.centerX) / 2
    const midY = 8 + (prev.arch + card.arch) / 2 + 10
    return `${path} Q ${midX} ${midY} ${card.centerX} ${y}`
  }, '')

  // Keep scrollLeft inside the first copy's range once the pointer settles, so the loop never visibly resets
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || !setWidth) return

    let settleTimer = null
    const handleScroll = () => {
      clearTimeout(settleTimer)
      settleTimer = setTimeout(() => {
        if (viewport.scrollLeft >= setWidth) {
          viewport.scrollLeft -= setWidth
        } else if (viewport.scrollLeft <= 0) {
          viewport.scrollLeft += setWidth
        }
      }, 120)
    }

    viewport.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(settleTimer)
      viewport.removeEventListener('scroll', handleScroll)
    }
  }, [setWidth])

  if (!items?.length) return null

  const openBunting = (event) => {
    event?.preventDefault()
    event?.stopPropagation()
    navigate('/bunting')
  }

  const scroll = (direction) => {
    const viewport = viewportRef.current
    if (!viewport) return

    // Pre-position inside the duplicate set so a backward scroll never hits the hard edge
    if (direction < 0 && viewport.scrollLeft < scrollStep) {
      viewport.scrollLeft += setWidth
    }

    viewport.scrollBy({ left: direction * scrollStep, behavior: 'smooth' })
  }

  return (
    <div className="HangingSlider">
      <div className="HangingSlider-viewport" ref={viewportRef}>
        <svg className="HangingSlider-string" viewBox={`0 0 ${totalWidth} 44`} preserveAspectRatio="none" aria-hidden="true" style={{ width: `${totalWidth}px` }}>
          <path d={stringPath} fill="none" stroke="#c9c2b8" strokeWidth="1" />
        </svg>
        <div className="HangingSlider-track" style={{ width: `${totalWidth}px` }}>
          {cards.map((card, i) => {
            const rawId = String(card.item.id ?? '')
            const itemId = rawId

            if (itemId) {
              return (
                <a
                  href={`/bunting?item=${encodeURIComponent(itemId)}`}
                  className="HangingSlider-card"
                  key={i}
                  style={{
                    width: `${cardWidth}px`,
                    '--tilt': `${tiltPattern[card.localIndex % tiltPattern.length]}deg`,
                    '--delay': `${(card.localIndex % 5) * 0.3}s`,
                    '--arch-offset': `${card.arch}px`,
                    '--card-color': getPastelColor(i)
                  }}
                  aria-label={card.item.title}
                >
                  <span
                    className="HangingSlider-clip"
                    role="button"
                    tabIndex={0}
                    aria-label="Open bunting page"
                  />
                  <div className="HangingSlider-photo">
                    <img src={card.item.image} alt={card.item.title} loading="lazy" />
                  </div>
                  <div className="HangingSlider-info">
                    <strong>{card.item.title}</strong>
                  </div>
                </a>
              )
            }

            return (
              <div
                className="HangingSlider-card"
                key={i}
                style={{
                  width: `${cardWidth}px`,
                  '--tilt': `${tiltPattern[card.localIndex % tiltPattern.length]}deg`,
                  '--delay': `${(card.localIndex % 5) * 0.3}s`,
                  '--arch-offset': `${card.arch}px`,
                  '--card-color': getPastelColor(i)
                }}
                aria-label={card.item.title}
              >
                <span
                  className="HangingSlider-clip"
                  role="button"
                  tabIndex={0}
                  aria-label="Open bunting page"
                  onClick={openBunting}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openBunting(e) }}
                />
                <div className="HangingSlider-photo">
                  <img src={card.item.image} alt={card.item.title} loading="lazy" />
                </div>
                <div className="HangingSlider-info">
                  <strong>{card.item.title}</strong>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="HangingSlider-controls">
        <button
          type="button"
          className="HangingSlider-btn"
          onClick={() => scroll(-1)}
          aria-label="Previous cards"
        >
          ‹
        </button>
        <button
          type="button"
          className="HangingSlider-btn"
          onClick={() => scroll(1)}
          aria-label="Next cards"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default HangingSlider

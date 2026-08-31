import React from 'react'
import { useNavigate } from 'react-router-dom'
import './HangingSlider.css'

const tiltPattern = [-6, 4, -3, 5, -4, 3, -5, 4]
const archAmplitude = 22
const cardWidth = 120
const cardGap = 28

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

  if (!items?.length) return null

  const cards = [...buildSet(items, 0), ...buildSet(items, items.length)]
  const totalWidth = cards.length * (cardWidth + cardGap) - cardGap

  const stringPath = cards.reduce((path, card, i) => {
    const y = 8 + card.arch
    if (i === 0) return `M ${card.centerX} ${y}`
    const prev = cards[i - 1]
    const midX = (prev.centerX + card.centerX) / 2
    const midY = 8 + (prev.arch + card.arch) / 2 + 10
    return `${path} Q ${midX} ${midY} ${card.centerX} ${y}`
  }, '')

  const openBunting = (event) => {
    event?.preventDefault()
    event?.stopPropagation()
    navigate('/bunting')
  }

  return (
    <div className="HangingSlider">
      <div
        className="HangingSlider-loop"
        style={{ width: `${totalWidth}px`, '--loop-shift': `${items.length * (cardWidth + cardGap)}px` }}
      >
        <svg className="HangingSlider-string" viewBox={`0 0 ${totalWidth} 44`} preserveAspectRatio="none" aria-hidden="true">
          <path d={stringPath} fill="none" stroke="#c9c2b8" strokeWidth="1" />
        </svg>
        <div className="HangingSlider-track">
          {cards.map((card, i) => {
            const rawId = String(card.item.id ?? '')
            const productId = rawId.split('-')[0]

            if (productId) {
              return (
                <a
                  href={`/bunting?item=${encodeURIComponent(productId)}`}
                  className="HangingSlider-card"
                  key={i}
                  style={{
                    width: `${cardWidth}px`,
                    '--tilt': `${tiltPattern[card.localIndex % tiltPattern.length]}deg`,
                    '--delay': `${(card.localIndex % 5) * 0.3}s`,
                    '--arch-offset': `${card.arch}px`
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
                  '--arch-offset': `${card.arch}px`
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
    </div>
  )
}

export default HangingSlider

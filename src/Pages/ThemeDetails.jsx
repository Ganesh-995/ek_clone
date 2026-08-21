import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { themeCards } from '../data/themes'
import './ThemeDetails.css'

const ThemeDetails = () => {
  const { themeId } = useParams()
  const navigate = useNavigate()
  const { products } = useProducts()
  const theme = themeCards.find((item) => item.id === themeId)
  const themeProducts = theme ? theme.productIds.map((id) => products.find((product) => product.id === id)).filter(Boolean) : []

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [themeId])

  if (!theme) {
    return (
      <section className="ThemeDetails ThemeDetails-empty">
        <h1>Theme not found</h1>
        <Link to="/">Back to home</Link>
      </section>
    )
  }

  return (
    <section className="ThemeDetails">
      <button className="ThemeDetails-back" type="button" onClick={() => navigate(-1)}>
        <span aria-hidden="true">←</span> Back to themes
      </button>
      <div className="ThemeDetails-hero">
        <div className="ThemeDetails-gallery">
          {themeProducts.map((product) => <img key={product.id} src={product.image} alt={product.title} />)}
        </div>
        <div className="ThemeDetails-copy">
          <span className="ThemeDetails-kicker">Curated theme</span>
          <h1>{theme.title}</h1>
          <p>{theme.detail}</p>
        </div>
      </div>
    </section>
  )
}

export default ThemeDetails

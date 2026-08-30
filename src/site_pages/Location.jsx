import React from 'react'
import { FiArrowUpRight, FiMapPin } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import './Location.css'

const Location = () => {
  return (
    <main className="Location-page">
      <section className="Location-hero">
        <div className="Location-hero-copy">
          <span className="Location-eyebrow"><FiMapPin aria-hidden="true" /> Service area</span>
          <h1>Celebrations,<br /><em>only in Delhi NCR.</em></h1>
          <p className="Location-intro">
            We design and deliver balloon decor, themed setups, and party details across the Delhi NCR region.
          </p>
          <Link className="Location-cta" to="/inquiry">
            Plan your celebration <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>

        <div className="Location-signal" aria-label="Service location: Delhi NCR">
          <div className="Location-ring Location-ring-one" />
          <div className="Location-ring Location-ring-two" />
          <div className="Location-pin"><FiMapPin aria-hidden="true" /></div>
          <span className="Location-signal-label">Delhi NCR</span>
          <span className="Location-signal-caption">Our world of balloons</span>
        </div>
      </section>

      <section className="Location-details">
        <div className="Location-details-heading">
          <span>Where we bring the magic</span>
          <h2>One region.<br /><em>Endless occasions.</em></h2>
        </div>
        <div className="Location-areas">
          <article><strong>01</strong><h3>Delhi</h3><p>From intimate home parties to grand celebrations.</p></article>
          <article><strong>02</strong><h3>Gurugram</h3><p>Personalised setups for every kind of milestone.</p></article>
          <article><strong>03</strong><h3>Noida &amp; Ghaziabad</h3><p>Thoughtful details, delivered and styled with care.</p></article>
        </div>
      </section>
    </main>
  )
}

export default Location

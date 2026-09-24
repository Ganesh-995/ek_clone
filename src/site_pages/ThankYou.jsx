import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheck, FiHome } from 'react-icons/fi'
import './ThankYou.css'

const ThankYou = () => {
  return (
    <main className="ThankYou-page">
      <section className="ThankYou-card" aria-labelledby="thank-you-title">
        <div className="ThankYou-mark" aria-hidden="true">
          <FiCheck />
        </div>
        <span className="ThankYou-kicker">Inquiry received</span>
        <h1 id="thank-you-title">Thank you for reaching out.</h1>
        <p>
          Your WhatsApp inquiry window is open in a new tab. Send your message there and our team will get back to you shortly.
        </p>
        <div className="ThankYou-actions">
          <Link className="ThankYou-primary" to="/">
            Explore celebrations <FiArrowRight aria-hidden="true" />
          </Link>
          <Link className="ThankYou-secondary" to="/">
            <FiHome aria-hidden="true" /> Back to home
          </Link>
        </div>
      </section>
      <div className="ThankYou-orbit ThankYou-orbit-one" aria-hidden="true" />
      <div className="ThankYou-orbit ThankYou-orbit-two" aria-hidden="true" />
    </main>
  )
}

export default ThankYou

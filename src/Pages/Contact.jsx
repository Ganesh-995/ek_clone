import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Contact.css'

const Contact = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const payload = new URLSearchParams({ 'form-name': 'inquiry', ...formData })
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      })

      if (!response.ok) throw new Error('Unable to send inquiry right now.')

      setIsSubmitted(true)
      setFormData({ name: '', email: '', mobile: '', message: '' })
      window.setTimeout(() => navigate('/'), 5000)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="Inquiry-page">
      <section className="Inquiry-intro">
        <span className="Inquiry-kicker">Let's make it memorable</span>
        <h1>Send an <em>inquiry.</em></h1>
        <p>Tell us what you are planning and our team will get back to you shortly.</p>
      </section>

      <section className="Inquiry-panel">
        <div className="Inquiry-note">
          <span className="Inquiry-note-mark">✦</span>
          <h2>Plan your celebration</h2>
          <p>Share a few details and we will help you find the right products for your moment.</p>
          <div className="Inquiry-note-line">
            <span>01</span>
            <p>Fill in your details</p>
          </div>
          <div className="Inquiry-note-line">
            <span>02</span>
            <p>We will get back to you shortly</p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="Inquiry-success" role="status" aria-live="polite">
            <span className="Inquiry-success-mark">✓</span>
            <h2>We will let you know.</h2>
            <p>Your inquiry has been received. You will be redirected to the home page in 5 seconds.</p>
          </div>
        ) : (
        <form className="Inquiry-form" name="inquiry" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={handleSubmit}>
          <input type="hidden" name="form-name" value="inquiry" />
          <label className="Inquiry-honeypot">
            Don't fill this out
            <input name="bot-field" tabIndex="-1" autoComplete="off" />
          </label>
          <div className="Inquiry-form-row">
            <label>
              Name *
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
            </label>
            <label>
              Email *
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
            </label>
          </div>
          <label>
            Mobile number *
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Your mobile number" pattern="[0-9+() -]{10,}" required />
          </label>
          <label>
            Message *
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your celebration" rows="5" required />
          </label>
          {submitError && <p className="Inquiry-error" role="alert">{submitError}</p>}
          <button className="Inquiry-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send inquiry'} {!isSubmitting && <span aria-hidden="true">↗</span>}
          </button>
        </form>
        )}
      </section>
    </div>
  )
}

export default Contact

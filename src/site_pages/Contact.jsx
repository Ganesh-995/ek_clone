import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { openWhatsAppAndNavigate } from '../utils/whatsapp'
import './Contact.css'

const whatsappNumber = '917838937047'

const Contact = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  })
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
      const whatsappMessage = [
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        `Mobile: ${formData.mobile}`,
        `Message: ${formData.message}`,
      ].join('\n')
      openWhatsAppAndNavigate(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, navigate)

      setFormData({ name: '', email: '', mobile: '', message: '' })
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

        <form className="Inquiry-form" onSubmit={handleSubmit}>
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
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Your mobile number" pattern="[0-9+() \x2D]{10,}" required />
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
      </section>
    </div>
  )
}

export default Contact

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaTimes, FaWhatsapp } from 'react-icons/fa'
import { createInquiryWhatsAppUrl } from '../utils/whatsapp'
import './AskFormModal.css'

const AskFormModal = ({ subject, type = 'product', images = [], onClose }) => {
  const [formData, setFormData] = useState({ name: '', mobile: '', eventDate: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    window.open(createInquiryWhatsAppUrl({ subject, type, images, ...formData }), '_blank', 'noopener,noreferrer')
    setIsSubmitting(false)
    onClose()
  }

  return createPortal(
    <div className="AskFormModal-overlay">
      <div className="AskFormModal" role="dialog" aria-modal="true" aria-labelledby="ask-form-title">
        <div className="AskFormModal-header">
          <div>
            <span className="AskFormModal-kicker">Quick inquiry</span>
            <h2 id="ask-form-title">Tell us about your event</h2>
          </div>
          <button className="AskFormModal-close" type="button" onClick={onClose} aria-label="Close inquiry form">
            <FaTimes aria-hidden="true" />
          </button>
        </div>
        <p className="AskFormModal-subject">{subject}</p>
        <form onSubmit={handleSubmit}>
          <div className="AskFormModal-row">
            <label>
              Name *
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required autoFocus />
            </label>
            <label>
              Mobile *
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile number" pattern="[0-9+() \\x2D]{10,}" required />
            </label>
          </div>
          <label>
            Event date *
            <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required />
          </label>
          <label>
            Message *
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us what you need" rows="2" required />
          </label>
          <button className="AskFormModal-submit" type="submit" disabled={isSubmitting}>
            <FaWhatsapp aria-hidden="true" /> {isSubmitting ? 'Opening WhatsApp...' : 'Send on WhatsApp'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default AskFormModal

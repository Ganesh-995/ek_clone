export const WHATSAPP_NUMBER = '917838937047'

export function createProductWhatsAppUrl(product) {
  const bulletPoints = product.bulletPoints?.length
    ? `\n\n✅ *Key details:*\n${product.bulletPoints.map((point) => `• ${point}`).join('\n')}`
    : ''
  const description = product.description ? `\n\n📝 *Description:*\n${product.description}` : ''
  const message = `🛍️ *Interested in this product!*\n\n📦 *${product.title}*${description}${bulletPoints}\n\n🖼️ *Product Image:*\n${product.image}\n\nPlease provide more details!`

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function createThemeWhatsAppUrl(theme, images = []) {
  const imageList = images.length
    ? `\n\n🖼️ *Theme Images:*\n${images.map((image) => `• ${image}`).join('\n')}`
    : ''
  const message = `🎨 *Interested in this theme!*\n\n✨ *${theme.title}*\n\n📝 *Description:*\n${theme.detail || 'Please share more details about this theme.'}${imageList}\n\nPlease provide more details!`

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function createInquiryWhatsAppUrl({ subject, type, images = [], name, mobile, eventDate, message }) {
  const imageList = images.length
    ? `\n\n🖼️ *${type === 'theme' ? 'Theme Images' : 'Product Image'}:*\n${images.map((image) => `• ${image}`).join('\n')}`
    : ''
  const inquiryMessage = `👋 *New event inquiry*\n\n${type === 'theme' ? '🎨 *Theme:*' : '📦 *Product:*'} ${subject}${imageList}\n\n👤 *Name:* ${name}\n📱 *Mobile:* ${mobile}\n📅 *Event date:* ${eventDate}\n💬 *Message:* ${message}`

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(inquiryMessage)}`
}

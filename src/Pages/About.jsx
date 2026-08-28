import React from 'react'
import { FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa'
import { FiHeart, FiStar } from 'react-icons/fi'
import './About.css'

const About = () => {
  return (
    <main className="About-page">
      <section className="About-hero">
        <div className="About-hero-copy">
          <span className="About-eyebrow"><FiStar aria-hidden="true" /> The Balloon Space</span>
          <h1>We make a little<br /><em>more magic.</em></h1>
          <p>
            The Balloon Space creates joyful, personal celebrations across Delhi NCR, turning ordinary corners into moments people remember.
          </p>
          <div className="About-hero-social" aria-label="Social links">
            <a href="https://www.instagram.com/theballoonspace/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
              <FaInstagram aria-hidden="true" />
              <span>Instagram</span>
            </a>
            <a href="https://in.pinterest.com/ganeshrathore518/" target="_blank" rel="noreferrer" aria-label="Pinterest" title="Pinterest">
              <FaPinterest aria-hidden="true" />
              <span>Pinterest</span>
            </a>
            <a href="https://www.youtube.com/@Theballoonspace-0" target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube">
              <FaYoutube aria-hidden="true" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
        <div className="About-logo-stage" aria-label="The Balloon Space logo">
          <div className="About-stage-orbit About-stage-orbit-one" />
          <div className="About-stage-orbit About-stage-orbit-two" />
          <img src="/images/new_logo.png" alt="The Balloon Space" />
          <span className="About-stage-note">made for<br /><strong>your moment</strong></span>
        </div>
      </section>

      <section className="About-stories" aria-label="Our celebration work">
        {[
          ['01', 'Pastel baby celebrations', 'Soft colours, playful characters, and sweet details come together to make a little one feel wonderfully welcomed.', 'instagram-post-1.jpg', 'Pastel baby celebration setup'],
          ['02', 'A welcome worth remembering', 'From the first balloon to the final flower, we turn an entrance into a warm and personal celebration moment.', 'instagram-post-2.jpg', 'Pastel welcome board setup'],
          ['03', 'A colour story in balloons', 'Organic balloon clusters, playful flowers, and layered tones turn a simple backdrop into the centre of the celebration.', 'instagram-post-7.jpg', 'Pink and orange balloon arch decor'],
          ['04', 'Balloon decor with joy', 'Layered balloons, florals, and thoughtful styling give ordinary corners a little more colour, character, and life.', 'instagram-post-4.jpg', 'Balloon decor welcome setup']
        ].map(([number, title, description, image, alt], index) => (
          <article className={`About-story ${index % 2 ? 'About-story-reverse' : ''}`} key={image}>
            <div className="About-story-copy">
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <div className="About-story-image">
              <img src={`/images/${image}`} alt={alt} />
            </div>
          </article>
        ))}
      </section>

      <section className="About-principles">
        <div className="About-principles-heading">
          <span>Our point of view</span>
          <h2>Small details.<br /><em>Big feelings.</em></h2>
        </div>
        <div className="About-principles-grid">
          <article><FiHeart aria-hidden="true" /><h3>Personal, always</h3><p>Every setup starts with your story, your people, and the feeling you want in the room.</p></article>
          <article><FiStar aria-hidden="true" /><h3>Designed with joy</h3><p>We pair playful balloon styling with considered colour, texture, and a little surprise.</p></article>
          <article><span className="About-number">03</span><h3>Made nearby</h3><p>We work exclusively across Delhi NCR, so every celebration gets our full attention.</p></article>
        </div>
      </section>

      <section className="About-social" aria-label="About me and social links">
        <div>
          <span>Come say hello</span>
          <h2>About <em>me.</em></h2>
          <p>Behind every colourful setup is a little care, a lot of joy, and a love for making your moments feel personal.</p>
        </div>
        <div className="About-social-links">
          <a href="https://www.instagram.com/theballoonspace/" target="_blank" rel="noreferrer">
            <FaInstagram aria-hidden="true" />
            <span>Instagram</span>
          </a>
          <a href="https://in.pinterest.com/ganeshrathore518/" target="_blank" rel="noreferrer">
            <FaPinterest aria-hidden="true" />
            <span>Pinterest</span>
          </a>
          <a href="https://www.youtube.com/@Theballoonspace-0" target="_blank" rel="noreferrer">
            <FaYoutube aria-hidden="true" />
            <span>YouTube</span>
          </a>
        </div>
      </section>
    </main>
  )
}

export default About

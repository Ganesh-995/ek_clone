import { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { getApiUrl } from '../utils/api';
import './ManageProducts.css';

export default function ManageProducts() {
  const { products, setProducts, themes, setThemes, heroImages, setHeroImages, hangerCards, setHangerCards, visitorStats } = useProducts();
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(sessionStorage.getItem('ek-admin-token')));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    bulletPoints: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('product');
  const [editingThemeId, setEditingThemeId] = useState(null);
  const [themeFormData, setThemeFormData] = useState({ title: '', detail: '', images: '' });
  const [heroFormData, setHeroFormData] = useState({ images: '' });
  const [hangerFormData, setHangerFormData] = useState({ cards: [] });
  const [activeHangerIndex, setActiveHangerIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [productPage, setProductPage] = useState(1);
  const [themePage, setThemePage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!showForm) return undefined;

    const handleEscape = (event) => {
      if (event.key !== 'Escape') return;
      resetForm();
    };

    document.body.style.overflow = 'hidden';
    // Hide navbar when modal is open
    const navbar = document.querySelector('nav');
    if (navbar) navbar.style.display = 'none';
    
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      // Show navbar when modal closes
      const navbar = document.querySelector('nav');
      if (navbar) navbar.style.display = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showForm]);

  const resetForm = () => {
    setFormData({
      image: '',
      title: '',
      description: '',
      bulletPoints: ''
    });
    setEditingId(null);
    setEditingThemeId(null);
    setThemeFormData({ title: '', detail: '', images: '' });
    setHeroFormData({ images: '' });
    setHangerFormData({ cards: [] });
    setActiveHangerIndex(0);
    setFormType('product');
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThemeInputChange = (e) => {
    const { name, value } = e.target;
    setThemeFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleHeroInputChange = (e) => {
    setHeroFormData({ images: e.target.value });
  };

  const handleHangerInputChange = (index, event) => {
    const { name, value } = event.target;
    setHangerFormData((previous) => ({
      cards: previous.cards.map((card, cardIndex) => cardIndex === index ? { ...card, [name]: value } : card)
    }));
  };

  const createThemeId = (title) => {
    const baseId = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'theme';
    let nextId = baseId;
    let counter = 2;
    while (themes.some((theme) => theme.id === nextId && theme.id !== editingThemeId)) {
      nextId = `${baseId}-${counter}`;
      counter += 1;
    }
    return nextId;
  };

  // Pagination helpers
  const getPaginatedItems = (items, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (totalItems) => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  const paginatedProducts = getPaginatedItems(products, productPage);
  const totalProductPages = getTotalPages(products.length);

  const paginatedThemes = getPaginatedItems(themes, themePage);
  const totalThemePages = getTotalPages(themes.length);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formType === 'hero') {
      const images = heroFormData.images.split('\n').map((image) => image.trim()).filter(Boolean);
      if (images.length === 0 || images.length > 10) {
        setMessage('❌ 1 se 10 hero image URLs zaroori hain!');
        return;
      }

      try {
        await setHeroImages(images);
        setMessage('✅ Hero images update ho gayi!');
        setTimeout(() => setMessage(''), 3000);
        resetForm();
      } catch (error) {
        setMessage(`❌ ${error.message}`);
      }
      return;
    }

    if (formType === 'hanger') {
      const cards = hangerFormData.cards;
      if (cards.length === 0 || cards.length > 20 || cards.some((card) => !card.image.trim() || !card.title.trim())) {
        setMessage('❌ Har hanger card ka image aur title zaroori hai!');
        return;
      }

      try {
        await setHangerCards(cards);
        setMessage('✅ Hanger cards update ho gaye!');
        setTimeout(() => setMessage(''), 3000);
        resetForm();
      } catch (error) {
        setMessage(`❌ ${error.message}`);
      }
      return;
    }

    if (formType === 'theme') {
      const images = themeFormData.images.split('\n').map((image) => image.trim()).filter(Boolean);
      if (!themeFormData.title.trim() || !themeFormData.detail.trim() || images.length === 0 || images.length > 10) {
        setMessage('❌ Theme title, detail aur 1 se 10 image URLs zaroori hain!');
        setTimeout(() => setMessage(''), 3000);
        return;
      }

      const theme = {
        id: editingThemeId || createThemeId(themeFormData.title),
        title: themeFormData.title.trim(),
        detail: themeFormData.detail.trim(),
        images: images.map((image) => ({ image, title: themeFormData.title.trim() }))
      };
      try {
        await setThemes(editingThemeId ? themes.map((item) => item.id === editingThemeId ? theme : item) : [theme, ...themes]);
        setMessage(editingThemeId ? '✅ Theme update ho gaya!' : '✅ Naya theme add ho gaya!');
        setTimeout(() => setMessage(''), 3000);
        resetForm();
      } catch (error) {
        setMessage(`❌ ${error.message}`);
      }
      return;
    }

    // Validation
    if (!formData.image.trim() || !formData.title.trim() || !formData.description.trim()) {
      setMessage('❌ Image, Title aur Description zaroori hain!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    let nextProducts;
    let successMessage;
    if (editingId) {
      // Update existing product
      nextProducts = products.map(p =>
        p.id === editingId
          ? {
              ...p,
              image: formData.image,
              title: formData.title,
              description: formData.description,
              bulletPoints: formData.bulletPoints
                .split('\n')
                .map(point => point.trim())
                .filter(Boolean)
            }
          : p
      );
      successMessage = '✅ Product update ho gaya!';
    } else {
      // Add new product
      const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        image: formData.image,
        title: formData.title,
        description: formData.description,
        bulletPoints: formData.bulletPoints
          .split('\n')
          .map(point => point.trim())
          .filter(Boolean)
      };
      nextProducts = [newProduct, ...products];
      successMessage = '✅ Naya product add ho gaya!';
    }

    try {
      await setProducts(nextProducts);
      setMessage(successMessage);
      setTimeout(() => setMessage(''), 3000);
      resetForm();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      image: product.image || '',
      title: product.title,
      description: product.description || '',
      bulletPoints: (product.bulletPoints || []).join('\n')
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleEditTheme = (theme) => {
    const images = theme.images?.map((item) => typeof item === 'string' ? item : item.image).filter(Boolean)
      || theme.productIds?.map((id) => products.find((product) => product.id === id)?.image).filter(Boolean)
      || [];
    setThemeFormData({ title: theme.title || '', detail: theme.detail || '', images: images.join('\n') });
    setEditingThemeId(theme.id);
    setFormType('theme');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Kya aap confirm karte ho ke delete karna hai?')) {
      try {
        await setProducts(products.filter(p => p.id !== id));
        setMessage('✅ Product delete ho gaya!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage(`❌ ${error.message}`);
      }
    }
  };

  const handleDeleteTheme = async (id) => {
    if (window.confirm('Kya aap confirm karte ho ke theme delete karna hai?')) {
      try {
        await setThemes(themes.filter((theme) => theme.id !== id));
        setMessage('✅ Theme delete ho gaya!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage(`❌ ${error.message}`);
      }
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const response = await fetch(getApiUrl('/api/admin-auth'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Login failed.');
      sessionStorage.setItem('ek-admin-token', result.token);
      setIsAuthenticated(true);
      setPassword('');
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="manage-products-container">
        <div className="manage-header">
          <h1>🔒 Manage Products</h1>
          <p>Admin password required</p>
        </div>
        <form className="admin-login-form" onSubmit={handleLogin}>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus />
          </label>
          {loginError && <p className="message">{loginError}</p>}
          <button className="btn btn-primary" type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? 'Checking...' : 'Unlock products'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="manage-products-container">
      <div className="manage-header">
        <h1>📦 Manage Products</h1>
        <p>Apne products ko update, add, aur delete karein</p>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="manage-buttons">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Close' : '➕ Add New Product'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => { setFormType('theme'); setShowForm(true); }}
        >
          ➕ Add New Theme
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => { setHeroFormData({ images: heroImages.join('\n') }); setFormType('hero'); setShowForm(true); }}
        >
          🖼️ Edit Hero Images
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => { setHangerFormData({ cards: hangerCards.map((card) => ({ ...card })) }); setActiveHangerIndex(0); setFormType('hanger'); setShowForm(true); }}
        >
          ✏️ Edit Hanger Cards
        </button>
      </div>

      <div className="visitor-counter" aria-label="Website visitor statistics">
        <div>
          <span className="visitor-counter-label">Live now</span>
          <strong>{visitorStats.live.toLocaleString()}</strong>
        </div>
        <div>
          <span className="visitor-counter-label">Today</span>
          <strong>{visitorStats.today.toLocaleString()}</strong>
        </div>
        <div>
          <span className="visitor-counter-label">Total</span>
          <strong>{visitorStats.total.toLocaleString()}</strong>
        </div>
      </div>

      {showForm && (
        <div className="modal-backdrop" onClick={(e) => e.stopPropagation()}>
          <div className="form-container" role="dialog" aria-modal="true" aria-labelledby="product-form-title">
            <div className="modal-header">
              <h2 id="product-form-title">{formType === 'hero' ? '🖼️ Edit Hero Images' : (formType === 'hanger' ? '✏️ Edit Hanger Cards' : (formType === 'theme' ? (editingThemeId ? '✏️ Edit Theme' : '🆕 Add New Theme') : (editingId ? '✏️ Edit Product' : '🆕 Add New Product')))}</h2>
              <button type="button" className="modal-close" onClick={resetForm} aria-label="Close form">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
            {formType === 'hero' ? (
              <div className="form-group">
                <label>🖼️ Hero Image URLs (har line me ek, maximum 10)</label>
                <textarea name="images" value={heroFormData.images} onChange={handleHeroInputChange} placeholder="https://example.com/hero-image.jpg" rows="8" required />
              </div>
            ) : formType === 'hanger' ? (
              <div className="hanger-card-editor">
                <div className="form-group">
                  <label>🔢 Card Number</label>
                  <select value={activeHangerIndex} onChange={(event) => setActiveHangerIndex(Number(event.target.value))}>
                    {hangerFormData.cards.map((card, index) => (
                      <option key={index} value={index}>{index + 1} — {card.title || 'Untitled'}</option>
                    ))}
                  </select>
                </div>
                {hangerFormData.cards[activeHangerIndex] && (
                  <fieldset className="hanger-card-fields">
                    <legend>Hanger Card {activeHangerIndex + 1}</legend>
                    <div className="form-group">
                      <label>🖼️ Image URL</label>
                      <input type="url" name="image" value={hangerFormData.cards[activeHangerIndex].image} onChange={(event) => handleHangerInputChange(activeHangerIndex, event)} required />
                    </div>
                    <div className="form-group">
                      <label>📝 Title</label>
                      <input type="text" name="title" value={hangerFormData.cards[activeHangerIndex].title} onChange={(event) => handleHangerInputChange(activeHangerIndex, event)} required />
                    </div>
                    <div className="form-group">
                      <label>📄 Description</label>
                      <textarea name="description" value={hangerFormData.cards[activeHangerIndex].description} onChange={(event) => handleHangerInputChange(activeHangerIndex, event)} rows="2" required />
                    </div>
                  </fieldset>
                )}
              </div>
            ) : formType === 'theme' ? (
              <>
                <div className="form-group">
                  <label>🎨 Theme Title *</label>
                  <input type="text" name="title" value={themeFormData.title} onChange={handleThemeInputChange} placeholder="Theme ka naam" required />
                </div>
                <div className="form-group">
                  <label>📄 Theme Description *</label>
                  <textarea name="detail" value={themeFormData.detail} onChange={handleThemeInputChange} placeholder="Theme ke baare mein likhein" rows="4" required />
                </div>
                <div className="form-group">
                  <label>🖼️ Theme Image URLs * (har line me ek, maximum 10)</label>
                  <textarea name="images" value={themeFormData.images} onChange={handleThemeInputChange} placeholder="https://example.com/theme-image-1.jpg" rows="8" required />
                </div>
              </>
            ) : (
              <>
            <div className="form-group">
              <label>🖼️ Image URL *</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/product-image.jpg"
                required
              />
            </div>

            <div className="form-group">
              <label>📝 Product Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Product ka naam"
                required
              />
            </div>
            <div className="form-group">
              <label>📄 Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product ke baare mein likhein"
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>• Bullet Points</label>
              <textarea
                name="bulletPoints"
                value={formData.bulletPoints}
                onChange={handleInputChange}
                placeholder="Har bullet point alag line mein likhein"
                rows="5"
              />
            </div>

              </>
            )}

            <div className="form-buttons">
              <button type="submit" className="btn btn-success">
                {formType === 'hero' ? '💾 Update Hero Images' : (formType === 'hanger' ? '💾 Update Hanger Cards' : (formType === 'theme' ? (editingThemeId ? '💾 Update Theme' : '✅ Add Theme') : (editingId ? '💾 Update' : '✅ Add')))}
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={resetForm}
              >
                ❌ Cancel
              </button>
            </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-list">
        <h2>📋 All Products ({products.length})</h2>
        <div className="products-grid">
          {paginatedProducts.map(product => (
            <div key={product.id} className="product-item">
              <div className="product-image">
                <img src={product.image} alt={product.title} loading="lazy" decoding="async" />
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <p>{product.description || 'Description add nahi ki gayi.'}</p>
                {product.bulletPoints?.length > 0 && (
                  <ul>
                    {product.bulletPoints.slice(0, 2).map(point => <li key={point}>{point}</li>)}
                  </ul>
                )}
              </div>
              <div className="product-actions">
                <button
                  className="btn btn-edit"
                  onClick={() => handleEdit(product)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(product.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {totalProductPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-secondary btn-pagination"
              onClick={() => setProductPage(prev => Math.max(prev - 1, 1))}
              disabled={productPage === 1}
            >
              ← Previous
            </button>
            <span className="pagination-info">Page {productPage} of {totalProductPages}</span>
            <button
              className="btn btn-secondary btn-pagination"
              onClick={() => setProductPage(prev => Math.min(prev + 1, totalProductPages))}
              disabled={productPage === totalProductPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <div className="products-list themes-list">
        <h2>🎨 All Themes ({themes.length})</h2>
        <div className="products-grid">
          {paginatedThemes.map((theme) => {
            const images = theme.images?.map((item) => typeof item === 'string' ? item : item.image).filter(Boolean)
              || theme.productIds?.map((id) => products.find((product) => product.id === id)?.image).filter(Boolean)
              || [];
            return (
              <div key={theme.id} className="product-item theme-item">
                <div className="theme-image-strip">
                  {images.slice(0, 4).map((image, imageIndex) => <img key={`${image}-${imageIndex}`} src={image} alt="" loading="lazy" decoding="async" />)}
                </div>
                <div className="product-details">
                  <h3>{theme.title}</h3>
                  <p>{theme.detail}</p>
                  <span className="theme-image-count">{images.length} image{images.length === 1 ? '' : 's'}</span>
                </div>
                <div className="product-actions">
                  <button className="btn btn-edit" onClick={() => handleEditTheme(theme)}>✏️ Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDeleteTheme(theme.id)}>🗑️ Delete</button>
                </div>
              </div>
            );
          })}
        </div>
        {totalThemePages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-secondary btn-pagination"
              onClick={() => setThemePage(prev => Math.max(prev - 1, 1))}
              disabled={themePage === 1}
            >
              ← Previous
            </button>
            <span className="pagination-info">Page {themePage} of {totalThemePages}</span>
            <button
              className="btn btn-secondary btn-pagination"
              onClick={() => setThemePage(prev => Math.min(prev + 1, totalThemePages))}
              disabled={themePage === totalThemePages}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <div className="info-box">
        <h3>ℹ️ Important Notes:</h3>
        <ul>
          <li>Bullet points ko alag-alag lines mein likhein</li>
        </ul>
      </div>
    </div>
  );
}

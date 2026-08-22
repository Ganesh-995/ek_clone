import { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import './ManageProducts.css';

export default function ManageProducts() {
  const { products, setProducts, visitorStats } = useProducts();
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
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) return undefined;

    const handleEscape = (event) => {
      if (event.key !== 'Escape') return;
      resetForm();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
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
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.image.trim() || !formData.title.trim() || !formData.description.trim()) {
      setMessage('❌ Image, Title aur Description zaroori hain!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (editingId) {
      // Update existing product
      const updatedProducts = products.map(p =>
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
      setProducts(updatedProducts);
      setMessage('✅ Product update ho gaya!');
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
      setProducts([...products, newProduct]);
      setMessage('✅ Naya product add ho gaya!');
    }

    setTimeout(() => setMessage(''), 3000);
    resetForm();
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

  const handleDelete = (id) => {
    if (window.confirm('Kya aap confirm karte ho ke delete karna hai?')) {
      setProducts(products.filter(p => p.id !== id));
      setMessage('✅ Product delete ho gaya!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const response = await fetch('/api/admin-auth', {
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
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) resetForm();
        }}>
          <div className="form-container" role="dialog" aria-modal="true" aria-labelledby="product-form-title">
            <div className="modal-header">
              <h2 id="product-form-title">{editingId ? '✏️ Edit Product' : '🆕 Add New Product'}</h2>
              <button type="button" className="modal-close" onClick={resetForm} aria-label="Close form">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
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

            <div className="form-buttons">
              <button type="submit" className="btn btn-success">
                {editingId ? '💾 Update' : '✅ Add'}
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
          {products.map(product => (
            <div key={product.id} className="product-item">
              <div className="product-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <p>{product.description || 'Description add nahi ki gayi.'}</p>
                {product.bulletPoints?.length > 0 && (
                  <ul>
                    {product.bulletPoints.map(point => <li key={point}>{point}</li>)}
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

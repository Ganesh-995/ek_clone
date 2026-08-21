import { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import './ManageProducts.css';

export default function ManageProducts() {
  const { products, setProducts, carouselImages, setCarouselImages } = useProducts();
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    bulletPoints: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [carouselEditingId, setCarouselEditingId] = useState(null);
  const [showCarouselForm, setShowCarouselForm] = useState(false);
  const [carouselImage, setCarouselImage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm && !showCarouselForm) return undefined;

    const handleEscape = (event) => {
      if (event.key !== 'Escape') return;
      if (showCarouselForm) closeCarouselForm();
      else resetForm();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showForm, showCarouselForm]);

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

  const closeCarouselForm = () => {
    setCarouselEditingId(null);
    setCarouselImage('');
    setShowCarouselForm(false);
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

  const handleCarouselEdit = (carouselItem) => {
    setCarouselEditingId(carouselItem.id);
    setCarouselImage(carouselItem.image || '');
    setShowCarouselForm(true);
  };

  const handleCarouselSave = (event) => {
    event.preventDefault();
    if (!carouselImage.trim()) return;

    if (carouselEditingId) {
      setCarouselImages(carouselImages.map(item =>
        item.id === carouselEditingId ? { ...item, image: carouselImage.trim() } : item
      ));
    } else {
      setCarouselImages([
        ...carouselImages,
        { id: `carousel-${Date.now()}`, image: carouselImage.trim() }
      ]);
    }
    setMessage('✅ Carousel image update ho gayi!');
    setTimeout(() => setMessage(''), 3000);
    closeCarouselForm();
  };

  const handleAddCarousel = () => {
    setCarouselEditingId(null);
    setCarouselImage('');
    setShowCarouselForm(true);
  };

  const handleDeleteCarousel = (id) => {
    if (window.confirm('Kya aap is carousel image ko delete karna chahte ho?')) {
      setCarouselImages(carouselImages.filter(item => item.id !== id));
      setMessage('✅ Carousel image delete ho gayi!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Kya aap confirm karte ho ke delete karna hai?')) {
      setProducts(products.filter(p => p.id !== id));
      setMessage('✅ Product delete ho gaya!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

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

      <section className="carousel-manager">
        <div className="carousel-manager-heading">
          <div>
            <span className="carousel-manager-kicker">Separate collection</span>
            <h2>Manage Carousel Images ({carouselImages.length})</h2>
          </div>
          <button className="btn btn-primary" onClick={handleAddCarousel}>
            ➕ Add Carousel Image
          </button>
        </div>
        <div className="carousel-manager-grid">
          {carouselImages.map((carouselItem) => (
            <div className="carousel-manager-item" key={carouselItem.id}>
              <img src={carouselItem.image} alt="Carousel graphic" />
              <div className="carousel-manager-actions">
                <button className="btn btn-edit" onClick={() => handleCarouselEdit(carouselItem)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-delete" onClick={() => handleDeleteCarousel(carouselItem.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showCarouselForm && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeCarouselForm();
        }}>
          <div className="form-container carousel-form-container" role="dialog" aria-modal="true" aria-labelledby="carousel-form-title">
            <div className="modal-header">
              <h2 id="carousel-form-title">🎞️ Change Carousel Image</h2>
              <button type="button" className="modal-close" onClick={closeCarouselForm} aria-label="Close carousel image form">
                ×
              </button>
            </div>
            <form onSubmit={handleCarouselSave}>
              <div className="form-group">
                <label>Graphic Image URL *</label>
                <input
                  type="url"
                  value={carouselImage}
                  onChange={(event) => setCarouselImage(event.target.value)}
                  placeholder="https://example.com/carousel-graphic.jpg"
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn btn-success">💾 Save Image</button>
                <button type="button" className="btn btn-cancel" onClick={closeCarouselForm}>❌ Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="info-box">
        <h3>ℹ️ Important Notes:</h3>
        <ul>
          <li>Bullet points ko alag-alag lines mein likhein</li>
        </ul>
      </div>
    </div>
  );
}

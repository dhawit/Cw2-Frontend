import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProductsApi } from '../apis/api';
import '../styles/products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    getAllProductsApi()
      .then((res) => {
        if (res.data && res.data.products) {
          setProducts(res.data.products);
        } else {
          console.error('No products found in response');
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };

  const handleCardClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <div className="products-page">
      <div className="section">
        <h2 className="section-title">Featured Products</h2>
        <div className="products-grid">
          {products
            .filter((product) => product.productCategory === 'featured')
            .map((product) => (
              <div key={product._id} className="product-card" onClick={() => handleCardClick(product._id)}>
                <img src={product.productImageUrl} alt={product.productName} className="product-image" />
                <div className="product-details">
                  <h3 className="product-name">{product.productName}</h3>
                  <p className="product-price">NPR {product.productPrice}</p>
                  <p className="product-description">{product.productDescription}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">Popular Products</h2>
        <div className="products-grid">
          {products
            .filter((product) => product.productCategory === 'popular')
            .map((product) => (
              <div key={product._id} className="product-card" onClick={() => handleCardClick(product._id)}>
                <img src={product.productImageUrl} alt={product.productName} className="product-image" />
                <div className="product-details">
                  <h3 className="product-name">{product.productName}</h3>
                  <p className="product-price">NPR {product.productPrice}</p>
                  <p className="product-description">{product.productDescription}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

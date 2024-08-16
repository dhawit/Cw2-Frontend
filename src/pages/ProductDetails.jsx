import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSingleProductApi } from "../apis/api";
import "../styles/productDetails.css";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // Check if user is logged in
    if (!token || !user) {
      toast.error("Please log in or register to continue", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      navigate('/login?error=true');
    } else {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = () => {
    getSingleProductApi(productId)
      .then((res) => {
        if (res.data.success) {
          setProductDetails(res.data.product);
        } else {
          console.error("Error fetching product details:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="product-details">
        <img src={productDetails.productImageUrl} alt={productDetails.productName} />
        <div className="product-info">
          <h2>Product Details</h2>
          <h3>{productDetails.productName}</h3>
          <p>Price: NPR {productDetails.productPrice}</p>
          <p>Description: {productDetails.productDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

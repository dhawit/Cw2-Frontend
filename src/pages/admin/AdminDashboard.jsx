import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createProductApi,
  deleteProductApi,
  getAllProductsApi,
} from "../../apis/api";
import '../../styles/admin.css';


const AdminDashboard = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products"));
    if (savedProducts && savedProducts.length > 0) {
      setProducts(savedProducts);
    } else {
      // Fetch products from API if not found in localStorage
      fetchProducts();
    }
  }, []);

  const fetchProducts = () => {
    getAllProductsApi()
      .then((res) => {
        if (res.data && res.data.products) {
          setProducts(res.data.products);
          localStorage.setItem("products", JSON.stringify(res.data.products));
        } else {
          toast.error("No products found");
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
    setProductImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productPrice", productPrice);
    formData.append("productDescription", productDescription);
    formData.append("productCategory", productCategory);
    formData.append("productImage", productImage);

    createProductApi(formData)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          setProductName("");
          setProductPrice("");
          setProductDescription("");
          setProductCategory("");
          setProductImage(null);
          setPreviewImage(null);
          // Update state with new product and save to localStorage
          const updatedProducts = [...products, res.data.product];
          setProducts(updatedProducts);
          localStorage.setItem("products", JSON.stringify(updatedProducts));
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Internal Server Error!");
      });
  };

  const handleDelete = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) {
      return;
    }
    deleteProductApi(id)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          const updatedProducts = products.filter((product) => product._id !== id);
          setProducts(updatedProducts);
          localStorage.setItem("products", JSON.stringify(updatedProducts));
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      });
  };

  return (
    <>
     <div className="dashboard-container">
      <div className="m-4">
        <div className="d-flex justify-content-between">
          <h1>Admin Dashboard</h1>
          <button
            type="button"
            className="btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Add Product
          </button>
        </div>

        <button
            type="button"
            className="btn btn-primary"
            
          >
            <Link to="/admin/audit-trails" style={{ color: 'white', textDecoration: 'none' }}>
              Audit Trail
            </Link>
          </button>
        <div
  className="modal fade"
  id="exampleModal"
  tabIndex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog" style={{ maxWidth: "90%", maxHeight: "90%" }}>
    <div className="modal-content" style={{ height: "100%" }}>
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">
          Create a New Product!
        </h1>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body" style={{ overflowY: "auto", maxHeight: "calc(100% - 130px)" }}>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Product Name</label>
              <input
                onChange={(e) => setProductName(e.target.value)}
                className="form-control"
                type="text"
                placeholder="Enter product name"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Price</label>
              <input
                onChange={(e) => setProductPrice(e.target.value)}
                type="number"
                className="form-control"
                placeholder="Enter price"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mb-3">
              <label>Product Description</label>
              <textarea
                onChange={(e) => setProductDescription(e.target.value)}
                className="form-control"
                placeholder="Enter description"
                rows="4"
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Select Category</label>
              <select
                onChange={(e) => setProductCategory(e.target.value)}
                className="form-control"
              >
                <option value="">Select Category</option>
                <option value="featured">Featured</option>
                <option value="popular">Popular Products</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label>Product Image</label>
              <input
                onChange={handleImageUpload}
                type="file"
                className="form-control"
              />
            </div>
          </div>
          {previewImage && (
            <div className="row">
              <div className="col-md-12 text-center">
                <img
                  src={previewImage}
                  className="img-fluid rounded object-cover mt-2"
                  alt="Preview"
                  style={{ maxHeight: "200px", maxWidth: "100%" }}
                />
              </div>
            </div>
          )}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

        <table className="table mt-2">
          <thead className="table-dark">
            <tr>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Product Category</th>
              <th>Product Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={item.productImageUrl}
                      height={40}
                      width={40}
                      alt="Product"
                    />
                  </td>
                  <td>{item.productName}</td>
                  <td>NPR.{item.productPrice}</td>
                  <td>{item.productCategory}</td>
                  <td>{item.productDescription.slice(0, 10)}</td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <Link
                        to={`/admin/edit/${item._id}`}
                        className="btn btn-success"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
};

export default AdminDashboard;

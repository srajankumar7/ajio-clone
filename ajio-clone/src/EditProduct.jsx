import React from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom' 
import "./App.css"
function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const handleUpdate = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const price = e.target.price.value;
        const quantity = e.target.quantity.value;
        const category = e.target.category.value;
        const image = e.target.image.files[0];
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("category", category);

        if (image) {
            formData.append("image", image);
        }
        axios.put(`https://ajio-clone-1v00.onrender.com/update-product/${id}`, formData)
            .then(() => {
                alert("Product updated successfully");
                navigate("/manage-products");
            })
            .catch(err => console.error(err));
    };

  return (
      <div className="edit-container">
          <h1>Edit Product</h1>
          <form onSubmit={handleUpdate}>
              <label>Product Name:</label>
              <input type="text" name="name" required />
              <br/>
              <label>Price:</label>
              <input type="number" name="price" required />
              <br/>
              <label>Quantity:</label>
              <input type="number" name="quantity" required />
              <br/>
              <label>Category:</label>
              <select name="category" required>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Beauty">Beauty</option>
              </select>
              <br/>
              <label>Image:</label>
              <input type="file" name="image" />
              <button type="submit">Update Product</button>
          </form>
      </div>
  )
}

export default EditProduct;

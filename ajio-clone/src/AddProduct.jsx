import "./App.css";
import axios from "axios";
function AddProduct() {
    const handleSubmit=(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", e.target.name.value);
        formData.append("price", e.target.price.value);
        formData.append("quantity", e.target.quantity.value);
        formData.append("category", e.target.category.value);
        formData.append("image", e.target.image.files[0]);
        axios.post("https://ajio-clone-1v00.onrender.com/add-product", formData)
        .then(() => {
            alert("Product added successfully");
        })
        .catch((err) => {
            console.error(err);
            alert("Error adding product");
        });
    };
  return (
    <div className="add-product-container">
      <h1 className="product-title">Add New Product</h1>
      <form className="product-form" onSubmit={handleSubmit}>
              <label>Product Name:</label>
              <input type="text" placeholder="Enter product name" name="name" />
              <br />
              <label>Price:</label>   
              <input type="number" placeholder="Enter price" name="price" />
              <br />
              <label>Quantity</label>
              <input type="number" placeholder="Enter quantity" name="quantity" />
              <br />
              <label>Category:</label>
              <select name="category" >
                  <option value="">Select category</option> 
                  <option>Men</option>
                  <option>Women</option>
                  <option>Kids</option>
                  <option>Beauty</option>
              </select>
              <br />
              <label>Image URL:</label>
              <input type="file" placeholder="Upload image"name="image" />
              <br />
              <button type="submit">Add Product</button>
      </form>  
    </div>
  );
}

export default AddProduct;
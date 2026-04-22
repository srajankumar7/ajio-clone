import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ManageProduct() {
    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        axios.get("https://ajio-clone-1v00.onrender.com/products")
            .then((res) => {
                setProducts(res.data);  
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);
    const handleDelete = (id) => {
        axios.delete("https://ajio-clone-1v00.onrender.com/products/"+id)
            .then(res => { console.log(res)
        window.location.reload(); })
        .catch(err => console.error(err));
}  
    return (
        <div className="manage-container">
            <h1>Manage Product</h1>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.category}</td>
                            <td>
                                <img src={product.image} alt={product.name} width={"100"} /></td>
                            <td>
                                <Link to={`/edit-product/${product._id}`}><button>Edit</button></Link>
                                <button onClick={() => handleDelete(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default ManageProduct;
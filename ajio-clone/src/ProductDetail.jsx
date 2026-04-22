import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ProductDetails({userId}) {
    const { id } = useParams()
    const [product, setProducts] = useState(null);
    useEffect(() => {
        axios.get(`https://ajio-clone-1v00.onrender.com/products/${id}`)
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);


    const handleAddToCart = () => {
        if (!userId) {
            alert("Please login to add to cart");
            return;
        }
        axios.post("https://ajio-clone-1v00.onrender.com/cart", {
            userId,
            name: product.name,
            price: product.price,
            image: product.image,
        
        })
            .then(() => alert("Added to Cart"))
            .catch(err => console.log(err));
        
  };
if (!product) return <h2>Loading</h2>

    return (
        <div className="details-container">
            <div className="details-left">
                <img src={`https://ajio-clone-1v00.onrender.com/images/${product.image}`} alt={product.name}  />
            </div>
            <div className="details-right">
                <h2>{product.name}</h2>
                <h3>{product.price}</h3>
                <button className="cart-btn" onClick={handleAddToCart}>ADD TO CART</button>
            </div>
        </div>
    );
}
export default ProductDetails;
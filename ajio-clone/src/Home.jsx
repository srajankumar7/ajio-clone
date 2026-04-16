import React, { useEffect,useState } from "react";
import CarouselComponent from "./Carousel";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

function Home() {
  const [products, setProduct] = useState([]);
  const navigate = useNavigate();
  useEffect(() =>{
    axios.get("https://ajio-clone-1v00.onrender.com/products")
            .then((res) => {
                setProduct(res.data);  
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

  return (
    <div>
      <h1 style={{textAlign: "center"}}>Home page</h1>
      <br /> 
      <br /> 
      <h2>Products</h2>
      <div className="product-container">
      {products.length > 0 ? (
      products.map((product) => (
      <div className="product-card" key={product._id}>
      <img src={`https://ajio-clone-1v00.onrender.com/images/${product.image}`} alt={product.name} width={"50"} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <button onClick={() => navigate(`/product/${product._id}`)}>Quick View</button>
    </div>
  ))
    ) : (
          <p>No products found</p>
        )}
        
      </div>
      <br /> 
    <CarouselComponent />



    </div>
  );
}

export default Home;

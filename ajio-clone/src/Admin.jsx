import { useNavigate } from "react-router-dom"; 
function Admin() {
    const navigate = useNavigate();
    const handlelogout = () => {
        localStorage.removeItem("role");
        navigate("/");
        window.location.reload();
    }
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <div className="admin-navbar">
                <h1 className="admin-logo">Admin Dashboard</h1>
                <div className="admin-menu">
                <button onClick={() => navigate("/add-product")}>Add New Product</button>
                <button onClick={() => navigate("/manage-products")}>Manage Products</button>
                <button onClick={() => navigate("/manage-users")}>Manage Users</button>
                    <button onClick={() => navigate("/manage-orders")}>View Orders</button>      
                </div>
                <button className="admin-logout" onClick={handlelogout}>Logout</button> 
            </div>
        </div>
    );
}  
export default Admin;
import { useEffect, useState } from "react";
import axios from "axios";


function ManageUser() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get("https://ajio-clone-1v00.onrender.com/users")
            .then((res) => setUsers(res.data))
            .catch((err) => console.log(err));
    }, []);
    const handleDelete = (id) => {
        axios.delete(`https://ajio-clone-1v00.onrender.com/users/${id}`)
            .then(() => {
                alert("User deleted");
                setUsers(users.filter(user => user._id !== id));
            })
        .catch((err) => console.log(err));
    };
        
    return (
        <div className="mnguser-container">
            <h2>Manage Users</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Mobile</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.mobile || "N/A"}</td>
                            <td>    
                                <button className="dlt-btn" onClick={() => handleDelete(user._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> 
        </div>
    );
}

export default ManageUser;
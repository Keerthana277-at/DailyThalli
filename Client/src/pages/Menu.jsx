import { useEffect, useState } from "react";

function Menu() {

    const [menuItems, setMenuItems] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [available, setAvailable] = useState(true);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {

        const token = localStorage.getItem("token");

        fetch("http://localhost:5001/api/menu", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Menu:", data);
                setMenuItems(data.menuItems);
            })
            .catch((error) => {
                console.log("Error:", error);
            });

    }, []);

const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
        let response;

        if (editingId) {
            // UPDATE
            response = await fetch(
                `http://localhost:5001/api/menu/${editingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        price: Number(price),
                        category,
                        available
                    })
                }
            );
        } else {
            // CREATE
            response = await fetch(
                "http://localhost:5001/api/menu",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        price: Number(price),
                        category,
                        available
                    })
                }
            );
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to save menu item"
            );
        }

        console.log("Menu item saved:", data);

        if (editingId) {
            // Replace the old item with updated item
            setMenuItems((prevItems) =>
                prevItems.map((item) =>
                    item._id === editingId
                        ? data.menuItem
                        : item
                )
            );
        } else {
            // Add newly created item
            setMenuItems((prevItems) => [
                data.menuItem,
                ...prevItems
            ]);
        }

        // Reset form
        setEditingId(null);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setAvailable(true);

    } catch (error) {
        console.log("Menu save error:", error);
    }
};

const handleEdit = (item) => {
    setEditingId(item._id);

    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setCategory(item.category);
    setAvailable(item.available);
};

const handleDelete = async (menuId) => {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            `http://localhost:5001/api/menu/${menuId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to delete menu item"
            );
        }

        console.log("Menu item deleted:", data);

        setMenuItems((prevItems) =>
            prevItems.filter(
                (item) => item._id !== menuId
            )
        );

    } catch (error) {
        console.log("Delete menu error:", error);
    }
};


return (
 <>

 <form onSubmit={handleSubmit}>

            <div>
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter menu name"
                    required
                />
            </div>

            <div>
                <label>Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    required
                />
            </div>

            <div>
                <label>Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    required
                />
            </div>

            <div>
                <label>Category</label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter category"
                    required
                />
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={available}
                        onChange={(e) => setAvailable(e.target.checked)}
                    />
                    Available
                </label>
            </div>

            <button type="submit">
                {editingId ? "Update Menu Item" : "Add Menu Item"}
            </button>

    </form>

        <div>

            <h1>Menu</h1>

            {menuItems.map((item) => (
                <div key={item._id}>

                    <h3>{item.name}</h3>

                    <p>Description: {item.description}</p>

                    <p>Price: ₹{item.price}</p>

                    <p>Category: {item.category}</p>

                    <p>
                        Available: {item.available ? "Yes" : "No"}
                    </p>

                     <button onClick={() => handleEdit(item)}>
                        Edit
                    </button>

                     <button onClick={() => handleDelete(item._id)}>
                            Delete
                    </button>

                </div>
            ))}

        </div>
 </>
    );
}

export default Menu;
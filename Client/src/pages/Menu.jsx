import { useEffect, useState } from "react";
import { UtensilsCrossed, Plus, Pencil, Trash2, X, Leaf } from "lucide-react";
import "./Menu.css";

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [available, setAvailable] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchMenuItems = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5001/api/menu", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load menu items");
            }

            setMenuItems(data.menuItems || []);
        } catch (error) {
            setError(error.message || "Unable to load menu items");
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setAvailable(true);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");
        const isEditing = Boolean(editingId);

        try {
            const response = await fetch(
                isEditing
                    ? `http://localhost:5001/api/menu/${editingId}`
                    : "http://localhost:5001/api/menu",
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        description: description.trim(),
                        price: Number(price),
                        category: category.trim(),
                        available
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save menu item");
            }

            if (isEditing) {
                setMenuItems((prevItems) =>
                    prevItems.map((item) =>
                        item._id === editingId ? data.menuItem : item
                    )
                );
            } else {
                setMenuItems((prevItems) => [
                    data.menuItem,
                    ...prevItems
                ]);
            }

            resetForm();
        } catch (error) {
            setError(error.message || "Unable to save menu item");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setName(item.name || "");
        setDescription(item.description || "");
        setPrice(String(item.price ?? ""));
        setCategory(item.category || "");
        setAvailable(item.available);
        setError("");

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (menuId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this menu item?"
        );

        if (!confirmed) return;

        setError("");
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
                throw new Error(data.message || "Failed to delete menu item");
            }

            setMenuItems((prevItems) =>
                prevItems.filter((item) => item._id !== menuId)
            );

            if (editingId === menuId) {
                resetForm();
            }
        } catch (error) {
            setError(error.message || "Unable to delete menu item");
        }
    };

    return (
        <div className="menu-page">
            <header className="menu-page-header">
                <div>
                    <h1>Menu Management</h1>
                    <p>Manage your dishes, prices, and availability.</p>
                </div>

                <div className="menu-count">
                    <UtensilsCrossed size={16} />
                    {" "}{menuItems.length} Menu Items
                </div>
            </header>

            <div className="menu-layout">
                <section className="menu-form-panel">
                    <div className="menu-panel-heading">
                        <div className="menu-panel-icon">
                            {editingId ? <Pencil size={21} /> : <Plus size={22} />}
                        </div>

                        <div>
                            <h2>{editingId ? "Edit Menu Item" : "Add New Item"}</h2>
                            <p>
                                {editingId
                                    ? "Update your dish details"
                                    : "Add a delicious item to your menu"}
                            </p>
                        </div>
                    </div>

                    {error && (
                        <p className="menu-error-message" role="alert">
                            {error}
                        </p>
                    )}

                    <form className="menu-form" onSubmit={handleSubmit}>
                        <div className="menu-field">
                            <label htmlFor="menu-name">Item Name</label>
                            <input
                                id="menu-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Vegetable Meals"
                                required
                            />
                        </div>

                        <div className="menu-field">
                            <label htmlFor="menu-description">Description</label>
                            <textarea
                                id="menu-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your dish..."
                                required
                            />
                        </div>

                        <div className="menu-field">
                            <label htmlFor="menu-price">Price (₹)</label>
                            <input
                                id="menu-price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Enter price"
                                required
                            />
                        </div>

                        <div className="menu-field">
                            <label htmlFor="menu-category">Category</label>
                            <input
                                id="menu-category"
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Breakfast, Lunch"
                                required
                            />
                        </div>

                        <label className="menu-available-toggle">
                            <input
                                type="checkbox"
                                checked={available}
                                onChange={(e) => setAvailable(e.target.checked)}
                            />
                            Available for customers
                        </label>

                        <div className="menu-form-actions">
                            <button
                                className="menu-primary-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    "Saving..."
                                ) : editingId ? (
                                    <>
                                        <Pencil size={16} />
                                        Update Item
                                    </>
                                ) : (
                                    <>
                                        <Plus size={17} />
                                        Add Menu Item
                                    </>
                                )}
                            </button>

                            {editingId && (
                                <button
                                    className="menu-secondary-button"
                                    type="button"
                                    onClick={resetForm}
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="menu-list-panel">
                    <div className="menu-list-heading">
                        <div>
                            <h2>Your Menu Items</h2>
                            <p>All your dishes in one place.</p>
                        </div>
                    </div>

                    {error && (
                        <p className="menu-error-message" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="menu-items-grid">
                        {menuItems.length === 0 ? (
                            <div className="menu-empty-state">
                                <UtensilsCrossed size={32} />
                                <h3>Your menu is empty</h3>
                                <p>Add your first menu item using the form.</p>
                            </div>
                        ) : (
                            menuItems.map((item) => (
                                <article className="menu-item-card" key={item._id}>
                                    <div className="menu-item-top">
                                        <div>
                                            <h3>{item.name}</h3>
                                            <span className="menu-category">
                                                {item.category}
                                            </span>
                                        </div>

                                        <span
                                            className={`menu-availability ${
                                                item.available
                                                    ? "is-available"
                                                    : "is-unavailable"
                                            }`}
                                        >
                                            {item.available ? "Available" : "Unavailable"}
                                        </span>
                                    </div>

                                    <p className="menu-item-description">
                                        {item.description}
                                    </p>

                                    <div className="menu-item-bottom">
                                        <span className="menu-item-price">
                                            ₹{Number(item.price).toLocaleString("en-IN")}
                                        </span>

                                        <div className="menu-item-actions">
                                            <button
                                                type="button"
                                                className="menu-icon-button menu-edit-button"
                                                onClick={() => handleEdit(item)}
                                                aria-label={`Edit ${item.name}`}
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                className="menu-icon-button menu-delete-button"
                                                onClick={() => handleDelete(item._id)}
                                                aria-label={`Delete ${item.name}`}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Menu;
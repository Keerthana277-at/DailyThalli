
import { useEffect, useState } from "react";
import { Pencil, Trash2, Users, UserPlus, X } from "lucide-react";
import "./Customer.css";
const API = import.meta.env.VITE_API_URL;
function Customers() {
    const [customers, setCustomers] = useState([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [regular, setRegular] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(
                    `${API}/api/customers`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch customers");
                }

                setCustomers(data.customers || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const resetForm = () => {
        setName("");
        setPhone("");
        setDepartment("");
        setRegular(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const token = localStorage.getItem("token");
        const isEditing = Boolean(editingId);

        try {
            const response = await fetch(
                isEditing
                    ? `${API}/api/customers/${editingId}`
                    : `${API}/api/customers`,
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        phone,
                        department,
                        regular
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save customer");
            }

            if (isEditing) {
                setCustomers((prev) =>
                    prev.map((customer) =>
                        customer._id === editingId
                            ? data.customer
                            : customer
                    )
                );
            } else {
                setCustomers((prev) => [
                    data.customer,
                    ...prev
                ]);
            }

            resetForm();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (customer) => {
        setEditingId(customer._id);
        setName(customer.name || "");
        setPhone(customer.phone || "");
        setDepartment(customer.department || "");
        setRegular(Boolean(customer.regular));
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (customerId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmed) return;

        const token = localStorage.getItem("token");
        setError("");

        try {
            const response = await fetch(
                `${API}/api/customers/${customerId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete customer");
            }

            setCustomers((prev) =>
                prev.filter((customer) => customer._id !== customerId)
            );

            if (editingId === customerId) {
                resetForm();
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="customers-page">
            <header className="customers-header">
                <div>
                    <h1>Customers</h1>
                    <p>Manage your customers and keep track of their details.</p>
                </div>
                <span className="customer-badge">
                    <Users size={15} style={{ verticalAlign: "middle" }} />{" "}
                    {customers.length} customers
                </span>
            </header>

            {error && (
                <div className="customer-error" role="alert">
                    {error}
                </div>
            )}

            <div className="customers-layout">
                <section className="customer-panel">
                    <h2>
                        {editingId ? (
                            <><Pencil size={19} /> Edit Customer</>
                        ) : (
                            <><UserPlus size={19} /> Add New Customer</>
                        )}
                    </h2>

                    <form className="customer-form" onSubmit={handleSubmit}>
                        <div className="customer-field">
                            <label htmlFor="customer-name">Full Name</label>
                            <input
                                id="customer-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter customer name"
                                required
                            />
                        </div>

                        <div className="customer-field">
                            <label htmlFor="customer-phone">Phone Number</label>
                            <input
                                id="customer-phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter phone number"
                                required
                            />
                        </div>

                        <div className="customer-field">
                            <label htmlFor="customer-department">Department</label>
                            <input
                                id="customer-department"
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                placeholder="Enter department"
                                required
                            />
                        </div>

                        <label className="customer-regular-label">
                            <input
                                type="checkbox"
                                checked={regular}
                                onChange={(e) => setRegular(e.target.checked)}
                            />
                            Regular customer
                        </label>

                        <div className="customer-form-actions">
                            <button className="customer-btn" type="submit">
                                {editingId ? "Update Customer" : "Add Customer"}
                            </button>

                            {editingId && (
                                <button
                                    className="customer-btn customer-btn-secondary"
                                    type="button"
                                    onClick={resetForm}
                                >
                                    <X size={15} style={{ verticalAlign: "middle" }} /> Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="customer-panel">
                    <h2>Customer List</h2>

                    {loading ? (
                        <p className="customer-empty">Loading customers...</p>
                    ) : customers.length === 0 ? (
                        <p className="customer-empty">
                            No customers yet. Add your first customer using the form.
                        </p>
                    ) : (
                        <div className="customers-list">
                            {customers.map((customer) => (
                                <article className="customer-item" key={customer._id}>
                                    <div className="customer-item-header">
                                        <div>
                                            <h3>{customer.name}</h3>
                                            <span
                                                className={`customer-badge ${
                                                    customer.regular
                                                        ? ""
                                                        : "customer-badge-standard"
                                                }`}
                                            >
                                                {customer.regular
                                                    ? "Regular customer"
                                                    : "Standard customer"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="customer-details">
                                        <div>
                                            <p className="customer-detail-label">Phone</p>
                                            <p className="customer-detail-value">
                                                {customer.phone}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="customer-detail-label">Department</p>
                                            <p className="customer-detail-value">
                                                {customer.department}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="customer-detail-label">Outstanding Due</p>
                                            <p className="customer-detail-value">
                                                ₹{Number(customer.dueAmount || 0).toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="customer-detail-label">Total Orders</p>
                                            <p className="customer-detail-value">
                                                {customer.totalOrders || 0}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="customer-actions">
                                        <button
                                            className="customer-btn"
                                            type="button"
                                            onClick={() => handleEdit(customer)}
                                        >
                                            <Pencil size={15} style={{ verticalAlign: "middle" }} /> Edit
                                        </button>

                                        <button
                                            className="customer-btn customer-delete"
                                            type="button"
                                            onClick={() => handleDelete(customer._id)}
                                        >
                                            <Trash2 size={15} style={{ verticalAlign: "middle" }} /> Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Customers;

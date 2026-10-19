import { useEffect, useState } from "react";
import {
    ShoppingBag,
    Plus,
    Users,
    Trash2,
    ClipboardList
} from "lucide-react";
import "./Orders.css";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    const [customer, setCustomer] = useState("");
    const [menuItem, setMenuItem] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [paidAmount, setPaidAmount] = useState("");

    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [deletingOrderId, setDeletingOrderId] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                };

                const [ordersResponse, customersResponse, menuResponse] =
                    await Promise.all([
                        fetch("http://localhost:5001/api/orders", { headers }),
                        fetch("http://localhost:5001/api/customers", { headers }),
                        fetch("http://localhost:5001/api/menu", { headers })
                    ]);

                const [ordersData, customersData, menuData] = await Promise.all([
                    ordersResponse.json(),
                    customersResponse.json(),
                    menuResponse.json()
                ]);

                if (!ordersResponse.ok) {
                    throw new Error(ordersData.message || "Failed to load orders");
                }

                if (!customersResponse.ok) {
                    throw new Error(customersData.message || "Failed to load customers");
                }

                if (!menuResponse.ok) {
                    throw new Error(menuData.message || "Failed to load menu items");
                }

                setOrders(ordersData.orders || []);
                setCustomers(customersData.customers || []);
                setMenuItems(menuData.menuItems || []);
            } catch (error) {
                setError(error.message || "Unable to load order information");
            }
        };

        fetchData();
    }, []);

    const selectedMenuItem = menuItems.find(
        (item) => item._id === menuItem
    );

    const estimatedTotal =
        (Number(selectedMenuItem?.price) || 0) *
        (Number(quantity) || 0);

    const formatCurrency = (amount) =>
        `₹${(Number(amount) || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2
        })}`;

    const getStatusClass = (status) => {
        switch (status) {
            case "Pending":
                return "status-pending";
            case "Preparing":
                return "status-preparing";
            case "Completed":
                return "status-completed";
            case "Cancelled":
                return "status-cancelled";
            default:
                return "status-pending";
        }
    };

    const getPaymentClass = (status) => {
        if (status === "Paid") return "payment-paid";
        if (status === "Partial") return "payment-partial";
        return "payment-unpaid";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setInfo("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5001/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    customer,
                    items: [
                        {
                            menuItem,
                            quantity: Number(quantity)
                        }
                    ],
                    paidAmount: Number(paidAmount || 0)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create order");
            }

            setOrders((prevOrders) => [
                data.order,
                ...prevOrders
            ]);

            setCustomer("");
            setMenuItem("");
            setQuantity(1);
            setPaidAmount("");
            setInfo("Order created successfully!");
        } catch (error) {
            setError(error.message || "Unable to create order");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        setError("");
        setInfo("");
        setUpdatingOrderId(orderId);

        try {
            const response = await fetch(
                `http://localhost:5001/api/orders/${orderId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        orderStatus: newStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update order status");
            }

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? data.order : order
                )
            );

            setInfo("Order status updated successfully!");
        } catch (error) {
            setError(error.message || "Unable to update order status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const handleDelete = async (orderId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this order? Orders with payment history may not be deletable."
        );

        if (!confirmed) return;

        setError("");
        setInfo("");
        setDeletingOrderId(orderId);

        try {
            const response = await fetch(
                `http://localhost:5001/api/orders/${orderId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete order");
            }

            setOrders((prevOrders) =>
                prevOrders.filter((order) => order._id !== orderId)
            );

            setInfo("Order deleted successfully!");
        } catch (error) {
            setError(error.message || "Unable to delete order");
        } finally {
            setDeletingOrderId(null);
        }
    };

    return (
        <div className="orders-page">
            <header className="orders-header">
                <div>
                    <h1>Order Management</h1>
                    <p>Create orders and track their payment and preparation status.</p>
                </div>

                <div className="orders-count">
                    <ShoppingBag size={16} />
                    {" "}{orders.length} Orders
                </div>
            </header>

            <div className="orders-layout">
                <section className="order-form-panel">
                    <div className="orders-panel-heading">
                        <div className="orders-panel-icon">
                            <Plus size={22} />
                        </div>
                        <div>
                            <h2>Create New Order</h2>
                            <p>Enter the order details below.</p>
                        </div>
                    </div>

                    {error && (
                        <p className="orders-error-message" role="alert">
                            {error}
                        </p>
                    )}

                    {info && (
                        <p className="orders-info-message" role="status">
                            {info}
                        </p>
                    )}

                    <form className="order-form" onSubmit={handleSubmit}>
                        <div className="order-field">
                            <label htmlFor="order-customer">Customer</label>
                            <select
                                id="order-customer"
                                value={customer}
                                onChange={(e) => setCustomer(e.target.value)}
                                required
                            >
                                <option value="">Select a customer</option>
                                {customers.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="order-field">
                            <label htmlFor="order-menu-item">Menu Item</label>
                            <select
                                id="order-menu-item"
                                value={menuItem}
                                onChange={(e) => setMenuItem(e.target.value)}
                                required
                            >
                                <option value="">Select a menu item</option>
                                {menuItems
                                    .filter((item) => item.available)
                                    .map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name} — {formatCurrency(item.price)}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="order-field">
                            <label htmlFor="order-quantity">Quantity</label>
                            <input
                                id="order-quantity"
                                type="number"
                                min="1"
                                step="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="order-total-preview">
                            <p>Estimated Order Total</p>
                            <strong>{formatCurrency(estimatedTotal)}</strong>
                        </div>

                        <div className="order-field">
                            <label htmlFor="order-paid-amount">
                                Amount Paid (₹)
                            </label>
                            <input
                                id="order-paid-amount"
                                type="number"
                                min="0"
                                step="0.01"
                                max={estimatedTotal || undefined}
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                                placeholder="Enter amount received"
                            />
                        </div>

                        <button
                            type="submit"
                            className="order-submit-button"
                            disabled={
                                loading ||
                                !customers.length ||
                                !menuItems.some((item) => item.available)
                            }
                        >
                            <Plus size={17} />
                            {loading ? "Creating Order..." : "Create Order"}
                        </button>
                    </form>
                </section>

                <section className="orders-list-panel">
                    <div className="orders-list-heading">
                        <div>
                            <h2>Existing Orders</h2>
                            <p>Manage your customers' orders.</p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="orders-empty-state">
                            <ClipboardList size={34} />
                            <h3>No orders yet</h3>
                            <p>Create your first order using the form.</p>
                        </div>
                    ) : (
                        <div className="orders-cards">
                            {orders.map((order) => (
                                <article className="order-card" key={order._id}>
                                    <div className="order-card-header">
                                        <div className="order-customer">
                                            <div className="order-customer-avatar">
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <h3>
                                                    {order.customer?.name || "Customer"}
                                                </h3>
                                                <span className="order-reference">
                                                    Order #{order._id.slice(-6).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <span
                                            className={`order-status-badge ${getStatusClass(order.orderStatus)}`}
                                        >
                                            {order.orderStatus || "Pending"}
                                        </span>
                                    </div>

                                    <div className="order-amounts">
                                        <div className="order-amount-box total">
                                            <span>Total</span>
                                            <strong>{formatCurrency(order.totalAmount)}</strong>
                                        </div>

                                        <div className="order-amount-box">
                                            <span>Paid</span>
                                            <strong>{formatCurrency(order.paidAmount)}</strong>
                                        </div>

                                        <div className="order-amount-box due">
                                            <span>Due</span>
                                            <strong>{formatCurrency(order.dueAmount)}</strong>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: "14px" }}>
                                        <span
                                            className={`order-payment-badge ${getPaymentClass(order.paymentStatus)}`}
                                        >
                                            {order.paymentStatus || "Unpaid"}
                                        </span>
                                    </div>

                                    <div className="order-card-footer">
                                        <div className="order-status-control">
                                            <label htmlFor={`status-${order._id}`}>
                                                Update Status
                                            </label>
                                            <select
                                                id={`status-${order._id}`}
                                                value={order.orderStatus || "Pending"}
                                                disabled={updatingOrderId === order._id}
                                                onChange={(e) =>
                                                    handleUpdateStatus(order._id, e.target.value)
                                                }
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Preparing">Preparing</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <button
                                            type="button"
                                            className="order-delete-button"
                                            disabled={deletingOrderId === order._id}
                                            onClick={() => handleDelete(order._id)}
                                        >
                                            <Trash2 size={15} />
                                            {deletingOrderId === order._id
                                                ? "Deleting..."
                                                : "Delete"}
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

export default Orders;
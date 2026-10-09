import { useEffect, useState } from "react";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    const [customer, setCustomer] = useState("");
    const [menuItem, setMenuItem] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [paidAmount, setPaidAmount] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");

        fetch("http://localhost:5001/api/orders", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Orders:", data);
                setOrders(data.orders);
            })
            .catch((error) => {
                console.log("Error:", error);
            });

    }, []);

    useEffect(() => {

        const token = localStorage.getItem("token");

        // Fetch customers
        fetch("http://localhost:5001/api/customers", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Customers:", data);
                setCustomers(data.customers);
            })
            .catch((error) => {
                console.log("Customer fetch error:", error);
            });

        // Fetch menu items
        fetch("http://localhost:5001/api/menu", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Menu Items:", data);
                setMenuItems(data.menuItems);
            })
            .catch((error) => {
                console.log("Menu fetch error:", error);
            });

}, []);

const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            "http://localhost:5001/api/orders",
            {
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
                    paidAmount: Number(paidAmount)
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to create order"
            );
        }

        console.log("Order created:", data);

        setOrders((prevOrders) => [
            data.order,
            ...prevOrders
        ]);

        // Reset form
        setCustomer("");
        setMenuItem("");
        setQuantity(1);
        setPaidAmount("");

    } catch (error) {
        console.log("Create order error:", error);
    }
};

const handleUpdateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");

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
            throw new Error(
                data.message || "Failed to update order"
            );
        }

        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order._id === orderId
                    ? data.order
                    : order
            )
        );

        console.log("Order updated:", data);

    } catch (error) {
        console.log("Update order error:", error);
    }
};


const handleDelete = async (orderId) => {
    const token = localStorage.getItem("token");

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
            throw new Error(
                data.message || "Failed to delete order"
            );
        }

        setOrders((prevOrders) =>
            prevOrders.filter(
                (order) => order._id !== orderId
            )
        );

        console.log("Order deleted:", data);

    } catch (error) {
        console.log("Delete order error:", error);
    }
};

return (
    <div>

        <h1>Orders</h1>

        <form onSubmit={handleSubmit}>

            {/* Customer */}
            <div>
                <label>Customer</label>

                <select
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    required
                >
                    <option value="">Select Customer</option>

                    {customers.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>


            {/* Menu Item */}
            <div>
                <label>Menu Item</label>

                <select
                    value={menuItem}
                    onChange={(e) => setMenuItem(e.target.value)}
                    required
                >
                    <option value="">Select Menu Item</option>

                    {menuItems.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name} - ₹{item.price}
                        </option>
                    ))}
                </select>
            </div>


            {/* Quantity */}
            <div>
                <label>Quantity</label>

                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
            </div>


            {/* Paid Amount */}
            <div>
                <label>Paid Amount</label>

                <input
                    type="number"
                    min="0"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    placeholder="Enter paid amount"
                />
            </div>


            <button type="submit">
                Create Order
            </button>

        </form>


        {/* Existing Orders */}
        <div>

            <h2>Existing Orders</h2>

            {orders.map((order) => (
                <div key={order._id}>

                    <h3>
                        Customer: {order.customer.name}
                    </h3>

                    <p>
                        Total Amount: ₹{order.totalAmount}
                    </p>

                    <p>
                        Paid Amount: ₹{order.paidAmount}
                    </p>

                    <p>
                        Due Amount: ₹{order.dueAmount}
                    </p>

                    <p>
                        Payment Status: {order.paymentStatus}
                    </p>

                    <div>
                        <label>Update Status: </label>

                        <select
                            value={order.orderStatus}
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

                    
                    <button onClick={() => handleDelete(order._id)}>
                        Delete
                    </button>

                </div>
            ))}

        </div>

    </div>
);
}

export default Orders;

import { useEffect, useState } from "react";

function Payments() {
    const [payments, setPayments] = useState([]);
    const [orders, setOrders] = useState([]);

    const [order, setOrder] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");

    
useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem("token");

        try {
            const [ordersResponse, paymentsResponse] =
                await Promise.all([
                    fetch("http://localhost:5001/api/orders", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    fetch("http://localhost:5001/api/payments", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                ]);

            const ordersData = await ordersResponse.json();
            const paymentsData = await paymentsResponse.json();

            if (!ordersResponse.ok) {
                throw new Error("Failed to fetch orders");
            }

            if (!paymentsResponse.ok) {
                throw new Error("Failed to fetch payments");
            }
            
            console.log("Orders API response:", ordersData);
            setOrders(ordersData.orders);
            console.log("Orders state data:", ordersData.orders);
            setPayments(paymentsData.payments);

        } catch (error) {
            console.error("Error fetching payment data:", error);
        }
    };

    fetchData();
}, []);



const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            "http://localhost:5001/api/payments",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    order,
                    amount: Number(amount),
                    paymentMethod
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to record payment"
            );
        }

        setPayments((prevPayments) => [
            data.payment,
            ...prevPayments
        ]);

        // Refresh orders to show the updated due amounts
        const ordersResponse = await fetch(
            "http://localhost:5001/api/orders",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const ordersData = await ordersResponse.json();

        if (!ordersResponse.ok) {
            throw new Error("Payment saved, but orders could not refresh");
        }

        setOrders(ordersData.orders);

        setOrder("");
        setAmount("");
        setPaymentMethod("Cash");

        console.log("Payment recorded:", data);

    } catch (error) {
        console.error("Payment error:", error);
        alert(error.message);
    }
};

   
return (
    <div>
        <h1>Payments</h1>

        
            <h2>Record a Payment</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select Order:</label>

                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        required
                    >
                        <option value="">Select an order</option>

                        {orders.map((item) => (
                            <option key={item._id} value={item._id}>
                                {item.customer?.name || "Unknown Customer"}
                                {" - Due: ₹"}
                                {item.dueAmount}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Payment Amount:</label>

                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                    />
                </div>

                <div>
                    <label>Payment Method:</label>

                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                    >
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                    </select>
                </div>

                <button type="submit">Record Payment</button>
            </form>

        <h2>Payment History</h2>

        {payments.length === 0 ? (
            <p>No payments found.</p>
        ) : (
            payments.map((payment) => (
                <div key={payment._id}>
                    <h3>
                        Customer: {payment.customer?.name || "Unknown"}
                    </h3>

                    <p>
                        Order ID: {payment.order?._id || "Unknown"}
                    </p>

                    <p>Amount: ₹{payment.amount}</p>

                    <p>
                        Payment Method: {payment.paymentMethod}
                    </p>

                    <p>
                        Date: {
                            payment.createdAt
                                ? new Date(payment.createdAt).toLocaleDateString()
                                : "Unknown"
                        }
                    </p>

                    <hr />
                </div>
            ))
        )}
    </div>
);
}

export default Payments;

import { useEffect, useState } from "react";
import {
    CreditCard,
    Wallet,
    UserRound,
    CalendarDays,
    ReceiptText,
    Plus,
    IndianRupee,
    History,
    CheckCircle2
} from "lucide-react";
import "./Payments.css";

function Payments() {
    const [payments, setPayments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("token");

    const fetchData = async () => {
        setLoading(true);
        setError("");

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
                throw new Error(
                    ordersData.message || "Failed to fetch orders."
                );
            }

            if (!paymentsResponse.ok) {
                throw new Error(
                    paymentsData.message || "Failed to fetch payments."
                );
            }

            setOrders(ordersData.orders || []);
            setPayments(paymentsData.payments || []);
        } catch (err) {
            setError(err.message || "Unable to load payment data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const selectedOrder = orders.find(
        (item) => item._id === order
    );

    const dueAmount = Number(selectedOrder?.dueAmount || 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!selectedOrder) {
            setError("Please select an order.");
            return;
        }

        const paymentAmount = Number(amount);

        if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
            setError("Enter a valid payment amount.");
            return;
        }

        if (paymentAmount > dueAmount) {
            setError(
                `Payment cannot exceed the outstanding amount of ₹${dueAmount.toLocaleString("en-IN")}.`
            );
            return;
        }

        setSubmitting(true);

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
                        amount: paymentAmount,
                        paymentMethod
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to record payment."
                );
            }

            setPayments((previous) => [
                data.payment,
                ...previous
            ]);

            setSuccess("Payment recorded successfully!");
            setOrder("");
            setAmount("");
            setPaymentMethod("Cash");

            // Refresh outstanding balances after a successful payment.
            const ordersResponse = await fetch(
                "http://localhost:5001/api/orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const ordersData = await ordersResponse.json();

            if (ordersResponse.ok) {
                setOrders(ordersData.orders || []);
            }
        } catch (err) {
            setError(err.message || "Unable to record payment.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (value) =>
        `₹${Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    const formatDate = (value) => {
        if (!value) return "Date unavailable";

        const date = new Date(value);

        return Number.isNaN(date.getTime())
            ? "Date unavailable"
            : date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
    };

    return (
        <div className="payments-page">
            <div className="payments-header">
                <div>
                    <h1>Payments</h1>
                    <p>Track collections and manage outstanding balances.</p>
                </div>

                <div className="payments-count">
                    <CreditCard size={17} />
                    {" "}
                    {payments.length} transaction
                    {payments.length !== 1 ? "s" : ""}
                </div>
            </div>

            {error && (
                <div className="payments-message payments-error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="payments-message payments-success-message">
                    <CheckCircle2 size={16} />
                    {" "}
                    {success}
                </div>
            )}

            <div className="payments-layout">
                <section className="payment-form-panel">
                    <div className="payment-panel-heading">
                        <div className="payment-panel-icon">
                            <Wallet size={22} />
                        </div>

                        <div>
                            <h2>Record a Payment</h2>
                            <p>Enter the payment details below.</p>
                        </div>
                    </div>

                    <form
                        className="payment-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="payment-field">
                            <label htmlFor="payment-order">
                                Select Order
                            </label>

                            <select
                                id="payment-order"
                                value={order}
                                onChange={(e) => {
                                    setOrder(e.target.value);
                                    setAmount("");
                                    setError("");
                                    setSuccess("");
                                }}
                                required
                            >
                                <option value="">Choose an order</option>

                                {orders
                                    .filter(
                                        (item) =>
                                            Number(item.dueAmount) > 0
                                    )
                                    .map((item) => (
                                        <option
                                            key={item._id}
                                            value={item._id}
                                        >
                                            {item.customer?.name || "Unknown Customer"}
                                            {" — Due: "}
                                            {formatCurrency(item.dueAmount)}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {selectedOrder && (
                            <div className="payment-due-preview">
                                <span>Outstanding balance</span>
                                <strong>
                                    {formatCurrency(dueAmount)}
                                </strong>
                            </div>
                        )}

                        <div className="payment-field">
                            <label htmlFor="payment-amount">
                                Payment Amount (₹)
                            </label>

                            <input
                                id="payment-amount"
                                type="number"
                                min="0.01"
                                max={dueAmount || undefined}
                                step="0.01"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError("");
                                    setSuccess("");
                                }}
                                placeholder="Enter amount"
                                required
                            />
                        </div>

                        <div className="payment-field">
                            <label htmlFor="payment-method">
                                Payment Method
                            </label>

                            <select
                                id="payment-method"
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                required
                            >
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Card">Card</option>
                            </select>
                        </div>

                        <button
                            className="payment-submit-button"
                            type="submit"
                            disabled={
                                submitting ||
                                loading ||
                                orders.every(
                                    (item) =>
                                        Number(item.dueAmount) <= 0
                                )
                            }
                        >
                            {submitting ? (
                                <>Recording Payment...</>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    Record Payment
                                </>
                            )}
                        </button>
                    </form>
                </section>

                <section className="payment-history-panel">
                    <div className="payment-history-heading">
                        <div className="payment-panel-heading">
                            <div className="payment-panel-icon">
                                <History size={22} />
                            </div>

                            <div>
                                <h2>Payment History</h2>
                                <p>Review your recorded transactions.</p>
                            </div>
                        </div>

                        <span className="payment-history-count">
                            {payments.length} records
                        </span>
                    </div>

                    {loading ? (
                        <div className="payments-empty-state">
                            <p>Loading payment history...</p>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="payments-empty-state">
                            <div className="payments-empty-icon">
                                <ReceiptText size={27} />
                            </div>

                            <h3>No payments yet</h3>
                            <p>
                                Recorded transactions will appear here
                                once you receive a payment.
                            </p>
                        </div>
                    ) : (
                        <div className="payment-history-list">
                            {payments.map((payment) => (
                                <article
                                    className="payment-history-card"
                                    key={payment._id}
                                >
                                    <div className="payment-history-card-top">
                                        <div className="payment-customer-info">
                                            <div className="payment-customer-avatar">
                                                <UserRound size={21} />
                                            </div>

                                            <div>
                                                <h3>
                                                    {payment.customer?.name ||
                                                        "Unknown Customer"}
                                                </h3>

                                                <p>
                                                    Order #
                                                    {payment.order?._id
                                                        ? payment.order._id.slice(-6).toUpperCase()
                                                        : "Unknown"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="payment-amount">
                                            {formatCurrency(payment.amount)}
                                        </div>
                                    </div>

                                    <div className="payment-history-details">
                                        <div className="payment-detail">
                                            <Wallet size={15} />
                                            <span className="payment-method-badge">
                                                {payment.paymentMethod || "Unknown"}
                                            </span>
                                        </div>

                                        <div className="payment-detail">
                                            <CalendarDays size={15} />
                                            {formatDate(payment.createdAt)}
                                        </div>
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

export default Payments;

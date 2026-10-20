import { useEffect, useState } from "react";
import { userAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import { getCustomers,getOrders,getMenu,getPayments } from "../services/dashboardService";
import "./Dashboard.css";
const API = import.meta.env.VITE_API_URL;
import {
    Users,
    ShoppingBag,
    UtensilsCrossed,
    CreditCard,
    Wallet,
    Clock
} from "lucide-react";


function Dashboard() {

    const { token, logout } = userAuth();

    const [customerCount, setCustomerCount] = useState(0);

    const [orderCount,setOrderCount] = useState(0);

    const[totalDue,setTotalDue] = useState(0);

    const[menuCount,setmenuCount] = useState(0);

    const[paymentCount,setpaymentCount] = useState(0);

    const[totalPaid,setTotalPaid] = useState(0);

    const [error, setError] = useState("");

    useEffect(() => {

        const fetchCustomers = async () => {
    try {
        const data = await getCustomers(token);
        setCustomerCount(data.customers.length);

        const orderData = await getOrders(token);
        setOrderCount(orderData.orders.length);

        const menuData = await getMenu(token);
        setmenuCount(menuData.menuItems.length);

        const due = orderData.orders.reduce(
    (total, order) => total + order.dueAmount,
    0
);

setTotalDue(due);



        const paid = orderData.orders.reduce(
    (total, order) => total + order.paidAmount,
    0
);

setTotalPaid(paid);

        const paymentData = await getPayments(token);
        setpaymentCount(paymentData.payments.length);

    } catch (error) {
        setError(error.message);
    }
};

        if (token) {
            fetchCustomers();
        }

    }, [token]);

   
return (
    <div className="dashboard">
        <aside className="dashboard-sidebar">
            <h2 className="dashboard-brand">
                Daily<span>Thalli</span>
            </h2>

            <nav className="dashboard-nav">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/customers">Customers</Link>
                <Link to="/menu">Menu</Link>
                <Link to="/orders">Orders</Link>
                <Link to="/payments">Payments</Link>
            </nav>

            <button className="dashboard-logout" onClick={logout}>
                Logout
            </button>
        </aside>

        <main className="dashboard-main">
            <header className="dashboard-header">
                <h1>Welcome to DailyThalli 👋</h1>
                <p>Here's an overview of your business.</p>
            </header>

            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}

            <section className="dashboard-stats">
                
                    <div className="dashboard-card">
                        <div className="dashboard-card-top">
                            <p className="dashboard-card-label">Total Customers</p>
                            <div className="dashboard-icon icon-green">
                                <Users size={22} />
                            </div>
                        </div>
                        <h2 className="dashboard-card-value">{customerCount}</h2>
                        <p className="dashboard-card-hint">Registered customers</p>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-top">
                            <p className="dashboard-card-label">Total Orders</p>
                            <div className="dashboard-icon icon-blue">
                                <ShoppingBag size={22} />
                            </div>
                        </div>
                        <h2 className="dashboard-card-value">{orderCount}</h2>
                        <p className="dashboard-card-hint">Orders recorded</p>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-top">
                            <p className="dashboard-card-label">Menu Items</p>
                            <div className="dashboard-icon icon-purple">
                                <UtensilsCrossed size={22} />
                            </div>
                        </div>
                        <h2 className="dashboard-card-value">{menuCount}</h2>
                        <p className="dashboard-card-hint">Items in your menu</p>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-top">
                            <p className="dashboard-card-label">Payments Recorded</p>
                            <div className="dashboard-icon icon-orange">
                                <CreditCard size={22} />
                            </div>
                        </div>
                        <h2 className="dashboard-card-value">{paymentCount}</h2>
                        <p className="dashboard-card-hint">Payment transactions</p>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-top">
                            <p className="dashboard-card-label">Revenue Collected</p>
                            <div className="dashboard-icon icon-green">
                                <Wallet size={22} />
                            </div>
                        </div>
                        <h2 className="dashboard-card-value">
                            ₹{totalPaid.toLocaleString("en-IN")}
                        </h2>
                        <p className="dashboard-card-hint">Amount paid toward orders</p>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-top">
                            <p className="dashboard-card-label">Outstanding Dues</p>
                            <div className="dashboard-icon icon-orange">
                                <Clock size={22} />
                            </div>
                        </div>
                        <h2 className="dashboard-card-value">
                            ₹{totalDue.toLocaleString("en-IN")}
                        </h2>
                        <p className="dashboard-card-hint">Amount yet to be collected</p>
                    </div>

            </section>
            
                 <section className="recent-orders">
                    <div className="recent-orders-header">
                        <div>
                            <h2>Recent Orders</h2>
                            <p>Keep track of your latest orders.</p>
                        </div>

                        <Link to="/orders" className="view-all-link">
                            View all orders →
                        </Link>
                    </div>

                    {orderCount === 0 ? (
                        <p className="no-orders">No orders available yet.</p>
                    ) : (
                        <div className="recent-orders-list">
                            {/* We'll add the order rows in the next step. */}
                        </div>
                    )}
                </section>

        </main>
    </div>
);

}

export default Dashboard;
import { useEffect, useState } from "react";
import { userAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import { getCustomers,getOrders,getMenu,getPayments } from "../services/dashboardService";

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
        <div>

            <h1>Welcome to my dashboard!!!</h1>

            {error && <p>{error}</p>}

            <h2>Total Customers: {customerCount}</h2>

            <h2>Total Orders : {orderCount}</h2>

            <h2>Total menu : {menuCount}</h2>

            <h2>Total payments:{paymentCount}</h2>

            <h2>Total paid:{totalPaid}</h2>

            <h2>Total due: {totalDue}</h2>

            <Link to="/customers">Customers</Link>
            <br />

            <Link to="/menu">Menu</Link>
            <br />

            <Link to="/orders">Orders</Link>
            <br />

            <Link to="/payments">Payments</Link>
            <br />

            <button onClick={logout}>
                Logout
            </button>

        </div>
    );
}

export default Dashboard;
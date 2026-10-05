
import { useEffect, useState } from "react";

function Customers() {

    const [customers, setCustomers] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem("token");

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
                console.log("Error:", error);
            });

    }, []);

    return (
        <div>
            <h1>Customers</h1>

            {customers.map((customer) => (
                <div key={customer._id}>
                    <h3>{customer.name}</h3>
                    <p>Phone: {customer.phone}</p>
                    <p>Department: {customer.department}</p>
                    <p>Due Amount: {customer.dueAmount}</p>
                </div>
            ))}
        </div>
    );
}

export default Customers;


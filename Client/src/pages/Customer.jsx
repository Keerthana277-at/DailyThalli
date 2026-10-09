
import { useEffect, useState } from "react";

function Customers() {

    const [customers, setCustomers] = useState([]);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [regular, setRegular] = useState(false);

    const [error, setError] = useState("");
    const[editingId,setEditingId] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
          setError("");
        const token = localStorage.getItem("token");

    try {
        let response;

if (editingId) {

    response = await fetch(
        `http://localhost:5001/api/customers/${editingId}`,
        {
            method: "PUT",
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

} else {

    response = await fetch(
        "http://localhost:5001/api/customers",
        {
            method: "POST",
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

console.log("Customer saved:", data);

if (editingId) {

    setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
            customer._id === editingId
                ? data.customer
                : customer
        )
    );

    setEditingId(null);
    setName("");
    setPhone("");
    setDepartment("");
    setRegular(false);

    } else {

        setCustomers((prevCustomers) => [
            data.customer,
            ...prevCustomers
        ]);
    }

}
    } catch (error) {
        console.log("Error:", error);
        setError(error.message);
    }
};

    const handleEdit = (customer) => {
    setEditingId(customer._id);

    setName(customer.name);
    setPhone(customer.phone);
    setDepartment(customer.department);
    setRegular(customer.regular);
};

const handleDelete = async (customerId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5001/api/customers/${customerId}`,
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

            console.log("Customer deleted:", data);

            setCustomers((prevCustomers) =>
                prevCustomers.filter(
                    (customer) => customer._id !== customerId
                )
            );

        } catch (error) {
            console.log("Delete error:", error);
            setError(error.message);
        }
};

    return (
        <>
            {error && <p>{error}</p>}
    

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter customer name"
                        required
                    />
                </div>

                <div>
                    <label>Phone</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        required
                    />
                </div>

                <div>
                    <label>Department</label>
                    <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Enter department"
                        required
                    />
                </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={regular}
                        onChange={(e) => setRegular(e.target.checked)}
                    />
                    Regular Customer
                </label>
            </div>

            <button type="submit">
                {editingId ? "Update Customer" : "Add Customer"}
            </button>

        </form>

                <div>
                    <h1>Customers</h1>

                    {customers.map((customer) => (
                        <div key={customer._id}>
                            <h3>{customer.name}</h3>
                            <p>Phone: {customer.phone}</p>
                            <p>Department: {customer.department}</p>
                            <p>Due Amount: {customer.dueAmount}</p>

                            <button onClick={() => handleEdit(customer)}>
                                Edit
                            </button>

                            <button onClick={() => handleDelete(customer._id)}>
                                Delete
                            </button>

                        </div>
                    ))}
                </div>
       </> 
    );
}
           
export default Customers;


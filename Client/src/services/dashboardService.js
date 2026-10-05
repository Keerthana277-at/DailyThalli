const API_URL = "http://localhost:5001/api";

export const getCustomers = async (token) => {
    const response = await fetch(`${API_URL}/customers`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch customers");
    }

    return data;
};


export const getOrders = async (token) => {
    const response = await fetch(`${API_URL}/orders`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
    }

    return data;
};


export const getMenu = async (token) => {
    const response = await fetch(`${API_URL}/menu`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch menu");
    }

    return data;
};


export const getPayments = async (token) => {
    const response = await fetch(`${API_URL}/payments`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch payments");
    }

    return data;
};
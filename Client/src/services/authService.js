
const API = import.meta.env.VITE_API_URL;

// Existing login function
export const loginUser = async (email, password) => {
    const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
};



 // Registration function
export const registerUser = async (
    name,
    email,
    password,
    phone,
    department
) => {
    const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password,
            phone,
            department
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    return data;
};

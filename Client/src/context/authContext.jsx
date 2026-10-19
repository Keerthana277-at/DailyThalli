
import {
    createContext,
    useContext,
    useState
} from "react";

import {
    loginUser,
    registerUser
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
});

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    // Existing login function
const login = async (email, password) => {
    const data = await loginUser(email, password);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
};

 
   
    // Registration function
    const register = async (name, email, password, phone, department) => {
        return await registerUser(
            name,
            email,
            password,
            phone,
            department
        );
    };


    // Existing logout function
const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
};
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const userAuth = () => {
    return useContext(AuthContext);
};

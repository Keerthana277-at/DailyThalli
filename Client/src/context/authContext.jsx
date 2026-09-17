import {  createContext,useContext,useState } from "react";
import { loginUser } from "../services/authService";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null);
    const [token,setToken] = useState(
        localStorage.getItem("token")
    );

    const login = async (email,password) => {
        try{
            const data = await loginUser(email,password);

            setToken(data.token);
            setUser(data.user);

            return data;
        }catch(error){
            throw error;
        }
        
    };

    const logout = async () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{user,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const userAuth = () => {
    return useContext(AuthContext);
};
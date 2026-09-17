import { userAuth } from "../context/authContext";
function Dashboard(){
    const { logout } = userAuth();
    return (
        <div>
            <h1>Welcome to my dashboard!!!</h1>

            <button onClick={logout}>
                Logout
            </button>

        </div>
    );
}

export default Dashboard;
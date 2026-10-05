import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customer from "./pages/Customer";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments"
import ProtectedRoute from "./components/ProtectedRoute";
function App(){
  return (
    <BrowserRouter>

        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard/>
                </ProtectedRoute>
              }/>
       

        <Route
          path="/customers"
          element={
              <ProtectedRoute>
                  <Customer/>
              </ProtectedRoute>
          }
        />

          <Route
          path="/menu"
          element={
              <ProtectedRoute>
                  <Menu/>
              </ProtectedRoute>
          }
        />


        <Route
          path="/orders"
          element={
              <ProtectedRoute>
                  <Orders/>
              </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
              <ProtectedRoute>
                  <Payments/>
              </ProtectedRoute>
          }
        />
       </Routes>
    </BrowserRouter>
  )
}

export default App;
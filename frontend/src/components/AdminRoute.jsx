import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let user = null;
  
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    user = null;
  }
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

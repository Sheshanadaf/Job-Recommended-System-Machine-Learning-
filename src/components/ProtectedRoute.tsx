import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/user", { withCredentials: true });
        if (res.data.authenticated) {
          setIsAuthenticated(true);

          // Save res.data.sub to localStorage
            localStorage.setItem("userSub", res.data.user.sub);
          

        } else {
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return <>{isAuthenticated && children}</>;
};

export default ProtectedRoute;

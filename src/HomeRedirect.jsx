import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage"; 

const HomeRedirect = () => {
  const navigate = useNavigate();

 
  const token = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType"); 

  const isLoggedIn = !!token;

  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn);
    console.log("userType:", userType);
    if (isLoggedIn) {
      if (userType === "Employee") {
        navigate("/employee-components", { replace: true });
      } else if (userType === "Employer") {
        navigate("/employer-components", { replace: true });
      }
    }
  }, [isLoggedIn, userType, navigate]);

  return <LandingPage />;
};

export default HomeRedirect;
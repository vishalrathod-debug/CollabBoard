import { useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import AppRoutes from "./app/routes";

export default function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.preferences?.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [user]);

  return <AppRoutes />;
}
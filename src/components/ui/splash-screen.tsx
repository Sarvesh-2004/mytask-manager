import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clipboardIcon from "@/assets/clipboard-icon.png";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user is logged in (for now, navigate to login)
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center text-white">
      <div className="animate-float mb-8">
        <img src={clipboardIcon} alt="Todo App" className="w-32 h-24 object-contain" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Todo Task Manager</h1>
      <p className="text-lg opacity-90">Track the things to make life easy</p>
      <div className="mt-8">
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default SplashScreen;
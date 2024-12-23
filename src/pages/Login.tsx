import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with access code:", accessCode);

    if (accessCode !== "geriladev") {
      toast({
        variant: "destructive",
        title: "Invalid access code",
        description: "Please enter the correct parent access code",
      });
      return;
    }

    // Store login info in localStorage
    localStorage.setItem("safeflix-user", JSON.stringify({
      isParent: true,
      loginTime: new Date().toISOString()
    }));

    toast({
      title: "Login successful",
      description: "Welcome to SafeFlix Parent Dashboard",
    });

    // Redirect to parent dashboard
    navigate("/parent-dashboard");
  };

  return (
    <div className="min-h-screen bg-black/95 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-black/80 p-8 rounded-xl border border-white/10"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Parent Access</h2>
          <p className="text-gray-400">Enter your access code to manage content</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              type="password"
              placeholder="Parent Access Code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg"
          >
            Access Dashboard
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="link"
            className="text-gray-400 hover:text-white"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
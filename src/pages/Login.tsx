import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isParentLogin, setIsParentLogin] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password, isParentLogin, accessCode });

    if (isParentLogin && accessCode !== "geriladev") {
      toast({
        variant: "destructive",
        title: "Invalid access code",
        description: "Please enter the correct parent access code",
      });
      return;
    }

    // Store login info in localStorage
    localStorage.setItem("safeflix-user", JSON.stringify({
      email,
      isParent: isParentLogin,
      loginTime: new Date().toISOString()
    }));

    toast({
      title: "Login successful",
      description: `Welcome ${isParentLogin ? "Parent" : "User"}!`,
    });

    // Redirect to appropriate dashboard
    navigate(isParentLogin ? "/parent-dashboard" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-black/95 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-black/80 p-8 rounded-xl border border-white/10"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to continue watching</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              required
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="parentLogin"
              checked={isParentLogin}
              onChange={(e) => setIsParentLogin(e.target.checked)}
              className="rounded border-gray-700 bg-gray-800"
            />
            <label htmlFor="parentLogin" className="text-white">
              Parent Login
            </label>
          </div>

          {isParentLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Input
                type="password"
                placeholder="Parent Access Code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                required={isParentLogin}
              />
            </motion.div>
          )}

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="text-green-500 hover:text-green-400"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
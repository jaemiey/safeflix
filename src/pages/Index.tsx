import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if user was previously logged in
  useEffect(() => {
    const lastSession = localStorage.getItem('safeflix-session');
    if (lastSession) {
      console.log('Found previous session:', lastSession);
      // You can use this to auto-redirect to dashboard if needed
    }
  }, []);

  const handleSignIn = () => {
    // Store last login attempt timestamp
    localStorage.setItem('safeflix-last-login', new Date().toISOString());
    navigate("/login");
  };

  const handleGetStarted = () => {
    // Store user's initial interaction
    localStorage.setItem('safeflix-signup-started', 'true');
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-safeflix-dark text-white">
      <nav className="fixed w-full z-50 flex justify-between items-center px-8 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <h1 className="text-3xl font-bold text-safeflix-primary">SafeFlix</h1>
        <Button
          onClick={handleSignIn}
          className="bg-safeflix-primary hover:bg-safeflix-primary/80 transition-all duration-300"
        >
          Sign In
        </Button>
      </nav>

      <main className="relative pt-32 pb-16 px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            Safe Entertainment for Your Family
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300"
          >
            Complete parental control over content. Choose what your kids watch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleGetStarted}
              className="bg-safeflix-primary hover:bg-safeflix-primary/80 text-lg px-8 py-6 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
              <motion.span
                animate={{ x: isHovered ? 10 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-2"
              >
                →
              </motion.span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.setItem('safeflix-last-page', 'learn-more');
                navigate("/learn-more");
              }}
              className="text-lg px-8 py-6 border-2 border-green-500 text-green-500 hover:bg-green-500/10 transition-all duration-300"
            >
              Learn More
            </Button>
          </motion.div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * (index + 3) }}
              className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-safeflix-primary/50 transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 text-safeflix-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

const features = [
  {
    title: "Time Control",
    description: "Set viewing time limits for each profile",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Content Filtering",
    description: "Choose appropriate categories for each child",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        <path d="M19 3v4" />
        <path d="M21 5h-4" />
      </svg>
    ),
  },
  {
    title: "YouTube Integration",
    description: "Add safe YouTube content for your children",
    icon: ({ className }: { className?: string }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m22 8-6 4 6 4V8Z" />
        <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
      </svg>
    ),
  },
];

export default Index;
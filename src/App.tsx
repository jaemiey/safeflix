import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ParentDashboard from "./pages/ParentDashboard";
import KidsView from "./pages/KidsView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/kids/:profileId" element={<KidsView />} />
      </Routes>
    </Router>
  );
}

export default App;
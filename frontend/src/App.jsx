import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserUpload from "./pages/UserUpload";
import DeveloperView from "./pages/DeveloperView";
import "./App.css";
import APITest from "./pages/APITest";

function App() {
  return (
    <Router>
      <nav className="modern-nav">
        <Link to="/">Upload</Link>
        <Link to="/developer">Developer</Link>
        <Link to="/apitest">API Test</Link>
      </nav>

      <Routes>
        <Route path="/" element={<UserUpload />} />
        <Route path="/developer" element={<DeveloperView />} />
        <Route path="/apitest" element={<APITest/>} />
      </Routes>
    </Router>
  );
}

export default App;

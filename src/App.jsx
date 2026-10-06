import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BlogNrcCkks from "./pages/BlogNrcCkks.jsx";
import HomePage from "./pages/HomePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog/nrc-ckks" element={<BlogNrcCkks />} />
        <Route path="/blog" element={<Navigate to="/blog/nrc-ckks" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

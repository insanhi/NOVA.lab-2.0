import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AssignmentDetail from './pages/AssignmentDetail';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Soft Ambient Pastel Mesh (Google Labs aesthetic) */}
        <div className="labs-gradient-mesh">
          <div className="blob-1" />
          <div className="blob-2" />
          <div className="blob-3" />
        </div>

        <Navbar />
        <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assignment/:slug" element={<AssignmentDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
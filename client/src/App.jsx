import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Places from './pages/Places';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 lg:p-12 w-full max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/places" replace />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/places" element={<Places />} />
            <Route path="/places/:placeName" element={<Employees />} />
            <Route path="/employee/:id" element={<EmployeeDetail />} />
            
            <Route path="*" element={<Navigate to="/places" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

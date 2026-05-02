import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Map, Users, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link to="/places" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
        <Map className="h-4 w-4" /> Employees
      </Link>
      <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
        <LayoutDashboard className="h-4 w-4" /> Enter Data
      </Link>
    </>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className="flex-shrink-0 flex items-center text-indigo-600 font-bold text-xl tracking-tight gap-2">
              <Users className="h-6 w-6" />
              EmpPortal
            </Link>
            {/* Desktop Menu */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
              <NavLinks />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-indigo-600 p-2"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-lg absolute w-full">
          <NavLinks />
        </div>
      )}
    </nav>
  );
}


import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import CarDetail from './pages/CarDetail';
import Finance from './pages/Finance';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Auctions from './pages/Auctions';
import ChatBot from './components/ChatBot';
import SeasonalEffects from './components/SeasonalEffects';
import { CarProvider } from './context/CarContext';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <CarProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-gold-500 selection:text-black transition-colors duration-300 relative">
            <SeasonalEffects />
            <Navigation />
            <main className="flex-grow z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/:id" element={<CarDetail />} />
                <Route path="/auctions" element={<Auctions />} />
                <Route path="/services" element={<Services />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
            <ChatBot />
          </div>
        </Router>
      </ThemeProvider>
    </CarProvider>
  );
};

export default App;

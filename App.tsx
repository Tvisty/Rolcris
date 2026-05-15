
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import SeasonalEffects from './components/SeasonalEffects';
import { CarProvider } from './context/CarContext';
import { ThemeProvider } from './context/ThemeContext';

const Home = React.lazy(() => import('./pages/Home'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const CarDetail = React.lazy(() => import('./pages/CarDetail'));
const Finance = React.lazy(() => import('./pages/Finance'));
const Services = React.lazy(() => import('./pages/Services'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Auctions = React.lazy(() => import('./pages/Auctions'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));

const LoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <CarProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-gold-500 selection:text-black transition-colors duration-300 relative">
            <SeasonalEffects />
            <Navigation />
            <main className="flex-grow z-10 w-full flex flex-col">
              <Suspense fallback={<LoadingFallback />}>
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
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                </Routes>
              </Suspense>
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

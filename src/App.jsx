import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import InquiryForm from './components/Form/InquiryForm';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-blue-50">
        <Header />
        
        <main className="flex-1 py-4 px-3 md:py-8 md:px-4">
          <div className="max-w-lg md:max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<InquiryForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

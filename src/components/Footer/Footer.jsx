import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-800 text-white mt-auto py-4 px-3">
      <div className="text-center">
        <p className="text-xs text-blue-200">
          © {currentYear} DEPSTAR - Devang Patel Institute of Advance Technology and Research
        </p>
        <p className="text-xs text-blue-300 mt-1">
          CHARUSAT, Changa, Gujarat
        </p>
      </div>
    </footer>
  );
};

export default Footer;

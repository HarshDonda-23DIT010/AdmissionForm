import React from 'react';
import charusatLogo from '../../assets/charusat.png';
import depstarLogo from '../../assets/depstarlogo.jpeg';

const Header = () => {
   return (
      <header className="bg-blue-700 shadow-lg">
         <div className="px-3 py-3">
            {/* Mobile Layout */}
            <div className="md:hidden">
               {/* Logos Row */}
               <div className="flex items-center justify-center gap-4 mb-2">
                  <div className="bg-white rounded-lg p-1">
                     <img
                        src={charusatLogo}
                        alt="CHARUSAT Logo"
                        className="w-30 h-9 object-contain"
                     />
                  </div>
                  <div className="bg-white rounded-lg p-1">
                     <img
                        src={depstarLogo}
                        alt="DEPSTAR Logo"
                        className="w-10 h-10 object-contain"
                     />
                  </div>
               </div>
               {/* College Name */}
               <div className="text-center ">
                  <h1 className="text-xs font-bold text-white leading-tight">
                     Devang Patel Institute of Advance Technology and Research
                  </h1>
                  <p className="text-xs text-blue-200 mt-0.5">
                     Charotar University of Science and Technology
                  </p>
               </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between gap-4 relative">
               <div className="bg-white rounded-lg p-1 flex-shrink-0">
                  <img
                     src={charusatLogo}
                     alt="CHARUSAT Logo"
                     className="w-48 h-12 object-contain"
                  />
               </div>

               <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                  <h1 className="text-base lg:text-lg font-bold text-white leading-tight">
                     Devang Patel Institute of Advance Technology and Research
                  </h1>
                  <p className="text-sm text-blue-200 mt-0.5">
                     Charotar University of Science and Technology
                  </p>
               </div>

               <div className="bg-white rounded-lg p-1 flex-shrink-0">
                  <img
                     src={depstarLogo}
                     alt="DEPSTAR Logo"
                     className="w-12 h-12 object-contain"
                  />
               </div>
            </div>
         </div>
      </header>
   );
};

export default Header;

import React from 'react';
import { MessageCircle, Shield, Heart, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  // Facebook Messenger Link
  const messengerMessage = encodeURIComponent('Hi! I would like to inquire about your peptide products.');
  const messengerUrl = `https://m.me/renalyndv?text=${messengerMessage}`;

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      {/* Compact Footer Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 max-w-5xl mx-auto">
          
          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpg" 
              alt="Peptivate.ph" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-lg object-cover border-2 border-white/20"
            />
            <div className="text-center md:text-left">
              <div className="text-white font-bold text-sm md:text-base flex items-center gap-1.5">
                Peptivate.ph
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
              </div>
              <div className="text-[10px] md:text-xs text-gray-300">Premium Peptide Solutions</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
            <a
              href="/coa"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl transition-all font-medium text-xs md:text-sm border border-white/30"
            >
              <Shield className="w-4 h-4" />
              Lab Reports
            </a>
            <a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl transition-all font-medium text-sm md:text-base shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
              Chat on Messenger
            </a>
          </div>

        </div>
      </div>

      {/* Compact Footer Bottom */}
      <div className="bg-black/30 py-3 md:py-4 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-1">
            <p className="text-[10px] md:text-xs text-gray-300 flex items-center justify-center gap-1.5 flex-wrap">
              Made with 
              <Heart className="w-3 h-3 text-pink-400 animate-pulse" />
              © {currentYear} Peptivate.ph. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

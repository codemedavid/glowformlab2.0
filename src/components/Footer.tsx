import React from 'react';
import { MessageCircle, Shield, Heart, HelpCircle, Calculator, FileText, Truck, ClipboardCheck } from 'lucide-react';
import { useCOAPageSetting } from '../hooks/useCOAPageSetting';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { coaPageEnabled } = useCOAPageSetting();

  // Contact Links
  //   const whatsappMessage = encodeURIComponent('Hi! I would like to inquire about your products.');
  //   const whatsappUrl = `https://wa.me/639062349763?text=${whatsappMessage}`;

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">

          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
              <img
                src="/assets/logo.jpeg"
                alt="Peptide Pulse"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <div className="font-bold text-theme-text text-lg tracking-tight">
                Peptide Pulse
              </div>
              <div className="text-xs text-gray-500">Premium Peptide Solutions</div>
            </div>
          </div>

          {/* Contact Emails */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-gray-500">
            <span className="text-xs font-medium text-gray-400 uppercase">Contact Us:</span>
            <a href="mailto:whisperer@gmail.com" className="hover:text-theme-accent transition-colors">
              whisperer@gmail.com
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a href="mailto:thepeptidepulse@gmail.com" className="hover:text-theme-accent transition-colors">
              thepeptidepulse@gmail.com
            </a>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-end">
            {/* Lab Reports & FAQ Removed */}
            {/* WhatsApp Removed */}
            <a
              href="/track-order"
              className="text-gray-500 hover:text-theme-accent transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Truck className="w-4 h-4" />
              Track Order
            </a>
            <a
              href="/calculator"
              className="text-gray-500 hover:text-theme-accent transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Calculator className="w-4 h-4" />
              Calculator
            </a>
            {coaPageEnabled && (
              <a
                href="/coa"
                className="text-gray-500 hover:text-theme-accent transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Lab Tests
              </a>
            )}
            <a
              href="/faq"
              className="text-gray-500 hover:text-theme-accent transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </a>
            <a
              href="/assessment"
              className="text-gray-500 hover:text-theme-accent transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ClipboardCheck className="w-4 h-4" />
              Assessment
            </a>
            <a
              href="https://t.me/+k3SfL4WjnMQ3NGRl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#0088cc] transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              Join Community
            </a>
            <a
              href="https://www.tiktok.com/@peptidepulse20?_r=1&_t=ZS-92SrpIepm5s"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              TikTok
            </a>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            Made with
            <Heart className="w-3 h-3 text-theme-secondary fill-theme-secondary" />
            © {currentYear} Peptide Pulse.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

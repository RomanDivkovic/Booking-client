import { Calendar, Home, Users, CalendarDays, HelpCircle, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* First Column - Calendar Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              Kalender
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Hemvy
                </Link>
              </li>
              <li>
                <Link 
                  to="/todos" 
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Grupper
                </Link>
              </li>
            </ul>
          </div>

          {/* Second Column - About & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-blue-400" />
              Om & Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Om oss
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/tos" 
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Användarvillkor
                </Link>
              </li>
            </ul>
          </div>

          {/* Third Column - Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2 text-blue-400" />
              Följ oss
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/RomanDivkovic/Booking-client" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.875-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 FamiljKal. Alla rättigheter förbehållna.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Skapad med ❤️ för familjer och hushåll
          </p>
        </div>
      </div>
    </footer>
  );
}; 
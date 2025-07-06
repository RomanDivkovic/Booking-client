import { Link } from "react-router-dom";
import { Calendar, Info, Instagram, Github, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Calendar Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Calendar Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="link-hover-animation text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/todos"
                  className="link-hover-animation text-gray-300 hover:text-white transition-colors"
                >
                  Todos
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="link-hover-animation text-gray-300 hover:text-white transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Information
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="link-hover-animation text-gray-300 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="link-hover-animation text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/tos"
                  className="link-hover-animation text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold font-inter mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/in/romandivkovic"
                target="_blank"
                rel="noopener noreferrer"
                className="link-hover-animation text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/romandivkovic"
                target="_blank"
                rel="noopener noreferrer"
                className="link-hover-animation text-gray-300 hover:text-white transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com/romandivkovic"
                target="_blank"
                rel="noopener noreferrer"
                className="link-hover-animation text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 FamCaly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

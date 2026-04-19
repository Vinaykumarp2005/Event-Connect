import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 ">
      <div className="container mx-auto px-2 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="mb-0">
            <h2 className="text-2xl font-bold mb-4">EventConnect</h2>
            <p className="text-gray-400">
              Your one-stop platform for discovering and managing events. Join our community and never miss out on exciting opportunities.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2"><a href="/" className="hover:text-gray-300">Home</a></li>
              <li className="mb-2"><a href="/events" className="hover:text-gray-300">Events</a></li>
              <li className="mb-2"><a href="/about" className="hover:text-gray-300">About Us</a></li>
              <li className="mb-2"><a href="/contact" className="hover:text-gray-300">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">Hyderabad</p>
            <p className="text-gray-400">Email: info@eventconnect.com</p>
             </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaInstagram size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} EventConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
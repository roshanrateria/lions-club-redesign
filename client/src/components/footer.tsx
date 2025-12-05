import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-lions-gold rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">L</span>
              </div>
              <div>
                <h5 className="font-bold">Lions Club Kolkata IEM</h5>
              </div>
            </div>
            <p className="text-gray-400">
              Serving the community with dedication and compassion since our establishment.
            </p>
          </div>
          <div>
            <h6 className="font-bold mb-4">Quick Links</h6>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection("#home")}
                  className="hover:text-lions-gold transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("#about")}
                  className="hover:text-lions-gold transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("#campaigns")}
                  className="hover:text-lions-gold transition-colors"
                >
                  Campaigns
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("#social-media")}
                  className="hover:text-lions-gold transition-colors"
                >
                  In Media
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("#volunteer")}
                  className="hover:text-lions-gold transition-colors"
                >
                  Volunteer
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-4">Services</h6>
            <ul className="space-y-2 text-gray-400">
              <li>Education Programs</li>
              <li>Healthcare Initiatives</li>
              <li>Community Development</li>
              <li>Environmental Projects</li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-4">Connect With Us</h6>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-lions-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-lions-gold transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-lions-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-lions-gold transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Lions Club Kolkata IEM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

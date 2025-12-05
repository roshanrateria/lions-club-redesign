import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import lionsLogo from "@/assets/Lions-Club-logo.webp";

interface NavbarProps {
  onDonateClick: () => void;
}

export default function Navbar({ onDonateClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navLinks = [
    { href: "#home", label: "HOME" },
    { href: "#about", label: "ABOUT" },
    { href: "#campaigns", label: "CAMPAIGNS" },
    { href: "#social-media", label: "IN MEDIA" },
    { href: "#volunteer", label: "VOLUNTEER" },
    { href: "#contact", label: "CONTACT" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img src={lionsLogo} alt="Lions Club Logo" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h1 className="text-lg font-bold text-lions-blue">Lions Club</h1>
                <p className="text-xs text-gray-500">Kolkata IEM</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link, index) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`font-semibold transition-colors ${
                    index === 0 
                      ? "text-lions-blue hover:text-lions-gold" 
                      : "text-gray-700 hover:text-lions-blue"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Donate Button */}
          <div className="hidden md:block">
            <Button 
              onClick={onDonateClick}
              className="bg-lions-gold hover:bg-lions-gold/90 text-white font-semibold"
            >
              <Heart className="w-4 h-4 mr-2" />
              Donate Us
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link, index) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={`block w-full text-left px-3 py-2 font-semibold transition-colors ${
                  index === 0 
                    ? "text-lions-blue" 
                    : "text-gray-700"
                }`}
              >
                {link.label}
              </button>
            ))}
            <Button 
              onClick={() => {
                onDonateClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-2 bg-lions-gold hover:bg-lions-gold/90 text-white font-semibold"
            >
              <Heart className="w-4 h-4 mr-2" />
              Donate Us
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Users } from "lucide-react";
import donationHeroImage from "@/assets/Donation-Hero-Pic.png";

interface HeroProps {
  onDonateClick: () => void;
}

export default function Hero({ onDonateClick }: HeroProps) {
  return (
    <section id="home" className="relative overflow-hidden bg-slate-900 min-h-[90vh] flex items-center">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-lions-blue to-blue-900 opacity-90"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-lions-gold rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-lions-gold backdrop-blur-sm border border-white/20 mb-4 animate-fade-in-up">
              <span className="text-sm font-semibold tracking-wide uppercase">Serving Community Since 2018</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              The <span className="text-lions-gold">Foundation</span>
              <br />
              Of <span className="text-lions-gold">Service</span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Join us in making a difference. Progress is achieved not by leaps, but by the steady, deliberate actions we take together each day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button
                onClick={onDonateClick}
                className="bg-gradient-to-r from-lions-gold to-yellow-500 hover:from-lions-gold/90 hover:to-yellow-500/90 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Heart className="w-5 h-5 mr-2 fill-current" />
                Donate Now
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
                size="lg"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative group perspective-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-lions-gold to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.01]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
              <img
                src={donationHeroImage}
                alt="Lions Club community service"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-lions-gold p-3 rounded-full">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">1000+ Lives Touched</p>
                      <p className="text-blue-200 text-sm">Through various initiatives</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
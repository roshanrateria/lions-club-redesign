import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import ServiceSteps from "@/components/service-steps";
import Campaigns from "@/components/campaigns";
import SocialMediaPublications from "@/components/social-media-publications";
import Statistics from "@/components/statistics";
import CallToAction from "@/components/call-to-action";
import Testimonials from "@/components/testimonials";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import DonateModal from "@/components/donate-modal";
import CertificateForm from "@/components/certificate-form";
import { useState } from "react";

export default function Home() {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isCertificateFormOpen, setIsCertificateFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar onDonateClick={() => setIsDonateModalOpen(true)} />

      {/* Main Content */}
      <main className="space-y-0">
        <Hero onDonateClick={() => setIsDonateModalOpen(true)} />

        <div id="about" className="py-16 md:py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ServiceSteps />
          </div>
        </div>

        <div id="campaigns" className="py-16 md:py-24 bg-slate-50 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Campaigns />
          </div>
        </div>

        <div className="py-16 md:py-24 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SocialMediaPublications />
          </div>
        </div>

        <Statistics />

        <div id="volunteer" className="py-16 md:py-24 bg-lions-blue relative overflow-hidden">
          <CallToAction />
        </div>

        <div className="py-16 md:py-24 bg-slate-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Testimonials />
          </div>
        </div>

        <div id="contact" className="py-16 md:py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Contact />
          </div>
        </div>
      </main>

      <Footer />

      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        onOpenCertificateForm={() => {
          setIsDonateModalOpen(false);
          setIsCertificateFormOpen(true);
        }}
      />
      <CertificateForm
        isOpen={isCertificateFormOpen}
        onClose={() => setIsCertificateFormOpen(false)}
      />
    </div>
  );
}

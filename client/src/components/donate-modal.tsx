import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Smartphone, ArrowRight, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCertificateForm: () => void;
}

export default function DonateModal({ isOpen, onClose, onOpenCertificateForm }: DonateModalProps) {
  const isMobile = useIsMobile();

  const redirectToUPI = () => {
    const upiId = 'lionsclub@paytm';
    const upiUrl = `upi://pay?pa=${upiId}&tn=Donation to Lions Club Kolkata IEM`;
    
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      window.location.href = upiUrl;
    } else {
      alert('UPI payment is available on mobile devices');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-lions-blue mb-2">
            Support Our Cause
          </DialogTitle>
          <p className="text-center text-gray-600">Your donation makes a difference</p>
        </DialogHeader>
        
        {/* Desktop QR Code */}
        {!isMobile && (
          <div className="text-center mb-6">
            <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">QR Code for Donation</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Scan QR code to donate</p>
          </div>
        )}

        {/* Mobile UPI ID */}
        {isMobile && (
          <div className="text-center mb-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">UPI ID:</p>
              <p className="font-bold text-lions-blue text-lg">lionsclub@paytm</p>
              <Button 
                onClick={redirectToUPI}
                className="mt-3 bg-lions-gold hover:bg-lions-gold/90 text-white"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Pay Now
              </Button>
            </div>
          </div>
        )}

        {/* 80G Certificate Info */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="font-bold text-lions-blue mb-2">80G Tax Certificate</p>
          <p className="text-sm text-gray-600 mb-3">
            To receive the <strong>80G certificate</strong>, please fill out the form below:
          </p>
          <Button 
            variant="link" 
            onClick={onOpenCertificateForm}
            className="text-lions-gold hover:text-lions-blue font-semibold p-0"
          >
            Fill 80G Certificate Form <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          <Button className="flex-1 bg-lions-gold hover:bg-lions-gold/90 text-white">
            <Heart className="w-4 h-4 mr-2" />
            Donate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

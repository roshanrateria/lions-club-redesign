import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import type { Post } from "@shared/schema";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DonateModal from "@/components/donate-modal";
import CertificateForm from "@/components/certificate-form";

export default function PostPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });
  const post = posts.find((p) => p.id === parseInt(id || "0"));
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [dialogImageUrl, setDialogImageUrl] = useState<string | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isCertificateFormOpen, setIsCertificateFormOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar onDonateClick={() => setIsDonateModalOpen(true)} />
        <div className="max-w-4xl mx-auto p-6 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar onDonateClick={() => setIsDonateModalOpen(true)} />
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Post not found</h1>
            <p className="text-gray-600">The post you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar onDonateClick={() => setIsDonateModalOpen(true)} />

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6 hover:bg-slate-200 text-slate-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <article className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          {/* Cover Image */}
          {post.coverImageUrl && (
            <div className="relative group">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-[400px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

              <div className="absolute bottom-0 left-0 p-8 sm:p-12 text-white">
                <div className="inline-flex items-center text-sm font-medium bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white mb-2 drop-shadow-sm">
                  {post.title}
                </h1>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8 sm:p-12 lg:p-16">
            {!post.coverImageUrl && (
              <div className="mb-8">
                <div className="inline-flex items-center text-sm font-medium bg-slate-100 text-slate-600 px-4 py-2 rounded-full mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-slate-900">
                  {post.title}
                </h1>
              </div>
            )}

            <div className="prose prose-lg sm:prose-xl max-w-none text-slate-600 leading-relaxed">
              {post.description.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-6">{paragraph}</p>
              ))}
            </div>

            {/* Additional Images */}
            {post.additionalImages && post.additionalImages.length > 0 && (
              <div className="mt-16 pt-16 border-t border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                  <span className="w-2 h-8 bg-lions-gold rounded-full mr-4"></span>
                  Gallery
                  <span className="ml-4 text-xs font-semibold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.additionalImages.length} Photos
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {post.additionalImages.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDialogImageUrl(imageUrl);
                        setImageDialogOpen(true);
                      }}
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-zoom-in focus:outline-none focus:ring-4 focus:ring-lions-gold/20"
                    >
                      <img
                        src={imageUrl}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Call to action */}
            <div className="mt-16 bg-gradient-to-br from-lions-blue to-blue-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 filter contrast-150 brightness-100"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-lions-gold rounded-full filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>

              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Inspired to make a difference?</h3>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  Your support helps us continue these vital community initiatives. Join us in serving those in need.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setIsDonateModalOpen(true)}
                    className="bg-lions-gold text-lions-blue hover:bg-white hover:text-lions-blue font-bold px-8 py-6 rounded-xl shadow-lg shadow-black/20 text-lg"
                  >
                    Donate Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/#campaigns")}
                    className="bg-transparent border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-xl text-lg"
                  >
                    View More Campaigns
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>
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

      {/* Image Dialog Popup */}
      <Dialog open={!!imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-[95vw] h-[90vh] bg-black/95 border-none p-0 flex items-center justify-center">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          {/* Close button styling override */}
          <style>{`.data-[state=open] > button { color: white !important; top: 2rem; right: 2rem; transform: scale(1.5); }`}</style>

          {dialogImageUrl && (
            <img
              src={dialogImageUrl}
              alt="Full Size"
              className="max-h-full max-w-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SocialMediaPublication } from "@shared/schema";

export default function SocialMediaPublications() {
  const isMobile = useIsMobile();
  const [showAll, setShowAll] = useState(false);

  const { data: publications = [], isLoading } = useQuery<SocialMediaPublication[]>({
    queryKey: ['/api/social-media-publications'],
  });

  // Sort publications by date (most recent first)
  const sortedPublications = publications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Show 1 publication on mobile, 3 on desktop, or all if showAll is true
  const displayLimit = isMobile ? 1 : 3;
  const displayedPublications = showAll ? sortedPublications : sortedPublications.slice(0, displayLimit);
  const hasMorePublications = sortedPublications.length > displayLimit;

  if (isLoading) {
    return (
      <section id="social-media" className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-lions-blue mb-4">In The Media</h3>
            <p className="text-xl text-gray-600">Our community impact in the news</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: displayLimit }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (sortedPublications.length === 0) {
    return null; // Don't show the section if there are no publications
  }

  return (
    <section id="social-media" className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-lions-blue mb-4">In The Media</h3>
          <p className="text-xl text-gray-600">Our community impact featured in news and social media</p>
        </div>

        <div className={`grid grid-cols-1 ${showAll ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
          {displayedPublications.map((publication: SocialMediaPublication) => (
            <Card key={publication.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
              <div className="relative overflow-hidden">
                <img 
                  src={publication.imageUrl}
                  alt={publication.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <BarChart3 className="w-4 h-4 text-lions-blue" />
                </div>
              </div>
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-lions-blue mb-3 line-clamp-2 leading-tight">
                  {publication.title}
                </h4>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(publication.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-lions-blue text-lions-blue hover:bg-lions-blue hover:text-white transition-all duration-300 font-semibold"
                  onClick={() => window.open(publication.linkUrl, '_blank')}
                >
                  Read Article
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {hasMorePublications && !showAll && (
          <div className="text-center mt-12">
            <Button 
              onClick={() => setShowAll(true)}
              className="bg-lions-blue hover:bg-lions-blue/90 text-white px-8 py-3 text-lg"
            >
              View All Publications
            </Button>
          </div>
        )}

        {showAll && hasMorePublications && (
          <div className="text-center mt-12">
            <Button 
              onClick={() => setShowAll(false)}
              variant="outline"
              className="border-lions-blue text-lions-blue hover:bg-lions-blue hover:text-white px-8 py-3 text-lg"
            >
              Show Less
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

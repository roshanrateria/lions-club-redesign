import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "wouter";
import type { Post } from "@shared/schema";

export default function Campaigns() {
  const isMobile = useIsMobile();
  const [, setLocation] = useLocation();
  const [showAll, setShowAll] = useState(false);

  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  // Sort posts by date (most recent first)
  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Show 1 post on mobile, 3 on desktop, or all if showAll is true
  const displayLimit = isMobile ? 1 : 3;
  const displayedPosts = showAll ? sortedPosts : sortedPosts.slice(0, displayLimit);
  const hasMorePosts = sortedPosts.length > displayLimit;

  if (isLoading) {
    return (
      <section id="campaigns" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-lions-blue mb-4">Recent Campaigns</h3>
            <p className="text-xl text-gray-600">Latest initiatives making a difference in our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: displayLimit }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
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

  return (
    <section id="campaigns" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-lions-blue mb-4">Recent Campaigns</h3>
          <p className="text-xl text-gray-600">Latest initiatives making a difference in our community</p>
        </div>

        {sortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No campaigns available at the moment.</p>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 ${showAll ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
              {displayedPosts.map((post: Post) => (
                <Card key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {post.coverImageUrl && (
                    <img 
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-lions-blue mb-3">{post.title}</h4>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.description.substring(0, 150)}...</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <Button 
                      variant="link" 
                      className="text-lions-gold hover:text-lions-blue font-semibold p-0"
                      onClick={() => setLocation(`/post/${post.id}`)}
                    >
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasMorePosts && !showAll && (
              <div className="text-center mt-12">
                <Button 
                  onClick={() => setShowAll(true)}
                  className="bg-lions-blue hover:bg-lions-blue/90 text-white px-8 py-3 text-lg"
                >
                  View All Campaigns
                </Button>
              </div>
            )}

            {showAll && hasMorePosts && (
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
          </>
        )}
      </div>
    </section>
  );
}
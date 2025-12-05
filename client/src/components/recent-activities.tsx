import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@shared/schema";

export default function RecentActivities() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts"],
  });

  return (
    <section id="activities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-8">Loading activities...</div>
        ) : posts && Array.isArray(posts) && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.slice(0, 6).map((post: Post) => (
              <Card key={post.id} className="bg-gray-50 rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  {post.coverImageUrl && (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h4 className="text-xl font-bold text-lions-blue mb-2">{post.title}</h4>
                  <p className="text-gray-500 mb-3 text-sm">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-gray-600">{post.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            No activities posted yet. Check back soon for updates!
          </div>
        )}
      </div>
    </section>
  );
}

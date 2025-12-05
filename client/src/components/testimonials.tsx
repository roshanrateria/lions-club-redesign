import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    content: "It was the best decision I have ever made - joining the Lions Club family and becoming a volunteer. I was part of an amazing group of people that helped transform lives in our community through education and healthcare initiatives.",
    author: "Bobby Johnson",
    duration: "1 year volunteer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
  },
  {
    content: "The Lions Club has given me a platform to make a real difference. From organizing health camps to supporting education initiatives, every project brings immense satisfaction knowing we're helping those in need.",
    author: "Sarah Williams",
    duration: "3 years volunteer",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-lions-blue mb-4">
            Our Volunteers Love To Share Their Thoughts
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white p-8 rounded-xl shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image}
                    alt={`${testimonial.author}, Lions Club volunteer`}
                    className="w-16 h-16 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <h5 className="font-bold text-lions-blue">{testimonial.author}</h5>
                    <p className="text-gray-600">{testimonial.duration}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

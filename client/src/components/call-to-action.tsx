import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Community volunteers working together on a service project" 
              className="rounded-2xl shadow-lg w-full h-auto" 
            />
          </div>
          <div>
            <h3 className="text-4xl font-bold text-lions-blue mb-6">Don't Look Away!</h3>
            <h4 className="text-2xl font-semibold text-gray-700 mb-6">
              They need your help. It's time to make a change!
            </h4>
            <p className="text-lg text-gray-600 mb-8">
              Join us today and become a volunteer. Be part of an amazing group of people that make a real difference in our community.
            </p>
            <Button className="bg-lions-gold hover:bg-lions-gold/90 text-white px-8 py-4 text-lg font-semibold">
              <Users className="w-5 h-5 mr-2" />
              More Information
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

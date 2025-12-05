import { MapPin, Users, Handshake, Heart } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Start Local",
    description: "Focusing on the needs of our local community is the foundation of our service.",
  },
  {
    icon: Users,
    title: "Mobilize Volunteers",
    description: "Engage club members and community volunteers to contribute their time and skills to the project.",
  },
  {
    icon: Handshake,
    title: "Partner with Others",
    description: "Collaborate with local organizations, businesses, and other groups to pool resources and expertise.",
  },
  {
    icon: Heart,
    title: "Donate and Fundraise",
    description: "Organize fundraising events and seek donations to support your project financially and cover necessary expenses.",
  },
];

export default function ServiceSteps() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-lions-blue mb-4">
            Simple Steps That Will Make a Big Difference
          </h3>
          <p className="text-xl text-gray-600">Our systematic approach to community service</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="w-20 h-20 bg-lions-blue rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-lions-gold transition-colors duration-300">
                  <IconComponent className="text-white text-2xl w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-lions-blue mb-4">{step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

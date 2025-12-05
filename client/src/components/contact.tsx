import { Mail, Phone, Users } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    content: "lionsclub_kolkataiem@gmail.com",
  },
  {
    icon: Phone,
    title: "Phone",
    content: "+91 9051267962",
  },
  {
    icon: Users,
    title: "District",
    content: "Lions International District 322B2",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-lions-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white mb-16">
          <h3 className="text-4xl font-bold mb-4">Get In Touch</h3>
          <p className="text-xl text-blue-200">Connect with Lions Club Kolkata IEM</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
          {contactInfo.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <div key={index}>
                <div className="w-16 h-16 bg-lions-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="text-white w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-2">{contact.title}</h4>
                <p className="text-blue-200">{contact.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

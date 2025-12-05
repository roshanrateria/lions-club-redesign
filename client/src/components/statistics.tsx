const stats = [
  { value: "500+", label: "Volunteers" },
  { value: "₹10L+", label: "Donations" },
  { value: "25+", label: "Projects Completed" },
  { value: "100%", label: "Love & Care" },
];

export default function Statistics() {
  return (
    <section className="py-20 bg-lions-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="text-white">
              <div className="text-4xl font-bold text-lions-gold mb-2">{stat.value}</div>
              <div className="text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

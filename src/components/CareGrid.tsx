import { Building2, Handshake, Heart, Users } from "lucide-react";

const careItems = [
  {
    icon: Heart,
    letter: "C",
    title: "Connect to Christ",
    description: "Build a personal relationship with Jesus through prayer, worship, and scripture.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: Users,
    letter: "A",
    title: "Affiliate to Cell",
    description: "Join a small group where you can grow, share, and be supported by others.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Building2,
    letter: "R",
    title: "Raise to Church",
    description: "Become an active member of our church family and grow in your faith journey.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Handshake,
    letter: "E",
    title: "Engage to Community",
    description: "Serve and impact your community by using your gifts to bless others.",
    color: "from-blue-500 to-indigo-600",
  },
];

export function CareGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {careItems.map((item, index) => (
        <div
          key={item.letter}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
          
          {/* Large letter background */}
          <span className="absolute -right-2 -top-4 font-bold text-8xl text-church-gold/10 transition-all duration-300 group-hover:text-church-gold/20">
            {item.letter}
          </span>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Icon container */}
            <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
              <item.icon className="h-7 w-7 text-white" />
            </div>
            
            {/* Step number */}
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-church-gold">
                Step {index + 1}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="mb-2 font-bold text-lg text-church-navy">
              {item.title}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
          
          {/* Bottom accent line */}
          <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${item.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
        </div>
      ))}
    </div>
  );
}

import { Building2, Handshake, Heart, Users } from "lucide-react";

export function CareGrid() {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="text-center">
        <Heart className="mx-auto mb-2 h-8 w-8 text-church-gold" />
        <p className="font-medium text-sm">Connect to Christ</p>
      </div>
      <div className="text-center">
        <Users className="mx-auto mb-2 h-8 w-8 text-church-gold" />
        <p className="font-medium text-sm">Affiliate to Cell</p>
      </div>
      <div className="text-center">
        <Building2 className="mx-auto mb-2 h-8 w-8 text-church-gold" />
        <p className="font-medium text-sm">Raise to Church</p>
      </div>
      <div className="text-center">
        <Handshake className="mx-auto mb-2 h-8 w-8 text-church-gold" />
        <p className="font-medium text-sm">Engage to Community</p>
      </div>
    </div>
  );
}

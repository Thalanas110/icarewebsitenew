import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useChurchInfo } from "@/hooks/useChurchData";

export function Footer() {
  const { data: churchInfo } = useChurchInfo();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img alt="ICC Logo" className="h-8 w-auto" src="/icc logo.jpg" />
              <span className="font-display font-semibold text-lg">
                The Refuge Church
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {churchInfo?.church_name || "I Care Center - Refuge"} - A place
              where faith meets community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link
                  className="transition-colors hover:text-background"
                  to="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-background"
                  to="/services"
                >
                  Service Times
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-background"
                  to="/ministries"
                >
                  Ministries
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-background"
                  to="/events"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-background"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {churchInfo?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {churchInfo.phone}
                </li>
              )}
              {churchInfo?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {churchInfo.email}
                </li>
              )}
              {churchInfo?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4" />
                  <span>
                    {churchInfo.address}
                    <br />
                    {churchInfo.city}, {churchInfo.state} {churchInfo.zip}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h4 className="mb-4 font-semibold">Office Hours</h4>
            <p className="whitespace-pre-line text-muted-foreground text-sm">
              {churchInfo?.office_hours ||
                "Mon-Fri: 9AM-5PM\nSaturday: 9AM-12PM"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-muted-foreground/20 border-t pt-8 text-muted-foreground text-sm sm:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            {churchInfo?.church_name || "I Care Center - Refuge"}. All rights
            reserved.
          </p>
          <p className="mt-2 flex items-center gap-1 sm:mt-0">
            Made by the ICC Media Team with 🧡 for our community
          </p>
        </div>
      </div>
    </footer>
  );
}

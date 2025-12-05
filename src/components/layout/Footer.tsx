import { Link } from 'react-router-dom';
import { useChurchInfo } from '@/hooks/useChurchData';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const { data: churchInfo } = useChurchInfo();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">R</span>
              </div>
              <span className="font-display font-semibold text-lg">REFUGE</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {churchInfo?.church_name || 'I Care Center - Refuge'} - A place where faith meets community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-background transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-background transition-colors">Service Times</Link></li>
              <li><Link to="/ministries" className="hover:text-background transition-colors">Ministries</Link></li>
              <li><Link to="/events" className="hover:text-background transition-colors">Events</Link></li>
              <li><Link to="/contact" className="hover:text-background transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>
                    {churchInfo.address}<br />
                    {churchInfo.city}, {churchInfo.state} {churchInfo.zip}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h4 className="font-semibold mb-4">Office Hours</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {churchInfo?.office_hours || 'Mon-Fri: 9AM-5PM\nSaturday: 9AM-12PM'}
            </p>
          </div>
        </div>

        <div className="border-t border-muted-foreground/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {churchInfo?.church_name || 'I Care Center - Refuge'}. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart className="h-4 w-4 text-primary" /> for our community
          </p>
        </div>
      </div>
    </footer>
  );
}

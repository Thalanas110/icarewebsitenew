import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const navLinks = [
  {
    href: '/',
    label: 'Home',
    subLinks: [
      { href: '/', label: 'Welcome' },
      { href: '/#about', label: 'About Us' },
      { href: '/#location', label: 'Visit Us' },
    ]
  },
  {
    href: '/about',
    label: 'About',
    subLinks: [
      { href: '/about#story', label: 'Our Story' },
      { href: '/about#mission', label: 'Mission & Vision' },
      { href: '/about#values', label: 'Core Values' },
      { href: '/about#pastor', label: 'Leadership' },
    ]
  },
  {
    href: '/services',
    label: 'Services',
    subLinks: [
      { href: '/services#service-times', label: 'Service Times' },
      { href: '/services#expect', label: 'What to Expect' },
      { href: '/services#location', label: 'Location' },
    ]
  },
  {
    href: '/ministries',
    label: 'Ministries',
    subLinks: [
      { href: '/ministries', label: 'All Ministries' },
      { href: '/ministries#church-ministries', label: 'Church Ministries' },
      { href: '/ministries#outreaches', label: 'Outreaches' },
    ]
  },
  {
    href: '/events',
    label: 'Events',
    subLinks: [
      { href: '/events#events-list', label: 'Upcoming Events' },
      { href: '/events#newsletter', label: 'Stay Updated' },
    ]
  },
  {
    href: '/sermons',
    label: 'Sermons',
    subLinks: [
      { href: '/sermons#sermons-list', label: 'Latest Sermons' },
      { href: '/sermons#livestream', label: 'Watch Live' },
    ]
  },
  {
    href: '/gallery',
    label: 'Gallery',
    subLinks: [
      { href: '/gallery#gallery-grid', label: 'Photo Gallery' },
    ]
  },
  {
    href: '/giving',
    label: 'Giving',
    subLinks: [
      { href: '/giving#ways-to-give', label: 'Ways to Give' },
    ]
  },
  {
    href: '/contact',
    label: 'Contact',
    subLinks: [
      { href: '/contact', label: 'Get in Touch' },
      { href: '/contact#contact-info', label: 'Contact Info' },
    ]
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isModerator } = useAuth();

  const handleParentClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    navigate(href);
    window.scrollTo(0, 0);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between relative">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/icc logo no bg.png" alt="REFUGE Logo" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav - Absolutely Centered */}
          <div className="hidden 2xl:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <NavigationMenu key={link.href} className="list-none">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    {link.subLinks ? (
                      <>
                        <NavigationMenuTrigger
                          className={`bg-transparent ${location.pathname.startsWith(link.href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                          onClick={(e) => handleParentClick(e, link.href)}
                        >
                          {link.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[200px] gap-2 p-4 bg-popover text-popover-foreground rounded-md shadow-md">
                            {link.subLinks.map((subLink) => (
                              <li key={subLink.href}>
                                <Link
                                  to={subLink.href}
                                  className="block p-2 hover:bg-muted rounded-md text-sm font-medium"
                                >
                                  {subLink.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link to={link.href}>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle() + ` bg-transparent ${location.pathname === link.href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {(isAdmin || isModerator) && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="hidden 2xl:flex">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            {!user && (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="hidden 2xl:flex">
                  Login
                </Button>
              </Link>
            )}
            <Link to="/contact">
              <Button size="sm" className="hidden 2xl:flex">
                Plan Your Visit
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="2xl:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="2xl:hidden py-4 border-t max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col space-y-2 px-4">
              <Accordion type="single" collapsible className="w-full">
                {navLinks.map((link) => (
                  link.subLinks ? (
                    <AccordionItem value={link.label} key={link.label} className="border-b-0">
                      <AccordionTrigger className="hover:no-underline py-2 text-base font-medium">
                        {link.label}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="flex flex-col space-y-2 pl-4">
                          {link.subLinks.map((subLink) => (
                            <li key={subLink.href}>
                              <Link
                                to={subLink.href}
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                              >
                                {subLink.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <div key={link.href} className="py-2">
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex flex-1 items-center justify-between py-2 text-base font-medium transition-all hover:underline ${location.pathname === link.href
                          ? 'text-primary'
                          : 'text-foreground'
                          }`}
                      >
                        {link.label}
                      </Link>
                    </div>
                  )
                ))}
              </Accordion>

              {(isAdmin || isModerator) && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="px-0 py-4 text-base font-medium text-muted-foreground hover:text-foreground flex items-center"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              )}
              {!user && (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="px-0 py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                >
                  Login
                </Link>
              )}
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                <Button size="sm" className="w-full mt-4">
                  Plan Your Visit
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

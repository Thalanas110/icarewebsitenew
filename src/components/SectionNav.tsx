import { useLocation } from 'react-router-dom';

interface SectionNavProps {
  sections: {
    id: string;
    label: string;
  }[];
}

export function SectionNav({ sections }: SectionNavProps) {
  const location = useLocation();

  // Only show on specific pages where sections exist
  const showSectionNav = ['/', '/about', '/services', '/events', '/ministries'].includes(location.pathname);

  if (!showSectionNav) return null;

  const handleClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-1 py-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className="px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

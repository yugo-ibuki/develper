import { Github, Globe } from 'lucide-react';
import { CreatorLink } from './CreatorLink';

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">
            Created by <span className="font-semibold">yugo-ibuki</span>
          </p>
          <div className="flex items-center gap-6">
            <CreatorLink href="https://github.com/yugo-ibuki" icon={<Github size={18} />}>
              GitHub
            </CreatorLink>
            <CreatorLink href="https://y-ibuki91.app" icon={<Globe size={18} />}>
              Website
            </CreatorLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
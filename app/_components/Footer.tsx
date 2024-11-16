import { CreatorLink } from '@/components/CreatorLink';
import { Github, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-8 py-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
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

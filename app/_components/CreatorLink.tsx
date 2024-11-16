import Link from 'next/link';
import type React from 'react';

interface CreatorLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function CreatorLink({ href, icon, children }: CreatorLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-blue-600"
    >
      {icon}
      {children}
    </Link>
  );
}

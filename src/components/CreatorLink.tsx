import React from 'react';

interface CreatorLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function CreatorLink({ href, icon, children }: CreatorLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
    >
      {icon}
      {children}
    </a>
  );
}
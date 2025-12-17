'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface TourBreadcrumbsProps {
  tourTitle: string;
  tourSlug: string;
  className?: string;
}

export default function TourBreadcrumbs({ tourTitle, tourSlug, className = '' }: TourBreadcrumbsProps) {

  return (
    <nav 
      className={`flex items-center text-sm text-gray-600 ${className}`}
      aria-label="Breadcrumb"
    >
      <Link 
        href={'/'} 
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home className={'w-4 h-4 mr-1'} />
        {'Home'}
      </Link>
      
      <ChevronRight className={'w-4 h-4 text-gray-400 mx-2'} />
      
      <Link 
        href={'/tours'} 
        className="hover:text-blue-600 transition-colors"
      >
        {'Tours'}
      </Link>
      
      <ChevronRight className={'w-4 h-4 text-gray-400 mx-2'} />
      
      <span className="text-gray-900 font-medium truncate max-w-xs" title={tourTitle}>
        {tourTitle}
      </span>
    </nav>
  );
}

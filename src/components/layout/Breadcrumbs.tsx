import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-amber-800 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {isLast ? (
                <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-md">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-amber-800 transition-colors truncate max-w-[150px]"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

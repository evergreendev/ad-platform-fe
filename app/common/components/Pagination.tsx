"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface PaginationProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

const Pagination = ({ totalCount, pageSize, currentPage }: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / pageSize);
  const [goToPage, setGoToPage] = useState("");
  const router = useRouter();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("Page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(goToPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      router.push(createPageUrl(page));
      setGoToPage("");
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={createPageUrl(i)}
          className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
            currentPage === i
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </Link>
      );
    }
    return pages;
  };

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <Link
          href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            currentPage <= 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Previous
        </Link>
        <Link
          href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Next
        </Link>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{" "}
            of <span className="font-medium">{totalCount}</span> results
          </p>
          
          <form onSubmit={handleGoToPage} className="flex items-center gap-2">
            <label htmlFor="goToPage" className="text-sm text-gray-700">Go to page:</label>
            <input
              id="goToPage"
              type="number"
              min="1"
              max={totalPages}
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Go
            </button>
          </form>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm gap-2" aria-label="Pagination">
            <Link
              href={currentPage > 1 ? createPageUrl(1) : "#"}
              className={`relative inline-flex items-center rounded-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <span className="sr-only">First</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M15.79 5.23a.75.75 0 01-.02 1.06L11.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02zM10.29 5.23a.75.75 0 01-.02 1.06L6.332 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
              className={`relative inline-flex items-center rounded-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage <= 1 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </Link>
            {renderPageNumbers()}
            <Link
              href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
              className={`relative inline-flex items-center rounded-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href={currentPage < totalPages ? createPageUrl(totalPages) : "#"}
              className={`relative inline-flex items-center rounded-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <span className="sr-only">Last</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02zM9.71 14.77a.75.75 0 01.02-1.06L13.668 10 9.73 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;

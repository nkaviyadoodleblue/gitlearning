import React, { useState } from 'react';
// The import below has been updated to use a CDN to resolve the module error.
import ReactPaginate from 'react-paginate';

// --- Reusable Pagination Component ---
// This component is designed to be a reusable pagination bar.
// It's styled with Tailwind CSS and is highly customizable through props.

interface PaginationProps {
    /** The total number of pages. */
    pageCount: number;
    /** Function to call when a page is changed. Receives the new page number (0-indexed). */
    onPageChange: (selectedPage: number) => void;
    /** The currently active page (0-indexed). */
    currentPage: number;
    /** The number of pages to display on each side of the current page. */
    pageRangeDisplayed?: number;
    /** The number of pages to display for margin pages (at the beginning and end). */
    marginPagesDisplayed?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
    pageCount,
    onPageChange,
    currentPage = 1,
    pageRangeDisplayed = 3,
    marginPagesDisplayed = 1,
}) => {
    // Handler for the page change event from react-paginate
    const handlePageClick = (event: { selected: number }) => {
        onPageChange(event.selected + 1);
    };

    return (
        <ReactPaginate
            // A key to force re-render when the active page changes, ensuring styles update.
            key={`pagination-${currentPage}`}
            // The label for the "previous" page button.
            previousLabel={
                <span className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200 transition-colors">
                    &lt;
                </span>
            }
            // The label for the "next" page button.
            nextLabel={
                <span className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200 transition-colors">
                    &gt;
                </span>
            }
            // The label for the page break "..."
            breakLabel="..."
            // The total number of pages.
            pageCount={pageCount}
            // The number of pages to display on each side of the current page.
            pageRangeDisplayed={pageRangeDisplayed}
            // The number of pages to display at the beginning and end.
            marginPagesDisplayed={marginPagesDisplayed}
            // The function to call when a page is clicked.
            onPageChange={handlePageClick}
            // By passing initialPage or forcePage, we can programmatically set the active page.
            // `currentPage` is 0-indexed.
            forcePage={currentPage - 1}
            // A flag to prevent rendering if there is only one page.
            renderOnZeroPageCount={null}

            // --- Tailwind CSS Styling Classes ---
            // These props allow us to style every part of the component.

            // Class for the main pagination container (the `<ul>` element).
            containerClassName="flex items-center justify-center mt-8 space-x-1 font-sans"

            // Class for the `<li>` element of each page link.
            pageClassName="block"

            // Class for the `<a>` element of each page link.
            pageLinkClassName="flex items-center justify-center w-10 h-10 rounded-md text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"

            // Class for the `<li>` of the active page.
            activeClassName="bg-blue-500 rounded-md text-white shadow-md"

            // Class for the `<a>` of the active page link. We override hover effects here.
            activeLinkClassName="w-10 h-10 flex items-center justify-center text-white hover:bg-blue-500 hover:text-white"

            // Class for the `<li>` of the "previous" button.
            previousClassName="block"

            // Class for the `<a>` of the "previous" button.
            previousLinkClassName="text-gray-500"

            // Class for the `<li>` of the "next" button.
            nextClassName="block"

            // Class for the `<a>` of the "next" button.
            nextLinkClassName="text-gray-500"

            // Class for the `<li>` elements that are disabled (e.g., prev on page 1).
            disabledClassName="opacity-50 cursor-not-allowed"

            // Class for the `<li>` of the page break ("...").
            breakClassName="block"

            // Class for the `<a>` of the page break ("...").
            breakLinkClassName="flex items-center justify-center w-10 h-10 text-gray-500"
        />
    );
};

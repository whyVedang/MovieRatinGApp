export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
      <div className="flex justify-center mt-8 gap-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 cursor-pointer bg-gray-800 rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        {/* Display page numbers */}
        <div className="flex gap-2">
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNum = currentPage <= 3 
              ? i + 1 
              : currentPage + i - 2;
              
            if (pageNum > 0 && pageNum <= totalPages) {
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-4 cursor-pointer py-2 rounded ${
                    currentPage === pageNum ? 'bg-indigo-600' : 'bg-gray-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
            return null;
          })}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 cursor-pointer bg-gray-800 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  }
  
// import PropTypes from "prop-types";

// const Pagination = ({
//   documentsPerPage,
//   totalDocuments,
//   paginate,
//   currentPage,
// }) => {
//   const pageNumbers = [];

//   for (let i = 1; i <= Math.ceil(totalDocuments / documentsPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <nav aria-label="Page navigation example">
//       <ul className="inline-flex -space-x-px text-sm">
//         <li>
//           <button
//             onClick={() => paginate(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`px-3 h-8 leading-tight ${
//               currentPage === 1
//                 ? "text-gray-300 cursor-not-allowed"
//                 : "text-gray-500"
//             } bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
//           >
//             Previous
//           </button>
//         </li>
//         {pageNumbers.map((number) => (
//           <li key={number}>
//             <button
//               onClick={() => paginate(number)}
//               className={`px-3 h-8 leading-tight ${
//                 currentPage === number
//                   ? "text-blue-600 bg-blue-200 border-blue-300"
//                   : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//               }`}
//             >
//               {number}
//             </button>
//           </li>
//         ))}
//         <li>
//           <button
//             onClick={() => paginate(currentPage + 1)}
//             disabled={currentPage === pageNumbers.length}
//             className={`px-3 h-8 leading-tight ${
//               currentPage === pageNumbers.length
//                 ? "text-gray-300 cursor-not-allowed"
//                 : "text-gray-500"
//             } bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
//           >
//             Next
//           </button>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// Pagination.propTypes = {
//   documentsPerPage: PropTypes.number,
//   totalDocuments: PropTypes.number,
//   paginate: PropTypes.func,
//   currentPage: PropTypes.number,
// };

// export default Pagination;
import PropTypes from "prop-types";

const Pagination = ({
  documentsPerPage,
  totalDocuments,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalDocuments / documentsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav aria-label="Page navigation example">
      <ul className="inline-flex -space-x-px text-sm">
        <li>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 h-10 leading-tight rounded-md shadow-md transition-colors duration-200 ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed bg-gray-100"
                : "text-white bg-blue-500 hover:bg-blue-500"
            } border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 h-10 leading-tight rounded-md shadow-md transition-colors duration-200 ${
                currentPage === number
                  ? "text-white bg-blue-600 border-blue-600"
                  : "text-gray-600 bg-white hover:bg-blue-100 hover:text-blue-600"
              } border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
            className={`px-4 py-2 h-10 leading-tight rounded-md shadow-md transition-colors duration-200 ${
              currentPage === pageNumbers.length
                ? "text-gray-300 cursor-not-allowed bg-gray-100"
                : "text-white bg-blue-600 hover:bg-blue-500"
            } border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  documentsPerPage: PropTypes.number,
  totalDocuments: PropTypes.number,
  paginate: PropTypes.func,
  currentPage: PropTypes.number,
};

export default Pagination;

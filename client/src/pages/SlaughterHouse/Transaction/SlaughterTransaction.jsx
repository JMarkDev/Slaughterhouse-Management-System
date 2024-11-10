import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import {
  getAnimals,
  searchTransaction,
  getTransactionBySlaughterhouse,
  filterByStatus,
  filterAnimalsByType,
  // filterByDateRange,
} from "../../../services/animalsSlice";
import { useDispatch, useSelector } from "react-redux";
import TransactionTable from "../../../components/table/TransactionTable";
import Pagination from "../../../components/Pagination";
import { getUserData } from "../../../services/authSlice";
import Dropdown from "../../../components/dropdown/Dropdown";
import AnimalDropdown from "../../../components/dropdown/AnimalsDropdown";

const SlaughterTransaction = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserData);
  const animals = useSelector(getAnimals);
  const [searchTerm, setSearchTerm] = useState("");
  const [animalsList, setAnimalsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");

  const dataPerPage = 5;

  useEffect(() => {
    if (searchTerm) {
      dispatch(
        searchTransaction({
          name: searchTerm,
          type: "Cattle",
          slaughterhouseId: user?.id,
        })
      );
    } else {
      dispatch(getTransactionBySlaughterhouse(user?.id));
    }
  }, [dispatch, searchTerm, user]);

  useEffect(() => {
    if (animals) {
      setAnimalsList(animals);
    }
  }, [animals]);

  const fetchUpdate = () => {
    dispatch(getTransactionBySlaughterhouse(user?.id));
  };

  const handleFilter = (status) => {
    if (status === "Default") {
      dispatch(getTransactionBySlaughterhouse(user?.id));
      return;
    }
    dispatch(filterByStatus({ status: status, slaughterhouseId: user?.id }));
  };

  const handleFilterByAnimal = (animal) => {
    if (animal === "Default") {
      dispatch(getTransactionBySlaughterhouse(user?.id));
      return;
    }
    dispatch(filterAnimalsByType({ type: animal, slaughterhouseId: user?.id }));
  };

  // const handleFilterByDate = () => {
  //   dispatch(
  //     filterByDateRange({ startDate, endDate, slaughterhouseId: user?.id })
  //   );
  // };

  // Paganation
  const indexOfLastDocument = currentPage * dataPerPage;
  const indexOfFirstDocument = indexOfLastDocument - dataPerPage;
  const currentData = animalsList?.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex justify-end items-end gap-5  flex-col">
        <div className=" flex lg:flex-row flex-col justify-end w-full items-end relative gap-3">
          <div className=" flex max-w-[450px] w-full  items-center relative">
            <input
              type="text"
              placeholder="Search Transaction ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-blue-500 focus:border-blue  rounded-xl w-full bg-gray-100 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <IoSearch className="text-2xl absolute right-2 text-gray-600" />
          </div>

          <div className="flex justify-center items-center gap-3">
            <AnimalDropdown handleFilter={handleFilterByAnimal} />
            <Dropdown handleFilter={handleFilter} />
          </div>
        </div>
        {/* <div className="flex justify-end gap-3 items-center">
          <div className="flex flex-col  md:w-1/3">
            <div className="relative ">
              <input
                type="date"
                id="from_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`border-blue-500 
                           block  w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                placeholder=" "
              />
              <label
                htmlFor="from_date"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                From
              </label>
            </div>
          </div>
          <div className="flex flex-col  md:w-1/3">
            <div className="relative ">
              <input
                type="date"
                id="to_date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`border-blue-500 
                           block  w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                placeholder=" "
              />
              <label
                htmlFor="to_date"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                To
              </label>
            </div>
          </div>

          <button
            onClick={handleFilterByDate}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm text-nowrap px-2 mr-0 py-2 rounded-lg"
          >
            Filter by Date
          </button>
        </div> */}
      </div>
      <div className="mt-8">
        <TransactionTable animalsList={currentData} fetchUpdate={fetchUpdate} />
        <div className="flex justify-end mt-5">
          <Pagination
            dataPerPage={dataPerPage}
            totalData={animalsList?.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default SlaughterTransaction;

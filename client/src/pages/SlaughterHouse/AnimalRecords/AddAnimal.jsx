import PropTypes from "prop-types";
import api from "../../../api/axios";
import LoginLoading from "../../../components/loader/loginloader/LoginLoading";
import { useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import LocationInput from "../../../components/Location";
import { getUserData } from "../../../services/authSlice";
import {
  getCustomer,
  searchCustomer,
  clearSearch,
} from "../../../services/animalsSlice";
import SuccessModal from "../../../components/SuccessModal";
import transactionStatus from "../../../constants/transactionStatus";
import io from "socket.io-client";
const socket = io.connect(`${api.defaults.baseURL}`);

const AddAnimal = ({ closeModal, fetchUpdate }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector(getUserData);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const customers = useSelector(getCustomer);
  const [total, setTotal] = useState(0.0);
  const [balance, setBalance] = useState(0.0);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  const [animals, setAnimals] = useState([
    {
      type: "",
      condition: "",
      slaughterDate: "",
      weight: "",
      pricePerKg: "",
      total: 0.0,
      paidAmount: 0.0,
      balance: 0.0,
      status: null,
      number_of_heads: 0.0,
    },
  ]);
  const [data, setData] = useState({
    customerName: "",
    customerAddress: location,
    customerPhone: "",
    slaughterhouseId: user?.id,
    // animals: [
    //   {
    //     type: "",
    //     condition: "",
    //     slaughterDate: "",
    //     weight: "",
    //     pricePerKg: "",
    //     total: 0.0,
    //     paidAmount: 0.0,
    //     balance: 0.0,
    //     status: null,
    //     slaughterhouseId: user?.id,
    //     number_of_heads: 0.0,
    //   },
    // ],
  });

  const conditions = [
    "Healthy",
    "Lame (Lumpo)",
    "Injured",
    // "Infected",
    "Undernourished/Thin",
  ];

  const [customerNameError, setCustomerNameError] = useState("");
  const [customerAddressError, setCustomerAddressError] = useState("");
  const [customerPhoneError, setCustomerPhoneError] = useState("");
  const [animalTypeError, setAnimalTypeError] = useState("");
  const [condtitionError, setConditionError] = useState("");
  const [dateSlaughteredError, setDateSlaughteredError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [pricePerKgError, setPricePerKgError] = useState("");
  const [totalError, setTotalError] = useState("");
  const [paidAmountError, setPaidAmountError] = useState("");
  const [balanceError, setBalanceError] = useState("");
  const [number_of_headsError, setNoOfHeadsError] = useState("");

  const handleAddAnimal = () => {
    setAnimals([
      ...animals,
      {
        type: "",
        condition: "",
        slaughterDate: "",
        weight: "",
        pricePerKg: "",
        total: 0.0,
        paidAmount: 0.0,
        balance: 0.0,
        status: null,
        // slaughterhouseId: user?.id,
        number_of_heads: 0.0,
      },
    ]);
  };

  const handleAnimalChange = (index, field, value) => {
    const updatedAnimals = [...animals];
    updatedAnimals[index] = {
      ...updatedAnimals[index],
      [field]: value,
    };
    setAnimals(updatedAnimals);
  };

  const handleRemoveAnimal = (index) => {
    const updatedAnimals = animals.filter((_, i) => i !== index);
    setAnimals(updatedAnimals);
  };

  useEffect(() => {
    // Calculate total and balance for each animal
    const updatedAnimals = animals.map((animal) => {
      if (!animal.weight || !animal.pricePerKg) {
        return { ...animal, status: null }; // Ensure status is reset if values are missing
      }

      const totalPrice = (animal.weight * animal.pricePerKg).toFixed(2);
      const paidAmount = animal.paidAmount
        ? parseFloat(animal.paidAmount)
        : 0.0;
      const balance = (totalPrice - paidAmount).toFixed(2);

      // Determine the status
      let status;
      if (paidAmount >= parseFloat(totalPrice) && paidAmount !== 0.0) {
        status = transactionStatus.paid;
      } else if (paidAmount < totalPrice && paidAmount !== 0.0) {
        status = transactionStatus.partial;
      } else if (paidAmount === 0.0) {
        status = transactionStatus.unpaid;
      }

      return {
        ...animal,
        total: parseFloat(totalPrice),
        balance: parseFloat(balance),
        status,
      };
    });

    // Only update state if it has actually changed to avoid infinite loops
    if (JSON.stringify(updatedAnimals) !== JSON.stringify(animals)) {
      setAnimals(updatedAnimals);
    }
  }, [animals]);

  console.log(animals);

  const handleLocationChange = (location) => {
    setLocation(location);
    setData({ ...data, customerAddress: location });
  };

  const handleFocus = () => {
    if (data.customerName) {
      setSearchTerm(data.customerName);
    }
  };

  useEffect(() => {
    if (customers) {
      setCustomerList(customers);
    }
  }, [customers]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        dispatch(searchCustomer(searchTerm));
      }
    }, 300); // Adjust debounce delay as needed

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  const handleBlur = () => {
    setCustomerList([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setCustomerNameError("");
    setCustomerAddressError("");
    setCustomerPhoneError("");
    setAnimalTypeError("");
    setConditionError("");
    setDateSlaughteredError("");
    setWeightError("");
    setPricePerKgError("");
    setTotalError("");
    setPaidAmountError("");
    setBalanceError("");

    const updatedData = { ...data, animals: animals };
    console.log(updatedData);

    try {
      const response = await api.post("/animals/add-animal", updatedData);
      console.log(response.data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setId(response.data.newAnimal.id);
        setShowModal(true);
        fetchUpdate();
        closeModal();
        dispatch(clearSearch());
        socket.emit("add_animal", response.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      // if (error.response.data.errors) {
      //   error.response.data.errors.forEach((error) => {
      //     switch (error.path) {
      //       case "customerName":
      //         setCustomerNameError(error.msg);
      //         break;
      //       case "customerAddress":
      //         setCustomerAddressError(error.msg);
      //         break;
      //       case "customerPhone":
      //         setCustomerPhoneError(error.msg);
      //         break;
      //       case "type":
      //         setAnimalTypeError(`Animal ${error.msg}`);
      //         break;
      //       case "condition":
      //         setConditionError(`Animal ${error.msg}`);
      //         break;
      //       case "slaughterDate":
      //         setDateSlaughteredError(error.msg);
      //         break;
      //       case "weight":
      //         setWeightError(error.msg);
      //         break;
      //       case "pricePerKg":
      //         setPricePerKgError(error.msg);
      //         break;
      //       case "total":
      //         setTotalError(error.msg);
      //         break;
      //       case "paidAmount":
      //         setPaidAmountError(error.msg);
      //         break;
      //       case "balance":
      //         setBalanceError(error.msg);
      //         break;

      //       default:
      //         console.log(error);
      //     }
      //   });
      // }
      toast.error(error.response.data.message);
    }
  };

  const closeSuccessModal = () => {
    setShowModal(false);
    closeModal(false);
  };

  return (
    <>
      {showModal ? (
        <SuccessModal
          successModal={showModal}
          closeSuccessModal={closeSuccessModal}
          id={id}
        />
      ) : (
        <div
          id="default-modal"
          tabIndex="-1"
          role="dialog"
          // aria-hidden={!modal}
          className="fixed overflow-y-auto overflow-hidden  inset-0 z-50 px-4 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 font-normal"
        >
          {loading && <LoginLoading />}
          <div className="relative  w-full max-w-2xl max-h-full py-5 ">
            <div className="relative  text-gray-800 bg-white rounded-xl shadow-lg">
              <div className="flex border-b border-gray-300 items-center justify-center">
                <h1 className="md:text-2xl font-bold text-lg p-4">
                  New Animal
                </h1>
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-6 h-6 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => {
                    closeModal(false);
                    dispatch(clearSearch());
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>

              <form action="" method="POST" onSubmit={handleSubmit}>
                <div className="p-6 bg-white space-y-4 text-sm text-[#221f1f]">
                  <h1 className=" text-lg  font-bold text-gray-700">
                    Customer Details
                  </h1>

                  <div className="mb-5 relative">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Customer Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={data.customerName} // Set the input value to the selected customer name
                      onFocus={handleFocus} // Load search on focus
                      onBlur={handleBlur} // Close dropdown on blur
                      onChange={(e) => {
                        setData({ ...data, customerName: e.target.value });
                        setSearchTerm(e.target.value); // Set search term to the input value
                      }}
                      className={` ${
                        customerNameError ? "border-red-500" : "border-gray-300"
                      } border-gray-300 py-2.5 border w-full text-gray-900 text-sm rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder="Customer Name"
                    />
                    {customerList.length > 0 && (
                      <div className="absolute left-0 top-[65px] z-10 border-gray-300 border rounded-lg bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 w-full max-h-40 overflow-y-auto">
                        {customerList.map((customer) => (
                          <div
                            key={customer.id}
                            onMouseDown={() => {
                              setData({
                                ...data,
                                customerName: customer.customerName,
                              });
                              setCustomerList([]); // Close the customer list after selection
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white"
                          >
                            {customer.customerName}
                          </div>
                        ))}
                      </div>
                    )}
                    {customerNameError && (
                      <span className="text-red-500 text-sm">
                        {customerNameError}
                      </span>
                    )}
                  </div>
                  <div className="mb-5 relative">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Address
                    </label>
                    <LocationInput
                      location={location}
                      customerAddressError={customerAddressError}
                      onLocationChange={handleLocationChange}
                    />
                    {customerAddressError && (
                      <span className="text-red-500 text-sm">
                        {customerAddressError}
                      </span>
                    )}
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number
                    </label>
                    <input
                      type="number" // Changed to text to ensure maxLength works properly
                      id="contact_number"
                      value={data.customerPhone || "09"} // Initialize with "09" if empty
                      maxLength={11}
                      onKeyDown={(e) => {
                        // Prevent non-numeric characters and certain symbols
                        if (["-", "e", "E", "+", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        let value = e.target.value;

                        // Ensure the phone number starts with "09"
                        if (!value.startsWith("09")) {
                          value = "09";
                        }

                        // Limit input to 11 characters
                        if (value.length > 11) {
                          value = value.slice(0, 11);
                        }

                        setData({
                          ...data,
                          customerPhone: value,
                        });
                      }}
                      className={` ${
                        customerPhoneError
                          ? "border-red-500"
                          : "border-gray-300"
                      } bg-gray-100 border w-full py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                      placeholder="Customer Phone Number"
                    />
                    {customerPhoneError && (
                      <span className="text-red-500 text-sm">
                        {customerPhoneError}
                      </span>
                    )}
                  </div>

                  <h1 className="mt-4 text-lg font-bold text-gray-700">
                    Animal Transaction Details
                  </h1>

                  {animals.map((animal, index) => (
                    <div key={index} className="mt-5">
                      <div className="mt-5">
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Animal Type
                        </label>
                        <select
                          name=""
                          id=""
                          onChange={(e) =>
                            handleAnimalChange(index, "type", e.target.value)
                          }
                          className={`border-gray-300 ${
                            animalTypeError
                              ? "border-red-500"
                              : "border-gray-300"
                          }
              bg-gray-100 border w-full py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                        >
                          <option value="">Select Animal Type</option>
                          <option value="Cattle">Cattle</option>
                          <option value="Pig">Pig</option>
                          <option value="Goat">Goat</option>
                        </select>
                        {animalTypeError && (
                          <span className="text-red-500 text-sm">
                            {animalTypeError}
                          </span>
                        )}
                      </div>

                      <div className="mt-5 flex items-center gap-3">
                        <div className="w-1/2">
                          <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Animal Condition
                          </label>
                          <select
                            name=""
                            id=""
                            onChange={(e) =>
                              handleAnimalChange(
                                index,
                                "condition",
                                e.target.value
                              )
                            }
                            className={`border-gray-300 ${
                              condtitionError
                                ? "border-red-500"
                                : "border-gray-300"
                            }
              bg-gray-100 border w-full py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                          >
                            <option value="">-- Choose a condition --</option>
                            {conditions.map((condition, index) => (
                              <option key={index} value={condition}>
                                {condition}
                              </option>
                            ))}
                          </select>
                          {condtitionError && (
                            <span className="text-red-500 text-sm">
                              {condtitionError}
                            </span>
                          )}
                        </div>

                        <div className="w-1/2">
                          <label
                            htmlFor="weight"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Total numer of heads
                          </label>
                          <input
                            type="number"
                            id="no_of_heads"
                            onChange={(e) =>
                              handleAnimalChange(
                                index,
                                "no_of_heads",
                                e.target.value
                              )
                            }
                            value={data.number_of_heads}
                            step="0.01" // Allows decimals up to two places
                            className={`${
                              number_of_headsError
                                ? "border-red-500"
                                : "border-gray-300"
                            } bg-gray-100 border w-full py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                            placeholder="Number of heads"
                          />
                          {number_of_headsError && (
                            <span className="text-red-500 text-sm">
                              {number_of_headsError}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 flex gap-3 ">
                        <div className="w-full">
                          <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Date Slaughtered
                          </label>
                          <input
                            type="date"
                            id="name"
                            onChange={(e) =>
                              handleAnimalChange(
                                index,
                                "slaughterDate",
                                e.target.value
                              )
                            }
                            className={`   ${
                              dateSlaughteredError
                                ? "border-red-500"
                                : "border-gray-300"
                            }
      border-gray-300 
              bg-gray-100 border w-full py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                            placeholder="Animal Type"
                          />
                          {dateSlaughteredError && (
                            <span className="text-red-500 text-sm">
                              {dateSlaughteredError}
                            </span>
                          )}
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="weight"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Total Weight (Kg)
                          </label>
                          <input
                            type="number"
                            id="weight"
                            onChange={(e) =>
                              handleAnimalChange(
                                index,
                                "weight",
                                e.target.value
                              )
                            }
                            value={data.weight}
                            step="0.01" // Allows decimals up to two places
                            className={`${
                              weightError ? "border-red-500" : "border-gray-300"
                            } bg-gray-100 border w-full py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                            placeholder="Weight"
                          />
                          {weightError && (
                            <span className="text-red-500 text-sm">
                              {weightError}
                            </span>
                          )}
                        </div>

                        <div className="w-full">
                          <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Price per(Kg)
                          </label>
                          <input
                            type="number"
                            id="name"
                            onChange={(e) =>
                              handleAnimalChange(
                                index,
                                "pricePerKg",
                                e.target.value
                              )
                            }
                            step="0.01"
                            className={`
                        ${
                          pricePerKgError ? "border-red-500" : "border-gray-300"
                        }
      border-gray-300 
              bg-gray-100 border w-full  py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                            placeholder="Price per(Kg)"
                          />
                          {pricePerKgError && (
                            <span className="text-red-500 text-sm">
                              {pricePerKgError}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-5 flex gap-3">
                        <div className="w-full">
                          <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Total Price
                          </label>
                          <input
                            type="number"
                            id="name"
                            onChange={(e) =>
                              handleAnimalChange(index, "total", e.target.value)
                            }
                            pattern="[0-9]*" // Only allows numbers
                            inputMode="numeric" // Opens numeric keyboard on mobile
                            onKeyDown={(e) => {
                              if (
                                e.key === "-" ||
                                e.key === "e" ||
                                e.key === "E" ||
                                e.key === "+" ||
                                e.key === "."
                              ) {
                                e.preventDefault(); // Prevent non-numeric characters
                              }
                            }}
                            value={animal.total}
                            disabled={true}
                            className={`  ${
                              totalError ? "border-red-500" : "border-gray-300"
                            }
      border-gray-300 
              bg-gray-100 cursor-not-allowed border w-full py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                            placeholder="Total Price"
                          />
                          {totalError && (
                            <span className="text-red-500 text-sm">
                              {totalError}
                            </span>
                          )}
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Paid Amount
                          </label>
                          <input
                            type="number"
                            id="name"
                            onChange={(e) =>
                              handleAnimalChange(
                                index,
                                "paidAmount",
                                e.target.value
                              )
                            }
                            step="0.01" // Allows decimals up to two places
                            defaultValue={animal.paidAmount}
                            className={` ${
                              paidAmountError
                                ? "border-red-500"
                                : "border-gray-300"
                            }
      border-gray-300 
              bg-gray-100 border w-full py-2.5 text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                            placeholder="Paid Amount"
                          />
                          {paidAmountError && (
                            <span className="text-red-500 text-sm">
                              {paidAmountError}
                            </span>
                          )}
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Balance
                          </label>
                          <input
                            type="number"
                            id="name"
                            onChange={(e) =>
                              handleAnimalChange(
                                index,
                                "balance",
                                e.target.value
                              )
                            }
                            pattern="[0-9]*" // Only allows numbers
                            inputMode="numeric" // Opens numeric keyboard on mobile
                            onKeyDown={(e) => {
                              if (
                                e.key === "-" ||
                                e.key === "e" ||
                                e.key === "E" ||
                                e.key === "+" ||
                                e.key === "."
                              ) {
                                e.preventDefault(); // Prevent non-numeric characters
                              }
                            }}
                            value={animal.balance}
                            disabled={true}
                            className={` ${
                              balanceError
                                ? "border-red-500"
                                : "border-gray-300"
                            }
      border-gray-300 
              bg-gray-100 border w-full py-2.5 cursor-not-allowed text-gray-900 text-sm rounded-lg border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer `}
                            placeholder="Balance"
                          />
                          {balanceError && (
                            <span className="text-red-500 text-sm">
                              {balanceError}
                            </span>
                          )}
                        </div>
                      </div>

                      {animals.length > 1 && (
                        <div className="mt-5">
                          <button
                            type="button"
                            onClick={() => handleRemoveAnimal(index)}
                            className="bg-red-500 py-2.5 hover:bg-red-700 text-white p-2 px-8 rounded-lg "
                          >
                            Remove Animal
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleAddAnimal}
                      className="bg-main py-2.5 hover:bg-main_hover text-white p-2 px-8 rounded-lg "
                    >
                      Add Another Animal
                    </button>
                  </div>

                  <div className=" pt-4  flex justify-end gap-3">
                    <button
                      onClick={() => {
                        closeModal(false);
                        dispatch(clearSearch());
                      }}
                      type="button"
                      className="bg-gray-500 py-2.5 hover:bg-gray-700 text-white p-2 px-8 rounded-lg "
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-main py-2.5 hover:bg-main_hover text-white p-2 px-8 rounded-lg "
                    >
                      Add Animal
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

AddAnimal.propTypes = {
  modal: PropTypes.func,
  closeModal: PropTypes.func,
  fetchUpdate: PropTypes.func,
};

export default AddAnimal;

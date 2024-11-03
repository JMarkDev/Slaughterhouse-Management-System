export const useFormat = () => {
  // let monthName = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December",
  // ];

  // let monthNameCut = [
  //   "Jan",
  //   "Feb",
  //   "Mar",
  //   "Apr",
  //   "May",
  //   "Jun",
  //   "Jul",
  //   "Aug",
  //   "Sep",
  //   "Oct",
  //   "Nov",
  //   "Dec",
  // ];

  const dateFormat = (date) => {
    // Check if date is null or undefined
    if (!date) {
      return ""; // or return a default value, such as 'N/A'
    }

    // Check if the input is in the {val: "'YYYY/MM/DD HH:MM:SS'"} format
    if (typeof date === "object" && date.val) {
      // Extract the actual date string and remove any single quotes
      date = date.val.replace(/'/g, ""); // Remove the extra quotes
    }

    const parsedDate = new Date(date);
    // console.log(parsedDate);

    // Additional safety check for valid date string
    if (!isNaN(parsedDate)) {
      const localDate = parsedDate.toLocaleString("en-US", {
        timeZone: "Asia/Manila", // Set to your local time zone (Philippine Standard Time)
        hour: "numeric",
        minute: "numeric",
        hour12: true, // Use 12-hour format
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // console.log(parsedDate.getUTCHours());

      // const month = parsedDate.getMonth();
      // const day = parsedDate.getDate();
      // const year = parsedDate.getFullYear();

      // let hour = parsedDate.getUTCHours();

      // const minutes = parsedDate.getMinutes().toString().padStart(2, "0");
      // const period = hour >= 12 ? "PM" : "AM";

      // if (hour > 12) {
      //   hour -= 12;
      // } else if (hour === 0) {
      //   hour = 12;
      // }

      // console.log(hour);

      // Convert to 12-hour format
      // const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

      // return `${monthNameCut[month]} ${day}, ${year}, ${hour}:${minutes} ${period}`;
      return localDate;
    }

    return ""; // Fallback if the date format is incorrect
  };

  const fullDateFormat = (date) => {
    if (date) {
      // Check if date is null or undefined
      if (!date) {
        return ""; // or return a default value, such as 'N/A'
      }

      // Check if the input is in the {val: "'YYYY/MM/DD HH:MM:SS'"} format
      if (typeof date === "object" && date.val) {
        // Extract the actual date string and remove any single quotes
        date = date.val.replace(/'/g, ""); // Remove the extra quotes
      }

      const parsedDate = new Date(date);

      if (!isNaN(parsedDate)) {
        const localDate = parsedDate.toLocaleString("en-US", {
          timeZone: "Asia/Manila", // Set to your local time zone (Philippine Standard Time)
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        return localDate;
      }
    }

    //   console.log(date);
    //   const month = parseInt(date.substring(5, 7), 10) - 1;
    //   const day = date.substring(8, 10);
    //   const year = date.substring(0, 4);

    //   let hour = parseInt(date.substring(11, 13), 10);
    //   const period = hour >= 12 ? "PM" : "AM";
    //   const minutes = date.substring(14, 16);

    //   // convert to 12 hour format
    //   // const formatedHour = hour % 12 === 0 ? 12 : hour % 12;

    //   // if (!hour) {
    //   //   return `${monthName[month]}  ${day}, ${year}`;
    //   // }
    //   if (hour > 12) {
    //     hour -= 12;
    //   } else if (hour === 0) {
    //     hour = 12;
    //   }
    //   return `${monthName[month]}  ${day}, ${year}, ${hour}:${minutes} ${period}`;
    // }
  };

  // const formatDateOnly = (date) => {
  //   if (date) {
  //     const month = parseInt(date.substring(5, 7), 10) - 1;
  //     const day = date.substring(8, 10);
  //     const year = date.substring(0, 4);

  //     return `${monthName[month]}  ${day}, ${year}`;
  //   }
  // };

  return { dateFormat, fullDateFormat };
};
export default useFormat;

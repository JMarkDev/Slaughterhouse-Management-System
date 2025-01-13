// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import PropTypes from "prop-types";

// export default function App({ data }) {
//   // Safely transform data for the chart
//   const transformedData = Array.isArray(data)
//     ? data.map((item) => ({
//         date: item.slaughterDate || "Unknown Date", // Use slaughterDate or fallback
//         pricePerKg: item.pricePerKg || 0, // Default to 0 if missing
//         total: item.total || 0, // Default to 0 if missing
//         weight: item.weight || 0, // Optional: Use 0 if missing
//       }))
//     : [];

//   // Custom Tooltip Formatter
//   const tooltipFormatter = (value, name) => {
//     if (name === "Price Per Kg" || name === "Total") {
//       return `₱${value.toLocaleString()}`; // Add peso sign and format
//     }
//     return value; // Return raw value for other fields (like weight)
//   };

//   return (
//     <div className="overflow-x-auto shadow-xl">
//       <div style={{ minWidth: "800px" }}>
//         <ResponsiveContainer width="100%" height={400}>
//           <LineChart width={800} height={400} data={transformedData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" padding={{ left: 30, right: 30 }} />
//             <YAxis />
//             <Tooltip formatter={tooltipFormatter} /> {/* Custom formatter */}
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="pricePerKg"
//               stroke="#8884d8"
//               name="Price Per Kg"
//               activeDot={{ r: 8 }}
//             />
//             <Line
//               type="monotone"
//               dataKey="total"
//               stroke="#82ca9d"
//               name="Total"
//             />
//             <Line
//               type="monotone"
//               dataKey="weight"
//               stroke="#ff7300"
//               name="Weight"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// App.propTypes = {
//   data: PropTypes.array,
// };
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";

export default function App({ data }) {
  // Safely transform data for the chart
  const transformedData = Array.isArray(data)
    ? data.reduce((acc, item) => {
        const { slaughterDate, noOfHeads = 0, type } = item; // Use correct key

        // Check if a record for the current date already exists
        const existingRecord = acc.find(
          (record) => record.date === slaughterDate
        );
        if (existingRecord) {
          // Update the existing record
          existingRecord[type] = (existingRecord[type] || 0) + noOfHeads;
        } else {
          // Create a new record
          acc.push({
            date: slaughterDate || "Unknown Date", // Use slaughterDate or fallback
            [type]: noOfHeads, // Dynamically set the animal type key
          });
        }
        return acc;
      }, [])
    : [];

  return (
    <div className="overflow-x-auto shadow-xl">
      <div style={{ minWidth: "800px" }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart width={800} height={400} data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" padding={{ left: 30, right: 30 }} />
            <YAxis
              label={{
                value: "Number of Heads",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />

            {/* Dynamically create lines for each animal type */}
            {Object.keys(transformedData[0] || {}).map((key) =>
              key !== "date" ? (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={getRandomColor(key)} // Assign a unique color for each type
                  name={key} // Use the animal type as the name
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Generate random color based on a key (to ensure consistent colors for each type)
const getRandomColor = (key) => {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ff7300",
    "#d84f57",
    "#4f8dd8",
    "#ca82d8",
  ];
  const index = key.charCodeAt(0) % colors.length;
  return colors[index];
};

App.propTypes = {
  data: PropTypes.array,
};

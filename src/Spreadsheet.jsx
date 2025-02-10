import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

const SpreadsheetData = () => {
  const staff = [
    { name: "Abigail" },
    { name: "Alfred" },
    { name: "Amma" },
    { name: "Arnold" },
    { name: "Barbara" },
    { name: "Bernard" },
    { name: "Caleb" },
    { name: "Calvin" },
    { name: "Eric" },
    { name: "Eyram" },
    { name: "Fritz" },
    { name: "Glorious" },
    { name: "James" },
    { name: "Jesse" },
    { name: "Joseph" },
    { name: "Joshua" },
    { name: "Julius" },
    { name: "Justice" },
    { name: "Kelvin" },
    { name: "Kwakye" },
    { name: "Manasseh" },
    { name: "Martin" },
    { name: "Michael" },
    { name: "Mohammed" },
    { name: "Nii" },
    { name: "Philip" },
    { name: "Shelby" },
    { name: "Sanctify" },
    { name: "Trudy" },
  ];
  // Define the date format
  const displayDateFormat = "DD/MM/YYYY";

  // Calculate default dates using Moment.js
  const defaultEndDate = moment();
  const defaultStartDate = moment().subtract(3, "days");

  // Set initial state
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(defaultStartDate.toDate());
  const [endDate, setEndDate] = useState(defaultEndDate.toDate());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://docs.google.com/spreadsheets/d/1TXVYdlIKY9NLZZJAtLLLUcrdd6jwPZXZlA5QIPoeQqg/export?format=csv"
        );
        const csvData = response.data;

        const { data: parsedData } = Papa.parse(csvData, { header: true });

        // Normalize the Timestamp field
        const processedData = parsedData.map((item) => {
          const timestamp = moment(item.Timestamp, "DD/MM/YYYY HH:mm:ss", true); // Adjust to your format
          return {
            ...item,
            Timestamp: timestamp.isValid()
              ? timestamp.format(displayDateFormat)
              : item.Timestamp, // Keep the original if invalid
          };
        });

        setData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const timestamp = moment(item.Timestamp, displayDateFormat, true);

    if (!timestamp.isValid()) {
      console.warn("Invalid date in data:", item.Timestamp);
      return false; // Skip rows with invalid dates
    }

    const startTimestamp = startDate ? moment(startDate) : null;
    const endTimestamp = endDate ? moment(endDate) : null;

    return (
      (!startTimestamp || timestamp.isSameOrAfter(startTimestamp)) &&
      (!endTimestamp || timestamp.isSameOrBefore(endTimestamp))
    );
  });

  // const presentIndividuals = filteredData.map((item) => item["I am"]);
  // const missingIndividuals = staff.filter(
  //   (individual) => !individual.includes(presentIndividuals.name)
  // );
  const presentStaffNames = filteredData.map((item) => item["I am"]);
  const missingIndividuals = staff.filter(
    (member) => !presentStaffNames.includes(member.name)
  );

  return (
    <div>
      <h2>Spreadsheet Data</h2>

      <DatePicker
        selected={startDate}
        onChange={(dates) => {
          const [start, end] = dates;
          setStartDate(start);
          setEndDate(end);
        }}
        selectsRange
        startDate={startDate}
        endDate={endDate}
        dateFormat="dd/MM/yyyy"
        placeholderText={`From ${defaultStartDate.format(
          "DD/MM/YYYY"
        )} to ${defaultEndDate.format("DD/MM/YYYY")}`}
      />
      <p> Number of selections {filteredData.length}</p>
      {missingIndividuals.length > 0 && (
        <div className=" flex  flex-col items-center my-6">
          <div className="w-fit p-2 bg-red-200">
            <h3 className="font-semibold border-b border-black">
              Yet to select
            </h3>
            <ul>
              {missingIndividuals.map((member, index) => (
                <li key={index}>{member.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {filteredData.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                {/* <th>Timestamp</th> */}
                {/* <th>Email address</th> */}
                <th>Name</th>
                {/* <th>Behalf</th> */}
                {/* <th>Menu</th> */}
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  {/* <td>{item["Timestamp"]}</td> */}
                  {/* <td>{item["Email address"]}</td> */}
                  <td>{item["I am"]}</td>
                  {/* <td>{item["Selecting on behalf of"]}</td> */}
                  {/* <td>{item["What menu are you selecting from?"]}</td> */}
                  <td>{item["Monday"] || item["Monday_1"]}</td>
                  <td>{item["Tuesday"] || item["Tuesday_1"]}</td>
                  <td>{item["Wednesday"] || item["Wednesday_1"]}</td>
                  <td>{item["Thursday"] || item["Thursday_1"]}</td>
                  <td>{item["Friday"] || item["Friday_1"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No data within the selected date range.</p>
      )}
    </div>
  );
};

export default SpreadsheetData;

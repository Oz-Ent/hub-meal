import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Papa from "papaparse";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../components/header";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import jsPDF from "jspdf";

const Sorter = () => {
  const [staffList, setStaffList] = useState([]);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(
    moment().subtract(4, "days").toDate()
  );
  const [endDate, setEndDate] = useState(new Date());
  const [disabled, setDisabled] = useState(false);
  const [popup, setPopup] = useState({
    open: false,
    message: "",
    success: true,
  });
  const [showDaySelection, setShowDaySelection] = useState(false);
  const [selectedDays, setSelectedDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://docs.google.com/spreadsheets/d/1TXVYdlIKY9NLZZJAtLLLUcrdd6jwPZXZlA5QIPoeQqg/export?format=csv"
        );
        const { data: parsedData } = Papa.parse(response.data, {
          header: true,
        });

        const processedData = parsedData.map((item) => {
          const timestamp = moment(item.Timestamp, "DD/MM/YYYY HH:mm:ss", true);
          return {
            ...item,
            Timestamp: timestamp.isValid()
              ? timestamp.format("DD/MM/YYYY")
              : item.Timestamp,
          };
        });

        setData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const timestamp = moment(item.Timestamp, "DD/MM/YYYY", true);
      return (
        timestamp.isValid() &&
        timestamp.isBetween(startDate, endDate, undefined, "[]")
      );
    });
  }, [data, startDate, endDate]);

  const presentStaffNames = filteredData.map((item) => item["I am"]);
  const [missingIndividuals, setMissingIndividuals] = useState([]);
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          name: doc.data().firstName,
        }));
        const sortedStaffList = usersData.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        setStaffList(sortedStaffList);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    const normalizedPresent = filteredData.map((item) =>
      item["I am"]?.trim().toLowerCase()
    );

    const missing = staffList.filter((member) => {
      const staffName = member.name?.trim().toLowerCase();
      return staffName && !normalizedPresent.includes(staffName);
    });

    // Avoid setting state if the list hasn't changed
    setMissingIndividuals((prev) => {
      const prevNames = prev
        .map((m) => m.name)
        .sort()
        .join(",");
      const newNames = missing
        .map((m) => m.name)
        .sort()
        .join(",");
      return prevNames !== newNames ? missing : prev;
    });
  }, [filteredData, staffList]);

  console.log("Present Staff Names:", presentStaffNames);
  console.log(
    "All Staff Names:",
    staffList.map((s) => s.name)
  );
  console.log("missing Individuals", missingIndividuals);
  const normalizeText = (text) =>
    text
      .toUpperCase()
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/\u00A0/g, " ") // Replace non-breaking spaces with regular space
      .replace(/[“”‘’]/g, '"') // Normalize fancy quotes if needed
      .trim();

  // Updated renderTable: all selections are custom
  const getSelectionForDay = (item, day) => {
    // Find the first column that starts with the day name and has a value
    const dayColumns = Object.keys(item).filter((key) =>
      key === day || key.startsWith(`${day}_`)
    );
    
    for (const column of dayColumns) {
      if (item[column]) {
        return item[column];
      }
    }
    return null;
  };

  const renderTable = (day) => {
    const customSelections = {};

    filteredData.forEach((item) => {
      const selection = getSelectionForDay(item, day);
      if (selection) {
        const normalizedSelection = normalizeText(selection);
        if (normalizedSelection === "UNAVAILABLE") {
          console.log("Unavailable");
        } else {
          customSelections[normalizedSelection] =
            (customSelections[normalizedSelection] || 0) + 1;
        }
      }
    });

    return (
      <table className="border w-full">
        <thead>
          <tr>
            <th className="border">Menu Selection</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">
              {Object.entries(customSelections).map(
                ([food, count], index, array) => (
                  <div
                    key={food}
                    className={
                      index !== array.length - 1
                        ? "border-b border-slate-300 py-1"
                        : "py-1"
                    }
                  >
                    {count} pack(s) of {food}
                  </div>
                )
              )}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedDays).every(
      (selected) => selected
    );
    const newSelection = {};
    Object.keys(selectedDays).forEach((day) => {
      newSelection[day] = !allSelected;
    });
    setSelectedDays(newSelection);
  };

  const handleDaySelection = (day) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const exportToPDF = async () => {
    setDisabled(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Dates at top right
      const dateText = `Date: ${moment().format("DD/MM/YYYY")}`;
      doc.setFontSize(10);
      doc.text(dateText, pageWidth - doc.getTextWidth(dateText) - 10, 10);

      // Header
      doc.setFontSize(18);
      doc.text("Chosen Menu", pageWidth / 2, y, { align: "center" });
      y += 10;

      // For each selected day, print day and menu selections
      const days = Object.keys(filteredData[0] || {}).filter(
        (day) =>
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
            day
          ) && selectedDays[day]
      );
      doc.setFontSize(14);
      days.forEach((day) => {
        y += 10;
        doc.text(day, 15, y);
        y += 6;
        // Gather selections for this day
        const customSelections = {};
        filteredData.forEach((item) => {
          const selection = getSelectionForDay(item, day);
          if (selection) {
            const normalizedSelection = normalizeText(selection);
            if (normalizedSelection !== "UNAVAILABLE") {
              customSelections[normalizedSelection] =
                (customSelections[normalizedSelection] || 0) + 1;
            }
          }
        });
        doc.setFontSize(11);
        if (Object.keys(customSelections).length === 0) {
          doc.text("No selections", 20, y);
          y += 6;
        } else {
          Object.entries(customSelections).forEach(([food, count]) => {
            doc.text(`${count} pack(s) of ${food}`, 20, y);
            y += 6;
            if (y > 280) {
              doc.addPage();
              y = 20;
            }
          });
        }
      });
      doc.save(
        `menu_selections_${moment(startDate).format("DDMMMYYYY")}_${moment(
          endDate
        ).format("DDMMMYYYY")}.pdf`
      );
      setPopup({
        open: true,
        message: "PDF downloaded successfully!",
        success: true,
      });
      setShowDaySelection(false);
    } catch (error) {
      console.error("PDF export error:", error);
      setPopup({
        open: true,
        message: "PDF download failed. Please try again.",
        success: false,
      });
    } finally {
      setDisabled(false);
      setTimeout(() => setPopup((p) => ({ ...p, open: false })), 4000);
    }
  };

  return (
    <div>
      <div className="">
        <Header />
      </div>
      {/* <h2 className="font-bold text-lg mb-2">Meal Data</h2> */}
      <>
        <div className="flex w-[80vw] flex-row-reverse mt-20 mb-4">
          <button
            onClick={() => setShowDaySelection(true)}
            className="bg-slate-300 py-2 px-3 rounded-lg hover:bg-slate-400 transition-colors"
          >
            Export to pdf
          </button>
        </div>
        <div className="flex items-center justify-center gap-3 mb-2 ">
          <p className="font-semibold ">Date:</p>
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
            className="border-2 rounded-sm px-2"
          />
        </div>
      </>
      <p className="font-semibold mb-3">
        Number of selections: {filteredData.length}
      </p>

      {missingIndividuals.length > 0 && (
        // filteredData.length < staffList.length &&
        <div className="bg-red-200 p-2 w-fit mx-auto">
          <h3 className="border-b border-black mb-1">Yet to select</h3>
          <ul>
            {missingIndividuals.map((member) => (
              <li key={member.name}>{member.name}</li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(filteredData[0] || {})
        .filter((day) =>
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day)
        )
        .map((day) => (
          <>
            <h3
              className="font-semibold mb-2 border-b-2 border-black w-fit mt-6 text-center mx-auto"
              key={day}
            >
              {day}
            </h3>
            <div className="mx-4" key={day}>
              {renderTable(day)}
            </div>
          </>
        ))}
      <></>
      {showDaySelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Select Days to Export
            </h3>

            <div className="space-y-3 mb-6">
              {Object.keys(selectedDays).map((day) => (
                <label
                  key={day}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedDays[day]}
                    onChange={() => handleDaySelection(day)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{day}</span>
                </label>
              ))}
            </div>

            <div className="flex space-x-3 mb-4">
              <button
                onClick={handleSelectAll}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
              >
                {Object.values(selectedDays).every((selected) => selected)
                  ? "Unselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDaySelection(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={exportToPDF}
                disabled={
                  disabled ||
                  !Object.values(selectedDays).some((selected) => selected)
                }
                className={`flex-1 py-2 px-4 rounded transition-colors ${
                  disabled ||
                  !Object.values(selectedDays).some((selected) => selected)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {disabled ? "Exporting..." : "Confirm Export"}
              </button>
            </div>
          </div>
        </div>
      )}

      {popup.open && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white ${
            popup.success ? "bg-green-300" : "bg-red-300"
          }`}
          onClick={() => setPopup((p) => ({ ...p, open: false }))}
          style={{ cursor: "pointer" }}
        >
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default Sorter;

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

  // Deduplicate data by keeping only the most recent entry per person
  const deduplicatedData = useMemo(() => {
    const uniquePeople = new Map();
    
    filteredData.forEach((item) => {
      const name = item["I am"]?.trim().toLowerCase();
      if (name) {
        const timestamp = moment(item.Timestamp, "DD/MM/YYYY", true);
        const existing = uniquePeople.get(name);
        
        // Keep the most recent timestamp
        if (!existing) {
          uniquePeople.set(name, item);
        } else {
          const existingTimestamp = existing.rawTimestampObj || moment(existing.Timestamp, "DD/MM/YYYY", true);
          if (timestamp.isValid() && timestamp.isAfter(existingTimestamp)) {
            uniquePeople.set(name, { ...item, rawTimestampObj: timestamp });
          }
        }
      }
    });
    
    return Array.from(uniquePeople.values());
  }, [filteredData]);

  // Detect duplicates
  const duplicates = useMemo(() => {
    const nameCount = new Map();
    
    filteredData.forEach((item) => {
      const name = item["I am"]?.trim().toLowerCase();
      if (name) {
        nameCount.set(name, (nameCount.get(name) || 0) + 1);
      }
    });
    
    return Array.from(nameCount.entries())
      .filter(([_, count]) => count > 1)
      .map(([name]) => {
        // Find the original cased name from staff list
        const staffMember = staffList.find(
          (s) => s.name?.trim().toLowerCase() === name
        );
        return staffMember?.name || name;
      });
  }, [filteredData, staffList]);

  useEffect(() => {
    const normalizedPresent = deduplicatedData.map((item) =>
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
  }, [deduplicatedData, staffList]);

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

  const getUnavailableCountForDay = (day) => {
    let count = 0;
    deduplicatedData.forEach((item) => {
      const selection = getSelectionForDay(item, day);
      if (selection) {
        const normalizedSelection = normalizeText(selection);
        if (normalizedSelection === "UNAVAILABLE") {
          count++;
        }
      }
    });
    return count;
  };

  const renderTable = (day) => {
    const customSelections = {};
    let unavailableCount = 0;

    deduplicatedData.forEach((item) => {
      const selection = getSelectionForDay(item, day);
      if (selection) {
        const normalizedSelection = normalizeText(selection);
        if (normalizedSelection === "UNAVAILABLE") {
          unavailableCount++;
        } else {
          customSelections[normalizedSelection] =
            (customSelections[normalizedSelection] || 0) + 1;
        }
      }
    });

    return (
      <div className="space-y-4">
        {unavailableCount > 0 && (
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 font-semibold flex items-center gap-2">
              🚫 Unavailable: <span className="text-lg font-bold">{unavailableCount}</span>
            </p>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 border-b border-indigo-500/20">
                <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">
                  🍽️ Menu Selection
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-cyan-400">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/10">
              {Object.entries(customSelections).length > 0 ? (
                Object.entries(customSelections).map(([food, count]) => (
                  <tr key={food} className="hover:bg-slate-800/30 transition duration-200">
                    <td className="px-6 py-4 text-indigo-100 font-medium">
                      {food}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 border border-cyan-500/50 rounded-full text-cyan-300 font-semibold text-sm">
                        {count}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-8 text-center text-indigo-300">
                    {unavailableCount > 0 ? "No selections besides unavailable" : "No selections for this day"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
      const days = Object.keys(deduplicatedData[0] || {}).filter(
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
        deduplicatedData.forEach((item) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <Header />
      
      <div className="pt-20 px-4 pb-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent mb-2">
              Meal Selection Dashboard
            </h1>
            <p className="text-indigo-200">View meal selections and export reports</p>
          </div>

          {/* Controls */}
          <div className="bg-slate-900/50 border border-indigo-500/20 rounded-2xl p-6 mb-8 backdrop-blur-sm relative z-20">
            <div className="flex flex-col lg:flex-row gap-6 items-end">
              {/* Date Picker */}
              <div className="flex-1 relative z-20">
                <label className="block text-sm font-semibold text-indigo-200 mb-2">
                  Select Date Range:
                </label>
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
                  className="w-full px-4 py-2 rounded-lg border border-indigo-500/30 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
                  portalClassName="relative z-50"
                />
              </div>

              {/* Export Button */}
              <button
                onClick={() => setShowDaySelection(true)}
                className="px-8 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg font-semibold transition duration-200 active:scale-95 shadow-lg hover:shadow-cyan-500/50"
              >
                📄 Export to PDF
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-indigo-200 text-sm mb-1">Total Selections (Unique)</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                {deduplicatedData.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-indigo-200 text-sm mb-1">Duplicate Entries</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                {duplicates.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-indigo-200 text-sm mb-1">Pending Selections</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {missingIndividuals.length}
              </p>
            </div>
          </div>

          {/* Missing Individuals */}
          {missingIndividuals.length > 0 && (
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center gap-2">
                ⚠️ Staff Awaiting Selection ({missingIndividuals.length})
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {missingIndividuals.map((member) => (
                  <li
                    key={member.name}
                    className="px-4 py-2 bg-slate-900/50 border border-red-500/20 rounded-lg text-red-200 text-sm"
                  >
                    {member.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Duplicates Section */}
          {duplicates.length > 0 && (
            <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                🔄 Duplicate Entries ({duplicates.length})
              </h3>
              <p className="text-yellow-200/70 text-sm mb-4">
                The following staff members have multiple entries in the selected date range. Most recent selection is used.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {duplicates.map((name) => (
                  <li
                    key={name}
                    className="px-4 py-2 bg-slate-900/50 border border-yellow-500/20 rounded-lg text-yellow-200 text-sm"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meal Selection by Day */}
          <div className="space-y-8">
            {Object.keys(deduplicatedData[0] || filteredData[0] || {})
              .filter((day) =>
                ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day)
              )
              .map((day) => (
                <div key={day}>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent mb-4">
                    📅 {day}
                  </h3>
                  <div className="bg-slate-900/50 border border-indigo-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
                    {renderTable(day)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Day Selection Modal */}
      {showDaySelection && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent mb-6 text-center">
              Select Days to Export
            </h3>

            <div className="space-y-3 mb-8">
              {Object.keys(selectedDays).map((day) => (
                <label
                  key={day}
                  className="flex items-center space-x-3 cursor-pointer px-4 py-2 rounded-lg hover:bg-slate-800/50 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedDays[day]}
                    onChange={() => handleDaySelection(day)}
                    className="w-4 h-4 rounded border-indigo-500 bg-slate-900 cursor-pointer"
                  />
                  <span className="text-indigo-200 font-medium">{day}</span>
                </label>
              ))}
            </div>

            <div className="flex space-x-3 mb-6">
              <button
                onClick={handleSelectAll}
                className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold transition duration-200"
              >
                {Object.values(selectedDays).every((selected) => selected)
                  ? "Unselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDaySelection(false)}
                className="flex-1 py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={exportToPDF}
                disabled={
                  disabled ||
                  !Object.values(selectedDays).some((selected) => selected)
                }
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                  disabled ||
                  !Object.values(selectedDays).some((selected) => selected)
                    ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white active:scale-95"
                }`}
              >
                {disabled ? "Exporting..." : "Confirm Export"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Popup */}
      {popup.open && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-2xl text-white font-semibold cursor-pointer transition duration-300 ${
            popup.success
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-red-500 to-orange-500"
          }`}
          onClick={() => setPopup((p) => ({ ...p, open: false }))}
        >
          {popup.success ? "✓" : "✕"} {popup.message}
        </div>
      )}
    </div>
  );
};

export default Sorter;

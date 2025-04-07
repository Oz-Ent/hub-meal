import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Papa from "papaparse";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../components/header";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";

const menus = {
  MenuA: {
    Monday: [
      "VAMICILIAN RICE WITH CHICKEN STEW",
      "VAMICILIAN RICE WITH FISH STEW",
      "SWEET POTATOES WITH CHICKEN (SEASONAL)",
      "SWEET POTATOES WITH FISH (SEASONAL)",
      "BEANS STEW WITH RIPE PLANTAIN",
      "BEANS STEW WITH RICE",
      "GARDEN EGG STEW WITH YAM",
    ],
    Tuesday: [
      "WAAKYE WITH MEAT",
      "WAAKYE WITH FISH",
      "WAAKYE WITH CHICKEN",
      "BANKU WITH OKRO STEW AND MEAT",
      "BANKU WITH OKRO STEW AND FISH",
      "JOLLOF WITH GRILLED CHICKEN",
      "CLUB SANDWICH",
    ],
    Wednesday: [
      "GARIF)T) WITH CHICKEN",
      "PALAVA SAUCE WITH RICE",
      "PALAVA SAUCE WITH RIPE PLANTAIN",
      "KENKEY WITH FRIED FISH",
      "KENKEY WITH SAUSAGES",
      "KENKEY WITH SARDINE AND EGGS",
      "CABBAGE STEW WITH RICE",
      "CABBAGE STEW WITH YAM",
    ],
    Thursday: [
      "INDOMIE",
      "GOAT JOLLOF",
      "OMOTUO WITH GROUNDNUT SOUP",
      "EGG STEW WITH RICE",
      "EGG STEW WITH YAM",
    ],
    Friday: [
      "NOODLES(CHICKEN)",
      "BANKU WITH GRILLED TILAPIA",
      "FUFU WITH CHICKEN LIGHT SOUP",
      "FUFU WITH TILAPIA LIGHT SOUP",
      "FRIED RICE WITH BEEF SAUCE",
    ],
  },
  MenuB: {
    Monday: [
      "JOLLOF WITH GIZZARD AND PLANTAIN",
      "OMOTUO WITH TURKEY(GROUNDNUT SOUP)",
      "FRIED YAM WITH CHICKEN",
      "FRIED YAM WITH FISH",
      "CHICKEN SALAD",
      "TUNA SALAD",
    ],
    Tuesday: [
      "RICE WITH TURKEY STEW",
      "RICE WITH FISH STEW",
      "FRIEDRICE WITH GRILLED CHICKEN",
      "FANTE-FANTE AND BANKU",
      "NOODLES",
    ],
    Wednesday: [
      "ANGUAMU",
      "AMPESI",
      "CHICKEN STEW WITH RICE",
      "FISH STEW WITH RICE",
      "GOAT JOLLOF",
    ],
    Thursday: [
      "EGG STEW WITH RICE",
      "TUO ZAAFI",
      "KENKEY WITH SARDINES AND EGGS",
      "KENKEY WITH FISH",
      "KENKEY WITH SAUSAGES AND EGGS",
      "SANDWICH",
    ],
    Friday: [
      "GARIF)T)",
      "BANKU WITH GRILLED TILPIA",
      "FUFU WITH GROUNDNUT SOUP",
      "SWEET POTATOES WITH CHICKEN",
    ],
  },
};
const Sorter = () => {
  const [staffList, setStaffList] = useState([]);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(
    moment().subtract(3, "days").toDate()
  );
  const [endDate, setEndDate] = useState(new Date());
  const [disabled, SetDisabled] = useState(false);

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

  const renderTable = (day) => {
    const menuSelections = {};
    const customSelections = {};

    filteredData.forEach((item) => {
      const menuType =
        item["What menu are you selecting from?"] === "Menu One"
          ? "MenuA"
          : "MenuB";
      const menuFoods = menus[menuType][day] || [];
      const selection = item[day] || item[`${day}_1`];

      if (selection) {
        const normalizedSelection = normalizeText(selection);
        const normalizedMenuFoods = menuFoods.map((food) =>
          normalizeText(food)
        );
        if (normalizedMenuFoods.includes(normalizedSelection)) {
          menuSelections[normalizedSelection] =
            (menuSelections[normalizedSelection] || 0) + 1;
        } else {
          if (normalizedSelection === "UNAVAILABLE") {
            console.log("Unavailable");
          } else {
            customSelections[normalizedSelection] =
              (customSelections[normalizedSelection] || 0) + 1;
          }
        }
      }
    });

    return (
      <table className="border w-full">
        <thead>
          <tr>
            <th className="border">Menu</th>
            <th className="border">Custom Menu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">
              {Object.entries(menuSelections).map(
                ([food, count], index, array) => (
                  <div
                    key={food}
                    className={
                      index !== array.length - 1
                        ? "border-b border-slate-300 py-1"
                        : "py-1"
                    }
                  >
                    {count} - {food}
                  </div>
                )
              )}
            </td>
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

  return (
    <div>
      <div className="">
        <Header />
      </div>
      {/* <h2 className="font-bold text-lg mb-2">Meal Data</h2> */}
      <>
        <div className="flex w-[80vw] flex-row-reverse mt-20 mb-4">
          <button
            onClick={() => {
              // signOut(auth);
              // navigate("/login");
              SetDisabled(true);
            }}
            className={`${
              disabled
                ? "text-gray-400 bg-slate-200 py-2 px-3 rounded-lg"
                : "bg-slate-300 py-2 px-3 rounded-lg"
            }`}
            disabled={disabled}
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

      {Object.keys(menus.MenuA).map((day) => (
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
    </div>
  );
};

export default Sorter;

import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./components/firebase";

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
  { name: "Gerald" },
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
const Sorter = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(
    moment().subtract(3, "days").toDate()
  );
  const [endDate, setEndDate] = useState(new Date());
  const navigate=useNavigate();
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

  const filteredData = data.filter((item) => {
    const timestamp = moment(item.Timestamp, "DD/MM/YYYY", true);
    return (
      timestamp.isValid() &&
      timestamp.isBetween(startDate, endDate, undefined, "[]")
    );
  });

  const presentStaffNames = filteredData.map((item) => item["I am"]);
  const missingIndividuals = staff.filter(
    (member) => !presentStaffNames.includes(member.name)
  );

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
        if (menuFoods.includes(selection)) {
          menuSelections[selection] = (menuSelections[selection] || 0) + 1;
        } else {
          if (selection == "UNAVAILABLE") {
            menuSelections[menuFoods.at(0)] =
              (menuSelections[menuFoods.at(0)] || 0) + 1;
            // customSelections[selection] =
            //   (customSelections[selection] || 0) + 1;
            // console.log("menufoods", menuFoods.at(1));
          } else
            customSelections[selection] =
              (customSelections[selection] || 0) + 1;
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
      <div>
        <button onClick={()=>{signOut(auth);navigate('/')}}>Log out</button>
      </div>
      <h2 className="font-bold text-lg mb-2">Meal Data</h2>
      <div className="flex items-center justify-center gap-3 mb-2">
        <p className="font-semibold">Date:</p>
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
      <p className="font-semibold mb-3">
        Number of selections: {filteredData.length}
      </p>

      {missingIndividuals.length > 0 && filteredData.length < 30 && (
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
          <div key={day}>{renderTable(day)}</div>
        </>
      ))}
      <></>
    </div>
  );
};

export default Sorter;

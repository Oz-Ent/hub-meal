import "./App.css";
import Login from "./components/Login";
import Sorter from "./sorter";
// import { useAuth } from "./components/authContext";
// import { Outlet, Router, Routes } from "react-router-dom";
// import SpreadsheetData from "./Spreadsheet";

// // 1TXVYdlIKY9NLZZJAtLLLUcrdd6jwPZXZlA5QIPoeQqg

// // 12345689abcdfgd

// function App() {
//   return (
//     <>
//       {/* <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p> */}
//       {/* <SpreadsheetData /> */}
//       {/* <Sorter /> */}
//       {/* <Login /> */}
//       <Router>
//         <Routes>
//           <Route path="/" element={<Login/>}/>
//           <Route path="/recover" element={<Register/>}/>
//           <Route path="/sort" element={<Sorter/>}/>
//         </Routes>
//       </Router>
//       <Outlet/>
//     </>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Recover from "./components/Recover";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recover" element={<Recover />} />
        <Route path="/sort" element={<Sorter />} />
      </Routes>
    </Router>
  );
}

export default App;


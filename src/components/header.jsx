import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className=" flex flex-row justify-around  md:fixed w-[100vw] bg-[#94cebf] top-0 z-10 items-center py-2">
      <h2
        className="font-bold text-lg mb-2 hover:cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        Meal Data
      </h2>
      <div className="flex gap-2">
        <button
          onClick={() => {
            navigate("/users");
          }}
          className="py-2 px-3 bg-slate-50 rounded-lg"
        >
          Users
        </button>
        <button
          onClick={() => {
            signOut(auth);
            navigate("/login");
          }}
          className="p-2 bg-slate-50 rounded-lg"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Header;

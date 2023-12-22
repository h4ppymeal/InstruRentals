import { Link, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import InstrumentImg from "../InstrumentImg";

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState([]);
  useEffect(() => {
    axios.get("/user-instruments").then(({ data }) => {
      setInstruments(data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={"/account/instruments/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            dataslot="icon"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new instrument
        </Link>
      </div>
      <div className="mt-4">
        {instruments.length > 0 &&
          instruments.map((instrument) => (
            <Link
              to={"/account/instruments/" + instrument._id}
              className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
            >
              <div className="flex w-32 h-32 bg-gray-300 shrink-0">
                <InstrumentImg instrument={instrument} />
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl">{instrument.title}</h2>
                <p className="text-sm mt-2">{instrument.description}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

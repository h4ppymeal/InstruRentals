import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [instruments, setInstruments] = useState([]);
  useEffect(() => {
    axios.get("/instruments").then((response) => {
      setInstruments(response.data);
    });
  }, []);
  return (
    // html: thing that structures the entire webpage
    <div className="mt-8 grid gap-6 gap-x-6 gap-y-8 grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {instruments.length > 0 &&
        instruments.map((instrument) => (
          <Link to={"/instrument/" + instrument._id}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              {instrument.photos?.[0] && (
                <img
                  className="rounded-2xl object-cover aspect-square"
                  src={
                    "http://localhost:4000/uploads/" + instrument.photos?.[0]
                  }
                  alt=""
                />
              )}
            </div>
            <h3 className="font-bold">{instrument.title}</h3>
            <h2 className="text-sm text-gray-500">{instrument.address}</h2>
            <div className="mt-1">
              <span className="font-bold">${instrument.price}</span> per day
            </div>
          </Link>
        ))}
    </div>
  );
}

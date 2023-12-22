import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import InstrumentImg from "../InstrumentImg";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import RentalDates from "../RentalDates";

export default function RentalsPage() {
  const [rentals, setRentals] = useState([]);
  //runs function when page is first loaded (second param = [])
  useEffect(() => {
    axios.get("/rentals").then((response) => {
      setRentals(response.data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div>
        {rentals?.length > 0 &&
          rentals.map((rental) => (
            <Link
              to={`/account/rentals/${rental._id}`}
              className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden"
            >
              <div className="w-48">
                <InstrumentImg instrument={rental.instrument} />
              </div>
              <div className="py-3 pr-3 grow">
                <h2 className="text-xl">{rental.instrument.title}</h2>
                <div className="flex gap-2 items-center border-t border-gray-300 mt-2 py-2"></div>
                <div className="text-xl">
                  <RentalDates
                    rental={rental}
                    className="mb-2 mt-4 text-gray-500"
                  />
                  <div className="flex gap-1 text-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <span className="text-2xl">
                      Total cost: ${rental.price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

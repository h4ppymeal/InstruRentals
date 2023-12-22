import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import InstrumentGallery from "../InstrumentGallery";
import RentalDates from "../RentalDates";

export default function RentalPage() {
  const { id } = useParams();
  const [rental, setRental] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get("/rentals").then((response) => {
        const foundRental = response.data.find(({ _id }) => _id === id);
        if (foundRental) {
          setRental(foundRental);
        }
      });
    }
  }, [id]);

  if (!rental) {
    return "";
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{rental.instrument.title}</h1>
      <AddressLink className="my-2 block">
        {rental.instrument.address}
      </AddressLink>
      <div className="bg-gray-200 p-6 mb-4 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your rental information</h2>
          <RentalDates rental={rental} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total Price:</div>
          <div className="text-3xl">${rental.price}</div>
        </div>
      </div>
      <InstrumentGallery instrument={rental.instrument} />
    </div>
  );
}

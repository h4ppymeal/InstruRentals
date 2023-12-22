import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidget from "../RentingWidget";
import InstrumentGallery from "../InstrumentGallery";
import AddressLink from "../AddressLink";

export default function InstrumentPage() {
  const { id } = useParams();
  const [instrument, setInstrument] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/instruments/${id}`).then((response) => {
      setInstrument(response.data);
    });
  }, [id]);

  if (!instrument) return "";

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 py-8">
      <h1 className="text-3xl">{instrument.title}</h1>
      <AddressLink>{instrument.address}</AddressLink>
      <InstrumentGallery instrument={instrument} />
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {instrument.description}
          </div>
          Check-in: {instrument.checkIn} <br />
          Check-Out: {instrument.checkOut}
        </div>
        <div>
          <BookingWidget instrument={instrument} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
          {instrument.extraInfo}
        </div>
      </div>
    </div>
  );
}

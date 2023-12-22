import { useEffect, useState } from "react";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function InstrumentsFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [redirect, setredirect] = useState(false);
  const [price, setPrice] = useState(15);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/instruments/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setPrice(data.price);
    });
  }, [id]);
  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  function preinput(header, description) {
    return (
      <div>
        {inputHeader(header)}
        {inputDescription(description)}
      </div>
    );
  }

  async function saveInstrument(ev) {
    ev.preventDefault();
    const instrumentData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      price,
    };
    if (id) {
      //update
      await axios.put("/instruments", {
        id,
        ...instrumentData,
      });
    } else {
      // new place
      await axios.post("/instruments", instrumentData);
    }
    setredirect(true);
  }

  if (redirect) {
    return <Navigate to={"/account/instruments"} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={saveInstrument}>
        {preinput("Title", "Title for your instrument, should be concise.")}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="Title, for example: My Tenor Saxophone"
        />
        {preinput("Pickup Location", "Pickup location for your instrument.")}
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="Address"
        />
        {preinput(
          "Photos",
          "Add photos of your instrument (a 360 of the instrument, cleaning equipment and instrument case etc.)."
        )}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preinput(
          "Description",
          "Describe your instrument (Include the quality and state of your instrument)."
        )}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        {preinput("Perks", "Select any special perks of your instrument.")}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preinput(
          "Extra Info",
          "Add any extra information needed for renter (Include cleaning instructions and how to take care of the instrument etc.)."
        )}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        {preinput(
          "Check In & Out",
          "Add check in and out times for your instrument."
        )}
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="mt-2 -mb-2">
            <h3>Check in time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="14"
            />
          </div>
          <div className="mt-2 -mb-2">
            <h3>Check out time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="11"
            />
          </div>
          <div className="mt-2 -mb-2">
            <h3>Price per day</h3>
            <input
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              placeholder="15"
            />
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}

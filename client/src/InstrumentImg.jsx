export default function InstrumentImg({
  instrument,
  index = 0,
  className = null,
}) {
  if (!instrument.photos?.length) {
    return "";
  }
  if (!className) {
    className = "object-cover";
  }
  return (
    <img
      className={className}
      src={"http://localhost:4000/uploads/" + instrument.photos[index]}
      alt=""
    />
  );
}

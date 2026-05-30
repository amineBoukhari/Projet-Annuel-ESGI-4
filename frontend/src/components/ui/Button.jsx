export default function Button({ text }) {
  return (
    <>
      <button className="bg-primary rounded-lg py-2 text-white hover:cursor-pointer hover:opacity-90">
        {text}
      </button>
    </>
  );
}

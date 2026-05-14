export default function ContentContainer({ size, children }) {
    const boxSize = () => {
        const x = size.split("x")[0];
        const y = size.split("x")[1];

        return `row-span-${x} col-span-${y}`;
    } 
  return (
    <>
      <div className={`bg-white rounded-2xl flex flex-col gap-3 ${boxSize()} p-3`}>
        {children}
      </div>
    </>
  );
}

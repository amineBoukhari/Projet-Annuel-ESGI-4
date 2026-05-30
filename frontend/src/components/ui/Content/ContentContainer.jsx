export default function ContentContainer({ x = 1, y = 1, children }) {
  const boxSizes = (x, y) => {
    const heights = {
      1: "row-span-1",
      2: "row-span-2",
      3: "row-span-3",
    };

    const widths = {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
    };

    return heights[y].concat(" ", widths[x]);
  };

  return (
    <div
      className={`bg-surface-raised rounded-[16px] shadow-ambient flex flex-col gap-3 ${boxSizes(x, y)} p-6 hover:shadow-lifted transition-shadow duration-200`}
    >
      {children}
    </div>
  );
}

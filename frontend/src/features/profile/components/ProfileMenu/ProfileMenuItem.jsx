export default function ProfileMenuItem({
  text,
  onClickAction = null,
  danger = false,
}) {
  return (
    <button
      className={`hover:cursor-pointer border-2 border-white ${danger ? "hover:text-red-500 hover:border-red-500" : "hover:text-primary hover:border-primary"} text-left px-2 rounded-lg`}
      onClick={onClickAction ? onClickAction : null}
    >
      {text}
    </button>
  );
}

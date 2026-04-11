import { Children } from "react";

export default function Input({
  label,
  identifier,
  type,
  errorMessage,
  placeHolder,
    children,
  ref
}) {
  return (
    <div>
      <label className="px-2" htmlFor={identifier}>
        {label}
      </label>
      {errorMessage && (
        <p className="text-red-500 text-xs px-2">{errorMessage}</p>
      )}
      <div
        className={`border rounded-lg flex items-center ${
          errorMessage ? "border-red-500" : ""
        }`}
      >
        <input
          className="outline-none size-full px-2 py-1 rounded-lg text-sm"
          {...(placeHolder !== null && { placeholder: placeHolder })}
          type={type}
          name={identifier}
          ref={ref}
        />
        {children}
      </div>
    </div>
  );
}

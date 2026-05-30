import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, identifier, type = "text", errorMessage, placeHolder, children, defaultValue = null },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5"
          htmlFor={identifier}
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          className={`
            w-full
            bg-surface-raised
            border
            text-ink
            px-4 py-3
            rounded-[10px]
            text-[0.9375rem]
            transition-all duration-200
            placeholder:text-ink-muted
            focus:outline-none
            focus:border-primary
            focus:shadow-lifted
            ${errorMessage ? "border-error bg-red-50" : "border-border hover:border-border-strong"}
          `}
          {...(placeHolder !== null && { placeholder: placeHolder })}
          type={type}
          name={identifier}
          id={identifier}
          ref={ref}
          defaultValue={defaultValue}
        />
        {children && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {children}
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="text-error text-[0.75rem] mt-1.5 font-medium">{errorMessage}</p>
      )}
    </div>
  );
});

export default Input;

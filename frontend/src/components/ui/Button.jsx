export default function Button({
  text,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  className = "",
  icon: Icon,
}) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium text-[0.8125rem]
    rounded-[10px]
    px-5 py-2.5
    transition-all duration-200
    cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-muted focus-visible:ring-offset-2
  `;

  const variants = {
    primary: `
      bg-primary text-white
      hover:bg-primary-hover
      active:scale-[0.98]
      shadow-ambient hover:shadow-lifted
    `,
    secondary: `
      bg-secondary text-ink
      hover:bg-secondary-hover
      active:scale-[0.98]
      shadow-ambient hover:shadow-lifted
    `,
    ghost: `
      bg-transparent text-ink
      border border-border
      hover:bg-surface hover:border-border-strong
      active:scale-[0.98]
    `,
    danger: `
      bg-error text-white
      hover:bg-red-700
      active:scale-[0.98]
      shadow-ambient hover:shadow-lifted
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {Icon && <Icon size={16} strokeWidth={2} />}
      {text}
    </button>
  );
}

import { useEffect, useRef } from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  style?: "fill" | "outline" | "link";
  type?: "button" | "submit" | "reset";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  setFocus?: boolean;
}

const Styles = {
  "primary:fill":
    "font-semibold bg-purple-700 hover:bg-gray-400 text-white rounded-full",
  "primary:outline":
    "font-semibold bg-purple-100 hover:bg-gray-400 text-purple-900 rounded-full border border-purple-900",
  "primary:link": "font-semibold text-purple-900 border-none",
  "secondary:fill": "bg-cyan-800 hover:border-cyan-400 text-white rounded-full",
  "secondary:link":
    "bg-cyan-50 hover:border-cyan-400 text-cyan-800 rounded-full",
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  style = "fill",
  type = "button",
  disabled = false,
  className = "",
  onClick,
  size = "medium",
  setFocus,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return "px-2 py-1 text-xs";
      case "medium":
        return "px-4 py-2 text-md";
      case "large":
        return "px-5 py-3 text-sm";
      default:
        return "";
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    if (onClick) {
      onClick();
    }
  };

  type StylesKey = keyof typeof Styles;

  const getStyle = (variant: string, style: string): string => {
    const key = `${variant}:${style}` as StylesKey;
    return Styles[key] || "";
  };

  const commonStyles = "inline-flex items-center";
  const sizeStyles = getSizeStyles();
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
  const buttonStyle = getStyle(variant, style);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (setFocus && buttonRef.current && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [setFocus]);

  return (
    <button
      ref={buttonRef}
      className={`${commonStyles} ${buttonStyle} ${sizeStyles} ${disabledStyles} ${className}`}
      type={type}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;

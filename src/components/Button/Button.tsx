import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "default" | "primary" | "secondary" | "link";
type ButtonSize = "medium" | "small";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({
  variant = "default",
  size = "medium",
  className,
  type = "button",
  ...props
}: ButtonProps) => {
  const variantClass = variant === "default" ? "" : styles[variant];
  const sizeClass = size === "small" ? styles.small : "";

  return (
    <button
      className={[styles.button, variantClass, sizeClass, className]
        .filter(Boolean)
        .join(" ")}
      type={type}
      {...props}
    />
  );
};

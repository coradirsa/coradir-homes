import type { CSSProperties } from "react";

type MaterialIconProps = {
  name: string;
  className?: string;
  ariaHidden?: boolean;
  title?: string;
  style?: CSSProperties;
};

export default function MaterialIcon({
  name,
  className = "",
  ariaHidden = true,
  title,
  style,
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-rounded notranslate select-none text-[24px] leading-none ${className}`}
      aria-hidden={ariaHidden}
      aria-label={ariaHidden ? undefined : title}
      style={{
        fontFamily: '"Material Symbols Rounded"',
        fontFeatureSettings: '"liga"',
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
        ...style,
      }}
    >
      {name}
    </span>
  );
}

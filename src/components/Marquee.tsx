import type { CSSProperties, ReactNode } from "react";

type Props = {
  items: ReactNode[];
  duration?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
};

export default function Marquee({
  items,
  duration = 22,
  reverse = false,
  className = "",
  itemClassName = "",
}: Props) {
  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="anim-marquee inline-flex items-center"
        style={
          {
            "--marquee-dur": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as CSSProperties
        }
      >
        {row.map((item, i) => (
          <span key={i} className={`inline-flex items-center ${itemClassName}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

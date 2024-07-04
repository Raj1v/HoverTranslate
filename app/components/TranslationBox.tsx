import { useEffect, useState, useRef } from "react";
import "@/app/styles/tooltips.css";

const TranslationBox = (props: {
  translation: string;
  position: { x: number; y: number };
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { translation, position } = props;

  useEffect(() => {
    // Callculate the proper position for the tooltipbox based on the width of the tooltipbox
    if (ref.current) {
      const x = position.x - ref.current.offsetWidth / 2;
      const y = position.y + window.scrollY - 30;
      ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  });

  return (
    <div role="dialog" aria-labelledby="share" aria-haspopup="dialog">
      <p
        className={`tooltipBox`}
        ref={ref}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          opacity: translation && position ? 1 : 0,
        }}
      >
        {translation}
      </p>
    </div>
  );
};

export default TranslationBox;

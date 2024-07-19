import { useEffect, useState, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import "@/app/styles/tooltips.css";

const TranslationBox = (props: {
  translation: string | boolean | null;
  position: { x: number; y: number };
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { translation, position } = props;
  const [displayedTranslation, setDisplayedTranslation] = useState(translation);

  useEffect(() => {
    // Calculate the proper position for the tooltipbox based on the width of the tooltipbox
    if (ref.current) {
      const x = position.x - ref.current.offsetWidth / 2;
      const y = position.y + window.scrollY - 30;
      ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  });

  useEffect(() => {
    if (translation) {
      setDisplayedTranslation(translation);
    } else {
      // Delay clearing the translation to allow for fade-out effect
      const timeoutId = setTimeout(
        () => setDisplayedTranslation(translation),
        300
      ); // Adjust 300ms to match your fade-out duration
      return () => clearTimeout(timeoutId);
    }
  }, [translation]);

  return (
    <div>
      <p
        className={`tooltipBox`}
        ref={ref}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          opacity: translation !== null && position ? 1 : 0,
        }}
      >
        {displayedTranslation || <LoaderCircle className="animate-spin" />}
      </p>
    </div>
  );
};

export default TranslationBox;

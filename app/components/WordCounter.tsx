// WordCounter component
import { computePosition, autoUpdate } from "@floating-ui/react-dom";
import React, { useEffect, useState, useRef } from "react";

const WordCounter = (props: {
  textboxRef: React.RefObject<HTMLDivElement>;
  charCount: number;
}) => {
  const { textboxRef, charCount } = props;
  const htmlRef = useRef<HTMLDivElement>(null);

  //   useEffect(() => {
  //     if (!htmlRef.current) {
  //       console.error("htmlRef is not set");
  //       return;
  //     }
  //     if (!textboxRef.current) {
  //       console.error("textboxRef is not set");
  //       return;
  //     }
  //     const cleanup = autoUpdate(textboxRef.current, htmlRef.current, () => {
  //       computePosition(textboxRef.current!, htmlRef.current!, {
  //         placement: "bottom-end", // 'bottom' by default
  //       }).then(({ x, y }) => {
  //         Object.assign(htmlRef.current!.style, {
  //           left: `${x}px`,
  //           top: `${y}px`,
  //         });
  //       });
  //     });
  //   }, []);

  return (
    <div className="w-full flex justify-end" ref={htmlRef}>
      <span className="text-sm text-neutral-400">{charCount}/300</span>
    </div>
  );
};
export default WordCounter;

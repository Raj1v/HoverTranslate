import React, { useState, useEffect } from "react";
import "animate.css";
import "@/app/styles/tooltips.css";
import { SentenceItem } from "../lib/types";

interface SentenceItemWrapperProps {
  sentenceItem: SentenceItem;
  setTranslation: (translation: string) => void;
  setPosition: (position: Record<string, number>) => void;
  selecting: boolean;
}

const SentenceItemWrapper = (props: SentenceItemWrapperProps) => {
  const { sentenceItem, setTranslation, setPosition, selecting } = props;

  const handleMouseEnter = (event: React.MouseEvent) => {
    if (selecting) return; // Selecting takes precedence over hovering
    const target = event.target as Element;
    setTranslation(sentenceItem.translation);
    setPosition({
      x:
        target.getBoundingClientRect().left +
        target.getBoundingClientRect().width / 2,
      y: target.getBoundingClientRect().top,
    });
  };

  return (
    <span
      className="tooltip word-wrapper"
      data-translation={sentenceItem.translation}
      onMouseEnter={handleMouseEnter}
    >
      {sentenceItem.original}
    </span>
  );
};

export default SentenceItemWrapper;

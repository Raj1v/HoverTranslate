import React, { useState, useEffect } from "react";
import "animate.css";
import "@/app/styles/tooltips.css";
import { SentenceItem } from "../lib/types";

interface SentenceItemWrapperProps {
  sentenceItemId: string;
  children: SentenceItem;
}

const SentenceItemWrapper = (props: SentenceItemWrapperProps) => {
  const { sentenceItemId, children: sentenceItem } = props;

  return (
    <span
      className="tooltip word-wrapper hover:bg-slate-700 hover:text-gray-100 hover:italic  selection:bg-slate-700 selection:text-slate-200 selection:italic"
      data-translation={sentenceItem.translation}
      data-sentence-item-id={sentenceItemId}
    >
      {sentenceItem.original}
    </span>
  );
};

export default SentenceItemWrapper;

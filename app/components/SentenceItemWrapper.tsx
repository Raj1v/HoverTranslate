import React, { useState, useEffect } from "react";
import clsx from "clsx";
import "animate.css";
import "@/app/styles/tooltips.css";
import { SentenceItem } from "../lib/types";

interface SentenceItemWrapperProps {
  sentenceId: string | number;
  sentenceItemId: string;
  active: boolean;
  children: SentenceItem;
}

const SentenceItemWrapper = (props: SentenceItemWrapperProps) => {
  const { sentenceId, sentenceItemId, children: sentenceItem } = props;
  const className = clsx("tooltip word-wrapper", {
    "bg-slate-700 text-gray-100 italic": props.active,
  });

  return (
    <span
      className={className}
      data-translation={sentenceItem.translation}
      data-sentence-item-id={sentenceItemId}
      data-sentence-id={sentenceId}
    >
      {sentenceItem.original}
    </span>
  );
};

export default SentenceItemWrapper;

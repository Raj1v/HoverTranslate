import { Dispatch, SetStateAction } from "react";
import { SentenceItem, TranslationData, ActiveTranslation } from "@/app/lib/types";

const getSpanData = (target: Element) => {
  const wordId = target.getAttribute("data-word-id");
  const sentenceId = target.getAttribute("data-sentence-id");

  if (!wordId) {
    throw new Error("No word ID found on span");
  }
  if (!sentenceId) {
    throw new Error("No sentence  ID found on span");
  }

  return {
    sentenceId: parseInt(sentenceId),
    wordId: parseInt(wordId),
  };
}

export const handleStartHover = (
    event: React.MouseEvent<HTMLElement>,
    setActiveTranslation: Dispatch<SetStateAction<ActiveTranslation>>,
    setPosition: (value: SetStateAction<{ x: number; y: number }>) => void,
    selectingRef: React.MutableRefObject<boolean>,
    currentHoverRef: React.MutableRefObject<string | null>
  ) => {
    if (selectingRef.current) return; // Selecting takes precedence over hovering
    const target = event.target as HTMLElement;
    const { sentenceId, wordId } = getSpanData(target);

    const sentenceItem = {
      sentenceId: sentenceId,
      wordId: wordId,
    };

    setActiveTranslation([sentenceItem]);

    setPosition({
      x:
        target.getBoundingClientRect().left +
        target.getBoundingClientRect().width / 2,
      y: target.getBoundingClientRect().top,
    });
    currentHoverRef.current = sentenceId + "/" + wordId;
}


export const handleEndHover = (
    event: React.MouseEvent<HTMLElement>,
    selectingRef: React.MutableRefObject<boolean>,
    focussedRef: React.MutableRefObject<boolean>,
    setActiveTranslation: Dispatch<SetStateAction<ActiveTranslation>>,
    currentHoverRef: React.MutableRefObject<string | null>
  ) => {
    if (selectingRef.current) return; // Selecting takes precedence over hovering
    const target = event.target as HTMLElement;
    const { sentenceId, wordId } = getSpanData(target);
    if (currentHoverRef.current === sentenceId + "/" + wordId) {
        console.log("clearing hover");
        setActiveTranslation(null);
        currentHoverRef.current = null;
    }
}
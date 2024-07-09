import { Dispatch, SetStateAction } from "react";
import { SentenceItem, TranslationData } from "@/app/lib/types";

export const handleStartHover = (
    event: Event,
    translationData: TranslationData | null,
    setActiveTranslation: Dispatch<SetStateAction<SentenceItem[] | null>>,
    setPosition: (value: SetStateAction<{ x: number; y: number }>) => void,
    selectingRef: React.MutableRefObject<boolean>,
    currentHoverRef: React.MutableRefObject<string | null>
  ) => {
    if (selectingRef.current) return; // Selecting takes precedence over hovering
    const target = event.target as Element;
    console.log(target);
    const sentenceItemId = target.getAttribute("data-sentence-item-id");
    if (!sentenceItemId) {
      throw new Error("No sentence item ID found on span");
    }

    const sentenceItem =
      translationData?.sentenceItems[parseInt(sentenceItemId)];

    if (!sentenceItem) {
      throw new Error("No sentence item found for ID");
    }
    setActiveTranslation([sentenceItem]);
    setPosition({
      x:
        target.getBoundingClientRect().left +
        target.getBoundingClientRect().width / 2,
      y: target.getBoundingClientRect().top,
    });
    currentHoverRef.current = sentenceItemId;
}


export const handleEndHover = (
    event: Event,
    selectingRef: React.MutableRefObject<boolean>,
    setActiveTranslation: Dispatch<SetStateAction<SentenceItem[] | null>>,
    currentHoverRef: React.MutableRefObject<string | null>
  ) => {
    if (selectingRef.current) return; // Selecting takes precedence over hovering
    const target = event.target as Element;
    const sentenceItemId = target.getAttribute("data-sentence-item-id");
    if (currentHoverRef.current === sentenceItemId) {
        setActiveTranslation([]);
        currentHoverRef.current = null;
    }
}
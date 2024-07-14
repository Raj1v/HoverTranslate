import { Dispatch, SetStateAction } from "react";
import { SentenceItem, TranslationData, ActiveTranslation } from "@/app/lib/types";

export const handleStartHover = (
    event: React.MouseEvent<HTMLElement>,
    translationData: TranslationData | null,
    setActiveTranslation: Dispatch<SetStateAction<ActiveTranslation>>,
    setPosition: (value: SetStateAction<{ x: number; y: number }>) => void,
    selectingRef: React.MutableRefObject<boolean>,
    currentHoverRef: React.MutableRefObject<string | null>
  ) => {
    console.log("hovering");
    if (selectingRef.current) return; // Selecting takes precedence over hovering
    const target = event.target as Element;
    console.log(target);
    const sentenceItemId = target.getAttribute("data-sentence-item-id");
    const sentenceId = target.getAttribute("data-sentence-id");

    if (!sentenceItemId) {
      throw new Error("No sentence item ID found on span");
    }
    if (!sentenceId) {
      throw new Error("No sentence  ID found on span");
    }

    const sentenceItem = {
      sentenceId: parseInt(sentenceId),
      sentenceItemId: parseInt(sentenceItemId),
    };

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
    event: React.MouseEvent<HTMLElement>,
    selectingRef: React.MutableRefObject<boolean>,
    focussedRef: React.MutableRefObject<boolean>,
    setActiveTranslation: Dispatch<SetStateAction<ActiveTranslation>>,
    currentHoverRef: React.MutableRefObject<string | null>
  ) => {
    if (selectingRef.current) return; // Selecting takes precedence over hovering
    if (focussedRef.current) return; // Do not clear hover if focussed
    const target = event.target as HTMLElement;
    const sentenceItemId = target.getAttribute("data-sentence-item-id");
    if (currentHoverRef.current === sentenceItemId) {
        console.log("clearing hover");
        setActiveTranslation(null);
        currentHoverRef.current = null;
    }
}
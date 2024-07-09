import { SetStateAction, Dispatch } from "react";
import { htmlElementToSentenceItem } from "@/app/lib/textUtils";
import { SentenceItem } from "@/app/lib/types";

const sentenceItemWrapperClass = "tooltip";

const handleSelectionChange = (
  setActiveTranslation: Dispatch<SetStateAction<SentenceItem[] | null>>,
  setPosition: (value: SetStateAction<{ x: number; y: number }>) => void,
  setSelecting: (value: SetStateAction<boolean>) => void
) => {
  const activeSelection = document.getSelection();


  // Check if the selection is empty
    if (!activeSelection || activeSelection.toString() === "") {
      setSelecting(false);
      setActiveTranslation(null);
      return;
    }

  setSelecting(true);

  let anchorNode = activeSelection.anchorNode as Element;
  let focusNode = activeSelection.focusNode as Element;

  while (anchorNode && anchorNode.nodeName !== "SPAN") {
    anchorNode = anchorNode.parentNode as Element;
  }

  while (focusNode && focusNode.nodeName !== "SPAN") {
    focusNode = focusNode.parentNode as Element;
  }

  if (
    anchorNode &&
    focusNode &&
    anchorNode.classList.contains(sentenceItemWrapperClass) &&
    focusNode.classList.contains(sentenceItemWrapperClass)
  ) {
    // Create a range object
    const range = document.createRange();
    if (
      anchorNode.compareDocumentPosition(focusNode) ==
      Node.DOCUMENT_POSITION_FOLLOWING
    ) {
      range.setStart(anchorNode, 0);
      range.setEnd(focusNode, focusNode.childNodes.length);
    } else if (
      anchorNode.compareDocumentPosition(focusNode) ==
      Node.DOCUMENT_POSITION_PRECEDING
    ) {
      range.setStart(focusNode, 0);
      range.setEnd(anchorNode, anchorNode.childNodes.length);
    } else if (anchorNode == focusNode) {
      range.selectNode(anchorNode);
    }


    // Loop through the range and get the outer HTML
    const clonedContents = range.cloneContents();
    const spans = clonedContents.querySelectorAll(
      `span.${sentenceItemWrapperClass}`
    );

    let selectedSentenceItems: SentenceItem[] = [];
    spans.forEach((span) => {
      const setenceItem = htmlElementToSentenceItem(span);
      selectedSentenceItems.push(setenceItem)
    });

    setActiveTranslation(selectedSentenceItems);
  }


  const rect = activeSelection.getRangeAt(0).getBoundingClientRect();

  setPosition({
    x: rect.left + rect.width / 2,
    y: rect.top,
  });
};

export default handleSelectionChange;

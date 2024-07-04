import { SetStateAction } from "react";


const handleSelectionChange = (
  setTranslation: (value: SetStateAction<string>) => void,
  setPosition: (value: SetStateAction<Record<string, number>>) => void,
  setSelecting: (value: SetStateAction<boolean>) => void
) => {
  const activeSelection = document.getSelection();
  
  if (!activeSelection) {
    setSelecting(false);
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
    anchorNode.classList.contains("tooltip") &&
    focusNode.classList.contains("tooltip")
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
    let text = "";
    const clonedContents = range.cloneContents();
    const spans = clonedContents.querySelectorAll("span.tooltip");

    spans.forEach((span) => {
    text += span.getAttribute("data-translation") + " ";
    });

    setTranslation(text);
  }
  
  // Check if the selection is empty
    if (activeSelection.toString() === "") {
        setSelecting(false);
        return;
    }
  const rect = activeSelection.getRangeAt(0).getBoundingClientRect();

  setPosition({
    x: rect.left + rect.width / 2,
    y: rect.top,
  });
};

export default handleSelectionChange;

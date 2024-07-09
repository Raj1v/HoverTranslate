import React from "react";
import ReactDOMServer from "react-dom/server";
import SentenceItemWrapper from "@/app/lib/WordWrapper";
import { SentenceItem } from "@/app/lib/types";

export const wrapWordsWithSpans = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const wrapWords = (node) => {
    debugger;
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.nodeValue
        .split(" ")
        .filter((word) => word.trim() !== "");
      const words_with_spans = words
        .map((word) =>
          ReactDOMServer.renderToStaticMarkup(
            <SentenceItemWrapper word={word} />
          )
        )
        .join(" ");
      debugger;
      return words_with_spans;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.classList.contains("word-wrapper")) {
        return node.outerHTML;
      }

      const children = Array.from(node.childNodes)
        .map((childNode) => wrapWords(childNode))
        .join(" ");
      return `<${node.tagName.toLowerCase()}>${children}</${node.tagName.toLowerCase()}>`;
    }

    return "";
  };
  const output = wrapWords(tempDiv);
  debugger;
  return output;
};

export function htmlElementToSentenceItem(element: Element): SentenceItem {
  const sentenceItem: SentenceItem = {
    original: element.textContent,
    translation: element.getAttribute("data-translation"),
  };
  return sentenceItem;
}

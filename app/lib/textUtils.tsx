import { SentenceItem } from "@/app/lib/types";

export function htmlElementToSentenceItem(element: Element): SentenceItem {
  const sentenceItem: SentenceItem = {
    original: element.textContent as string,
    translation: element.getAttribute("data-translation") as string,
  };
  return sentenceItem;
}

"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import { renderToString } from "react-dom/server";
import clsx, { ClassArray, ClassDictionary } from "clsx";
import SentenceItemWrapper from "../lib/WordWrapper";
import TranslationBox from "@/app/components/TranslationBox";
import { sampleData, TranslationData, SentenceItem } from "@/app/lib/types";
import handleSelectionChange from "@/app/lib/selectionHandler";
import { useTranslationContext } from "@/app/TranslationContext";
import ContentEditable from "react-contenteditable";

export default function TextArea(props: {
  className: string;
  activeTranslation: SentenceItem[] | null;
  setActiveTranslation: React.Dispatch<
    React.SetStateAction<SentenceItem[] | null>
  >;
  handleTranslate: (input: string) => void;
}) {
  const { translationData } = useTranslationContext();
  const { activeTranslation, setActiveTranslation, handleTranslate } = props;
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [selecting, setSelecting] = useState<boolean>(false);
  const currentHover = useRef<string | null>(null);
  const [innerHTML, setInnerHTML] = useState<string>("");

  const className = clsx("editable", "w-full h-80", props.className);

  const translation = activeTranslation
    ?.map((element) => element.translation)
    .join(" ");

  const reloadTranslation = () => {
    const current_text = document.querySelector(".editable")?.textContent;
    if (!current_text) return;
    handleTranslate(current_text);
  };

  useEffect(() => {
    if (translationData && translationData.sentenceItems.length > 0) {
      const content = translationData.sentenceItems.map(
        (sentenceItem, index) => (
          <React.Fragment key={index}>
            <SentenceItemWrapper sentenceItemId={index.toString()}>
              {sentenceItem}
            </SentenceItemWrapper>{" "}
          </React.Fragment>
        )
      );
      setInnerHTML(renderToString(content));
    } else {
      setInnerHTML("Loading...");
    }
  }, [translationData]); // Dependency array, effect runs when translationData changes

  useEffect(() => {
    const selectionChangeHandler = (event: Event) => {
      event.preventDefault();
      handleSelectionChange(setActiveTranslation, setPosition, setSelecting);
    };
    document.addEventListener("selectionchange", selectionChangeHandler);

    return () => {
      document.removeEventListener("selectionchange", selectionChangeHandler);
    };
  }, []);

  useEffect(() => {
    // Function to handle mouseenter event
    const handleMouseEnter = (event: Event) => {
      if (selecting) return; // Selecting takes precedence over hovering
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
      currentHover.current = sentenceItemId;
      console.log("Current hover: ", currentHover.current);
    };

    const handleMouseLeave = (event: Event) => {
      if (selecting) return; // Selecting takes precedence over hovering
      const target = event.target as Element;
      const sentenceItemId = target.getAttribute("data-sentence-item-id");
      console.log(sentenceItemId);
      console.log(currentHover.current);
      if (currentHover.current === sentenceItemId) {
        setActiveTranslation([]);
        currentHover.current = null;
      }
    };

    // Attach mouseenter event handlers to all spans
    const spans = document.querySelectorAll("span.tooltip");

    spans.forEach((span) => {
      span.addEventListener("mouseenter", handleMouseEnter);
      span.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup function to detach event handlers
    return () => {
      spans.forEach((span) => {
        span.removeEventListener("mouseenter", handleMouseEnter);
        span.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [innerHTML]); // Dependency array, re-run effect when innerHTML changes

  return (
    <>
      <TranslationBox translation={translation} position={position} />
      <ContentEditable
        html={innerHTML}
        className={`${className} border rounded-lg text-2xl pt-2 px-4`}
        onBlur={reloadTranslation}
        onChange={(event) => {
          return;
        }}
      />
      <p>Translation: {translation}</p>
      <p>
        Position: {position.x}, {position.y}
      </p>
      <p>Selecting: {selecting ? "yes" : "no"}</p>
      <p>Current hover: {currentHover.current}</p>
    </>
  );
}

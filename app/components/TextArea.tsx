"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import { renderToString } from "react-dom/server";
import clsx, { ClassArray, ClassDictionary } from "clsx";
import SentenceItemWrapper from "../lib/WordWrapper";
import TranslationBox from "@/app/components/TranslationBox";
import { sampleData, TranslationData, SentenceItem } from "@/app/lib/types";
import handleSelectionChange from "@/app/lib/selectionHandler";
import { handleStartHover, handleEndHover } from "@/app/lib/hoverHandler";
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
  const selectingRef = useRef<boolean>(false);
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
      handleSelectionChange(setActiveTranslation, setPosition, selectingRef);
    };
    document.addEventListener("selectionchange", selectionChangeHandler);

    return () => {
      document.removeEventListener("selectionchange", selectionChangeHandler);
    };
  }, []);

  useEffect(() => {
    // Function to handle mouseenter event
    const handleMouseEnter = (event: Event) => {
      event.preventDefault();
      handleStartHover(
        event,
        translationData,
        setActiveTranslation,
        setPosition,
        selectingRef,
        currentHover
      );
    };

    const handleMouseLeave = (event: Event) => {
      event.preventDefault();
      handleEndHover(event, selectingRef, setActiveTranslation, currentHover);
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
  }, [innerHTML]);

  return (
    <>
      <TranslationBox translation={translation} position={position} />
      <ContentEditable
        html={innerHTML}
        className={`${className} border rounded-lg text-2xl pt-2 px-4`}
        onBlur={reloadTranslation}
        onChange={(event) => {
          setInnerHTML(event.target.value);
        }}
      />
      {/* <p>Translation: {translation}</p>
      <p>
        Position: {position.x}, {position.y}
      </p>
      <p>Selecting: {selectingRef.current ? "yes" : "no"}</p>
      <p>Current hover: {currentHover.current}</p> */}
    </>
  );
}

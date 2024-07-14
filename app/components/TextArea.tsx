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
import useTranslation from "@/app/lib/useTranslation";
import sanitizeHtml from "sanitize-html";
// @ts-ignore
import ContentEditable from "react-contenteditable";

export default function TextArea(props: {
  className: string;
  activeTranslation: SentenceItem[] | null;
  setActiveTranslation: React.Dispatch<
    React.SetStateAction<SentenceItem[] | null>
  >;
  handleTranslate: (input: string) => void;
  innerRef: React.RefObject<HTMLDivElement>;
  setCharCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { translationData } = useTranslationContext();
  const {
    activeTranslation,
    setActiveTranslation,
    handleTranslate,
    innerRef,
    setCharCount,
  } = props;
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const selectingRef = useRef<boolean>(false);
  const focussedRef = useRef<boolean>(false);
  const currentHover = useRef<string | null>(null);
  const [innerHTML, setInnerHTML] = useState<string>("");

  const className = clsx("editable", "w-full h-80", props.className);

  const translation = useTranslation(activeTranslation);

  const reloadTranslation = () => {
    focussedRef.current = false; // Should be in a separate handler
    const current_text = document.querySelector(".editable")?.textContent;
    if (!current_text) return;
    handleTranslate(current_text);
  };

  useEffect(() => {
    if (translationData && translationData.sentences.length > 0) {
      let content = "";
      translationData.sentences.forEach((sentence, sentenceId) => {
        const sentence_html = sentence.sentenceItems.map(
          (sentenceItem, index) => (
            <React.Fragment key={index}>
              <SentenceItemWrapper
                sentenceId={sentenceId}
                sentenceItemId={index.toString()}
              >
                {sentenceItem}
              </SentenceItemWrapper>
              {index < sentence.sentenceItems.length - 1 ? " " : ""}
            </React.Fragment>
          )
        );
        sentence_html.push(<span>. </span>);
        content += renderToString(sentence_html);
      });

      setInnerHTML(content);
    } else {
      setInnerHTML("Loading...");
    }
  }, [translationData, activeTranslation]); // Dependency array, effect runs when translationData changes

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

  const handleMouseOver = (event: React.MouseEvent<HTMLElement>) => {
    console.log("hovering");
    const target = event.target as HTMLElement;
    if (target.matches("span.tooltip")) {
      event.preventDefault();
      handleStartHover(
        event,
        translationData,
        setActiveTranslation,
        setPosition,
        selectingRef,
        currentHover
      );
    }
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.matches("span.tooltip")) {
      event.preventDefault();
      handleEndHover(
        event,
        selectingRef,
        focussedRef,
        setActiveTranslation,
        currentHover
      );
    }
  };

  const sanitizeConf = {
    allowedTags: ["p", "br", "span"],
    allowedAttributes: {
      "*": ["data-*", "class"], // List all event handlers you want to allow
    },
  };

  // useEffect(() => {
  //   // Sanitize on html change
  //   console.log("Sanitizing");
  //   const sanitizedHTML = sanitizeHtml(innerHTML, sanitizeConf);
  //   if (sanitizedHTML !== innerHTML) {
  //     setInnerHTML(sanitizedHTML);
  //   }
  // }, [innerHTML]);

  return (
    <>
      <TranslationBox translation={translation} position={position} />
      <ContentEditable
        html={innerHTML}
        className={`${className} border rounded-lg text-2xl pt-2 px-4 overflow-auto`}
        onBlur={reloadTranslation}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setCharCount(innerRef.current?.textContent?.length || 0);
          setInnerHTML(target.value);
        }}
        innerRef={innerRef}
        onFocus={() => {
          focussedRef.current = true;
        }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
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

"use client";
import React, { useEffect, useState, useRef } from "react";
import { renderToString } from "react-dom/server";
import clsx, { ClassArray, ClassDictionary } from "clsx";
import SentenceItemWrapper from "./SentenceItemWrapper";
import TranslationBox from "@/app/components/TranslationBox";
import {
  TranslationData,
  SentenceItem,
  ActiveTranslation,
} from "@/app/lib/types";
import handleSelectionChange from "@/app/lib/selectionHandler";
import { handleStartHover, handleEndHover } from "@/app/lib/hoverHandler";
import { useTranslationContext } from "@/app/TranslationContext";
import useTranslation from "@/app/lib/useTranslation";
import sanitizeHtml from "sanitize-html";
// @ts-ignore
import ContentEditable from "react-contenteditable";

function debounce(func: (...args: any[]) => void, wait: number): () => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: any[]): void {
    const later = () => {
      if (timeout !== null) {
        clearTimeout(timeout);
        func(...args);
      }
    };
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export default function TextArea(props: {
  className: string;
  activeTranslation: ActiveTranslation;
  setActiveTranslation: React.Dispatch<React.SetStateAction<ActiveTranslation>>;
  innerRef: React.RefObject<HTMLDivElement>;
  setInputText: React.Dispatch<React.SetStateAction<string | undefined>>;
  setCharCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { translationData } = useTranslationContext();
  const {
    activeTranslation,
    setActiveTranslation,
    innerRef,
    setInputText,
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

  const { translation, sentenceItems } = useTranslation(
    activeTranslation,
    translationData!
  );

  const reloadTranslation = () => {
    focussedRef.current = false; // Should be in a separate handler
    const current_text = document.querySelector(".editable")?.textContent;
    if (!current_text) return;
    setInputText(current_text);
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
                active={
                  activeTranslation?.some(
                    (item) =>
                      item.sentenceId === sentenceId &&
                      item.sentenceItemId === index
                  ) || false
                }
              >
                {sentenceItem}
              </SentenceItemWrapper>
              {index < sentence.sentenceItems.length - 1 ? " " : ""}
            </React.Fragment>
          )
        );

        sentence_html.push(<span>&nbsp;</span>);
        content += renderToString(sentence_html);
      });

      setInnerHTML(content);
    } else {
      setInnerHTML("Loading...");
    }
  }, [translationData, activeTranslation]); // Dependency array, effect runs when translationData changes

  useEffect(() => {
    return;
    const selectionChangeHandler = (event: Event) => {
      event.preventDefault();
      console.log("Selection changed");
      //  handleSelectionChange(setActiveTranslation, setPosition, selectingRef);
    };
    document.addEventListener("selectionchange", selectionChangeHandler);

    return () => {
      document.removeEventListener("selectionchange", selectionChangeHandler);
    };
  }, []);

  const handleMouseOver = (event: React.MouseEvent<HTMLElement>) => {
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
    console.log("Mouse out");

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
        onMouseOver={debounce(handleMouseOver, 5)}
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

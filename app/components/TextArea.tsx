"use client";
import React, { useEffect, useState, useRef, useCallback, use } from "react";
import { renderToString } from "react-dom/server";
import clsx from "clsx";
import TranslationBox from "@/app/components/TranslationBox";
import { ActiveTranslation } from "@/app/lib/types";
import { handleStartHover, handleEndHover } from "@/app/lib/hoverHandler";
import { useTranslationContext } from "@/app/TranslationContext";
import { checkLanguage } from "@/app/actions";
import useTranslation from "@/app/lib/useTranslation";
import sanitizeHtml from "sanitize-html";
// @ts-ignore
import ContentEditable from "react-contenteditable";
//@ts-ignore
import SBD from "sbd";

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
  translation: string | boolean | null;
  innerRef: React.RefObject<HTMLDivElement>;
  setCharCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { activeTranslation, setActiveTranslation, translation, innerRef, setCharCount } = props;
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const selectingRef = useRef<boolean>(false);
  const focussedRef = useRef<boolean>(false);
  const currentHover = useRef<string | null>(null);
  const [innerHTML, setInnerHTML] = useState<string>("");

  const { translationData, setTranslationData } = useTranslationContext();
  const { sentenceItem: activeSentenceItem } = useTranslation(activeTranslation, translationData);

  const className = clsx("editable", "w-full h-80", props.className);

  const hoverTarget = useRef<HTMLElement>(); // Only for debugging

  const splitSentences = () => {
    const current_text = innerRef.current?.textContent;
    const sentences: string[] = SBD.sentences(current_text);
    setInnerHTML(
      renderToString(
        sentences.map((sentence, sentenceIndex) => (
          <span className="sentence" data-sentence-id={sentenceIndex}>
            {sentenceIndex > 0 && " "}
            {sentence.split(" ").map((word, wordIndex) => (
              <React.Fragment key={wordIndex}>
                {wordIndex > 0 && " "}
                <span
                  className="tooltip"
                  data-sentence-id={sentenceIndex}
                  data-word-id={wordIndex}
                >
                  {word}
                </span>
              </React.Fragment>
            ))}
          </span>
        ))
      )
    );
  };



  useEffect(() => {
    if(activeSentenceItem && activeTranslation) {
      const sentenceId = activeTranslation[0].sentenceId;
      activeSentenceItem.wordIds.forEach((wordId) => {
        const wordSpan = innerRef.current?.querySelector(`span[data-sentence-id="${sentenceId}"][data-word-id="${wordId}"]`);
        if(wordSpan) {
          wordSpan.classList.add("bg-slate-700", "text-gray-100", "italic");
        }
      });
    }
  }, [activeSentenceItem]);

  useEffect(() => {
    const getSourceLangauge = async (text: string) => {
      setTranslationData((prevData) => ({
        ...prevData,
        source_language: false,
      }));
  
      const source_language = await checkLanguage(text);
      setTranslationData((prevData) => ({
        ...prevData,
        source_language: source_language,
      }));
      };

    if (!translationData?.source_language && innerRef.current?.textContent) {
      getSourceLangauge(innerRef.current.textContent);
    }
  }, [innerHTML]);

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
    hoverTarget.current = target;

    if (target.matches("span.tooltip")) {
      event.preventDefault();
      handleStartHover(
        event,
        setActiveTranslation,
        setPosition,
        selectingRef,
        currentHover
      );
    }
  };

  // Memoize the debounced function
  const debouncedHandleMouseOver = useCallback(
    debounce(handleMouseOver, 50),
    [] // Dependencies array, empty means the function is created only once
  );

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
        onBlur={splitSentences}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setCharCount(innerRef.current?.textContent?.length || 0);
          setInnerHTML(target.value);
        }}
        innerRef={innerRef}
        onFocus={() => {
          focussedRef.current = true;
        }}
        onMouseOver={debouncedHandleMouseOver}
        onMouseOut={handleMouseOut}
      />
      {/* <div className="absolute left-0 bottom-20 border">
        <p>
          Translation:{" "}
          {translation === false
            ? "No translation"
            : translation
            ? translation
            : "Not selecting"}
        </p>
        <p>Hovertarget: {hoverTarget.current?.toString()}</p>
        <p>
          Position: {position.x}, {position.y}
        </p>
        <p>Selecting: {selectingRef.current ? "yes" : "no"}</p>
        <p>Current hover: {currentHover.current}</p>
      </div> */}
    </>
  );
}

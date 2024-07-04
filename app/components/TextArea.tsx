"use client";
import React, { useEffect, useState, useRef } from "react";
import clsx, { ClassArray, ClassDictionary } from "clsx";
import SentenceItemWrapper from "../lib/WordWrapper";
import TranslationBox from "@/app/components/TranslationBox";
import { sampleData } from "@/app/lib/types";
import handleSelectionChange from "@/app/lib/selectionHandler";

export default function TextArea(props: { className: string }) {
  const [translation, setTranslation] = useState<string>("");
  const [position, setPosition] = useState<Record<string, number>>({
    x: 0,
    y: 0,
  });
  const [selecting, setSelecting] = useState<boolean>(false);
  const translationBoxRef = useRef(null);

  const className = clsx("editable", "w-full h-80", props.className);

  useEffect(() => {
    const selectionChangeHandler = () =>
      handleSelectionChange(setTranslation, setPosition, setSelecting);
    document.addEventListener("selectionchange", selectionChangeHandler);

    return () => {
      document.removeEventListener("selectionchange", selectionChangeHandler);
    };
  }, []);

  const sentenceData = sampleData;

  return (
    <>
      <TranslationBox translation={translation} position={position} />
      <div className={`${className} border-4 text-2xl pt-2 px-4`}>
        {sentenceData.sentenceItems.map((sentenceItem, index) => (
          <React.Fragment key={index}>
            <SentenceItemWrapper
              sentenceItem={sentenceItem}
              setTranslation={setTranslation}
              setPosition={setPosition}
              selecting={selecting}
            />{" "}
          </React.Fragment>
        ))}
      </div>
      <p>Translation: {translation}</p>
      <p>
        Position: {position.x}, {position.y}
      </p>
      <p>Selecting: {selecting ? "yes" : "no"}</p>
    </>
  );
}

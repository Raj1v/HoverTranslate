"use client";
import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import clsx from 'clsx';
import { wrapWordsWithSpans } from '@/app/lib/textUtils';
import sanitizeHtml from "sanitize-html";

type TextAreaState = {
  html: string;
};

interface TextAreaProps {
  className: string
  html: string
}


export default class TextArea extends React.Component<TextAreaProps, TextAreaState> {
  constructor(props: TextAreaProps) {
    super(props);
    this.state = {
      html: this.props.html || `Default text :)`,
    };
  }


  handleChange = (evt: ContentEditableEvent) => {
    //const newHtml = wrapWordsWithSpans(evt.target.value);
    const newHtml = evt.target.value;
    this.setState({ html: sanitizeHtml(newHtml, this.sanitizeConf) });
  };



  sanitizeConf = {
    allowedTags: ["i", "em", "strong", "p", "h1"],
  };

  sanitize = () => {
    this.setState({ html: sanitizeHtml(this.state.html, this.sanitizeConf) });
  };

  className = clsx(
    "editable",
    "w-full h-80",
    this.props.className,
  )

  render = () => {
    return (

      <ContentEditable
        className={`${this.className} border-4 text-2xl pt-2 px-4`}
        tagName="div"
        html={this.state.html} // innerHTML of the editable div
        onChange={this.handleChange} // handle innerHTML change
        onBlur={this.sanitize}
      />
    );
  };
}


"use server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { Sentence, TranslateSentenceInput, SentenceItem } from "@/app/lib/types";
import { instruction } from "@/app/lib/prompt";


export async function translateSentence(
  input: TranslateSentenceInput,
  target_language: string
): Promise<Sentence> {
  const llm: ChatOpenAI = new ChatOpenAI({
    model: "gpt-4o",
    modelKwargs: { response_format: { type: "json_object" } },
  });

  const messages = [
    new SystemMessage(instruction),
    HumanMessagePromptTemplate.fromTemplate(
      "Target Language: {target_language}"
    ),
    HumanMessagePromptTemplate.fromTemplate(`Text to Translate: {original}
      Word-ID mapping:
      {word_mapping}
      `)
  ];

  const prompt = ChatPromptTemplate.fromMessages(messages);

  const parser = new JsonOutputParser();

  const chain = prompt.pipe(llm).pipe(parser);
  const result = await chain.invoke({
    target_language: target_language,
    original: input.original,
    word_mapping: formatTranslateSentenceInput(input),
  });
  return await parseTranslationResult(result);
}

function formatTranslateSentenceInput(input: TranslateSentenceInput) {
  const { words } = input;
  const formattedWords = words.map(wordObj => `{ "word": "${wordObj.word}", "id": ${wordObj.id} }`).join(',\n  ');
  return `[
  ${formattedWords}
  ]`
}

async function parseTranslationResult(result: any): Promise<Sentence> {
  // Ensure the result has the expected structure
  if (
    Array.isArray(result.wordGroups)
  ) {
    const sentenceItems: SentenceItem[] = result.wordGroups.map((group: any) => ({
      wordIds: group.wordIds,
      translation: group.translation,
    }));
    return { sentenceItems };
  } else {
    throw new Error("Unexpected translation result format");
  }
}
"server-only";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
  ChatMessagePromptTemplate,
  ChatPromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { TranslationData, Sentence, SentenceItem } from "@/app/lib/types";

export async function translateSentence(
  original: string,
  target_language: string
): Promise<Sentence> {
  const instruction = `
    Translate the following text into the specified target language and provide the output in JSON format as described below. Each sentence in the source text should be broken down into individual word/phrase pairs with their corresponding translations.
    
    ### Input:
    1. **Target Language**: Specify the target language.
    2. **Text to Translate**: Provide the text that needs to be translated.
    
    ### Output:
    The output should be a JSON object with the following structure:

    
    \`\`\`json
    {
      "source_language": "source_language",
      "target_language": "target_language",
      "sentenceItems": [
        { "original": "word/phrase_from_source_text", "translation": "translated_word/phrase" },
        { "original": "word/phrase_from_source_text", "translation": "translated_word/phrase" },
        ...
      ]
    }
    \`\`\`
    
Guidelines:

- The sentence should be broken down into individual word/phrase pairs with their corresponding translations.

- A sentence item is a pair of original word/phrase and its translation.

- A sentence iteem combines words/phrases that are closely related to each other.

a) For example, in the sentence "I am a student", "I" and "am" should be in the same sentence item.

b) In the sentence "I am a student", "a" and "student" should be in the same sentence item.

c) Prepositions are usually part of the phrase that follows them. For example, in the sentence "I am in the classroom", "in" and "the classroom" should be in the same sentence item.
    `;
  const llm: ChatOpenAI = new ChatOpenAI({
    model: "gpt-4o",
    modelKwargs: { response_format: { type: "json_object" } },
  });

  const messages = [
    new SystemMessage(instruction),
    SystemMessagePromptTemplate.fromTemplate(
      "Target Language: {target_language}"
    ),
    SystemMessagePromptTemplate.fromTemplate("Text to Translate: {original}")
  ];

  const prompt = ChatPromptTemplate.fromMessages(messages);

  const parser = new JsonOutputParser();

  const chain = prompt.pipe(llm).pipe(parser);
  const result = await chain.invoke({
    target_language: target_language,
    original: original,
  });
  return await parseTranslationResult(result);
}


async function parseTranslationResult(result: any): Promise<Sentence> {
  // Ensure the result has the expected structure
  if (
    result.source_language &&
    result.target_language &&
    Array.isArray(result.sentenceItems)
  ) {
    return {
      sentenceItems: result.sentenceItems.map((item: any) => ({
        original: item.original,
        translation: item.translation,
      })),
    };
  } else {
    throw new Error("Unexpected translation result format");
  }
}
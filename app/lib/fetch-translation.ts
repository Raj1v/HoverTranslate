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
import { TranslationData } from "@/app/lib/types";

const mock = {
    source_language: 'en',
    target_language: 'it',
    sentenceItems: [
      { original: 'Hello!', translation: 'Ciao!' },
      { original: 'Chiara', translation: 'Chiara' },
      { original: 'is', translation: 'è' },
      { original: 'so', translation: 'così' },
      { original: 'sweet', translation: 'dolce' }
    ]
}

export async function translateText(
  original: string,
  target_language: string
): Promise<TranslationData> {
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
    
    ### Example:
    
    **Input:**
    1. **Target Language**: "en"
    2. **Text to Translate**: "I bi nid faul, I bi energie sparend."
    
    **Output:**
    \`\`\`json
    {
      "source_language": "Swiss German",
      "target_language": "English",
      "sentenceItems": [
        { "original": "I", "translation": "I" },
        { "original": "bi", "translation": "am" },
        { "original": "nid", "translation": "not" },
        { "original": "faul,", "translation": "lazy," },
        { "original": "I", "translation": "I" },
        { "original": "bi", "translation": "am" },
        { "original": "energie", "translation": "energy" },
        { "original": "sparend.", "translation": "saving." }
     
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


async function parseTranslationResult(result: any): Promise<TranslationData> {
  // Ensure the result has the expected structure
  if (
    result.source_language &&
    result.target_language &&
    Array.isArray(result.sentenceItems)
  ) {
    return {
      source_language: result.source_language,
      target_language: result.target_language,
      sentenceItems: result.sentenceItems.map((item: any) => ({
        original: item.original,
        translation: item.translation,
      })),
    };
  } else {
    throw new Error("Unexpected translation result format");
  }
}
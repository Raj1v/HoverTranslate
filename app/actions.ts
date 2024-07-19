"use server";
import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessagePromptTemplate
} from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { db } from "@/app/lib/firebase";

const sample_sentences : string[] = [
    "Je parle à mon chien en français pour qu'il devienne bilingue.", // French: "I speak to my dog in French so he becomes bilingual."
    "Mein Hamster hat meine Hausaufgaben gefressen.", // German: "My hamster ate my homework."
    "Min computer er langsommere end en snegl på en berg-og-dal-bane.", // Danish: "My computer is slower than a snail on a roller coaster."
    "Mijn schildpad heeft net een marathon gewonnen.", // Dutch: "My turtle just won a marathon."
    "Min katt tror att den är en ninja och gömmer sig överallt.", // Swedish: "My cat thinks it's a ninja and hides everywhere."
    "Min vänster sko är alltid borta när jag behöver den.", // Norwegian: "My left shoe is always missing when I need it."
    "La mia pianta da appartamento mi guarda come se sapesse qualcosa.", // Italian: "My houseplant looks at me like it knows something."
    "Meine Kaktus hat mir gerade einen Witz erzählt.", // German: "My cactus just told me a joke."
    "Mon chien pense que c'est une licorne.", // French: "My dog thinks it's a unicorn."
    "Mi reloj siempre está cinco minutos tarde.", // Spanish: "My watch is always five minutes late."
    "Mein Kaffee hat mir heute Morgen ein High Five gegeben.", // Swiss German: "My coffee gave me a high five this morning."
    "Minha geladeira faz mais barulho que um concerto de rock.", // Portuguese: "My fridge makes more noise than a rock concert."
    "Min dator tror att det är en brödrost.", // Swedish: "My computer thinks it's a toaster."
    "Meu hamster acha que é o rei do mundo.", // Portuguese: "My hamster thinks it's the king of the world."
];


export async function getSampleSentence(): Promise<string> {
    const sentence = sample_sentences[Math.floor(Math.random()*sample_sentences.length)];
    return sentence;
}

export const checkLanguage = async (input: string): Promise<string> => {
    const instructions = `
    What language is the input text in?

    --------------------------------------------
    Input: {input}

    --------------------------------------------
    Output Format in JSON:
    {{
        "language": string
    }}
    `;
    const prompt = HumanMessagePromptTemplate.fromTemplate(instructions);
    const llm: ChatOpenAI = new ChatOpenAI({
        model: "gpt-4o",
        modelKwargs: { response_format: { type: "json_object" } },
    });
    const parser = new JsonOutputParser();
    const chain = prompt.pipe(llm).pipe(parser).withConfig({ runName: "checkLanguage" });
    const result = await chain.invoke({input});
    if (result.language === undefined) {
        throw new Error("Invalid output format");
    }
    return result.language;
}

export const checkChange = async (input: string, prevInput: string): Promise<boolean> => {
    // Normalize text by removing punctuation, converting to lowercase, and trimming whitespace
    function normalize(text : string) {
        return text
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // Remove punctuation
            .replace(/\s+/g, " ") // Replace multiple whitespace with a single space
            .toLowerCase() // Convert to lowercase
            .trim(); // Trim whitespace from start and end
    }

    // Normalize both texts
    const normalizedText1 = normalize(input);
    const normalizedText2 = normalize(prevInput);

    // Compare normalized texts
    return normalizedText1 !== normalizedText2;
}

export const checkChangeLLM = async (input: string, prevInput: string): Promise<boolean> => {
    const instructions = `
    Has the input text change since the last translation?

    Only consider the text content, not the formatting, capitalization, or punctuation.

    --------------------------------------------    
    Input: {input}

    --------------------------------------------
    Previous Input: {prevInput}
    --------------------------------------------
    Output Format in JSON:
    {{
        "explanation": string,
        "changed": true/false
    }}
    `;
    const prompt = HumanMessagePromptTemplate.fromTemplate(instructions);
    const llm: ChatOpenAI = new ChatOpenAI({
        model: "gpt-4o",
        modelKwargs: { response_format: { type: "json_object" } },
    });
    const parser = new JsonOutputParser();
    const chain = prompt.pipe(llm).pipe(parser).withConfig({ runName: "checkChange" });
    const result = await chain.invoke({input, prevInput});
    if (result.changed === undefined) {
        throw new Error("Invalid output format");
    }
    return result.changed;
}


export const recordFeedback = async (
    positive: boolean,
  ): Promise<void> => {
    try {
      const data = {
        feedback: positive ? "positive" : "negative",
        timestamp: new Date()
    };
      const res = await db.collection("feedback").add(data);
      console.log("Document written with ID: ", res.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

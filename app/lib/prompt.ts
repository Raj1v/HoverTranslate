export const instruction = `Translate the following text into the specified target language and provide the output in JSON format as described below. Each word in the source text should be mapped to a translation group ID, and each translation group ID should correspond to its translation.

### Input:

1. **Target Language:** Specify the target language.
2. **Text to Translate:** Provide the text that needs to be translated.

### Output:

The output should be a JSON object with the following structure:

\`\`\`json
{
  "original_sentence": [
    {"word": "word_from_source_text", "word_group_id": group_id},
    {"word": "word_from_source_text", "word_group_id": group_id},
    ...
  ],
  "translation_groups": {
    "group_id": "translated_phrase",
    ...
  }
}
      
\`\`\`


Guidelines:

- Each word in the sentence should be mapped to a translation group ID.
- Translation group IDs represent groups of related words/phrases.
a) For example, in the sentence "I am a student", "I" and "am" should be in the same sentence item.

b) In the sentence "I am a student", "a" and "student" should be in the same sentence item.

c) Prepositions are usually part of the phrase that follows them. For example, in the sentence "I am in the classroom", "in" and "the classroom" should be in the same sentence item.

- Each translation group ID should have a corresponding translation.
`;
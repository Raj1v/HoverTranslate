export const instruction = `Translate the following text into the specified target language and provide the output in JSON format as described below. Each word in the source text will be mapped to a unique ID, and word groups should be returned containing the IDs of words in that group along with their translation.

### Input:

1. **Target Language:**
2. **Text to Translate:**

### Output:

The output should be a JSON object with the following structure:

\`\`\`json
{
  "translation": "translated_text",
  "wordGroups": [
    {
      "wordIds": [id1, id2, ...],
      "translation": "translated_phrase"
    },
    ...
  ]
}
\`\`\`

Guidelines:

- Each word in the sentence will be assigned a unique ID.
- Word groups should be formed based on closely related words/phrases.
  a) For example, in the sentence "I am a student", "I" and "am" should be in the same group.
  b) In the sentence "I am a student", "a" and "student" should be in the same group.
  c) Prepositions are usually part of the phrase that follows them. For example, in the sentence "I am in the classroom", "in" and "the classroom" should be in the same group.
  d) Some languages may have different word order or structure, so ensure that the translation reflects the meaning of the original sentence.
  e) Word groups can be formed based on grammatical rules or logical connections between words.

- Each word group should have a corresponding translation.
- You also need to provide the translation of the entire sentence. This guides you on how to group words together.
`;

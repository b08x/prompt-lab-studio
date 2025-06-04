
import { PromptAttribute, InputVariable } from '../types';

/**
 * Escapes special regular expression characters in a string.
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

/**
 * Substitutes variables in a given text string.
 * Variables are denoted by {{variable_name}}.
 * @param text The text containing variable placeholders.
 * @param variables An array of InputVariable objects.
 * @returns The text with variables substituted with their test values.
 */
export const substituteVariablesInText = (text: string, variables: InputVariable[]): string => {
  let substitutedText = text;
  variables.forEach(variable => {
    if (variable.name.trim() === '') return; // Skip empty variable names
    // Ensure variable.name is just the name, not {{name}}. Names are stored clean.
    const placeholder = new RegExp(`{{\\s*${escapeRegExp(variable.name.trim())}\\s*}}`, 'g');
    substitutedText = substitutedText.replace(placeholder, variable.testValue);
  });
  return substitutedText;
};


/**
 * Generates the full prompt text by combining the base prompt and attributes,
 * after substituting any defined input variables.
 * @param basePrompt The base prompt string.
 * @param attributes An array of PromptAttribute objects.
 * @param inputVariables An array of InputVariable objects.
 * @returns The complete, substituted prompt string.
 */
export const generateFullPromptText = (
  basePrompt: string,
  attributes: PromptAttribute[],
  inputVariables: InputVariable[]
): string => {
  const substitutedBasePrompt = substituteVariablesInText(basePrompt, inputVariables);
  
  let fullPrompt = substitutedBasePrompt.trim() ? `${substitutedBasePrompt.trim()}\n\n` : "";

  if (attributes.length > 0) {
    const processedAttributes = attributes.filter(attr => attr.name.trim() !== "" || attr.value.trim() !== "");
    if (processedAttributes.length > 0) {
        fullPrompt += "--- Attributes ---\n";
        processedAttributes.forEach(attr => {
          const substitutedValue = substituteVariablesInText(attr.value, inputVariables);
          fullPrompt += `${attr.name.trim()}: ${substitutedValue}\n`;
        });
    }
  }
  
  const finalPrompt = fullPrompt.trim();
  return finalPrompt || "Prompt is empty. Add a base prompt or attributes.";
};


import { ExamplePrompt, PredefinedAttributeKey, PREDEFINED_ATTRIBUTE_DESCRIPTIONS } from './types';

export const PREDEFINED_ATTRIBUTES_OPTIONS = (Object.keys(PredefinedAttributeKey) as Array<keyof typeof PredefinedAttributeKey>).map(key => ({
  name: PredefinedAttributeKey[key],
  description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey[key]]
}));

export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    id: 'example-1',
    name: 'Story Idea Generator (with Variables)',
    basePrompt: 'Generate a short story concept about {{protagonist_type}} who discovers an ancient {{artifact_type}} with unknown powers in a {{setting_type}} setting.',
    attributes: [
      { name: PredefinedAttributeKey.GENRE, value: '{{story_genre}} Adventure', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.GENRE] },
      { name: PredefinedAttributeKey.TONE, value: 'Mysterious and suspenseful', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.TONE] },
      { name: PredefinedAttributeKey.LENGTH, value: '1 paragraph plot summary', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.LENGTH] },
    ],
    inputVariables: [
        { name: 'protagonist_type', testValue: 'a reluctant hero' },
        { name: 'artifact_type', testValue: 'glowing orb' },
        { name: 'setting_type', testValue: 'forgotten jungle temple' },
        { name: 'story_genre', testValue: 'Sci-Fi' },
    ]
  },
  {
    id: 'example-2',
    name: 'Technical Explanation',
    basePrompt: 'Explain the concept of "{{js_concept}}" in JavaScript for {{target_audience}}.',
    attributes: [
      { name: PredefinedAttributeKey.ROLE, value: 'Senior Software Engineer', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.ROLE] },
      { name: PredefinedAttributeKey.FORMAT, value: 'Clear explanation with a simple code example', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.FORMAT] },
      { name: PredefinedAttributeKey.TONE, value: 'Patient and informative', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.TONE] },
    ],
    inputVariables: [
        { name: 'js_concept', testValue: 'event bubbling' },
        { name: 'target_audience', testValue: 'junior developers' }
    ]
  },
  {
    id: 'example-3',
    name: 'Recipe Creator',
    basePrompt: 'Create a unique recipe for a {{dish_type}} dish.',
    attributes: [
        { name: 'Cuisine Style', value: '{{cuisine_style}}-Fusion' },
        { name: 'Key Ingredient', value: '{{key_ingredient}}' },
        { name: PredefinedAttributeKey.DIFFICULTY, value: 'Intermediate', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.DIFFICULTY]},
        { name: PredefinedAttributeKey.FORMAT, value: 'Ingredients list followed by step-by-step instructions.', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.FORMAT]},
    ],
    inputVariables: [
        { name: 'dish_type', testValue: 'pasta' },
        { name: 'cuisine_style', testValue: 'Italian' },
        { name: 'key_ingredient', testValue: 'Avocado' }
    ]
  }
];

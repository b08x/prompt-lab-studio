
import { ExamplePrompt, PredefinedAttributeKey, PREDEFINED_ATTRIBUTE_DESCRIPTIONS, Domain, DomainAttributeValueConfig } from './types';

export const PREDEFINED_ATTRIBUTES_OPTIONS = (Object.keys(PredefinedAttributeKey) as Array<keyof typeof PredefinedAttributeKey>).map(key => ({
  name: PredefinedAttributeKey[key],
  description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey[key]]
}));

export const DOMAINS: Domain[] = [
  { id: 'it', name: 'Information Technology', description: 'Prompts related to software, hardware, networking, and IT support.' },
  { id: 'nlp', name: 'Natural Language Processing', description: 'Prompts for tasks like text generation, translation, summarization specific to NLP models.' },
  { id: 'creative_writing', name: 'Creative Writing', description: 'Prompts for stories, poems, scripts, and other creative text formats.' },
  { id: 'marketing', name: 'Digital Marketing', description: 'Prompts for ad copy, social media content, SEO, and marketing strategies.' },
  { id: 'education', name: 'Education & Learning', description: 'Prompts for creating educational materials, explanations, and quizzes.' },
  { id: 'general', name: 'General Purpose', description: 'For prompts that don\'t fit a specific domain or for broad tasks.'}
];

export const DOMAIN_ATTRIBUTE_VALUE_CONFIGS: DomainAttributeValueConfig[] = [
  // Information Technology
  { domainId: 'it', attributeName: PredefinedAttributeKey.TASK, valueOptions: ['Debug code', 'Write a script', 'Explain a technical concept', 'Design system architecture', 'Troubleshoot an issue'] },
  { domainId: 'it', attributeName: PredefinedAttributeKey.FORMAT, valueOptions: ['Python code block', 'JSON response', 'Step-by-step instructions', 'Markdown document', 'System diagram description'] },
  { domainId: 'it', attributeName: 'Programming Language', valueOptions: ['Python', 'JavaScript', 'Java', 'C#', 'Go', 'SQL'] }, // Custom attribute example
  { domainId: 'it', attributeName: PredefinedAttributeKey.AUDIENCE, valueOptions: ['Junior Developer', 'Senior Engineer', 'Non-technical user', 'System Administrator'] },

  // Natural Language Processing
  { domainId: 'nlp', attributeName: PredefinedAttributeKey.TASK, valueOptions: ['Summarize text', 'Translate text', 'Generate text in a specific style', 'Classify sentiment', 'Extract entities'] },
  { domainId: 'nlp', attributeName: PredefinedAttributeKey.FORMAT, valueOptions: ['JSON with entities', 'Bullet-point summary', 'Translated paragraph', 'Text classification label'] },
  { domainId: 'nlp', attributeName: PredefinedAttributeKey.LANGUAGE, valueOptions: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'] },

  // Creative Writing
  { domainId: 'creative_writing', attributeName: PredefinedAttributeKey.GENRE, valueOptions: ['Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 'Horror', 'Historical Fiction', 'Poetry'] },
  { domainId: 'creative_writing', attributeName: PredefinedAttributeKey.TONE, valueOptions: ['Humorous', 'Suspenseful', 'Dramatic', 'Whimsical', 'Dark', 'Inspiring'] },
  { domainId: 'creative_writing', attributeName: 'Plot Element', valueOptions: ['Introduce a conflict', 'Develop a character', 'Describe a setting', 'Write a dialogue scene'] }, // Custom
  { domainId: 'creative_writing', attributeName: PredefinedAttributeKey.LENGTH, valueOptions: ['Short story (1000 words)', 'Flash fiction (300 words)', 'One-act play script', 'Poem (14 lines)'] },

  // Digital Marketing
  { domainId: 'marketing', attributeName: PredefinedAttributeKey.TASK, valueOptions: ['Write ad copy', 'Create a social media post', 'Draft a blog post outline', 'Generate SEO keywords', 'Develop a content strategy idea'] },
  { domainId: 'marketing', attributeName: 'Platform', valueOptions: ['Facebook', 'Instagram', 'Twitter (X)', 'LinkedIn', 'TikTok', 'Google Ads'] }, // Custom
  { domainId: 'marketing', attributeName: PredefinedAttributeKey.AUDIENCE, valueOptions: ['Small business owners', 'Tech enthusiasts', 'Young adults (18-25)', 'Parents'] },
  { domainId: 'marketing', attributeName: PredefinedAttributeKey.TONE, valueOptions: ['Persuasive', 'Urgent', 'Informative', 'Playful', 'Professional'] },
  
  // Education & Learning
  { domainId: 'education', attributeName: PredefinedAttributeKey.TASK, valueOptions: ['Explain a concept', 'Create a quiz', 'Generate a lesson plan', 'Provide an example problem', 'Simulate a dialogue for practice'] },
  { domainId: 'education', attributeName: PredefinedAttributeKey.DIFFICULTY, valueOptions: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
  { domainId: 'education', attributeName: PredefinedAttributeKey.AUDIENCE, valueOptions: ['Elementary school students', 'High school students', 'College students', 'Adult learners'] },
  { domainId: 'education', attributeName: PredefinedAttributeKey.FORMAT, valueOptions: ['Multiple-choice questions', 'Fill-in-the-blanks exercise', 'Step-by-step explanation', 'Interactive scenario script'] },
];


export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    id: 'example-1',
    name: 'Story Idea Generator (with Variables)',
    basePrompt: 'Generate a short story concept about {{protagonist_type}} who discovers an ancient {{artifact_type}} with unknown powers in a {{setting_type}} setting.',
    attributes: [
      { name: PredefinedAttributeKey.GENRE, value: '{{story_genre}} Adventure', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.GENRE], valueType: 'text' },
      { name: PredefinedAttributeKey.TONE, value: 'Mysterious and suspenseful', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.TONE], valueType: 'text' },
      { name: PredefinedAttributeKey.LENGTH, value: '1 paragraph plot summary', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.LENGTH], valueType: 'text' },
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
      { name: PredefinedAttributeKey.ROLE, value: 'Senior Software Engineer', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.ROLE], valueType: 'text' },
      { name: PredefinedAttributeKey.FORMAT, value: 'Clear explanation with a simple code example', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.FORMAT], valueType: 'text' },
      { name: PredefinedAttributeKey.TONE, value: 'Patient and informative', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.TONE], valueType: 'text' },
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
        { name: 'Cuisine Style', value: '{{cuisine_style}}-Fusion', valueType: 'text' },
        { name: 'Key Ingredient', value: '{{key_ingredient}}', valueType: 'text' },
        { name: PredefinedAttributeKey.DIFFICULTY, value: 'Intermediate', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.DIFFICULTY], valueType: 'text'},
        { name: PredefinedAttributeKey.FORMAT, value: 'Ingredients list followed by step-by-step instructions.', description: PREDEFINED_ATTRIBUTE_DESCRIPTIONS[PredefinedAttributeKey.FORMAT], valueType: 'text'},
    ],
    inputVariables: [
        { name: 'dish_type', testValue: 'pasta' },
        { name: 'cuisine_style', testValue: 'Italian' },
        { name: 'key_ingredient', testValue: 'Avocado' }
    ]
  }
];

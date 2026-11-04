export type ProductArea = {
  slug: string;
  title: string;
  tags: string[];
  summary: string;
  problem: string;
  method: string;
  results: string[];
  stack: string[];
  links: { label: string; href: string }[];
};

export const productAreas: ProductArea[] = [
  {
    slug: 'me-home',
    title: 'Me Home infrastructure',
    tags: ['Home computer', 'Local models', 'Private data'],
    summary: 'A home AI computer concept designed to run local models and hold private conversations in the household.',
    problem: 'Most AI assistants put the model and conversation history in a service outside the home. Me is designed around household control of both.',
    method: 'Me Home is described as a dedicated computer in the house. Everyday private conversations are processed by local language models and chat history is stored on its drive. Hardware remains a concept and is in development.',
    results: ['The current product site documents local model processing and local storage for private chats.', 'The site labels the hardware imagery as concept renders; it does not claim the hardware is shipping.'],
    stack: ['Dedicated home computer concept', 'Local model runtime not specified in the repo', 'On-device drive concept; storage technology not specified'],
    links: [{ label: 'Read the architecture', href: '/how-it-works' }, { label: 'See the overview', href: '/' }],
  },
  {
    slug: 'mobile-companion',
    title: 'The mobile companion',
    tags: ['Mobile app', 'Household profiles', 'Chat'],
    summary: 'A phone app that brings household profiles, chat, rules, and approvals together.',
    problem: 'A home-based assistant still needs a useful way for each person in a household to reach it and for parents to supervise children’s profiles.',
    method: 'The product concept pairs Me Home with a mobile app for household members. The existing product pages describe family profiles, chat, feed controls, rules, and approval requests.',
    results: ['The current site documents the app as the household-facing companion to Me Home.', 'App screens on this site are illustrative product concepts, not a released mobile application.'],
    stack: ['Expo + React Native app', 'TypeScript', 'AsyncStorage for app state', 'Expo SecureStore for native connector credentials'],
    links: [{ label: 'How the two parts fit', href: '/how-it-works' }, { label: 'Try a scripted preview', href: '/#try-it' }],
  },
  {
    slug: 'user-controlled-feed',
    title: 'A user-controlled learning feed',
    tags: ['Feed', 'Family controls', 'Learning'],
    summary: 'A full-screen feed concept where families can set what the experience should prioritize.',
    problem: 'A feed optimized for attention can work against the goals a family has for a young person.',
    method: 'The Me concept describes a vertical feed with family-controlled priorities. The home page includes an interactive illustrative dial to show how goal weighting could change.',
    results: ['The current site demonstrates a working illustrative slider that updates the displayed feed weights.', 'The slider is an example control, not a connected feed or evidence of a deployed recommendation system.'],
    stack: ['Expo + React Native', 'TypeScript', 'expo-video for clip playback', 'Illustrative weighting control; no live recommendation model in this preview'],
    links: [{ label: 'Explore the overview', href: '/' }, { label: 'See the local Q&A', href: '/ask' }],
  },
  {
    slug: 'private-chat',
    title: 'Private chat',
    tags: ['Chat', 'Local processing', 'Storage'],
    summary: 'Private conversations are intended to be processed at home and stored on Me Home.',
    problem: 'People may want to ask sensitive questions without sending everyday private chat history to a cloud provider.',
    method: 'The described flow runs a local model on Me Home, then saves private conversation history to its drive. This describes the intended product architecture, not a guarantee for third-party actions.',
    results: ['The current architecture page explicitly distinguishes home-processed private chat from tasks that contact outside services.', 'The chat shown on the product site is identified as a fictional example.'],
    stack: ['Expo + React Native chat UI', 'TypeScript', 'AsyncStorage-backed prototype conversations', 'Live home model runtime is not included in this preview'],
    links: [{ label: 'How it works', href: '/how-it-works' }, { label: 'Ask about documented product details', href: '/ask' }],
  },
  {
    slug: 'approved-connectors',
    title: 'Approved outside actions',
    tags: ['Approvals', 'Connectors', 'User control'],
    summary: 'Actions that need an outside service are meant to ask for approval and identify what information they will share.',
    problem: 'Some useful tasks cannot be completed entirely at home; contacting a service means information can leave the home.',
    method: 'The product concept describes an approval request that names the service and the information involved. Once approved, that action can contact an outside service and share the details needed for the task.',
    results: ['The current site documents an example approval flow and states that approved external actions can contact services.', 'The product pages do not claim that external actions are local-only.'],
    stack: ['Expo + React Native connector UI', 'expo-auth-session OAuth flow', 'Expo SecureStore for native credentials', 'Express API server; provider actions are not demonstrated by this site preview'],
    links: [{ label: 'Read the honest boundary', href: '/how-it-works' }, { label: 'See the overview', href: '/' }],
  },
];

export const allTags = Array.from(new Set(productAreas.flatMap((area) => area.tags)));

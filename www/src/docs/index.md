---
pageTitle: Overview
eleventyNavigation:
  key: Overview
---

## Installation

```bash
$ npm i @retronav/ixora
```

```ts twoslash
import { basicSetup, EditorView } from 'codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
// ---cut---
import ixora, { frontmatter } from '@retronav/ixora';

const editor = new EditorView({
	extensions: [
		// ...
		ixora,

		// Install frontmatter extension with Markdown extension
		markdown({
			base: markdownLanguage,
			extensions: [frontmatter],
		}),
	],
});
```

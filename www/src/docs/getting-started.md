---
pageTitle: Getting Started
eleventyNavigation:
  key: Getting Started
  order: 1
---

## Installation

### Node.js

Ixora can be installed using your favorite package manager.

```bash
$ npm i @retronav/ixora # could be yarn or pnpm
```

### Deno

While Ixora and CodeMirror are libraries intended to be used on the web, they
can also be used in code that will be processed with the help of Deno. To
install on deno, you can use a CDN that supports Deno, like https://esm.sh.

```ts
import ixora, { frontmatter } from 'https://esm.sh/@retronav/ixora';
```

Import maps can also be used with Ixora.

```json
{
	"imports": {
		"@retronav/ixora": "https://esm.sh/@retronav/ixora",
		"codemirror": "https://esm.sh/codemirror"
	}
}
```

## Minimal setup

Since Ixora uses data from the Markdown parser in the
[CodeMirror Markdown extension][codemirror-lang-markdown], you also need to
configure it with Ixora for everything to function properly. `basicSetup` or
`minimalSetup` are optional, but are still added here.

```ts twoslash title="index.ts"
import { basicSetup, EditorView } from 'codemirror';
import type { Extension } from '@codemirror/state';
import ixora, { frontmatter } from '@retronav/ixora';

const editor = new EditorView({
	extensions: [basicSetup, ixora] as Extension,
});
```

[codemirror-lang-markdown]: https://www.npmjs.com/package/@codemirror/lang-markdown

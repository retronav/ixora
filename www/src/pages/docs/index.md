---
layout: ~/layouts/docs.astro
---

# Introduction

Ixora is a extension pack for CodeMirror 6 that implements
<abbr title="What you see is what you mean">WYSIWYM</abbr> editing experiences
for Markdown. This extension pack can be used on any platform that can run
CodeMirror 6 (browsers, embedded browsers, Electron apps).

## Installation

Download Ixora in your project by installing the `@retronav/ixora` NPM package.

```shell
$ pnpm i @retronav/ixora
```

```ts twoslash
interface IdLabel {id: number, /* some fields */ }
interface NameLabel {name: string, /* other fields */ }
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
// This comment should not be included

// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented"
}

let a = createLabel("typescript");
```

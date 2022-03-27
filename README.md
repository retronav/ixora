<p align="center">
    <img src="./assets/logo.svg" alt="Ixora logo" />
</p>

---

# Ixora

A CodeMirror 6 extension pack to make writing Markdown fun and beautiful.

> ⚠️ NOTE: Ixora is under development and probably has some bugs. Although it
> is usable, but right now it's not suited for production use-cases. You'll
> need to build it yourself as this is not pushed to NPM.

## Features

This library includes:

-   Proper heading font sizes
-   Hidden decoration marks (`*italic*` -> `italic` but style is preserved)
-   Auto link detection
-   Support for ID links (eg. `[Foo bar](#foo-bar)`)
-   YAML frontmatter support
-   Styling for lots of Markdown elements
-   [Lots more?](./TODO.md)

## Installation

1. Install the `@retronav/ixora` package using the package manager
   of your choice.
2. Import the extensions you need
    ```ts
    import { headings, codeblock } from '@retronav/ixora';
    ```
3. Add them in the `extensions` parameter of your CodeMirror editor creation
   function.

# Additional information

## License

The source code is licensed under the [Apache License 2.0](LICENSE).

The artwork is licensed under [CC BY 4.0](./assets/LICENSE).

## The logo

The logo of this project is derived from [the Markdown Mark](https://dcurt.is/the-markdown-mark) by [Dustin Curtis](https://dcurt.is/). The logo uses the
color #FF2400 (scarlet). Instead of the arrow pointing downward, there is an
ixora flower beside the "M" which can be symbolised as an arrow pointing upward.

<p align="center">
    <img
    height="150px"
    src="https://codeberg.org/retronav/ixora/raw/branch/main/assets/logo.svg"
    alt="Ixora logo" />
</p>

# Ixora

![CI build](https://ci.codeberg.org/api/badges/retronav/ixora/status.svg)
![npm version](https://img.shields.io/npm/v/@retronav/ixora?logo=npm&style=flat)

> WARNING: Ixora is under heavy development, but is quite usable.

Ixora is a CodeMirror 6 extension pack to make writing
Markdown fun and beautiful.

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
    import { headings, codeblock, list } from '@retronav/ixora';
    ```
    Or import all of them at once
    ```ts
    import ixora from '@retronav/ixora';
    ```
3. Add them in the `extensions` parameter of your CodeMirror editor creation
   function.

    ```ts
    const editor = new EditorView({
    	state: EditorState.create({
    		extensions: [
    			// If you import all at once
    			ixora,

    			// ...

    			// If you import indivivually
    			headings(),
    			codeblock(),
    			lists()

    			// ...
    		]
    	})
    });
    ```

Check `test/util.ts` for an example of how to use Ixora with CodeMirror.

# Additional information

## License

The source code is licensed under the
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt).

The artwork is licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## The logo

The logo of this project is derived from
[the Markdown Mark](https://dcurt.is/the-markdown-mark)
by [Dustin Curtis](https://dcurt.is/). The logo uses the color #FF2400
(scarlet). Instead of the arrow pointing downward, there is an
ixora flower beside the "M" which can be thought of as an arrow pointing upward.

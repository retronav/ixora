# Glass Badger

A CodeMirror 6 extension pack to make writing Markdown fun and beautiful.

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

1. Install the `@obnoxiousnerd/glass-badger` package using the package manager
   of your choice.
2. Import the extensions you need
    ```ts
    import { headings, codeblock } from '@obnoxiousnerd/glass-badger';
    ```
3. Add them in the `extensions` parameter of your CodeMirror editor creation function.

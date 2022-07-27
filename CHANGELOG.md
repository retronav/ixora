# @retronav/ixora

## 0.3.2

### Patch Changes

Changeset committed in 1cf9fc3

Fix image preview re-rendering when a change is made to the document.

## 0.3.1

### Patch Changes

Changeset committed in a77fa82

Fix messed up editor when an image preview is loaded.

This is done by rendering a placeholder while the image loads,
then replace it by the loaded image.

## 0.3.0

### Minor Changes

Changeset committed in eb147ad

Added image plugin.

## 0.2.1

### Patch Changes

Changeset committed in 64acd12

Fix heading plugin crash if slugs are not calculated.

## 0.2.0

### Minor Changes

Changeset committed in ece965e

-   Add heading class to the entire line instead of only heading text (70da999)
-   Blacklist nodes which shouldn't hide marks and url (d95997c)
-   Improved blockquote decoration techniques (27646c5)
-   A new `classes` module for all custom classes used throughout Ixora (ae8e40b)
-   Fix `editorLines` function which leaked decorations outside the folded region (33e542d)

## 0.1.4

### Patch Changes

Changeset committed in d2123da

Update dependencies (CodeMirror 6 released).

## 0.1.3

### Patch Changes

Changeset committed in 5a90f6e

-   Keep all plugin files seperate in production build, to improve modularity.
-   Introduce a default export consisting of all plugins.
-   Update dependencies and remove deprecated CodeMirror packages.
-   Remove the "YAML" prefix from all node names in the frontmatter plugin.

## 0.1.2

### Patch Changes

Changeset committed in d323e10

Export intended symbols instead of everything.

## 0.1.1

### Patch Changes

Changeset committed in 4c7f7f6

Fix the weird highlighting of the frontmatter fence.

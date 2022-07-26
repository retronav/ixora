---
'@retronav/ixora': patch
---

Fix messed up editor when an image preview is loaded.

This is done by rendering a placeholder while the image loads,
then replace it by the loaded image.

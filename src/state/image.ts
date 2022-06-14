import { syntaxTree } from '@codemirror/language';
import { StateField, EditorState } from '@codemirror/state';

/**
 * Representation of the data held by the image URL state field.
 */
interface ImageURLInfo {
    /**
     * The URL of the image.
     */
    url: string;
    /**
     * The starting position of the image element in the document.
     */
    from: number;
    /**
     * The end position of the image element in the document.
     */
    to: number;
    /**
     * The alt text of the image.
     */
    alt: string;
}

export const imageURLStateField = StateField.define<ImageURLInfo[]>({
    create: (state) => extractImages(state),

    // Recalculation seems the only solution for updates
    update: (_value, tx) => extractImages(tx.state)
});

function extractImages(state: EditorState): ImageURLInfo[] {
    const imageUrls: ImageURLInfo[] = [];
    syntaxTree(state).iterate({
        enter: ({ type, node, from, to }) => {
            if (type.name !== 'Image') return;
            const alt = state
                .sliceDoc(from, to)
                .match(/(?:!\[)(.*?)(?:\])/)
                .pop();
            const urlNode = node.getChild('URL');
            if (urlNode) {
                const url = state.sliceDoc(urlNode.from, urlNode.to);
                imageUrls.push({ url, from, to, alt });
            }
        }
    });
    return imageUrls;
}

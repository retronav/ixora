import { syntaxTree } from '@codemirror/language';
import {
    Decoration,
    DecorationSet,
    EditorView,
    ViewPlugin,
    ViewUpdate,
    WidgetType
} from '@codemirror/view';
import { headingSlugField } from '../state/heading-slug';

/**
 * CodeMirror plugin to enchance Markdown links.
 */
export const links = () => [goToLinkPlugin, baseTheme];

export class GoToLinkWidget extends WidgetType {
    constructor(readonly link: string) {
        super();
    }
    toDOM(view: EditorView): HTMLElement {
        const anchor = document.createElement('a');
        if (this.link.startsWith('#')) {
            // Handle links within the markdown document.
            const slugs = view.state.field(headingSlugField);
            anchor.addEventListener('click', () => {
                const pos = slugs.find(
                    (h) => h.slug === this.link.slice(1)
                )?.pos;
                // pos could be zero, so instead check if its undefined
                if (typeof pos !== 'undefined') {
                    const tr = view.state.update({
                        selection: { anchor: pos },
                        scrollIntoView: true
                    });
                    view.dispatch(tr);
                }
            });
        } else anchor.href = this.link;
        anchor.target = '_blank';
        anchor.classList.add('cm-link');
        anchor.textContent = '🔗';
        return anchor;
    }
}

function getLinkAnchor(view: EditorView) {
    const widgets = [];

    for (const { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({
            from,
            to,
            enter: ({ type, from, to }) => {
                if (type.name !== 'URL') return;
                const dec = Decoration.widget({
                    widget: new GoToLinkWidget(view.state.sliceDoc(from, to)),
                    side: 1
                });
                widgets.push(dec.range(to, to));
            }
        });
    }

    return Decoration.set(widgets);
}

export const goToLinkPlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet = Decoration.none;
        constructor(view: EditorView) {
            this.decorations = getLinkAnchor(view);
        }
        update(update: ViewUpdate) {
            if (
                update.docChanged ||
                update.viewportChanged ||
                update.selectionSet
            )
                this.decorations = getLinkAnchor(update.view);
        }
    },
    { decorations: (v) => v.decorations }
);

const baseTheme = EditorView.baseTheme({
    '.cm-link': {
        cursor: 'pointer',
        textDecoration: 'underline'
    }
});

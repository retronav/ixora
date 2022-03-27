/**
 * Copyright 2022 Pranav Karawale
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    ViewPlugin,
    DecorationSet,
    Decoration,
    EditorView,
    ViewUpdate
} from '@codemirror/view';
import {
    isCursorInRange,
    invisibleDecoration,
    iterateTreeInVisibleRanges,
    editorLines
} from '../util';

/**
 * CodeMirror extension to style code blocks.
 */
export const codeblock = () => [codeBlockPlugin, baseTheme];

const codeBlockPlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet;
        constructor(view: EditorView) {
            this.decorations = decorateCodeBlocks(view);
        }
        update(update: ViewUpdate) {
            if (
                update.docChanged ||
                update.viewportChanged ||
                update.selectionSet
            )
                this.decorations = decorateCodeBlocks(update.view);
        }
    },
    { decorations: v => v.decorations }
);

function decorateCodeBlocks(view: EditorView) {
    const widgets = [];
    iterateTreeInVisibleRanges(view, {
        enter: (type, from, to, node) => {
            if (type.name !== 'FencedCode') return;
            editorLines(view, from, to).map(block => {
                const lineDec = Decoration.line({
                    class: 'cm-codeblock'
                });
                widgets.push(lineDec.range(block.from));
            });
            if (isCursorInRange(view, [from, to])) return;
            const codeBlock = node().toTree();
            codeBlock.iterate({
                enter: (type, nfrom, nto) => {
                    switch (type.name) {
                        case 'CodeInfo':
                        case 'CodeMark':
                            // eslint-disable-next-line no-case-declarations
                            const decRange = invisibleDecoration.range(
                                from + nfrom,
                                from + nto
                            );
                            widgets.push(decRange);
                            break;
                    }
                }
            });
        }
    });
    return Decoration.set(widgets, true);
}

const baseTheme = EditorView.baseTheme({
    '.cm-codeblock': {
        padding: '0 1rem',
        backgroundColor: '#CCC7'
    }
});

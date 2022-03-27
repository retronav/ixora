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
    Decoration,
    DecorationSet,
    EditorView,
    ViewPlugin,
    ViewUpdate
} from '@codemirror/view';
import {
    checkRangeOverlap,
    isCursorInRange,
    iterateTreeInVisibleRanges
} from '../util';

export const typesWithMarks = [
    'Emphasis',
    'StrongEmphasis',
    'InlineCode',
    'Strikethrough'
];
export const markTypes = ['EmphasisMark', 'CodeMark', 'StrikethroughMark'];

class HideMarkPlugin {
    decorations: DecorationSet;
    constructor(view: EditorView) {
        this.decorations = this.compute(view);
    }
    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged || update.selectionSet)
            this.decorations = this.compute(update.view);
    }
    compute(view: EditorView): DecorationSet {
        const widgets = [];
        let parentRange: [number, number];
        iterateTreeInVisibleRanges(view, {
            enter: (type, from, to, node) => {
                if (typesWithMarks.includes(type.name)) {
                    // There can be a possibility that the current node is a
                    // child eg. a bold node in a emphasis node, so check
                    // for that or else save the node range
                    if (
                        parentRange &&
                        checkRangeOverlap([from, to], parentRange)
                    )
                        return;
                    else parentRange = [from, to];
                    if (isCursorInRange(view, [from, to])) return;
                    const innerTree = node().toTree();
                    innerTree.iterate({
                        enter(type, mfrom, mto) {
                            // Check for mark types and push the replace
                            // decoration
                            if (!markTypes.includes(type.name)) return;
                            widgets.push(
                                Decoration.replace({}).range(
                                    from + mfrom,
                                    from + mto
                                )
                            );
                        }
                    });
                }
            }
        });
        return Decoration.set(widgets, true);
    }
}

/**
 * CodeMirror plugin to hide Markdown decoration marks.
 */
export const hideMarks = () => [
    ViewPlugin.fromClass(HideMarkPlugin, {
        decorations: v => v.decorations
    })
];

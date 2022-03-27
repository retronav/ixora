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
    ViewUpdate,
    WidgetType
} from '@codemirror/view';
import { isCursorInRange, iterateTreeInVisibleRanges } from '../util';
import { ChangeSpec } from '@codemirror/state';
import { Range } from '@codemirror/rangeset';
import { NodeType, SyntaxNode } from '@lezer/common';

const bulletListMarkerRE = /^[-+*]/;

/**
 * CodeMirror plugin to add make Markdown lists look better.
 * This includes:
 * - Custom list mark
 * - Checkbox for task lists
 */
export const lists = () => [listBulletPlugin, taskListPlugin, baseTheme];

//#region list bullet plugin
/**
 * Plugin to add custom list bullet mark.
 */
class ListBulletPlugin {
    decorations: DecorationSet = Decoration.none;
    constructor(view: EditorView) {
        this.decorations = this.decorateLists(view);
    }
    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged || update.selectionSet)
            this.decorations = this.decorateLists(update.view);
    }
    private decorateLists(view: EditorView) {
        const widgets = [];
        iterateTreeInVisibleRanges(view, {
            enter: (type, from, to) => {
                if (isCursorInRange(view, [from, to])) return;
                if (type.name === 'ListMark') {
                    const listMark = view.state.sliceDoc(from, to);
                    if (bulletListMarkerRE.test(listMark)) {
                        const dec = Decoration.replace({
                            widget: new ListBulletWidget(listMark)
                        });
                        widgets.push(dec.range(from, to));
                    }
                }
            }
        });
        return Decoration.set(widgets, true);
    }
}
const listBulletPlugin = ViewPlugin.fromClass(ListBulletPlugin, {
    decorations: v => v.decorations
});

/**
 * Widget to render list bullet mark.
 */
class ListBulletWidget extends WidgetType {
    constructor(readonly bullet: string) {
        super();
    }
    toDOM(): HTMLElement {
        const listBullet = document.createElement('span');
        listBullet.textContent = this.bullet;
        listBullet.className = 'cm-list-bullet';
        return listBullet;
    }
}

//#endregion

//#region task list plugin
/**
 * Plugin to add checkbox for task lists.
 */
class TaskListsPlugin {
    decorations: DecorationSet = Decoration.none;
    constructor(view: EditorView) {
        this.decorations = this.addCheckboxes(view);
    }
    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged || update.selectionSet)
            this.decorations = this.addCheckboxes(update.view);
    }
    addCheckboxes(view: EditorView) {
        const widgets: Range<Decoration>[] = [];
        iterateTreeInVisibleRanges(view, {
            enter: this.iterateTree(view, widgets)
        });
        return Decoration.set(widgets, true);
    }

    private iterateTree(view: EditorView, widgets: Range<Decoration>[]) {
        return (
            type: NodeType,
            from: number,
            to: number,
            node: () => SyntaxNode
        ) => {
            if (type.name !== 'Task') return;
            let checked = false;
            // Iterate inside the task node to find the checkbox
            node()
                .toTree()
                .iterate({
                    enter: iterateInner
                });
            if (checked)
                widgets.push(
                    Decoration.mark({
                        tagName: 'span',
                        class: 'cm-task-checked'
                    }).range(from, to)
                );

            function iterateInner(type: NodeType, nfrom: number, nto: number) {
                if (type.name !== 'TaskMarker') return;
                if (isCursorInRange(view, [from + nfrom, from + nto])) return;
                const checkbox = view.state.sliceDoc(from + nfrom, from + nto);
                // Checkbox is checked if it has a 'x' in between the []
                if ('xX'.includes(checkbox[1])) checked = true;
                const dec = Decoration.replace({
                    widget: new CheckboxWidget(checked, from + nfrom + 1)
                });
                widgets.push(dec.range(from + nfrom, from + nto));
            }
        };
    }
}

/**
 * Widget to render checkbox for task list.
 */
class CheckboxWidget extends WidgetType {
    constructor(public checked: boolean, readonly pos: number) {
        super();
    }
    toDOM(view: EditorView): HTMLElement {
        const wrap = document.createElement('span');
        wrap.classList.add('cm-task-marker-checkbox');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = this.checked;
        checkbox.addEventListener('click', ({ target }) => {
            const change: ChangeSpec = {
                from: this.pos,
                to: this.pos + 1,
                insert: this.checked ? ' ' : 'x'
            };
            view.dispatch({ changes: change });
            this.checked = !this.checked;
            (target as HTMLInputElement).checked = this.checked;
        });
        wrap.appendChild(checkbox);
        return wrap;
    }
}

const taskListPlugin = ViewPlugin.fromClass(TaskListsPlugin, {
    decorations: v => v.decorations
});
//#endregion

/**
 * Base theme for the lists plugin.
 */
const baseTheme = EditorView.baseTheme({
    '.cm-list-bullet': {
        position: 'relative',
        visibility: 'hidden'
    },
    '.cm-task-checked': {
        textDecoration: 'line-through !important'
    },
    '.cm-list-bullet:after': {
        visibility: 'visible',
        position: 'absolute',
        top: 0,
        left: 0,
        content: "'\\2022'" /* U+2022 BULLET */
    }
});

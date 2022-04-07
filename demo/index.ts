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

import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { theme } from './theme';
import { indentWithTab } from '@codemirror/commands';
import { highlightActiveLine, keymap } from '@codemirror/view';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { StreamLanguage } from '@codemirror/stream-parser';
import {
    frontmatter,
    headings,
    hideMarks,
    links,
    codeblock,
    blockquote,
    lists,
    headingSlugField
} from '../src';
import { defaultHighlightStyle } from '@codemirror/highlight';

const editor = new EditorView({
    state: EditorState.create({
        extensions: [
            highlightActiveLine(),
            defaultHighlightStyle,
            keymap.of([indentWithTab]),
            markdown({
                base: markdownLanguage,
                extensions: [frontmatter]
            }),
            StreamLanguage.define(yaml),
            EditorView.lineWrapping,
            theme,

            basicSetup,

            // linksPlugin,
            headings(),
            hideMarks(),
            links(),
            codeblock(),
            blockquote(),
            lists(),
            headingSlugField
        ]
    }),
    parent: document.body
});

editor.focus();

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

import { Extension } from '@codemirror/state';
import { blockquote } from './plugins/blockquote';
import { codeblock } from './plugins/code-block';
import { headings } from './plugins/heading';
import { hideMarks } from './plugins/hide-mark';
import { links } from './plugins/link';
import { lists } from './plugins/list';
import { headingSlugField } from './state/heading-slug';

// State fields
export { headingSlugField } from './state/heading-slug';

// Extensions
export { blockquote } from './plugins/blockquote';
export { codeblock } from './plugins/code-block';
export { frontmatter } from './plugins/frontmatter';
export { headings } from './plugins/heading';
export { hideMarks } from './plugins/hide-mark';
export { links } from './plugins/link';
export { lists } from './plugins/list';

export const basicSetup: Extension = [
    headingSlugField,
    blockquote(),
    codeblock(),
    headings(),
    hideMarks(),
    lists(),
    links(),
];

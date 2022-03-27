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

import { syntaxTree } from '@codemirror/language';
import { EditorState, StateField } from '@codemirror/state';
import { Slugger } from '../util';

export interface HeadingSlug {
    slug: string;
    pos: number;
}

// A header starts with a hash character (upto 6), then a space,
// then the header content.
const headingStartRE = /^(#{1,6}\s)/;

/**
 * A plugin that stores the calculated slugs of the document headings in the
 * editor state. These can be useful when resolving links to headings inside
 * the document.
 */
export const headingSlugField = StateField.define<HeadingSlug[]>({
    create: state => {
        const slugs = new Array<HeadingSlug>();
        extractSlugs(state);
        return slugs;
    },
    update: (_value, tx) => {
        // It seems very hard to incrementially calculate slugs, so a
        // recalculation is the best option.
        const slugs = extractSlugs(tx.state);
        return slugs;
    },
    compare: (a, b) =>
        a.length === b.length &&
        a.every((slug, i) => slug.slug === b[i].slug && slug.pos === b[i].pos)
});

function extractSlugs(state: EditorState) {
    const slugs: HeadingSlug[] = [];
    const slugger = new Slugger();
    syntaxTree(state).iterate({
        enter: (type, from, to) => {
            if (!type.name.includes('ATXHeading')) return;
            const slug = slugger.slug(
                // TODO: There can be areas if the heading has
                // marks and could result in weird behaviour,
                // this should be investigated.
                state.sliceDoc(from, to).replace(headingStartRE, '')
            );
            if (slug) slugs.push({ slug, pos: from });
        }
    });
    return slugs;
}

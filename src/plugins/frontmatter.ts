import { Element, MarkdownConfig } from '@lezer/markdown';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { foldInside, foldNodeProp, StreamLanguage } from '@codemirror/language';
import { styleTags, tags } from '@lezer/highlight';

const frontMatterFence = /^---\s*$/m;

// TODO: move all of the nodenames to a single place which could be used
// for highlighting codeblocks as well.
const yamlNodes = [
    'atom',
    { name: 'meta', block: true },
    'number',
    'keyword',
    'definition',
    'comment',
    'string'
];

/**
 * Lezer Markdown extension for YAML frontmatter support. This includes support
 * for parsing, syntax highlighting and folding.
 */
export const frontmatter: MarkdownConfig = {
    props: [
        styleTags({
            number: tags.number,
            keyword: tags.keyword,
            definition: tags.definition(tags.labelName),
            comment: tags.comment,
            string: tags.string,
            atom: tags.atom,
            meta: tags.meta,
            FrontmatterMark: tags.processingInstruction
        }),
        foldNodeProp.add({
            Frontmatter: foldInside,
            FrontmatterMark: () => null
        })
    ],
    defineNodes: [
        { name: 'Frontmatter', block: true },
        'FrontmatterMark',
        ...yamlNodes
    ],
    parseBlock: [
        {
            name: 'Fronmatter',
            before: 'HorizontalRule',
            parse: (cx, line) => {
                let matter = '';
                const start = 0;
                let end: number;
                const children = new Array<Element>();
                // If the first line in the document starts with the frontmatter
                // fence, parse it.
                if (frontMatterFence.test(line.text) && cx.lineStart === 0) {
                    // 4 is the length of the frontmatter fence (---\n).
                    children.push(cx.elt('FrontmatterMark', start, 4));
                    while (cx.nextLine()) {
                        if (frontMatterFence.test(line.text)) {
                            end = cx.lineStart + 4;
                            break;
                        }
                        matter += line.text + '\n';
                    }
                    const yamlParser = StreamLanguage.define(yaml).parser;
                    const tree = yamlParser.parse(matter);

                    tree.iterate({
                        enter: ({ type, from, to }) => {
                            if (type.name === 'Document') return;
                            children.push(cx.elt(type.name, from + 4, to + 4));
                        }
                    });
                    children.push(cx.elt('FrontmatterMark', end - 4, end));
                    cx.addElement(cx.elt('Frontmatter', start, end, children));
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]
};

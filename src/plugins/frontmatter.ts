import { MarkdownConfig } from '@lezer/markdown';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { StreamLanguage } from '@codemirror/stream-parser';
import { styleTags, tags } from '@codemirror/highlight';
import { foldNodeProp } from '@codemirror/language';

const frontMatterFence = /^---\s*$/m;

const yamlNodes = [
    'YAMLatom',
    { name: 'YAMLmeta', block: true },
    'YAMLnumber',
    'YAMLkeyword',
    'YAMLdef',
    'YAMLcomment',
    'YAMLstring',
];

/**
 * Lezer Markdown extension for YAML frontmatter support. This includes support
 * for parsing, syntax highlighting and folding.
 */
export const frontmatter: MarkdownConfig = {
    props: [
        styleTags({
            YAMLnumber: tags.number,
            YAMLkeyword: tags.keyword,
            YAMLdef: tags.definition(tags.labelName),
            YAMLcomment: tags.comment,
            YAMLstring: tags.string,
            YAMLatom: tags.atom,
            YAMLmeta: tags.meta,
        }),
        foldNodeProp.add({
            // node.from has 3 added to it to prevent the hyphen fence
            // from getting folded
            Frontmatter: (node) => ({ from: node.from + 3, to: node.to }),
        }),
    ],
    defineNodes: [{ name: 'Frontmatter', block: true }, ...yamlNodes],
    parseBlock: [
        {
            name: 'Fronmatter',
            before: 'HorizontalRule',
            parse: (cx, line) => {
                let matter = '';
                const yamlParser = StreamLanguage.define(yaml).parser;
                const startPos = cx.lineStart;
                let endPos: number;
                // Only continue when we find the start of the frontmatter
                if (!frontMatterFence.test(line.text)) return false;
                while (cx.nextLine()) {
                    if (frontMatterFence.test(line.text)) {
                        const parsedYaml = yamlParser.parse(matter);
                        const children = [];
                        parsedYaml.iterate({
                            enter: (type, from, to) => {
                                // We don't want the top node, we need the
                                // inner nodes
                                if (type.name === 'Document') return;
                                children.push(
                                    cx.elt(
                                        // The element name is prefixed with
                                        // 'YAML' to prevent future collisions
                                        'YAML' + type.name,
                                        startPos + 4 + from,
                                        startPos + 4 + to
                                    )
                                );
                            },
                        });
                        endPos = cx.lineStart + line.text.length;
                        cx.addElement(
                            cx.elt('Frontmatter', startPos, endPos, children)
                        );
                        return false;
                    } else {
                        matter += line.text + '\n';
                    }
                }
                return true;
            },
        },
    ],
};

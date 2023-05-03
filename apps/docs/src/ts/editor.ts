import { EditorView, basicSetup } from 'codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import ixora, { frontmatter } from '@retronav/ixora';
import type { EditorViewConfig } from '@codemirror/view';
import { customTagStyles } from './theme';

export function editor(
	userConfig: Pick<
		EditorViewConfig,
		'extensions' | 'doc' | 'selection' | 'parent'
	>
) {
	const config: EditorViewConfig = {
		extensions: [
			basicSetup,
			ixora,
			markdown({
				base: markdownLanguage,
				extensions: [frontmatter, { props: [customTagStyles] }],
				codeLanguages: languages,
			}),
			userConfig.extensions ?? [],
		],
		doc: userConfig.doc,
		selection: userConfig.selection,
		parent: userConfig.parent,
	};
	return new EditorView(config);
}

import { syntaxTree } from '@codemirror/language';
import { EditorState, StateField } from '@codemirror/state';
import {
	Decoration,
	DecorationSet,
	EditorView,
	WidgetType
} from '@codemirror/view';
import DOMPurify from 'dompurify';
import { isCursorInRange } from '../util';

interface EmbedBlockData {
	from: number;
	to: number;
	content: string;
}

function extractHTMLBlocks(state: EditorState) {
	const blocks = new Array<EmbedBlockData>();
	syntaxTree(state).iterate({
		enter({ from, to, name }) {
			console.log(name);
			if (name !== 'HTMLBlock') return;
			if (isCursorInRange(state, [from, to])) return;
			const html = state.sliceDoc(from, to);
			const content = DOMPurify.sanitize(html, {
				FORBID_ATTR: ['style']
			});

			blocks.push({
				from,
				to,
				content
			});
		}
	});
	return blocks;
}

function blockToDecoration(blocks: EmbedBlockData[]) {
	return blocks.map((block) =>
		Decoration.widget({
			widget: new HTMLBlockWidget(block),
			block: true,
			side: 1
		}).range(block.to)
	);
}

export const htmlBlock = StateField.define<DecorationSet>({
	create(state) {
		return Decoration.set(blockToDecoration(extractHTMLBlocks(state)));
	},
	update(value, tx) {
		if (tx.docChanged || tx.selection) {
			return Decoration.set(
				blockToDecoration(extractHTMLBlocks(tx.state))
			);
		}
		return value.map(tx.changes);
	},
	provide(field) {
		return EditorView.decorations.from(field);
	}
});

class HTMLBlockWidget extends WidgetType {
	constructor(public data: EmbedBlockData, public isInline?: true) {
		super();
	}
	toDOM(): HTMLElement {
		const dom = document.createElement('div');
		dom.style.display = this.isInline ? 'inline' : 'block';
		// Contain child margins
		dom.style.overflow = 'auto';
		// This is sanitized!
		dom.innerHTML = this.data.content;
		return dom;
	}
	eq(widget: HTMLBlockWidget): boolean {
		return JSON.stringify(widget.data) === JSON.stringify(this.data);
	}
}

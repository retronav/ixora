import { syntaxTree } from '@codemirror/language';
import { EditorState, StateEffect, StateField } from '@codemirror/state';
import {
	Decoration,
	DecorationSet,
	EditorView,
	ViewPlugin,
	WidgetType
} from '@codemirror/view';
import DOMPurify from 'dompurify';
import { isCursorInRange } from '../util';

interface EmbedBlockData {
	from: number;
	to: number;
	content: string;
}

const blockUpdated = StateEffect.define();

function extractHTMLBlocks(state: EditorState) {
	const blocks = new Array<EmbedBlockData>();
	syntaxTree(state).iterate({
		enter({ from, to, name }) {
			if (name !== 'HTMLBlock') return;
			if (isCursorInRange(state, [from, to])) return;
			const html = state.sliceDoc(from, to);
			const content = DOMPurify.sanitize(html);

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
		Decoration.replace({
			widget: new HTMLBlockWidget(block),
			block: true,
			side: 1
		}).range(block.from, block.to)
	);
}

const htmlBlock = StateField.define<DecorationSet>({
	create(state) {
		return Decoration.set(blockToDecoration(extractHTMLBlocks(state)));
	},
	update(value, tx) {
		const blockUpdates = tx.effects.filter((effect) =>
			effect.is(blockUpdated)
		) as StateEffect<EmbedBlockData>[];

		if (tx.docChanged || tx.selection || blockUpdates.length > 0) {
		}
		return value.map(tx.changes);
	}
});

class HTMLBlockWidget extends WidgetType {
	constructor(public data: EmbedBlockData) {
		super();
	}
	toDOM(view: EditorView): HTMLElement {
		const dom = document.createElement('div');
		// This is sanitized!
		dom.innerHTML = this.data.content;
		return dom;
	}
}

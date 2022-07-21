import { syntaxTree } from '@codemirror/language';
import { StateField, EditorState, StateEffect } from '@codemirror/state';
import {
	DecorationSet,
	Decoration,
	WidgetType,
	EditorView
} from '@codemirror/view';
import { image as classes } from '../classes';

/**
 * Representation of the data held by the image URL state field.
 */
export interface ImageURLInfo {
	/**
	 * The source of the image.
	 */
	src: string;
	/**
	 * The starting position of the image element in the document.
	 */
	from: number;
	/**
	 * The end position of the image element in the document.
	 */
	to: number;
	/**
	 * The alt text of the image.
	 */
	alt: string;
}

export const imageURLStateField = StateField.define<DecorationSet>({
	create(state) {
		return extractImages(state);
	},

	update(value, tx) {
		if (tx.docChanged) return extractImages(tx.state);
		return value.map(tx.changes);
	},

	provide(field) {
		return EditorView.decorations.from(field);
	}
});

function extractImages(state: EditorState): DecorationSet {
	const imageUrls: ImageURLInfo[] = [];
	syntaxTree(state).iterate({
		enter: ({ name, node, from, to }) => {
			if (name !== 'Image') return;
			const alt = state
				.sliceDoc(from, to)
				.match(/(?:!\[)(.*?)(?:\])/)
				.pop();
			const urlNode = node.getChild('URL');
			if (urlNode) {
				const url = state.sliceDoc(urlNode.from, urlNode.to);
				imageUrls.push({ src: url, from, to, alt });
			}
		}
	});
	const widgets = imageUrls.map((info) =>
		Decoration.widget({
			block: true,
			widget: new ImagePreviewWidget(info),
			side: 1
		}).range(info.to)
	);

	return Decoration.set(widgets, true);
}

class ImagePreviewWidget extends WidgetType {
	/** Preloaded image */
	private preloaded: HTMLImageElement;

	constructor(public readonly imageInfo: ImageURLInfo) {
		super();
		this.preloaded = preloadImage(this.imageInfo.src);
	}

	get estimatedHeight(): number {
		return this.preloaded.height || -1;
	}

	toDOM(view: EditorView): HTMLElement {
		// Reuse the preloaded image instead of creating another one.
		const img = this.preloaded.cloneNode() as HTMLImageElement;
		img.setAttribute('draggable', 'false');
		img.classList.add(classes.widget);
		img.alt = this.imageInfo.alt;
		// Since this is styled as a block element, setting a height
		// beforehand prevents out of sync editor gutters.
		// FIXME: out of sync gutter still persists if image is not loaded yet
		if (img.height > 0) img.style.height = String(img.height) + 'px';
		img.onload = img.onerror = () => {
			view.requestMeasure();
		};
		return img;
	}

	eq(widget: ImagePreviewWidget): boolean {
		return (
			JSON.stringify(widget.imageInfo) === JSON.stringify(this.imageInfo)
		);
	}
}

function preloadImage(url: string) {
	const img = new Image();
	img.src = url;
	return img;
}

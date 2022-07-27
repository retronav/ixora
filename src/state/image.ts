import { syntaxTree } from '@codemirror/language';
import {
	StateField,
	EditorState,
	StateEffect,
	TransactionSpec
} from '@codemirror/state';
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
export interface ImageInfo {
	/** The source of the image. */
	src: string;
	/** The starting position of the image element in the document. */
	from: number;
	/** The end position of the image element in the document. */
	to: number;
	/** The alt text of the image. */
	alt: string;
	/** If image has already loaded. */
	loaded?: true;
}

/**
 * The current state of the image preview widget.
 * Used to indicate to render a placeholder or the actual image.
 */
export enum WidgetState {
	INITIAL,
	LOADED
}

/**
 * The state effect to dispatch when a image loads, regardless of the result.
 */
export const imageLoadedEffect = StateEffect.define<ImageInfo>();

/** State field to store image preview decorations. */
export const imagePreview = StateField.define<DecorationSet>({
	create(state) {
		const images = extractImages(state);
		const decorations = images.map((img) =>
			// This does not need to be a block widget
			Decoration.widget({
				widget: new ImagePreviewWidget(img, WidgetState.INITIAL),
				info: img,
				src: img.src
			}).range(img.to)
		);
		return Decoration.set(decorations, true);
	},

	update(value, tx) {
		const loadedImages = tx.effects.filter((effect) =>
			effect.is(imageLoadedEffect)
		) as StateEffect<ImageInfo>[];

		if (tx.docChanged || loadedImages.length > 0) {
			const images = extractImages(tx.state);
			const previous = value.iter();
			const previousSpecs = new Array<ImageInfo>();
			while (previous.value !== null) {
				previousSpecs.push(previous.value.spec.info);
				previous.next();
			}
			const decorations = images.map((img) => {
				const hasImageLoaded = Boolean(
					loadedImages.find(
						(effect) => effect.value.src === img.src
					) ||
						previousSpecs.find((spec) => spec.src === img.src)
							?.loaded
				);
				return Decoration.widget({
					widget: new ImagePreviewWidget(
						img,
						hasImageLoaded
							? WidgetState.LOADED
							: WidgetState.INITIAL
					),
					// Create returns a inline widget, return inline image
					// if image is not loaded for consistency.
					block: hasImageLoaded ? true : false,
					src: img.src,
					side: 1,
					// This is important to keep track of loaded images
					info: { ...img, loaded: hasImageLoaded }
				}).range(img.to);
			});
			return Decoration.set(decorations, true);
		} else {
			return value.map(tx.changes);
		}
	},

	provide(field) {
		return EditorView.decorations.from(field);
	}
});

/**
 * Capture everything in square brackets of a markdown image, after
 * the exclamation mark.
 */
const imageTextRE = /(?:!\[)(.*?)(?:\])/;

function extractImages(state: EditorState): ImageInfo[] {
	const imageUrls: ImageInfo[] = [];
	syntaxTree(state).iterate({
		enter: ({ name, node, from, to }) => {
			if (name !== 'Image') return;
			const alt = state.sliceDoc(from, to).match(imageTextRE).pop();
			const urlNode = node.getChild('URL');
			if (urlNode) {
				const url = state.sliceDoc(urlNode.from, urlNode.to);
				imageUrls.push({ src: url, from, to, alt });
			}
		}
	});
	return imageUrls;
}

class ImagePreviewWidget extends WidgetType {
	constructor(
		public readonly info: ImageInfo,
		public readonly state: WidgetState
	) {
		super();
	}

	toDOM(view: EditorView): HTMLElement {
		const img = new Image();
		img.classList.add(classes.widget);
		img.src = this.info.src;
		img.alt = this.info.alt;

		img.addEventListener('load', () => {
			const tx: TransactionSpec = {};
			if (this.state === WidgetState.INITIAL) {
				tx.effects = [
					// Indicate image has loaded by setting the loaded value
					imageLoadedEffect.of({ ...this.info, loaded: true })
				];
			}
			// After this is dispatched, this widget will be updated,
			// and since the image is already loaded, this will not change
			// its height dynamically, hence prevent all sorts of weird
			// mess related to other parts of the editor.
			view.dispatch(tx);
		});

		if (this.state === WidgetState.LOADED) return img;
		// Render placeholder
		else return new Image();
	}

	eq(widget: ImagePreviewWidget): boolean {
		return (
			JSON.stringify(widget.info) === JSON.stringify(this.info) &&
			widget.state === this.state
		);
	}
}

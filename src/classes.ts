/**
 * A single source of truth for all the classes used for decorations in Ixora.
 *  These are kept together here to simplify changing/adding classes later
 * and serve as a reference.
 *
 * Exports under this file don't need to follow any particular naming schema,
 * naming which can give an intuition on what the class is for is preferred.
 */

/** Classes for blockquote decorations. */
export const blockquote = {
		/** Blockquote widget */
		widget: 'cm-blockquote',
		/** Replace decoration for the quote mark */
		mark: 'cm-blockquote-border'
	},
	/** Classes for codeblock decorations. */
	codeblock = {
		/** Codeblock widget */
		widget: 'cm-codeblock',
		/** First line of the codeblock widget */
		widgetBegin: 'cm-codeblock-begin',
		/** Last line of the codeblock widget */
		widgetEnd: 'cm-codeblock-end'
	},
	/** Classes for heading decorations. */
	heading = {
		/** Heading decoration class */
		heading: 'cm-heading',
		/** Heading levels (h1, h2, etc) */
		level: (level: number) => `cm-heading-${level}`,
		/** Heading slug */
		slug: (slug: string) => `cm-heading-slug-${slug}`
	},
	/** Classes for link (URL) widgets. */
	link = {
		/** URL widget */
		widget: 'cm-link'
	},
	/** Classes for list widgets. */
	list = {
		/** List bullet */
		bullet: 'cm-list-bullet',
		/** List task checkbox */
		taskCheckbox: 'cm-task-marker-checkbox',
		/** Task list item with checkbox checked */
		taskChecked: 'cm-task-checked'
	};

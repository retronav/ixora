<script lang="ts">
	import { onMount } from 'svelte';
	let editorEl: HTMLElement;

	export let content: string = '';

	onMount(async () => {
		const { basicSetup, EditorView } = await import('codemirror');
		const { keymap } = await import('@codemirror/view');
		const { markdown, markdownLanguage } = await import(
			'@codemirror/lang-markdown'
		);
		const { languages } = await import('@codemirror/language-data');
		const { default: ixora, frontmatter } = await import('@retronav/ixora');
		const { indentWithTab } = await import('@codemirror/commands');
		const { defaultHighlightStyle, syntaxHighlighting } = await import(
			'@codemirror/language'
		);
		const { highlightStyle, theme, customTagStyles } = await import(
			'../lib/theme'
		);
		editorEl.innerHTML = '';
		const editor = new EditorView({
			extensions: [
				basicSetup,
				ixora,
				EditorView.lineWrapping,
				keymap.of([indentWithTab]),
				markdown({
					codeLanguages: languages,
					base: markdownLanguage,
					extensions: [frontmatter, { props: [customTagStyles] }]
				}),
				syntaxHighlighting(defaultHighlightStyle),
				syntaxHighlighting(highlightStyle),
				theme
			],
			doc: content,
			parent: editorEl
		});
	});
</script>

<div class="editor h-full w-full" bind:this={editorEl}>
	<div class="placeholder w-full h-full flex items-center justify-center">
		Loading editor...
		<noscript>This editor requires JavaScript to run.</noscript>
	</div>
</div>

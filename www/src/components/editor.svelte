<script lang="ts">
	import { onMount } from 'svelte';
	let editorEl: HTMLElement;

	onMount(async () => {
		const { basicSetup, EditorView } = await import('codemirror');
		const { markdown, markdownLanguage } = await import(
			'@codemirror/lang-markdown'
		);
		const { languages } = await import('@codemirror/language-data');
		const { default: ixora, frontmatter } = await import('@retronav/ixora');
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
				markdown({
					codeLanguages: languages,
					base: markdownLanguage,
					extensions: [frontmatter, { props: [customTagStyles] }]
				}),
				syntaxHighlighting(defaultHighlightStyle),
				syntaxHighlighting(highlightStyle),
				theme
			],
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

<script lang="ts">
	import { basicSetup, EditorView } from 'codemirror';
	import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
	import { languages } from '@codemirror/language-data';
	import ixora, { frontmatter } from '@retronav/ixora';
	import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
	import { highlightStyle, theme } from '../lib/theme';
	import { onMount } from 'svelte';
	let editorEl: HTMLElement;

	onMount(() => {
		const editor = new EditorView({
			extensions: [
				basicSetup,
				ixora,
				markdown({
					codeLanguages: languages,
					base: markdownLanguage,
					extensions: [frontmatter]
				}),
				syntaxHighlighting(defaultHighlightStyle),
				syntaxHighlighting(highlightStyle),
				theme
			],
			parent: editorEl
		});
	});
</script>

<div class="editor h-full w-full" bind:this={editorEl} />

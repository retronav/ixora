<script lang="ts">
	import GitHubIcon from 'virtual:icons/simple-icons/github?&width=2em&height=2em';
	import NPMIcon from 'virtual:icons/simple-icons/npm?&width=2em&height=2em';
	import HamburgerIcon from 'virtual:icons/eva/menu-fill?width=2em&height=2em';
	import { onMount } from 'svelte';

	let menuToggle: HTMLButtonElement;
	let menuLinks: HTMLUListElement;

	onMount(() => {
		menuToggle.addEventListener('click', () => {
			if (menuLinks.style.display)
				menuLinks.style.removeProperty('display');
			else menuLinks.style.display = 'flex';
		});
	});
</script>

<nav>
	<section class="h-full flex items-center select-none">
		<img src="/logo.svg" alt="Ixora logo" height="48" width="48" />
		<span class="font-600 text-scarlet">Ixora</span>
	</section>
	<button bind:this={menuToggle}>
		{@html HamburgerIcon}
	</button>
	<ul class="links" bind:this={menuLinks}>
		<li><a href="">Docs</a></li>
		<li title="Link to GitHub repository">
			<a href="https://github.com/retronav/ixora">
				{@html GitHubIcon}
			</a>
		</li>
		<li title="Link to NPM package">
			<a href="https://npm.im/@retronav/ixora">
				{@html NPMIcon}
			</a>
		</li>
	</ul>
</nav>

<style lang="scss">
	nav {
		@apply grid grid-cols-3 <sm:(grid-rows-[1fr,fit-content] grid-cols-2) gap-4 px-4 items-center md:h-[3rem];
		@apply border-solid border-0 border-b-2 border-black;
	}
	button {
		@apply sm:hidden w-fit h-8 justify-self-end bg-transparent border-solid border-black rounded-[3px];
	}
	.links {
		@apply h-full list-none p-0 m-0 flex justify-center items-center gap-4 sm:justify-end <sm:hidden;
		@apply col-start-3 col-end-4 <sm:(col-start-1 row-start-2 col-end-3);
		a {
			@apply text-black;
			&:hover {
				@apply text-scarlet;
			}
		}
	}
</style>

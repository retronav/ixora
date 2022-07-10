import { setEditorContent, setup } from './util.ts';
import { Driver } from 'https://raw.githubusercontent.com/littledivy/webdriver_deno/main/driver.js';

Deno.test({
	name: 'Ixora blockquote plugin',
	async fn() {
		const driver = new Driver('http://localhost:4444');

		console.log(driver)
	},
});

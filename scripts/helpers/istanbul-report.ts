import type { ReportOptions } from 'https://esm.sh/istanbul-reports@3.1.4';
import type { ReportBase } from 'https://esm.sh/istanbul-lib-report@3.0.0';

export type { ReportOptions } from 'https://esm.sh/istanbul-reports@3.1.4';

export async function create<T extends keyof ReportOptions>(
	name: T,
	options?: Partial<ReportOptions[T]>,
): Promise<ReportBase> {
	const reporterModule = await import(
		`https://esm.sh/istanbul-reports@3/lib/${name}.js`
	);
	if (!reporterModule) throw new Error(`Reporter ${name} not found`);
	return new reporterModule.default(options);
}

export default { create };

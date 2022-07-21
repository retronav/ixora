const getReleaseLine = async (changeset, _type) => {
	const summary = changeset.summary
		.split('\n')
		.map((l) => l.trimRight())
		.join('\n');

	const returnVal = changeset.commit
		? `Changeset committed in ${changeset.commit}\n\n${summary.trim()}`
		: summary;

	return returnVal;
};

// Copied as-is from
// https://github.com/changesets/changesets/blob/main/packages/changelog-git/src/index.ts
const getDependencyReleaseLine = async (changesets, dependenciesUpdated) => {
	if (dependenciesUpdated.length === 0) return '';

	const changesetLinks = changesets.map(
		(changeset) =>
			`- Updated dependencies${
				changeset.commit ? ` [${changeset.commit}]` : ''
			}`
	);

	const updatedDepenenciesList = dependenciesUpdated.map(
		(dependency) => `  - ${dependency.name}@${dependency.newVersion}`
	);

	return [...changesetLinks, ...updatedDepenenciesList].join('\n');
};

module.exports = {
	getReleaseLine,
	getDependencyReleaseLine
};

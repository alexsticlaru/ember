import ApplicationSerializer from "./application";

export default class PropositionSerializer extends ApplicationSerializer {

	keyForRelationship(key) {
		if (key === 'themes') {
			return 'themesV7';
		} else {
			return key;
		}
	}

}


import { camelize } from '@ember/string';
import $ from 'jquery';
// import Ember from 'ember';
import DS from 'ember-data';
//import Service, { inject as service } from '@ember/service';
import { pluralize } from 'ember-inflector' ;

const {
    String
} = Ember;

const {
	Store,
} = DS ;

/**
 * Customize the store to enable service-oriented page requests to
 * the back-end.
 *
 * @class StoreService
 * @extends DS.Store
 */
// export default Store.extend({
export default class StoreCiv extends Store {
	/**
	 * Queries the back-end for a page's data.
	 * Pre-loads the store with all page data, performing a single
	 * AJAX request.
	 *
	 * @param {String} page The page name
	 * @param {String} id Unique ID for the page root entity
	 * @param {Any} query An opaque query to be used by the adapter
	 * @returns {Promise} A promise resolving with the page data
	 */
	queryPage(page, id, query) {
		const adapter = this.adapterFor('application');
		const promise = adapter.queryPage(page, id, query);
		const _this = this ;

		return promise.then( function (adapterPayload) {

			// Push sideloaded data to the store
			const entities = $.extend(true, {}, adapterPayload.entities); // clone
			delete adapterPayload.entities;
			_this.pushPayload(adapterPayload); // push sideload

			// Push page data to the store & return models to the user
			const keys = Object.keys(entities);
			const camelize = String.camelize;

			for (let i=0; i<keys.length; i++) {
				const key = keys[i];
				const modelName = entities[key]['type'];
				const typeClass = _this.modelFor(modelName);
				const serializer = _this.serializerFor(modelName);
				let records = entities[key]['records'];
				const rType = Object.prototype.toString.call(records);
				const isSingle = rType === '[object Object]';

				if ( rType === '[object String]' )
					records = [];

				if ( records ) {
					    let rest = {};
					let restKey = isSingle ? camelize(modelName) : camelize(pluralize(modelName));
					rest[restKey] = records;

					const methodType = isSingle ? 'queryRecord' : 'query';
					const id = isSingle ? records.id : 42 /* (not used when methodType='query') */;
					const normalized = serializer.normalizeResponse(_this, typeClass, rest, id, methodType);

					const models = _this.push( normalized );
					entities[key] = models ;
				} else {
					entities[key] = null;
				}
			}

			return entities;
		});
	};

	queryDataPage(page, id, query) {
		const adapter = this.adapterFor('application');
		const promise = adapter.queryPage(page, id, query);
		const _this = this ;

		return promise.then( function (adapterPayload) {
            // Push sideloaded data to the store
            const entities = $.extend(true, {}, adapterPayload.entities); // clone
            delete adapterPayload.entities;
            _this.pushPayload(adapterPayload); // push sideload

            // Push page data to the store & return models to the user
            const keys = Object.keys(entities);

            let isModelPresent = true;

            for (let i = 0; i < keys.length; i++)
			{
				isModelPresent = true;
				if (keys[i][keys[i].length - 1] === 's')
					keys[i] = keys[i].slice(0, -1);
				try {_this.modelFor(keys[i]);}catch(e){isModelPresent = false;}

				if (isModelPresent === true)
				{
					const key = keys[i];
					const modelName = key;
					//entities[key]['type'];
					const typeClass = _this.modelFor(modelName);
					const serializer = _this.serializerFor(modelName);
					let records = entities[key] ? entities[key]['records'] : undefined;
					// !WARNING! <----- THIS LINE DOES NOT WORK AT ALL
					const rType = Object.prototype.toString.call(records);
					const isSingle = rType === '[object Object]';

					if ( rType === '[object String]' )
						records = [];

					if ( records ) {
						let rest = {};
						let restKey = isSingle ? camelize(modelName) : camelize(pluralize(modelName));
						rest[restKey] = records ;

						let methodType = isSingle ? 'queryRecord' : 'query';
						let id = isSingle ? records.id : 42; /* (not used when methodType='query') */
						let normalized = serializer.normalizeResponse(_this, typeClass, rest, id, methodType);

						let models = _this.push( normalized );
						entities[key] = models;
					} else {
						entities[key] = null;
					}
				}
			}
            return entities;
        });
	};

};

import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import RSVP from 'rsvp';
import { on } from '@ember/object/evented';
import DS from 'ember-data';

const {
	Model,
	belongsTo,
	attr,
} = DS ;

export default Model.extend({

	session: service(),

	// Simple attributes

	required: attr('boolean'),
	priority: attr('number'),

	// Relationships

	poll: belongsTo('poll'),
	question: belongsTo('question'),
	
	/**
	 * Answer given by the user in the field.
	 * @property {Answer} answer
	 */
	answer: null,

	/**
	 * Initialize answer property.
	 * @method init
	 */
	initAnswer: on('init', observer('session.currentUser', 'question', function () {
		const current = this.get('answer');
		const type = this.get('question');
		const user = this.get('session.currentUser');

		if (current) {
			current.set('user', user) ;
			current.set('question', type) ;
		} else {
			const blank = this.get('store').createRecord('answer', {
				question: type,
				user: user,
				status: 'active'
			}) ;
			this.set('answer', blank) ;
		}
	})),

	/**
	 * POST answer giver by the user in the field.
	 * @method submit
	 */
	submit: function () {
		return this.get('answer.value') ?
			this.get('answer').save() :
			RSVP.resolve() ;
	},

}) ;

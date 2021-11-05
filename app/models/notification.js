import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import DS from 'ember-data' ;

const {
	Model,
	belongsTo,
	attr,
} = DS ;

export default Model.extend({
	intl: service(),

	/**
	 * Initialize services needed for observers.
	 * @method initServices
	 */
	initServices: on('init', function () {
		this.get('intl') ;
	}),

	// Model attrs
	category: attr('string'),
	type: attr('string'),
	title: attr('string'),
	url: attr('string'),
	entityId: attr('number'),
	entityType: attr('string'),

	date: attr('date'),
	seenCount: attr('number'),
	clickCount: attr('number'),
	clicked: computed('clickCount', 'status', function () {
		return (this.get('clickCount') > 0 || this.get('status') == 'markedClick' );
	}),
	clickedClass: computed('clickCount', 'status', function () {
		if (this.get('clickCount') > 0 || this.get('status') == 'markedClick') {
			return 'notification-clicked';
		} else {
			return 'notification-unclicked';
		}
	}),

	notificationData: attr(),
	status: attr('string'),

	// Foreign attrs
	user: belongsTo('user'),

	// Attrs with computed properties

	image: attr('string'),
	computedImage: computed('image', function () {
		if (this.get('image') && this.get('image') != "") {
			return this.get('image') ;
		}
		return "not-found_qifo3a";
	}),

	richTitle: computed('title', 'notificationData', function () { // This should be done by the back-end directly
		let title = this.get('title');

		const notificationData = this.get('notificationData');
		if (notificationData != undefined) {
			const highlights = Object.keys(notificationData);

			for (let i = 0; i < highlights.length; ++i) {
				const highlight = highlights[i];
				const result = notificationData[highlight];

				// Template version : {{example}} => <b>This is the result</b>
				title = title.replace(highlight, `<b>${result}</b>`);

				// Comparison version : This is the result => <b>This is the result</b>
				title = title.replace(result, `<b>${result}</b>`);
			}
		}

		return title;
	}),

	displayDate: computed('date', 'intl.locale', function () {
		return moment(this.get('date')).fromNow() ;
	}),

	displayDateAsDate: computed('date', 'intl.locale', function () {
		return moment(this.get('date')).format('YYYY-MM') ;
	}),

	// Don't send content tracking
	// request twice.
	viewed: false,


	routeInfos:  computed('entityType', 'entityId', 'notificationData', 'type', function () {
		let routeInfos = {"routeName": "/", 'argument1': null};
		routeInfos['routeName'] = this.get('entityType');
		routeInfos['argument1'] = this.get('entityId');
		routeInfos['includeContent'] = '';

		// For special cases
		switch (this.get('entityType')) {
			case 'issue':
				// if this is an issue_outcome notification, use the issue.act route, the outcome is displayed only there
				if (this.get('type')=='issue_citizen_outcome' || this.get('type')=='issue_official_outcome') {
					routeInfos['routeName'] = 'issue.act';
				}
				break;
			case 'comment':
			routeInfos['routeName'] = 'issue.act';
			routeInfos['argument1'] = this.get('notificationData')['{{issueId}}'];
			routeInfos['includeContent'] = this.get('entityId');
			break;
			case 'commentreport':
			routeInfos['routeName'] = 'issue.act';
			routeInfos['argument1'] = this.get('notificationData')['{{issueId}}'];
			routeInfos['includeContent'] = this.get('notificationData')['{{commentId}}'];
			break;
			case 'communityupdate':
				routeInfos['routeName'] = 'community.updates';
				routeInfos['argument1'] = this.get('notificationData')['{{communityURL}}'];
				routeInfos['includeContent'] = this.get('entityId');
				break;
			case 'issuefollowing':
				routeInfos['routeName'] = 'issue.learn';
				routeInfos['argument1'] = this.get('notificationData')['{{issueId}}'];
				break;
			case 'issuestakeholding':
				routeInfos['routeName'] = 'issue.learn';
				routeInfos['argument1'] = this.get('notificationData')['{{issueId}}'];
				break;
			case 'issueupdate':
				routeInfos['routeName'] = 'issue.learn';
				routeInfos['argument1'] = this.get('notificationData')['{{issueId}}'];
				routeInfos['includeContent'] = this.get('entityId');
				break;
			case 'event':
				routeInfos['routeName'] = 'community.events';
				routeInfos['argument1'] = this.get('notificationData')['{{communityURL}}'];
				routeInfos['includeContent'] = this.get('entityId');
				break;
			case 'pollnew':
				routeInfos['routeName'] = 'poll';
				routeInfos['argument1'] = this.get('notificationData')['{{entityId}}'];
				break;
			case 'proposition':
				routeInfos['routeName'] = 'community.proposition';
				routeInfos['argument1'] = this.get('notificationData')['{{communityURL}}'];
				break;
			case 'user':
				routeInfos['routeName'] = 'user';
				routeInfos['argument2'] = this.get('notificationData')['{{username}}'];
				break;
		}

		return routeInfos;
	}),
}) ;

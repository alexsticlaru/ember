import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { on } from '@ember/object/evented';
import DS from 'ember-data' ;
import truncate from 'civ/utils/string-truncate' ;

const {
	Model,
	belongsTo,
	hasMany,
	attr,
} = DS ;

export default Model.extend( {

	intl: service(),

	/**
	 * Initialize services needed for observers.
	 * @method initServices
	 */
	initServices: on('init', function () {
		this.get('intl') ;
	}),

	// Model attrs

	badges: attr(),
	code: attr('string'),
	communityInvited: attr(),
	globalRelevancy: attr('number', { defaultValue: 0 }),
	initiatorImage: attr('string'),
	initiatorSummary: attr('string'),
	introMessage: attr('string'),
	locale: attr('string'),
	localeOriginal: '', // when translated
	official: attr(),
	outcome:  attr('string'),
	reviewStatus: attr(),
	progress: attr('number', { defaultValue: 0 }),
	progressPercent:  computed('progress', function () {
		return this.get('progress')*100;
	}),
	stats: attr(),
	status: attr('string'),//'active'|'private'|'deleted'
	moderatedCommentsCount: attr('number', { defaultValue: 0 }),
	translated: false,
	thanksMessage: attr(),
	typeformId: attr('string'),

	outcomeVisible: attr(),

	haveIssueQuestionnaire: belongsTo('quest-form', {
		inverse: 'isIssueQuestionnaire',
		async: false
	}),

	// Foreign attrs

	community: belongsTo('community', { async: false }),
	user: belongsTo('user'),
	links: hasMany('link'),
	stakeholdings: hasMany('issue-stakeholding'),
	//profiles are the substitute for the previous issue stakeholding and issue profile stakeholding
	profiles: hasMany('issue-profile-stakeholding'),
	comments: hasMany('comment'),
	actions: hasMany('action'),
	updates: hasMany('issue-update'),
	propositions: hasMany('proposition'),
	associations: hasMany('issue-association'),
    themes: hasMany('theme'),

	// Attrs with computed properties

	initiatorName: attr('string'),
	truncatedInitiatorName: computed('initiatorName', function () {
		return truncate.apply( this.get('initiatorName'), [25, true] ) ;
	}),
	videoString: attr('string'),
	about: attr('string'),
	summary: attr('string'),
	summaryOriginal: '', // when translated
	summaryDisplay: computed('summary', 'intl.locale', function(){
		return this.get('summary') ?
			this.get('summary') :
			this.get('intl').t('issue-edit.defaults.summary') ;
	}),
	shortSummary: computed('summaryDisplay', function () {
		const summary = this.get('summaryDisplay') ;
		if ( summary == null ) {
			return '';
		} else if (summary.length > 300) {
			return (summary.substr(0, 300) + '...');
		} else {
			return summary;
		}
	}),

	isCompleted:  computed('progress', function () {
		return this.get('progress') === 1;
	}),

	readPercentage: computed('badges.commmentReadCount', 'badges.commentsNumber', function () {
		const commentReadCount = this.get("badges.commentReadCount");
		const commentsNumber = this.get("badges.commentsNumber");

		return commentsNumber ? Math.round(commentReadCount / commentsNumber * 100) : 0;
	}),

	date: attr('date'),
	displayDate: computed('date', 'intl.locale', function () {
		return moment( this.get('date') ).fromNow() ;
	}),

	dateBegin: attr('date'),
	dateBeginArray: computed('dateBegin', function () {
		return [this.get('dateBegin')];
	}),
	displayDateBegin: computed('dateBegin', 'intl.locale', function () {
		return moment( this.get('dateBegin') ).fromNow() ;
	}),
	calendarDateBegin: computed('dateBegin', 'intl.locale', function () {
		return moment( this.get('dateBegin') ).format("MMM Do") ;
	}),
	calendarDateBeginWithHour: computed('dateBegin', 'intl.locale', function () {
		return moment( this.get('dateBegin') ).format("MMM Do, h:mm a") ;
	}),

	dateEnd: attr('date'),
	dateEndArray: computed('dateEnd', function () {
		return [this.get('dateEnd')];
	}),
	displayDateEnd: computed('dateEnd', 'intl.locale', function () {
		return moment( this.get('dateEnd') ).fromNow() ;
	}),
	calendarDateEnd: computed('dateEnd', 'intl.locale', function () {
		return moment( this.get('dateEnd') ).format("MMM Do") ;
	}),
	calendarDateEndWithHour: computed('dateEnd', 'intl.locale', function () {
		return moment( this.get('dateEnd') ).format("MMM Do, h:mm a") ;
	}),

	durationInSeconds: computed('dateBegin', 'dateEnd', function () {
		return moment(this.get('dateEnd')).unix() - moment(this.get('dateBegin')).unix();
	}),

	running: computed('dateBegin', 'dateEnd', function () {
		const begin = moment(this.get('dateBegin'));
		const end = moment(this.get('dateEnd'));
		const now = moment();

		return now.isBetween(begin, end) ;
	}),

	publicationStatus: computed('dateBegin', 'dateEnd', function () {
		const issueDateBegin = this.get('dateBegin');
		const issueDateEnd = this.get('dateEnd');
		const now = new Date();

		if (issueDateBegin) {
			if (issueDateBegin > now) {
				return 'pending';
			} else {
				if (!issueDateEnd || issueDateEnd > now) {
					return 'open';
				} else {
					return 'closed';
				}
			}
		} else {
			return 'unpublished';
		}
	}),

	publicationStatusDisplay: computed('publicationStatus', 'displayDate', 'intl.locale', function () {
		const publicationStatus = this.get('publicationStatus');
		const intl = this.get('intl');
/*
		const nth = function(d) {
			if (d > 3 && d < 21) return 'th';
			switch (d % 10) {
				case 1:  return "st";
				case 2:  return "nd";
				case 3:  return "rd";
				default: return "th";
			}
		}
		const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][this.get('dateBegin').getMonth()];
		const date = this.get('dateBegin').getDate()
		switch (publicationStatus) {
			case 'open':
				return this.get('dateEnd') ?
						`Started ${month} ${date}${nth(date)} ${this.get('dateBegin').getFullYear()}, ` + intl.t('issue.status.open') + ' ' + this.get('displayDateEnd')
					:
						intl.t('issue.status.openNoEnd') + ' ' + this.get('displayDateBegin');
			case 'closed':
				return intl.t('issue.status.closed') + ' ' + this.get('displayDateEnd');
			case 'pending':
				return intl.t('issue.status.pending') + ' ' + this.get('displayDateBegin');
			default:
				return intl.t('issue.status.unpublished');
		}
*/
		/*
		"status": {
			"closed": "Completed",
			"closingIn": "Closing in",
			"openNoEnd": "Opened",
			"pending": "Opening in",
			"privacyLabel": "Visibility:",
			"private": "Private",
			"public": "Public",
			"statusLabel": "Status:",
			"unpublished": "In creation"
		},
		*/
		switch (publicationStatus) {
			case 'open':
				const db = moment( this.get('dateBegin') ).format("LL");
				return this.get('dateEnd') ?
							/*eg:Started Oct 27th 2020, closing in 10 days*/
							intl.t('issue.status.started')+ ' '
							+ db + ', '
							+ intl.t('issue.status.closingIn') + ' '
							+ this.get('displayDateEnd')
						:
							/*eg:Opened since 35 days*/
							intl.t('issue.status.openNoEnd') + ' '
							+ this.get('displayDateBegin');
			case 'closed':/*eg:Completed since 71 days*/
				return intl.t('issue.status.closed') + ' ' + this.get('displayDateEnd');
			case 'pending':/*eg:Opening in 12 days*/
				return intl.t('issue.status.pending') + ' ' + this.get('displayDateBegin');
			default:/*eg:In creation*/
				return intl.t('issue.status.unpublished');
		}
	}),

	usersCanParticipate: computed('dateEnd', 'dateBegin', function () {
		if (this.get('dateBegin') < new Date() && this.get('dateEnd') > new Date()) {
			return true;
		} else {
			return false;
		}
	}),

	description: attr('string'),
	descriptionOriginal: '', // when translated
	descriptionDisplay: computed('description', 'intl.locale', function () {
		return this.get('description') ?
			this.get('description') :
			this.get('intl').t('issue-edit.defaults.description') ;
	}),

	image: attr('string'),
	computedImage: computed('image', function () {
		return isEmpty( this.get('image') ) ?
			"static/issue-default" :
			this.get('image');
	}),

	//TODO use container media query
	imageUrl: computed('image', function () {
			const id = this.get('computedImage');
			const width = this.get('device.isLargeScreen') ? "2000" : "1366" ;
			const height = this.get('device.isLargeScreen') ? "395" : "270" ;
			return this.get('cloudinary').getURL(id, {
				height: height,
				width: width,
				transforms: "c_lfill,q_auto,f_auto",
				format: "jpeg"
			});
		}
	),

	assertionsBottomUpLevel: attr('string', { defaultValue: 'noBottomUp' }),

	orderBy: attr('string', { defaultValue: 'new' }),

	tag: attr('string'),
	tagOriginal: '', // when translated
	tagDisplay: computed('tag', 'intl.locale', function () {
		return this.get('tag') ?
			this.get('tag') :
			this.get('intl').t('issue-edit.defaults.tag') ;
	}),

	title: attr('string'),
	titleOriginal: '', // when translated
	titleDisplay: computed('title', 'intl.locale', function () {
		return this.get('title') ?
			this.get('title') :
			this.get('intl').t('issue-edit.defaults.title') ;
	}),
	URLTitle: computed('title', function () {
		// See http://bit.ly/1Iecpmw and http://bit.ly/1OmcQji
		// -> URI encoding methods & best practices.
		// Note: I don't get why encodeURIComponent doesn't encode '%'.
		return encodeURIComponent(
			this.get('title')
				.replace(/%/g, '%25')
				.replace(/ /g, '_')
			);
	}),

	notes: attr('string'),

	initiatorStakeholding: computed('stakeholdings', 'user', function () {
		const stakeholdings = this.get('stakeholdings');
		const user = this.get('user');
		let initiator = null ;
		stakeholdings.forEach( function (stakeholding) {
			if ( stakeholding.get('user.id') === user.get('id') ) {
				initiator = stakeholding ;
			}
		}) ;
		return initiator ;
	}),

	// Custom adapter calls

	addFollowers: function () {
		const adapter = this.store.adapterFor(this.constructor.modelName);
		const _this = this ;
		return adapter.addFollowers(this).then( function () {
			_this.set('communityInvited', true) ;
		}) ;
	},
	askReview: function () {
		const adapter = this.store.adapterFor(this.constructor.modelName);
		const _this = this ;
		return adapter.askReview(this).then( function () {
			_this.set('reviewStatus', 'pending') ;
		}) ;
	},
	review: function () {
		const adapter = this.store.adapterFor(this.constructor.modelName);
		const _this = this ;
		return adapter.review(this).then( function () {
			_this.set('reviewStatus', 'reviewed');
		}) ;
	},
	open: function () {
		const adapter = this.store.adapterFor(this.constructor.modelName);
		const _this = this ;
		return adapter.open(this).then( function () {
			return _this.reload() ;
		}) ;
	},
	close: function () {
		const elapsed = moment().subtract(1, 'day').toDate() ;
		this.set('dateEnd', elapsed) ;
		return this.save() ;
	},
	sendOutcome: function () {
		const adapter = this.store.adapterFor(this.constructor.modelName);
		return adapter.sendOutcome(this) ;
	},
	createPoll: function () {
		const adapter = this.store.adapterFor(this.constructor.modelName);
		return adapter.createPoll(this) ;
	},
	selected: attr('boolean'),
	participationPack: belongsTo('participation-pack', {
		inverse: 'issue'
	}),
}) ;

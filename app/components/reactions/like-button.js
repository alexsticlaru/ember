import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import {action} from '@ember/object';
import {later, cancel} from '@ember/runloop';


export default class LikeButtonComponent extends Component {
	@service intl;
	@service store;
	@service user;
	@service reactions;
	@service toast;
	@service('popup') popupService;
	
    
    

	

	@action
	prevent(e) {
		return e.stopImmediatePropagation();
	}

	@action
	open(dropdown) {
		if (this.closeTimer) {
			cancel(this.closeTimer);
			this.closeTimer = null;
		} else {
			dropdown.actions.open();
		}
	}

	@action
	closeLater(dropdown) {
		this.closeTimer = later(() => {
			this.closeTimer = null;
			dropdown.actions.close();
		}, 200);
	}

	@action
	addReaction(type) {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}
       if(this.user.isAuthenticated && !this.user.getCurrentUser().emailConfirmed)
		{
			this.user.showActivationEmailPopup();
			return;
		}
		
		   

		// set default reaction
		if (!type && !this.args.content.userReactionType) {
			type = 'agree';
		}

		const modelName = this.reactions.getReactionModelName(this.args.content);

		// no default reaction, this means we delete existing reaction
		if (type == '') {
			this.store.queryRecord(modelName, {
				"filters[content]": this.args.content.id,
				"filters[user]": this.user.getCurrentUser().id
			}).then( (reaction) => {
				reaction.destroyRecord().then( () => {
					// reload parent content, to get updated Reaction counters
					this.args.content.reload();
				})
				this.args.content.userReactionType = '';
			} )
			return;
		}

		const reaction = this.store.createRecord(modelName, {
			content: this.args.content,
			type: type,
			user: this.user.getCurrentUser()
		});
		reaction.save().then(() => {
			this.args.content.userReactionType = type;
		});
	}

	get userReactionType() {
		if (this.args.content.userReactionType) {
			return this.intl.t('reactions.type.' + this.args.content.userReactionType);
		} else {
			return null;
		}
	}

	get userReaction() {
		if (this.args.content.userReactionType) {
			return this.reactions.getByType(this.args.content.userReactionType)
		} else {
			return null;
		}
	}

	get reactionTypes() {
		return this.reactions.reactionTypes;
	}
}

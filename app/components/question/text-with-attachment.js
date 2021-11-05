import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class TextWithAttachment extends Component {
	@service store;
	@service cloudinary;

	@tracked textAnswered;
	@tracked attachment;
	startQuestion = new Date();
    enteredAnswer;

	@action
	setup() {
		const foundResponse = this.args.savedAnswers.find((questRecord) => questRecord.question.id === this.args.question.id);
        this.textAnswered = foundResponse ? foundResponse.answerText : '';
		this.attachment = foundResponse ? foundResponse.attachment : null;
		this.enteredAnswer = this.setupTextRecord(foundResponse);
	}

	setupTextRecord(foundResponse) {
		if(foundResponse) {
			const record = this.store.peekRecord('quest-record', foundResponse.id);
			record.startQuestion = this.startQuestion;
			return record;
		} else {
			return this.store.createRecord('quest-record', {
				question: this.args.question,
				startQuestion: this.startQuestion,
				openAnswer: true,
				answerText: '',
				attachment: null,
				anonymousUser: this.args.anonymousUser
			});
		}
	}

	@action
	async handleAnswer() {
        if(isEmpty(this.textAnswered)) {
            this.args.onRemoveAnswer(`${this.args.question.id}-openAnswer`, this.enteredAnswer.id);
        } else {
			this.enteredAnswer.id = this.enteredAnswer.id ? this.enteredAnswer.id : `${this.args.question.id}-openAnswer`;
			this.enteredAnswer.answerText = this.textAnswered;
			this.enteredAnswer.attachmentToSave = this.attachment;
            this.args.onUpdateAnswer(this.enteredAnswer);
        }
    }

	@action
	addPicture() {
		const filePicker = document.getElementById("picture-upload");
		const attachment = this.store.createRecord('quest-record-attachment', {
			type: "picture"
		});

		attachment.name = filePicker.files[0].name;
		this.cloudinary.uploadImage("issue", filePicker.files[0]).then((response) => {
			const imgURL = "https://res.cloudinary.com/civocracy/image/upload/v1612456390/" + response.toString();
			attachment.cloudinaryID = response.toString();
			attachment.url = imgURL;
			attachment.image = imgURL;
		});
		this.attachment = attachment;
		if(!isEmpty(this.textAnswered)) {
			this.enteredAnswer.attachmentToSave = attachment;
		}
	}

	@action
	addFile() {
		const filePicker = document.getElementById("file-upload");
		const attachment = this.store.createRecord('quest-record-attachment', {
			type: "file",
		});

		attachment.name = filePicker.files[0].name;
		this.cloudinary.uploadFile("issue", filePicker.files[0]).then((response) => {
			const attachmentURL = "http://res.cloudinary.com/civocracy/raw/upload/v1612877100/" + response.toString();
			attachment.cloudinaryID = response.toString();
			attachment.url = attachmentURL;
		});
		this.attachment = attachment;
		if(!isEmpty(this.textAnswered)) {
			this.enteredAnswer.attachmentToSave = attachment;
		}
	}

	@action
	removeAttachment() {
		this.attachment.destroyRecord();
		if (this.attachment.cloudinaryID) {
			this.cloudinary.deleteRecentUpload(this.attachment.cloudinaryID);
		}
		this.attachment = null;
	}

}

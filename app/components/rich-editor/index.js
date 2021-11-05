import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RichEditor extends  Component {
	editorImageSource = '';
	editorFullFileUrl = '';
	editorUploadedFileName = '';
	allowTextIndent = false;
	hasVideo = true;
	editor = "jodit";
	displayEditor = true;
	cloudinary_timestamp = null;
	cloudinary_api_key = null;
	cloudinary_signature = null;
	cloudinary_folder = null;
	pluginsEnabled = [
		'align', 'colors', 'draggable', 'emoticons', 'file',
		'image', 'image_manager', 'link', 'lists', 'paragraph_format',
		'quick_insert', 'table', 'url', 'quote'
	];
	@tracked content = ''
	// intl:       inject.service(),
	// cloudinary: inject.service(),
	// cloudinaryS: inject.service('cloudinaryService'),//this may replace the ember-cli-cloudinary-images plugin (cloudinary here) at some point...
	// dbgS: inject.service('debug'),
	// imageUploadURL: 'https://api.cloudinary.com/v1_1/civocracy/image/upload',
	// language: computed.alias('intl.locale'),
	@action
	editorBlur(){
// 		console.log('BLUR!')
		// this.sendAction('onBlur') ;
	}

	@action
	refreshCloudinaryAuth(){
// 		console.log('refreshCloudinaryAuth')
		// const _this = this;
		// this.cloudinarySetAuth( this.get('cloudinaryS').getUploadArray( _this, this.get('editor')+'-editor' ) );
	}

}


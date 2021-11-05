import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

/** NOTE
 * A part of the component's code is related to handle well the blur event.
 * Jodit is firing a native blur event that we set the handler in Jodit init/create config code but this is unperfect for our needs as it is really a listener on the editor part of Jodit (disregarding the other parts : toolbars, icons and popup).
 *
 * Then the component is working around this by delaying the initial event fired and canceling it if a click event is fired quickly after the blur one.
 *
 */

export default class JoditRicheditor extends  Component {
	@service('debug') dbgS;
	@service('popup') popupService;

	// intl: inject.service(),
	// device: inject.service(),
	// cloudinaryService: inject.service('cloudinary-service'),

	/*Component parameters ::::*/
	editorId = "joditEditor";//the id for the initial textarea
	editor = null;
	content = "wwwwwww";
	tabIndex = null;//defaults to 0
	placeholderText = null;
	defaultInitialHeight = 300;
	hasVideo = true;
	isVideoToolbar = false;
	noToolbarMode = false;//removes all toolbars (no icons)

	imageUploadParamsTimestamp = null;
	imageUploadParamsApiKey = null;
	imageUploadParamsSignature = null;
	imageUploadParamsFolder = null;
	/*:::: Component parameters*/

	// language: computed.alias('intl.locale'),

	@tracked hasFocus = false;
	contentSave = null;


	// _languageO: observer('language', function(){
	// 	this.set('editor.language', this.get('language'));
	// 	//not working right now : we have to rerender (possible for the component only ?)
	// }),

	// contentObserver: observer('content', function(){
	// 	this.get('editor').setEditorValue( this.get('content') );
	// }),

// 	hasFocusObserv: observer('hasFocus', function(){
// // this.get('dbgS').notify( "hasFocusObserv:"+this.get('hasFocus') );
// 		if(this.get('hasFocus')){
// 			clearTimeout(this._blurTimeout);
// 			this._blurTimeout = null;
// 		}else
// 			this.fireBlurEvent();
// 	}),

	visibilityClass = null;
	// displayedObserver: observer('visibilityClass', function(){
	// 	//this.get('dbgS').notify( "displayedObserver:"+this.get('visibilityClass')+" - "+this.get('isOpen') );
	// 	const _this = this;
	// 	if( this.get('visibilityClass') == "show-popup" ){
	// 		//This is only for popup (comment popup in add-comment-popup)
	// 		let content = this.get('content');
	// 		if( !content || !content.trim() )
	// 			this.get('editor').setEditorValue( this.get('content') );
	// 		this.dynamicResize();
	// 		window.addEventListener('resize', ()=> {_this.dynamicResize();});
	// 	}else
	// 		window.removeEventListener('resize', ()=> {_this.dynamicResize();});
	// }),

	@tracked hasBeenDestroyed = false;
	_jdChanged_tout = null;

	didDestroyElement(){
		clearTimeout(this._jdChanged_tout);
		this._jdChanged_tout = null;
		//As rich-editor component is hacking to force the editor to re-render entirely when the platform language is changed by the user and we are using a timer (setTimeout) in case of blur event to save content, here we put this hasBeenDestroyed flag to true to avoid setTimeout to do his job when the editor is refreshing or has been destroyed
		this.set('hasBeenDestroyed', true);
		this.hasBeenDestroyed = true;
		this._super(...arguments);
	};

/*
 	init() {
 		this._super(...arguments);
		if( this.get('visibilityClass') ){
			const _this = this;
			window.addEventListener('resize', ()=> {_this.dynamicResize();});
		}
 	},
*/

// 	dynamicResize: function(){
// 		//This is only for popup (comment popup in add-comment-popup)
// 		let H = (this.get('device.height') * 0.8 ) - ( $('.comment-add-form').outerHeight() - $('.comment-add-form').height() ) - $('.modal-header').outerHeight() - $('.comment-add-form__top-section').outerHeight() - $('.comment-add-form__bottom-section').outerHeight() - $('.modal-footer-close').outerHeight() - $('.jodit-toolbar__box').outerHeight();
// // 		this.get('dbgS').notify("REDIM-B : h:"+this.get('device.height')+" -\n"+$('.modal-header').outerHeight()+" -\n"+$('.comment-add-form__top-section').outerHeight()+" -\n"+$('.comment-add-form__bottom-section').outerHeight()+" -\n"+$('.modal-footer-close').outerHeight()+" -\n"+$('.jodit-toolbar__box').outerHeight()+"\n=>"+H+" / "+(H > 100) );
// 		if(H > 90)//virtual min-height
// 			$('.jodit-workplace').height(H + 'px');
// 		else $('.jodit-workplace').height('90px');
// 	},

/*
	refreshCloudinaryCredential(){
		this.cloudinarySetAuth( this.get('cloudinaryS').getUploadArray( _this, this.get('editor')+'-editor' ) );
	}
*/
	_clickedOnFileUpload = false;
	_clickedOnImageUpload = false;
	_isImageUpload = false;
	_isVideoUpload = false;
	_isFileUpload = true;

	didInsertElement(){
		const _this = this ;
		//Adds the Emoji module to Jodit (the implementation is done in initJodit) :

/*
		Jodit.modules.Emojis = function (editor) {
/*
			this.insertEmojisImage = function (w, h, textcolor, bgcolor) {
        var image = Jodit.modules.Dom.create('img', '', editor.ownerDocument);
        image.setAttribute('src', 'http://dummyimage.com/' + w + 'x' + h + '/' + (textcolor || '000') + '/' + (bgcolor || 'fff'));
        editor.selection.insertNode(image);
        editor.setEditorValue(); // for syncronize value between source textarea and editor
				editor.selection.insertNode(image);
			};
* /
		};
*/
		Ember.run.schedule('afterRender', function () {
			if( !$("#"+_this.get('editorId')).length ){
				setTimeout( function(){_this.initJodit()}, 500 );
			}else _this.initJodit();
		});

	}

	initJodit(){
			const _this = this ;
			let emojiToobarIcon = {
				//iconURL: '',
				//name: '&#128578;',
				name: '😃',
				tooltip: 'Emojis',
			   /*
				exec: function (editor) {
					editor.Emojis.insertEmojisImage(100, 100, 'f00', '000');
				}*/
			   //https://xdsoft.net/jodit/v.2/doc/Jodit.defaultOptions.html
				popup: function (editor, current, control, close) {
					_this.set('hasFocus', true);
					return editor.civInsertEmojis.buildPopup(_this, editor, current, control, close);
				}
			};
			let buttons = [], disabled = false, readOnly = false, showToolbar = true;
			if( _this.get('noToolbarMode') ){
				buttons = [ ];
				showToolbar = false;
			}else if( _this.get('isVideoToolbar') ){
				buttons = [ 'video' ];
// 				readOnly = true;
 				disabled = true;
			}else if(!_this.get('hasVideo')){
				buttons = [ /*text pre-formated styles : 'paragraph',*/ 'fontsize', '|', 'bold', 'strikethrough', 'underline', 'italic', /*'font', */'|', 'align', '|', 'ul', 'ol', '\n',  emojiToobarIcon, 'image', 'file', 'link', '|', 'undo', 'redo'/*, '|', 'hr', 'symbol'*/];
			}else{
				buttons = [ /*text pre-formated styles : 'paragraph',*/ 'fontsize', '|', 'bold', 'strikethrough', 'underline', 'italic', /*'font', */'|', 'align', '|', 'ul', 'ol', '\n',  emojiToobarIcon, 'image', 'file', 'video', 'link', '|', 'undo', 'redo'/*, '|', 'hr', 'symbol'*/];
			}

//cloudinary Crop test :
// https://res.cloudinary.com/civocracy/image/upload/c_crop,g_north_west,h_155,w_241,x_145,y_105/v1602927115/local/jodit-editor/iux4aav3ceipmgkwpf9g.png

			/*EDITOR INIT :*/
			let tabIndex = 0;
			if( _this.get("tabIndex") || _this.get("tabIndex") < 0 )
				tabIndex = _this.get("tabIndex");
			let placeholder = "";
			if( _this.get("placeholderText") )
				placeholder = _this.get("placeholderText").toString();
			if( !_this.get('initialHeight') )
				_this.set('initialHeight', _this.get('defaultInitialHeight'));
			if( !_this.get('minHeight') )
				_this.set('minHeight', _this.get('initialHeight'));
			_this.set('editor', new Jodit( /*'#joditEditor'*/ "#"+_this.get('editorId') , {
				//https://xdsoft.net/jodit/examples/module/how-create-module.html
				tabIndex: tabIndex,
				allowTabNavigation: true,
				disabled: disabled,
				readOnly: readOnly,
				showPlaceholder: true,
				placeholder: placeholder,
				events: {
					afterInit: function (editor) {
						editor.civInsertEmojis = new Jodit.modules.civInsertEmojis(editor);
						editor.FileSelectorWidget = null;
					},
					blur: function (editor) {
						_this.set('hasFocus', false);//this has only effect after a timeout and may be canceled before it.
					}
				},
				//https://xdsoft.net/jodit/doc/
				height: _this.get('initialHeight'),
				minHeight: _this.get('minHeight'),
				// language:_this.get('language'),

// 				image: {useImageEditor: false}, //- set to false for no "crop" option on the image popup
				image: {
					useCloudinaryImageEditor: true,
 					editSrc: false,
					editClass: false,
					editStyle: false,
					editId: false,
				},
				// filebrowser: {
				// 	cloudinaryimageeditor: {
				// 		cloudinaryImageEditorOnCloseConfirmSaveMessage:  this.get('intl').t(`joditRichEditor.editImageDimensions.confirmSaveBeforeClosingMessage`),//'Do you want to save your new image dimensions before closing ?',
				// 	},
				// },
				resizer: {
					useCloudinary: true,
				},
				allowResizeX: _this.get('allowResizeX') !== undefined ? _this.get('allowResizeX') : true,
				allowResizeY: _this.get('allowResizeY') !== undefined ? _this.get('allowResizeY') : true,
/*
image: {useImageEditor: Jodit.modules.civImageEditor},
useImageEditor: Jodit.modules.civImageEditor,
*/
// filebrowser: false,

// 				"buttons": ",,,,,,|align,ul,ol,|,font,paragraph,|,image,file,video,link,|,undo,redo,\n,|,hr,symbol",
				buttons: buttons,
				buttonsMD: buttons,
				buttonsSM: buttons,
				buttonsXS: buttons,
				toolbar: showToolbar,
				//https://xdsoft.net/jodit/v.2/doc/tutorial-uploader-settings.html
				/*Bottom toolbar (statusbar) ::*/
				showCharsCounter: false,
				showWordsCounter: false,
				showXPathInStatusbar: false,
				/*:: Bottom toolbar (statusbar)*/
				enableDragAndDropFileToEditor: true,
				link: {//By default the Add Link icon shows 2 checkboxes we don't want here + when getting the content of Jodit editor we ensure to have links with target="_new"
					noFollowCheckbox: false,
					openInNewTabCheckbox: false
				},
				uploader: {
					url: 'https://api.cloudinary.com/v1_1/civocracy/image/upload',
					format: 'json',
 					pathVariableName: 'path',
					isFileUpload: false,
					isImageUpload: false,
// 					pathVariableName: 'folder',
					//filesVariableName: 'file',
					filesVariableName: function(){
						return `file`;
					},
					prepareData: function (data) {
_this.get('dbgS').notify('Jodit is uploading! prepareData(', data,') : ', data.forEach(function(item, index){return index+'='+item;}), "\ndata.get('file').type="+data.get('file').type );
						_this.sendAction('refreshCloudinaryAuth');
						_this.set('hasFocus', true);
						let type = data.get('file').type;
						let file = data.get('file').name;
						let filename = file.substr( file.lastIndexOf('/') +1 ),
							ext = filename;
						if( filename.lastIndexOf('.') > -1 )
							ext = filename.substr( filename.lastIndexOf('.') +1 ).toLowerCase();
						let typeS = type.split('/');
_this.get('dbgS').warn("typeS:", typeS);
						if( typeS[0].indexOf('image')===0 ){
							_this.set('_isImageUpload', true);
							_this.set('_isVideoUpload', false);
							_this.set('_isFileUpload', false);
						}else if( typeS[0].indexOf('video')===0 ){
							_this.set('_isImageUpload', false);
							_this.set('_isVideoUpload', true);
							_this.set('_isFileUpload', false);
						}else{// mainly "application/*"
							_this.set('_isImageUpload', false);
							_this.set('_isVideoUpload', false);
							_this.set('_isFileUpload', true);
						}
						//https://support.cloudinary.com/hc/en-us/articles/202520592-Do-you-have-a-file-size-limit-
						if( _this.get('_isImageUpload') )
							data.set('resource_type', 'auto');//<= 20 MB
						else if( _this.get('_isVideoUpload') )
							data.set('resource_type', 'video');//<= 500 MB
						else
							data.set('resource_type', 'raw');//<= 20 MB
						data.delete('path');
						data.delete('source');
						data.set('timestamp', _this.get('imageUploadParamsTimestamp'));
						data.set('signature', _this.get('imageUploadParamsSignature'));
						data.set('api_key', _this.get('imageUploadParamsApiKey'));
						data.set('folder', _this.get('imageUploadParamsFolder').replace('froala', 'jodit-'));
						return data;
					},
					isSuccess: function (resp) {
						return !resp.error;
					},
					getMsg: function (resp) {
						return resp.msg.join !== undefined ? resp.msg.join(' ') : resp.msg;
					},
					process: function (resp) {
_this.get('dbgS').notify('Jodit is uploading! process(', resp,')');
						_this.set('hasFocus', true);
						return {
							/*files: resp[_this.get('editor').options.uploader.filesVariableName] || [],
							path: resp.path,
							baseurl: resp.baseurl,
							error: resp.error,
							msg: resp.msg
							*/
							files: [ resp['secure_url'] ] || [],
							file: resp['secure_url'],
							baseurl: '',
							error: null,
							msg: null,
							original_filename: resp['original_filename']
						};
					},
					error: function (e) {
						_this.get('dbgS').error("JODIT uploader error ! \ne=", e, e.message);
						_this.get('editor').events.fire('errorMessage', e.message, 'error', 4000);
						// _this.get('popupService').simpleAlertPopup(
						// 	_this.get('intl').t('joditRicheditor.errors.uploadPopupTitle'), _this.get('intl').t('joditRicheditor.errors.uploadPopupContent')
						// );
					},

					defaultHandlerSuccess: function (data, resp) {
						const editor = _this.get('editor');
//_this.get('dbgS').error('Jodit is uploading! defaultHandlerSuccess(', data, resp,') : ', editor.options.uploader.filesVariableName);
_this.get('dbgS').notify('Jodit is uploading! defaultHandlerSuccess(', '\ndata:', data, '\nresp:', resp,') : ', '\ndata["file"]:', data['file']);
						_this.set('hasFocus', true);
						//Restoring the caret position (lost when opening the choose file window, leading to add the image at the top of the edited text) ::
						data['file'] = data['file'].toString();
						let filename = data['file'].substr( data['file'].lastIndexOf('/') +1 ),
							ext = filename;
						if( filename.lastIndexOf('.') > -1 )
							ext = filename.substr( filename.lastIndexOf('.') +1 ).toLowerCase();
						let range = _this.get('currentSelectionRange');
_this.get('dbgS').notify("JODIT is using the saved range !", _this.get('currentSelectionRange'));
						//editor.selection.range = range;
						editor.selection.selectRange(range);
						//:Restoring the caret position
						editor.selection.focus();
						//if( ext != 'jpg' && ext != 'jpeg' && ext != 'gif' && ext != 'png' && ext != 'bmp' ){
						//if( _this.get('_isFileUpload') ){
						/*The condition is about what the icon the user clicked and not the type of file (s)he actually uploaded.*/
						if( _this._clickedOnFileUpload || _this.get('_isFileUpload') ){
_this.get('dbgS').notify("Inserting a FILE - _this._clickedOnFileUpload{"+_this._clickedOnFileUpload+"} || __this.get('_isFileUpload'){"+_this.get('_isFileUpload')+"}");
							/* Handling a file upload, not a picture.
							 * We force this mode for files that are not of an image type, even if the icon clicked was those for an image. This is to avoid inserting an IMG tag with a file url that would lead to a broken image displaying.
							*/
							let link = document.createElement('a');
							link.className = 'richeditor-filelink';
							link.setAttribute('title', data['original_filename']+'.'+ext);
							link.setAttribute('alt', data['file']);
							link.setAttribute('href', data['file']);
							link.setAttribute('target', '_blank');
							link.innerHTML = data['original_filename']+'.'+ext;
							//img.setAttribute('src', '');
							//link.appendChild(img);
							editor.selection.insertNode(link);
						}else{ /*Handling a picture*/
_this.get('dbgS').notify("Inserting an IMAGE - _this._clickedOnFileUpload{"+_this._clickedOnFileUpload+"} || __this.get('_isFileUpload'){"+_this.get('_isFileUpload')+"}");
							editor.selection.insertImage(data['file'], null, 'auto');
						}
						//_this.fireBlurEvent();//saving
					},
					defaultHandlerError: function (resp) {
						_this.get('dbgS').error("JODIT uploader defaultHandlerError ! \ne=", e, e.message);
						_this.get('editor').events.fire('errorMessage', e.message, 'error', 4000);
						// _this.get('popupService').simpleAlertPopup(
						// 	_this.get('intl').t('joditRicheditor.errors.uploadPopupTitle'), _this.get('intl').t('joditRicheditor.errors.uploadPopupContent')
						// );
					}
				}

			}
			));// Init editor finished
/*
			if( _this.get('relativeHeight') ){
				//$('.jodit-workplace').style.height = _this.get('relativeHeight');
				$('.jodit-workplace').style.height = '78%';
			}
*/
			if( _this.get('visibilityClass') ){
				//This is only for popup (comment popup in add-comment-popup)
				$('.jodit-container').height("auto");
				$('.jodit-container').css("min-height", "unset");
	// 			$('.jodit-workplace').height("auto");
				$('.jodit-workplace').css("min-height", "unset");
				$('.jodit-wysiwyg').css("min-height", "unset");
				$('.jodit-container').css("margin-bottom", "unset");
				setTimeout( function(){_this.dynamicResize()}, 200 );
			}

			_this.set('contentSave', _this.get('editor').getEditorValue());
			/*Value and handling changes to update the mut content property used by the parent component/controller :*/
			_this.get('editor').setEditorValue( _this.get('content') );

			const jdChanged_handler = function(evt,exec) {
				//Ensure the A tags elements have a target=_blank attribute :
				if( !exec ){
					clearTimeout(_this._jdChanged_tout);
					_this._jdChanged_tout = setTimeout(function(){jdChanged_handler(evt,true);}, 600);
					return;
				}
				clearTimeout(_this._jdChanged_tout);
				_this._jdChanged_tout = null;
				if( _this.hasBeenDestroyed || !$(".jodit-wysiwyg") || !_this.get('editor') )return;//jodit has been unloaded (route changed)
				$(".jodit-wysiwyg").each(function(){
					let links = $(this).find('A');
					links.each(function(){
						this.setAttribute('target', '_blank');
					});
				});
				//We disable some cleaning in getEditorValue to gain speed but also to avoid changing the in-Jodit-code and interfere with some Jodit logics (like cleaning the html, changing selection or cursor position etc.)
				let ctnt = _this.get('editor').getEditorValue(/*removeSelectionMarkers=*/ false, /*removeFakeSpans=*/ false).trim();
				if( ctnt.indexOf('<p>') === 0 )
					ctnt = ctnt.substr(3, ctnt.length);
				if( ctnt.lastIndexOf('</p>') === ctnt.length - 4 )
					ctnt = ctnt.substr(0, ctnt.length-4);
				_this.set('content', ctnt);
			};

			$( "#"+_this.get('editorId') ).change(jdChanged_handler);

			//This is to fix a misplacement of images when uploading them :
			$(_this.get('editor').currentPlace.container).on('click', function(){//click
				_this.set('hasFocus', true);
			});

			$(_this.get('editor').currentPlace.container.childNodes[1]).on('click', function(){//click event in the edit zone (anywhere) - this is to detect inline popup usage and cancel jodit's blur event if focus is on the popup
				_this._cancelBlur();
				setTimeout( function(){_this._joditToolbarClickedAddons();}, 100 );
			});
			$(_this.get('editor').currentPlace.container.childNodes[0]).on('click', function(){//click event on the toolbar (anywhere)
				_this._cancelBlur();
				//then we set a click handler on the popup div (the actual one that is created and displayed on page for each popup content - setting an event listener on the stable parent $( ".jodit-popup-container" ) does not work)
				setTimeout( function(){_this._joditToolbarClickedAddons();}, 100 );
				//Storing the last caret position before clicking on the toolbar
				_this.set('currentSelectionRange', _this.get('editor').selection.range);
_this.get('dbgS').notify("JODIT range saved!", _this.get('currentSelectionRange'));
			});
			/**/
			$('.jodit-toolbar-button_file').on('click', function(){//click on upload a file icon in the toolbar
				_this._clickedOnFileUpload = true;
				_this._clickedOnImageUpload = false;
			});
			$('.jodit-toolbar-button_image').on('click', function(){//click on upload a file icon in the toolbar
				_this._clickedOnFileUpload = false;
				_this._clickedOnImageUpload = true;
			});
			/**/

// 		});
	};

	_cancelBlur(){
// this.get('dbgS').notify('_cancelBlur()');
		clearTimeout(this._blurTimeout);
		this._blurTimeout = null;
		this.set('hasFocus', true);
	};

	_joditToolbarClickedAddons(){
// this.get('dbgS').notify('_joditToolbarClickedAddons()');
		const _this = this;
		$( ".jodit-popup" ).on('click', function(){//click event (anywhere) on the actual popup real container, created and shown on page for each actual popup content
			_this._cancelBlur();
			setTimeout( function(){_this._joditToolbarClickedAddons();}, 100 );//in some cases the popup is re-rendered without our listener (when the popup is displaying a short inline toolbar and we click on a tool leading to open an advanced settings popup) : here we ensure the listener is still set
		});

	};

	fireBlurEvent(force){
		//to automatically save content when editor blurs (used on issue editing) we are using a timeout firstly to let time for a focus event to be triggered (like when uploading an image we blur from the wysiwyg part when clicking on the choose file button but this click event is toggling back this.hasFocus to true and we don't want the saving to be done in the timelap between the blur and the click event). As a good side effect the timeout is also letting time to the user to click back because he is still editing the content.
		if(this.hasBeenDestroyed)return;
// "this.get('dbgS').notify"('fireBlurEvent('+force+')');
		clearTimeout(this._blurTimeout);
		this._blurTimeout = null;
		const _this = this;
		if(!force){
			this._blurTimeout = setTimeout( function(){_this.fireBlurEvent(true)} ,600);
		}else/* firing blur only if the editor value changed is not a so good idea... - if( this.get('contentSave') != this.get('editor').getEditorValue() )*/{
			this.set('contentSave', this.get('editor').getEditorValue());
// 			setTimeout( function(){_this.sendAction('onEditorBlur', _this.get('editorId'));}, 1000);
			this.sendAction('onEditorBlur', _this.get('editorId'));
		}//else this.get('dbgS').notify( "NO CHANGE!\n"+this.get('contentSave') +"\n!=\n"+ this.get('content') );
	};

	@action
	onClickOutside() {
		this.fireBlurEvent();
		this.hasFocus = false;
	}

}

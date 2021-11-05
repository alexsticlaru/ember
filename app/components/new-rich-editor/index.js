import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class NewRichEditorComponent extends Component {
  @service intl;

  get localeLoaded (){
    //this is some hack to wait with rendering Jodit after the locale is set.
    //else the placeholder will not work
    return this.intl.locale[0] !== "blank";
  }

  @action initializeJodit() {
    const buttons = [ /*text pre-formated styles : 'paragraph', 'fontsize', '|', */ 'bold', /*'strikethrough', 'underline', */'italic', /*'font', '|', 'align', */'|', 'ul', 'ol', 'link', /*'image', 'file', 'video', '|', 'undo', 'redo', '|', 'hr', 'symbol'*/];

    const editor = new Jodit("#"+this.args.editorId, {
     //for all options:
     //https://xdan.github.io/jodit/examples/
     //https://xdsoft.net/jodit/play.html
     tabIndex: 1,
     allowTabNavigation: true,
     disabled: (this.args.disabled ? this.args.disabled : false),
     readOnly: false,
     showPlaceholder: true,
     placeholder: (this.args.placeholder ? this.args.placeholder.toString() : ""),
     height: (this.args.height ? this.args.height : 200),
     minHeight: 200,
     allowResizeX: false,
     allowResizeY: false,
     toolbarSticky: false,
     askBeforePasteHTML: false,
     askBeforePasteFromWord: false,
     defaultActionOnPaste: "insert_only_text",
     buttons: buttons,
     buttonsMD: buttons,
     buttonsSM: buttons,
     buttonsXS: buttons,
     toolbar: true,
     showCharsCounter: false,
     showWordsCounter: false,
     showXPathInStatusbar: false,
     enableDragAndDropFileToEditor: false,
     link: {
       noFollowCheckbox: false,
       openInNewTabCheckbox: false
     },
   })

   //in the future this event could be used to give the editor a "slack-like" pasting logic
   //and to add attachments also through here
   // editor.events.on('beforePaste', function (event) {
   //   console.log(event.clipboardData.getData("text"));
   // });
  }
}

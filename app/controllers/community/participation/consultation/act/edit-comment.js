import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';


export default class EditCommentController extends Controller {
    @service popup;

    @action
    close() {
        this.popup.close();
    }

}
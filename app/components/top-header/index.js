import Component from '@glimmer/component';
import config from '../../config/environment';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';


export default class TopHeaderComponent extends Component {

  @service('user') userService;

  
  constructor() {
	super(...arguments);
    var prevScrollpos;
     window.onscroll = function() {
       if (document.getElementById("top-header")) {
         var currentScrollPos = window.pageYOffset;
         if (prevScrollpos > currentScrollPos) {
           document.getElementById("top-header").style.top = "0";
         } else {
           document.getElementById("top-header").style.top = "-6.7rem";
         }
         prevScrollpos = currentScrollPos;
       }
     }
  }

    get config() {
        return config;
    }
    
    

}

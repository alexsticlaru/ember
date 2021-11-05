import Component from '@glimmer/component';

export default class UserAvatarComponent extends Component {


  get badgeClass(){
    if ( this.args.user.get("isGeneralAdmin") ) {
      return "general-admin" ;
    }
    
    return '';  
  }

  get avatarClass() {
    return this.args.avatarClass ? this.args.avatarClass : 'user-avatar'
  }

}

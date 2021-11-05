import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';



export default class QuestionsDesktopTabletComponent extends Component {
    @service router;

    @action
    setupBody() {
        const topHeaderElm = document.getElementById("top-header")
        const scrollOptions = {
            left: 0,
            top: topHeaderElm.offsetHeight === 65 ? 840 : 880,
            behavior: 'smooth'
          }
        window.scroll(scrollOptions);
        const bodyElem = document.getElementById('questionsBody');
        bodyElem.addEventListener('keyup', (e) => {
          //deactivated for now because it might be problematic for accessibility
            if (e.key === 'Enter') {
                // this.args.nextQuestion();
            }
        });
    }

    @action
    focusNext(elem) {
        elem.focus({
            preventScroll: true
          });
    }

    @action
    seeResults() {
        this.router.transitionTo('community.participation.questionnaire.questionnaire-results');
        const topHeaderElm = document.getElementById("top-header");
        const scrollOptions = {
            left: 0,
            top: topHeaderElm.offsetHeight === 65 ? 1840 : 1880,
            behavior: 'smooth'
        }
        window.scroll(scrollOptions);
    }
}

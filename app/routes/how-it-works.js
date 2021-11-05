import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HowItWorksRoute extends Route {
  @service meta;

  beforeModel() {
    this.meta.addMetaTags({
			title: "How it works",
			description: "Welcome to Civocracy! Your Civocracy community gathers people to think together and find solutions around your different projects.",
			image: "https://res.cloudinary.com/civocracy/image/upload/v1624280058/static/og-images/engage.png"
		});
  }
}

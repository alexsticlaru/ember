import Route from '@ember/routing/route';

export default class ProjectsRoute extends Route {

  async model(params) {
		const projects = await this.store.findAll('project', {
    });
		return projects;
	}
}

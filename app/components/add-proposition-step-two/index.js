import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class AddPropositionStepTwo extends Component {
	@tracked propositionThemes = this.args.propositionThemes;
	@tracked model = this.args.model;
	@tracked showThemesContainer = false;
	@tracked showMapContainer = false;
	@tracked showCustomThemeInput = false;
	@tracked customThemeValue = '';
	@tracked themes = this.model.themes;
	@tracked customThemes = [];


	@action toggleThemesContainer() {
		this.showThemesContainer = !this.showThemesContainer;
	}

	@action toggleMapContainer() {
		//this here is to reset the lat long whenever the map is opened
		this.args.updateLocation(null, null);
		this.showMapContainer = !this.showMapContainer;
	}

	@action addCustomTheme() {
		this.showCustomThemeInput = true
	}

	@action
	focusOutAction() {
		if(this.customThemeValue.length > 0) {
			var customTheme = {
				themeId: Math.floor(Math.random()*(999-100+1)+100),
				isCustom:true,
				labelTranslate: this.customThemeValue,
				isSelected: true
			}
			var _themes = this.themes;
			var _customThemes = this.customThemes;
			_themes.push(customTheme);
			this.propositionThemes.push(customTheme)
			this.themes = _themes
			_customThemes.push(customTheme);
			this.customThemes = _customThemes
			this.showCustomThemeInput = false;
			this.customThemeValue = '';
		} else {
			this.showCustomThemeInput = false;
			this.customThemeValue = '';
		}
	}

	@action
	removeCustomTheme(themeToRemove) {
		var customThemesCopyArr = this.customThemes;
		this.customThemes = [];
		const themeIndex = customThemesCopyArr.indexOf(themeToRemove);
		customThemesCopyArr.splice(themeIndex, 1);
		this.customThemes = customThemesCopyArr;
	}

	@action
	toggleCustomTheme(theme) {
		var customThemesCopyArr = this.customThemes;
		this.customThemes = [];
		customThemesCopyArr.forEach((t) => {
			if (t.themeId === theme.themeId) {
				this.customThemes.push({
					themeId: Math.floor(Math.random()*(999-100+1)+100),
					isCustom:true,
					labelTranslate: t.labelTranslate,
					isSelected: !t.isSelected
				})
			} else {
				this.customThemes.push(t)
			}
		})
	}
}

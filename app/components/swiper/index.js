/* globals Swiper */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { once } from '@ember/runloop';
import { warn } from '@ember/debug';
import { assign as emAssign } from '@ember/polyfills';
import { isEmpty } from '@ember/utils';

import Swiper, { Navigation, Pagination } from 'swiper';
Swiper.use([Navigation, Pagination]);

const { keys } = Object;
const assign = Object.assign || emAssign;

const EMBER_CLI_SWIPER_OPTIONS = [
  'options',
  'registerAs',
  'vertical',
  'centered',
  'updateFor',
  'currentSlide'
];

export default class CivoSwiper extends Component {

  /**
   * Swiper Instance
   * @private
   * @type {Boolean}
   */
  _swiper = false;

  /**
   * Proxies `Swiper.activeIndex`
   * @public
   * @type {Number}
   */
  currentSlide = 0;

  /**
   * Compared against `currentSlide`
   * @private
   * @type {Number}
   */
  _currentSlideInternal = 0;

   /**
   * Swiper next element class
   * @public
   * @type {String}
   */
  nextElClass = 'swiper-button-next';

  /**
   * Swiper previous element class
   * @public
   * @type {String}
   */
  prevElClass = 'swiper-button-prev';

  /**
   * User defined map of Swiper events
   * @type {Object}
   */
  events = {};

  /**
   * Abstraction to invoke `Swiper.update`
   * @public
   * @type {String}
   */
  updateFor = '';

  /**
   * Compared against `updateFor`
   * @private
   * @type {String}
   */
  _updateForInternal = '';


  /**
   * Single Attribute options
   * @public
   * @type {Object}
   */
  options = {};

  /**
   * Render navigation controls
   * @public
   * @type {Boolean}
   */
  get hasNavigation() {
    return !isEmpty(this.args.options.navigation);
  }

  /**
   * Render pagination controls
   * @public
   * @type {Boolean}
   */
  get hasPagination() {
    return !isEmpty(this.args.options.pagination)
  }

  /**
   * Get Swiper options from attributes
   * @private
   * @return {Object}
   */
  _getOptions(element) {
    let options = assign({}, this.options, this.args.options);
    // Overwrite pagination element selector
    if (options.pagination) {
      let customPaginationEl
        = (typeof options.pagination === 'string' && options.pagination) // custom string selector
        || (typeof options.pagination === 'object' && options.pagination.el) // custom `el` option selector
        || '';

      // Note:
      //  Never resolve user provided pagination configuration,
      //  which may not extend Object.prototype creating hard to
      //  debug issues within Swiper.
      options.pagination = assign(
        { clickable: customPaginationEl ? true : false }, // custom paginations must be clickable
        typeof options.pagination === 'object' ? options.pagination : {},
        {
          el: `#${element.id} > .swiper-pagination`
        }
      );
    }

    if (options.navigation) {
      if (typeof options.navigation !== 'object') {
        options.navigation = {};
      }

      // Sync prev/next nav classes to custom options
      if (typeof options.navigation.prevEl === 'string') {
        this.prevElClass = options.navigation.prevEl.replace('.', '');
      }

      if (typeof options.navigation.nextEl === 'string') {
        this.nextElClass = options.navigation.nextEl.replace('.', '');
      }

      // Ensure `nextEl` & `prevEl` required options set
      // and that navigation inherits from Object.prototype
      options.navigation = assign({}, options.navigation, {
        nextEl: `.${this.nextElClass}`,
        prevEl: `.${this.prevElClass}`
      });
    }

    if (options.vertical) {
      warn(
        'ember-cli-swiper option `direction` is ignored while `vertical` true',
        !options.direction,
        { id: 'ember-cli-swiper.direction-with-virtical' }
      );

      options.direction = 'vertical';
    }

    if (options.centered) {
      warn(
        'ember-cli-swiper option `centeredSlides` is ignored while `centered` true',
        !options.centeredSlides,
        { id: 'ember-cli-swiper.centered-with-centered-slides' }
      );

      options.centeredSlides = true;
    }

    // Allows `init` event to fire
    if (this.events.init) {
      options.init = false;
    }

    /*
     Remove component-only
     configuration options from Swiper options
     */
    keys(options).forEach(
      (k) => EMBER_CLI_SWIPER_OPTIONS.indexOf(k) !== -1 && delete options[k]
    );

    return options;
  }

  /**
   * Userland fallback sugar for forcing swiper update
   * @public
   */
  forceUpdate() {
    this._swiper.update();
    this._swiper.slideTo(this.currentSlide);
  }

  /**
   * Update `currentSlide` and trigger `onChange` event
   * @private
   * @param {Object} swiper - Swiper instance
   */
  _slideChanged(swiper) {
    let index;

    if (this.loop) {
      index = parseInt(
        swiper.slides
          .parent()
          .find('.swiper-slide-active')
          .attr('data-swiper-slide-index'),
        10
      );
    } else {
      index = swiper.realIndex;
    }

    this._currentSlideInternal = index;
    this.currentSlide = index;
    this.onChange(swiper.slides[swiper.realIndex]);
  }

  @action
  updateSwiper() {
    /*
     Data-down Swiper slide activation
     */
    if (this.currentSlide !== this._currentSlideInternal) {
      let index = this.currentSlide;

      if (this.loop) {
        let swiper = this._swiper;

        index = swiper.slides
          .parent()
          .find(`[data-swiper-slide-index="${this.currentSlide}"]`)
          .prevAll().length;
      }

      this._swiper.slideTo(index);
      this._currentSlideInternal = this.currentSlide;
    }

    /*
     Trigger `update()` of swiper
     */
    if (this.updateFor !== this._updateForInternal) {
      once(this._swiper, 'update');
      this._updateForInternal = this.updateFor;
    }
  }

  @action
  initSwiper(element) {
    this.registerAs = this;

    let swiperOptions = assign(
      { initialSlide: this.currentSlide },
      this._getOptions(element)
    );

    let transitionEvent = this.loop ? 'slideChangeTransitionEnd' : 'slideChange';
    this._swiper = new Swiper(element, swiperOptions);
    this._swiper.on(
      transitionEvent,
      this._slideChanged.bind(this, this._swiper)
    );

    // Subscribe configured actions as Swiper events
    keys(this.events).forEach((evt) =>
      this._swiper.on(evt, this.events[`${evt}`])
    );

    // Manual initalization when user requires `init` event handling
    if (swiperOptions.init === false) {
        this._swiper.init();
    }
  }

  willDestroy() {
    let instance = this._swiper;

    if (instance) {
      instance.off('slideChangeTransitionEnd');
      instance.destroy();
      this._swiper = null;
    }
  }

  /**
   * On Swiper Slide change
   * @public
   * @param {Swiper.Slide} swiperSlide
   */
  onChange(/* swiperSlide */) {}
}
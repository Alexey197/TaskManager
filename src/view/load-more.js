import AbstractView from './abstract';

const createLoadButton = () =>
  `<button class="load-more" type="button">load more</button>`

export default class LoadMoreButton extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this)
  }
  
  _clickHandler(evt) {
    evt.preventDefault()
    this._callback.click()
  }
  
  setClickHandler(callback) {
    this._callback = callback
    this.getElement().addEventListener(`click`, this._clickHandler)
  }
  getTemplate() {
    return createLoadButton()
  }
}

import AbstractComponent from './abstractComponent';

const createLoadButton = () =>
  `<button class="load-more" type="button">load more</button>`

export default class LoadMoreButton extends AbstractComponent {
  getTemplate() {
    return createLoadButton()
  }
}

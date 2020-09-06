import AbstractComponent from './abstractComponent';

const createBoardTemplate = () =>
  `<section class="board container"></section>`

export default class Board extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate()
  }
}

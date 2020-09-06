import AbstractComponent from './abstractComponent';

const createTaskListTemplate = () => {
  return `<div class="board__tasks"></div>`
}

export default class TasksList extends AbstractComponent {
  constructor() {
    super()
  }
  
  getTemplate() {
    return createTaskListTemplate()
  }
}

import MenuView from './view/menu'
import FilterView from './view/filter';
import TaskView from './view/task';
import TaskEditView from './view/edit-task';
import LoadMoreButtonView from './view/load-more';
import BoardView from './view/board';
import SortView from './view/sort';
import NoTaskView from './view/no-task';
import TaskListView from './view/tasks-list';

import {render, RenderPosition} from './utils';
import {generateTask} from './mock/task'
import {generateFilter} from './mock/filter'

const Task = {
  COUNT: 20,
  COUNT_PER_STEP: 8
}

const tasks = new Array(Task.COUNT).fill().map(generateTask)
const filters = generateFilter(tasks)

const siteMain = document.querySelector(`.main`)
const siteHeader = siteMain.querySelector(`.main__control`)

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task)
  const taskEditComponent = new TaskEditView(task)
  
  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  }
  
  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  }
  
  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  }
  
  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  })
  
  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  })
  
  render(taskListElement, taskComponent.getElement())
}

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView()
  const tasksList = new TaskListView()
  
  render(boardContainer, boardComponent.getElement())
  render(boardComponent.getElement(), tasksList.getElement())
  
  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent.getElement(), new NoTaskView().getElement(), RenderPosition.AFTER_BEGIN)
    return
  }
  
  render(boardComponent.getElement(), new SortView().getElement(), RenderPosition.AFTER_BEGIN)
  
  boardTasks
  .slice(0, Math.min(tasks.length, Task.COUNT_PER_STEP))
  .forEach((boardTask) => renderTask(tasksList.getElement(), boardTask))
  
  if (boardTasks.length > Task.COUNT_PER_STEP) {
    let renderTaskCount = Task.COUNT_PER_STEP
    
    const loadMore = new LoadMoreButtonView()
    render(boardComponent.getElement(), loadMore.getElement())
    
    loadMore.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault()
      boardTasks
        .slice(renderTaskCount, renderTaskCount + Task.COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(tasksList.getElement(), boardTask))
      
      renderTaskCount += Task.COUNT_PER_STEP
      
      if (renderTaskCount >= boardTasks.length) {
        loadMore.getElement().remove()
        loadMore.removeElement()
      }
    })
  }
}

render(siteHeader, new MenuView().getElement());
render(siteMain, new FilterView(filters).getElement());
renderBoard(siteMain, tasks)

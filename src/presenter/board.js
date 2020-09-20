import TaskView from '../view/task';
import TaskEditView from '../view/edit-task';
import LoadMoreButtonView from '../view/load-more';
import BoardView from '../view/board';
import SortView from '../view/sort';
import NoTaskView from '../view/no-task';
import TaskListView from '../view/tasks-list';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {sortTaskUp, sortTaskDown} from '../utils/task';
import {SortType} from '../const';

const TASK_COUNT_PER_STEP = 8

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    
    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTaskView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }
  
  init(boardTasks) {
    this._boardTasks = boardTasks.slice();
    this._sourcedBoardTasks = boardTasks.slice();
    
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFORE_END);
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFORE_END);
    
    this._renderBoard();
  }
  
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortTasks(sortType);
    this._clearTaskList();
    this._renderTaskList();
  }
  
  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        this._boardTasks = this._sourcedBoardTasks.slice();
    }
    this._currentSortType = sortType;
  }
  
  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTER_BEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }
  
  _renderTask(task) {
    const taskComponent = new TaskView(task);
    const taskEditComponent = new TaskEditView(task);
    
    const replaceCardToForm = () => {
      replace(taskEditComponent, taskComponent);
    };
    
    const replaceFormToCard = () => {
      replace(taskComponent, taskEditComponent);
    };
    
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };
    
    taskComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });
    
    taskEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });
    
    render(this._taskListComponent, taskComponent, RenderPosition.BEFORE_END);
  }
  
  _renderTasks(from, to) {
    this._boardTasks
    .slice(from, to)
    .forEach((boardTask) => this._renderTask(boardTask));
  }
  
  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, RenderPosition.AFTER_BEGIN);
  }
  
  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    this._renderedTaskCount += TASK_COUNT_PER_STEP;
    
    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }
  
  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFORE_END);
    
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }
  
  _clearTaskList() {
    this._taskListComponent.getElement().innerHTML = ``
    this._renderedTaskCount = TASK_COUNT_PER_STEP
  }
  
  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));
    
    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }
  
  _renderBoard() {
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }
    
    this._renderSort();
    
    this._renderTaskList();
  }
}

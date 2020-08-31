import {createMenuTemplate} from './view/menu'
import {createFilterTemplate} from './view/filter'
import {createTaskEditTemplate} from './view/edit-task'
import {createTaskTemplate} from './view/task'
import {createBoardTemplate} from './view/board'
import {createLoadButton} from './view/load-more'
import {generateTask} from './mock/task'
import {generateFilter} from './mock/filter'

const TASKS_NUM = 20;
const TASK_COUNT_PER_STEP = 8

const tasks = new Array(TASKS_NUM).fill().map(generateTask)
const filters = generateFilter(tasks)

const siteMain = document.querySelector(`.main`)
const siteHeader = siteMain.querySelector(`.main__control`)


const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
}

render(siteHeader, createMenuTemplate());
render(siteMain, createFilterTemplate(filters));
render(siteMain, createBoardTemplate());

const siteBoard = siteMain.querySelector(`.board`)
const siteBoardList = siteMain.querySelector(`.board__tasks`)

render(siteBoardList, createTaskEditTemplate(tasks[0]))

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  render(siteBoardList, createTaskTemplate(tasks[i]));
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP
  
  render(siteBoard, createLoadButton())
  
  const loadMoreButton = siteBoard.querySelector(`.load-more`)
  
  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault()
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
    .forEach((task) => render(siteBoardList, createTaskTemplate(task)))
    
    renderedTaskCount += TASK_COUNT_PER_STEP
    
    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove()
    }
  })
}


const TASKS_NUM = 3;
const siteMain = document.querySelector(`.main`);

import {createMenuTemplate} from './view/menu';
import {createFilterTemplate} from './view/filter';
import {createTaskEditTemplate} from './view/edit-task';
import {createTaskTemplate} from './view/task';
import {createBoardTemplate} from './view/board';
import {createLoadButton} from './view/load-more';

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = siteMain.querySelector(`.main__control`);

render(siteHeader, createMenuTemplate());
render(siteMain, createFilterTemplate());
render(siteMain, createBoardTemplate());

const siteBoard = siteMain.querySelector(`.board`);
const siteBoardList = siteMain.querySelector(`.board__tasks`);

render(siteBoardList, createTaskEditTemplate());

new Array(TASKS_NUM)
  .fill(``)
  .forEach(
      () => render(siteBoardList, createTaskTemplate())
  )

render(siteBoard, createLoadButton());


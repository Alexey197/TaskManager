import MenuView from './view/menu'
import FilterView from './view/filter';

import {generateTask} from './mock/task'
import {generateFilter} from './mock/filter'
import BoardPresenter from './presenter/board';
import {render, RenderPosition} from './utils/render';

const TASK_NUM = 20

const tasks = new Array(TASK_NUM).fill().map(generateTask)
const filters = generateFilter(tasks)

const siteMain = document.querySelector(`.main`)
const siteHeader = siteMain.querySelector(`.main__control`)

const boardPresenter = new BoardPresenter(siteMain)

render(siteHeader, new MenuView(), RenderPosition.BEFORE_END);
render(siteMain, new FilterView(filters), RenderPosition.BEFORE_END);
boardPresenter.init(tasks)

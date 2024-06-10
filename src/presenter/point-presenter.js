import {render, replace, remove} from '../framework/render';
import PointView from '../view/point-view';
import PointEditorView from '../view/point-editor-view';
import {isEscapeKey} from '../utils';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #handleModeChange = null;
  #pointList = null;
  #editFormComponent = null;
  #pointComponent = null;
  #point = null;

  #mode = Mode.DEFAULT;

  constructor({pointList, onModeChange}) {
    this.#pointList = pointList;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new PointView({
      tripPoint: this.#point,
      onClick: this.#handleEditClick
    });

    this.#editFormComponent = new PointEditorView({
      tripPoint: point,
      onSubmit: this.#handleFormSubmit
    });

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointComponent, this.#pointList);
      return;
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    remove(prevEditFormComponent);
    remove(prevPointComponent);
  }

  delete() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm = () => {
    replace(this.#editFormComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editFormComponent);
    this.#mode = Mode.DEFAULT;
  };

  #ecsKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.body.removeEventListener('keydown', this.#ecsKeydown);
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
    document.body.addEventListener('keydown', this.#ecsKeydown);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
    document.body.removeEventListener('keydown', this.#ecsKeydown);
  };
}
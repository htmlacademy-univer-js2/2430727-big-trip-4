import {render, RenderPosition} from '../render';
import {UpdateType, UserAction} from '../mock/const';

import {remove} from '../framework/render';
import {isEscapeKey} from '../utils';
import {nanoid} from 'nanoid';
import PointEditorView from '../view/point-editor-view';

export default class NewPointPresenter {
  #handleDataChange = null;
  #handleDestroy = null;
  #pointListContainer = null;
  #pointEditComponent = null;

  constructor({pointListContainer, onDataChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(destinations, offers) {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditorView({
      destinations: destinations,
      offers: offers,
      onSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      isEditForm: false
    });

    render(this.#pointEditComponent, this.#pointListContainer,
      RenderPosition.AFTERBEGIN);

    document.body.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.body.removeEventListener('keydown', this.#escKeyDownHandler);
  }


  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,

      {id: nanoid(), ...point}
    );

    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };
}
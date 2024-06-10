import Observable from '../framework/observable';
export default class TripPointModel extends Observable {
  #tripPoints = [];

  constructor (tripPoints) {
    super();
    this.#tripPoints = tripPoints;
  }

  get tripPoints() {
    return this.#tripPoints;
  }

  updatePoint(updateType, update) {
    const index = this.#tripPoints.findIndex((point) => point.id === update.id);

    this.#tripPoints = [
      ...this.tripPoints.slice(0, index),
      update,
      ...this.#tripPoints.slice(index + 1),
    ];
    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#tripPoints = [
      update,
      ...this.#tripPoints
    ];

    this._notify(updateType, update);
  }

  deletePoint = (updateType, update) => {
    const index = this.#tripPoints.findIndex((point) => point.id === update.id);

    this.#tripPoints = [
      ...this.#tripPoints.slice(0, index),
      ...this.#tripPoints.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
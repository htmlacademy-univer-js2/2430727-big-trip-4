import {FilterType, FilterTypeDescriptions, UpdateType} from '../const';
import FilterView from '../view/filter-view';
import {remove, replace, render} from '../framework/render';
import {filter} from '../utils';


export default class FilterPresenter {
  #filterContainer = null;
  #modelFilter = null;
  #tripPointsModel = null;

  #filterComponent = null;

  constructor({filterContainer, modelFilter, tripPointsModel}) {
    this.#filterContainer = filterContainer;
    this.#modelFilter = modelFilter;
    this.#tripPointsModel = tripPointsModel;

    this.#tripPointsModel.addObserver(this.#handleModelEvent);
    this.#modelFilter.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#tripPointsModel.tripPoints;
    return [FilterType.EVERYTHING, FilterType.FUTURE, FilterType.PAST].map((type) => ({ type, name: FilterTypeDescriptions[type], count: filter[type](points).length}));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#modelFilter.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#modelFilter.filter === filterType) {
      return;
    }

    this.#modelFilter.setFilter(UpdateType.MAJOR, filterType);
  };
}

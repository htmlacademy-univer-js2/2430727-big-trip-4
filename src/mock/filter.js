import { FilterType } from './const';
import { isTripDateBeforeToday } from '../utils';


const filter = {
  [FilterType.FUTURE]: (tripPoints) => tripPoints.filter((tripPoint) => isTripDateBeforeToday(tripPoint.dateFrom)),
  [FilterType.EVERYTHING]: (tripPoints) => tripPoints,
};


function generateFilter() {
  return Object.keys(filter).map((filterName) => filterName );
}


export {generateFilter};
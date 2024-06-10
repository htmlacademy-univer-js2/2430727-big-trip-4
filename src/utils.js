import dayjs from 'dayjs';
import {FilterType} from './const';

const EVENT_DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const FORM_DATE_FORMAT = 'DD/MM/YY';
const BASIC_DATE_FORMAT = 'DD/MM/YY HH:mm';

const getItemFromItemsById = (items, id) => (items.find((item) => item.id === id));

const getRandomItemFromItems = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomPrice = () => Math.floor(Math.random() * 1000) + 100;

const getRandomId = () => Math.floor(Math.random() * 100) + 1;

const isTripDateBeforeToday = (date) => dayjs(date).isBefore(dayjs(), 'D') || dayjs(date).isSame(dayjs(), 'D');

const changeType = (type) => type.charAt(0).toUpperCase() + type.slice(1);

const updatePoint = (items, update) => items.map((item) => item.id === update.id ? update : item);

const getRandomSliceFromItems = (items) => {
  const n = Math.floor(Math.random() * (items.length + 1));
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const isDatesEqual = (date1, date2) => (!date1 && !date2) || dayjs(date1).isSame(date2, 'D');

const createIDgenerator = () => {
  let id = 0;
  return () => ++id;
};

const isFuture = (date) => date && dayjs().isBefore(date, 'D');
const isPast = (date) => date && dayjs().isAfter(date, 'D');

const filter = {
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(point.dateFrom)),
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isPast(point.dateFrom)),
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const convertToEventDateTime = (date) => date.substring(0, date.indexOf('T'));
const convertToEventDate = (date) => dayjs(date).format(EVENT_DATE_FORMAT);
const convertToDateTime = (date) => date.substring(0, date.lastIndexOf(':'));
const convertToTime = (date) => dayjs(date).format(TIME_FORMAT);
const convertToBasicime = (date) => dayjs(date).format(BASIC_DATE_FORMAT);
const capitalizeType = (type) => type.charAt(0).toUpperCase() + type.slice(1);
const convertToFormDate = (date) => dayjs(date).format(FORM_DATE_FORMAT);

export {getRandomItemFromItems, getRandomPrice, getRandomId, convertToEventDateTime, convertToEventDate, convertToDateTime,
  convertToTime, capitalizeType, convertToFormDate, createIDgenerator, getRandomSliceFromItems, getItemFromItemsById,
  convertToBasicime, isEscapeKey, changeType, isTripDateBeforeToday, updatePoint, isDatesEqual, filter};


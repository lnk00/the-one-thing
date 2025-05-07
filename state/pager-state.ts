import { atom } from 'jotai';

export type PageType =
  | 'PAGE_INTRO'
  | 'PAGE_LIFE'
  | 'PAGE_YEARS'
  | 'PAGE_YEAR'
  | 'PAGE_MONTH'
  | 'PAGE_WEEK'
  | 'PAGE_DAY';

export const PAGES: Array<PageType> = [
  'PAGE_INTRO',
  'PAGE_LIFE',
  'PAGE_YEARS',
  'PAGE_YEAR',
  'PAGE_MONTH',
  'PAGE_WEEK',
  'PAGE_DAY',
];

export const currentPageIndexAtom = atom<number>(0);

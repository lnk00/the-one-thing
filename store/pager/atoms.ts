import { atom } from 'jotai';
import { PAGES } from './types';

export const currentPageIndexAtom = atom<number>(0);
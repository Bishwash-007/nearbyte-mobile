import { ImageSourcePropType } from 'react-native';

export interface Avatar {
  id: number;
  source: ImageSourcePropType;
}

const avatar1 = require('@/assets/avatars/1.jpg');
const avatar2 = require('@/assets/avatars/2.jpg');
const avatar3 = require('@/assets/avatars/3.jpg');
const avatar4 = require('@/assets/avatars/4.jpg');
const avatar5 = require('@/assets/avatars/5.jpg');
const avatar6 = require('@/assets/avatars/6.jpg');
const avatar7 = require('@/assets/avatars/7.jpg');
const avatar8 = require('@/assets/avatars/8.jpg');
const avatar9 = require('@/assets/avatars/9.jpg');
const avatar10 = require('@/assets/avatars/10.jpg');
const avatar11 = require('@/assets/avatars/11.jpg');
const avatar12 = require('@/assets/avatars/12.jpg');

export const avatars: Avatar[] = [
  { id: 1, source: avatar1 },
  { id: 2, source: avatar2 },
  { id: 3, source: avatar3 },
  { id: 4, source: avatar4 },
  { id: 5, source: avatar5 },
  { id: 6, source: avatar6 },
  { id: 7, source: avatar7 },
  { id: 8, source: avatar8 },
  { id: 9, source: avatar9 },
  { id: 10, source: avatar10 },
  { id: 11, source: avatar11 },
  { id: 12, source: avatar12 },
];

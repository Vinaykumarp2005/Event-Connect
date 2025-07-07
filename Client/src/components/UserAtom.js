// atoms/userAtom.js
import { atom } from 'recoil';

export const userAtom = atom({
  key: 'userAtom',
  default: {
    username: '',
    email: '',
    role: '',
    _id:'',
  },
});

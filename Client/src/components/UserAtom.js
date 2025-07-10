import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist(); // this uses localStorage by default

export const userAtom = atom({
  key: 'userAtom',
  default: {
    username: '',
    email: '',
    role: '',
    _id: '',
  },
  effects_UNSTABLE: [persistAtom], // 🪄 this makes it persist!
});

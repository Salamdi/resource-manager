import { Gender } from './gender.model';

export interface Volunteer {
  name: string;
  surname: string;
  number: string;
  gender: Gender;
  email: string;
  availability: number;
  load: number;
  id: number;
};

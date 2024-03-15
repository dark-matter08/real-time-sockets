import { User } from '../user';

/**
 * @example
 * {
 *   "id": 1,
 *   "members": [1, 2],
 *   "name": "Premier Chat room",
 *   "dateCreated": "2024-03-13T09:50:45.523Z",
 * }
 */
export default interface Room {
  id?: number;
  members?: User[] | number[];
  name?: string;
  date_created?: Date;
  createdBy: User | number;
}

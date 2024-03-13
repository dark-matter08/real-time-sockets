import { Image } from '../image';
import { Room } from '../room';

/**
 * @example
 * {
 *   "sender": 1,
 *   "receiver": 2,
 *   "id": 5
 *   "content": "hello world",
 *   "timestamp": "2024-03-13T09:50:45.523Z",
 * 	 "media": ["3581f21f-c985-42e4-8bba-dc1e154eaaba", "3581f21f-c985-42e4-8bba-aoie154eaaba"]
 *   "isRead": false
 *   "isReceived": false
 *   "isDeleted": false
 * }
 */
export default interface Message {
  sender?: number;
  receiver: number;
  id: number;
  content: string;
  media?: string[] | Image[];
  timestamp: Date;
  is_read?: boolean;
  is_received?: boolean;
  is_deleted?: boolean;
  room?: Room | number;
}

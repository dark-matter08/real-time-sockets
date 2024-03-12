import { Image } from '../image';

/**
 * @example
 * {
 *   "id": 1,
 *   "name": "GasVisor Admin",
 *   "email": "admin@example.com",
 *   "password": "d1r3ctu5",
 *   "verification_code": "xxxx",
 * 	 "devices": ["device_1", "device_2"],
 *   "is_verified": true,
 *   "phone": "+2376500000000",
 *   "website": "ndelucien.com",
 * 	 "profilePicture": "3581f21f-c985-42e4-8bba-dc1e154eaaba"
 * }
 */
export default interface User {
  devices?: string[];
  email?: string;
  id?: number;
  is_verified?: boolean;
  language?: string;
  name?: string;
  password?: string;
  phone?: string;
  profilePicture?: Image;
  verification_code?: string;
  website?: string;
}

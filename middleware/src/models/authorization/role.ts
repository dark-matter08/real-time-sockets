import { User } from '../user';

export default interface Role {
  admin_access?: boolean;
  app_access?: boolean;
  description?: string;
  enforce_tfa?: boolean;
  icon?: string;
  id?: number;
  ip_access?: string;
  name?: string;
  users?: User[] | number[];
}

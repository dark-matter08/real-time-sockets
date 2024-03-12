import Role from './role';

export default interface Permission {
  action: string;
  collection: string;
  fields: string[];
  id?: number;
  permissions: any;
  presets: any;
  role?: Role | number;
  system?: boolean;
  validation: any;
}

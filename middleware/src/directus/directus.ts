import { authentication, createDirectus, realtime, rest } from '@directus/sdk';
import { exit } from 'process';
import { APPCONFIGS } from '../configs';
import { Image, Message, Permission, Role, User, Room } from '../models';

export interface Backend {
  user: User;
  message: Message;
  room: Room;
  directus_files: Image;
  directus_permissions: Permission;
  directus_roles: Role;

  // Sensor: Sensor;
  // SensorReading: SensorReading;
  // User: User;
  // UserPlan: UserPlan;
  // orderGroup: OrderGroup;
  // productOrder: ProductOrder;
}
console.log(APPCONFIGS.DIRECTUS.ENDPOINT);

export const client = createDirectus(APPCONFIGS.DIRECTUS.ENDPOINT as string)
  .with(rest())
  .with(authentication('json'))
  .with(realtime());

export async function directus_start() {
  let authenticated = false;

  while (!authenticated) {
    const email = APPCONFIGS.DIRECTUS.USER ?? '';
    const password = APPCONFIGS.DIRECTUS.PASSWORD ?? '';

    await client
      .login(email, password)
      .then(async () => {
        console.log('Authentication on Directus successful.');
        authenticated = true;
      })
      .catch((e) => {
        console.log('Authentication on Directus failed: ', e);
        exit(1);
      });
  }

  // await new Bootstrap().start();
}

export { createDirectus } from '@directus/sdk';

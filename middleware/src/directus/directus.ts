import { authentication, createDirectus, realtime, rest } from '@directus/sdk';
import { exit } from 'process';
import { APPCONFIGS } from '../configs';
import { Message, User, Room } from '../models';

export interface Backend {
  users: User[];
  message: Message[];
  room: Room[];
}

export type BackendKeys = keyof Backend;

export const client = createDirectus<Backend>(
  APPCONFIGS.DIRECTUS.ENDPOINT as string
)
  .with(rest())
  .with(authentication('json'))
  .with(realtime());

export async function directus_start() {
  let authenticated = false;

  // const result = await client.request(readItems('users'));
  // console.log(result);
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

export {
  createDirectus,
  readItem,
  readItems,
  DirectusClient,
  createItem,
  createItems,
  updateItem,
  updateItems,
  deleteItem,
  deleteItems,
  AuthenticationClient,
  RestClient,
  WebSocketClient,
} from '@directus/sdk';

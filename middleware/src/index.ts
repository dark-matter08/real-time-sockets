import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { APPCONFIGS } from './configs';
import routes from './routes';
import cors from 'cors';
import { directus_start } from './directus';
import morgan from 'morgan';
import { start_socket } from './utils/socket-service';
class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
      })
    );
    this.config();
    directus_start();
    start_socket(this.app);
  }

  public config(): void {
    this.app.set('port', APPCONFIGS.PORT);
    this.app.use(express.json());
    this.app.use(express.static('public'));
    this.app.use(morgan('tiny'));

    this.app.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(undefined, {
        swaggerOptions: {
          url: '../swagger.json',
        },
      })
      // swaggerUi.setup(swaggerDocument)
    );

    routes(this.app);
  }

  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('Server listening in port', APPCONFIGS.PORT);
    });
  }
}

const server = new Server();
server.start();

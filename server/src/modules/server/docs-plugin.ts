import * as Lout from 'lout';
import { resolve } from 'path';

export const docsPlugin = {
  name: 'docs',

  async register(server, options) {
    server.dependency(['inert', 'vision']);

    const basePath = '/docs';

    await server.register([
      {
        plugin: Lout,
        options: {
          endpoint: basePath
        }
      }
    ]);

    server.route({
      method: 'get',
      path: `${basePath}/css/style.css`,
      options: {
        auth: false,
        plugins: {
          lout: false
        }
      },
      async handler(req, h) {
        return h.file(
          resolve(__dirname, './../../../node_modules/lout/public/css/style.css'),
          {
            confine: false
          }
        );
      }
    });
  }
};

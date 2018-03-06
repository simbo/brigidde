export const routes = [

  // serve empty favicon
  {
    method: 'get',
    path: '/favicon.ico',
    async handler(req, h) {
      return h.response().code(200);
    }
  },

  // serve static files from /public
  {
    method: 'get',
    path: '/{any*}',
    handler: {
      directory: {
        path: process.env.APP_PUBLIC_PATH
      }
    }
  }

];

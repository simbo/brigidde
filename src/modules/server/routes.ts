export const routes = [

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

import { join } from 'path';
import * as Accept from 'accept';

export async function onPreResponse(req, h) {

  // if response is error
  if (req.response.isBoom) {
    const error = req.response;

    // if preferred mediatype is html
    const reqHtml = Accept.parseAll(req.headers).mediaTypes[0] === 'text/html';
    if (reqHtml) {

      // if 404, rewrite to app index
      if (error.output.statusCode === 404) {
        return h.file(
          join(process.env.APP_PUBLIC_PATH, 'index.html')
        );
      }

      // respond with error view
      return h.view('error', { error })
        .code(error.output.statusCode);

    }

  }

  return h.continue;

}

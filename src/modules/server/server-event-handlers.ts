import * as Accept from 'accept';

export async function onPreResponse(req, h) {

  // if response is error and preferred mediatype is html, respond with error view
  if (
    req.response.isBoom &&
    Accept.parseAll(req.headers).mediaTypes[0] === 'text/html'
  ) {
    const error = req.response;
    return h.view('error', { error })
      .code(req.response.output.statusCode);
  }
  return h.continue;

}

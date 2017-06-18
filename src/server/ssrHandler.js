import serialize from 'serialize-javascript';
import createServerRenderer from './ssr';

const renderAsync = createServerRenderer();

// TODO: Implement caching of renderAsync

/* eslint-disable prefer-template */
const getResponse = (DEV_ENV, assets, { html, asyncContext, store, helmet }) => (`
  <!DOCTYPE html>
  <html ${helmet.htmlAttributes.toString()}>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${helmet.base.toString()}

      ${helmet.meta.toString()}
      ${helmet.title.toString()}
      ${helmet.link.toString()}

      ${DEV_ENV ? '' : '<link rel="stylesheet" href="' + assets.app.css + '" />'}
      ${helmet.style.toString()}
    </head>

    <body ${helmet.bodyAttributes.toString()}>
      ${helmet.noscript.toString()}

      <script type="text/javascript">window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())};</script>
      <script type="text/javascript">window.ASYNC_COMPONENTS_STATE = ${serialize(asyncContext.getState())}</script>

      <div id="root">${html}</div>

      ${DEV_ENV ? '' : '<script>' + assets.text + '</script>'}
      ${DEV_ENV ? '' : '<script src="' + assets.vendor.js + '"></script>'}
      <script src="${DEV_ENV ? '/static/app.js' : assets.app.js}"></script>
      ${helmet.script.toString()}
    </body>
  </html>
`);
/* eslint-diable prefer-template */

const handlerFactory = (DEV_ENV, assets) => (req, res, next) => {
  renderAsync(req.url).then((context) => {
    const { url, missed } = context.routerContext;

    if (url) {
      return res.redirect(context.routerContext.url);
    }

    const html = getResponse(DEV_ENV, assets, context);

    return res.status(missed ? 404 : 200).send(html);
  }).catch(next);
};

export default handlerFactory;

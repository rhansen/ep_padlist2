/* global exports, require */

const eejs = require('ep_etherpad-lite/node/eejs');
const padManager = require('ep_etherpad-lite/node/db/PadManager');

exports.expressCreateServer = (hookName, {app}, cb) => {
  app.get('/list', async (req, res) => {
    const padIds = (await padManager.listAllPads()).padIDs.slice();
    padIds.sort((a, b) => {
     // match reasonable YYYY-MM-DD
     const d = /^20[12][0-9]-[01][0-9]-[0123][0-9]$/;
     const ad = d.test(a);
     const bd = d.test(b);
     if (ad || bd) {
       if (ad && bd) {
         // sort dates in reverse
         return b.localeCompare(a);
       } else {
         // dates come before non-dates
         return (+bd) - (+ad);
       }
     } else {
       // sort non-dates normally
       return a.localeCompare(b);
     }
    });
    res.send(eejs.require('ep_padlist2/templates/pads.html', {padIds}));
  });
  return cb();
};

exports.eejsBlock_indexWrapper = (hookName, context, cb) => {
  context.content = context.content +
      '<div style="text-align:center; margin-top:2em;">' +
      '<a href="list" data-l10n-id="ep_padlist2_index_all-pads">All Pads</a>' +
      '</div>';
  return cb();
};

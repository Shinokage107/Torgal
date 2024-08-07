const { Api, DefaultResponseProcessor, DefaultApiException } = require("rest-api-handler");

const ffxivCollect = new Api("https://ffxivcollect.com/api", [new DefaultResponseProcessor(DefaultApiException), onlyDataProcessor]);

const lodestonenews = new Api("https://na.lodestonenews.com", [new DefaultResponseProcessor(DefaultApiException), onlyDataProcessor]);

const hl2b = new Api("https://hltb-api.vercel.app/api", [new DefaultResponseProcessor(DefaultApiException), onlyDataProcessor]);

const xoembed = new Api("https://publish.twitter.com/oembed?url=", [new DefaultResponseProcessor(DefaultApiException)]);

function onlyDataProcessor(response) {
  return Promise.resolve(response.data);
}

module.exports.ffxivCollect = ffxivCollect;
module.exports.lodestonenews = lodestonenews;
module.exports.hl2b = hl2b;
module.exports.xoembed = xoembed;

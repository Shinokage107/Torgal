const { Api, DefaultResponseProcessor, DefaultApiException } = require("rest-api-handler");

const ffxivCollect = new Api("https://ffxivcollect.com/api", [new DefaultResponseProcessor(DefaultApiException), onlyDataProcessor]);

const lodestonenews = new Api("https://na.lodestonenews.com", [new DefaultResponseProcessor(DefaultApiException), onlyDataProcessor]);

function onlyDataProcessor(response) {
  return Promise.resolve(response.data);
}

module.exports.ffxivCollect = ffxivCollect;
module.exports.lodestonenews = lodestonenews;

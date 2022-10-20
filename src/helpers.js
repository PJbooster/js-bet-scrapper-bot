import request from "request";

import {
  SET_1_WINNER,
  SET_2_WINNER,
  SET_3_WINNER,
  SET_4_WINNER,
  SET_5_WINNER,
} from "../def.js";

const URL = "https://spoon.sts.pl";
const MATCH = "match";
const TAIL = "?lang=pl";

function matchUrl(id) {
  return `${URL}/${MATCH}/${id}/${TAIL}`;
}

function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode === 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  });
}

function sleep(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time);
  });
}

function getSetWinner(set) {
  switch (set) {
    case 1:
      return SET_1_WINNER;
    case 2:
      return SET_2_WINNER;
    case 3:
      return SET_3_WINNER;
    case 4:
      return SET_4_WINNER;
    case 5:
      return SET_5_WINNER;
  }
}

function areSame(previous, current) {
  try {
    let previousOdds = JSON.stringify([
      previous.t1mo.toString(),
      previous.t2mo.toString(),
      previous.t1so.toString(),
      previous.t2so.toString(),
    ]);
    let currentOdds = JSON.stringify([
      current.t1mo.toString(),
      current.t2mo.toString(),
      current.t1so.toString(),
      current.t2so.toString(),
    ]);

    return previousOdds === currentOdds;
  } catch (e) {
    return false;
  }
}

export { matchUrl, doRequest, getSetWinner, sleep, areSame };

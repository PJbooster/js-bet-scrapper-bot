import { matchUrl, doRequest, getSetWinner } from "./helpers.js";
import { MATCH_PENDING, OFFER, VOLLEYBALL, WINNER } from "../def.js";
import { save } from "./db.js";
import { logger } from "./logger.js";

/**
 * W każdym obiegu pobieramy wszyskie offerty,
 * wyciągamy siatkówke i ustawiamy dane do wysłania do bazy.
 */
export async function runAppTicker() {
  let volleyballBets = [];
  let json = await doRequest(OFFER);

  if (json.length === 0) {
    logger.error("Error, no data given from server.");
    return;
  }

  let filteredOffers = json.filter((off) => {
    return off.sc === VOLLEYBALL;
  });

  filteredOffers.forEach((offer) => {
    volleyballBets = [
      ...volleyballBets,
      {
        team1: offer.c1n,
        team2: offer.c2n,
        ig: offer.ig,
        state: offer.gpn,
        mainScore: offer.gso,
        detailScore: offer.gsp,
      },
    ];
  });

  /** Bierzemy tylko bety które sa aktywne, może być np "przerwany". */
  volleyballBets = volleyballBets.filter((f) => {
    return MATCH_PENDING.includes(f.state);
  });

  /**
   * Dostajemy sie do detaili każdego z betów,
   * aby to zrobić trzeba zapukać ponownie z polem "ig"
   */
  await volleyballBets.reduce(async (memo, i) => {
    await memo;
    try {
      let matchEvents = await doRequest(matchUrl(i.ig));
      let currentSetLabel = getSetWinner(parseInt(i.state));

      let t1so, t2so, t1mo, t2mo;

      matchEvents.opportunities.filter((b) => {
        if (b.otn === currentSetLabel) {
          let odds = b.odds.find((o) => o.otl === i.team1);
          t1so = odds.ov;

          odds = b.odds.find((o) => o.otl === i.team2);
          t2so = odds.ov;
        }
        if (b.otn === WINNER) {
          let odds = b.odds.find((o) => o.otl === i.team1);
          t1mo = odds.ov;

          odds = b.odds.find((o) => o.otl === i.team2);
          t2mo = odds.ov;
        }
      });

      if ((t1so > 1.1 && t1mo > 1.1) || (t2so > 1.1 && t1mo > 1.1)) {
        await save({
          ...i,
          t1so: t1so,
          t2so: t2so,
          t1mo: t1mo,
          t2mo: t2mo,
        });
      }
    } catch (e) {
      logger.error(
        `Error, cannot save data in external server. Details: ${e.message}`
      );
    }
  }, undefined);
}

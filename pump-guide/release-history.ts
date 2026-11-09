/**
 * The Petrol pump guide's release calendar, frozen: every page that has gone
 * live, on the day it went live. `PUMP_KEEP_THROUGH_DAY` is the last day these
 * entries cover. pump-guide/schedule.ts keeps each of them where it is, so
 * adding or moving other pages can never take a published page down or move it.
 *
 * Rewritten by `npm run guide -- freeze pump` (the daily routine runs it before
 * it adds pages); do not edit by hand.
 */
export const PUMP_PUBLISHED: ReadonlyArray<readonly [string, number]> = [["/petrol-pump/",1],["/hi/petrol-pump/",1],["/petrol-pump/disclaimer/",1],["/hi/petrol-pump/disclaimer/",1],["/petrol-pump/dealership/",1],["/hi/petrol-pump/dealership/",1],["/petrol-pump/dealership/who-can-apply/",1],["/hi/petrol-pump/dealership/who-can-apply/",1],["/petrol-pump/dealership/selection-process/",1],["/hi/petrol-pump/dealership/selection-process/",1],["/petrol-pump/money/",1],["/hi/petrol-pump/money/",1],["/petrol-pump/money/dealer-commission/",1],["/hi/petrol-pump/money/dealer-commission/",1],["/petrol-pump/licences/",1],["/hi/petrol-pump/licences/",1],["/petrol-pump/licences/peso-licence/",1],["/hi/petrol-pump/licences/peso-licence/",1],["/petrol-pump/licences/pollution-consent/",1],["/hi/petrol-pump/licences/pollution-consent/",1],["/petrol-pump/site/",1],["/hi/petrol-pump/site/",1],["/petrol-pump/safety/",1],["/hi/petrol-pump/safety/",1],["/petrol-pump/equipment/",1],["/hi/petrol-pump/equipment/",1],["/petrol-pump/equipment/legal-metrology-verification/",1],["/hi/petrol-pump/equipment/legal-metrology-verification/",1],["/petrol-pump/equipment/vapour-recovery/",1],["/hi/petrol-pump/equipment/vapour-recovery/",1],["/petrol-pump/equipment/underground-tanks/",1],["/hi/petrol-pump/equipment/underground-tanks/",1],["/petrol-pump/running/",1],["/hi/petrol-pump/running/",1],["/petrol-pump/running/gst/",1],["/hi/petrol-pump/running/gst/",1],["/petrol-pump/fuels/",1],["/hi/petrol-pump/fuels/",1],["/petrol-pump/fuels/cng-and-ev-charging/",1],["/hi/petrol-pump/fuels/cng-and-ev-charging/",1],["/petrol-pump/customers/",1],["/hi/petrol-pump/customers/",1]];

export const PUMP_KEEP_THROUGH_DAY = 1;

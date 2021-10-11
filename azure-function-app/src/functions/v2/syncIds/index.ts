import { ALNinjaRequestHandler } from "../ALNinjaRequestHandler";
import { ObjectConsumptions } from "../TypesV2";
import { ObjectConsumptionRequest } from "./types";
import { updateConsumptions } from "./update";

const syncIds = new ALNinjaRequestHandler<ObjectConsumptionRequest, ObjectConsumptions>(async (request) => {
    const { app } = request.bindings;
    const { appId, ids } = request.body;
    const merge = request.method === "PATCH";
    const result = await updateConsumptions(appId, ids, merge);
    const { _authorization, _ranges, ...consumptions } = result;
    request.markAsChanged(appId, result, merge ? "syncMerge" : "syncFull");
    return consumptions;
});
syncIds.validator.expect("body", {
    ids: "ObjectIDs"
});

export default syncIds.azureFunction;

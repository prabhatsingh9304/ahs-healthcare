import { getTravelTimeInSeconds } from "../../src/utils/travel-time-calc.util.js";
import { expect } from "chai";

describe("testing travel time calculation", () => {
    it("time between hauz khas and malviya nagar", async () => {
        expect(await getTravelTimeInSeconds("Hauz Khas, New Delhi", "Malviya Nagar, New Delhi")).to.equal(493);
    });
});
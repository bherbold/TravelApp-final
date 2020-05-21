const {travelTime} = require('../js/TimeChecker');

describe("less than 7 days", () => {

    it("should return false", () => {
        const d = new Date("2020-05-25")
        expect(travelTime(d)).toBe(false)
    })
})

describe("more than 7 days", () => {

    it("should return true", () => {
        const d = new Date("2020-05-30")
        expect(travelTime(d)).toBe(true)
    })
})

describe("equal 7 days", () => {

    it("should return false", () => {
        const d = new Date("2020-05-27")
        expect(travelTime(d)).toBe(false)
    })
})
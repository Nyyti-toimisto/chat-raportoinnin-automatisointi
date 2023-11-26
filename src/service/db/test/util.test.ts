import { epochToISO } from "../../util"




describe('Utilities tests', () => {


    it('Should convert ninchat seconds epoch to ISO time string', async () => {

        const secondsEpoch = [
            1700985093,
            975225093,
            1167695999,
            1700762492.779,
            1700784691.64
        ]

        const isoString = [
            '2023-11-26T07:51:33.000Z',
            '2000-11-26T07:51:33.000Z',
            '2007-01-01T23:59:59.000Z',
            '2023-11-23T18:01:32.779Z',
            '2023-11-24T00:11:31.640Z',
        ]

        for (let i = 0; i < secondsEpoch.length; i++) {
            expect(epochToISO(secondsEpoch[i])).toBe(isoString[i])
        }
    })



})
import { epochToISO } from "../../util"




describe('Utilities tests', () => {


    it('Should convert ninchat seconds epoch to ISO time string', async () => {

        const secondsEpoch = [
            1700985093,
            975225093,
            1167695999
        ]

        const isoString = [
            '2023-11-26T07:51:33.000Z',
            '2000-11-26T07:51:33.000Z',
            '2007-01-01T23:59:59.000Z'
        ]

        for (let i = 0; i < secondsEpoch.length; i++) {
            expect(epochToISO(secondsEpoch[i])).toBe(isoString[i])
        }
    })



})
describe('template spec', () => {
  const numWeeks = 10
  let tenWeeks = new Date()
  let toDay = new Date()
  toDay = `${toDay.getFullYear()}-${toDay.getMonth() + 1}-${toDay.getDate()}`
  tenWeeks.setDate(tenWeeks.getDate() - numWeeks * 7)
  tenWeeks = `${tenWeeks.getFullYear()}-${("0" + (tenWeeks.getMonth() + 1)).slice(-2)}-${("0" + tenWeeks.getDate()).slice(-2)}`

  let currencies = ['CADAUD', 'AUDCAD', 'CADUSD', 'USDCAD']

  currencies.forEach(function callback(currency) {
    it(`Conversion rate for ${currency} - Success`, () => {
      cy.request("GET", `/observations/FX${currency}?start_date=${tenWeeks}&end_date=${toDay}`).then((response) => {
        let observationsArray = response.body.observations
        let value = 0

        for (let index = 0; index < observationsArray.length; index++) {
          value += parseFloat(observationsArray[index][`FX${currency}`].v)
        }
        expect(response.status).to.eq(200)
        expect(observationsArray).length.to.be.greaterThan(1)
        expect(response.body).to.have.all.keys('terms', 'seriesDetail', 'observations')
        cy.log(`The average Forex conversion rate, ${currency}, for the recent 10 weeks is ${value / observationsArray.length}`)
      })
    })
  })

  it('Conversion rate for invalid currency', () => {
    cy.request({ url: `/observations/VO691346?start_date=${tenWeeks}&end_date=${toDay}`, failOnStatusCode: false }).then((response) => {
      console.log(response)
      expect(response.status).to.eq(404)
      expect(response.body).to.have.all.keys('docs', 'message')
      expect(response.body.message).to.be.eq('Series VO691346 not found.')

    })
  })
})
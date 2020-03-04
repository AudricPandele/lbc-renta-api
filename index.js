const express = require('express');
const app = express();
const hypo = require('./hypo');
const leboncoin = require('leboncoin-api');
const Offer = require('./models/Offer');

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send("Vous êtes à l'accueil");
});

app.get('/last-offers', async function(req, res) {
  const averageRent = [
    { city: 'Bordeaux', price: 13.3 },
    { city: 'Libourne', price: 8.4 },
    { city: 'Saint-André-de-Cubzac', price: 8.8 },
    { city: 'Cenon', price: 10.2 },
    { city: 'Carbon-Blanc', price: 9.5 },
    { city: 'Blanquefort', price: 10.8 },
    { city: 'Pessac', price: 11 },
    { city: "Villenave-d'Ornon", price: 10.4 },
    { city: 'Begle', price: 10.4 },
    { city: 'st-loubes', price: 8.4 },
    { city: 'Merignac', price: 11 },
    { city: 'Bassens', price: 9.6 },
    { city: 'Bruges', price: 10.1 },
    { city: 'Beautiran', price: 7.5 },
    { city: 'Cadaujac', price: 8.6 },
    { city: 'Latrresne maison', price: 8.7 },
    { city: 'St-Louis-de-Monferrand', price: 7.3 },
    { city: 'Ambarès-et-Lagrave', price: 9 }
  ];

  var search = new leboncoin.Search()
    .setPage(req.query.page)
    .setQuery('')
    .setFilter(leboncoin.FILTERS.ALL)
    .setCategory('ventes_immobilieres')
    .setRegion('aquitaine')
    .setDepartment('gironde')
    .setLocation([
      { zipcode: '33700' },
      { zipcode: '33450' },
      { zipcode: '33130' },
      { zipcode: '33140' },
      { zipcode: '33600' },
      { zipcode: '33290' },
      { zipcode: '33560' },
      { zipcode: '33150' },
      { zipcode: '33240' },
      { zipcode: '33500' },
      { zipcode: '33440' },
      { zipcode: '33360' },
      { zipcode: '33140' },
      { zipcode: '33640' },
      { zipcode: '33520' },
      { zipcode: '33530' }
    ])
    .addSearchExtra('price', { min: 50000, max: 270000 })
    .addSearchExtra('real_estate_type', ['1', '2', '5']);

  const lbcResult = await search.run().then(result => result);
  let offers = [];
  lbcResult.results.forEach(details => {
    let fees = details.price * 0.1;
    let loaning = details.price + fees;

    var K0 = loaning,
      n = 240,
      t = 0.001075,
      dec = 2;
    var monthly = hypo.VPM(K0, n, t, dec);

    let avgRent = (rentPrice = profit = rentability = rentabilityPretty = 0);
    averageRent.map(data => {
      if (data.city === details.location.city) {
        avgRent = data.price;
        rentPrice = avgRent * details.attributes.square;
        profit = rentPrice - monthly;
        rentability = (rentPrice * 12) / loaning;
        rentabilityPretty = (rentability * 100).toFixed(2);
      }
    });

    if (rentabilityPretty > 5) {
      let offer = new Offer(
        details.link,
        details.location.city,
        details.attributes.square,
        details.owner.type,
        details.owner.name,
        fees,
        details.price,
        loaning,
        monthly,
        avgRent,
        rentPrice.toFixed(2),
        profit.toFixed(2),
        rentabilityPretty,
        details.images[0]
      );
      offers.push(offer);
    }
  });

  res.send(offers);
});

app.listen(8080);

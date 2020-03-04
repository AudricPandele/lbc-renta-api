const offer = function Offer(
  link,
  city,
  square,
  type,
  owner,
  fees,
  price,
  loaning,
  monthly,
  avgRent,
  rentPrice,
  profit,
  rentabilityPretty,
  image
) {
  this.link = link;
  this.city = city;
  this.square = square;
  this.type = type;
  this.owner = owner;
  this.fees = fees;
  this.price = price;
  this.loaning = loaning;
  this.monthly = monthly;
  this.avgRent = avgRent;
  this.rentPrice = rentPrice;
  this.profit = profit;
  this.rentabilityPretty = rentabilityPretty;
  this.image = image;
};

module.exports = offer;

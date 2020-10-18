const { OrderBook } = require('./OrderBook');
const { Order } = require('./Order');

class Exchange {

  orderBook;
  constructor() {
    this.orderBook = new OrderBook();
  }

  async sync(fileName) {
    this.orderBook = await OrderBook.load(fileName);
  }

  buy(quantity, price) {
    this.orderBook.trade(new Order({ quantity, price, isBuyOrder: true }));
  }

  sell(quantity, price) {
    this.orderBook.trade(new Order({ quantity, price, isBuyOrder: false }));
  }

  getQuantityAtPrice(price) {
    return this.orderBook.getQuantityAtPrice(price);
  }

  getOrder(id) {
    return this.orderBook.orders.find(o => {
        return o.id == id;
    });
  }
}

module.exports = Exchange;


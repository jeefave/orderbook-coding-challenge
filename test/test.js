import test from 'ava';
import Exchange from '../lib/index';
import { Order } from '../lib/Order';
// import { OrderBook } from '../lib/OrderBook';

test('getOrderByIdShouldReturnsCorrectOrder', async t => {
    // arrange
    var exchange = new Exchange();
    await exchange.orderBook.orders.push(new Order({id: 'e07e3d64-2942-4d4d-b64c-dd517d1ca017', quantity: 51, executedQuantity: 50}));

    // act
    var order = exchange.getOrder('e07e3d64-2942-4d4d-b64c-dd517d1ca017');
    var order2 = exchange.getOrder('test2');

    // assert
    t.is(order.quantity, 51);
    t.is(order.executedQuantity, 50);
    t.is(order2, undefined);
});

test('getQuantityAtPriceShouldReturnsCount', t => {
    // arrange
    var exchange = new Exchange();
    exchange.sell(40, 4);
    exchange.sell(10, 4); // 50@4
    exchange.sell(10, 6); // 10@6
    exchange.buy(10, 4);  // 40@4
    exchange.buy(10, 5);  // 30@4
    exchange.buy(10, 7);  // 0@6
    exchange.buy(3, 4);   // 27@4

    // act
    var quantityAtPrice4 = exchange.getQuantityAtPrice('4');
    var quantityAtPrice5 = exchange.getQuantityAtPrice('5');
    var quantityAtPrice6 = exchange.getQuantityAtPrice('6');

    // assert
    t.is(quantityAtPrice4, 17);
    t.is(quantityAtPrice5, 0);
    t.is(quantityAtPrice6, 10);
});


test('sellOrderShouldAddToOrderBook', t => {
    // arrange
    var exchange = new Exchange();

    // act
    exchange.sell(40, 4);
    exchange.sell(10, 4);
    exchange.sell(10, 6);

    // assert
    t.is(exchange.orderBook.orders.length, 3);
});

test('buyOrderShouldAddToOrderBook', t => {
    // arrange
    var exchange = new Exchange();

    // act
    exchange.buy(40, 4);
    exchange.buy(10, 4);
    exchange.buy(10, 6);

    // assert
    t.is(exchange.orderBook.orders.length, 3);
});

test('syncShouldLoadOrderBook', async t => {
    // arrange
    var exchange = new Exchange();
    // act
    await exchange.sync('./test/order-book-sample.json');

    // assert
    t.is(exchange.orderBook.orders.length, 16);
});

test('buyAndSellOrdersShouldTrade', t => {
    // arrange
    var exchange = new Exchange();

    // act
    exchange.buy(10, 2);
    exchange.buy(5, 3);
    exchange.sell(50, 8);
    exchange.sell(5, 12);
    exchange.buy(51, 9); // trade

    // assert
    t.is(exchange.orderBook.orders[4].quantity, 51);
    t.is(exchange.orderBook.orders[4].executedQuantity, 50);
});


test('buyAndSellOrdersShouldTradeInOrder', t => {
    // arrange
    var exchange = new Exchange();

    // act
    exchange.buy(10, 2);
    exchange.buy(5, 3); 
    exchange.sell(50, 8);
    exchange.sell(5, 12);
    exchange.buy(51, 9);
    exchange.sell(10, 12);
    exchange.sell(1, 12);
    exchange.sell(2, 12); 
    exchange.buy(15, 13); 

    exchange.sell(40, 4);
    exchange.sell(10, 4);
    exchange.sell(10, 6);
    exchange.buy(10, 4);
    exchange.buy(10, 5);
    exchange.buy(10, 7);
    exchange.buy(3, 4);  

    let quantityAt12 = exchange.getQuantityAtPrice(12);
    let quantityAt13 = exchange.getQuantityAtPrice(13);
    let quantityAt4 = exchange.getQuantityAtPrice(4);

    //OrderBook.save('./test/order-book-sample.json', exchange.orderBook)

    // assert
    t.is(exchange.orderBook.orders[4].quantity, 51);
    t.is(quantityAt12, 3);
    t.is(quantityAt13, 0);
    t.is(quantityAt4, 16);
});
let cartquantity = 0;

function plus1 () {
  cartquantity = cartquantity + 1;
  console.log(`cartquantity: ${cartquantity}`);
}

function plus2 () {
  cartquantity = cartquantity + 2;
  console.log(`cartquantity: ${cartquantity}`);
}

function plus5 () {
  cartquantity = cartquantity + 5;
  console.log(`cartquantity: ${cartquantity}`);
}

function cart () {
  document.querySelector('.QuantityCart')
    .innerHTML = `Cart: ${cartquantity}`;
}
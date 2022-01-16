import { select, classNames, templates, settings } from '../settings.js';
import { utils } from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();

    // console.log('new Cart', thisCart);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    // console.log(thisCart.dom.wrapper);

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.inputAddress = thisCart.dom.wrapper.querySelector(select.cart.address);
    thisCart.dom.inputPhone = thisCart.dom.wrapper.querySelector(select.cart.phone);
  }

  initActions(){
    const thisCart = this;
    // console.log(thisCart);

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();

      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;
    // console.log('adding product', menuProduct);
      
    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);
    // console.log(generatedHTML);

    /* create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    // console.log(generatedDOM);

    /* find cart container */
    const cart = thisCart.dom.productList;

    /* add element to cart */
    cart.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    // console.log('thisCart.products', thisCart.products);

    thisCart.update();
  }

  update(){
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    // console.log(thisCart.products);
      
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    
    for(let product of thisCart.products){
      console.log(product);
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.amount * product.priceSingle;
    }
    console.log('liczba sztuk', thisCart.totalNumber);
    console.log('cena', thisCart.subtotalPrice);
       
    if(thisCart.totalNumber !== 0){
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
      console.log('cena całkowita', thisCart.totalPrice);
    }else{
      thisCart.totalPrice = 0;
      thisCart.dom.deliveryFee.innerHTML = 0;
      console.log('cena całkowita', thisCart.totalPrice);
    }
      
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;

    for(let total of thisCart.dom.totalPrice){
      total.innerHTML = thisCart.totalPrice;
    }
  }

  remove(cartProduct){
    const thisCart = this;
    console.log(cartProduct);
    console.log(thisCart);

    /* find index of cartProduct */
    const arrayIndex = thisCart.products.indexOf(cartProduct);
    console.log(arrayIndex);

    /* remove cartProduct from array */
    thisCart.products.splice(arrayIndex, 1);
    console.log(thisCart.products);

    /* remove DOM element from HTML */
    cartProduct.dom.wrapper.remove();

    thisCart.update();
  }

  sendOrder(){
    const thisCart = this;
    console.log(thisCart.products);

    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {};
      
    payload.address = thisCart.dom.inputAddress.value;
    payload.phone = thisCart.dom.inputPhone.value;
    payload.totalPrice = thisCart.dom.totalPrice[0].textContent;
    payload.subtotalPrice = thisCart.dom.subtotalPrice.textContent;
    payload.totalNumber = thisCart.dom.totalNumber.textContent;
    payload.deliveryFee = thisCart.dom.deliveryFee.textContent;
    payload.products = [];

    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
      
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
      
    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
}

export default Cart;
import { select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class CartProduct{
  constructor(menuProduct, element){
    const thisCartProduct = this;

    thisCartProduct.id = menuProduct.id;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.params = menuProduct.params;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;

    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
      

    console.log(thisCartProduct);
    // console.log(thisCartProduct.amount);
  }

  getElements(element){
    const thisCartProduct = this;

    thisCartProduct.dom = {};

    thisCartProduct.dom.wrapper = element;

    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
  }

  initAmountWidget(){
    const thisCartProduct = this;  
    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
  
    thisCartProduct.amountWidget.value = thisCartProduct.amount;
    thisCartProduct.amountWidget.input.value = thisCartProduct.amount;
      
    thisCartProduct.dom.amountWidget.addEventListener('updated', function(){
      const price = thisCartProduct.amountWidget.value * thisCartProduct.priceSingle;
      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      // console.log(thisCartProduct.amountWidget.value);
      // console.log(price);
      // console.log(thisCartProduct.dom.price);
      thisCartProduct.dom.price.innerHTML = price;
    });
  }

  remove(){
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }

  initActions(){
    const thisCartProduct = this;

    thisCartProduct.dom.edit.addEventListener('click', function(event){
      event.preventDefault();
    });

    thisCartProduct.dom.remove.addEventListener('click', function(event){
      event.preventDefault();

      thisCartProduct.remove();
      console.log('remove CartProduct');
    });
  }

  getData(){
    const thisCartProduct = this;

    const cartProductSummary = {};

    cartProductSummary.id = thisCartProduct.id;
    cartProductSummary.amount = thisCartProduct.amount;
    cartProductSummary.price = thisCartProduct.price;
    cartProductSummary.priceSingle = thisCartProduct.priceSingle;
    cartProductSummary.name = thisCartProduct.name;
    cartProductSummary.params = thisCartProduct.params;

    return cartProductSummary;
  }
}

export default CartProduct;
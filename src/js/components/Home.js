import { templates, select } from '../settings.js';

class Home{
  constructor(wrapperElement){
    const thisHome = this;

    thisHome.render(wrapperElement);
    thisHome.initWidget();
  }

  render(wrapperElement){
    const thisHome = this;

    /* generate HTML based on template */
    const generatedHTML = templates.homePage();
    // console.log(generatedHTML);

    thisHome.dom = {};

    thisHome.dom.wrapper = wrapperElement;
    thisHome.dom.wrapper.innerHTML = generatedHTML;  
    
    thisHome.dom.widget = thisHome.dom.wrapper.querySelector(select.widgets.carousel);
    console.log(thisHome);
  }

  initWidget(){
    const thisHome = this;
    
    // eslint-disable-next-line no-undef
    thisHome.carousel = new Flickity(thisHome.dom.widget, {
      autoPlay: 3000,
      imagesLoaded: true,
      resize: false
    });
  }
}

export default Home;
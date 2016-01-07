var doc = document.currentScript.ownerDocument;

var Header = Object.create(HTMLElement.prototype, {
  createdCallback: { 
    value: function() { 
        this.appendChild(doc.querySelector(".header"));
    }
  }
});

document.registerElement('header-component', {
  prototype: Header
});
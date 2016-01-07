var Header = Object.create(HTMLElement.prototype, {
  createdCallback: { 
    value: function() { 
    	var template = document.getElementsByClassName("header")[0]; 
        var clone = document.importNode(template.content, true);
        this.appendChild(clone);
    }
  }
});

document.registerElement('header-component', {
  prototype: Header
});
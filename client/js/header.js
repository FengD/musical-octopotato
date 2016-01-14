(function(){
	var doc = document.currentScript.ownerDocument;

	var Header = Object.create(HTMLElement.prototype, {
	  createdCallback: { 
	    value: function() { 
	    	console.log(document._currentScript);
	    	var t = doc.querySelector("#header");
	    	var clone =  doc.importNode(t.content, true);    	
	        this.createShadowRoot().appendChild(clone);

	    }
	  }
	});

	document.registerElement('header-component', {
	  prototype: Header
	});
})();
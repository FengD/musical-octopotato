(function(){
	var doc = document.currentScript.ownerDocument;

	var Login = Object.create(HTMLElement.prototype, {
	  createdCallback: { 
	    value: function() { 
	    	var t = doc.querySelector("#login");
	    	var clone =  doc.importNode(t.content, true);    	
	        this.createShadowRoot().appendChild(clone);

	    }
	  }
	});

	document.registerElement('login-component', {
	  prototype: Login
	});

	 
})();




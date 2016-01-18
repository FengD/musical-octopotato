(function () {
    var doc = document.currentScript.ownerDocument;

    var TrackItem = Object.create(HTMLElement.prototype, {
        createdCallback: {
            value: function () {
                var t = doc.querySelector("#item");
                var clone = doc.importNode(t.content, true);
                this.createShadowRoot().appendChild(clone);
            }
        }
    });

    document.registerElement('trackItem-component', {
        prototype: TrackItem
    });
})();
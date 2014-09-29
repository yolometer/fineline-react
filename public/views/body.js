var hello = React.createClass({
	  render: function() {
  	  return React.DOM.svg({
    		xmlns: "http://www.w3.org/2000/svg",
    		width: window.innerWidth,
	    	height: window.innerHeight,
  	  	version: "1.1"
    	}, null, [React.DOM.rect({x: 0, y: 0, width: window.innerWidth, height: 100, fill: "red"})]);
  	}
});



React.renderComponent(hello(), document.body);

window.onresize = function (){
	React.renderComponent(hello(), document.body);
}
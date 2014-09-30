'use strict';
var catHeight = 80;
var catDefaultColor = "#e6e6e6";

var taskHeight = 64;
var taskDefaultColor = "#f2f2f2";

var cats = [
  {title: "Development", tasks: [
    {
      title: "Create and document data and API structures",
      color: "#bf7294",
      timespans: []
    },
    {
      title: "Set up major API routes",
      color: "#a7bf72",
      timespans: []
    },
    {
      title: "Build services to synchronize the data",
      color: "#72bfaf",
      timespans: []
    },
    {
      title: "Build services to format the data",
      timespans: []
    }
  ]},
  {title: "Design", tasks: [
    {
      title: "Create first-run visual mockups of the project view",
      color: "#bf8372",
      timespans: []
    },
    {
      title: "Finalize design for MVP, and implement with React",
      timespans: []
    },
    {
      title: "Ensure consistency after interactivity is added to the page",
      timespans: []
    },
  ]},
  {title: "Deployment", tasks: [
    {
      title: "Deploy testing API endpoints to DigitalOcean Droplet",
      color: "#8172bf",
      timespans: []
    },
    {
      title: "Set up DNS records for API, site, and mailer",
      timespans: []
    },
    {
      title: "Test stability in production environment",
      timespans: []
    }
  ]}
];


var TaskList = React.createClass({
  renderList: function() {
    var taskList = new Array();
    var currentY = 0;
    for (var cat in cats) {
      taskList.push(React.DOM.rect({x: 0, y: currentY, width: window.innerWidth, height: catHeight, fill: catDefaultColor}));
      currentY += catHeight;
      for (var task in cats[cat].tasks){
        taskList.push(React.DOM.rect({x: 0, y: currentY, width: window.innerWidth, height: taskHeight, fill: cats[cat].tasks[task].color || taskDefaultColor}));
        currentY += taskHeight;
      }
    }
    return {taskList: taskList, currentY: currentY};
  },
	render: function() {
    var list = this.renderList();
  	return React.DOM.svg({
    	xmlns: "http://www.w3.org/2000/svg",
    	width: window.innerWidth,
	    height: list.currentY,
  	  version: "1.1"
    }, null, list.taskList);
  }
});



React.renderComponent(TaskList(), document.body);

window.onresize = function (){
	React.renderComponent(TaskList(), document.body);
}

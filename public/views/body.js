'use strict';
var catHeight = 80;
var catDefaultColor = "#e6e6e6";

var taskHeight = 64;
var taskDefaultColor = "#f2f2f2";

var cats = [
  {title: "Development", expanded: true, tasks: [
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
  {title: "Design", expanded: true, tasks: [
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
  {title: "Deployment", expanded: false, tasks: [
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

function toggleCatExpanded(index){
  cats[index].expanded = !cats[index].expanded;
  renderBody();
}

var TaskListTask = React.createClass({
  displayName: "TaskListTask",
  renderList: function() {
    var displayList = new Array();
    displayList.push(React.DOM.rect({x: 0, y: this.props.currentY, width: window.innerWidth, height: taskHeight, fill: this.props.fill || taskDefaultColor}));
    return displayList;
  },
  render: function() {
    return React.DOM.g({}, null, this.renderList());
  }
});

var TaskListCategory = React.createClass({
  displayName: "TaskListCategory",
  toggleExpanded: function(){
    toggleCatExpanded(this.props.index);
  },
  renderList: function() {
    var displayList = new Array();
    this.props.currentY = this.props.currentY || 0;

    displayList.push(React.DOM.rect({x: 0, y: this.props.currentY, width: window.innerWidth, height: catHeight, fill: catDefaultColor, onClick: this.toggleExpanded}));
    this.props.currentY += catHeight;
    if(this.props.cat.expanded == false)
      return {displayList: displayList, currentY: this.props.currentY};
    for (var task in this.props.cat.tasks){
      displayList.push(TaskListTask({currentY: this.props.currentY, fill: this.props.cat.tasks[task].color}));
      this.props.currentY += taskHeight;
    }
    return {displayList: displayList, currentY: this.props.currentY};
  },
  render: function() {
    var list = this.renderList();
    return React.DOM.g({}, null, list.displayList);
 }
});

var TaskList = React.createClass({
  displayName: "TaskList",
  renderList: function() {
    var displayList = new Array();
    var currentY = 0;
    for (var cat in this.props.cats) {
      displayList.push(TaskListCategory({currentY: currentY, cat: this.props.cats[cat], index: cat}));
      currentY += catHeight + (this.props.cats[cat].expanded?this.props.cats[cat].tasks.length * taskHeight: 0);
    }
    return {displayList: displayList, currentY: currentY};
  },
  render: function() {
    var list = this.renderList();
    return React.DOM.svg({
      xmlns: "http://www.w3.org/2000/svg",
      width: window.innerWidth,
      height: list.currentY,
      version: "1.1"
    }, null, list.displayList);
  }
});

function renderBody() {
  React.renderComponent(TaskList({cats: cats}), document.body);
}


window.onresize = function (){
	renderBody();
}

renderBody();

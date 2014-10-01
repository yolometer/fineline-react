'use strict';
var catHeight = 80;
var catDefaultColor = "#e6e6e6";
var catDefaultTextColor = "#333333";


var taskHeight = 64;
var taskDefaultColor = "#f2f2f2";

var cats = [
  {title: "Development", expanded: true, tasks: [
    {
      title: "Create and document data and API \nstructures",
      color: "#bf7294",
      timespans: []
    },
    {
      title: "Set up major API routes",
      color: "#a7bf72",
      timespans: []
    },
    {
      title: "Build services to synchronize the \ndata",
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
      title: "Create first-run visual mockups of \nthe project view",
      color: "#bf8372",
      timespans: []
    },
    {
      title: "Finalize design for MVP, and \nimplement with React",
      timespans: []
    },
    {
      title: "Ensure consistency after \ninteractivity is added to the page",
      timespans: []
    },
  ]},
  {title: "Deployment", expanded: false, tasks: [
    {
      title: "Deploy testing API endpoints to \nDigitalOcean Droplet",
      color: "#8172bf",
      timespans: []
    },
    {
      title: "Set up DNS records for API, site, \nand mailer",
      timespans: []
    },
    {
      title: "Test stability in production \nenvironment",
      timespans: []
    }
  ]}
];

function toggleCatExpanded(index){
  cats[index].expanded = !cats[index].expanded;
  renderBody();
}

var TaskListTaskTitle = React.createClass({
  displayName: "TaskListTaskTitle",
  renderList: function() {
    var displayList = new Array();
    var localY = this.props.currentY + 28;
    this.props.title.split('\n').forEach(function(span, i) {
      displayList.push(React.DOM.tspan({x: 40, y: localY + (i * 22)}, span));
    });
    return displayList;
  },
  render: function() {
    return React.DOM.text({fontSize: '18px', fill: (this.props.color)? 'white': catDefaultTextColor, fontFamily: 'Cantarell, Sans', lineHeight: '125%', width: 280, height: 44, x: 40, y: this.props.currentY + 28}, null, this.renderList());
  }
});

var TaskListTask = React.createClass({
  displayName: "TaskListTask",
  renderList: function() {
    var displayList = new Array();

    // Task line base
    displayList.push(React.DOM.rect({x: 0, y: this.props.currentY, width: window.innerWidth, height: taskHeight, fill: this.props.task.color || taskDefaultColor}));

    // Title area shade
    if(this.props.task.color)
      displayList.push(React.DOM.rect({x: 0, y: this.props.currentY, width: 396, height: taskHeight, opacity: 0.15, fill: "black"}));

    // Title
    displayList.push(TaskListTaskTitle({title: this.props.task.title, currentY: this.props.currentY, color: this.props.task.color}));

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
  addTask: function() {
    console.log("Doh, TaskListCategory's addTask function hasn't been implemented.");
  },
  renderList: function() {
    var displayList = new Array();
    this.props.currentY = this.props.currentY || 0;

    // Category line
    displayList.push(React.DOM.rect({x: 0, y: this.props.currentY, width: window.innerWidth, height: catHeight, fill: catDefaultColor, onClick: this.toggleExpanded}));

    // Category heading
    displayList.push(React.DOM.text({x: 40, y: this.props.currentY + 56, "fontSize": '48px', fill: catDefaultTextColor, fontFamily: 'Cantarell, Sans'}, this.props.cat.title));

    // Expansion indicator
    if(this.props.cat.expanded == true)
      displayList.push(React.DOM.path({d: 'm 28,' + (this.props.currentY + 36) + ' -16,0 8,12 z', fill: catDefaultTextColor, onClick: this.toggleExpanded}));
    if(this.props.cat.expanded == false)
      displayList.push(React.DOM.path({d: 'm 14,' + (this.props.currentY + 34) + ' 0,16 12,-8 z', fill: catDefaultTextColor, onClick: this.toggleExpanded}));

    // Plus button
    displayList.push(React.DOM.rect({x: 358, y: this.props.currentY + 24, width: 4, height: 32, fill: catDefaultTextColor}));
    displayList.push(React.DOM.rect({x: 344, y: this.props.currentY + 38, width: 32, height: 4, fill: catDefaultTextColor}));
    displayList.push(React.DOM.rect({x: 344, y: this.props.currentY + 24, width: 32, height: 32, opacity: '0', fill: 'black', onClick: this.addTask}));
    this.props.currentY += catHeight;
    if(this.props.cat.expanded == false)
      return {displayList: displayList, currentY: this.props.currentY};
    for (var task in this.props.cat.tasks){
      displayList.push(TaskListTask({currentY: this.props.currentY, task: this.props.cat.tasks[task]}));
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
    displayList.push(React.DOM.rect({x: 396, y: 0, width: 2, height: currentY, opacity: 0.4, fill: "black"}));
    displayList.push(React.DOM.path({d: 'm ' + (window.innerWidth - 206) + ',0 0,' + currentY, opacity: 0.4, "strokeOpacity": 1, "stroke" : "black", "strokeWidth": 2, strokeDasharray: "2, 8"}));
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

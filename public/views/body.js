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
      started: true,
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
    }
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
  render: function() {
    var displayList = new Array();
    var localY = this.props.y + 28;
    this.props.title.split('\n').forEach(function(span, i) {
      displayList.push(React.DOM.tspan({x: 40, y: localY + (i * 22)}, span));
    });
    return React.DOM.text({fontSize: '18px', fill: (this.props.color)? 'white': catDefaultTextColor, fontFamily: 'Cantarell, Sans', lineHeight: '125%', width: 280, height: 44, x: 40, y: this.props.y + 28}, null, displayList);
  }
});


var PlayPauseButton = React.createClass({
  displayName: "PlayPauseButton",
  render: function () {
    var displayList = [];
    if(!this.props.started) {
      displayList.push(React.DOM.path({d: 'm ' + (this.props.x + 15) + ',' + (this.props.y + 12) + ' 0,24 18,-12 z', fill: this.props.fill}));
    }
    if(this.props.started) {
      displayList.push(React.DOM.rect({x: (this.props.x + 13), y: (this.props.y + 12), width: 8, height: 24, fill: this.props.fill}));
      displayList.push(React.DOM.rect({x: (this.props.x + 27), y: (this.props.y + 12), width: 8, height: 24, fill: this.props.fill}));
    }
    displayList.push(React.DOM.rect({x: this.props.x, y: this.props.y, width: 48, height: 48, fill: 'black', opacity: 0, onClick: this.props.onClick}));
    return React.DOM.g({}, null, displayList);
  }
});

function togglePlayPause(catIndex, taskIndex) {
  if(!cats[catIndex].tasks[taskIndex].started) {
    cats[catIndex].tasks[taskIndex].started = true;
    if(!cats[catIndex].tasks[taskIndex].color) {
      cats[catIndex].tasks[taskIndex].color = Please.make_color();
    }
    renderBody();
    return;
  }
  if(cats[catIndex].tasks[taskIndex].started) {
    cats[catIndex].tasks[taskIndex].started = false;
    renderBody();
    return;
  }
}

var TaskListTask = React.createClass({
  displayName: "TaskListTask",
  playPause: function() {
    var thisFunction = {parent: "TaskListTask", name: "playPause"};
    console.log("Doh, " + thisFunction.parent + "'s " + thisFunction.name + " function is not yet implemented.");
    togglePlayPause(this.props.catIndex, this.props.taskIndex);
  },
  render: function() {
    var displayList = new Array();

    // Task line base
    displayList.push(React.DOM.rect({x: 0, y: this.props.y, width: window.innerWidth, height: taskHeight, fill: this.props.task.color || taskDefaultColor}));

    // Title area shade
    if(this.props.task.color) {
      displayList.push(React.DOM.rect({x: 0, y: this.props.y, width: 396, height: taskHeight, opacity: 0.15, fill: "black"}));
    }
    // Title
    displayList.push(TaskListTaskTitle({title: this.props.task.title, y: this.props.y, color: this.props.task.color}));

    // Play/Pause button
    var playPauseColor = this.props.task.color? 'white': catDefaultTextColor;
    displayList.push(PlayPauseButton({x: 337, y: (this.props.y + 8), fill: playPauseColor, onClick: this.playPause, started: this.props.task.started}));

    return React.DOM.g({}, null, displayList);
  }
});

var TwoWayLabel = React.createClass({
  displayName: "TwoWayLabel",
  render: function () {
    var displayList = [];

    displayList.push(React.DOM.tspan({x: this.props.x, y: this.props.y, fill: this.props.fill, fontSize: this.props.fontSize, fontStyle: this.props.fontStyle, fontFamily: this.props.fontFamily, textAnchor: 'end'}, this.props.leftText));
    displayList.push(React.DOM.tspan({x: this.props.x, y: this.props.y, fill: this.props.fill, fontSize: this.props.fontSize, fontStyle: this.props.fontStyle, fontFamily: this.props.fontFamily}, ' ' + this.props.rightText));

    return React.DOM.text({}, null, displayList);
  }
});

var PlusButton = React.createClass({
  displayName: "PlusButton",
  render: function () {
    var displayList = [];
    displayList.push(React.DOM.rect({x: (this.props.x + 30), y: this.props.y + 16, width: 4, height: 32, fill: this.props.fill}));
    displayList.push(React.DOM.rect({x: (this.props.x + 16), y: this.props.y + 30, width: 32, height: 4, fill: this.props.fill}));
    displayList.push(React.DOM.rect({x: this.props.x, y: this.props.y, width: 64, height: 64, opacity: 0, fill: 'black', onClick: this.props.onClick}));

    return React.DOM.g({}, null, displayList);
  }
});

function addTask(index) {
  var newTitle = window.prompt("Enter a title for your new task.");
  if(newTitle && newTitle.length && newTitle.length > 0) {
    cats[index].tasks.push({title: newTitle});
    renderBody();
  }
}

var TaskListCategory = React.createClass({
  displayName: "TaskListCategory",
  toggleExpanded: function(){
    toggleCatExpanded(this.props.index);
  },
  addTask: function() {
    var thisFunction = {parent: "TaskListCategory", name: "addTask"};
    console.log("Doh, " + thisFunction.parent + "'s " + thisFunction.name + " function is not yet implemented.");
    addTask(this.props.index);
  },
  render: function() {
    var displayList = new Array();
    this.props.y = this.props.y || 0;

    // Category line
    displayList.push(React.DOM.rect({x: 0, y: this.props.y, width: window.innerWidth, height: catHeight, fill: catDefaultColor, onClick: this.toggleExpanded}));

    // Category heading
    displayList.push(React.DOM.text({x: 40, y: this.props.y + 56, "fontSize": '48px', fill: catDefaultTextColor, fontFamily: 'Cantarell, Sans'}, this.props.cat.title));

    // Expansion indicator
    if(this.props.cat.expanded == true)
      displayList.push(React.DOM.path({d: 'm 28,' + (this.props.y + 36) + ' -16,0 8,12 z', fill: catDefaultTextColor, onClick: this.toggleExpanded}));
    if(this.props.cat.expanded == false)
      displayList.push(React.DOM.path({d: 'm 14,' + (this.props.y + 34) + ' 0,16 12,-8 z', fill: catDefaultTextColor, onClick: this.toggleExpanded}));

    // Plus button
    displayList.push(PlusButton({x: 328, y: this.props.y + 8, onClick: this.addTask, fill: catDefaultTextColor}));

    // TOTAL label
    displayList.push(TwoWayLabel({x: window.innerWidth - 122, y: this.props.y + 56, fill: catDefaultTextColor, fontSize: 32, fontStyle: "Italic", fontFamily: "Interstate ExtraLight", leftText: "3:00", rightText: "TOTAL"}));

    this.props.y += catHeight;

    if(this.props.cat.expanded != false)
    for (var task in this.props.cat.tasks){
      displayList.push(TaskListTask({y: this.props.y, task: this.props.cat.tasks[task], taskIndex: task, catIndex: this.props.index}));
      this.props.y += taskHeight;
    }

    return React.DOM.g({}, null, displayList);
  }
});

var TaskList = React.createClass({
  displayName: "TaskList",
  render: function() {
    var displayList = new Array();
    var currentY = 0;
    for (var cat in this.props.cats) {
      displayList.push(TaskListCategory({y: currentY, cat: this.props.cats[cat], index: cat}));
      currentY += catHeight + (this.props.cats[cat].expanded?this.props.cats[cat].tasks.length * taskHeight: 0);
    }

    if(currentY < window.innerHeight)
      currentY = window.innerHeight;

    // Task list separator line
    displayList.push(React.DOM.rect({x: 396, y: 0, width: 2, height: currentY, opacity: 0.4, fill: "black"}));

    // “NOW” line
    displayList.push(React.DOM.path({d: 'm ' + (window.innerWidth - 206) + ',0 0,' + currentY, opacity: 0.4, "strokeOpacity": 1, "stroke" : "black", "strokeWidth": 2, strokeDasharray: "2, 8"}));
    return React.DOM.svg({
      xmlns: "http://www.w3.org/2000/svg",
      width: window.innerWidth,
      height: currentY,
      version: "1.1"
    }, null, displayList);
  }
});

function renderBody() {
  React.renderComponent(TaskList({cats: cats}), document.body);
}


window.onresize = function (){
  renderBody();
};

renderBody();

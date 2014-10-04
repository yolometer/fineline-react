'use strict';
var catHeight = 80;
var catDefaultColor = "#e6e6e6";
var catDefaultTextColor = "#333333";

var nowLineOffset = 120;
var taskListWidth = 396;


var testUid = 1;


var pixelsPerMinute = 15;
var timescale = pixelsPerMinute / 60;


var taskHeight = 64;
var taskDefaultColor = "#f2f2f2";
var now = Math.floor(Date.now() / 1000);


var cats = [
  {title: "Development", expanded: true, tasks: [
    {
      title: "Create and document data and API \nstructures",
      color: "#bf7294",
      timespans: [[1, now - (45 * 60), (now - (45 * 60)) + (20 * 60)]]
    },
    {
      title: "Set up major API routes",
      color: "#a7bf72",
      timespans: [[1, now - (15 * 60)]]
    },
    {
      title: "Build services to synchronize the \ndata",
      color: "#72bfaf",
      timespans: [[1, now - ((45 * 60) + (3 * 60 * 60)), now - (45 * 60)]]
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
      timespans: [[1, now - (6 * 60 * 60), now - (5 * 60 * 60)]]
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
      timespans: [[2, now - ((30 * 60) + (1 * 60 * 60)), now - (1 * 60 * 60)]]
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

cats = cats.map(function (cat){
  cat.tasks = cat.tasks.map(function(task) {
    if(task.timespans.length && !task.timespans[task.timespans.length - 1][2]) {
      task.started = true;
    }
    return task;
  });
  return cat;
});

function toggleCatExpanded(index){
  cats[index].expanded = !cats[index].expanded;
  renderBody();
}

var TaskListTaskTitle = React.createClass({
  displayName: "TaskListTaskTitle",
  render: function() {
    var displayList = [];
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
    cats[catIndex].tasks[taskIndex].timespans.push([testUid, now]);
    renderBody();
    return;
  }
  if(cats[catIndex].tasks[taskIndex].started) {
    cats[catIndex].tasks[taskIndex].started = false;
    cats[catIndex].tasks[taskIndex].timespans[cats[catIndex].tasks[taskIndex].timespans.length - 1][2] = now;
    renderBody();
    return;
  }
}

function zeroPad(num, numZeros) {
  var n = Math.abs(num);
  var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
  var zeroString = Math.pow(10,zeros).toString().substr(1);
  if( num < 0 ) {
    zeroString = '-' + zeroString;
  }

  return zeroString+n;
}


function sumFormatSpans(spans){
  var timespanSum = 0;
  spans.forEach(function(span) {
    timespanSum += span[2]? span[2] - span[1]:( now - span[1] );
  });
  return zeroPad(Math.floor(timespanSum / 60 / 60) % 24, 2) + ':' + zeroPad((Math.floor(timespanSum / 60) % 60), 2);
}

var TaskEndColumn = React.createClass({
  displayName: "TaskEndColumn",
  render: function () {
    var displayList = [];

    if(this.props.timespans.length > 0) {
      displayList.push(new TimeLabel({x: window.innerWidth - (nowLineOffset / 2), y: this.props.y + 43, text: sumFormatSpans(this.props.timespans)}));
    } else {
      displayList.push(new TimeLabel({x: window.innerWidth - (nowLineOffset / 2), y: this.props.y + 43, fill: '#CCCCCC', text: '00:00'}));
    }

    return React.DOM.g({}, null, displayList);
  }
});

function projectTime(time, x, width){
  return (width - ((now - time) * timescale)) + x;
}

var TimeSpans = React.createClass({
  displayName: "TimeSpans",
  render: function() {
    var displayList = [];
    var right = this.props.x + this.props.width;
    var props = this.props;
    this.props.timespans.forEach(function(span){
      var startX = projectTime(span[1], props.x, props.width);
      var endX = span[2]? projectTime(span[2], props.x, props.width): props.x + props.width;

      if(endX > props.x) {
        if(startX < props.x) {
          startX = props.x;
        }
        displayList.push(React.DOM.rect({x: startX, y: props.y, width: endX - startX, height: props.height, opacity: props.opacity, fill: props.fill, onClick: props.onClick}));
      }
    });
    return React.DOM.g({}, null, displayList);
  }
});

var TaskListTask = React.createClass({
  displayName: "TaskListTask",
  playPause: function() {
    var thisFunction = {parent: "TaskListTask", name: "playPause"};
    console.log("Doh, " + thisFunction.parent + "'s " + thisFunction.name + " function is not yet implemented.");
    togglePlayPause(this.props.catIndex, this.props.taskIndex);
  },
  render: function() {
    var displayList = [];

    // Task line base
    displayList.push(React.DOM.rect({x: 0, y: this.props.y, width: window.innerWidth, height: taskHeight, fill: taskDefaultColor}));

    // Title area shade
    if(this.props.task.color) {
      displayList.push(React.DOM.rect({x: 0, y: this.props.y, width: taskListWidth, height: taskHeight, fill: this.props.task.color}));
      displayList.push(React.DOM.rect({x: 0, y: this.props.y, width: taskListWidth, height: taskHeight, opacity: 0.15, fill: "black"}));
    }
    // Title
    displayList.push(new TaskListTaskTitle({title: this.props.task.title, y: this.props.y, color: this.props.task.color}));

    // Play/Pause button
    var playPauseColor = this.props.task.color? 'white': catDefaultTextColor;
    displayList.push(new PlayPauseButton({x: 337, y: (this.props.y + 8), fill: playPauseColor, onClick: this.playPause, started: this.props.task.started}));

    // Time Column
    displayList.push(new TaskEndColumn({timespans: this.props.task.timespans, y: this.props.y, started: this.props.task.started}));

    // Time spans
    displayList.push(new TimeSpans({x: taskListWidth, y: this.props.y, height: taskHeight, width: (window.innerWidth - (nowLineOffset + taskListWidth)), fill: this.props.task.color, opacity: 1, timespans: this.props.task.timespans}));

    return React.DOM.g({}, null, displayList);
  }
});

var TimeLabel = React.createClass({
  displayName: "TimeLabel",
  render: function () {
    return React.DOM.text({x: this.props.x, y: this.props.y, fill: this.props.fill || catDefaultTextColor, fontSize: this.props.fontSize || 32, fontFamily: this.props.fontFamily || "Roboto", textAnchor: 'middle'}, this.props.text);
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
    cats[index].tasks.push({title: newTitle, timespans: []});
    renderBody();
  }
}

var ExpansionIndicator = React.createClass({
  displayName: "ExpansionIndicator",
  render: function (){
    if(this.props.expanded) {
      return React.DOM.path({d: 'm ' + (this.props.x + 14) + ',' + (this.props.y + 2) + ' -16,0 8,12 z', fill: this.props.fill, onClick: this.props.onClick});
    }
    if(!this.props.expanded) {
      return React.DOM.path({d: 'm ' + this.props.x + ',' + this.props.y + ' 0,16 12,-8 z', fill: this.props.fill, onClick: this.props.onClick});
    }
    return null;
  }
});

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
    var displayList = [];
    this.props.y = this.props.y || 0;

    // Category line
    displayList.push(React.DOM.rect({x: 0, y: this.props.y, width: window.innerWidth, height: catHeight, fill: catDefaultColor, onClick: this.toggleExpanded}));

    // Category heading
    displayList.push(React.DOM.text({x: 40, y: this.props.y + 56, "fontSize": '48px', fill: catDefaultTextColor, fontFamily: 'Cantarell, Sans'}, this.props.cat.title));

    // Expansion indicator
    displayList.push(new ExpansionIndicator({x: 14,  y: (this.props.y + 34), fill: catDefaultTextColor, expanded: this.props.cat.expanded, onClick: this.toggleExpanded}));

    // Plus button
    displayList.push(new PlusButton({x: 328, y: this.props.y + 8, onClick: this.addTask, fill: catDefaultTextColor}));

    // TOTAL label
    var timespans = [];
    this.props.cat.tasks.forEach(function(task) {
      task.timespans.forEach(function(span) {
        timespans.push(span);
      });
    });
    displayList.push(new TimeLabel({x: window.innerWidth - (nowLineOffset / 2), y: this.props.y + 56, text: sumFormatSpans(timespans)}));

    // Time spans
    if (!this.props.cat.expanded) {
      displayList.push(new TimeSpans({x: taskListWidth, y: this.props.y, height: catHeight, width: (window.innerWidth - (nowLineOffset + taskListWidth)), fill: 'black', opacity: 0.05, timespans: timespans, onClick: this.toggleExpanded}));
    }
    this.props.y += catHeight;

    if(this.props.cat.expanded) {
      for (var task in this.props.cat.tasks) {
        if(this.props.cat.tasks[task].title) {
          displayList.push(new TaskListTask({y: this.props.y, task: this.props.cat.tasks[task], taskIndex: task, catIndex: this.props.index}));
          this.props.y += taskHeight;
        }
      }
    }

    return React.DOM.g({}, null, displayList);
  }
});

var TaskList = React.createClass({
  displayName: "TaskList",
  render: function() {
    var displayList = [];
    var currentY = 0;

    for (var cat in this.props.cats) {
      if(this.props.cats[cat].title) {
        displayList.push(new TaskListCategory({y: currentY, cat: this.props.cats[cat], index: cat}));
        currentY += catHeight + (this.props.cats[cat].expanded?this.props.cats[cat].tasks.length * taskHeight: 0);
      }
    }

    if(currentY < window.innerHeight) {
      currentY = window.innerHeight;
    }

    // Task list separator line
    displayList.push(React.DOM.rect({x: taskListWidth - 2, y: 0, width: 2, height: currentY, opacity: 0.4, fill: "black"}));

    // “NOW” line
    displayList.push(React.DOM.path({d: 'm ' + (window.innerWidth - nowLineOffset) + ',0 0,' + currentY, opacity: 0.4, "strokeOpacity": 1, "stroke" : "black", "strokeWidth": 2, strokeDasharray: "2, 8"}));
    return React.DOM.svg({
      xmlns: "http://www.w3.org/2000/svg",
      width: window.innerWidth,
      height: currentY,
      version: "1.1"
    }, null, displayList);
  }
});

function renderBody() {
  now = Math.floor(Date.now() / 1000);
  React.renderComponent(new TaskList({cats: cats}), document.body);
}

function renderLoop() {
  window.setTimeout(function () {
    window.requestAnimationFrame(renderLoop);
  }, max(16, (1 / timescale) * 500));
  renderBody();
}

function max(a, b) {
  return a > b? a: b;
}

window.onresize = renderBody;


renderLoop();

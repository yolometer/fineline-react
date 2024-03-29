'use strict';
var catHeight = 80;
var catDefaultColor = "#e6e6e6";
var catDefaultTextColor = "#333333";

var nowLineOffset = 140;
var taskListWidth = 396;

var testUid = 1;

Date.MINUTE = 60;
Date.HOUR = 60 * Date.MINUTE;
Date.DAY = 24 * Date.HOUR;

var timescale = 15 / Date.MINUTE;

var taskHeight = 64;
var taskTitleFontFactor = (35 / 290); // Ratio of chars to pixels, 35/290 seems to work for most cases for most fonts.

var now = Math.floor(Date.now() / 1000);

var cats = [];

Object.defineProperty(Array.prototype, 'remove', {
  value: function(from, to) {
    var rest = this.slice(parseInt(to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  },
  enumerable: false
});

if(!localStorage.cats) {
  cats = [
    {title: "Development", expanded: true, tasks: [
      {
        title: "Create and document data and API structures",
        color: "#bf7294",
        timespans: [[1, now - (45 * Date.MINUTE), (now - (45 * Date.MINUTE)) + (20 * Date.MINUTE)]]
      },
      {
        title: "Set up major API routes",
        color: "#a7bf72",
        timespans: [[1, now - (15 * Date.MINUTE)]]
      },
      {
        title: "Build services to synchronize the data",
        color: "#72bfaf",
        timespans: [[1, now - ((45 * Date.MINUTE) + (3 * Date.HOUR)), now - (45 * 60)]]
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
        timespans: [[1, now - (6 * Date.HOUR), now - (5 * Date.HOUR)]]
      },
      {
        title: "Finalize design for MVP, and implement with React",
        timespans: []
      },
      {
        title: "Ensure consistency after interactivity is added to the page",
        timespans: []
      }
    ]},
    {title: "Deployment", expanded: false, tasks: [
      {
        title: "Deploy testing API endpoints to DigitalOcean Droplet",
        color: "#8172bf",
        timespans: [[2, now - ((30 * Date.MINUTE) + (1 * Date.HOUR)), now - (1 * Date.HOUR)]]
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

  cats = cats.map(function (cat) {
    cat.tasks = cat.tasks.map(function(task) {
      if(task.timespans.length && !task.timespans[task.timespans.length - 1][2]) {
        task.started = true;
      }
      return task;
    });
    return cat;
  });
  localStorage.cats = JSON.stringify(cats);
}

cats = JSON.parse(localStorage.cats);

function toggleCatExpanded(index) {
  cats[index].expanded = !cats[index].expanded;
  dirtyData();
}

var TaskTitle = React.createClass({
  displayName: "TaskTitle",
  mixins: [React.addons.PureRenderMixin],
  render: function() {
    var displayList = [];
    var localX = this.props.x;
    var localY = this.props.y + 28;
    var chars =  (taskTitleFontFactor * this.props.width) || 290;
    var maxlines = this.props.maxLines || 2;
    var accum = '';

    this.props.title.split(' ').forEach(function (t) {
      if((accum.length + t.length) < chars) {
        accum += t + ' ';
      } else {
        if(displayList.length == (maxlines - 1)) {
          accum = accum.substr(0, accum.length - 2) + '…';
        }
        if(displayList.length < maxlines) {
          displayList.push(React.DOM.tspan({key: 'l' + displayList.length, x: localX, y: localY + (displayList.length * 22)}, accum));
          accum = t + ' ';
        }
      }
    });
    if(displayList.length < maxlines) {
      displayList.push(React.DOM.tspan({key: 'l' + displayList.length, x: localX, y: localY + (displayList.length * 22)}, accum));
    }
    return React.DOM.text({fontSize: '18px', fill: (this.props.color)? 'white': catDefaultTextColor, fontFamily: 'Roboto, Sans', lineHeight: '125%', width: 280, height: 44, x: 40, y: localY, onClick: this.props.onClick}, null, displayList);
  }
});

var DeleteButton = React.createClass({
  displayName: "DeleteButton",
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    var displayList = [];
    displayList.push(React.DOM.path({key: 'x', d: 'm ' + (this.props.x + 20) + ',' + (this.props.y + 12) + ' -8,8 m 0,-8 8,8', fill: 'none', strokeWidth: 2, stroke: this.props.fill}));

    displayList.push(React.DOM.rect({key: 'c', x: this.props.x, y: this.props.y, width: 32, height: 32, fill: 'black', opacity: 0, onClick: this.props.onClick}));
    return React.DOM.g({}, null, displayList);
  }
});



var PlayPauseButton = React.createClass({
  displayName: "PlayPauseButton",
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    var displayList = [];
    if(!this.props.started) {
      displayList.push(React.DOM.path({key: 'p', d: 'm ' + (this.props.x + 15) + ',' + (this.props.y + 12) + ' 0,24 18,-12 z', fill: this.props.fill}));
    }
    if(this.props.started) {
      displayList.push(React.DOM.rect({key: 'l', x: (this.props.x + 13), y: (this.props.y + 12), width: 8, height: 24, fill: this.props.fill}));
      displayList.push(React.DOM.rect({key: 'r', x: (this.props.x + 27), y: (this.props.y + 12), width: 8, height: 24, fill: this.props.fill}));
    }
    displayList.push(React.DOM.rect({key: 'c', x: this.props.x, y: this.props.y, width: 48, height: 48, fill: 'black', opacity: 0, onClick: this.props.onClick}));
    return React.DOM.g({}, null, displayList);
  }
});

function togglePlayPause(catIndex, taskIndex) {
  if(!cats[catIndex].tasks[taskIndex].started) {
    cats[catIndex].tasks[taskIndex].started = true;
    if(!cats[catIndex].tasks[taskIndex].color) {
      cats[catIndex].tasks[taskIndex].color = Please.make_color()[0];
    }
    cats[catIndex].tasks[taskIndex].timespans.push([testUid, now]);
    dirtyData();
    return;
  }
  if(cats[catIndex].tasks[taskIndex].started) {
    cats[catIndex].tasks[taskIndex].started = false;
    cats[catIndex].tasks[taskIndex].timespans[cats[catIndex].tasks[taskIndex].timespans.length - 1][2] = now;
    dirtyData();
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

function spanSum(now) {
  function spanSize(span) {
    return span[2]? span[2] - span[1]:( now - span[1] );
  }
  return {
    reduce: function (a, b) {
      return typeof a !== 'number'?
        spanSize(a) + spanSize(b)
        :a + spanSize(b);
    },
    sum: spanSize
  };
}

function sumSpans(spans, now) {
  var ss = spanSum(now);
  var total = spans.reduce(ss.reduce);
  return typeof total !== 'number'? ss.sum(total): total;
}


function sumFormatSpans(spans) {
  return formatDuration(sumSpans(spans, now));
}

function formatDuration(duration) {
  return (duration > Date.DAY? Math.floor(duration / Date.DAY) + 'd ': '') + zeroPad(Math.floor(duration / Date.HOUR) % 24, 2) + ':' + zeroPad((Math.floor(duration / Date.MINUTE) % 60), 2);
}

var TaskEndColumn = React.createClass({
  displayName: "TaskEndColumn",
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    return new TimeLabel({key: this.props.key, x: this.props.right - (nowLineOffset / 2), y: this.props.y + 43, text: formatDuration(this.props.total), fill: this.props.total === 0? '#cccccc': undefined});
  }
});

function projectTime(time, x, width, nowArg) {
  return (width - ((nowArg - time) * timescale)) + x;
}

function lastVisibleInstant(width, nowArg) {
  return nowArg - (width / timescale);
}

var TimeSpans = React.createClass({
  displayName: "TimeSpans",
  mixins: [React.addons.PureRenderMixin],
  render: function() {
    var displayList = [];
    for(span in this.props.timespans) {
      displayList.push(React.DOM.rect({key: 's_' + span, x: this.props.timespans[span][0], y: this.props.y, width: this.props.timespans[span][1] - this.props.timespans[span][0], height: this.props.height, opacity: this.props.opacity, fill: this.props.fill, onClick: this.props.onClick}));
    }
    return React.DOM.g({}, null, displayList);
  }
});

function multiplyHexComponent(component, mult) {
  return Math.round((parseInt(component, 16)) * 0.85).toString(16);
}

function multiplyHexString(hex, mult) {
  return '#' + multiplyHexComponent(hex.substr(1,2), mult) + multiplyHexComponent(hex.substr(3,2), mult) + multiplyHexComponent(hex.substr(5,2), mult);
}

function deleteTask(catIndex, taskIndex) {
  cats[catIndex].tasks.remove(taskIndex);
  dirtyData();
}

function deleteTaskInteractive(catIndex, taskIndex) {
  if(window.confirm("Are you sure?")) {
    deleteTask(catIndex, taskIndex);
  }
}

function editTaskTitle(catIndex, taskIndex, title) {
  cats[catIndex].tasks[taskIndex].title = title;
  dirtyData();
}

function editTaskTitleInteractive(catIndex, taskIndex, title) {
  var newTitle = window.prompt("Enter a new title for this task", title);
  if(newTitle && newTitle !== title) {
    editTaskTitle(catIndex, taskIndex, newTitle);
  }
}

var Task = React.createClass({
  displayName: "Task",
  mixins: [React.addons.PureRenderMixin],
  playPause: function() {
    togglePlayPause(this.props.catIndex, this.props.taskIndex);
  },
  deleteTask: function () {
    deleteTaskInteractive(this.props.catIndex, this.props.taskIndex);
  },
  editTitle: function () {
    editTaskTitleInteractive(this.props.catIndex, this.props.taskIndex, this.props.task.title);
  },
  render: function() {
    var displayList = [];
    var color = this.props.task.color? '#FFF': catDefaultTextColor;

    // Title area shade
    if(this.props.task.shadeColor) {
      displayList.push(React.DOM.rect({key: 's', x: 0, y: this.props.y, width: taskListWidth, height: taskHeight, fill: this.props.task.shadeColor}));
    } else {
      if(this.props.task.color) {
        // Multiply color with 0.85 to produce the color shaded by 0.15
        this.props.task.shadeColor = multiplyHexString(this.props.task.color, 0.85);
        displayList.push(React.DOM.rect({key: 's', x: 0, y: this.props.y, width: taskListWidth, height: taskHeight, fill: this.props.task.shadeColor}));
      }
    }

    // Delete button
    displayList.push(new DeleteButton({key: 'd', x: 4, y: (this.props.y + 16), fill: color, onClick: this.deleteTask}));


    // Title
    displayList.push(new TaskTitle({key: 't', title: this.props.task.title, x: 40, y: this.props.y, width: taskListWidth - (40 + 66), color: this.props.task.color, onClick: this.editTitle}));

    // Play/Pause button
    displayList.push(new PlayPauseButton({key: 'p', x: taskListWidth - 59, y: (this.props.y + 8), fill: color, onClick: this.playPause, started: this.props.task.started}));

    // Time Column
    displayList.push(new TaskEndColumn({key: 'c', total: this.props.task.total, y: this.props.y, started: this.props.task.started, right: this.props.right}));

    // Time spans
    displayList.push(new TimeSpans({key: 'a', y: this.props.y, height: taskHeight, fill: this.props.task.color, opacity: 1, timespans: this.props.task.visibleTimespans}));

    return React.DOM.g({}, null, displayList);
  }
});

var TimeLabel = React.createClass({
  displayName: "TimeLabel",
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    return React.DOM.text({key: this.props.text, x: this.props.x, y: this.props.y, fill: this.props.fill || catDefaultTextColor, fontSize: this.props.fontSize || 32, fontFamily: this.props.fontFamily || "Roboto", textAnchor: 'middle'}, this.props.text);
  }
});

var PlusButton = React.createClass({
  displayName: "PlusButton",
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    var displayList = [];
    displayList.push(React.DOM.rect({key: 'v', x: (this.props.x + 30), y: this.props.y + 16, width: 4, height: 32, fill: this.props.fill}));
    displayList.push(React.DOM.rect({key: 'h', x: (this.props.x + 16), y: this.props.y + 30, width: 32, height: 4, fill: this.props.fill}));
    displayList.push(React.DOM.rect({key: 'c', x: this.props.x, y: this.props.y, width: 64, height: 64, opacity: 0, fill: 'black', onClick: this.props.onClick}));

    return React.DOM.g({}, null, displayList);
  }
});

function addTask(index) {
  var newTitle = window.prompt("Enter a title for your new task.");
  if(newTitle && newTitle.length && newTitle.length > 0) {
    cats[index].tasks.push({title: newTitle, timespans: [], total: 0});
    dirtyData();
  }
}

var ExpansionIndicator = React.createClass({
  displayName: "ExpansionIndicator",
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    if(this.props.expanded) {
      return React.DOM.path({d: 'm ' + (this.props.x + 14) + ',' + (this.props.y + 2) + ' -16,0 8,12 z', fill: this.props.fill, onClick: this.props.onClick});
    }
    if(!this.props.expanded) {
      return React.DOM.path({d: 'm ' + this.props.x + ',' + this.props.y + ' 0,16 12,-8 z', fill: this.props.fill, onClick: this.props.onClick});
    }
    return null;
  }
});

var Category = React.createClass({
  displayName: "Category",
  mixins: [React.addons.PureRenderMixin],
  toggleExpanded: function() {
    toggleCatExpanded(this.props.index);
  },
  addTask: function() {
    addTask(this.props.index);
  },
  render: function() {
    var displayList = [];
    this.props.y = this.props.y || 0;

    // Category line
    displayList.push(React.DOM.rect({key: 'l', x: 0, y: this.props.y, width: this.props.right, height: catHeight, fill: catDefaultColor, onClick: this.toggleExpanded}));

    // Category heading
    displayList.push(React.DOM.text({key: 'h', x: 40, y: this.props.y + 56, "fontSize": '48px', fill: catDefaultTextColor, fontFamily: 'Roboto, Sans'}, this.props.cat.title));

    // Expansion indicator
    displayList.push(new ExpansionIndicator({key: 'e', x: 14,  y: (this.props.y + 34), fill: catDefaultTextColor, expanded: this.props.cat.expanded, onClick: this.toggleExpanded}));

    // Plus button
    displayList.push(new PlusButton({key: 'p' + this.props.index, x: taskListWidth - 68, y: this.props.y + 8, onClick: this.addTask, fill: catDefaultTextColor}));

    // TOTAL label
    displayList.push(new TimeLabel({key: 't', x: this.props.right - (nowLineOffset / 2), y: this.props.y + 56, text: formatDuration(this.props.cat.total)}));

    // Time spans
    if (!this.props.cat.expanded) {
      var timespans = [];
      for(var task in this.props.cat.tasks) {
        for(var span in this.props.cat.tasks[task].visibleTimespans) {
          timespans.push(this.props.cat.tasks[task].visibleTimespans[span]);
        }
      }

      displayList.push(new TimeSpans({key: 's', y: this.props.y, height: catHeight, fill: 'black', opacity: 0.05, timespans: timespans, onClick: this.toggleExpanded}));
    }
    this.props.y += catHeight;

    if(this.props.cat.expanded) {
      for (var task in this.props.cat.tasks) {
        if(this.props.cat.tasks[task].title) {
          displayList.push(new Task({key: this.props.cat.tasks[task].title + task, y: this.props.y, task: this.props.cat.tasks[task], taskIndex: task, catIndex: this.props.index, right: this.props.right, now: this.props.now}));
          this.props.y += taskHeight;
        }
      }
    }

    return React.DOM.g({}, null, displayList);
  }
});

var TaskList = React.createClass({
  displayName: "TaskList",
  mixins: [React.addons.PureRenderMixin],
  render: function() {
    var displayList = [];
    var currentY = 0;

    var cat = 0;

    var biggerNow = false;

    var lastVisible = lastVisibleInstant(this.props.width - (nowLineOffset + taskListWidth), this.props.now);
    var now = this.props.now;

    var timeSpansWidth = (this.props.width - (nowLineOffset + taskListWidth));

    var hasOpenSpans = false;
    var startX, endX;

    for (cat in this.props.cats) {
      this.props.cats[cat].total = 0;
      if(this.props.cats[cat].tasks && this.props.cats[cat].tasks.length > 0) {
        for(task in this.props.cats[cat].tasks) {
          this.props.cats[cat].tasks[task].visibleTimespans = [];
          hasOpenSpans = false;
          for(span in this.props.cats[cat].tasks[task].timespans) {
            if(this.props.cats[cat].tasks[task].timespans[span][2]?
               this.props.cats[cat].tasks[task].timespans[span][2] > lastVisible:
               hasOpenSpans = typeof this.props.cats[cat].tasks[task].timespans[span][2] !== 'number') {
              // ^ setting hasOpenSpans while passing the value it retains through to the if statement

              startX = projectTime(this.props.cats[cat].tasks[task].timespans[span][1], taskListWidth, timeSpansWidth, now);
              if(startX < taskListWidth) {
                startX = taskListWidth;
              }

              endX = this.props.cats[cat].tasks[task].timespans[span][2]? projectTime(this.props.cats[cat].tasks[task].timespans[span][2], taskListWidth, timeSpansWidth, now): taskListWidth + timeSpansWidth;
              this.props.cats[cat].tasks[task].visibleTimespans.push([startX, endX]);
            }
          }

          // if no spans are open, total time obviously doesn't change
          if(hasOpenSpans || !this.props.cats[cat].tasks[task].total) {
            if(this.props.cats[cat].tasks[task].timespans.length > 0) {
              this.props.cats[cat].tasks[task].total = sumSpans(this.props.cats[cat].tasks[task].timespans, now);
            } else {
              this.props.cats[cat].tasks[task].total = 0;
            }
          }

          if(this.props.cats[cat].tasks[task].total > Date.DAY) {
            biggerNow = true;
          }
        }
        if(this.props.cats[cat].tasks.length > 1) {
          this.props.cats[cat].total = this.props.cats[cat].tasks.reduce(function (a, b) {
            return typeof a !== 'number'? a.total + b.total: a + b.total;
          });
        } else this.props.cats[cat].total = this.props.cats[cat].tasks[0].total;


        if(this.props.cats[cat].total > Date.DAY) {
          biggerNow = true;
        }
      }
    }

    cat = 0;


    for (cat in this.props.cats) {
      if(this.props.cats[cat].title) {
        displayList.push(new Category({key: 'c' + cat, y: currentY, cat: this.props.cats[cat], index: cat, right: this.props.width, now: this.props.now}));
        currentY += catHeight + (this.props.cats[cat].expanded?this.props.cats[cat].tasks.length * taskHeight: 0);
      }
    }

    if(currentY < window.innerHeight) {
      currentY = window.innerHeight;
    }

    // Task list separator line
    displayList.push(React.DOM.rect({key: "s", x: taskListWidth - 2, y: 0, width: 2, height: currentY, opacity: 0.4, fill: "black"}));

    // “NOW” line
    displayList.push(React.DOM.path({key: "n", d: 'm ' + (this.props.width - nowLineOffset) + ',0 0,' + currentY, opacity: 0.4, "strokeOpacity": 1, "stroke" : "black", "strokeWidth": 2, strokeDasharray: "2, 8"}));

    return React.DOM.svg({
      xmlns: "http://www.w3.org/2000/svg",
      width: this.props.width,
      height: currentY,
      version: "1.1"
    }, null, displayList);
  }
});


function renderBody() {
  now = Date.now() / 1000;
  React.renderComponent(new TaskList({cats: cats, width: window.innerWidth, now: now}), document.body);
}

function renderLoop() {
  window.setTimeout(function () {
    window.requestAnimationFrame(renderLoop);
  }, (1 / timescale) * 500);
  renderBody();
}

function dirtyData() {
  renderBody();
  localStorage.cats = JSON.stringify(cats);
}

window.onresize = function () {
  window.requestAnimationFrame(renderBody);
};

renderLoop();

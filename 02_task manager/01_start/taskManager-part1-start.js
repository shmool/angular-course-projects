/**
 * Created by Shmuela on 18/08/2014.
 */

// Questions about html file:
// line 98 - warning "Attribute ng-model is not allowed here" - why??

(function() {

    function TodoListController (scope) {
        scope.showDoneTasks = true;

        // Q: which is better, emitting & broadcasting? --> scope.$on...
        // or calling a function on the parent scope's controller? --> this.clearLog...

        scope.$on('ClearLogRequest', function (event, data) {
            scope.$broadcast('ClearLogEvent', data);
        });

        this.clearLog = function () {
            scope.$broadcast('ClearLogEvent', null);
        };

        scope.$on('AddLogRequest', function (event, data) {
            scope.$broadcast('AddLogEvent', data);
        });
    }

    function TaskTableController(scope) {

        this.tasks = [];

        // add initial tasks...
        AddContent(this.tasks);

        // Q: when should we use "this.func = function() {...}"
        // and when "function func() {...}" ?
        this.setActive = function (task) {
            this.activeTask = task;
        };

        this.addTask = function() {
            this.task.done = typeof this.task.done != "undefined" ? this.task.done : false;
            if (!this.edit) {
                this.tasks.push(this.task);
                scope.$emit('AddLogRequest', {date: new Date(), msg: "new task added"});
            }
            else {
                var index = this.tasks.indexOf(this.edit);
                this.tasks[index] = this.task;
                scope.$emit('AddLogRequest', {date: new Date(), msg: "task edited"});
            }
            this.task = {};
            this.edit = false;
        };


        this.editTask = function (task) {
            this.task = {
                done: task.done,
                title: task.title,
                description: task.description
            };
            this.edit = task;
        };

        this.clearForm = function () {
            this.task = {};
            this.edit = false;
        };

        this.removeTask = function (task) {
            var index = this.tasks.indexOf(task);
            this.tasks.splice(index, 1);
            this.activeTask = {};
            scope.$emit('AddLogRequest', {date: new Date(), msg: "task removed"});
        }
    }

    function ActionBarController (scope) {
        scope.$root.hideDoneTasks = false;
        this.showOrHide = function () {
            scope.$root.hideDoneTasks = !scope.$root.hideDoneTasks;
            //this.show = !this.show;
        };
        this.clearLog = function () {
            scope.$emit('ClearLogRequest', null);
        }
    }

    function LogController (scope) {
        this.logList = [];

        this.clearLog = function () {
            this.logList = [];
        };

        scope.$on('AddLogEvent', function(event, data) {
            this.logList.push(data);
        }.bind(this));

        scope.$on('ClearLogEvent', function() {
            this.logList = [];
        }.bind(this));
    }

    angular.module('todoapp', [])
        .controller({
            'TodoListController': ['$scope', TodoListController],
            'TaskTableController': ['$scope', TaskTableController],
            'ActionBarController': ['$scope', ActionBarController],
            'LogController': ['$scope', LogController]
        });

    function AddContent(tasks) {
        tasks.push({
            done: false,
            title: "learn angular!",
            description: "start from scratch, build your skills"
        });

        tasks.push({
            done: true,
            title: "play with controllers!1",
            description: "make sure to understand whats going on"
        });

        tasks.push({
            done: false,
            title: "try bootstrap",
            description: "prototype a gui is easy"
        });
    }

}());

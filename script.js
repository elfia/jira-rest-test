(function() {
	var config = {
		JiraBugsURL: 'https://jira.atlassian.com/rest/api/2/search',
		pageResulsts: 30
	}


	var tableModel = function() {
		var obj = this,
			totalElements = 0,
			spinner;
		
	    this.pageIndex = ko.observable(1);
		this.pages = ko.observableArray([]); // counter for pages, observable because is set after ajax load
		this.tableElements = ko.observableArray(); // list with bugs
		this.selectedBug = ko.observable(); // selected bug from list with bugs
	    this.bugData = ko.observable({ // response for selected bug with used fields
			key:'', 
			fields: {
				summary: '', 
				issuetype: {
					name: {}
				}, 
				priority: {
					iconUrl: '',
					name: ''
				},
				project: {
					avatarUrls: {},
					name: '',
					self: ''
				},
				status: {
					name: '', 
					statusCategory: {colorName: ''}
				}
				,
				resolution: {name: ''},
				fixVersions: [],
				versions: []
				
			} 
		});
		
		this.init = function() {
			// Dom elems for spinner
			spinner = new Spinner (document.getElementById('spinnerBugData'), document.getElementById('spinnerData'))

			loadList(0, function (data) {	
				// only on page load calculate pagination		
				totalElements = data.total;
				while (obj.pages().length * config.pageResulsts < totalElements) {
					obj.pages.push(obj.pages().length + 1)
				}
			});		
		}
			
		this.openIssue = function (data) {
			obj.selectedBug(data)
			loadDetails()
		}
		
		this.changePage = function (data) {
			if (data != obj.pageIndex()) {
				loadList((data - 1) * config.pageResulsts)
				obj.pageIndex(data)
			}
		}
		
		this.orderBy = function (option) {
			switch (option) {
				case 'date': 
					this.tableElements.sort(function(a, b) {
						return (new Date(a.fields.created)).getTime() - (new Date(b.fields.created)).getTime() 
					})
				
				case 'priority' :
					// some bugs miss priority
					this.tableElements.sort(function (a, b) {
						return a.fields.priority.id - b.fields.priority.id
					})
				
			}
		}
		
		function loadList (start, callback) {
			 $.ajax({
				url: config.JiraBugsURL,
				context: document.body,
				data: {
					jql: 'issuetype in (Bug,Documentation,Enhancement) and updated > startOfWeek()',
					startAt: start,
					maxResults: config.pageResulsts
				}
			}).done(function(data) {
				obj.tableElements(data.issues)
				obj.selectedBug(data.issues[0])
				callback && callback(data)
				loadDetails()
			});
		}
		
		function loadDetails() {
			spinner.start()

			$.ajax({
				url: obj.selectedBug().self		  
			}).done(function(data) {
				obj.bugData(data)
				spinner.stop()
			});
		}
	};
	 
	window.onload = function() {	
		var bugList = new tableModel()

		ko.applyBindings(bugList)
		bugList.init()
	};
})()
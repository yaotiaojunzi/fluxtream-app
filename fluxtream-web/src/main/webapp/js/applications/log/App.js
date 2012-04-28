define(["core/Application", "core/FlxState", "applications/log/Builder", "libs/bootstrap-datepicker"], function(Application, FlxState, Builder) {

	var Log = new Application("log", "Candide Kemmler", "icon-calendar");
	
	Log.currentWidgetName = Builder.widgets["DAY"][0];
	Log.currentWidget = null;
	Log.widgetState = null;
    Log.digest = null;
    Log.timeUnit = "DAY";

	var start, end;
	
	Log.setup = function() {
		$(".menuNextButton").click(function(e) {
			fetchState("/nav/incrementTimespan.json"); });
		$(".menuPrevButton").click(function(e) {
			fetchState("/nav/decrementTimespan.json"); });
		$(".menuTodayButton").click(function(e) {
			Log.timeUnit = "DAY";
			var w = Builder.widgetExistsForTimeUnit(Log.currentWidgetName, Log.timeUnit)?Log.currentWidgetName:Builder.widgets[Log.timeUnit][0];
			Log.currentWidgetName = w;
			Builder.createTimeUnitsMenu(Log);
			Builder.createWidgetTabs(Log);
			fetchState("/nav/setToToday.json");
		});
	};
	
	Log.initialize = function () {
		_.bindAll(this);
		for (var i=0; i<Builder.widgets[Log.timeUnit].length; i++) {
			FlxState.router.route("app/log/:widget/date/:date", "", function(widget, date) {
				var w = Builder.widgetExistsForTimeUnit(widget, Log.timeUnit)?widget:Builder.widgets[Log.timeUnit][0];
				Log.render(w + "/date/" + date);
			});
			FlxState.router.route("app/log/:widget/year/:year", "", function(widget, year) {
				var w = Builder.widgetExistsForTimeUnit(widget, Log.timeUnit)?widget:Builder.widgets[Log.timeUnit][0];
				Log.render(w + "/year/" + year);
			});
			FlxState.router.route("app/log/:widget/month/:year/:month", "", function(widget, year, month) {
				var w = Builder.widgetExistsForTimeUnit(widget, Log.timeUnit)?widget:Builder.widgets[Log.timeUnit][0];
				Log.render(w + "/month/" + year + "/" + month);
			});
			FlxState.router.route("app/log/:widget/week/:year/:week", "", function(widget, year, week) {
				var w = Builder.widgetExistsForTimeUnit(widget, Log.timeUnit)?widget:Builder.widgets[Log.timeUnit][0];
				Log.render(w + "/week/" + year + "/" + week);
			});
		}
	};
		
	Log.renderState = function(state, force) {
		if (!force&&FlxState.getState("log")===state) {
			return;
		}
		if (state==null||state==="") {
			Builder.createTimeUnitsMenu(Log);
			Builder.createWidgetTabs(Log);
			fetchState("/nav/setToToday.json");
            return;
		}
		var splits = state.split("/");
		Log.currentWidgetName = splits[0];
		Log.timeUnit = toTimeUnit(splits[1]);
		var nextWidgetState = state.substring(splits[0].length+1);
		if (Log.widgetState==nextWidgetState) {
			// time didn't change
			var w = Builder.widgetExistsForTimeUnit(Log.currentWidgetName, Log.timeUnit)?Log.currentWidgetName:Builder.widgets[Log.timeUnit][0];
			Log.currentWidgetName = w;
			Builder.createWidgetTabs(Log);
			Builder.updateWidget(Log.digest, Log);
			FlxState.router.navigate("app/log/" + state);
			FlxState.saveState("log", state);
			return;
		} else {
			var w = Builder.widgetExistsForTimeUnit(Log.currentWidgetName, Log.timeUnit)?Log.currentWidgetName:Builder.widgets[Log.timeUnit][0];
			Log.currentWidgetName = w;
			Builder.createTimeUnitsMenu(Log);
			Builder.createWidgetTabs(Log);
			if ("DAY"===Log.timeUnit) {
				fetchState("/nav/setDate.json?date=" + splits[2]);
			} else if ("WEEK"===Log.timeUnit) {
				fetchState("/nav/setWeek.json?year=" + splits[2] + "&week=" + splits[3]);
			} else if ("MONTH"===Log.timeUnit) {
				fetchState("/nav/setMonth.json?year=" + splits[2] + "&month=" + splits[3]);
			} else if ("YEAR"===Log.timeUnit) {
				fetchState("/nav/setYear.json?year=" + splits[2]);
			}
		}
	};
	
	function fetchState(url) {
		$(".calendar-navigation-button").toggleClass("disabled");
		$(".loading").show();
		$("#widgets").css("opacity", ".3");
		$.ajax({ url:url,
			success : function(response) {
				if (Log.currentWidget) {
					Log.currentWidget.saveState();
				}
				Log.widgetState = response.state;
				FlxState.router.navigate("app/log/" + Log.currentWidgetName + "/" + response.state);
				FlxState.saveState("log", Log.currentWidgetName + "/" + response.state);
				$("#currentTimespanLabel span").html(response.currentTimespanLabel);
				if (Log.timeUnit==="DAY") {
					setDatepicker(response.state.split("/")[1]);
				}
				fetchLog("/api/log/all/" + response.state);
			},
			error : function() {
				alert("error");
			}
		});
	}
	
	function setDatepicker(currentDate) {
		$("#datepicker").attr("data-date", currentDate);
		$("#datepicker").unbind("changeDate");
		$("#datepicker").datepicker().on(
			"changeDate", function(event) {
				var curr_date = event.date.getDate();
				var curr_month = event.date.getMonth() + 1;
				var curr_year = event.date.getFullYear();
				var formatted = curr_year + "-" + curr_month + "-" + curr_date;
				fetchState("/nav/setDate.json?date=" + formatted);
				$(".datepicker").hide();
			}
		);
	}
	
	function fetchLog(url) {
		$.ajax({ url: url,
			success : function(response) {
				$("#modal").empty();
                Log.digest = response;
				Builder.updateWidget(response, Log);
				$("#widgets").css("opacity", "1");
				$(".calendar-navigation-button").toggleClass("disabled");
				$(".loading").hide();
			},
			error: function() {
				alert("error fetching log");
			}
		});
	}

	function toTimeUnit(urlTimeUnit) {
		if (urlTimeUnit==="date") return "DAY";
		return urlTimeUnit.toUpperCase();
	}
	
	return Log;
	
});
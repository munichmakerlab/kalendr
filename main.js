var no_of_events = 6;

function pad(num, size){
	return ('00' + num).substr(-size);
}

function toHTML(data) {
	var items = [];
	var prev_day = "";
	var weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
	$.each( data, function( key, val ) {
		var start = new Date(val["start"]);
		var day = weekdays[start.getDay()] + ", " + start.getDate() + "." + (start.getMonth() + 1) + "." + start.getFullYear();
		var time = "";
		if (val["allDay"]) {
			time = "ganztags";
		} else {
			time = start.getHours() + ":" + pad(start.getMinutes(),2);
		}
		if (day != prev_day) {
			items.push("<h3>" + day + "</h3>");
			prev_day = day;
		}
		var str = "<div><span class='time'>" + time + "</span><span class='title'>" + val["title"] + "</span></div>"
		items.push(str);
	});

	return items.join( "" );
}

function sortByKey(array, key) {
	return array.sort(function(a, b) {
		var x = a[key]; var y = b[key];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}

function filterForCurrentEvents(data) {
	var today = new Date();
	today.setHours(0, 0, 0, 0);
	var event_start = new Date(data["start"]);

	return event_start >= today;
}

$.getJSON( "https://munichmakes.tiefpunkt.com/data/mumalab.json", function( data ) {
	data = data.filter(filterForCurrentEvents);
	data = sortByKey(data, "start");
	console.log(data);
	data = data.splice(0, no_of_events);
	console.log(data);
	data = toHTML(data)
	$( data ).appendTo( "body" );
});

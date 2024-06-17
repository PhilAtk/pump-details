// Record for every level
// Index 0 contains all valid scores for Pumbility
var records = [];

var title_reqs = [
	[ // Top 50: Max Pumbility
	// TODO: Different Pumbility plate colors?
		{title: "Pumbility", points: 107760}
	],[],[],[],[],[],[],[],[],[],
	[ // 10s
		{title: "Intermediate 1", points: 2000}
	],
	[ // 11s
		{title: "Intermediate 2", points: 2200}
	],
	[ // 12s
		{title: "Intermediate 3", points: 2600}
	],
	[ // 13s
		{title: "Intermediate 4", points: 3200}
	],
	[ // 14s
		{title: "Intermediate 5", points: 4000}
	],
	[ // 15s
		{title: "Intermediate 6", points: 5000}
	],
	[ // 16s
		{title: "Intermediate 7", points: 6200}
	],
	[ // 17s
		{title: "Intermediate 8", points: 7600}
	],
	[ // 18s
		{title: "Intermediate 9", points: 9200}
	],
	[ // 19s
		{title: "Intermediate 10", points: 11000}
	],
	[ // 20s
		{title: "Advanced 1", points: 13000},
		{title: "Advanced 2", points: 26000},
		{title: "Advanced 3", points: 39000}
	],
	[ // 21s
		{title: "Advanced 4", points: 15000},
		{title: "Advanced 5", points: 30000},
		{title: "Advanced 6", points: 45000}
	],
	[ // 22s
		{title: "Advanced 7", points: 17500},
		{title: "Advanced 8", points: 35000},
		{title: "Advanced 9", points: 52500},
		{title: "Advanced 10", points: 70000}
	],
	[ // 23s
		{title: "Expert 1", points: 40000},
		{title: "Expert 2", points: 80000}
	],
	[ // 24s
		{title: "Expert 3", points: 30000},
		{title: "Expert 4", points: 60000}
	],
	[ // 25s
		{title: "Expert 5", points: 20000},
		{title: "Expert 6", points: 40000}
	],
	[ // 26s
		{title: "Expert 7", points: 13000},
		{title: "Expert 8", points: 26000}
	],
	[ // 27s
		{title: "Expert 9", points: 3500},
		{title: "Expert 10", points: 7000}
	],
	[ // 28s
		{title: "The Master", points: 1900}
	],
	[ // Co-op
		{title: "Co-op Lvl 1", points: 30000},
		{title: "Co-op Lvl 2", points: 60000},
		{title: "Co-op Lvl 3", points: 90000},
		{title: "Co-op Lvl 4", points: 120000},
		{title: "Co-op Lvl 5", points: 150000},
		{title: "Co-op Lvl 6", points: 180000},
		{title: "Co-op Lvl 7", points: 210000},
		{title: "Co-op Lvl 8", points: 240000},
		{title: "Co-op Lvl 9", points: 270000},
		{title: "Co-op Lvl 10", points: 300000},
		{title: "Co-op Advanced", points: 330000},
		{title: "Co-op Expert", points: 360000},
		{title: "Co-op Master", points: 390000},
	]
];

// ============================================================================

function CalcPoints(level, score) {
	function PointMultiplier(score) {
		if (score >= 995000) return 1.5;
		if (score >= 990000) return 1.44;
		if (score >= 985000) return 1.38;
		if (score >= 980000) return 1.32;
		if (score >= 975000) return 1.26;
		if (score >= 970000) return 1.2;
		if (score >= 960000) return 1.1500000000000001; // I hate floats
		if (score >= 950000) return 1.1;
		if (score >= 925000) return 1.05;
		if (score >= 900000) return 1
		return 0;
	}

	function BasePoints(level) {
		if (level < 10) return 0;
		if (level == 10) return 100;
		return (level-10)*10 + BasePoints(level-1);
	}

	return Math.round(BasePoints(level) * PointMultiplier(score));
}

function Scrape() {
	if (location.href.indexOf("my_best_score.php") != -1) {
		// TODO: Be able to pull a single category

		const SCORE_URL = "https://piugame.com/my_page/my_best_score.php?lv=&&page=";

		// Calculate the number of pages to pull from the total scores
		var num_scores = document.getElementsByClassName("board_search")[0].childNodes[1].textContent.split(".")[1];
		var num_pages = Math.ceil(num_scores/12);

		// Init the records array to prepare to push to it
		for (var i=0; i<30; i++) {
			records[i] = new Array();
		}

		// Request each page
		for (i=1; i<=num_pages; i++) {
			console.log("Pulling page: " + i + " / " + num_pages);

			// TODO: Make this async
			var request = new XMLHttpRequest();
			request.open("GET", SCORE_URL + i, false);
			request.send(null);

			// Pack the response in a div to aid in parsing
			var wrapper = document.createElement("div");
			wrapper.innerHTML = request.responseText;

			// Pull out the scorelist for this page
			var list = wrapper.getElementsByClassName("my_best_scoreList")[0];
			
			for (var j=0; j<list.children.length; j++) {
				var entry = list.children[j];
		
				var level = 0;

				// What type of score is this?
				var type = entry.getElementsByClassName("stepBall_in")[0].style.backgroundImage.split("/")[6][0].toUpperCase();

				// Grab the second digit of the level
				var lvlStr2 = entry.getElementsByClassName("imG")[1].children[0].src.split("_")[3][0];

				if (type == 'C') {
					level = 29; // Co-op
					type = "x" + lvlStr2;
				}
				else {
					// Grab the first digit of the level
					var lvlStr1 = entry.getElementsByClassName("imG")[0].children[0].src.split("_")[3][0];

					lvlStr1 = Number(lvlStr1);
					lvlStr2 = Number(lvlStr2);
			
					// Calculate the difficulty
					level = 10*lvlStr1 + lvlStr2;
				}
				
				// Find the song name
				var song = entry.getElementsByClassName("song_name")[0].textContent;	

				// Find the score
				var score = Number(entry.getElementsByClassName("num")[0].textContent.replace(/,/g, ''));
		
				// Save current record
				var record = {
					song: song,
					type: type,
					level: level,
					score: score,
					points: CalcPoints(level, score)
				};

				records[level].push(record);
				if (level >= 10 && level < 29) {
					records[0].push(record);
				}
			};
		}

		records.forEach(range => {
			range.sort((songA, songB) => {
				return (songA.level == songB.level) ?
					songB.score - songA.score :
					songB.points - songA.points;
				}
			);
		});

		localStorage.setItem("records", JSON.stringify(records));

		window.alert("Script Finished");
	}

	else {
		window.alert("Could not load scores. Please navigate to https://piugame.com/my_page/my_best_score.php and run the script again");

		CAN_DISPLAY = false;
	}
}

function ExitOverlay() {
	var body = document.getElementsByTagName("body")[0];
	var overlay = document.getElementsByClassName("pump-details")[0];
	body.removeChild(overlay);
}

function DisplayInfo() {
	// Overlay Window
	let overlay = document.createElement("div");
	overlay.setAttribute("style", "position: fixed; top: 20%; z-index: 10000; width: 60%; height: 60%; left: 20%; background-color: rgba(0, 0, 0, 0.6);");
	overlay.className = "pump-details";
	document.getElementsByTagName("body")[0].appendChild(overlay);
	
	// Overlay Header
	let overlayHeader = document.createElement("div");
	overlayHeader.setAttribute("style", "width: 100%; background-color: #802020; color: #FFFFFF; display: flex;");
	overlay.appendChild(overlayHeader);
	
	// Overlay Header Text
	let overlayHeaderText = document.createElement("span");
	overlayHeaderText.setAttribute("style", "padding: 5px");
	overlayHeaderText.textContent = "Pump Details";
	overlayHeader.appendChild(overlayHeaderText);

	// Overlay Exit
	let overlayExit = document.createElement("button");
	overlayExit.setAttribute("onclick", "ExitOverlay()");
	overlayExit.textContent = "X";
	overlayExit.setAttribute("style", "margin-left: auto; margin-right: 0; color: black");
	overlayHeader.appendChild(overlayExit);
	
	// Options Div
	let optionsHeader = document.createElement("div");
	optionsHeader.setAttribute("style", "display: flex;");
	overlay.appendChild(optionsHeader);
	
	// Level Select Option
	let level_select = document.createElement("select");
	for (var i=0; i<30; i++) {
		var option = document.createElement('option');
		option.value = i;
		switch (i) {
			case 0:
				option.innerHTML = "Pumbility";
				break;
			case 29:
				option.innerHTML = "Co-op";
				break;
			default:
				option.innerHTML = "Level " + i;
		}

		level_select.appendChild(option);
	}
	optionsHeader.appendChild(level_select);

	// Score Average Text
	// TODO: Not being added for some reason?
	let scoreAvg = document.createElement("span");
	function CalcAvg() {
		if (level_select.value > 0) {
			let avg = 0;
			records[level_select.value].forEach(
				record => avg += record.score);
			avg = avg / records[level_select.value].length;

			scoreAvg.textContent = "Avg: " + avg;
		}

		else {
			console.log("Nothing");
			scoreAvg.textContent = "";
		}		
	}
	optionsHeader.appendChild(scoreAvg);
	level_select.addEventListener("change", CalcAvg);
	CalcAvg();

	// Load Scores
	let loadButton = document.createElement("button");
	loadButton.textContent = "Reload Scores";
	loadButton.setAttribute("onclick", "Scrape()");
	loadButton.setAttribute("style", "margin-left: auto; margin-right: 0");
	optionsHeader.appendChild(loadButton);
	
	// Info Div
	infoDiv = document.createElement("div");
	infoDiv.setAttribute("style", "display: flex; height: 93%; overflow: auto");
	overlay.appendChild(infoDiv);
	
	// Score Info Div
	let tableDiv = document.createElement("div");
	infoDiv.appendChild(tableDiv);

	// Score Info Table
	let table = document.createElement("table");
	tableDiv.appendChild(table);

	// Score Info Table Header
	let table_header = table.createTHead();
	table_header.setAttribute("style", "position: sticky; top: 0px; background-color: white;")
	let header_row = table_header.insertRow();
	let header_song = header_row.insertCell();
	header_song.textContent = "Song";
	let header_score = header_row.insertCell();
	header_score.textContent = "Score";
	let header_points = header_row.insertCell();
	header_points.textContent = "Points";
	
	// Score Info Table Body
	function BuildLevelTable() {
		if (table.tBodies[0]) {
			table.removeChild(table.tBodies[0])
		};
	
		let tbody = table.createTBody();
		tbody.setAttribute("style", "color: white;");
	
		records[level_select.value].forEach((record, i) => {
			
			if (level_select.value == 0 && i == 50) {
				let pumbility_border = tbody.insertRow();

				let pumbility_top50 = pumbility_border.insertCell();
				pumbility_top50.textContent = "--------------------Top 50--------------------";
			}

			let rec_row = tbody.insertRow();
			
			let rec_song = rec_row.insertCell();
			rec_song.textContent = record.song + " " + record.type + ((record.level == 29) ? '' : record.level);
		
			let rec_score = rec_row.insertCell();
			rec_score.textContent = record.score;
		
			let rec_points = rec_row.insertCell();
			rec_points.setAttribute("style", "text-align: center;");
			rec_points.textContent = record.points;
		});
	}
	
	// Rebuild on level change
	level_select.addEventListener("change", BuildLevelTable)
	BuildLevelTable();
	
	// Titles Div
	let titleDiv = document.createElement("div");
	titleDiv.setAttribute("style", "display: block; margin: auto; color: white");
	infoDiv.appendChild(titleDiv);
	
	function BuildTitles() {
		titleDiv.replaceChildren();
	
		title_reqs[level_select.value].forEach(t => {
			var points = 0;
			records[level_select.value].forEach((rec, i) => {
				if (level_select.value == 0 && i >= 50) {
					// Stop counting Pumbility after 50
				}
				else {
					points += rec.points
				}
				
			});
	
			// Current Title
			var title = document.createElement("div");
			titleDiv.append(title);

			// Title Name
			var titleName = document.createElement("span");
			titleName.innerText = t.title + ": " + points + " / " + t.points;
			title.appendChild(titleName);

			// Spacing
			title.appendChild(document.createElement("br"));
	
			// Title Progress Bar
			var progressbar = document.createElement("progress");
			progressbar.setAttribute("value", points);
			progressbar.setAttribute("max", t.points);
			title.append(progressbar);

			// Scores needed
			if (level_select.value != 0) {
				if (points < t.points) {
					var points_needed = t.points - points;
	
					var minP = CalcPoints(level_select.value, 900000);
					var maxP = CalcPoints(level_select.value, 1000000);
	
					title.appendChild(document.createElement("br"));
	
					var val1 = document.createElement("span");
					val1.textContent = "AAs: " + Math.ceil(points_needed/minP);
					title.append(val1);
	
					var val2 = document.createElement("span");
					val2.textContent = " | SSS+s: " + Math.ceil(points_needed/maxP);
					title.append(val2);
				}
			}

			titleDiv.appendChild(document.createElement("br"));
		});
	}
	
	// Rebuild on level change
	level_select.addEventListener("change", BuildTitles);
	BuildTitles();	
}

// ============================================================================

var CAN_DISPLAY = true;

if (localStorage["records"] == null) {
	window.alert("Fetching records");
	Scrape();
}
else {
	records = JSON.parse(localStorage["records"]);
}

if (CAN_DISPLAY) {
	DisplayInfo();
}

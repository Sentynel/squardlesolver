/*
Squardle is © 2022 by FubarGames.se

I've chosen to not minify the code for this project for ideological reasons; 
it might be helpful and/or educational for someone to be able to actually read 
and understand the code. If only to know what not to do.

This in no way means that you are allowed to copy the game
and publish it as your own, or otherwise try to host it
elsewhere and/or try to make money from it.

Code for the Mersenne Twister and SHA256 implementations used have their copyright 
and license info listed in their respective js-files.
*/
var fastSeeds = [];
var seedsSeed = 0;
var preShuffle = 0;
var alpha = "abcdefghijklmnopqrstuvwxyz";
var alphaCode = "abcdefghjklmnpqrstuvwxyz23456789io01";
var alphaNoDL = "abcefghijkmnopqrstuvwxyz";
var square = [];
var playerNotes = [];
var wordsUsed = [];
var currentGuess = ""
var guessCR= 0;
var gameState = 0;
var allLettersInSquare = "";
var guessNr = 0;
var smallSquares = [];	//[x][y][guessNr][DIV]
var SQUARE_DIV = 0, LETTER_DIV = 1, IS_FADED = 2, CLUE_SRC = 3;
var X=0, Y=1;
var solvedSquares = [];
var midSquares = [];
var bestClues = [];
var emojiAfterThree = "";
var clueOrder = ["black", "white", "yellow", "red", "orange", "green"];
var remainingGuesses, solvedColRows;
var gameGuesses = [];
var gameIsOver = true;
var removeBigTimer = [];
var creatingSquare = false;
var gameId = "none";
var currentPage = "startHint";
var showSolutionTimer;
var gameType = -1;
var solvedFreeplayRecord = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0];
var solvedDailyRecord = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0];
var solvedWeeklyRecord = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0];
var remainingFreeplayRecord = [0,0,0,0,0, 0,0,0,0,0 ,0,0,0, 0]; //[13] is loss
var remainingDailyRecord = [0,0,0,0,0, 0,0,0,0,0 ,0,0,0, 0]; //[13] is loss
var remainingWeeklyRecord = [0,0,0,0,0, 0,0,0,0,0 ,0,0,0, 0]; //[13] is loss
var replay = false;
var DAILY = 0, FREE = 1, FREEPLAY = 1, WEEKLY = 2;
var OPAC_LOW = "0.35", OPAC_MID = "0.77", OPAC_HIGH = "1";
var lastDailyPlayed = 0, lastWeeklyPlayed = -1;
var currentStreak = [0, 0, 0];
var longestStreak = [0, 0, 0];
var currentDay = -1, currentWeek = -1;
var updateDateTimer, clearRedLettersTimer;
var seedNr = 0;
var otherPlayedSeeds = [];
var physicalKeyboard = false;
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
//const isTouchDevice = () => { 
//  return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));  
//}  
//var isTouchDevice = false; 
var lang = "en";
var fp = false;	//FastPlay
var versionNr = 2;
var guessPos = [];
var keyboardColorMemory = [];
var readDailySeed = -1, readWeeklyBoard = -1;
var specialBefore = "åäöñÅÄÖÑ"
var specialAfter = "12345678"
guessPos[0] = [0,0];
guessPos[1] = [28,0];
guessPos[2] = [56,0];
guessPos[3] = [84,0];
guessPos[4] = [84,28];
guessPos[5] = [84,56];
guessPos[6] = [84,84];
guessPos[7] = [56,84];
guessPos[8] = [28,84];
guessPos[9] = [0,84];
guessPos[10] = [0,56];
guessPos[11] = [0,28];
guessPos[12] = [28,28];
guessPos[13] = [56,28];
guessPos[14] = [56,56];
guessPos[15] = [28,56];
var compSum = 0;
for(li=0; li<alpha.length; li++){
	compSum += freqComp[li];
}

function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
var preloadedImages = [];
var toPreload = ["a.png", "b.png", "c.png", "d.png", "e.png", "f.png", "g.png", "h.png", "i.png", "j.png", "k.png", "l.png", "m.png", "n.png", "o.png", "p.png", "q.png", "r.png", "s.png", "t.png", "u.png", "v.png", "w.png", "x.png", "y.png", "z.png", "å.png", "ä.png", "ö.png", "wrong/a.png", "wrong/b.png", "wrong/c.png", "wrong/d.png", "wrong/e.png", "wrong/f.png", "wrong/g.png", "wrong/h.png", "wrong/i.png", "wrong/j.png", "wrong/k.png", "wrong/l.png", "wrong/m.png", "wrong/n.png", "wrong/o.png", "wrong/p.png", "wrong/q.png", "wrong/r.png", "wrong/s.png", "wrong/t.png", "wrong/u.png", "wrong/v.png", "wrong/w.png", "wrong/x.png", "wrong/y.png", "wrong/z.png", "wrong/å.png", "wrong/ä.png", "wrong/ö.png", "white/a.png", "white/b.png", "white/c.png", "white/d.png", "white/e.png", "white/f.png", "white/g.png", "white/h.png", "white/i.png", "white/j.png", "white/k.png", "white/l.png", "white/m.png", "white/n.png", "white/o.png", "white/p.png", "white/q.png", "white/r.png", "white/s.png", "white/t.png", "white/u.png", "white/v.png", "white/w.png", "white/x.png", "white/y.png", "white/z.png", "white/å.png", "white/ä.png", "white/ö.png", "gray.png", "0.png", "green.png", "yellow01.png", "yellow02.png", "yellow03.png", "red10.png", "red20.png", "red30.png", "redder10.png", "redder20.png", "redder30.png", "orange11.png", "orange12.png", "orange13.png", "orange21.png", "orange22.png", "orange23.png", "orange31.png", "orange32.png", "orange33.png", "white.png", "black.png", "blacker.png", "light.png", "note.png", "blue.png", "cancel_blue.png", "backspace_blue.png", "row2.png", "column2.png", "win.png", "game_over.png", "play_again.png", "backspace_gray.png", "enter_gray.png", "copied_to_clipboard.png", "close.png", "instructions.png", "external-link.png", "fubar_games.png", "squardle_logo_color.png", "emoji.png", "see_solution.png", "note_guess.png", "toggle_to_guess.png", "toggle_to_certain.png"];
if(getQueryVariable("l") == "es" || getQueryVariable("lang") == "es"){
	toPreload[26] = "ñ.png";
	toPreload[26+29] = "wrong/ñ.png";
	toPreload[26+29+29] = "white/ñ.png";
}
//var toPreloadSize = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,   5,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,		9,9,1,1,55,8,9,9,9,2,3,2,3,36,9,9];
function preloadImages(){
	for(pr=0; pr<toPreload.length; pr++){
		preloadedImages[pr] = new Image();
		preloadedImages[pr].addEventListener('load', function(event) {
			loadedKb(3);
		})

		preloadedImages[pr].src = "graphics/"+toPreload[pr];
	}
}
preloadImages();
const rx1 = /å/g;
const rx2 = /ä/g;
const rx3 = /ö/g;
const rx4 = /ñ/g;
const rx5 = /Å/g;
const rx6 = /Ä/g;
const rx7 = /Ö/g;
const rx8 = /Ñ/g;
function encodeUTF8(a){
	var ret =  a.replace(rx1, "1")
	ret = ret.replace(rx2, "2")
	ret = ret.replace(rx3, "3")
	ret = ret.replace(rx4, "4")
	ret = ret.replace(rx5, "5")
	ret = ret.replace(rx6, "6")
	ret = ret.replace(rx7, "7")
	ret = ret.replace(rx8, "8")
	return(ret);
}
function decodeUTF8(a){
	var ret =  a.replace(regex1, "å")
	ret = ret.replace(regex2, "ä")
	ret = ret.replace(regex3, "ö")
	ret = ret.replace(regex4, "ñ")
	ret = ret.replace(regex5, "Å")
	ret = ret.replace(regex6, "Ä")
	ret = ret.replace(regex7, "Ö")
	ret = ret.replace(regex8, "Ñ")
	return(ret);
}
function arrayToTildeString(a){
	var ret = encodeUTF8(a.toString());
	ret = ret.replace(/\,/g, "~")
	return(ret);
}
function newSeedsSeed(){
	seedsSeed = Math.floor(Math.random()*9999);
	//testC.push("S"+seedsSeed);
	//createTestCookie();
	useSeedSeeds();
}
function useSeedSeeds(){
	init_genrand(seedsSeed);
	fastSeeds = fastSeedsStart.split(" ");
	fastSeeds = shuffleArray(fastSeeds);
	if(fastSeeds.length == 1){
		fastSeeds = [];
	}
}
var testC = ["E"];
function createTestCookie(){	//Cookie that should log every relevant game action to make it so that I can tell if the other cookies are working. (This might not be a good idea in that doing this is more work than doing the testing. But coding this is more fun than doing more testing...)
	/*
	var testTilde = arrayToTildeString(testC);
	if(testTilde.length > 1000){
		testTilde = testTilde.substring(testTilde.length - 1000);
	}*/
	var cn = getCookieName(true) + "_t";
	createCookie(cn, "e", 0);
	/*
	if(testTilde.length >= 400){
		getRecordsFreeplayCookie("o");
		ga("send", "event", "SquardlePlaytest", testTilde.substring(0,490) , testTilde.substring(490)+"_"+arrayToTildeString(solvedFreeplayRecord)+"_"+arrayToTildeString(remainingFreeplayRecord));
		testC = ["R"+seedsSeed];
	}
	*/
}
function getTestCookie(){
	var cn = getCookieName(true) + "_t";
	var cookieData = getCookie(cn).split("_");
	if(cookieData){
		if(cookieData[0]){
			testC = cookieData[0].split("~");
		}
	}
}
var magneticFields = true, backspaceDeletesAll = false, darkMode = false, autoHideGreen = false, autoHideBlack = false, autoHideRepeated = false;
var deathTimer;
function certainDeath(){
	magneticFields = false; //Uh oh...
	deathTimer = setTimeout("alert('WHY WOULD YOU CLICK THAT!?')", 1000);
	createSettingsCookie();
}
function toggleSetting(e, nr){
	if(nr == 0){
		backspaceDeletesAll = document.getElementById("backspaceDeletesAllCheckbox").checked;
		createSettingsCookie();
	}else if(nr == 1){
		darkMode = document.getElementById("darkModeCheckbox").checked;
		toggleDarkMode();
		createSettingsCookie();
	}else if(nr == 2){
		autoHideGreen = document.getElementById("autoHideGreenCheckbox").checked;
		createSettingsCookie();
	}else if(nr == 3){
		autoHideBlack = document.getElementById("autoHideBlackCheckbox").checked;
		createSettingsCookie();
	}else if(nr == 4){
		autoHideRepeated = document.getElementById("autoHideRepeatedCheckbox").checked;
		createSettingsCookie();
	}
}
function createSettingsCookie(){
	var cn = getCookieName(false)  + "_en_settings";	//All languages use the "en" cookie for settings.
	var settingString = magneticFields+ "_" + backspaceDeletesAll  + "_" + darkMode  + "_" + autoHideGreen  + "_" + autoHideBlack + "_" + autoHideRepeated;
	var alse = /alse/g, rue = /rue/g;
	settingString = settingString.replace(alse, "").replace(rue, "")	//Store only t or f for true or false since total cookie size is limited.
	createCookie(cn, settingString, 365*5);
}
function getSettingsCookie(){
	var cn = getCookieName(false) + "_en_settings";		//All languages use the "en" cookie for settings. 
	var cookieData = getCookie(cn).split("_");
	if(cookieData){
		if(cookieData[0]){
			magneticFields = (cookieData[0].charAt(0) == "t");
			if(!magneticFields){
				document.getElementById("magneticField").disabled = true;
				document.getElementById("magneticField").checked = false;
			}
		}if(cookieData[1]){
			backspaceDeletesAll = (cookieData[1].charAt(0) == "t");
			if(backspaceDeletesAll){
				document.getElementById("backspaceDeletesAllCheckbox").checked = true;
			}
		}if(cookieData[2]){
			darkMode = (cookieData[2].charAt(0) == "t");
			if(darkMode){
				toggleDarkMode();
				document.getElementById("darkModeCheckbox").checked = true;
			}
		}if(cookieData[3]){
			autoHideGreen = (cookieData[3].charAt(0) == "t");
			if(autoHideGreen){
				document.getElementById("autoHideGreenCheckbox").checked = true;
			}
		}if(cookieData[4]){
			autoHideBlack = (cookieData[4].charAt(0) == "t");
			if(autoHideBlack){
				document.getElementById("autoHideBlackCheckbox").checked = true;
			}
		}if(cookieData[5]){
			autoHideRepeated = (cookieData[5].charAt(0) == "t");
			if(autoHideRepeated){
				document.getElementById("autoHideRepeatedCheckbox").checked = true;
			}
		}
	}
}

function createSquardleCookie(){
	var shortGameId = gameId;
	if(gameType == DAILY){
		shortGameId = "d" + currentDay;
	}else if(gameType == WEEKLY){
		shortGameId = "l" + currentWeek;
	}
	if(gameIsOver){
		shortGameId = "none";
	}
	var cn = getCookieName(true);
	createCookie(cn, lastDailyPlayed +"_"+ seedNr +"_"+ seedsSeed +"_"+ shortGameId +"_"+ arrayToTildeString(gameGuesses) +"_2_"+ fadedToString() +"_"+ blueNotesToString() +"_"+lastWeeklyPlayed, 365*5);	//_2_ is versionNr	
}
function createLatestDailyCookie(){	//Cookie with info about the latest daily board played so you can recreate your result later in the same day.
	var shortGameId = "d" + currentDay;
	var cn = getCookieName(true) + "_daily";
	createCookie(cn, lastDailyPlayed +"_"+ dailySeedsV2[lastDailyPlayed] +"_NA_"+ shortGameId +"_"+ arrayToTildeString(gameGuesses) +"_2_"+ fadedToString() +"_"+ blueNotesToString(), 365*5);	//_NA_ is placeholder, _2_ is versionNr of cookie
}
function createLatestWeeklyCookie(){	//Cookie with info about the latest weekly board played so you can recreate your result later in the same week.
	var shortGameId = "l" + currentWeek;
	var cn = getCookieName(true) + "_weekly";
	createCookie(cn, lastWeeklyPlayed +"_"+ weeklyBoards[lastWeeklyPlayed] +"_NA_"+ shortGameId +"_"+ arrayToTildeString(gameGuesses) +"_2_"+ fadedToString() +"_"+ blueNotesToString(), 365*5);	//_NA_ is placeholder, _2_ is versionNr of cookie
}
function createRecordsCookie(toSet){
	var setAll = (toSet == -2);
	var cn = getCookieName(true) + "_recor_";
	if(toSet == DAILY || setAll){
		createCookie(cn + "d", arrayToTildeString(solvedDailyRecord)+"_"+arrayToTildeString(remainingDailyRecord)+"_"+currentStreak[DAILY]+"_"+longestStreak[DAILY], 365*5);
	}
	if(toSet == WEEKLY || setAll){
		createCookie(cn + "w", arrayToTildeString(solvedWeeklyRecord)+"_"+arrayToTildeString(remainingWeeklyRecord)+"_"+currentStreak[WEEKLY]+"_"+longestStreak[WEEKLY], 365*5);
	}
	if(toSet == FREE || setAll){
		createCookie(cn + "f", arrayToTildeString(solvedFreeplayRecord)+"_"+arrayToTildeString(remainingFreeplayRecord)+"_"+currentStreak[FREE]+"_"+longestStreak[FREE], 365*5);
	}
}
function resetStats(){
	var areYouSure = confirm("Are you sure that you want to delete all your saved data about stats & streaks for this language? (This will *not* remove data about what boards you've played.)\n\nClicking OK empties your stats cookies for Squardle in this language. This can't be undone.");
	if(areYouSure){
		solvedFreeplayRecord = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0];
		solvedDailyRecord = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0];
		solvedWeeklyRecord = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0];
		remainingFreeplayRecord = [0,0,0,0,0, 0,0,0,0,0 ,0,0,0, 0]; //[13] is loss
		remainingDailyRecord = [0,0,0,0,0, 0,0,0,0,0 ,0,0,0, 0]; //[13] is loss
		currentStreak[FREE] = 0;
		longestStreak[FREE] = 0;
		currentStreak[DAILY] = 0;
		longestStreak[DAILY] = 0;
		currentStreak[WEEKLY] = 0;
		longestStreak[WEEKLY] = 0;
		createRecordsCookie(-2);
		updateStatsPage();
	}
}

function createSeedsCookie(){
	var cn = getCookieName(true)+"_s"
	if(lang != "en" && otherPlayedSeeds.length > 20){
		otherPlayedSeeds = otherPlayedSeeds.slice(otherPlayedSeeds.length - 20)
	}
	if(otherPlayedSeeds.length > 50){
		otherPlayedSeeds = otherPlayedSeeds.slice(otherPlayedSeeds.length - 50)
	}
	createCookie(cn, arrayToTildeString(otherPlayedSeeds), 365*5);
}
var readGameId = "none";
var readGameGuesses = [], readFaded = [], readBlueNotes = [];
function getCookieName(includeLang){
	/*
	var cookieName = location.href.split("#")[0].split("?")[0].split("/").slice(-1);
	if(cookieName){
		cookieName = cookieName[0].replace(/\.html/, "");
		if(cookieName == "" || cookieName == "squardle"  || cookieName.indexOf("testing_") != -1 || true){	
			cookieName = "index";
		}
	}else{
		cookieName = "index";
	}
	*/
	var cookieName = "index"	//Multiple cookies for different test versions caused issues with total cookie length getting too big and crashing Chrome. So trying to limit use of them for internal testing.
	if(includeLang){
		cookieName += "_" + lang;
	}
	return(cookieName);
}
function testReadingCookie(cookieSuffix){
	var cn = getCookieName(true) + cookieSuffix;
	var cookieDataTest = getCookie(cn).split("_");
	if(cookieDataTest[0]){
		if(cookieDataTest[0] != ""){
			return(true);
		}
	}
	return(false);
}
function getSquardleCookie(justLoaded, readLatestPeriodInstead){
	var cn = getCookieName(true);
	if(readLatestPeriodInstead){
		if(gameType == WEEKLY){
			cn += "_weekly";
		}else if(gameType == DAILY){
			cn += "_daily";
		}
	}
	var cookieData = getCookie(cn).split("_");
	versionNr = 1;
	readGameId = "none";
	if(cookieData){
		if(!readLatestPeriodInstead){
			if(cookieData[0]){
				lastDailyPlayed = parseInt(cookieData[0], 10);
			}
			if(cookieData[8]){
				lastWeeklyPlayed = parseInt(cookieData[8], 10);
			}
		}
		if(cookieData[1] && !readLatestPeriodInstead && gameType == DAILY){
			seedNr = parseInt(cookieData[1], 10);
			seedNr = Math.max(0, seedNr);
		}else if(cookieData[1]){
			if(gameType == DAILY){
				readDailySeed = - parseInt(cookieData[1], 10);
			}else if(gameType == WEEKLY){
				readWeeklyBoard = cookieData[1];
			}
		}
		if(!readLatestPeriodInstead && gameType == DAILY){
			if(cookieData[2]){
				seedsSeed = parseInt(cookieData[2], 10);
				useSeedSeeds();
			}else{
				newSeedsSeed();
			}
		}
		if(cookieData[3]){
			readGameId = cookieData[3];
		}
		if(cookieData[4]){
			readGameGuesses = cookieData[4].split("~");
		}
		if(cookieData[5]){
			versionNr = parseInt(cookieData[5], 10);
		}
		if(justLoaded){
			if(cookieData[6]){	//Faded status of clues.
				readFaded = [];
				while(cookieData[6].length > 0 && cookieData[6].length % 3 == 0){
					var fadeTriplet = [];
					fadeTriplet.push(parseInt(cookieData[6].charAt(0), 10));
					fadeTriplet.push(parseInt(cookieData[6].charAt(1), 10));
					fadeTriplet.push(alphaCode.indexOf(cookieData[6].charAt(2).toLowerCase()));
					fadeTriplet.push(cookieData[6].charAt(2).toLowerCase() != cookieData[6].charAt(2));	//Read capital letters as true, lower case as false:
					cookieData[6] = cookieData[6].substring(3);
					readFaded.push(fadeTriplet);			
				}
			}
			if(cookieData[7]){	//Blue notes.
				readBlueNotes = [];
				while(cookieData[7].length > 0 && cookieData[7].length % 3 == 0){
					var noteTriplet = [];
					noteTriplet.push(parseInt(cookieData[7].charAt(0), 10));
					noteTriplet.push(parseInt(cookieData[7].charAt(1), 10));
					noteTriplet.push(decodeUTF8(cookieData[7].charAt(2)));
					cookieData[7] = cookieData[7].substring(3);
					readBlueNotes.push(noteTriplet);			
				}
			}
			if(versionNr == 1){
				versionNr = 2;
			}
		}
	}
	if(justLoaded && testReadingCookie("_daily")){	//To fix bug that set of lastDailyPlayed to the week number
		cn = getCookieName(true)+"_daily"
		var cookieDataDaily = getCookie(cn).split("_");
		if(cookieDataDaily){
			if(cookieDataDaily[0]){
				if(parseInt(cookieDataDaily[0], 10) > lastDailyPlayed){
					lastDailyPlayed = parseInt(cookieDataDaily[0], 10);
				}
			}
		}
	}
	if(justLoaded){
		if(!cookieData){
			newSeedsSeed();
			versionNr = 2;
		}
	}
	return(false);
}
function getRecordsFreeplayCookie(plusO){
	if(plusO == "o" && (testReadingCookie("_recor_f") || !(testReadingCookie("_reco_f") || testReadingCookie("_rec_f")))){
		plusO = "or"
	}
	var cn = getCookieName(true)+"_rec"+plusO+"_f";
	var cookieData = getCookie(cn).split("_");
	if(cookieData){
		if(cookieData[0]){
			solvedFreeplayRecord = cookieData[0].split("~");
			for(sr=0; sr<solvedFreeplayRecord.length; sr++){
				solvedFreeplayRecord[sr] = parseInt(solvedFreeplayRecord[sr], 10);
				if(isNaN(solvedFreeplayRecord[sr])){
					solvedFreeplayRecord[sr] = 0;
				}
			}
			if(solvedFreeplayRecord.length > 26){
				solvedFreeplayRecord.length = 26;
			}
		}
		if(cookieData[1]){
			remainingFreeplayRecord = cookieData[1].split("~");
			for(rr=0; rr<remainingFreeplayRecord.length; rr++){
				remainingFreeplayRecord[rr] = parseInt(remainingFreeplayRecord[rr], 10);
				if(isNaN(remainingFreeplayRecord[rr])){
					remainingFreeplayRecord[rr] = 0;
				}
			}
		}
		if(cookieData[2]){
			currentStreak[FREE] = parseInt(cookieData[2], 10);
			if(currentStreak[FREE] == -1){
				currentStreak[FREE] = 0;
			}
		}
		if(cookieData[3]){
			longestStreak[FREE] = parseInt(cookieData[3], 10);
			if(longestStreak[FREE] == -1){
				longestStreak[FREE] = 0;
			}
		}
	}
}
function getRecordsPeriodCookie(plusO, periodType){	
	if(plusO == "o"){
		if(periodType == DAILY){
			if(testReadingCookie("_recor_d") || !(testReadingCookie("_reco_d") || testReadingCookie("_rec_d"))){
				plusO = "or"
			}
		}else if(periodType == WEEKLY){
			if(testReadingCookie("_recor_w") || !(testReadingCookie("_reco_w") || testReadingCookie("_rec_w"))){
				plusO = "or"
			}
		}
	}
	if(plusO == "O"){
		plusO = "o";
	}
	var periodLetter = "d";
	if(periodType == WEEKLY){
		periodLetter = "w";
	}
	var cn = getCookieName(true)+"_rec"+plusO+"_"+periodLetter;
	var cookieData = getCookie(cn).split("_");
	if(cookieData){
		if(periodType == DAILY){
			if(cookieData[0]){
				solvedDailyRecord = cookieData[0].split("~");
				for(sr=0; sr<solvedDailyRecord.length; sr++){
					solvedDailyRecord[sr] = parseInt(solvedDailyRecord[sr], 10);
					if(isNaN(solvedDailyRecord[sr])){
						solvedDailyRecord[sr] = 0;
					}
				}
				if(solvedDailyRecord.length > 26){
					solvedDailyRecord.length = 26;
				}
			}
			if(cookieData[1]){
				remainingDailyRecord = cookieData[1].split("~");
				for(rr=0; rr<remainingDailyRecord.length; rr++){
					remainingDailyRecord[rr] = parseInt(remainingDailyRecord[rr], 10);
					if(isNaN(remainingDailyRecord[rr])){
						remainingDailyRecord[rr] = 0;
					}
				}
			}
		}else if(periodType == WEEKLY){
			if(cookieData[0]){
				solvedWeeklyRecord = cookieData[0].split("~");
				for(sr=0; sr<solvedWeeklyRecord.length; sr++){
					solvedWeeklyRecord[sr] = parseInt(solvedWeeklyRecord[sr], 10);
					if(isNaN(solvedWeeklyRecord[sr])){
						solvedWeeklyRecord[sr] = 0;
					}
				}
				if(solvedWeeklyRecord.length > 26){
					solvedWeeklyRecord.length = 26;
				}
			}
			if(cookieData[1]){
				remainingWeeklyRecord = cookieData[1].split("~");
				for(rr=0; rr<remainingWeeklyRecord.length; rr++){
					remainingWeeklyRecord[rr] = parseInt(remainingWeeklyRecord[rr], 10);
					if(isNaN(remainingWeeklyRecord[rr])){
						remainingWeeklyRecord[rr] = 0;
					}
				}
			}
		}
		if(cookieData[2]){
			currentStreak[periodType] = parseInt(cookieData[2], 10);
			if(currentStreak[periodType] == -1){
				currentStreak[periodType] = 0;
			}
		}
		if(cookieData[3]){
			longestStreak[periodType] = parseInt(cookieData[3], 10);
			if(longestStreak[periodType] == -1){
				longestStreak[periodType] = 0;
			}
		}
	}
}
function getSeedCookie(){
	var cn = getCookieName(true) + "_s";
	var seedData = getCookie(cn).split("_");
	if(seedData){
	if(seedData[0]){
		otherPlayedSeeds = seedData[0].split("~");
	}
	}else{
		otherPlayedSeeds = [];
	}
}
function createCookie(name, value, days){
	if(onHttp){
		return true;
	}
	if(value.length > 1024){
		value.length = 1024;
	}
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; Secure; SameSite=Strict; expires=" + date.toGMTString();
    }
    else {
        expires = "; Secure; SameSite=Strict";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");	//Was missing var
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
function fixReco(){	//Yeah, I messed up and recorded stats-data to the wrong place. I think I can fix it without data loss in most of the cases, and in the cases where there's data missing I'm only removing a lost freeplay game, so hopefully no one will complain about that.
	if(!testReadingCookie("_reco_d") && testReadingCookie("_rec_d")){
		var dWonCorrect = 0;
		var dLossWrong = 0;
		getRecordsPeriodCookie("", DAILY);
		getRecordsFreeplayCookie("");
		for(so=0; so<21; so++){
			dLossWrong += solvedDailyRecord[so];
		}
		for(r=0; r<13; r++){
			dWonCorrect += remainingDailyRecord[r];
//			fWonCorrect += remainingFreeplayRecord[r];
		}
		var errorSizeWon = dWonCorrect - solvedDailyRecord[21];
		solvedFreeplayRecord[21] -= errorSizeWon;
		solvedDailyRecord[21] += errorSizeWon;
		var errorSizeLoss = dLossWrong - remainingDailyRecord[13]
		for(fi=0; fi<errorSizeLoss; fi++){
			soLoop:
			for(so=0; so<21; so++){
				if(solvedFreeplayRecord[so] < 0 && solvedDailyRecord[so] > 0){	//Move neg right over.
					solvedFreeplayRecord[so]++;
					solvedDailyRecord[so]--;
					break;
				}else if(solvedFreeplayRecord[so] < 0){							//Move neg to lowest pos.
					for(dSo=0; dSo<21; dSo++){
						solvedFreeplayRecord[so]++;
						solvedDailyRecord[dSo]--;
						break soLoop;
					}
				}else{
					for(da=0; da<21; da++){
						if(solvedDailyRecord[da] > 0 && solvedFreeplayRecord[13] > 13){
							solvedDailyRecord[da]--;
							solvedFreeplayRecord[13]--;
							break soLoop;
						}
					}
				}
			}
		}
		createRecordsCookie(DAILY);
		createRecordsCookie(FREE);
		var cn = getCookieName(true) + "_rec_d";
		createCookie(cn, "", 0);
		var cn = getCookieName(true) + "_rec_f";
		createCookie(cn, "", 0);
	}
}
function fixRecor(){
	if(testReadingCookie("_rec_d") || testReadingCookie("_rec_f")){
		fixReco();
	}
	getRecordsPeriodCookie("o", DAILY);
	getRecordsFreeplayCookie("o");
	if(!testReadingCookie("_recor_d") && testReadingCookie("_reco_d")){	//For daily records:
		fixDailyRem: while(remainingDailyRecord[13] < 0){		//Fix negative remaining[13] ie losses
			for(s=0; s<21; s++){
				if(solvedDailyRecord[s] < 0){
					remainingDailyRecord[13]++;
					solvedDailyRecord[s]++;
					continue fixDailyRem;
				}
			}
			if(solvedDailyRecord[s] > 0){
				remainingDailyRecord[13]++;
				solvedDailyRecord[21]++;
			}
		}
		for(s=0; s<21; s++){									//Fix negative solved
			fixDailySol: while(solvedDailyRecord[s] < 0){
				remainingDailyRecord[13]++;
				solvedDailyRecord[s]++;
			}
		}
		//Probably add code to test that number of wins and number of losses match between remaining and solved here.
		createRecordsCookie(DAILY);
	}
	if(!testReadingCookie("_recor_f") && testReadingCookie("_reco_f")){//For freeplay records:
		fixFreeRem: while(remainingFreeplayRecord[13] < 0){		//Fix negative remaining[13] ie losses
			for(s=0; s<21; s++){
				if(solvedFreeplayRecord[s] < 0){
					remainingFreeplayRecord[13]++;
					solvedFreeplayRecord[s]++;
					continue fixFreeRem;
				}
			}
			if(solvedFreeplayRecord[s] > 0){
				remainingFreeplayRecord[13]++;
				solvedFreeplayRecord[21]++;
			}
		}
		for(s=0; s<21; s++){									//Fix negative solved
			fixDailySol: while(solvedFreeplayRecord[s] < 0){
				remainingFreeplayRecord[13]++;
				solvedFreeplayRecord[s]++;
			}
		}
		//Probably add code to test that number of wins and number of losses match between remaining and solved here.
		createRecordsCookie(FREE);
	}
	/*
	if(!testReadingCookie("_recor_w") && testReadingCookie("_reco_w")){//For weekly records:
		getRecordsPeriodCookie("O", WEEKLY)	
		createRecordsCookie(WEEKLY)	
	}*/
}
var closeHTML = '<img src="graphics/close.png" align="right" hspace="5" width="16" height="16" onclick="togglePage(\'game\')">'
function setWeeklyStartup(){
	if(weeklyBoards.length > currentWeek){
		document.getElementById("weeklyStartup").innerHTML = "<h2>" + weeklyHeader + " #"+ currentWeek +"</h2>" + weeklyMessages[currentWeek];
	}else{
		document.getElementById("weeklyStartup").innerHTML = closeHTML+"<h2>" + "Trouble loading board for week #"+ currentWeek +"</h2> If you're not a time traveler trying to play the weekly board ahead of schedule, this message is most likely caused by you being on an older cached version of Squardle. Make a <em>hard reload</em> with Ctrl+Shift+R, or empty your browsers cached files manually and reload the page. (Do <b><em>not</em></b> empty your cookies or you will lose all stats and streaks!)<br><br>Doing this should result in the version number in the title and on the settings page matching the one on <a href='https://twitter.com/FubarGames' target='_blank'>my twitter profile</a>. <a href='https://twitter.com/FubarGames' target='_blank'><img src='graphics/external-link2.png' width='14' height='14'></a> If you're seeing a higher version number on my Twitter profile you're still on a cached version.<br><br>There's also a slim chance that I'm in a coma, or in some other very weird situation where I can't update the game and this is why there's no new weekly board up. Given how much Squardle has taken over my life it's unlikely that I have forgotten to update to include the new Weekly Squardle boards. But if the version numbers match and you still see this message, message me! If I'm not in a coma I'll try to respond quickly!";
	}
	toggleDarkMode();
	toggleDarkMode();
}
function changeElementBackground(ele, newColor){
	ele.style.background = newColor;
}
function changeElementTextColor(ele, newColor){
	ele.style.color = newColor;
}
function toggleDarkMode(){
	var bgColor = "white";
	var txtColor = "black";
	if(darkMode){
		bgColor = "black"
		txtColor = "white";
		changeElementTextColor(document.getElementById("dailySquardle"), "#333333");
		changeElementTextColor(document.getElementById("freeplaySquardle"), "#333333");
		changeElementTextColor(document.getElementById("creatingBoard"), "#333333");
		for(sns=0; sns<8; sns++){
			changeElementTextColor(document.getElementById("stats_"+sns), "#333333");
		}
		document.getElementById("snsBack").src = "graphics/stats_and_streaks2dm.png";
	}else{
		changeElementTextColor(document.getElementById("dailySquardle"), txtColor);
		changeElementTextColor(document.getElementById("freeplaySquardle"), txtColor);
		changeElementTextColor(document.getElementById("creatingBoard"), txtColor);	
		for(sns=0; sns<8; sns++){
			changeElementTextColor(document.getElementById("stats_"+sns), txtColor);
		}
		document.getElementById("snsBack").src = "graphics/stats_and_streaks2.png";
	}
	changeElementBackground(document.body, bgColor);
	changeElementBackground(document.getElementById("instructions"), bgColor);
	changeElementTextColor(document.getElementById("instructions"), txtColor);
	changeElementBackground(document.getElementById("weeklyStartup"), bgColor);
	changeElementTextColor(document.getElementById("weeklyStartup"), txtColor);
	changeElementBackground(document.getElementById("settings"), bgColor);
	changeElementTextColor(document.getElementById("settings"), txtColor);
	changeElementBackground(document.getElementById("support"), bgColor);
	changeElementTextColor(document.getElementById("support"), txtColor);
	changeElementBackground(document.getElementById("startHint"), bgColor);
	changeElementTextColor(document.getElementById("startHint"), txtColor);
	changeElementTextColor(document.getElementById("screenshotURL"), txtColor);
	var allLinks = document.getElementsByTagName("a");
	for(li=0; li<allLinks.length; li++){
		changeElementTextColor(allLinks[li], txtColor);
	}
}
function clearSquare(){
	for(x=0; x<5; x++){
		square[x] = ["_", "_", "_", "_", "_"];
	}
	square[1][1] = "-";
	square[1][3] = "-";
	square[3][1] = "-";
	square[3][3] = "-";
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(genrand_real1() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
	return(array);
}
function fadedToString(){
	var ret = "";
	for(xf=0; xf<5; xf++){
		for(yf=0; yf<5; yf++){
			if(smallSquares[xf][yf]){
				for(gf=0; gf<16; gf++){
					if(smallSquares[xf][yf][gf]){
						if(smallSquares[xf][yf][gf][IS_FADED] === 1){
							ret += xf+""+yf+alphaCode.charAt(gf);
						}else if(smallSquares[xf][yf][gf][IS_FADED] === 2){
							ret += xf+""+yf+alphaCode.charAt(gf).toUpperCase();
						}
					}
				}
			}
		}
	}
	return(ret);
}
function blueNotesToString(){
	var ret = "";
	for(xf=0; xf<5; xf++){
		for(yf=0; yf<5; yf++){
			if(smallSquares[xf][yf]){
				if(playerNotes[xf][yf] != "0" && !solvedSquares[xf][yf]){
					ret += xf + "" + yf + encodeUTF8(playerNotes[xf][yf]);
				}
			}
		}
	}
	return(ret);
}
function squareDown(xx, yy){
	if(gameState == 4){
		screenshotMode();
	}
	if(gameIsOver){
		return;
	}
	if(gameState == 1){
		removeBigClues(guessNr);
	}else if(gameState == 0){
		if(onBoard(xx, yy)){
			var noteIsCovered = false;	//Check to see if you've entered letters for a guess before pressing enter to stop making notes under them.
			if(xx == guessCR){
				if(currentGuess.length > yy){
					noteIsCovered = true;
				}
			}
			if(yy == guessCR){
				if(currentGuess.length > xx){
					noteIsCovered = true;
				}
			}
			if(!noteIsCovered){
				makeBlueNote(xx, yy);
			}
		}
	}else if(gameState == 3){
		if(gameState == 3){
			if(makingNote[0] == xx && makingNote[1] == yy){
				if(playerNotes[xx][yy] == "0"){
					if(document.getElementById("letter_0").src.indexOf("guess") != -1){
						document.getElementById("letter_0").src ="graphics/toggle_to_certain.png";
						setSquareColor(makingNote[0], makingNote[1], "note_guess");
					}else{
						stopMakingNote();
					}
				}else{
					eitherKey("Enter", false, false);	//Toggle guess/certain.
				}
			}else{
				stopMakingNote();
			}
		}
	}
	justFocusMan()
}
function stopMakingNote(){
	updateRemaining(remainingGuesses);
	if(playerNotes[makingNote[0]][makingNote[1]] == "0"){
		setSquareColor(makingNote[0], makingNote[1], "gray");
	}else{
		if(playerNotes[makingNote[0]][makingNote[1]].toLowerCase() == playerNotes[makingNote[0]][makingNote[1]]){	//Certain
			setSquareColor(makingNote[0], makingNote[1], "note");
		}else{
			setSquareColor(makingNote[0], makingNote[1], "note_guess");
		}
	}
	makingNote = [];
	for(bok=0; bok < alpha.length; bok++){ 
		setKeyColor(alpha.charAt(bok), keyboardColorMemory[bok])
	//	document.getElementById("key_"+alpha.charAt(bok)).src = keyboardColorMemory[bok];
	}
	document.getElementById("letter_0").src ="graphics/enter_gray.png";
	document.getElementById("letter_1").src ="graphics/backspace_gray.png";
	gameState = 0;
	createSquardleCookie();
}
var makingNote = [];
function makeBlueNote(xx, yy){
	if(gameState == 0 && !solvedSquares[xx][yy] && guessNr > 0){
		if(onBoard(xx, yy)){	//	(xx != 1 && xx != 3) || (yy != 1 && yy != 3)
			gameState = 3;
			var notePos = 0;
			makingNote = [xx, yy]
			if(playerNotes[xx][yy] == "0"){
				setSquareColor(xx, yy, "note");
				document.getElementById("letter_0").src = "graphics/toggle_to_guess.png";
				document.getElementById("letter_1").src = "graphics/cancel_blue.png";
		//		document.getElementById("remaining").innerHTML = "Enter&nbsp;note";
			}else{
				setSquareColor(xx, yy, "note_edit");
				if(playerNotes[xx][yy].toLowerCase() == playerNotes[xx][yy]){
					document.getElementById("letter_0").src ="graphics/toggle_to_guess.png";
				}else{
					document.getElementById("letter_0").src ="graphics/toggle_to_certain.png";
				}
		//		document.getElementById("remaining").innerHTML = "Edit&nbsp;or&nbsp;delete&nbsp;note";
				document.getElementById("letter_1").src ="graphics/backspace_blue.png";
			}
			for(bok=0; bok<alpha.length; bok++){
				if(keyboardColorMemory[bok] != "graphics/black.png"){
					setKeyColor(alpha.charAt(bok), "graphics/blue.png");
				}
			}
		}
	}
}
function setKeyColor(keyLetter, fileSrc){
	document.getElementById("key_"+keyLetter).src = fileSrc;
}
function removeBigClues(gn){
	if(gameState == 1 && guessNr == gn){
		clearTimeout(removeBigTimer[gn]);
		eitherKey("Enter", true, false);
	}
}
function readChange(thi){
	if(physicalKeyboard){
		if(thi.value.length == 0){
			eitherKey("Backspace", false, false);
		}
		thi.value = "X";
	}
}
var lastBackspaceTime = 0;
function keyDown(e){
	physicalKeyboard = true;
	justFocusMan();
	if(e.length == 1){
		e = e.toLowerCase();
	}
	/*
	if(e == "Shift"){
		screenshotMode();
		return(false);
	}
	*/
	if(gameIsOver || creatingSquare || fp || e == "2"){
		return(true);
	}
	if(alpha.indexOf(e) != -1){	//If Key is in alphabet.
		eitherKey("Key"+e.toUpperCase(), false, false);
	}else if(e == "Enter"){
		eitherKey(e, false, false);
	}else if(e == "Backspace"){
		eitherKey(e, false, false);
	}
}
function justFocusMan(){
	if(physicalKeyboard && currentPage == "game" && !gameIsOver){	// && !isTouchDevice	//This commented part also hit touch-pads, not just touch screens.
		var focusTimer = setTimeout('document.getElementById("hi").focus({preventScroll:true})', 200);
	}
}

function screenKeyDown(t){
	if(gameIsOver || creatingSquare || fp){
		return(false);
	}
	justFocusMan();
	var i = t.id.charAt(7).toUpperCase();
	if(i == 0){
		eitherKey("Enter", false, false);
	}else if(i == 1){
		eitherKey("Backspace", false, false);
	}else{
		eitherKey("Key"+i, false, false);
	}
	
}
function eitherKey(ec, auto, startNewGuess){
	if(gameState == 4){
		screenshotMode();
		return(true);
	}
	if(gameIsOver && !auto){
		return(true);
	}
	if(gameState == 3){	//Making blue note
		var xNote = makingNote[0];
		var yNote = makingNote[1];
		if(ec == "Backspace"){
			lastBackspaceTime = new Date().getTime();
			playerNotes[xNote][yNote] = "0";
			setMidSquare(xNote, yNote, false, true);
		}else if(ec != "Enter"){	//A letter key was pressed
			if(document.getElementById("letter_0").src.indexOf("guess") != -1){
				playerNotes[xNote][yNote] = ec.charAt(3).toLowerCase();
			}else{
				playerNotes[xNote][yNote] = ec.charAt(3);
			}
			setMidSquare(xNote, yNote, false, true);
		}
		if(ec == "Enter" && playerNotes[xNote][yNote] != "0"){	//Reverse case if making clue was canceled while note has a letter
			if(playerNotes[xNote][yNote] == playerNotes[xNote][yNote].toUpperCase()){
				playerNotes[xNote][yNote] = playerNotes[xNote][yNote].toLowerCase()
			}else{
				playerNotes[xNote][yNote] = playerNotes[xNote][yNote].toUpperCase()
			}
		}else if(ec == "Enter"){	//If we just started making the note, instead toggle to make it be a guess.
			if(document.getElementById("letter_0").src.indexOf("guess") != -1){
				document.getElementById("letter_0").src = "graphics/toggle_to_certain.png";
				setSquareColor(xNote, yNote, "note_guess");
			}else{
				document.getElementById("letter_0").src = "graphics/toggle_to_guess.png";
				setSquareColor(xNote, yNote, "note");
			}
			return(true);
		}
		if(playerNotes[xNote][yNote] == "0"){
			setSquareColor(xNote, yNote, "gray");
		}else{
			if(playerNotes[xNote][yNote].toLowerCase() != playerNotes[xNote][yNote]){
				setSquareColor(xNote, yNote, "note_guess");
			}else{
				setSquareColor(xNote, yNote, "note");
			}
		}
		stopMakingNote();
		return(true);
	}else if(ec.indexOf("Key") == 0 && gameState == 0){	
		if(alpha.indexOf(ec.charAt(3).toLowerCase()) == -1){
			return(false)
		}
		if(currentGuess.length < 5){
			setGuessLetter(currentGuess.length, ec.charAt(3).toLowerCase());
			currentGuess += ec.charAt(3).toLowerCase();
		}
	}else if(gameState == 1){		//Remove the big clues. 
		gameState = 0;
		currentGuess = "";
		setSmallSquareOpacity(guessCR, OPAC_HIGH);
		for(x=0; x<5; x++){
			setGuessLetter(x, "0");
			for(y=0; y<5; y++){
				if(onBoard(x, y)){	//!((x==1 || x==3) && (y==1 || y==3))
					if(solvedSquares[x][y]){
						setSquareColor(x, y, "solved2");
						setMidSquare(x, y, true, false);
					}else if(playerNotes[x][y] != "0"){
						if(playerNotes[x][y] == playerNotes[x][y].toUpperCase()){
							setSquareColor(x, y, "note_guess");
						}else{
							setSquareColor(x, y, "note");
						}
					}else{
						setSquareColor(x, y, "gray");
					}
				}
				if(smallSquares[x][y][guessNr] && smallSquares[x][y][guessNr][SQUARE_DIV]){
					smallSquares[x][y][guessNr][SQUARE_DIV].style.visibility = "visible";	//Make the hints that were hidden with autoHideGreen and autoHideBlack visible again.
					smallSquares[x][y][guessNr][LETTER_DIV].style.visibility = "visible";
				}
			}
		}
		progressGuessCR();
		guessNr++;
		if((!startNewGuess) && (!gameIsOver) && ec != "Backspace" && ec != "Enter"){
			eitherKey(ec, false, true);
		}
	}else if(ec == "Backspace" && currentGuess.length > 0){
		if(new Date().getTime() - lastBackspaceTime < 90){
		//		console.log((new Date().getTime() - lastBackspaceTime) +", "+new Date().getTime() +", "+lastBackspaceTime);
				return(false);
		}
		lastBackspaceTime = new Date().getTime();
		if(gameState == 2){		//Illegal guess currently entered
			clearTimeout(clearRedLettersTimer);
			clearRedLetters();
		}
		if(backspaceDeletesAll){
			currentGuess = "";
			for(bda=0; bda<5; bda++){
				setGuessLetter(bda, "0");
			}
		}else{
			currentGuess = currentGuess.slice(0, -1);
			setGuessLetter(currentGuess.length, "0");
		}
	}else if(ec == "Enter" && currentGuess.length == 5){
		makeGuess(false);
	}
}
function updateRemaining(newValue){
	document.getElementById("remainingNumberImg").src = "graphics/number_"+newValue+".png";
}
function setBonusVisibility(cr, vis){
	document.getElementById("bonus"+cr).style.visibility = vis;
	updateRemaining(remainingGuesses);
}
var bonusTimer = [];
var gameOverTimer;
function checkForSolvedWords(){
	var gameWon = true;
	var remainingBefore  = remainingGuesses;
	for(x=0; x<5; x++){
		var newColSolved = true;
		var newRowSolved = true;
		for(y=0; y<5; y++){
			if(!solvedSquares[x][y] && onBoard(x, y)){	//!((x==1 || x==3) && (y==1 || y==3))
				gameWon = false;
			}
			if(!solvedSquares[x][y]){
				newColSolved = false;
			}
			if(!solvedSquares[y][x]){	//Note: x,y intentionally reversed.
				newRowSolved = false;
			}
		}
		bonusTimer = [];
		if(solvedColRows.length < 5 || (solvedColRows.length < 8 && gameType == WEEKLY)){
			if(newColSolved && solvedColRows.indexOf(x) == -1){
				if(!fp){
					updateRemaining(remainingBefore);
					bonusTimer[x] = setTimeout("setBonusVisibility("+x+",'visible')", 1000);
					bonusTimer[x+10] = setTimeout("setBonusVisibility("+x+",'hidden')", 3000);
				}
				remainingGuesses++;
				if(fp){
					updateRemaining(remainingGuesses);
				}
				solvedColRows.push(x);
			}
		}
		if(solvedColRows.length < 5 || (solvedColRows.length < 8 && gameType == WEEKLY)){
			if(newRowSolved && solvedColRows.indexOf(x+5) == -1){
				if(!fp){
					updateRemaining(remainingBefore);
					bonusTimer[x+5] = setTimeout("setBonusVisibility("+(x+5)+",'visible')", 1000);
					bonusTimer[x+15] = setTimeout("setBonusVisibility("+(x+5)+",'hidden')", 3000);
				}
				remainingGuesses++;
				if(fp){
					updateRemaining(remainingGuesses);
				}
				solvedColRows.push(x+5);
			}
		}
	}
	if(gameWon){
		if(gameType == DAILY && !fp){
			completedPeriodGame("daily");
			if(!replay){
				currentStreak[DAILY]++;
				longestStreak[DAILY] = Math.max(currentStreak[DAILY], longestStreak[DAILY]);
				currentStreak[FREE]++;
				longestStreak[FREE] = Math.max(currentStreak[FREE], longestStreak[FREE]);
				createRecordsCookie(-2);
			}
		}else if(gameType == WEEKLY && !fp){
			completedPeriodGame("weekly");
			if(!replay){
				currentStreak[WEEKLY]++;
				longestStreak[WEEKLY] = Math.max(currentStreak[WEEKLY], longestStreak[WEEKLY]);
				createRecordsCookie(gameType);
			}
		}else if(gameType == FREE && !fp){
			if(!replay){
				currentStreak[FREE]++;
				longestStreak[FREE] = Math.max(currentStreak[FREE], longestStreak[FREE]);
				createRecordsCookie(gameType);
			}
		}
		gameIsOver = true;
		var gg = gameGuesses.join("-");
		ga('send', 'event',  'Squardle', 'Won', gameId+"_W"+remainingGuesses+"_"+gg);
		gameGuesses = [];
		createSquardleCookie();
		if(gameType == FREE && !replay && otherPlayedSeeds.indexOf(gameId) == -1 && (fastSeeds.indexOf(gameId) == -1 || fastSeeds.indexOf(gameId) > seedNr)){
			otherPlayedSeeds.push(gameId);
			createSeedsCookie();
		}
		if(!fp && !replay){
			if(gameType == FREE){
				remainingFreeplayRecord[remainingGuesses]++;
				solvedFreeplayRecord[21]++;
			}else if(gameType == DAILY){
				remainingDailyRecord[remainingGuesses]++;
				solvedDailyRecord[21]++;
			}else if(gameType == WEEKLY){
				remainingWeeklyRecord[remainingGuesses]++;
				solvedWeeklyRecord[25]++;
			}
			createRecordsCookie(gameType);
		}
		for(x=0; x<5; x++){
			for(y=0; y<5; y++){
				if(onBoard(x, y)){	//!((x==1 || x==3) && (y==1 || y==3))
					document.getElementById(x+"_"+y).src = "graphics/solved2.png";
				}
			}
		}
		if(fp){
			removeBigClues(guessNr);
			showGameOverScreen(true);
		}else{
			removeBigTimer[removeBigTimer.length] = setTimeout("removeBigClues("+removeBigTimer.length+")", 2200);
			gameOverTimer = setTimeout("showGameOverScreen(true)", 2500);
		}
		//testC.push("G"+remainingGuesses);
		//createTestCookie();
		replay = false;
	}else if(remainingGuesses < 1){
		if(gameType == DAILY && !fp){
			completedPeriodGame("daily");
		}else if(gameType == WEEKLY && !fp){
			completedPeriodGame("weekly");
		}
		if(!replay && !fp && gameType != WEEKLY){
			currentStreak[FREE] = 0;	//Kill both streaks if DAILY
			createRecordsCookie(FREE);
			if(gameType == DAILY){
				currentStreak[DAILY] = 0;	
				createRecordsCookie(DAILY);
			}
		}else if(!replay && !fp && gameType == WEEKLY){
			currentStreak[WEEKLY] = 0;
			createRecordsCookie(WEEKLY);
		}
		if(!fp && !replay){
			if(gameType == FREE){
				remainingFreeplayRecord[remainingGuesses]++;
				solvedFreeplayRecord[countSolvedSquares()]++;
			}else if(gameType == DAILY){
				remainingDailyRecord[remainingGuesses]++;
				solvedDailyRecord[countSolvedSquares()]++;
			}else if(gameType == WEEKLY){
				remainingWeeklyRecord[remainingGuesses]++;
				solvedWeeklyRecord[countSolvedSquares()]++;
			}
			createRecordsCookie(gameType);
		}

		if(gameType == FREE && !replay && otherPlayedSeeds.indexOf(gameId) == -1 &&  (fastSeeds.indexOf(gameId) == -1 || fastSeeds.indexOf(gameId) > seedNr)){
			otherPlayedSeeds.push(gameId);
			createSeedsCookie();
		}
		ga('send', 'event',  'Squardle', 'Lost', gameId+"_L"+countSolvedSquares()+"_"+gg);
		gameIsOver = true;
		gameGuesses = [];
		createSquardleCookie();
		if(fp){
			removeBigClues(guessNr);
			showGameOverScreen(false);
		}else{
			removeBigTimer[removeBigTimer.length] = setTimeout("removeBigClues("+removeBigTimer.length+")", 2200);
			gameOverTimer = setTimeout("showGameOverScreen(false)", 2500);
		}
		//testC.push("g"+countSolvedSquares());
		//createTestCookie();
		replay = false;
	}
}
function completedPeriodGame(period){
	if(period == "daily"){
		createLatestDailyCookie();
	}else{
		createLatestWeeklyCookie();
	}
	createRecordCookie(false);	//
	if(testReadingCookie("_"+period)){
		updatePeriodButtons();
	}else{
		document.getElementById("dailySquardle").innerHTML = "<b>ENABLE<br>COOKIES<br>TO SAVE<br>RESULTS!</b>";	
		document.getElementById("weeklySquardle").innerHTML = "<b>ENABLE<br>COOKIES<br>TO SAVE<br>RESULTS!</b>";	
	}
}
function showGameOverScreen(won){
		for(xgo=0; xgo<5; xgo++){
			for(ygo=0; ygo<5; ygo++){
				for(g=0; g<16; g++){
					if(smallSquares[xgo][ygo]){
						if(smallSquares[xgo][ygo][g]){
							if(smallSquares[xgo][ygo][g][SQUARE_DIV]){
								smallSquares[xgo][ygo][g][SQUARE_DIV].style.zIndex = "20";
								smallSquares[xgo][ygo][g][LETTER_DIV].style.zIndex = "22";
							}
						}
					}
				}
			}
		}
		document.getElementById("columnMarker").style.visibility = "hidden";
		document.getElementById("rowMarker").style.visibility = "hidden";
		if(won){
			document.getElementById("youWin").style.left = "-1000px";
			document.getElementById("youWin").style.visibility = "visible";
		}else{
			document.getElementById("gameOver").style.left = "-1000px";
			document.getElementById("gameOver").style.visibility = "visible";
		}
		if(fp){
			gameEndAnim(161, won);
		}else{
			gameEndAnim(1, won);
		}
}
var waTimer, waTimer2;
function gameEndAnim(step, won){
	if(won){
		var imgAnim = document.getElementById("youWinImg");
		var divAnim = document.getElementById("youWin");
	}else{
		var imgAnim = document.getElementById("gameOverImg");
		var divAnim = document.getElementById("gameOver");
	}
	if(step<=60){
		imgAnim.width = (step*10);
		imgAnim.height = (step*10);
		divAnim.style.width  = (step*10)+"px";
		divAnim.style.height = (step*10)+"px";
		divAnim.style.left = (300-(step*5)+10)+"px";
		divAnim.style.top = (300-(step*5)+10)+"px";
		waTimer = setTimeout("gameEndAnim("+(step+1)+","+won+")", 10);
	}else if(step == 61){
		waTimer = setTimeout("gameEndAnim("+(step+1)+","+won+")", 500);
	}else if(step <= 161){
		var st = step - 61;
		imgAnim.width = 600-(st*4.8);
		imgAnim.height = 600-(st*4.8);
		divAnim.style.width  = (600-(st*4.8))+"px";
		divAnim.style.height = (600-(st*4.8))+"px";
		divAnim.style.left = ((st*1.2)+10)+"px";
		divAnim.style.top = ((st*1.9)+10)+"px";
		waTimer = setTimeout("gameEndAnim("+(step+1)+","+won+")", 10);
	}
	if(step == 161){
		document.getElementById("emojiImg").src = "graphics/emoji.png";
		document.getElementById("emoji").style.visibility = "visible";
		document.getElementById("screenshotModeDiv").style.visibility = "visible";
		document.getElementById("playAgain").style.visibility = "visible";
		if(gameType == WEEKLY){
			document.getElementById("gameEndBox").style.display = "inline";
			document.getElementById("gameEndBoxClose").style.display = "inline";
			document.getElementById("gameEndCover").style.display = "inline";
			if(won){
				document.getElementById("tipJar").style.visibility = "visible";
			}
		}
		fp = false;
		if(won){
			showSolution(-1);
		}else{
			document.getElementById("remainingNumberImg").src = "graphics/0.png";
			document.getElementById("remaining").style.visibility = "hidden";
			document.getElementById("seeSolution").style.visibility = "visible";
		}
	}
}
function updateStatsPage(){
	var allPlayedWin = 0;
	var dailyPlayedWin = 0;
	var allPlayedLoss = remainingFreeplayRecord[13] + remainingDailyRecord[13];
	var dailyPlayedLoss = remainingDailyRecord[13];
	for(re=0; re<13; re++){
		allPlayedWin += remainingFreeplayRecord[re];
		allPlayedWin += remainingDailyRecord[re];
		dailyPlayedWin += remainingDailyRecord[re];
	}
	document.getElementById("stats_0").innerHTML = allPlayedWin + allPlayedLoss;
	document.getElementById("stats_1").innerHTML = dailyPlayedWin + dailyPlayedLoss;
	if(allPlayedWin + allPlayedLoss > 0){
		document.getElementById("stats_2").innerHTML = (Math.round(1000*allPlayedWin/(allPlayedWin + allPlayedLoss))/10) +"%"
	}else{
		document.getElementById("stats_2").innerHTML = "-"
	}
	if(dailyPlayedWin + dailyPlayedLoss > 0){
		document.getElementById("stats_3").innerHTML = (Math.round(1000*dailyPlayedWin/(dailyPlayedWin + dailyPlayedLoss))/10) +"%"
	}else{
		document.getElementById("stats_3").innerHTML = "-"
	}
		document.getElementById("stats_4").innerHTML = currentStreak[FREE];
		document.getElementById("stats_5").innerHTML = currentStreak[DAILY];
		document.getElementById("stats_6").innerHTML = longestStreak[FREE];
		document.getElementById("stats_7").innerHTML = longestStreak[DAILY];
	if(allPlayedWin + allPlayedLoss > 0){	//If any bars should be displayed.
		percentageBars = '';
		var displaySolved = [];
		for(ss=0; ss<=21; ss++){
			displaySolved[ss] = solvedFreeplayRecord[ss] + solvedDailyRecord[ss];
		}
		var maxBarSolved = 0;
		for(ss=0; ss<=21; ss++){
			if(displaySolved[ss] > maxBarSolved){
				maxBarSolved = displaySolved[ss];
			}
		}
		document.getElementById("statsTopLeft").innerHTML = Math.min(100, Math.round(100*(maxBarSolved / ((allPlayedWin + allPlayedLoss))))) +"%";
		document.getElementById("statsMidLeft").innerHTML = Math.min(50, Math.round(100*(maxBarSolved / ((allPlayedWin + allPlayedLoss)*2)))) +"%";
		var displayRemaining = [];
		var maxBarRemaining = 0;
		for(ss=0; ss<=13; ss++){
			displayRemaining[ss] = remainingFreeplayRecord[ss] + remainingDailyRecord[ss];
		}
		for(ss=0; ss<=21; ss++){
			if(displayRemaining[ss] > maxBarRemaining){
				maxBarRemaining = displayRemaining[ss];
			}
		}
		document.getElementById("statsTopRight").innerHTML = Math.min(100, Math.round(100*(maxBarRemaining / ((allPlayedWin + allPlayedLoss))))) +"%";
		document.getElementById("statsMidRight").innerHTML = Math.min(50, Math.round(100*(maxBarRemaining / ((allPlayedWin + allPlayedLoss)*2)))) +"%";
		var scaleBarsSolved =  260/(maxBarSolved / (allPlayedWin + allPlayedLoss));
		var color = "red";
		for(ss=0; ss<=21; ss++){
			if(ss < 7){
				color = "red";
			}else if(ss < 14){
				color = "orange";
			}else if(ss < 21){
				color = "yellow";
			}else if(ss == 21){
				color = "green";
			}
			var displayBarHeight = (scaleBarsSolved * displaySolved[ss]) / (allPlayedWin + allPlayedLoss);
			percentageBars += '<img src="graphics/'+color+'_bar.png" width="15" height="'+displayBarHeight+'">'
		}
		percentageBars += '<img src="graphics/0.png" width="21" height="10">';		
		var scaleBarsRemaining =  260/(maxBarRemaining / (allPlayedWin + allPlayedLoss));
		color = "red";
		for(ss=0; ss<=13; ss++){
			var displayBarHeight = (scaleBarsRemaining * displayRemaining[(ss+13)%14]) / (allPlayedWin + allPlayedLoss);
			percentageBars += '<img src="graphics/'+color+'_bar.png" width="15" height="'+displayBarHeight+'">'
			if(ss <= 1){
				color = "orange";
			}else if(ss <= 4){
				color = "yellow";
			}else if(ss >= 5){
				color = "green";
			}
		}
		document.getElementById("statsBars").innerHTML = percentageBars;
	}else{
		document.getElementById("statsBars").innerHTML = "";
	}
}
function backToTop(){
	if(window.scrollTo){
		window.scrollTo(0, 0);
	}else if(window.scroll){
		window.scroll(0, 0);
	}
}
function togglePage(page){
	if(page == currentPage){
		page = "game";
	}
	
	document.getElementById("startHint").style.display = "none";
	document.getElementById("instructions").style.display = "none";
	document.getElementById("settings").style.display = "none";
	document.getElementById("support").style.display = "none";
	document.getElementById("weeklyStartup").style.display = "none";
	if(page == "stats"){
		updateStatsPage();
		document.getElementById("stats").style.display = "inline";
		document.getElementById("statsClose").style.display = "inline";
		document.getElementById("statsBars").style.display = "inline";
		document.getElementById("statsTopLeft").style.display = "inline";
		document.getElementById("statsMidLeft").style.display = "inline";
		document.getElementById("statsTopRight").style.display = "inline";
		document.getElementById("statsMidRight").style.display = "inline";
		for(sns=0; sns<8; sns++){
			document.getElementById("stats_"+sns).style.display = "inline";
		}
	}else{
		document.getElementById("stats").style.display = "none";
		document.getElementById("statsClose").style.display = "none";
		document.getElementById("statsBars").style.display = "none";
		document.getElementById("statsTopLeft").style.display = "none";
		document.getElementById("statsMidLeft").style.display = "none";
		document.getElementById("statsTopRight").style.display = "none";
		document.getElementById("statsMidRight").style.display = "none";
		for(sns=0; sns<8; sns++){
			document.getElementById("stats_"+sns).style.display = "none";
		}
	}
	if(page != "game" && lang == "sv"){
		document.getElementById("columnMarker").style.visibility = "hidden";
		document.getElementById("rowMarker").style.visibility = "hidden";
	}else if(lang == "sv"){
		document.getElementById("columnMarker").style.visibility = "visible";
		document.getElementById("rowMarker").style.visibility = "visible";
	}
	if(page != "game"){
		document.getElementById(page).style.display = "inline";
		document.getElementById("keyboardLettersSv").style.display = "none";
		document.getElementById("keyboardColorsSv").style.display = "none";
	}else if(lang == "sv"){
		document.getElementById("keyboardLettersSv").style.display = document.getElementById("keyboardLetters").style.display;
		document.getElementById("keyboardColorsSv").style.display = document.getElementById("keyboardColors").style.display;
	}
	currentPage = page;
}

function setGuessLetter(pos, setTo){
	if(setTo == "0"){
		document.getElementById(guessCR+"L"+pos).src =  preloadedImages[88].src;	//29*3+1 = 88
		document.getElementById(pos+"L"+guessCR).src =  preloadedImages[88].src;	//29*3+1 = 88
	}else{
		document.getElementById(guessCR+"L"+pos).src =  preloadedImages[alpha.indexOf(setTo)].src;
		document.getElementById(pos+"L"+guessCR).src =  preloadedImages[alpha.indexOf(setTo)].src;
	}
	if(setTo == "0"){
		if(solvedSquares[pos][guessCR]){
			setMidSquare(pos, guessCR, true, false);
		}else if(playerNotes[pos][guessCR] != "0"){
			setMidSquare(pos, guessCR, false, true);
		}
		if(solvedSquares[guessCR][pos]){
			setMidSquare(guessCR, pos, true, false);
		}else if(playerNotes[guessCR][pos] != "0"){
			setMidSquare(guessCR, pos, false, true);
		}
	}else{
			setMidSquare(guessCR, pos, false, false);
			setMidSquare(pos, guessCR, false, false);		
	}
}
function setSquareColor(x, y, color){
	document.getElementById(x+"_"+y).src = "graphics/"+ color +".png"
}
function onBoard(obx, oby){
	if(obx >= 0 && obx < 5 && oby >= 0 && oby < 5){
		if(gameType == WEEKLY || ((obx!=1 && obx!=3) || (oby!=1 && oby!=3))){
			return(true);
		}
	}
	return(false);
}
function makeGuess(fastPlay){
	if(fastPlay){
		currentGuess = fastPlay;
	}
	if(allowed.indexOf(currentGuess) != -1 || answers[0].indexOf(currentGuess) != -1){	//If guess is a legal word
		document.getElementById("columnMarker").style.left = "-10000px";
		document.getElementById("rowMarker").style.top = "-10000px";
		if(guessNr == 0){
			if(!fp){
				//testC.push(gameId);
				//createTestCookie();
			}
			if(!replay && !fp){
				if(gameType == DAILY){
					if(parseInt(gameId.substring(5), 10) - lastDailyPlayed > 1 && lastDailyPlayed > 30){
//						currentStreak[DAILY] = 0;	//Kill daily streak.
					}
					lastDailyPlayed = parseInt(gameId.substring(5), 10);	//substring(5) to remove "DAILY" form gameId.
				}else if(gameType == WEEKLY){
					if(parseInt(gameId.substring(5), 10) - lastWeeklyPlayed > 1){
						currentStreak[WEEKLY] = 0;	//Kill weekly streak.
					}
					lastWeeklyPlayed = parseInt(gameId.substring(5), 10);	//substring(5) to remove "LWEEK" form gameId.
				}
				createSquardleCookie();
			}
		}
		if(!fp){
			//testC.push(currentGuess);
			//createTestCookie();
		}
		remainingGuesses--;
		gameGuesses.push(currentGuess);
		updateRemaining(remainingGuesses);
		gameState = 1;
		var usedLettersCol = [];
		var usedLettersRow = [];
		var isGreen = [];
		var isRed = [];
		var isYellow = [];
		var redCount = [];
		var yellowCount = [];
		for(x=0; x<5; x++){
			isGreen[x] = [];
			isRed[x] = [];
			isYellow[x] = [];
			redCount[x] = [];
			yellowCount[x] = [];
			for(y=0; y<5; y++){
				isGreen[x][y] = false;
				isRed[x][y] = false;
				isYellow[x][y] = false;
				redCount[x][y] = 0;
				yellowCount[x][y] = 0;
				usedLettersCol[x] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				usedLettersRow[y] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			}
		}
		for(x=0; x<5; x++){
			for(y=0; y<5; y++){
				if(x == guessCR || y == guessCR){
					var ss = x;
					if(x == guessCR){
						ss = y;
					}
					if(playerNotes[x][y].toLowerCase() == currentGuess.charAt(ss)){	//Auto-hide notes if you guessed that letter there.
						playerNotes[x][y] = "0";
						setSquareColor(x, y, "gray");
					}
					if(currentGuess.charAt(ss) == square[x][y]){	//Green
						isGreen[x][y] = true;
						bestClues[x][y] = "green";
						usedLettersCol[x][alpha.indexOf(currentGuess.charAt(ss))]++;
						usedLettersRow[y][alpha.indexOf(currentGuess.charAt(ss))]++;
					}
				}
			}
		}
		for(x=0; x<5; x++){
			for(y=0; y<5; y++){
				if(!onBoard(x, y)){		//(x==1 || x==3) && (y==1 || y==3)
					y++;
				}
				if(x == guessCR || y == guessCR){
					var ss = x;
					if(x == guessCR){
						ss = y;
					}
					if(wordsUsed[x].indexOf(currentGuess.charAt(ss)) != -1){		//Count for small squardle-style clues (ie that can have double arrows).
						var letterRegExp = new RegExp(currentGuess.charAt(ss), "g");
						var ansFreq = wordsUsed[x].match(letterRegExp)
						if(!ansFreq){
							ansFreq = 0;
						}else{
							ansFreq = ansFreq.length;
						}
						redCount[x][y] = Math.min(currentGuess.match(letterRegExp).length, ansFreq);
						if(x != guessCR){
							redCount[x][y] = Math.min(redCount[x][y], 1); //Can't get double-letter info 
						}
					}
					if(wordsUsed[y+5].indexOf(currentGuess.charAt(ss)) != -1){
						var letterRegExp = new RegExp(currentGuess.charAt(ss), "g");
						var ansFreq = wordsUsed[y+5].match(letterRegExp)
						if(!ansFreq){
							ansFreq = 0;
						}else{
							ansFreq = ansFreq.length;
						}
						yellowCount[x][y] = Math.min(currentGuess.match(letterRegExp).length, ansFreq);
						if(y != guessCR){
							yellowCount[x][y] = Math.min(yellowCount[x][y], 1); //Can't get double-letter info 
						}
					}
				}
			}
		}
		var  toGa = "";
		var solvedNew = false;
		for(x=0; x<5; x++){
			for(y=0; y<5; y++){
				if(!onBoard(x, y)){	//(x==1 || x==3) && (y==1 || y==3)
					y++;
				}
				if(x == guessCR || y == guessCR){
					var ss = x;
					if(x == guessCR){
						ss = y;
					}
					if(isGreen[x][y]){	//Green
						toGa += "G";
						setSquareColor(x, y, "green");
						if(!solvedSquares[x][y]){
							/*
							if(gameType == DAILY && !fastPlay){ 
								if(!replay && !fp){
									var solvedBefore = countSolvedSquares();
									solvedDailyRecord[solvedBefore] = solvedDailyRecord[solvedBefore] -1;
									solvedDailyRecord[solvedBefore+1] = solvedDailyRecord[solvedBefore+1] +1;
									createRecordsCookie(gameType);
								}
							}if(gameType == WEEKLY && !fastPlay){ 
								if(!replay && !fp){
									var solvedBefore = countSolvedSquares();
									solvedWeeklyRecord[solvedBefore] = solvedWeeklyRecord[solvedBefore] -1;
									solvedWeeklyRecord[solvedBefore+1] = solvedWeeklyRecord[solvedBefore+1] +1;
									createRecordsCookie(gameType);
								}
							}else if(gameType == FREE && !fastPlay){ 
								if(!replay && !fp){
									var solvedBefore = countSolvedSquares();
									solvedFreeplayRecord[solvedBefore] = solvedFreeplayRecord[solvedBefore] -1;
									solvedFreeplayRecord[solvedBefore+1] = solvedFreeplayRecord[solvedBefore+1] +1;
									createRecordsCookie(gameType);
								}
							}*/
							solvedNew = true;
							solvedSquares[x][y] = true;
						}
						setKeyColor(currentGuess.charAt(ss), "graphics/light.png")
//						document.getElementById("key_"+currentGuess.charAt(ss)).src ="graphics/light.png";
						keyboardColorMemory[alpha.indexOf(currentGuess.charAt(ss))] = "graphics/light.png";
					}else if(redCount[x][y] > 0 && yellowCount[x][y] > 0){	//Orange
						toGa += "O";
						setSquareColor(x, y, "orange"+redCount[x][y]+yellowCount[x][y]);
						setKeyColor(currentGuess.charAt(ss), "graphics/light.png")
//						document.getElementById("key_"+currentGuess.charAt(ss)).src ="graphics/light.png";	
						keyboardColorMemory[alpha.indexOf(currentGuess.charAt(ss))] ="graphics/light.png";
					}else if(yellowCount[x][y] > 0){	//Yellow
						toGa += "Y";
						setSquareColor(x, y, "yellow"+redCount[x][y]+yellowCount[x][y]);
						document.getElementById("key_"+currentGuess.charAt(ss)).src ="graphics/light.png";	
						keyboardColorMemory[alpha.indexOf(currentGuess.charAt(ss))] ="graphics/light.png";
					}else if(redCount[x][y] > 0){	//Red
						toGa += "R";
						setSquareColor(x, y, "red"+redCount[x][y]+yellowCount[x][y]);
						setKeyColor(currentGuess.charAt(ss), "graphics/light.png")
//						document.getElementById("key_"+currentGuess.charAt(ss)).src ="graphics/light.png";	
						keyboardColorMemory[alpha.indexOf(currentGuess.charAt(ss))] ="graphics/light.png";
					}else if(allLettersInSquare.indexOf(currentGuess.charAt(ss)) != -1){	//White
						toGa += "W";
						setSquareColor(x, y, "white");
						setKeyColor(currentGuess.charAt(ss), "graphics/light.png")
//						document.getElementById("key_"+currentGuess.charAt(ss)).src ="graphics/light.png";	
						keyboardColorMemory[alpha.indexOf(currentGuess.charAt(ss))] ="graphics/light.png";
					}else{																	//Black
						toGa += "B";
						setSquareColor(x, y, "black");
						setKeyColor(currentGuess.charAt(ss), "graphics/black.png")
//						document.getElementById("key_"+currentGuess.charAt(ss)).src ="graphics/black.png";	
						keyboardColorMemory[alpha.indexOf(currentGuess.charAt(ss))] = "graphics/black.png";
					}
					if(isGreen[x][y]){																	//Slightly different logic for small squares due to the repeated letters in guess-issue.
						makeSmallSquare(x, y, "green", currentGuess.charAt(ss), -1);
					}else if(redCount[x][y] > 0 && yellowCount[x][y] > 0){
						makeSmallSquare(x, y, "orange"+redCount[x][y]+yellowCount[x][y], currentGuess.charAt(ss), -1);
					}else if(redCount[x][y] > 0){
						makeSmallSquare(x, y, "redder"+redCount[x][y]+yellowCount[x][y], currentGuess.charAt(ss), -1);
					}else if(yellowCount[x][y] > 0){
						makeSmallSquare(x, y, "yellow"+redCount[x][y]+yellowCount[x][y], currentGuess.charAt(ss), -1);						
					}else if(allLettersInSquare.indexOf(currentGuess.charAt(ss)) != -1){
						makeSmallSquare(x, y, "white", currentGuess.charAt(ss), -1);
					}else{
						makeSmallSquare(x, y, "blacker", currentGuess.charAt(ss), -1);
					}
				}
			}
		}
		setSmallSquareOpacity(guessCR, OPAC_MID);
		if((guessNr == 2 && gameType != WEEKLY) || (guessNr == 4 && gameType == WEEKLY)){
			emojiAfterThree = getEmoji();
		}
		checkForSolvedWords();
		ga('send', 'event',  'Squardle', 'Guess_'+lang+'_'+gameType, guessNr+"_"+currentGuess+"_"+guessCR+"_"+solvedColRows.length+"_"+toGa+"_"+gameId);
		if(!fastPlay){
			removeBigTimer[guessNr] = setTimeout("removeBigClues("+guessNr+")", 5000);
		}else{
			removeBigClues(guessNr);
		}
		createSquardleCookie();
	}else{ //Guess not in dictionary. (Illegal guess.)
		clearTimeout(clearRedLettersTimer);
		clearRedLettersTimer = setTimeout("clearRedLetters()", 2000);
		gameState = 2;
		for(xy=0; xy<5; xy++){
			var setTo = currentGuess.charAt(xy);
			document.getElementById(guessCR+"L"+xy).src =  preloadedImages[alpha.indexOf(setTo)+29].src;
			document.getElementById(xy+"L"+guessCR).src =  preloadedImages[alpha.indexOf(setTo)+29].src;
		}
	}
}
function clearRedLetters(){
	gameState = 0;
	for(x=0; x<currentGuess.length ; x++){
		var setTo = currentGuess.charAt(x);
		document.getElementById(guessCR+"L"+x).src = preloadedImages[alpha.indexOf(setTo)].src;
		document.getElementById(x+"L"+guessCR).src = preloadedImages[alpha.indexOf(setTo)].src;
	}
}
function progressGuessCR(){
	guessCR += 2;
	if(gameType == WEEKLY){
		guessCR--;
	}
	if(guessCR >= 5){
		guessCR = 0;
	}
	var completed = 0;
	if(gameType == WEEKLY){
		while(completed < 5 && solvedColRows.indexOf(guessCR) != -1 && solvedColRows.indexOf(guessCR+5) != -1){
			guessCR++;
			if(guessCR >= 5){
				guessCR = 0;
			}		
		}
		if(completed == 5){	//(Game won)
			return(true);
		}
	}else{
		while(completed < 3 && solvedColRows.indexOf(guessCR) != -1 && solvedColRows.indexOf(guessCR+5) != -1){
			guessCR += 2;
			if(guessCR >= 5){
				guessCR = 0;
			}		
		}
		if(completed == 3){	//(Game won)
			return(true);
		}
	}
	if(gameType == WEEKLY){//Check for only unsolved squares in a single row or column without holes starts
		var unsolvedInCols = [false,false,false,false,false];	
		var unsolvedInRows = [false,false,false,false,false];
		for(xs=0; xs<5; xs++){
			for(ys=0; ys<5; ys++){
				if(onBoard(xs, ys)){
					if(!solvedSquares[xs][ys]){
						unsolvedInCols[ys] = true;
						unsolvedInRows[xs] = true;
					}
				}
			}
		}
		var inC = 0, inR = 0, toUseC = -1, toUseR = -1;
		for(cw=0; cw<5; cw++){
			if(unsolvedInCols[cw]){
				inC++;
				toUseC = cw;
			}
			if(unsolvedInRows[cw]){
				inR++;
				toUseR = cw
			}
		}
		if(inC == 1 && inR != 1){		//If there's unsolved squares in a single column but in more than one row...
			if(onBoard(toUseC, 1)){		//...and that column's not one with holes in it...
				guessCR = toUseC;		//...move to that column.
			}
		}else if(inR == 1 && inC != 1){		//If there's unsolved squares in a single row but in more than one column...
			if(onBoard(toUseR, 1)){		//...and that row's not one with holes in it...
				guessCR = toUseR;		//...move to that row.
			}
		}
	}//Check for only unsolved squares in a single row or column without holes ends
	document.getElementById("columnMarker").style.left = (guessCR*120+55) + "px";
	document.getElementById("rowMarker").style.top = (guessCR*120+125) + "px";
}
function findWords(clue){
	var start = Math.floor(genrand_real1() * answers[preShuffle].length);	//This isn't needed if the list is already shuffled. But given we're using a set of different deterministic shuffles it speed up generation it's maybe needed to not possible exclude some words.
	var ret = [];
	for(all=start; all<answers[preShuffle].length+start; all++){
		ok = true;
		for(pos=0; pos<5; pos++){
			if(clue.charAt(pos) != "_" && clue.charAt(pos) != answers[preShuffle][all % answers[preShuffle].length].charAt(pos)){
				ok = false;
				break;
			}
		}
		if(ok){
			return(answers[preShuffle][all % answers[preShuffle].length]);
		}
	}
	return(false);
}

function setSmallSquareOpacity(coRo, opac){		//Sets opac for a full column or row of small clue background at start and end of showing big clues. Also makes the new clue visible at the end of this. Not to be confused with fadeSmallSquare(x, y, guessNr) that sets opac for a single clue the user clicks.
	for(xo=0; xo<5; xo++){
		for(yo=0; yo<5; yo++){
			if(xo == coRo || yo == coRo){
				for(gn=0; gn<16; gn++){	//If removing fade-out, also include the new small clues.
					if(opac == OPAC_HIGH || gn != guessNr){
						if(smallSquares[xo][yo][gn][SQUARE_DIV]){
							if(!smallSquares[xo][yo][gn][IS_FADED]){	//Only change opacity if the square isn't already faded by user keeping notes.
								smallSquares[xo][yo][gn][SQUARE_DIV].style.opacity = opac;
								if(opac == "1" && gn == guessNr){
						//			smallSquares[xo][yo][guessNr][SQUARE_DIV].style.visibility = "visible";
									smallSquares[xo][yo][guessNr][LETTER_DIV].style.visibility = "visible";
								}
							}
						}
					}
				}
			}
		}
	}
}
function makeSmallSquare(x, y, color, letter){
	smallSquares[x][y][guessNr][SQUARE_DIV] = document.createElement('div');
	smallSquares[x][y][guessNr][SQUARE_DIV].id = "small_"+x+"_"+y+"_"+guessNr;
	smallSquares[x][y][guessNr][SQUARE_DIV].innerHTML = '<img src="graphics/'+color+'.png" width="28" height="28" id="smallImg'+x+'_'+y+'_'+guessNr+'">';
	smallSquares[x][y][guessNr][CLUE_SRC] = 'graphics/' + color + '.png';
	document.body.appendChild(smallSquares[x][y][guessNr][SQUARE_DIV])
	smallSquares[x][y][guessNr][SQUARE_DIV].style.zIndex = "420";
	smallSquares[x][y][guessNr][SQUARE_DIV].style.position = "absolute";
	smallSquares[x][y][guessNr][SQUARE_DIV].style.opacity = "0";
	smallSquares[x][y][guessNr][LETTER_DIV] = document.createElement('div');
	smallSquares[x][y][guessNr][LETTER_DIV].id = "small_letter_"+x+"_"+y+"_"+guessNr;
	var whiteLetter = "";
	if(color == "blacker" || color.indexOf("redder") != -1){
		whiteLetter = "white/"
	}
	smallSquares[x][y][guessNr][LETTER_DIV].innerHTML = '<img src="graphics/'+whiteLetter+letter+'.png" width="28" height="28" id="smallLetter'+x+'_'+y+'_'+guessNr+'" onclick="clickSmallSquare('+x+', '+y+', '+guessNr+')">';
	document.body.appendChild(smallSquares[x][y][guessNr][LETTER_DIV])
	smallSquares[x][y][guessNr][LETTER_DIV].style.zIndex = "490";
	smallSquares[x][y][guessNr][LETTER_DIV].style.position = "absolute";
	smallSquares[x][y][guessNr][LETTER_DIV].style.visibility = "hidden";
	smallSquares[x][y][guessNr][LETTER_DIV].style.left = ((x*120+14)+(guessPos[guessNr][X]))+"px";
	smallSquares[x][y][guessNr][LETTER_DIV].style.top = ((y*120+84)+(guessPos[guessNr][Y]))+"px";
	smallSquares[x][y][guessNr][SQUARE_DIV].style.left = ((x*120+14)+(guessPos[guessNr][X]))+"px";
	smallSquares[x][y][guessNr][SQUARE_DIV].style.top = ((y*120+84)+(guessPos[guessNr][Y]))+"px";
	smallSquares[x][y][guessNr][IS_FADED] = 0;
	if(color.indexOf("red") != -1){
		color = "red";
	}else if(color.indexOf("yellow") != -1){
		color = "yellow";
	}else if(color.indexOf("orange") != -1){
		color = "orange";
	}else if(color.indexOf("black") != -1){
		color = "black";
	}
	if(clueOrder.indexOf(bestClues[x][y]) < clueOrder.indexOf(color)){
		bestClues[x][y] = color;
	}
	if(!fp){
		if((autoHideGreen && color == "green") || (autoHideBlack && color == "black")){
			for(twice=0; twice<2; twice++){	
				clickSmallSquare(x, y, guessNr);
			}
			smallSquares[x][y][guessNr][SQUARE_DIV].style.visibility = "hidden";
		}if(autoHideRepeated){
			var toCheckFor = document.getElementById("smallImg" + x + "_" + y + "_" + guessNr).src + document.getElementById("smallLetter" + x + "_" + y + "_" + guessNr).src.replace("white/", "");
			for(gLower=0; gLower<guessNr; gLower++){
				if(document.getElementById("smallImg" + x + "_" + y + "_" + gLower)){
					if(document.getElementById("smallImg" + x + "_" + y + "_" + gLower).src.replace("tiny/", "") + document.getElementById("smallLetter" + x + "_" + y + "_" + gLower).src.replace("white/", "") == toCheckFor){
						for(twice=0; twice<2; twice++){	
							clickSmallSquare(x, y, guessNr);
						}
						smallSquares[x][y][guessNr][SQUARE_DIV].style.visibility = "hidden";
						break;
					}
				}
			}
		}
	}
}
function clickSmallSquare(x, y, gn){
	if(gameState == 3){	//If making a blue note, first reverse guess/certain since it'll be reversed again in a moment...
		if(playerNotes[makingNote[0]][makingNote[1]] != "0"){
			if(playerNotes[makingNote[0]][makingNote[1]] == playerNotes[makingNote[0]][makingNote[1]].toUpperCase()){
				playerNotes[makingNote[0]][makingNote[1]] = playerNotes[makingNote[0]][makingNote[1]].toLowerCase()
			}else{
				playerNotes[makingNote[0]][makingNote[1]] = playerNotes[makingNote[0]][makingNote[1]].toUpperCase()
			}
			eitherKey("Enter", false, false); //...then cancel making the clue.
		}else{
			eitherKey("Backspace", false, false); //...then cancel making the clue.
		}
	}
	fadeSmallSquare(x, y, gn, true)
	justFocusMan();
}


function fadeSmallSquare(x, y, gn, changeFade){		//Swaps fading status of a clue and saves it in a cookie.
	if(changeFade){
		smallSquares[x][y][gn][IS_FADED] = (smallSquares[x][y][gn][IS_FADED] + 1) % 3;
	}
	if(smallSquares[x][y][gn][IS_FADED] == 1){	
		smallSquares[x][y][gn][SQUARE_DIV].style.opacity = OPAC_LOW;
		smallSquares[x][y][gn][LETTER_DIV].style.opacity = OPAC_LOW;
		document.getElementById("smallImg"+x+"_"+y+"_"+gn).src = smallSquares[x][y][gn][CLUE_SRC];
	}else if(smallSquares[x][y][gn][IS_FADED] == 2){
		smallSquares[x][y][gn][SQUARE_DIV].style.opacity = "1";
		document.getElementById("smallImg"+x+"_"+y+"_"+gn).src = "graphics/tiny" +smallSquares[x][y][gn][CLUE_SRC].substring(8);
		smallSquares[x][y][gn][LETTER_DIV].style.opacity = "0"; 
	}else if(smallSquares[x][y][gn][IS_FADED] == 0){
		document.getElementById("smallImg"+x+"_"+y+"_"+gn).src = smallSquares[x][y][gn][CLUE_SRC];
	;
		smallSquares[x][y][gn][SQUARE_DIV].style.opacity = "1";
		smallSquares[x][y][gn][LETTER_DIV].style.opacity = "1";
	}
	createSquardleCookie();
}
function makeMidSquare(x, y){
	midSquares[x][y] = document.createElement('div');
	midSquares[x][y].id = "mid_"+x+"_"+y;
	midSquares[x][y].innerHTML = '<img src="graphics/0.png" width="56" height="56">';
	document.body.appendChild(midSquares[x][y])
	midSquares[x][y].style.zIndex = "421";
	midSquares[x][y].style.opacity = 0.6;
	midSquares[x][y].style.position = "absolute";
	midSquares[x][y].style.left = (x*120+14+28)+"px";
	midSquares[x][y].style.top = (y*120+84+28)+"px";
}
var measuredFreq = [];
var letter1_1 = [];
var rMF = 0;
var upCount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var hasBeenUp = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
var hasBeenDown = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
var hasBeenStable = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
var calcNewRate = [];
var errorFound = [];
var errorTotal = [100];	//Previous error.
var errorTotalLow = 100;
var sampleSize = 600;
var evolutionTimer;
var logFactor = 0.005;	//Was 0.008
var oldFreqComp = [];
function measureFreq(){/*
	for(le=0; le<alpha.length; le++){
		measuredFreq[le] = 0;
	}
	var RMFStart = rMF
	for(r=rMF; r<RMFStart+sampleSize; r++){
		rMF++;
		if(r % 200 == 0){
			console.log(r+" mf:"+measuredFreq);
		}
		init_genrand(Math.floor(Math.random()*100000));
		clearSquare()
		wordsUsed = [];
		gameId = r;
		gameIsOver = true;
		var firstTry = makeSquare(true, 3);
		if(firstTry){
			for(xf=0; xf<5; xf+=2){
				for(yf=0; yf<5; yf+=2){
					if(square[xf][yf] != "_"){
						measuredFreq[alpha.indexOf(square[xf][yf])]++;
					}
				}
			}
		}
	}
	var freqSum = 0;
	for(li=0; li<alpha.length; li++){
		freqSum += measuredFreq[li];
	}
	if(freqSum != 0){
		errorTotal.push(0);
		for(li=0; li<alpha.length; li++){
//		for(li=13; li<alpha.length; li+=13){	//Count only N and Ñ
			calcNewRate[li] = (measuredFreq[li]/freqSum);
			errorFound[li] = goalFreqSv[li] - calcNewRate[li];
			errorTotal[errorTotal.length-1] += Math.abs(errorFound[li])
		}
		var exponentChange = 3;
		if(errorTotal.length > 1){
			if(errorTotal[errorTotal.length-1] > errorTotal[errorTotal.length-2]){	//If the total error grew...
				logFactor = logFactor*0.9;											//...make smaller changes as to not overshoot...
//				sampleSize = sampleSize * 1.08;										//...and get a better sample size to eliminate random noise.
				if(sampleSize > 3000){
//					sampleSize = 3000;
				}
				console.log("Worse: "+errorTotal[errorTotal.length-1]);
				for(li=0; li<alpha.length; li++){
					freqComp[li] = ([...oldFreqComp][li] + freqComp[li])/2
				}
				console.log(freqComp +" is the HALFWAY freqComp we just sorta reverted to.");
				errorTotal.length = errorTotal.length - 1;
				errorTotal[errorTotal.length-1] = errorTotal[errorTotal.length-1] * 1.003;	//Increase what counts as an improvement slightly to not get stuck after getting a really luckyly low error rate by chance.
			}else{
				console.log("Better");
				console.log(freqComp +" is the previous freqComp");
				oldFreqComp = [...freqComp];
				logFactor = logFactor * (10/9) * 0.99;					//Otherwise do the reverse...
//				sampleSize = sampleSize * (100/108) * 1.01;				//...but less severe.
				for(li=0; li<alpha.length; li++){						//Mutate the freqComp only if it got better.
//				for(li=13; li<alpha.length; li+=13){					//Mutate only N and Ñ
					freqComp[li] = freqComp[li] * (Math.pow(1+errorFound[li], exponentChange));
				}
				console.log(freqComp +" is the new freqComp");
				if(errorTotal[errorTotal.length-1] < errorTotalLow){
					errorTotalLow = errorTotal[errorTotal.length-1];
				}
			}
			exponentChange = Math.min(exponentChange, errorTotal[errorTotal.length-1]*10*logFactor)
		}else{
			oldFreqComp = [...freqComp];
		//	for(li=0; li<alpha.length; li++){										//Always mutate the freqComp after first iteration...
		//		freqComp[li] = freqComp[li] * (Math.pow(1+errorFound[li], exponentChange * 0.1));	//...so go gentle. * 0.1 to not have bad sample size screw previous progress.
		//	}
			errorTotalLow = errorTotal[errorTotal.length-1];
			console.log("First");
			console.log(freqComp +" is the new freqComp");
		}
	}
	compSum = 0;
	for(lq=0; lq<alpha.length; lq++){
		compSum += freqComp[lq];
	}
	console.log("logFactor: "+logFactor+ " sampleSize:"+ Math.round(sampleSize));
	console.log("errorTotal: "+errorTotal + " Lowest: "+errorTotalLow);

	//	var outputWindow = window.open(freqComp, "freqResultWindow");
//	window.focus();
	evolutionTimer = setTimeout("measureFreq()", 2000)*/
}
function countDictFreq(){
	for(le=0; le<alpha.length; le++){
		letter1_1[le] = 0;
	}
	for(ans=0; ans<answers[0].length; ans++){
		letter1_1[alpha.indexOf(answers[0][ans].charAt(0))]++;
		letter1_1[alpha.indexOf(answers[0][ans].charAt(2))]++;
		letter1_1[alpha.indexOf(answers[0][ans].charAt(4))]++;
	}
	console.log(letter1_1+ " out of "+(answers[0].length*3));
	var outFreq = ""
	for(fr=0; fr<alpha.length; fr++){
		outFreq += (letter1_1[fr]/(answers[0].length*3))+",";
	}
	console.log(outFreq);

}
function setMidSquare(xm, ym, showSolution, isNote){
	if(onBoard(xm, ym)){	//(xm!=1 && xm!=3) || (ym!=1 && ym!=3)
		if(showSolution && solvedSquares[xm][ym]){
			midSquares[xm][ym].innerHTML = '<img src="graphics/'+square[xm][ym]+'.png" width="56" height="56">';
		}else if(isNote){	//Setting note square;
			midSquares[xm][ym].innerHTML = '<img src="graphics/'+playerNotes[xm][ym].toLowerCase()+'.png" width="56" height="56">';
		}else{
			midSquares[xm][ym].innerHTML = '<img src="graphics/0.png" width="56" height="56">';
		}
	}
}
var mouseUser = false;
function movedMouse(e){
	if(mouseUser){
		return(true);
	}else{
		if(window.screen.width >= 1000){
			document.getElementById("puzzleBoxPlug").style.display = 'inline';
		}
		mouseUser = true;
	}
}
var preIndex = -100;
var preResult = []; 
function getLetter(){
	compSum = 0;
	for(lq=0; lq<alpha.length; lq++){
		compSum += freqComp[lq];
	}
	var rndComp = genrand_real1()*compSum;
	for(compLetter = 0; compLetter<alpha.length; compLetter++){
		if(freqComp[compLetter] >= rndComp){
			return(alpha.charAt(compLetter));
		}
		rndComp -= freqComp[compLetter];
	}
//	alert("This shouldn't happen....");
}
var showGameEndBoxTimer
function showSolution(step){
	if(gameIsOver){
		if(step == 0 || step == -1){
		//	document.getElementById("gameOver").style.visibility = "hidden";
			document.getElementById("seeSolution").style.visibility = "hidden";
			if(document.getElementById("gameEndBox").style.display == "inline"){
				weeklyEndScreen();
				document.getElementById("tipJar").style.visibility = "visible";
			}
			if(step == -1 && countSolvedSquares() == 25){
				showGameEndBoxTimer = setTimeout("weeklyEndScreen()", 4000);
				step = 0;
			}
			for(x=0; x<5; x++){
				for(y=0; y<5; y++){
					if(onBoard(x, y)){
						document.getElementById(x+"L"+y).src = "graphics/0.png";
					}
				}
			}
		}
		for(x=0; x<5; x++){
			for(y=0; y<5; y++){
				if(onBoard(x, y)){	//(x!=1 && x!=3) || (y!=1 && y!=3)
					if(x + y <= step){
//						document.getElementById(x+"_"+y).src = "graphics/green.png";
						document.getElementById(x+"L"+y).src =  preloadedImages[alpha.indexOf(square[x][y])].src;
						setMidSquare(x, y, false, false);
					}
				}
			}
		}
		if(step < 8){
			showSolutionTimer = setTimeout("showSolution("+(step+1)+")", 300);
		}
	}
}
var copyTextareaBtn = document.querySelector('.js-textareacopybtn');
function getEmoji(){
	var ret = "";
	if(String.fromCodePoint){
		for(y=0; y<5; y++){
			ret += "\n";
			for(x=0; x<5; x++){
				if(!onBoard(x, y)){	//(x==1 || x==3) && (y==1 || y==3)
					ret += String.fromCodePoint(0x1f533);	//Not present
				}else if(bestClues[x][y] == "green"){
					ret += String.fromCodePoint(0x1f7e9);
				}else if(bestClues[x][y] == "orange"){
					ret += String.fromCodePoint(0x1f7e7);
				}else if(bestClues[x][y] == "red"){
					ret += String.fromCodePoint(0x1f7e5);
				}else if(bestClues[x][y] == "yellow"){
					ret += String.fromCodePoint(0x1f7e8);
				}else if(bestClues[x][y] == "white"){
					ret += String.fromCodePoint(0x2b1c);
				}else{
					ret += String.fromCodePoint(0x2b1b);	//Black
				}
			}
		}
	}else{
		return("\nString.fromCodePoint is not supported if your broswer.\nSo no emoji grid generated. =(")
	}
	return(ret);
}
function countSolvedSquares(){
	var ret = 0;
	for(yy=0; yy<5; yy++){
		for(xx=0; xx<5; xx++){
			if(solvedSquares[xx][yy]){
				ret++;
			}
		}
	}
	return(ret);
}
/*
remaining.onselect = clearSelection;
function clearSelection(){
	alert("clear called")
	if (window.getSelection) {
		window.getSelection().removeAllRanges();}
	else if (document.selection) {
		document.selection.empty(); 
	}
}
*/
function emojiResult() {
	if(lang == "sv"){
		if(gameType == FREE && countSolvedSquares() != 21){
			copyTextarea.value = "Jag löste "+countSolvedSquares()+"/21 rutor i Squardle på svenska!"+getEmoji()+"\nSpela mitt bräde här:\nhttps://fubargames.se/squardle/?s=" + gameId + "&l=sv";
		}else if(gameType == FREE && countSolvedSquares() == 21 && remainingGuesses == 1){
			copyTextarea.value = "Jag vann i Squardle på svenska och fick en gissning över!\nMitt bräde efter 3 gissningar:"+emojiAfterThree+"\Spela mitt bräde här:\nhttps://fubargames.se/squardle/?s=" + gameId + "&l=sv";
		}else if(gameType == FREE && countSolvedSquares() == 21 && remainingGuesses == 0){
			copyTextarea.value = "Jag vann i Squardle på svenska på min sista gissning!\nMitt bräde efter 3 gissningar:"+emojiAfterThree+"\nSpela mitt bräde här:\nhttps://fubargames.se/squardle/?s=" + gameId + "&l=sv";
		}else if(gameType == FREE && countSolvedSquares() == 21 && remainingGuesses != 1){
			copyTextarea.value = "Jag vann i Squardle på svenska och fick " + remainingGuesses + " gissningar över!\nMitt bräde efter 3 gissningar:" +emojiAfterThree+ "\nSpela mitt bräde här:\nhttps://fubargames.se/squardle/?s=" + gameId + "&l=sv";
		}else if(gameType == DAILY && countSolvedSquares() != 21){
			copyTextarea.value = "Jag lösde "+countSolvedSquares()+"/21 rutor i dagens Squardle på svenska! Dag #"+lastDailyPlayed+getEmoji()+"\nhttps://fubargames.se/squardle/?l=sv";
		}else if(gameType == DAILY && countSolvedSquares() == 21 && remainingGuesses == 1){
			copyTextarea.value = "Jag vann dag #"+lastDailyPlayed+" i Squardle på svenska och fick en gissning över!\nMitt bräde efter 3 gissningar:"+emojiAfterThree+"\nhttps://fubargames.se/squardle/?l=sv";
		}else if(gameType == DAILY && countSolvedSquares() == 21 && remainingGuesses == 0){
			copyTextarea.value = "Jag vann dag #"+lastDailyPlayed+" i Squardle på svenska på min sista gissning!\nMitt bräde efter 3 gissningar:"+emojiAfterThree+"\nhttps://fubargames.se/squardle/?l=sv";
		}else if(gameType == DAILY && countSolvedSquares() == 21 && remainingGuesses != 1){
			copyTextarea.value = "Jag vann dag #"+lastDailyPlayed+" av Squardle på svenska och fick " + remainingGuesses + " gissningar över!\nMitt bräde efter 3 gissningar:" +emojiAfterThree+ "\nhttps://fubargames.se/squardle/?l=sv";
		}else if(gameType == WEEKLY && countSolvedSquares() != 25){
			copyTextarea.value = "Jag lösde "+countSolvedSquares()+"/25 rutor i Vecko-Squardle på svenska! Vecka #"+lastWeeklyPlayed+getEmoji()+"\nhttps://fubargames.se/squardle/?l=sv";
		}else if(gameType == WEEKLY && countSolvedSquares() == 25 && remainingGuesses == 1){
			copyTextarea.value = "Jag vann vecka #"+lastWeeklyPlayed+" i Vecko-Squardle på svenska och fick en gissning över!\nMitt bräde efter 5 gissningar:"+emojiAfterThree+"\nhttps://fubargames.se/squardle/?l=sv";
		}else if(gameType == WEEKLY && countSolvedSquares() == 25 && remainingGuesses == 0){
			copyTextarea.value = "Jag vann vecka #"+lastWeeklyPlayed+" i Vecko-Squardle på svenska på min sista gissning!\nMitt bräde efter 5 gissningar:"+emojiAfterThree+"\nhttps://fubargames.se/squardle/?l=sv";
		}else if(gameType == WEEKLY && countSolvedSquares() == 25 && remainingGuesses != 1){
			copyTextarea.value = "Jag vann vecka #"+lastWeeklyPlayed+" av Vecko-Squardle på svenska och fick " + remainingGuesses + " gissningar över!\nMitt bräde efter 5 gissningar:" +emojiAfterThree+ "\nhttps://fubargames.se/squardle/?l=sv";
		}
	}else{
		var langStr = ""
		if(lang == "br"){
			langStr = " (PT-BR)"
		}else if(lang != "en"){			
			langStr = " (" + lang.toUpperCase() + ")";
		}
		/*
		if(gameType == FREE && countSolvedSquares() != 21){
			copyTextarea.value = "I solved "+countSolvedSquares()+"/21 squares in"+langStr+" Squardle!"+getEmoji()+"\nPlay this Squardle board here:\nhttp://fubargames.se/squardle/?s=" + gameId + "\nServer's having SSL-issues right now, so try removing the 's' in https and load the http version in incognito mode.";
		}else if(gameType == FREE && countSolvedSquares() == 21 && remainingGuesses == 1){
			copyTextarea.value = "I won Squardle"+langStr+" with 1 guess to spare!\nBoard after 3 guesses:"+emojiAfterThree+"\nPlay this Squardle board here:\nhttp://fubargames.se/squardle/?s=" + gameId + "\nServer's having SSL-issues right now, so try removing the 's' in https and load the http version in incognito mode.";
		}else if(gameType == FREE && countSolvedSquares() == 21 && remainingGuesses == 0){
			copyTextarea.value = "I won Squardle"+langStr+" on my final guess!\nBoard after 3 guesses:"+emojiAfterThree+"\nPlay this Squardle board here:\nhttp://fubargames.se/squardle/?s=" + gameId + "\nServer's having SSL-issues right now, so try removing the 's' in https and load the http version in incognito mode.";
		}else if(gameType == FREE && countSolvedSquares() == 21 && remainingGuesses != 1){
			copyTextarea.value = "I won Squardle"+langStr+" with " + remainingGuesses + " guesses to spare!\nBoard after 3 guesses:" +emojiAfterThree+ "\nPlay this Squardle board here:\nhttp://fubargames.se/squardle/?s=" + gameId + "\nServer's having SSL-issues right now, so try removing the 's' in https and load the http version in incognito mode.";
		}else if(gameType == DAILY && countSolvedSquares() != 21){
			copyTextarea.value = "I solved "+countSolvedSquares()+"/21 squares in Daily Squardle"+langStr+" #"+lastDailyPlayed+getEmoji()+"\nhttp://fubargames.se/squardle/" + "\nServer's having SSL-issues right now, so try removing the 's' in https and load the http version in incognito mode.";
		}else if(gameType == DAILY && countSolvedSquares() == 21 && remainingGuesses == 1){
			copyTextarea.value = "I won Daily Squardle"+langStr+" #"+lastDailyPlayed+" with 1 guess to spare!\nBoard after 3 guesses:"+emojiAfterThree+"\nhttp://fubargames.se/squardle/" + "\nServer's having SSL-issues right now, so try removing the 's' in https and load the http version in incognito mode.";
		}else if(gameType == DAILY && countSolvedSquares() == 21 && remainingGuesses == 0){
			copyTextarea.value = "I won Daily Squardle"+langStr+" #"+lastDailyPlayed+" on my final guess!\nBoard after 3 guesses:"+emojiAfterThree+"\nhttp://fubargames.se/squardle/" + "\nServer's having SSL-issues right now, so try removing the 's' in https and load the http version in incognito mode.";
		}else if(gameType == DAILY && countSolvedSquares() == 21 && remainingGuesses != 1){
			copyTextarea.value = "I won Daily Squardle"+langStr+" #"+lastDailyPlayed+" with " + remainingGuesses + " guesses to spare!\nBoard after 3 guesses:" +emojiAfterThree+ "\nhttp://fubargames.se/squardle/" + "\nServer's having SSL-issues right now, so try removing the 's' in https and load the http version in incognito mode.";
		}else if(gameType == WEEKLY && countSolvedSquares() != 25){
			copyTextarea.value = "I solved "+countSolvedSquares()+"/25 squares in Weekly Squardle"+langStr+" #"+lastWeeklyPlayed+getEmoji()+"\nhttp://fubargames.se/squardle/" + "\nServer's having SSL-issues right now, so try removing the 's' in https and load the http version in incognito mode.";
		}else if(gameType == WEEKLY && countSolvedSquares() == 25 && remainingGuesses == 1){
			copyTextarea.value = "I won Weekly Squardle"+langStr+" #"+lastWeeklyPlayed+" with 1 guess to spare!\nBoard after 5 guesses:"+emojiAfterThree+"\nhttp://fubargames.se/squardle/" + "\nServer's having SSL-issues right now, so try removing the 's' in https and load the http version in incognito mode.";
		}else if(gameType == WEEKLY && countSolvedSquares() == 25 && remainingGuesses == 0){
			copyTextarea.value = "I won Weekly Squardle"+langStr+" #"+lastWeeklyPlayed+" on my final guess!\nBoard after 5 guesses:"+emojiAfterThree+"\nhttp://fubargames.se/squardle/" + "\nServer's having SSL-issues right now, so try removing the 's' in https and load the http version in incognito mode.";
		}else if(gameType == WEEKLY && countSolvedSquares() == 25 && remainingGuesses != 1){
			copyTextarea.value = "I won Weekly Squardle"+langStr+" #"+lastWeeklyPlayed+" with " + remainingGuesses + " guesses to spare!\nBoard after 5 guesses:" +emojiAfterThree+ "\nhttp://fubargames.se/squardle/" + "\nServer's having SSL-issues right now, so try removing the 's' in https and load the http version in incognito mode.";
		}*/
		
		if(gameType == FREE && countSolvedSquares() != 21){
			copyTextarea.value = "I solved "+countSolvedSquares()+"/21 squares in"+langStr+" Squardle!"+getEmoji()+"\nPlay this Squardle board here:\nhttps://fubargames.se/squardle/?s=" + gameId+"\n";
		}else if(gameType == FREE && countSolvedSquares() == 21 && remainingGuesses == 1){
			copyTextarea.value = "I won Squardle"+langStr+" with 1 guess to spare!\nBoard after 3 guesses:"+emojiAfterThree+"\nPlay this Squardle board here:\nhttps://fubargames.se/squardle/?s=" + gameId;
		}else if(gameType == FREE && countSolvedSquares() == 21 && remainingGuesses == 0){
			copyTextarea.value = "I won Squardle"+langStr+" on my final guess!\nBoard after 3 guesses:"+emojiAfterThree+"\nPlay this Squardle board here:\nhttps://fubargames.se/squardle/?s=" + gameId;
		}else if(gameType == FREE && countSolvedSquares() == 21 && remainingGuesses != 1){
			copyTextarea.value = "I won Squardle"+langStr+" with " + remainingGuesses + " guesses to spare!\nBoard after 3 guesses:" +emojiAfterThree+ "\nPlay this Squardle board here:\nhttps://fubargames.se/squardle/?s=" + gameId;
		}else if(gameType == DAILY && countSolvedSquares() != 21){
			copyTextarea.value = "I solved "+countSolvedSquares()+"/21 squares in Daily Squardle"+langStr+" #"+lastDailyPlayed+getEmoji()+"\nhttps://fubargames.se/squardle/";
		}else if(gameType == DAILY && countSolvedSquares() == 21 && remainingGuesses == 1){
			copyTextarea.value = "I won Daily Squardle"+langStr+" #"+lastDailyPlayed+" with 1 guess to spare!\nBoard after 3 guesses:"+emojiAfterThree+"\nhttps://fubargames.se/squardle/";
		}else if(gameType == DAILY && countSolvedSquares() == 21 && remainingGuesses == 0){
			copyTextarea.value = "I won Daily Squardle"+langStr+" #"+lastDailyPlayed+" on my final guess!\nBoard after 3 guesses:"+emojiAfterThree+"\nhttps://fubargames.se/squardle/";
		}else if(gameType == DAILY && countSolvedSquares() == 21 && remainingGuesses != 1){
			copyTextarea.value = "I won Daily Squardle"+langStr+" #"+lastDailyPlayed+" with " + remainingGuesses + " guesses to spare!\nBoard after 3 guesses:" +emojiAfterThree+ "\nhttps://fubargames.se/squardle/";
		}else if(gameType == WEEKLY && countSolvedSquares() != 25){
			copyTextarea.value = "I solved "+countSolvedSquares()+"/25 squares in Weekly Squardle"+langStr+" #"+lastWeeklyPlayed+getEmoji()+"\nhttps://fubargames.se/squardle/";
		}else if(gameType == WEEKLY && countSolvedSquares() == 25 && remainingGuesses == 1){
			copyTextarea.value = "I won Weekly Squardle"+langStr+" #"+lastWeeklyPlayed+" with 1 guess to spare!\nBoard after 5 guesses:"+emojiAfterThree+"\nhttps://fubargames.se/squardle/";
		}else if(gameType == WEEKLY && countSolvedSquares() == 25 && remainingGuesses == 0){
			copyTextarea.value = "I won Weekly Squardle"+langStr+" #"+lastWeeklyPlayed+" on my final guess!\nBoard after 5 guesses:"+emojiAfterThree+"\nhttps://fubargames.se/squardle/";
		}else if(gameType == WEEKLY && countSolvedSquares() == 25 && remainingGuesses != 1){
			copyTextarea.value = "I won Weekly Squardle"+langStr+" #"+lastWeeklyPlayed+" with " + remainingGuesses + " guesses to spare!\nBoard after 5 guesses:" +emojiAfterThree+ "\nhttps://fubargames.se/squardle/";
		}
		
	}
	try{
		copyTextarea.focus({preventScroll:true});
	}catch (error) {
		copyTextarea.focus();
	}
	copyTextarea.select();
	try{
		var successful = document.execCommand('copy');
//		var msg = successful ? 'successful' : 'unsuccessful';
		document.getElementById("emojiImg").src = "graphics/copied_emoji.png";
	}catch(err) {
		document.getElementById("textToEmoji").style.left = "40px";
		document.getElementById("emojiImg").src = "graphics/emoji.png";
	}
	copyTextarea.blur();
}
function toggleGameModeSelection(vis){
	if(vis == "visible"){
		for(x=0; x<5; x++){
			for(y=0; y<5; y++){
				if(onBoard(x, y)){	//!((x==1 || x==3) && (y==1 || y==3))
					document.getElementById(x+"_"+y).src = "graphics/gray.png";
				}else{
					document.getElementById(x+"_"+y).src = "graphics/0.png";
				}
			}
		}
		document.getElementById("creatingBoard").style.top = "224px";
		
	}
	document.getElementById("dailySquardle").style.visibility = vis;
	document.getElementById("dailySquardleCover").style.visibility = vis;
	document.getElementById("weeklySquardle").style.visibility = vis;
	document.getElementById("weeklySquardleCover").style.visibility = vis;
	document.getElementById("freeplaySquardle").style.visibility = vis;
	document.getElementById("freeplaySquardleCover").style.visibility = vis;
	var rev = "hidden"
	var displayRev = "none";
	if(vis == "hidden"){
		rev = "visible"
		displayRev = "inline";
	}
	document.getElementById("remaining").style.visibility = rev;
	document.getElementById("remainingNumber").style.visibility = rev;
	document.getElementById("keyboardLetters").style.display = displayRev;
	document.getElementById("keyboardColors").style.display = displayRev;
	if(lang == "sv"){
		document.getElementById("keyboardLettersSv").style.display = displayRev;
		document.getElementById("keyboardColorsSv").style.display = displayRev;
	}
	document.getElementById("columnMarker").style.visibility = rev;
	document.getElementById("rowMarker").style.visibility = rev;
	document.getElementById("creatingBoard").style.visibility = "hidden";
	document.getElementById("youWin").style.visibility = "hidden";
	document.getElementById("gameOver").style.visibility = "hidden";
	document.getElementById("playAgain").style.visibility = "hidden";
	document.getElementById("tipJar").style.visibility = "hidden";
	document.getElementById("emoji").style.visibility = "hidden";
	document.getElementById("screenshotModeDiv").style.visibility = "hidden";
}
function logoClick(){
	if(currentPage != "game"){
		togglePage("game");
	}else{
		screenshotMode();
	}
}
function weeklyEndScreen(){
	if(!gameIsOver || gameType != WEEKLY){
		return(true);
	}
	clearTimeout(showGameEndBoxTimer)
	var disp = "none";
	if(gameState == 5){
		disp = "inline";
	}
	if(gameType == WEEKLY){
		document.getElementById("gameEndBox").style.display = disp;
		document.getElementById("gameEndBoxClose").style.display = disp;
		document.getElementById("tipJar").style.display = disp;
	}
	document.getElementById("playAgain").style.display = disp;
	document.getElementById("seeSolution").style.display = disp;
	document.getElementById("emoji").style.display = disp;
	document.getElementById("screenshotModeDiv").style.display = disp;
	document.getElementById("gameOver").style.display = disp;
	document.getElementById("youWin").style.display = disp;
//	document.getElementById("gameEndCover").style.display = "inline";
	if(gameState != 5){
		gameState = 5;
	}else{
		gameState = 0;
	}
}
function screenshotMode(){
	if(gameState == 1){
		removeBigClues(guessNr);
	}else if(gameState == 5){
		weeklyEndScreen();
	}
	if(gameState == 0 && currentPage == "game" && document.getElementById("freeplaySquardle").style.visibility == "hidden"){	//If we should enter screenshot mode.
		gameState = 4;
		for(smX = 0; smX<5; smX++){
			for(smY = 0; smY<5; smY++){
				if(onBoard(smX, smY)){	//(smX!=1 && smX!=3) || (smY!=1 && smY!=3)
					midSquares[smX][smY].style.opacity = "0";	
					for(smG = 0; smG<16; smG++){
						if(smallSquares[smX] && smallSquares[smX][smY] && smallSquares[smX][smY][smG] && smallSquares[smX][smY][smG][LETTER_DIV]){
							smallSquares[smX][smY][smG][LETTER_DIV].style.opacity = "0"; 
							smallSquares[smX][smY][smG][SQUARE_DIV].style.opacity = "1";
							if(smallSquares[smX][smY][smG][CLUE_SRC].indexOf("orange") != -1){
								document.getElementById('smallImg'+smX+'_'+smY+'_'+smG).src = "graphics/ssm/orange.png";
							}else if(smallSquares[smX][smY][smG][CLUE_SRC].indexOf("yellow") != -1){
								document.getElementById('smallImg'+smX+'_'+smY+'_'+smG).src = "graphics/ssm/yellow.png";
							}else if(smallSquares[smX][smY][smG][CLUE_SRC].indexOf("red") != -1){
								document.getElementById('smallImg'+smX+'_'+smY+'_'+smG).src = "graphics/ssm/red.png";
							}else{
								document.getElementById('smallImg'+smX+'_'+smY+'_'+smG).src = smallSquares[smX][smY][smG][CLUE_SRC];
							}							
						}
					}
				}
			}
		}
		document.getElementById("gameEndBox").style.opacity = "0";
		document.getElementById("gameEndBoxClose").style.opacity = "0";
		document.getElementById("emoji").style.opacity = "0";
		document.getElementById("seeSolution").style.opacity = "0";
		document.getElementById("screenshotModeDiv").style.opacity = "0";
		document.getElementById("playAgain").style.opacity = "0";
		document.getElementById("tipJar").style.opacity = "0";
		document.getElementById("topBar").style.opacity = "0";
		document.getElementById("keyboardLetters").style.opacity = "0";
		document.getElementById("keyboardColors").style.opacity = "0";
		document.getElementById("keyboardLettersSv").style.opacity = "0";
		document.getElementById("keyboardColorsSv").style.opacity = "0";
		document.getElementById("screenshotLogo").style.visibility = "visible";
		document.getElementById("screenshotCover").style.display = "inline";
		document.getElementById("rowMarker").style.visibility = "hidden";
		document.getElementById("columnMarker").style.visibility = "hidden";
		var currentURL = "<b>";
		if(gameId.indexOf("DAILY") == 0){
			currentURL += "fubargames.se/squardle"
			if(lang != "en"){
				currentURL += "?l="+lang
			}
			if(guessNr > 0){
				if(lang == "sv"){
					currentURL += "&nbsp;&nbsp;&nbsp;Dagens Squardle #"+lastDailyPlayed+"</b>"
				}else if(lang == "es"){
					currentURL += "&nbsp;&nbsp;&nbsp;Squardle diario #"+lastDailyPlayed+"</b>"
				}else if(lang == "br"){
					currentURL += "&nbsp;&nbsp;&nbsp;Squardle diário #"+lastDailyPlayed+"</b>"
				}else if(lang == "de"){
					currentURL += "&nbsp;&nbsp;&nbsp;Tägliches Squardle #"+lastDailyPlayed+"</b>"
				}else{
					currentURL += "&nbsp;&nbsp;&nbsp;Daily Squardle #"+lastDailyPlayed+"</b>"
				}
			}else{
				if(lang == "sv"){
					currentURL += "&nbsp;&nbsp;&nbsp;Dagens Squardle #"+currentDay+"</b>"
				}else if(lang == "es"){
					currentURL += "&nbsp;&nbsp;&nbsp;Squardle diario #"+currentDay+"</b>"
				}else if(lang == "br"){
					currentURL += "&nbsp;&nbsp;&nbsp;Squardle diário #"+currentDay+"</b>"
				}else if(lang == "de"){
					currentURL += "&nbsp;&nbsp;&nbsp;Tägliches Squardle #"+currentDay+"</b>"
				}else{
					currentURL += "&nbsp;&nbsp;&nbsp;Daily Squardle #"+currentDay+"</b>"
				}
			}
		}else if(gameId.indexOf("LWEEK") == 0){
			currentURL += "fubargames.se/squardle"
			if(lang != "en"){
				currentURL += "?l="+lang
			}
			if(guessNr > 0){
				if(lang == "sv"){
					currentURL += "&nbsp;&nbsp;&nbsp;Vecko-Squardle #"+lastWeeklyPlayed+"</b>"
				}else if(lang == "es"){
					currentURL += "&nbsp;&nbsp;&nbsp;Squardle semanal #"+lastWeeklyPlayed+"</b>"
				}else if(lang == "br"){
					currentURL += "&nbsp;&nbsp;&nbsp;Squardle semanal #"+lastWeeklyPlayed+"</b>"
				}else if(lang == "de"){
					currentURL += "&nbsp;Wöchentliches Squardle #"+lastWeeklyPlayed+"</b>"
				}else{
					currentURL += "&nbsp;&nbsp;&nbsp;Weekly Squardle #"+lastWeeklyPlayed+"</b>"
				}
			}else{
				if(lang == "sv"){
					currentURL += "&nbsp;&nbsp;&nbsp;Vecko-Squardle #"+currentWeek+"</b>"
				}else if(lang == "es"){
					currentURL += "&nbsp;&nbsp;&nbsp;Squardle semanal #"+currentWeek+"</b>"
				}else if(lang == "br"){
					currentURL += "&nbsp;&nbsp;&nbsp;Squardle semanal #"+currentWeek+"</b>"
				}else if(lang == "de"){
					currentURL += "&nbsp;Wöchentliches Squardle #"+currentWeek+"</b>"
				}else{
					currentURL += "&nbsp;&nbsp;&nbsp;Weekly Squardle #"+currentWeek+"</b>"
				}
			}
		}else{
			if(lang == "en"){
				currentURL += "Play this board here: fubargames.se/squardle"
			}else if(lang == "de"){
				currentURL += "Spielen Sie dieses Brett hier: fubargames.se/squardle"	
			}else if(lang == "es"){
				currentURL += "Juega este tablero aquí: fubargames.se/squardle"
			}else if(lang == "br"){
				currentURL += "Jogue este tabuleiro aqui: fubargames.se/squardle"
			}else if(lang == "sv"){
				currentURL += "Spela samma bräde här: fubargames.se/squardle"
			}else{
				currentURL += "fubargames.se/squardle"
			}
			currentURL += "?s="+gameId
			if(lang != "en"){
				currentURL += "&lang="+lang
			}
			currentURL += "</b>"
		}
		document.getElementById("lettersDiv").style.opacity = "0";
		document.getElementById("screenshotURL").style.visibility = "visible";
		document.getElementById("screenshotURL").innerHTML = currentURL;
	}else if(gameState == 4){
		gameState = 0;
		for(smX = 0; smX<5; smX++){
			for(smY = 0; smY<5; smY++){
				if(onBoard(smX, smY)){	//(smX!=1 && smX!=3) || (smY!=1 && smY!=3)
					midSquares[smX][smY].style.opacity = "0.6";	
					for(smG = 0; smG<16; smG++){
						if(smallSquares[smX] && smallSquares[smX][smY] && smallSquares[smX][smY][smG] && smallSquares[smX][smY][smG][LETTER_DIV]){
							fadeSmallSquare(smX, smY, smG, false);	//Doesn't change fade setting, just resets opacity to what it should be.
						//	document.getElementById('smallImg'+smX+'_'+smY+'_'+smG).src = smallSquares[smX][smY][smG][CLUE_SRC];
						}
					}
				}
			}
		}
		document.getElementById("gameEndBox").style.opacity = "0.7";
		document.getElementById("gameEndBoxClose").style.opacity = "1";
		document.getElementById("emoji").style.opacity = "1";
		document.getElementById("seeSolution").style.opacity = "1";
		document.getElementById("screenshotModeDiv").style.opacity = "1";
		document.getElementById("playAgain").style.opacity = "1";
		document.getElementById("tipJar").style.opacity = "1";
		document.getElementById("topBar").style.opacity = "1";
		document.getElementById("keyboardLetters").style.opacity = "1";
		document.getElementById("keyboardColors").style.opacity = "1";
		document.getElementById("keyboardLettersSv").style.opacity = "1";
		document.getElementById("keyboardColorsSv").style.opacity = "1";
		document.getElementById("screenshotLogo").style.visibility = "hidden";
		document.getElementById("screenshotCover").style.display = "none";
		document.getElementById("screenshotURL").style.visibility = "hidden";
		if(!gameIsOver){
			document.getElementById("rowMarker").style.visibility = "visible";
			document.getElementById("columnMarker").style.visibility = "visible";
		}
		document.getElementById("lettersDiv").style.opacity = "1";
		document.getElementById("screenshotURL").innerHTML = "";
	}
}
function playAgain(){
	justFocusMan();
	if(!gameIsOver){
		return(false);
	}
	for(hx=1; hx<4; hx+=2){
		for(hy=1; hy<4; hy+=2){
			document.getElementById(hx + "_" + hy).src = "graphics/0.png";
		}
	}
	document.getElementById("gameEndBox").style.display = "none";
	document.getElementById("gameEndBoxClose").style.display = "none";
	document.getElementById("gameEndCover").style.display = "none";
	document.getElementById("seeSolution").style.visibility = "hidden";
	document.getElementById("playAgain").style.visibility = "hidden";
	document.getElementById("tipJar").style.visibility = "hidden";
	document.getElementById("emoji").style.visibility = "hidden";
	document.getElementById("screenshotModeDiv").style.visibility = "hidden";
	document.getElementById("emojiImg").src = "graphics/emoji.png";
	document.getElementById("youWin").style.visibility = "hidden";
	document.getElementById("gameOver").style.visibility = "hidden";
	document.getElementById("textToEmoji").style.left = "-1040px";
	document.getElementById("remaining").style.visibility = "visible";
	clearTimeout(showSolutionTimer);
	for(letter=0; letter<alpha.length; letter++){
		setKeyColor(alpha.charAt(letter), "graphics/purple.png");
//		document.getElementById("key_"+alpha.charAt(letter)).src ="graphics/gray.png";	
	}
	for(x=0; x<5; x++){
		for(y=0; y<5; y++){
			if(onBoard(x, y)){	//(x!=1 && x!=3) || (y!=1 && y!=3)
				setMidSquare(x, y, false);
				document.getElementById(x+"_"+y).src = preloadedImages[87].src;	//29*3
				document.getElementById(x+"L"+y).src = preloadedImages[88].src;	//29*3+1
				for(g=0; g<16; g++){
					if(smallSquares[x][y][g]){
						if(smallSquares[x][y][g][SQUARE_DIV]){
							var tas = document.body.removeChild(smallSquares[x][y][g][SQUARE_DIV]);
							var tas = document.body.removeChild(smallSquares[x][y][g][LETTER_DIV]);
						}
					}
				}
				playerNotes[x][y] = "0";
				setMidSquare(x, y, false, true);
		//		var tas = document.body.removeChild(midSquares[x][y]);
			}
		}
	}
	//testC.push("t");
	//createTestCookie();
	ga('send', 'event', 'Squardle', 'PlayAgainClicked', 'ToggleMenu');
	gameType = -1;
	toggleGameModeSelection("visible");
	updatePeriodButtons();
}
function setLang(){
	//Setting to English not needed as it's the default URL.
	if(getQueryVariable("l") == "se" || getQueryVariable("lang") == "se"){
		alert("'se' is the language code for Northern Sami. I'm going to assume you meant 'sv' for Swedish and redirect you to it.")
		window.location = "index.html?l=sv";
	}
	if(getQueryVariable("l") == "sv" || getQueryVariable("lang") == "sv"){
		lang = "sv";
		answers[0] = answersStartSv.split(" ");
		document.getElementById("logo").src = "graphics/squardle_logo_color_sv.png"; 
		document.getElementById("screenshotLogoImg").src = "graphics/squardle_logo_color_sv.png"; 
		document.getElementById("startHintSv").style.display = "inline";
		document.getElementById("h1Tag").innerHTML = "Välkommen till Squardle på svenska!";
		init_genrand(0);
		for(lan=0; lan<6; lan++){
			answers[lan] = shuffleArray(answers[0]);
		}
//		freqComp = [1.59547789481559,1.0322746794671727,1.0704748636799672,0.7928799568744074,0.8198613931361852,1.1459155444006244,0.7705551644360377,1.121963724579139,0.8813148201612517,0.99930618047529,0.9521024520060869,0.9145227057378738,1.0357092800905798,0.8840593234640789,0.8733900323607965,1.0065176618618128,1.006833793719715,0.93027917361461,1.184880804971072,0.8418212522880376,1.0057390496275962,1.045989802804287,1.011867551454979,1.0226686853915448,1.0326212224619955,1.0196277250216317,1.0292273031795336,1.1939047252486066,1.067572816497941];
//Current//		freqComp = [1.00000,1.1965470151337616,1.2001240763281311,0.6328540689998746,0.8299545448596303,1.267402924718438,0.8254322737927835,1.23209365359163,0.9099919120501367,1.162978660488046,0.9341022354184558,0.7552581401704994,0.989239093923981,0.7217399060287211,0.9051793471115055,1.2149567480738996,1.0142972407595412,0.8322542853434154,0.9738853980113797,0.6353855330092937,1.0346968963649554,1.0461968146878373,1.025029120732588,1.0788477010182012,1.1312069936874622,1.0493132896396018,1.1507318234133488,1.4411377427550436,1.2118132085154687];
	
//		freqComp = [0.9843445820505532,1.25305480336877,1.3664878973910983,0.52950676079516,0.7679657476656396,1.3282518629052855,0.8121003364194163,1.3217800586891766,0.8806165085017134,1.3808896594623075,0.8727735783188829,0.636102765612522,0.9170637966928659,0.6281219228999969,0.8894635151352881,1.289589843193373,1.0246535473330485,0.7378976141003669,0.8235858924750998,0.5572011303045182,1.0360600630711734,1.0615632240824888,1.0434129703563118,1.1670729911055417,1.268492517740261,1.0893530332869727,1.2629790459135535,1.6990597339359066,1.4075436945214843];
		freqComp = [0.9673767875965193,1.254517269228669,1.3785554393426624,0.5221781680065043,0.758668250667252,1.336667460693476,0.8040657416406793,1.3233828637596787,0.88322662281551,1.4046431652897493,0.8739321213116881,0.6279879688686509,0.9155540511583554,0.6268339307101183,0.8899738028001717,1.2921260225427744,1.0255409493166765,0.7356558488524529,0.8228071185145894,0.5515470428280027,1.03276029004993,1.0595401876101873,1.0449946976825553,1.1754265525152316,1.2811810775169397,1.0927661251761545,1.2652548672876174,1.7192224435465493,1.4236789872872115 ];
//		freqComp = [];
//		freqComp = [];
//		freqComp = [];
		allowed = allowedStartSv.split(" ");
		alpha = "abcdefghijklmnopqrstuvwxyzåäö";
		document.getElementById("keyboardLettersSv").style.top = "895px";
		document.getElementById("keyboardColorsSv").style.top = "895px";
		document.getElementById("flagSv").style.display = "none";	//Flag on settings page is hidden.
	}else if(getQueryVariable("l") == "de" || getQueryVariable("lang") == "de"){
		lang = "de";
		answers[0] = answersStartDe.split(" ");
		document.getElementById("logo").src = "graphics/squardle_logo_color_de.png"; 
		document.getElementById("screenshotLogoImg").src = "graphics/squardle_logo_color_de.png"; 
		document.getElementById("startHintDe").style.display = "inline";
		document.getElementById("h1Tag").innerHTML = "Willkommen bei Squardle auf Deutsch!";
		init_genrand(0);
		for(lan=0; lan<6; lan++){
			answers[lan] = shuffleArray(answers[0]);
		}
//		freqComp = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
		freqComp = [0.9346778301338703,1.0949475154929742,1.0728318514552897,0.9404940530264712,1.1940482443549583,1.0681272736633933,0.8842332328025148,0.9683318981704896,0.8664785437712176,1.034191930879459,1.0366556145538997,0.9094841498064676,0.9734939699623463,0.8523341604458402,0.9140358550027723,1.1458057943634135,1.0387219109732526,0.9429316013114389,0.9960031262227212,0.9305428518772457,0.9993465406731223,1.052295878523519,1.1173388414476175,1.0335460374899672,1.0668709454961893,1.0213916344413463];
		allowed = allowedStartDe.split(" ");
		document.getElementById("flagDe").style.display = "none";
	}else if(getQueryVariable("l") == "es" || getQueryVariable("lang") == "es"){
		lang = "es";
		answers[0] = answersStartEs.split(" ");
		document.getElementById("logo").src = "graphics/squardle_logo_color_es.png"; 
		document.getElementById("screenshotLogoImg").src = "graphics/squardle_logo_color_es.png"; 
		document.getElementById("startHintEs").style.display = "inline";
		document.getElementById("instructionsIntroEs").style.display = "inline";
		document.getElementById("h1Tag").innerHTML = "¡Bienvenidos a Squardle en español!";
		alpha = "abcdefghijklmnopqrstuvwxyzñ";
		document.getElementById("leftSpacer").style.display = "none";
		document.getElementById("rightSpacer").style.display = "none";
		document.getElementById("leftSpacerBack").style.display = "none";
		document.getElementById("rightSpacerBack").style.display = "none";
		document.getElementById("letter_ñ").style.display = "inline";
		document.getElementById("key_ñ").style.display = "inline";
		init_genrand(0);
		for(lan=0; lan<6; lan++){
			answers[lan] = shuffleArray(answers[0]);
		}
		freqComp = [0.7586554612669199,1.2499047939322265,1.5143888636846072,0.8286798088780455,0.5749954103628561,1.5009849526049484,1.1429820163434592,1.4677283146119562,0.9332906336520818,1.1632232803020752,1.079257151913944,0.7199032736409894,0.981973707168013,0.7626021601752868,0.7342567172090212,1.7327708834970703,1.2023892128072555,0.7148339443543208,0.7812349626241527,0.8404010282625158,1.0151469048681434,1.3337443747590807,0,1.1263810429181857,1.115310853724418,0.8784392495445601,2.4691564761189095];
		allowed = allowedStartEs.split(" ");
		document.getElementById("flagEs").style.display = "none";
		document.getElementById("startHintNewFeatures").style.display = "none";
		document.getElementById("startHintFairWarning").style.display = "none";
	}else if(getQueryVariable("l") == "br" || getQueryVariable("lang") == "br" || getQueryVariable("l") == "pt-br" || getQueryVariable("lang") == "pt-br"){
		lang = "br";
		answers[0] = answersStartBr.split(" ");
		document.getElementById("logo").src = "graphics/squardle_logo_color_br.png"; 
		document.getElementById("screenshotLogoImg").src = "graphics/squardle_logo_color_br.png"; 
		document.getElementById("startHintBr").style.display = "inline";
		document.getElementById("instructionsIntroBr").style.display = "inline";
		document.getElementById("h1Tag").innerHTML = "Bem-vindo ao Squardle em português do Brasil!";
		init_genrand(0);
		for(lan=0; lan<6; lan++){
			answers[lan] = shuffleArray(answers[0]);
		}
		freqComp = [0.534109663596047,1.4286964336456867,1.4870629737549035,1.179704253392659,0.5050859168689713,1.8738362295507258,1.6894500877652376,1.1284930953888934,1.3011008453277455,1.227137434044399,0,0.6092809219584006,0.5881379427743667,1.0189579469353105,0.7456449021904007,1.6061960267243478,1.0244817452022468,0.6290323407136561,0.3562106145122468,1.3211253125613303,1.1292903536665566,1.3220441732400043,0,1.1846746698997268,0,1.052524406932257];	//0.04484043532881951
		allowed = allowedStartBr.split(" ");
		document.getElementById("flagBr").style.display = "none";
		document.getElementById("startHintNewFeatures").style.display = "none";
		document.getElementById("startHintFairWarning").style.display = "none";
	}
	if(lang == "en"){
		document.getElementById("flagEn").style.display = "none";
	}
	document.getElementById("flagEn").href = getCookieName(false) + ".html?l=en";
	document.getElementById("flagEs").href = getCookieName(false) + ".html?l=es";
	document.getElementById("flagBr").href = getCookieName(false) + ".html?l=br";
	document.getElementById("flagDe").href = getCookieName(false) + ".html?l=de";
	document.getElementById("flagSv").href = getCookieName(false) + ".html?l=sv";
//	oldFreqComp = [...freqComp];
}
Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}
Date.prototype.stdTimezoneOffsetNow = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var timeNow = new Date();
    return(jan.getTimezoneOffset() - timeNow.getTimezoneOffset());
}
function toLocalISOString(d){	//Yeah, I *would* use the built in toISOString, but I don't care about GMT.
	var ret = d.getFullYear() + "-";
	if(d.getMonth() < 10){
		ret += "0";
	}
	ret += (d.getMonth()+1) + "-";
	if(d.getDate() < 10){
		ret += "0";
	}
	ret += d.getDate();
	return(ret);
}
function updateDate(){
	var now = new Date();
    var midnight = new Date();
    midnight.setHours(24);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
	var tilMidnight  = midnight.getTime() - now.getTime();
	var startTime = new Date('2022-02-03'.replace(/-/g, "/"));
	startTime = startTime.getTime()
	var offsetDST = now.stdTimezoneOffsetNow() * 60 * 1000;
	var dayUnrounded = (now.getTime() - startTime + offsetDST)/(1000*60*60*24);
	currentDay = Math.max(1, Math.floor(dayUnrounded));
	if(getQueryVariable("d") && Sha256.hash("salt_is_important_IJUGWEDUJYWSDGUÅQDEGIGUHYQDHJBDJMNQIQÖLFNWDFGWDKN"+getQueryVariable("k")) == "5b28ae53b51efb5f82c385038972f6b33ba68ba28cff7d4d7cfbca19cfe79d94"){
		currentDay = Math.max(1, parseInt(getQueryVariable("d"), 10));
	}
	currentWeek = Math.max(Math.floor((currentDay-80)/7), 0);
	updatePeriodButtons();
	updateDateTimer = setTimeout("updateDate()", tilMidnight + 1);
}
function updatePeriodButtons(){
	var now = new Date();
	if(lastDailyPlayed == currentDay){
		if(testReadingCookie("_daily")){
			document.getElementById("dailySquardle").style.top = "215px";
			document.getElementById("dailySquardle").innerHTML = "<b>SEE YOUR<br>LATEST<br>DAILY<br>BOARD</b>";	
			document.getElementById("dailySquardleCover").style.display = "inline";
		}else{
			document.getElementById("dailySquardle").innerHTML = "<small><sup><br></sup></small><b>TROUBLE<br>READING<br>COOKIE</b>";
			document.getElementById("dailySquardleCover").style.display = "none";
		}
	}else{
		if(currentDay < 87){
			document.getElementById("dailySquardle").style.top = "225px";
			document.getElementById("dailySquardle").innerHTML = "<b>DAILY<br>SQUARDLE<br>"+ toLocalISOString(now) + "</b>";
		}else{
			document.getElementById("dailySquardle").style.top = "225px";
			document.getElementById("dailySquardle").innerHTML = "<b>DAILY<br>SQUARDLE<br>#"+ currentDay + "</b>";
		}
		document.getElementById("dailySquardleCover").style.display = "inline";
		if(getQueryVariable("d") && Sha256.hash("salt_is_important_IJUGWEDUJYWSDGUÅQDEGIGUHYQDHJBDJMNQIQÖLFNWDFGWDKN"+getQueryVariable("k")) == "5b28ae53b51efb5f82c385038972f6b33ba68ba28cff7d4d7cfbca19cfe79d94"){
			document.getElementById("dailySquardle").innerHTML = "<b>DAILY<br>SQUARDLE<br>#"+ currentDay + "</b>";
		}
	}
	if(lastWeeklyPlayed == currentWeek){
		if(testReadingCookie("_weekly")){
			document.getElementById("weeklySquardle").innerHTML = "<b>SEE YOUR<br>LATEST<br>WEEKLY<br>BOARD</b>";	
			document.getElementById("weeklySquardleCover").style.display = "inline";
		}else{
//			document.getElementById("weeklySquardle").innerHTML = "<small><sup><br></sup></small><b>TROUBLE<br>READING<br>COOKIE</b>";
			document.getElementById("weeklySquardle").innerHTML = "";
			document.getElementById("weeklySquardleCover").style.display = "none";
		}
	}else if(currentWeek > 0){
		if(weeklyBoards.length > currentWeek){
			document.getElementById("weeklySquardle").innerHTML = "<small><sup><br></sup></small><b>WEEKLY<br>SQUARDLE<br>#"+ currentWeek + "</b>";
			document.getElementById("weeklySquardleCover").style.display = "inline";
		}else{
			document.getElementById("weeklySquardle").innerHTML = "<small><sup><br></sup></small><b>CAN'T&nbsp;LOAD<br>WEEKLY<br>BOARD</b>";
			document.getElementById("weeklySquardleCover").style.display = "inline";
		}
	}
}
function startGame(isDaily){
	if(gameIsOver){
		if(isDaily === 7){	//Weekly
			if(lastWeeklyPlayed == currentWeek){	//Just display your results for today's daily board.
				if(testReadingCookie("_weekly")){
					toggleGameModeSelection('hidden');
					startUp(7, false, 2);
				}else{
					alert("Can't display your results from your latest weekly Squardle due missing cookie with the data. If you enable cookies this feature should start working after you play the next weekily Squardle.");
				}
			}else{											//Play
				if(currentPage == "weeklyStartup"){
					togglePage('game');
					toggleGameModeSelection('hidden');
					startUp(7, false, false);
				}else{
					setWeeklyStartup();
					togglePage("weeklyStartup")
				}
			}
		}else{
			document.getElementById("creatingBoard").style.top = "224px"
			if(isDaily === true && lastDailyPlayed == currentDay){	//Just display your results for today's daily board.
				if(testReadingCookie("_daily")){
					toggleGameModeSelection('hidden');
					startUp(true, false, 2);
				}else{
					alert("Can't display your results from today's daily Squardle due missing cookie with the data. If you enable cookies this feature should start working after you play tomorrow's daily Squardle.");
				}
			}else{											//Play 
				toggleGameModeSelection('hidden');
				startUp(isDaily, false, false);
			}
		}
	}
}
function initSmallSquares(){
	smallSquares = [];	
	for(x=0; x<5; x++){
		smallSquares[x] = [];
		for(y=0; y<5; y++){
			smallSquares[x][y] = [];
			for(g=0; g<16; g++){
				smallSquares[x][y][g] = [];
				smallSquares[x][y][g][LETTER_DIV] = false;
				smallSquares[x][y][g][SQUARE_DIV] = false;
				smallSquares[x][y][g][IS_FADED] = 0;
				smallSquares[x][y][g][CLUE_SRC] = "graphics/0.png";
			}
		}
	}
}

var squareTimer;
var cookiesEnabled = false;
function startUp(isDaily, readURL, fastPlay){
	testC = ["e"];
	createTestCookie();
	cookiesEnabled = testReadingCookie("_t");
//	replay = false;	//This is odd.
	if(isDaily === 7){	//Not the best named variable anymore, but isDaily === 7 means weekly puzzle.
		gameType = WEEKLY;
		madeGameId = false;
	}else if(isDaily === true){
		gameType = DAILY;
		madeGameId = false;
	}else{
		gameType = FREE;
	}
	for(x=0; x<5; x++){		//Remove note data;
		playerNotes[x] = ["0","0","0","0","0"];
	}
	for(bok=0; bok<alpha.length; bok++){ 
		keyboardColorMemory[bok] = "graphics/purple.png";
	}
	if(!fastPlay){	//That is, if this isn't already done by loadedPage()
		initSmallSquares();
	}
	var sharedGameId = getQueryVariable("s");
	if(!cookiesEnabled && sharedGameId && readURL){
		var stayWithURL = confirm("You have followed an URL to a specific Squardle board. Since it looks like you don't have cookies enabled we have no way of knowing if you've followed this link before and thus have already played this board. Click [OK] to play this board, or [Cancel] to play another random board.")
		if(!stayWithURL){
			if(lang == "en"){
				window.location = "index.html";
			}else{
				window.location = "index.html?l=" + lang;
			}
		}
	//	fixRecor();
	}
	if(sharedGameId && readURL){
		gameId = sharedGameId.substring(0,4)
		if((fastSeeds.indexOf(gameId) <= seedNr && fastSeeds.indexOf(gameId) != -1) || otherPlayedSeeds.indexOf(gameId) != -1){
			var overwritten = replay;
			replay = true;
			if(!fastPlay && !overwritten){
				var proceed = confirm("Re-play this board? (Stats are only saved for your first time playing a board.)")
				if(!proceed){
					//testC.push("K"+ ((isDaily+"").charAt(0)));
					//createTestCookie();
					toggleGameModeSelection("visible");
					gameId = "none";
					return(false);
				}
				//testC.push("Q"+ ((isDaily+"").charAt(0)));
				//createTestCookie();
			}
		}
		createSquardleCookie();
	}else if(gameType == DAILY){
		gameId = "DAILY"+currentDay;	//(Not used as seed).
		createSquardleCookie();
	}else if(gameType == WEEKLY){
		gameId = "LWEEK"+currentWeek;	//(Not used as seed).
		createSquardleCookie();
	}else{
		if(fastPlay){
			//gameId already set.
		}else if(false){ // was if(seedNr < fastSeeds.length && lang == "en"){	//No longer use fast seeds due to having enough players playing enough to having some people get repeated boards.
			seedNr++;
			gameId = fastSeeds[seedNr];
			createSquardleCookie()
		}else{	//Use slow seeds for all freeplay.
			do{
				gameId = "";
				for(gi=0; gi<4; gi++){
					if(gi==0){
						gameId += alphaNoDL.charAt(Math.floor(Math.random()*alphaNoDL.length));	//Lower case first letter that isn't d means v2 gameId. (d means daily squardle, versionNr keeps track of v for those.)
					}else{
						gameId += alphaCode.charAt(Math.floor(Math.random()*32)).toUpperCase();
					}
				}
			}while(otherPlayedSeeds.indexOf(gameId) != -1);
			createSquardleCookie();
		}
	}
	if(gameType == DAILY && currentDay >= 3 && currentDay <= 12 && currentDay < dailySeedsV2.length){	//Legacy code in case someone want to look at all previous boards.
		var seed = parseInt("5"+dailySeedsV2[currentDay], 10);
	}else if(gameType == DAILY  && currentDay < dailySeedsV2.length){	//Precalculated seeds that are known to be extra fast with the current board generator.
		var seed = -dailySeedsV2[currentDay]
	}else if(gameType == DAILY){
		var seed = -currentDay-100000;
	}else if(gameType == WEEKLY){
	}else if(gameType == FREE){
		var seed = 0;
		for(gi=0; gi<gameId.length && gi<4; gi++){
			if(alphaCode.indexOf(gameId.charAt(gi).toLowerCase()) != -1){
				seed += (alphaCode.indexOf(gameId.charAt(gi).toLowerCase()) * Math.pow(36, gi));
			}
		}
	}
	init_genrand(seed);
	remainingGuesses = 10;
	if(gameType == WEEKLY){
		remainingGuesses = 8
	}
	updateRemaining(remainingGuesses);
	guessNr = 0;
	guessCR = 0;
	solvedColRows = [];
	ga('send', 'event', 'Squardle', 'NewGame:', gameId);
	for(x=0; x<5; x++){
		solvedSquares[x] = [false,false,false,false,false];
		bestClues[x] = ["black","black","black","black","black"];
		for(y=0; y<5; y++){
			setMidSquare(x, y, false, false);
			if(gameType == WEEKLY || !((x==1 || x==3) && (y==1 || y==3))){
				document.getElementById(x+"_"+y).src = "graphics/gray.png";
			}else{
				document.getElementById(x+"_"+y).src = "graphics/0.png";
			}
		}
	}
	if(gameType == DAILY || gameType == WEEKLY){
		document.getElementById("creatingBoard").style.left = "130px";
		if(gameType == WEEKLY){
			document.getElementById("creatingBoard").style.top = "464px";
		}
	}else if(gameType == FREE){
		document.getElementById("creatingBoard").style.left = "370px";
	}
	document.getElementById("creatingBoard").style.visibility = "visible";
	document.getElementById("remainingImg").width = "60";
	document.getElementById("remainingImg").height = "60";
	document.getElementById("remaining").style.left = "400px";
	document.getElementById("remaining").style.top = "470px";
	document.getElementById("remainingNumberImg").width = "60";
	document.getElementById("remainingNumberImg").height = "60";
	document.getElementById("remainingNumber").style.left = "400px";
	document.getElementById("remainingNumber").style.top = "470px";
	if(gameType == WEEKLY){
		document.getElementById("remainingImg").width = "28";
		document.getElementById("remainingImg").height = "28";
		document.getElementById("remaining").style.left = "358px";
		document.getElementById("remaining").style.top = "444px";
		document.getElementById("remainingNumberImg").width = "28";
		document.getElementById("remainingNumberImg").height = "28";
		document.getElementById("remainingNumber").style.left = "358px";
		document.getElementById("remainingNumber").style.top = "444px";
		squareTimer = setTimeout("makeSquare("+fastPlay+", 7)", 100);
	}else{
		squareTimer = setTimeout("makeSquare("+fastPlay+", 0)", 100);
	}
//	squareTimer = setTimeout("measureFreq()", 500);	
//	countDictFreq();
}
function togglePageStats(){
	togglePage("stats");
}
var lastRescale = 0;
function rescaleViewport(){
	if(new Date().getTime() - lastRescale < 200){
		return;
	}
	lastRescale = new Date().getTime();
	if(lang != "sv" && window.innerHeight < 889 && window.innerHeight > window.innerWidth){
		document.getElementById("vp").content = "height=889, user-scalable=no";
	}else if(lang == "sv" && window.innerHeight < 957 && window.innerHeight > window.innerWidth){
		document.getElementById("vp").content = "height=957, user-scalable=no";
	}else{
		document.getElementById("vp").content = "width=620, user-scalable=no";
	}
}
var onHttp = false;
function loadedPage(){
	setLang();
	rescaleViewport()
	window.addEventListener("resize", function() {
		rescaleViewport();
	}, false);
	getTestCookie();
	if((window.location+"").indexOf("http://") == 0){
		onHttp = true;
		var redir = false;
		alert("You are on the NEW server for Squardle, but you're on the http version of it. Our SSL certificate for httpS should now be working. If you can't convince your browser to show that version to you, this version will still let you play.\n\nSadly, playing this version means that the cookies won't work. So your stats from games played won't be recorded here. I have made it so that having missed one or more Daily Squardle won't end your daily streak once the https-version comes back and the page can read and write your secure cookies again.\n\nOnce the certificate is in place and working I will turn on auto-redirects to the secure version.")
	}
	updateDate();
	getSquardleCookie(true, false);
	updatePeriodButtons();
	getRecordsFreeplayCookie("o");
	getRecordsPeriodCookie("o", DAILY);
	getRecordsPeriodCookie("o", WEEKLY);
	ga('send', 'event',  'SquardleWeeklyStats', 'NA', arrayToTildeString(solvedWeeklyRecord)+'__'+arrayToTildeString(remainingWeeklyRecord)+"__"+currentStreak[2]+"_"+longestStreak[2]);
	getSeedCookie();
	getSettingsCookie();
	initSmallSquares();
	for(x=0; x<5; x++){		//Remove note data;
		playerNotes[x] = ["0","0","0","0","0"];
	}
	for(xm=0; xm<5; xm++){
		midSquares[xm] = [];
		for(ym=0; ym<5; ym++){
			makeMidSquare(xm, ym);
		}
	}
	var lettersDivContent = '<table border="0" cellspacing="0" cellpadding="0" width="600"><tr><td>'
	for(ym=0; ym<5; ym++){
		for(xm=0; xm<5; xm++){
			if(onBoard(xm, ym)){	//(xm != 1 && xm != 3) || (ym != 1 && ym != 3)
				lettersDivContent += '<img src="graphics/0.png" width="120" height="120" id="'+xm+'L'+ym+'" onclick="squareDown('+xm+','+ym+')" onfocus="this.blur();justFocusMan()">'
			}else{
				lettersDivContent += '<img src="graphics/0.png" width="120" height="120" id="'+xm+'L'+ym+'" onclick="squareDown('+xm+','+ym+')" onfocus="this.blur();justFocusMan()">'
			}
		}
		lettersDivContent += '<br>';
	}
	lettersDivContent += '</td></tr></table>';
	document.getElementById("lettersDiv").innerHTML = lettersDivContent;
	document.addEventListener('keydown', function(event) {
		const currentCode = event.which || event.code;
		var currentKey = event.key;
		if(!currentKey){
			currentKey = String.fromCharCode(currentCode);
		}
		keyDown(currentKey);
	})
	if(readGameId != "none"){
		if(readGameId.indexOf("d") == 0){
			var readDay = parseInt(readGameId.substring(1), 10);
			if(readDay == currentDay){
				if(getQueryVariable("s")){
					if((fastSeeds.indexOf(getQueryVariable("s").substring(0,4)) <= seedNr && fastSeeds.indexOf(getQueryVariable("s").substring(0,4)) != -1) || otherPlayedSeeds.indexOf(getQueryVariable("s").substring(0,4)) != -1){
						var overwrite = confirm("You have already played the linked board, and you have a partially played daily board saved. Overwrite daily board's save data and have it count as a loss for stats to play the linked board again?\n\n[OK] to overwrite, [Cancel] to resume playing the daily board.");
						if(overwrite){
							replay = true;
						}
					}else{
						var overwrite = confirm("You have a partially played daily board saved. Overwrite daily board's save data and have it count as a loss for stats to play the linked board?\n\n[OK] to overwrite, [Cancel] to resume playing the daily board.");
					}
					if(overwrite){
						//testC.push("O");
						//createTestCookie();
						if((fastSeeds.indexOf(readGameId) == -1 || fastSeeds.indexOf(readGameId) > seedNr) && otherPlayedSeeds.indexOf(readGameId) == -1){
							otherPlayedSeeds.push(readGameId);
							createSeedsCookie();
						}
						gameId = getQueryVariable("s").substring(0,4);
						createSquardleCookie();
						startUp(false, true, false);
						return(false);
					}else{
						//testC.push("C");
						//createTestCookie();
					}
				}
				fp = true;
				startUp(true, false, true);	//fastPlay
				return(false);
			}
		}else if(readGameId.indexOf("l") == 0){	//Weekly
			var readWeek = parseInt(readGameId.substring(1), 10);
			if(readWeek == currentWeek){
				if(getQueryVariable("s")){
					if((fastSeeds.indexOf(getQueryVariable("s").substring(0,4)) <= seedNr && fastSeeds.indexOf(getQueryVariable("s").substring(0,4)) != -1) || otherPlayedSeeds.indexOf(getQueryVariable("s").substring(0,4)) != -1){
						var overwrite = confirm("You have already played the linked board, and you have a partially played weekly board saved. Overwrite weekly board's save data and have it count as a loss for stats to play the linked freeplay board again?\n\n[OK] to overwrite, [Cancel] to resume playing the weekly board.");
						if(overwrite){
							replay = true;
						}
					}else{
						var overwrite = confirm("You have a partially played weekly board saved. Overwrite weekly board's save data and have it count as a loss for stats to play the linked freeplay board?\n\n[OK] to overwrite, [Cancel] to resume playing the weekly board.");
					}
					if(overwrite){
						//testC.push("O");
						//createTestCookie();
						if((fastSeeds.indexOf(readGameId) == -1 || fastSeeds.indexOf(readGameId) > seedNr) && otherPlayedSeeds.indexOf(readGameId) == -1){
							otherPlayedSeeds.push(readGameId);
							createSeedsCookie();
						}
						gameId = getQueryVariable("s").substring(0,4);
						createSquardleCookie();
						startUp(false, true, false);
						return(false);
					}else{
						//testC.push("C");
						//createTestCookie();
					}
				}
				fp = true;
				startUp(7, false, true);	//fastPlay
				return(false);
			}
		}else{
			if(getQueryVariable("s") && getQueryVariable("s").substring(0,4) != readGameId){
				if((fastSeeds.indexOf(getQueryVariable("s").substring(0,4)) <= seedNr && fastSeeds.indexOf(getQueryVariable("s").substring(0,4)) != -1) || otherPlayedSeeds.indexOf(getQueryVariable("s").substring(0,4)) != -1){
					var overwrite = confirm("You have already played the linked board, and you have a partially played freeplay board saved. Overwrite previous board's save data to play the linked board again?\n\n[OK] to overwrite, [Cancel] to resume playing the previous board.");
					if(overwrite){
						replay = true;
					}
				}else{
					var overwrite = confirm("You have a partially played freeplay board saved. Overwrite that board's save data to play the linked board?\n\n[OK] to overwrite, [Cancel] to resume playing the previous board.");
				}
				if(overwrite){
					//testC.push("o");
					//createTestCookie();
					if((fastSeeds.indexOf(readGameId) == -1 || fastSeeds.indexOf(readGameId) > seedNr) && otherPlayedSeeds.indexOf(readGameId) == -1){
						otherPlayedSeeds.push(readGameId);
						createSeedsCookie();
					}
					gameId = getQueryVariable("s").substring(0,4);
					createSquardleCookie();
					startUp(7, true, false);
					return(false);
				}else{
					//testC.push("c");
					//createTestCookie();
				}
			}
			gameId = readGameId;
			fp = true;
			startUp(false, false, true);	//fastPlay
			return(false);
		}
	}
	if(getQueryVariable("s")){
		startUp(false, true, false);
	}else{
	//	fixRecor();
		toggleGameModeSelection("visible");			
	}
}
loadedKb(74);
loadedFiles++;

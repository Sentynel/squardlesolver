function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
function makeSquare(fastPlay, pre){
	if(!gameIsOver){
		return(false)
	}
	if(fastPlay === 2){
		fp = true;
		getSquardleCookie(false, true);
		if(gameType == DAILY && readDailySeed != -1 && dailySeedsV2[currentDay] != 1162){
			init_genrand(readDailySeed);
		}
	}
	gameGuesses = [];
	creatingSquare = true;
	gameIsOver = false;
	if(gameType == DAILY && dailySeedsV2[currentDay] == 1162 && lang == "en"){
		setSquares("cwtchyehawstymytemolskyfs", fastPlay);
		return(true);
	}else if(gameType == DAILY && dailySeedsV2[currentDay] == 1162 && lang == "sv"){
		setSquares("bisolanesesexigsdtöaexakt", fastPlay);								
		return(true);
	}else if(gameType == DAILY && dailySeedsV2[currentDay] == 1162 && lang == "de"){
		setSquares("mobbtyaowoxylolozzalmotzt", fastPlay);
		return(true);
	}else if(gameType == WEEKLY){
//			init_genrand(Math.floor(Math.random()*1000000));
//			weeklyBoards = shuffleArray(weeklyBoards);
			var weekToUse = Math.max(currentWeek, 0);
			if(weekToUse < weeklyBoards.length){
				if(readWeeklyBoard != -1){
					setSquares(spoilerWeek(readWeeklyBoard, true), fastPlay);
				}else{
					setSquares(spoilerWeek(weeklyBoards[weekToUse], true), fastPlay);
				}
			}else{
				console.log(weekToUse + " weeklyBoards.length:" +weeklyBoards.length)
				alert("This weekly board isn't loaded. Try refreshing the page in your browser. If that doesn't help, remove your cached files (but NOT you cookies) and refresh again.\n\nIf that still doesn't help, see 'Version number' on the settings page for info on how to see if you are up to date.\n\nIt's also possible that I have somehow forgotten to update the game with the new weekly puzzles, as they are pre-generated. But given that I typically add them to the code more than a month in advance, the risk of this happening shouldn't be high.");
			}
//		getRandomWeekly(fastPlay);
		return(true);
	}
	while(true){
		if(pre == 1){	//Precalculate fast seeds for daily boards
			preIndex--;
			init_genrand(preIndex);
		}else if(pre == 2){	//Precalculate fast seeds for freeplay boards
			var d = [];
			do{
				d[0] = Math.floor(Math.random()*32);
				d[1] = Math.floor(Math.random()*32);
				d[2] = Math.floor(Math.random()*32);
				d[3] = Math.floor(Math.random()*alphaNoDL.length);
				gameId = ""+alphaNoDL.charAt(d[3])+""+alphaCode.charAt(d[2]).toUpperCase()+""+alphaCode.charAt(d[1]).toUpperCase()+""+alphaCode.charAt(d[0]).toUpperCase();
			}while(fastSeedsStart.indexOf(gameId) != -1);
			var seed = 0;
			for(gi=0; gi<gameId.length && gi<4; gi++){
				if(alphaCode.indexOf(gameId.charAt(gi).toLowerCase()) != -1){
					seed += (alphaCode.indexOf(gameId.charAt(gi).toLowerCase()) * Math.pow(36, gi));
				}
			}
			init_genrand(seed);
		}
		clearSquare();
		wordsUsed = ["","","","","","","","","",""];
		preShuffle = Math.floor(genrand_real1()*6)
		var ok = false;
		var okPre = true;
		while(!ok){
			for(rnX=0; rnX<5; rnX+=2){
				for(rnY=0; rnY<5; rnY+=2){
					square[rnX][rnY] = getLetter();
				}
			}
			var tryAgain = 0;
			for(x=0; x<5; x+=2){				
				//Rnd colSquares
				var rndAnswerCol = findWords(square[x][0]+"_"+square[x][2]+"_"+square[x][4]);
				var rndAnswerRow = findWords(square[0][x]+"_"+square[2][x]+"_"+square[4][x]);	//Note x reversed.
				if(rndAnswerCol && rndAnswerRow && rndAnswerCol != rndAnswerRow && wordsUsed.indexOf(rndAnswerCol) == -1 &&  wordsUsed.indexOf(rndAnswerRow) == -1){
					wordsUsed[x] = rndAnswerCol;
					wordsUsed[x+5] = rndAnswerRow;
					square[x] = rndAnswerCol.split("");
					for(yt=1; yt<4; yt+=2){
						if(x==1 || x==3){
							continue; 
						}
						square[yt][x] = rndAnswerRow.charAt(yt);	//Note x reversed.
					}
					ok = true;
					tryAgain = 0;
				}else{
					if(tryAgain > 25){
						okPre = false;
						x = -2; //Restart search for whole grid.
						ok = false;
						clearSquare();
						wordsUsed = ["","","","","","","","","",""];
					}else{
						if(!rndAnswerCol && !rndAnswerRow){
							square[x][x] = getLetter();
						}else if(!rndAnswerCol){
							var twoFour = Math.ceil(genrand_real1()*2)*2;
							square[x][Math.min(4,x+twoFour)] = getLetter();
						}else{
							var twoFour = Math.ceil(genrand_real1()*2)*2;
							square[Math.min(4,x+twoFour)][x] = getLetter();
						}
						tryAgain++;
						x -= 2;
					}
				}
			}
		}
		if(pre == 1){
			if(okPre){
				preResult.push(-preIndex);
			}
			if(preResult.length >= 200){
				document.write(preResult);
				return(true);
			}else{
				makeSquare(false, 1);
			}
		}else if(pre == 2){
			if(okPre){
				fastSeedsStart += gameId + " ";
				preResult.push(gameId);
				if(preResult.length % 10 == 0 && preResult.length > 0){
					document.getElementById("testOutputDiv").innerHTML = fastSeedsStart;
				}
			}
			if(preResult.length >= 4500){
				document.write(fastSeedsStart);
				return(true);
			}else{
				makeSquare(false, 2);
			}
		}else if(pre == 3){
			return(true);
		}else{
			if(genrand_real1() < 0.5){	//Flipping board half of the time since distribution of common answers differs between cols and rows.
				var temp = [];
				for(wu=0; wu<10; wu++){
					temp[wu] = wordsUsed[wu]
				}
				for(wu=0; wu<10; wu++){
					wordsUsed[wu] = temp[(wu + 5) % 10];
				}
				var tempSquare = []
				for(x=0; x<5; x++){
					tempSquare[x] = [];
					for(y=0; y<5; y++){
						tempSquare[x][y] = square[x][y];
					}
				}
				for(x=0; x<5; x++){
					for(y=0; y<5; y++){
						square[x][y] = tempSquare[y][x];
					}
				}
			}
			allLettersInSquare = wordsUsed.join("");
			wordsUsed[1] = square[1][0] + square[1][2] + square[1][4];
			wordsUsed[3] = square[3][0] + square[3][2] + square[3][4];
			wordsUsed[6] = square[0][1] + square[2][1] + square[4][1];
			wordsUsed[8] = square[0][3] + square[2][3] + square[4][3];
			doneWithSquare(fastPlay);
			return(true);
		}
	}
}
function spoilerWeek(inp, de){	//Yes, you can obviously use this to spoil yourself if you want to. This is mainly so I can play the weekly puzzles myself without having to have upcoming ones spoiled by looking at my code, and so that anyone reading their cookies won't spoil themselves accidentally.
	var alphaWeek = "abcdefghijklmnopqrstuvwxyzñåäö-______PCDQRYZ4HJKL2E1VWXUMIFGST3ABNO-______";
	var ret = ""
	var ce = 37;
	if(de){
		ce = -ce;
	}
	for(le=0; le<inp.length; le++){
		ret += alphaWeek.charAt(alphaWeek.indexOf(inp.charAt(le)) + ce);
		
	}
	return(ret);
}
const regex1 = /1/g, regex2 = /2/g, regex3 = /3/g, regex4 = /4/g, regex5 = /5/g, regex6 = /6/g, regex7 = /7/g, regex8 = /8/g;
function decodeGuess(inData){
	inData = inData.replace(regex1, "å")
	inData = inData.replace(regex2, "ä")
	inData = inData.replace(regex3, "ö")
	inData = inData.replace(regex4, "ñ")
	return(inData);
}
function doneWithSquare(fastPlay){
	document.getElementById("columnMarker").style.left = (55) + "px";
	document.getElementById("rowMarker").style.top = (125) + "px";
	document.getElementById("remaining").style.visibility = "visible";
	document.getElementById("keyboardLetters").style.display = "inline";
	document.getElementById("keyboardColors").style.display = "inline";
	document.getElementById("columnMarker").style.visibility = "visible";
	document.getElementById("rowMarker").style.visibility = "visible";
	document.getElementById("creatingBoard").style.visibility = "hidden";
	creatingSquare = false;
	if(fastPlay){
		initSmallSquares();
		for(rg=0; rg < readGameGuesses.length; rg++){
			makeGuess(decodeGuess(readGameGuesses[rg]));
		}
		for(rg=0; rg < readFaded.length; rg++){
			fadeSmallSquare(readFaded[rg][0],readFaded[rg][1],readFaded[rg][2], true);
			if(readFaded[rg][3]){	//If IS_FADED should be 2, fade it again.
				fadeSmallSquare(readFaded[rg][0],readFaded[rg][1],readFaded[rg][2], true);
			}
		}
		for(rg=0; rg < readBlueNotes.length; rg++){
			if(!solvedSquares[ readBlueNotes[rg][0] ][ readBlueNotes[rg][1] ]){
				makingNote = [readBlueNotes[rg][0], readBlueNotes[rg][1]];
				gameState = 3;
				eitherKey("Key"+readBlueNotes[rg][2].toUpperCase(), false, false);
				if(readBlueNotes[rg][2].toUpperCase() != readBlueNotes[rg][2]){
					makeBlueNote(readBlueNotes[rg][0], readBlueNotes[rg][1]);
					eitherKey("Enter", false, false);
				}
			}
		}
		if(fastPlay !== 2){
			fp = false;
		}
		if(!testReadingCookie("_recor_d") && testReadingCookie("_reco_d") && cookiesEnabled){
			if(gameType == DAILY){
				solvedDailyRecord[countSolvedSquares()]--;
				remainingDailyRecord[13]--;
			}else if(gameType == FREE){
				solvedFreeplayRecord[countSolvedSquares()]--;
				remainingFreeplayRecord[13]--;
			}
		}
		// fixRecor(); 
	}else if(gameType == WEEKLY){
		setWeeklyStartup();
	}
}
function setSquares(inD, fastPlay){
	var ao = 0;
	wordsUsed = ["","","","","","","","","",""]
	for(xo=0; xo<5; xo++){
		square[xo] = [];
	}
	for(xo=0; xo<5; xo++){
		for(yo=0; yo<5; yo++){
			if(gameType == WEEKLY || ((xo != 1 && xo != 3) || (yo != 1 && yo != 3))){
				wordsUsed[xo] += inD.charAt(ao);
				wordsUsed[yo+5] += inD.charAt(ao);
				square[xo][yo] = inD.charAt(ao);
			}else{
				square[xo][yo] = "-";
			}
			ao++;
		}
	}
	allLettersInSquare = wordsUsed.join("");
	doneWithSquare(fastPlay);
}
/*
var weeklyBoards = []
if(getQueryVariable("l") == "en" || getQueryVariable("lang") == "en" || (!getQueryVariable("lang") && !getQueryVariable("l"))){
	weeklyBoards = ['','ZXPUUXPED4HF1XT2RQPLRER2T','QXP2PXRZPLPLHKRVPLRXRSRXM','UD1YY2RMX1PLMRXULRRM41XQR','UMPYYDPVRX1VHERVREDRRQZRQ'];
}else if(getQueryVariable("l") == "sv" || getQueryVariable("lang") == "sv"){
	weeklyBoards = ['','MPKBU1LHKPXHFPLUKPEUKPUMP', 'YRLPUPFPXMXRMX1PEMPL1MPKM', 'U1CRXKLPFRTLLRE21JEPYEPMM', '1U21UZLHVPXIMHENXXPQUKPMP'];
}else if(getQueryVariable("l") == "de" || getQueryVariable("lang") == "de"){
	weeklyBoards = ['','CPXQRPLHPUXHMIURCRER2HERE', 'CPXR2HK1ERUMIQHUHMRURFREM', 'PLMRXCHXERRMPZRERCRLQXHLL', 'XHUURPEMHKUMIMRRXVRLX1UUM'];
}else if(getQueryVariable("l") == "br" || getQueryVariable("lang") == "br" || getQueryVariable("l") == "pt-br"  || getQueryVariable("lang") == "pt-br"){
	weeklyBoards = ['','URDPXRSP2RL1DPLHQPQR21XPX', 'DPUPLPD1LPVILPXHQPQR2RX1U', 'CP2CPRD1PXLHFXRP2RCPUPLPU', 'PXDPXL1IXPMIM1XPDH2PX1UPU'];
}else if(getQueryVariable("l") == "es" || getQueryVariable("lang") == "es"){
	weeklyBoards = ['','XPQPXPL1JP2R2R3PLPE1LHX1E', 'D1V1EIUIXPMRAHXHXPEHUPLP3', 'XPVPXPLPCRJRXR3PLRJPX1QPX', 'PDPM1DPL1XPCRDRXRL1J1XHEP'];
}
*/
//first 6:
var weeklyBoards = []
if(getQueryVariable("l") == "en" || getQueryVariable("lang") == "en" || (!getQueryVariable("lang") && !getQueryVariable("l"))){
	weeklyBoards = ['','ZXPUUXPED4HF1XT2RQPLRER2T', 'QXP2PXRZPLPLHKRVPLRXRSRXM', 'UD1YY2RMX1PLMRXULRRM41XQR', 'UMPYYDPVRX1VHERVREDRRQZRQ', 'DXH2RLR21EHEVIMYPLURYLTRX', 'U21DKGPSREPUHQR21QPLHERXM','V1URXPVVLRURXHYMXHMRRPZRX'];
}else if(getQueryVariable("l") == "sv" || getQueryVariable("lang") == "sv"){
	weeklyBoards = ['','MPKBU1LHKPXHFPLUKPEUKPUMP', 'YRLPUPFPXMXRMX1PEMPL1MPKM', 'U1CRXKLPFRTLLRE21JEPYEPMM', '1U21UZLHVPXIMHENXXPQUKPMP', 'CPUMIPLMPEULIXKPXM1EXPUMP', 'EPUPL1XREP2REHZREHEZEPZZP', 'PMLPUYXPEKYTEQPNEZRXXRPLR', 'IMKHKM1XU1MXNMPPEKRLLPUXP', 'KHLLRPXHPEM1XUKREKRLMHPXP', 'K1K1UPLPX2KNEZPPUMRX1MPLM', 'RMHUKEPDKPKLHXXNZEPQMPZLP', 'PKM1X21XUPVLI2URLL1KL1UUP', 'CPUPXIEKEPUEPZZKPERLREKLP'];
}else if(getQueryVariable("l") == "de" || getQueryVariable("lang") == "de"){
	weeklyBoards = ['','CPXQRPLHPUXHMIURCRER2HERE', 'CPXR2HK1ERUMIQHUHMRURFREM', 'PLMRXCHXERRMPZRERCRLQXHLL', 'XHUURPEMHKUMIMRRXVRLX1UUM', 'CPXQRPLHPUXHMIURCRER2HERE', 'CPXR2HK1ERUMIQHUHMRURFREM', 'PLMRXCHXERRMPZRERCRLQXHLL', 'XHUURPEMHKUMIMRRXVRLX1UUM', 'KXPKRXPQPXRQLRECHRUMU1XMR', 'CLPUUX1QR1PCREQFRXURHEERE', 'LHRUMPQLRX2RHLRVPMRERLREQ', 'PLLRUURHERUHRZRREZRLLRRXR', 'U1XZRMRIRXPLVHEXRHUMKERMR', 'ZPMMRRM4HKX1RMRP2URLMRRXM', 'UPLPMMXPCHPRUMRXPUIXKL1ER', 'VX12HXPIRE1UMRELRRXR1XMRE', 'KR4LRPLHPU2HEIURMPZRLRCRE'];
}else if(getQueryVariable("l") == "br" || getQueryVariable("lang") == "br" || getQueryVariable("l") == "pt-br"  || getQueryVariable("lang") == "pt-br"){
	weeklyBoards = ['','URDPXRSP2RL1DPLHQPQR21XPX', 'DPUPLPD1LPVILPXHQPQR2RX1U', 'CP2CPRD1PXLHFXRP2RCPUPLPU', 'PXDPXL1IXPMIM1XPDH2PX1UPU', 'VHM1EPX12PZPURUPQPZP21XPL', 'URDPX1VPD121FRLPDPU1XPXPU', 'URDPX1VPD121MRLPDPU1XPXPU', 'URDPXRSP2RL1DPLHQPQR21XPX', 'DPUPLPD1LPVILPXHQPQR2RX1U', 'CP2CPRD1PXLHFXRP2RCPUPLPU', 'PXDPXL1IXPMIM1XPDH2PX1UPU', 'DPFPXPXHQ1D1XPLP2PZ1XPXPU', 'VPXPXPXHQ1E12RU12RZPUPLPU', 'URLPXPDH2P21FRXCPXCPPXRPU', 'YHEPLPX12PLPFPXHQPQRX1UPU', 'D1DPX1MH21XHFPLPDHQ1X1UPU', 'D1DPXPVRL1LRMPLPXHQ1XP21U'];
}else if(getQueryVariable("l") == "es" || getQueryVariable("lang") == "es"){
	weeklyBoards = ['','XPQPXPL1JP2R2R3PLPE1LHX1E', 'D1V1EIUIXPMRAHXHXPEHUPLP3', 'XPVPXPLPCRJRXR3PLRJPX1QPX', 'PDPM1DPL1XPCRDRXRL1J1XHEP', 'XR2PXPM1X12HMPQ1LHQPU1EPX', 'ZL1UPXPJPXPCRM1M1MR2PXREP', '2R2R3PM1X1LPMHXPVRPXXPLL1', 'XPQPXPL1JP2R2R3PLPE1LHX1E', 'D1V1EIUIXPMRAHXHXPEHUPLP3', 'XPVPXPLPCRJRXR3PLRJPX1QPX', 'PDPM1DPL1XPCRDRXRL1J1XHEP', 'Q12PX1VPD1MP2H3PLIQPX1M1X', 'DPVP31C1L1VRQHX1JRPXEPXXP', 'FPZPXPVIXRUPLP3PAPQPX1ZPX', 'MPXU1PLRPXCRMIELLPEPPHXPX', 'VPVPLPEH2PJ1FREPQ1CPX1MPX', 'DRMX1PXXPUCX1MRX1M1XPXREP'];
}

var weeklyHeader = "Weekly Squardle"
var weeklyMessages = ["",
"You know how the crosswords in newspapers are typically bigger and harder to solve on Sundays? <em>Weekly Squardle</em> is just like normal Squardle, but bigger and harder to solve! It does away with <img src='graphics/weekly_example.png' width='260' heigh='260' align='left' hspace='5'> the dead space on the board by removing the four holes on the board, thus it has 10 different words to solve!<br><br>On top of this you only start with <b>8 guesses</b>! Completing a row or column (other than the final ones) still earns you bonus guesses though. This means that if you can get one <em>more</em> guess than in normal Squardle. But beware of spending too many of your early guesses on hunting for letters &mdash; if you don't start solving words, those 8 guesses could be all you get!<br><br><b>Haven't played Squardle before?</b> Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules.<br><br>While Weekly Squardle boards will be <em>released</em> on Sundays, you can save playing a weekly board for any of the six following days.<br><br>Finding these <em>\"Double Magic Squares\"</em> is a bit trickier than it is to make the normal Squardle boards, so they have to be generated in advance. The possible legal boards  are limited, especially since I want to avoid ones that include multiple words repeated from another board or words that are too obscure. This is the reason why there won't be a freeplay mode for this type of board &mdash; we'd simply run out of boards if we did.<br><br>Future Weekly Squardles may change the rules further, so don't make a habit of clicking past this screen without reading it. I <em>will</em> do my best to be more brief in the future though.<br><br>Good luck, and I hope you enjoy the puzzle! Click <a href=\'javascript:startGame(7)\'>here</a> to start the first Weekly Squardle!<br><br>~FurbyFubar", 
"No new rules for this week's Weekly Squarde. You still have to solve 10 words in a 5x5 grid without holes. You still only get 8 guesses to start with.<br><br>Good luck!<br><br>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle!<br><br>~FurbyFubar<br><br><b>PS.</b> Haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!",
"No new rules this Weekly Squarde. You still have to solve 10 words in a 5x5 grid without holes. You still only get 8 guesses to start with.<br><br>However, <em>next</em> week there will be a small change to the English Weekly Squardle. Since there only exist 81 legal solutions to Weekly Squardle if we're using the legal answers from the original Wordle list, and a high percentage of those are just small variations of each other I will have to expand the word list eventually. Since I'd rather save the <em>possibility</em> for boards <em>without</em> new words to show up for as long as possible, and as I don't want to give you repetitive boards, next week will be the first week using an expanded word list. Don't worry, there are still quite a few not too rare five letter words that can be used.<br><br>If you want to help me pick out what words to add to the list in the future I have set up <a href='../word-sorter' target=_blank'>this word sorter site</a>&nbsp;<a href='../word-sorter' target=_blank'><img src='graphics/external-link2.png' width='14' height='14'></a> where you can drag and drop batches of 10 random words to place what you think is the the most common word at the top. Yes, I know, a lot of those words don't <em>look</em> like words. But again, those aren't the ones I'm planning to add to the game, and with enough people sorting it should be possible to get some sort of consensus of what words are and aren't well known. The word sorter is also linked in Squardle's FAQ if you just want to get on with this week's board first!<br><br>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle! Good luck!<br><br>~FurbyFubar<br><br><b>PS.</b> Haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!",
"Starting this week the possible answers for Weekly Squardle in English is slightly expanded. This is to stop us from running out of valid boards too soon. I have no intention of changing the word list used by Daily and Freeplay Squardle. If you want to help me pick out what five letter words you consider common to be added to the Weekly Squardle I have set up <a href='../word-sorter' target=_blank'>this word sorter site</a>&nbsp;<a href='../word-sorter' target=_blank'><img src='graphics/external-link2.png' width='14' height='14'></a> where you can drag and drop batches of 10 random words to place what you think is the the most common word at the top. Yes, I know, a lot of those words don't <em>look</em> like words. But again, those aren't the ones I'm planning to add to the game, and with enough people sorting it should be possible to get some sort of consensus of what words are and aren't well known. The word sorter is also linked in Squardle's FAQ if you just want to get on with this week's board first!<br><br>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle! Good luck!<br><br>~FurbyFubar<br><br><b>PS.</b> Haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!",
"<h3>Expanded word list</h3>As mentioned last week, the possible answers in Weekly Squardle has been very slightly expanded.<br><br>If you want to help me pick out what five letter words <em>you</em> consider common, to be added in the future I have set up <a href='../word-sorter' target=_blank'>this word sorter site</a>&nbsp;<a href='../word-sorter' target=_blank'><img src='graphics/external-link2.png' width='14' height='14'></a> where you can drag and drop batches of 10 random words to place what you think is the the most common word at the top. <h3>Start Weekly Squardle</h3>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle! Good luck!<br><br>~FurbyFubar<br><br><h3>PS. Are you <em>new</em> to Squardle?</h3> If you haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!",
"<h3>How is Weekly Squardle different?</h3><ul><li>The four holes on the board are gone.<br><br></li><li>There are <b>10 words to solve</b> and <b>8 bonus guesses</b> to get. (A final winning guess always solves at least a row <em>and</em> a column, so those don't generate bonus guesses.)<br><br></li><li>Weekly Squardle in English uses an <b>expanded word list</b> of possible answers. Otherwise there simple aren't enough legal boards! All answers are of course still English words that would be legal in Scrabble; they're just aren't picked from a slightly longer list than Wordle's original list of answers that normal Squardle boards use.<br><br>If you want to help me pick out what words might be added the list in the future I have set up <a href='../word-sorter' target=_blank'>this word sorter site</a>&nbsp;<a href='../word-sorter' target=_blank'><img src='graphics/external-link2.png' width='14' height='14'></a></li></ul><h3>Start Weekly Squardle</h3>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle! Good luck!<br><br>~FurbyFubar<br><h3>PS. Are you <em>new</em> to Squardle?</h3>Haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!",
"<h3>How is Weekly Squardle different?</h3><ul><li>The four holes on the board are gone.<br><br></li><li>There are <b>10 words to solve</b> and <b>8 bonus guesses</b> to get. (A final winning guess always solves at least a row <em>and</em> a column, so those don't generate bonus guesses.)<br><br></li><li>Weekly Squardle in English uses an <b>expanded word list</b> of possible answers. Otherwise there simple aren't enough legal boards! All answers are of course still English words that would be legal in Scrabble; they're just aren't picked from a slightly longer list than Wordle's original list of answers that normal Squardle boards use.<br><br>If you want to help me pick out what words might be added the list in the future I have set up <a href='../word-sorter' target=_blank'>this word sorter site</a>&nbsp;<a href='../word-sorter' target=_blank'><img src='graphics/external-link2.png' width='14' height='14'></a></li></ul><h3>Start Weekly Squardle</h3>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle! Good luck!<br><br>~FurbyFubar<br><h3>PS. Are you <em>new</em> to Squardle?</h3>Haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!",
"<h3>How is Weekly Squardle different?</h3><ul><li>The four holes on the board are gone.<br><br></li><li>There are <b>10 words to solve</b> and <b>8 bonus guesses</b> to get. (A final winning guess always solves at least a row <em>and</em> a column, so those don't generate bonus guesses.)<br><br></li><li>Weekly Squardle in English uses an <b>expanded word list</b> of possible answers. Otherwise there simple aren't enough legal boards! All answers are of course still English words that would be legal in Scrabble; they're just aren't picked from a slightly longer list than Wordle's original list of answers that normal Squardle boards use.<br><br>If you want to help me pick out what words might be added the list in the future I have set up <a href='../word-sorter' target=_blank'>this word sorter site</a>&nbsp;<a href='../word-sorter' target=_blank'><img src='graphics/external-link2.png' width='14' height='14'></a></li></ul><h3>Start Weekly Squardle</h3>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle! Good luck!<br><br>~FurbyFubar<br><h3>PS. Are you <em>new</em> to Squardle?</h3>Haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!",
"<h3>How is Weekly Squardle different?</h3><ul><li>The four holes on the board are gone.<br><br></li><li>There are <b>10 words to solve</b> and <b>8 bonus guesses</b> to get. (A final winning guess always solves at least a row <em>and</em> a column, so those don't generate bonus guesses.)<br><br></li><li>Weekly Squardle in English uses an <b>expanded word list</b> of possible answers. Otherwise there simple aren't enough legal boards! All answers are of course still English words that would be legal in Scrabble; they're just aren't picked from a slightly longer list than Wordle's original list of answers that normal Squardle boards use.<br><br>If you want to help me pick out what words might be added the list in the future I have set up <a href='../word-sorter' target=_blank'>this word sorter site</a>&nbsp;<a href='../word-sorter' target=_blank'><img src='graphics/external-link2.png' width='14' height='14'></a></li></ul><h3>Start Weekly Squardle</h3>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle! Good luck!<br><br>~FurbyFubar<br><h3>PS. Are you <em>new</em> to Squardle?</h3>Haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!",
"<h3>How is Weekly Squardle different?</h3><ul><li>The four holes on the board are gone.<br><br></li><li>There are <b>10 words to solve</b> and <b>8 bonus guesses</b> to get. (A final winning guess always solves at least a row <em>and</em> a column, so those don't generate bonus guesses.)<br><br></li><li>Weekly Squardle in English uses an <b>expanded word list</b> of possible answers. Otherwise there simple aren't enough legal boards! All answers are of course still English words that would be legal in Scrabble; they're just aren't picked from a slightly longer list than Wordle's original list of answers that normal Squardle boards use.<br><br>If you want to help me pick out what words might be added the list in the future I have set up <a href='../word-sorter' target=_blank'>this word sorter site</a>&nbsp;<a href='../word-sorter' target=_blank'><img src='graphics/external-link2.png' width='14' height='14'></a></li></ul><h3>Start Weekly Squardle</h3>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle! Good luck!<br><br>~FurbyFubar<br><h3>PS. Are you <em>new</em> to Squardle?</h3>Haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!",
"<h3>How is Weekly Squardle different?</h3><ul><li>The four holes on the board are gone.<br><br></li><li>There are <b>10 words to solve</b> and <b>8 bonus guesses</b> to get. (A final winning guess always solves at least a row <em>and</em> a column, so those don't generate bonus guesses.)<br><br></li><li>Weekly Squardle in English uses an <b>expanded word list</b> of possible answers. Otherwise there simple aren't enough legal boards! All answers are of course still English words that would be legal in Scrabble; they're just aren't picked from a slightly longer list than Wordle's original list of answers that normal Squardle boards use.<br><br>If you want to help me pick out what words might be added the list in the future I have set up <a href='../word-sorter' target=_blank'>this word sorter site</a>&nbsp;<a href='../word-sorter' target=_blank'><img src='graphics/external-link2.png' width='14' height='14'></a></li></ul><h3>Start Weekly Squardle</h3>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle! Good luck!<br><br>~FurbyFubar<br><h3>PS. Are you <em>new</em> to Squardle?</h3>Haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!",
"<h3>How is Weekly Squardle different?</h3><ul><li>The four holes on the board are gone.<br><br></li><li>There are <b>10 words to solve</b> and <b>8 bonus guesses</b> to get. (A final winning guess always solves at least a row <em>and</em> a column, so those don't generate bonus guesses.)<br><br></li><li>Weekly Squardle in English uses an <b>expanded word list</b> of possible answers. Otherwise there simple aren't enough legal boards! All answers are of course still English words that would be legal in Scrabble; they're just aren't picked from a slightly longer list than Wordle's original list of answers that normal Squardle boards use.<br><br>If you want to help me pick out what words might be added the list in the future I have set up <a href='../word-sorter' target=_blank'>this word sorter site</a>&nbsp;<a href='../word-sorter' target=_blank'><img src='graphics/external-link2.png' width='14' height='14'></a></li></ul><h3>Start Weekly Squardle</h3>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle! Good luck!<br><br>~FurbyFubar<br><h3>PS. Are you <em>new</em> to Squardle?</h3>Haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!",
"<h3>How is Weekly Squardle different?</h3><ul><li>The four holes on the board are gone.<br><br></li><li>There are <b>10 words to solve</b> and <b>8 bonus guesses</b> to get. (A final winning guess always solves at least a row <em>and</em> a column, so those don't generate bonus guesses.)<br><br></li><li>Weekly Squardle in English uses an <b>expanded word list</b> of possible answers. Otherwise there simple aren't enough legal boards! All answers are of course still English words that would be legal in Scrabble; they're just aren't picked from a slightly longer list than Wordle's original list of answers that normal Squardle boards use.<br><br>If you want to help me pick out what words might be added the list in the future I have set up <a href='../word-sorter' target=_blank'>this word sorter site</a>&nbsp;<a href='../word-sorter' target=_blank'><img src='graphics/external-link2.png' width='14' height='14'></a></li></ul><h3>Start Weekly Squardle</h3>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle! Good luck!<br><br>~FurbyFubar<br><h3>PS. Are you <em>new</em> to Squardle?</h3>Haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!",
"<h3>How is Weekly Squardle different?</h3><ul><li>The four holes on the board are gone.<br><br></li><li>There are <b>10 words to solve</b> and <b>8 bonus guesses</b> to get. (A final winning guess always solves at least a row <em>and</em> a column, so those don't generate bonus guesses.)<br><br></li><li>Weekly Squardle in English uses an <b>expanded word list</b> of possible answers. Otherwise there simple aren't enough legal boards! All answers are of course still English words that would be legal in Scrabble; they're just aren't picked from a slightly longer list than Wordle's original list of answers that normal Squardle boards use.<br><br>If you want to help me pick out what words might be added the list in the future I have set up <a href='../word-sorter' target=_blank'>this word sorter site</a>&nbsp;<a href='../word-sorter' target=_blank'><img src='graphics/external-link2.png' width='14' height='14'></a></li></ul><h3>Start Weekly Squardle</h3>Click <a href=\'javascript:startGame(7)\'>here</a> to start the Weekly Squardle! Good luck!<br><br>~FurbyFubar<br><h3>PS. Are you <em>new</em> to Squardle?</h3>Haven't played Squardle before? Then I strongly recommend playing a game of <a href=\'javascript:togglePage(\"game\");startGame(false)\'>Freeplay Squardle</a> first to familiarize yourself with the rules. Weekly Squardle is an even harder version of Squardle, and normal Squardle is tricky enough to figure out for your first game!"];
loadedKb(6);
loadedFiles++;
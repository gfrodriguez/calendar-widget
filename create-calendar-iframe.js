/*
 * create-calendar-iframe.js v1.0
 * Url demo: http://jmacuna73.blogspot.com/2015/02/calendario-publicacion-blogger.html
 * You are free to use the code below and modify it according to your needs.
 * Date: 2015-04-29
 * Author: José María Acuña Morgado || Web Developer
 * Email: jm.acuna73@gmail.com
 */

var confJson = {day:'', month:'', year:'', dateText:''},
	confDoc = window.frames['calendar'].contentDocument || window.frames['calendar'].document,
	confDate = {monthName:[], dayName:[], today:new Date()},
	confToday = {dateNow:confDate.today.getDate(), monthNow:confDate.today.getMonth(), yearNow:confDate.today.getYear()},
	confStyle = {anchor:'text-decoration:none;color:#000;cursor:default;', border:'border:1px solid #6F695A;', family:'verdana,arial;', size:11, bgover:'#d2d2d2'},
	confSource = {right:'https://cdn.rawgit.com/jmacuna/calendar-widget/master/right.gif', left:'https://cdn.rawgit.com/jmacuna/calendar-widget/master/left.gif', drop:'https://cdn.rawgit.com/jmacuna/calendar-widget/master/drop.gif'}
	confOther = {content:null, contentMonth:null, contentYear:null, contentDate:null, monthSelected:0, yearSelected:0, dateSelected:0, monthPosition:false, monthConstructed:false, yearConstructed:false, interval1:null, interval2:null, timeout1:null, timeout2:null, startYear:0}

window.onload = function(){

	var date, year, month, day,
		contentDate, pos,
		styleArrow, styleDate, headCalendar, widthCalendar;

	date = new Date();
	month = date.getUTCMonth() + 1; //months from 1-12
	day = date.getUTCDate();
	year = date.getUTCFullYear();
	
	if(month.length < 2) month = '0'+month;
	if(day.length < 2) day = '0'+day;
	
	confJson.year = year;
	confJson.month = month;
	confJson.day = day;
	confJson.dateText = day+'/'+month+'/'+year;
	
	if(confJson.dateText.length){
		for(var nMonth=0; nMonth<11; nMonth++){
			pos = conf.months.indexOf('|');
			if(pos > 0)
				parent.confDate.monthName[nMonth] = conf.months.substr(0, pos);

			conf.months = conf.months.substr(pos + 1);
		}
		parent.confDate.monthName[11] = conf.months;
		
		for(var nDay=0; nDay<6; nDay++){
			pos = conf.days.indexOf("|");
			if(pos > 0){
				parent.confDate.dayName[nDay] = conf.days.substr(0, pos);
			}
			conf.days = conf.days.substr(pos + 1);
		}
		parent.confDate.dayName[6] = conf.days;	
		parent.confToday.yearNow += 1900;
		parent.confOther.monthConstructed = false;
		parent.confOther.yearConstructed = false;

		widthCalendar = 200; //calendar size
		contentDate = "\
		<div id='contentDate' style='width:"+widthCalendar+"px'><table style='text-align:center;font-family:"+confStyle.family+"font-size:"+confStyle.size+"px;box-shadow:0 0 10px #333;background-color:#fff'><tr id='chead' style='background-color:"+conf.bgcolor+";'><td><table style='width:218px'><tr><td style='padding:2px;font-family:arial; font-size:"+confStyle.size+"px;text-align:center'><span style='color:#fff'><strong><span id='caption'></span></strong></span></td></tr></table></td></tr><tr><td style='padding:5px;background-color:#fff'><span id='content'></span></td></tr>\
		<tr style='background-color:"+confStyle.bgover+"'><td style='padding:5px' align='center'><span id='lblToday'></span></td></tr>\
		</table></div><div id='selectMonth' style='position:relative;max-width:"+widthCalendar+"px;visibility:hidden;'></div><div id='selectYear' style='position:relative;top:0;max-width:"+widthCalendar+"px;visibility:hidden;'></div>";

		confDoc.body.innerHTML = contentDate;
		confDoc.getElementById("lblToday").innerHTML =	"<a title='"+conf.date+"' style='"+confStyle.anchor+";cursor:pointer;' href='#' onclick='parent.confOther.monthSelected=parent.confToday.monthNow;parent.confOther.yearSelected=parent.confToday.yearNow;parent.constructCalendar();return false;'>"+parent.confDate.dayName[(parent.confDate.today.getDay()-conf.start==-1)?6:(parent.confDate.today.getDay()-conf.start)]+", "+parent.confToday.dateNow+" " +parent.confDate.monthName[parent.confToday.monthNow]+" "+parent.confToday.yearNow+"</a>";
		
		parent.confOther.content = confDoc.getElementById("contentDate").style;
		parent.confOther.contentMonth = confDoc.getElementById("selectMonth").style;
		parent.confOther.contentYear = confDoc.getElementById("selectYear").style;
		parent.confOther.contentDate = confDoc.getElementById("contentDate");

		styleArrow = "border:1px solid #eee;cursor:pointer;padding:1;";
		styleDate = "font-family:"+confStyle.family+"font-weight:bold;font-size:"+confStyle.size+"px;color:#313131;border:1px solid #eee;cursor:pointer;"

		headCalendar = "<table width='100%' cellpadding='1' cellspacing='2'><tr><td style='width:5px'><div id='spanLeft' style='"+styleArrow+"' onmouseover='parent.overMonth(this);' onclick='parent.decMonth()' onmouseout='parent.clearInterval(parent.confOther.interval1);parent.outMonth(this);' onmousedown='parent.clearTimeout(parent.confOther.timeout1);parent.confOther.timeout1=parent.setTimeout(\"StartDecMonth()\",500)' onmouseup='parent.clearTimeout(parent.confOther.timeout1);parent.clearInterval(parent.confOther.interval1)'><img id='changeLeft' src='"+confSource.left+"'></div></td>";
		headCalendar += "<td style='width:5px'><div id='spanRight' style='"+styleArrow+"' onmouseover='parent.overMonth(this);' onmouseout='parent.clearInterval(parent.confOther.interval1);parent.outMonth(this);' onclick='parent.incMonth()' onmousedown='parent.clearTimeout(parent.confOther.timeout1);parent.confOther.timeout1=parent.setTimeout(\"StartIncMonth()\",500)' onmouseup='parent.clearTimeout(parent.confOther.timeout1);parent.clearInterval(parent.confOther.interval1)'><img id='changeRight' src='"+confSource.right+"'></div></td>";
		headCalendar += "<td style='text-align:right'><span id='spanMonth' style='background-color:#fff;"+styleDate+"' onmouseover='parent.overBox(this);' onmouseout='parent.outBox(this);' onclick='parent.popUpMonth()'></span></td>";
		headCalendar += "<td style='text-align:right'><span id='spanYear' style='background-color:#fff;"+styleDate+"' onmouseover='parent.overBox(this);' onmouseout='parent.outBox(this);' onclick='parent.popUpYear()'></span></td></tr></table>";

		confDoc.getElementById("caption").innerHTML  =	headCalendar;
		popUpCalendar();
	}
}
function overMonth(obj){
	obj.style.backgroundColor = confStyle.bgover;
}
function outMonth(obj){
	obj.style.backgroundColor = conf.bgcolor;
}
function overBox(obj){
	obj.style.backgroundColor = "#ced2db";
}
function outBox(obj){
	obj.style.backgroundColor = "#fff";
}
function StartDecMonth(){
	parent.confOther.interval1 = setInterval("decMonth()",80);
}
function StartIncMonth(){
	parent.confOther.interval1 = setInterval("incMonth()",80);
}
function incMonth(){
	parent.confOther.monthSelected++;
	if(parent.confOther.monthSelected > 11){
		parent.confOther.monthSelected = 0;
		parent.confOther.yearSelected++;
	}constructCalendar();
}
function decMonth(){
	parent.confOther.monthSelected--;
	if(parent.confOther.monthSelected < 0){
		parent.confOther.monthSelected = 11;
		parent.confOther.yearSelected--;
	}constructCalendar();
}
function overDate(oTd){
	oTd.style.backgroundColor = confStyle.bgover;
}
function posTop(){
	//alert(parent.confOther.contentDate.offsetHeight + '\n' + confDoc.getElementById('chead').offsetHeight);
	var top = -(parent.confOther.contentDate.offsetHeight) + (confDoc.getElementById('chead').offsetHeight - 4);
	return top;
}
function constructMonth(){
	var sHTML, styleTable;
	popDownYear();
	parent.confOther.monthPosition = true;
	if(!parent.confOther.monthConstructed){
		sHTML =	"";
		for(var i=0; i<12; i++){
			sName =	parent.confDate.monthName[i];
			if(i == parent.confOther.monthSelected){
				sName =	"<strong>"+sName+"</strong>";
			}
			sHTML += "<tr><td id='m"+i+"' onmouseover='parent.overDate(this);' onmouseout='this.style.backgroundColor=\"\"' style='cursor:pointer;background-color:#fff' onclick='parent.confOther.monthConstructed=false;parent.confOther.monthSelected="+i+";parent.constructCalendar();parent.popDownMonth();event.cancelBubble=true;'>&nbsp;"+sName+"&nbsp;</td></tr>";
		}
		styleTable = "font-family:arial;font-size:"+confStyle.size+"px;background-color:#fff;";
		confDoc.getElementById("selectMonth").innerHTML = "<table style='"+(styleTable+=confStyle.border)+"' cellspacing='0' onmouseover='clearTimeout(parent.confOther.timeout1)' onmouseout='clearTimeout(parent.confOther.timeout1);parent.confOther.timeout1=setTimeout(\"parent.popDownMonth()\",100);event.cancelBubble=true;'>"+sHTML+"</table>";
		parent.confOther.monthConstructed = true;
	}
}
function popUpMonth(){
	constructMonth();
	if(parent.confOther.contentMonth.visibility == "hidden"){
		parent.confOther.contentMonth.visibility = "visible";
	}else{
		parent.confOther.contentMonth.visibility = "hidden";
	}
	parent.confOther.contentMonth.left = parent.confOther.contentDate.offsetWidth/2 - 30;
	parent.confOther.contentMonth.top = posTop();
}
function popDownMonth(){
	parent.confOther.contentMonth.visibility = "hidden";
}
function countYear(n){
	var newYear, txtYear;
	for(var i=0; i<7; i++){
		newYear	= (i+parent.confOther.startYear)+n;
		if(newYear == parent.confOther.yearSelected){
			txtYear = "&nbsp;<strong>"+newYear+"</strong>&nbsp;";
		}else{
			txtYear = "&nbsp;"+newYear+"&nbsp;";
		}
		confDoc.getElementById("y"+i).innerHTML = txtYear;
	}
	if(n>0){
		parent.confOther.startYear++;
	}else{
		parent.confOther.startYear--;
	}
}
function incYear(){
	countYear(1);
}
function decYear(){
	countYear(-1);
}
function selectYear(nYear){
	parent.confOther.yearSelected = parseInt(nYear+parent.confOther.startYear);
	parent.confOther.yearConstructed = false;
	constructCalendar();
	popDownYear();
}
function constructYear(){
	var sHTML, styleTable;
	popDownMonth();
	if(!parent.confOther.yearConstructed){
		sHTML =	"<tr><td onmouseover='parent.overDate(this);' onmouseout='clearInterval(parent.confOther.interval1);this.style.backgroundColor=\"\"' style='text-align:center;cursor:pointer' onmousedown='clearInterval(parent.confOther.interval1);parent.confOther.interval1=setInterval(\"parent.decYear()\",30);event.cancelBubble=true;' onmouseup='clearInterval(parent.confOther.interval1);event.cancelBubble=true;'><strong>&#8892;</strong></td></tr>";
		j =	0;
		parent.confOther.startYear = parent.confOther.yearSelected-3;
		for(var i=(parent.confOther.yearSelected-3); i<=(parent.confOther.yearSelected+3); i++){
			sName =	i;
			if(i == parent.confOther.yearSelected){
				sName =	"<strong>"+sName+"</strong>";
			}
			sHTML += "<tr><td id='y"+j+"' onmouseover='parent.overDate(this);' onmouseout='this.style.backgroundColor=\"\"' style='text-align:center;cursor:pointer' onclick='parent.selectYear("+j+");event.cancelBubble=true'>&nbsp;"+sName+"&nbsp;</td></tr>";
			j++;
		}
		styleTable = "font-family:arial;font-size:"+confStyle.size+"px;background-color:#fff;";
		sHTML += "<tr><td onmouseover='parent.overDate(this);' onmouseout='clearInterval(parent.confOther.interval2);this.style.backgroundColor=\"\"' style='text-align:center;cursor:pointer' onmousedown='clearInterval(parent.confOther.interval2);parent.confOther.interval2=setInterval(\"parent.incYear()\",30);event.cancelBubble=true;' onmouseup='clearInterval(parent.confOther.interval2);event.cancelBubble=true;'><strong>&#8891;</strong></td></tr>";
		confDoc.getElementById("selectYear").innerHTML	= "<table style='width:44px;"+(styleTable+=confStyle.border)+"' onmouseover='clearTimeout(parent.confOther.timeout2)' onmouseout='clearTimeout(parent.confOther.timeout2);parent.confOther.timeout2=setTimeout(\"parent.popDownYear()\",100)' cellspacing='0'>"+sHTML+"</table>";
		parent.confOther.yearConstructed = true;
	}
}
function popDownYear(){
	clearInterval(parent.confOther.interval1);
	clearTimeout(parent.confOther.timeout1);
	clearInterval(parent.confOther.interval2);
	clearTimeout(parent.confOther.timeout2);
	parent.confOther.contentYear.visibility = "hidden";
}
function popUpYear(){
	var heightMonth = 0;
	constructYear();
	if(parent.confOther.contentYear.visibility == "hidden"){
		parent.confOther.contentYear.visibility = "visible";
	}else{
		parent.confOther.contentYear.visibility = "hidden";
	}
	parent.confOther.contentYear.left = parent.confOther.contentDate.offsetWidth - 34;
	if(parent.confOther.monthPosition){
		heightMonth = confDoc.getElementById("selectMonth").offsetHeight;
	}
	parent.confOther.contentYear.top = posTop() - heightMonth;
}
function constructCalendar(){
	var aNumDays = [31,0,31,30,31,30,31,31,30,31,30,31],
		startDate =	new	Date(parent.confOther.yearSelected,parent.confOther.monthSelected,1),
		datePointer, endDate, sTitle, aData, sClass;

	if(parent.confOther.monthSelected==1){
		endDate	= new Date(parent.confOther.yearSelected,confOther.monthSelected+1,1);
		endDate	= new Date(endDate - (24*60*60*1000));
		numDaysInMonth = endDate.getDate();
	}else{
		numDaysInMonth = aNumDays[parent.confOther.monthSelected];
	}

	datePointer	= 0;
	dayPointer = startDate.getDay() - conf.start;

	if(dayPointer<0){
		dayPointer = 6;
	}

	sHTML =	"<table	style='font-family:"+confStyle.family+"font-size:"+(confStyle.size-1)+"px;'><tr>";
	for(var i=0; i<7; i++){
		sHTML += "<td style='width:27px;text-align:right'><strong>"+parent.confDate.dayName[i].substr(0,3)+"</strong></td>";
	}
	sHTML +="</tr><tr>";

	for(var i=1; i<=dayPointer; i++){
		sHTML += "<td>&nbsp;</td>";
	}

	for(datePointer=1; datePointer<=numDaysInMonth; datePointer++){
		dayPointer++;
		sHTML += "<td style='text-align:right'>";
		sTitle = "";
		sHref = "javascript:void(0)";
		sStyle = confStyle.anchor;
		sClass = "";

		if(datePointer == parent.confToday.dateNow && parent.confOther.monthSelected == parent.confToday.monthNow && parent.confOther.yearSelected == parent.confToday.yearNow){
			sHTML += "<a class='"+sClass+"' style='"+sStyle+"' href='"+sHref+"'><span style='font-weight:bolder;color:#E2574C'>&nbsp;"+datePointer+"</span>&nbsp;</a>";
		}else if(dayPointer % 7 == (conf.start * -1)+1){
			sHTML += "<a class='"+sClass+"' style='"+sStyle+"' href='"+sHref+"'>&nbsp;<span style='color:#a00;font-weight:bolder'>"+datePointer+"</span>&nbsp;</a>";
		}else{
			sHTML += "<a class='"+sClass+"' style='"+sStyle+"' href='"+sHref+"'>&nbsp;"+datePointer+"&nbsp;</a>";
		}

		sHTML += "";
		if((dayPointer+conf.start) % 7 == conf.start){
			sHTML += "</tr><tr>";
		}
	}

	confDoc.getElementById("content").innerHTML  = sHTML;
	confDoc.getElementById("spanMonth").innerHTML = "&nbsp;"+parent.confDate.monthName[parent.confOther.monthSelected]+"&nbsp;<img id='changeMonth' src='"+confSource.drop+"' style='width:12px;height:10px;border:0;'/>";
	confDoc.getElementById("spanYear").innerHTML =	"&nbsp;"+parent.confOther.yearSelected+"&nbsp;<img id='changeYear' src='"+confSource.drop+"' style='width:12px;height:10px;border:0;'/>";
}
function popUpCalendar(){
	var aData =	confJson.dateText[0].split("/");
	parent.confOther.dateSelected = parseInt(aData[0], 10);
	parent.confOther.monthSelected = parseInt(aData[1]-1, 10);
	parent.confOther.yearSelected = parseInt(aData[2], 10);	

	if(isNaN(confOther.dateSelected)||isNaN(parent.confOther.monthSelected)||isNaN(parent.confOther.yearSelected)){
		parent.confOther.dateSelected = parent.confToday.dateNow;
		parent.confOther.monthSelected = parent.confToday.monthNow;
		parent.confOther.yearSelected = parent.confToday.yearNow;
	}
	constructCalendar();
}
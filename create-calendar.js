/*
 * create-calendar.js v1.2
 * You are free to use the code below and modify it according to your needs.
 * Date: 2021-10-13
 * Modifier: Gabriel Rodríguez || Web Developer
 * Author: José María Acuña Morgado || Web Developer
 */

var confJson = {day:[], month:[], year:[], dateText:[], titleText:[], href:[]},
	confDate = {monthName:[], dayName:[], today:new Date()},
	confToday = {dateNow:confDate.today.getDate(), monthNow:confDate.today.getMonth(), yearNow:confDate.today.getYear()},
	confStyle = {anchor:'text-decoration:none;color:#000;cursor:default;', border:'border:1px solid #6F695A;', family:'verdana,arial;', size:11, bgover:'#d2d2d2'},
	confOther = {content:null, contentMonth:null, contentYear:null, contentDate:null, monthSelected:0, yearSelected:0, dateSelected:0, monthPosition:false, monthConstructed:false, yearConstructed:false, interval1:null, interval2:null, timeout1:null, timeout2:null, startYear:0}

function createCalendar(json) {

    var entries = json.feed.entry;
    var date, year, month, day, entry, published,
        contentDate, pos,
        styleArrow, styleDate, headCalendar, widthCalendar;

    for (var i = 0; i < entries.length; i++) {
        entry = entries[i];
        published = entry.published.$t;
        date = new Date(published).toDateString();
        if (!isNaN(date)) {
            year = date.getFullYear();
            month = (date.getMonth() + 1);
            day = date.getDate();
        } else {
            year = published.split('-')[0];
            month = published.split('-')[1];
            day = (published.split('-')[2]).substring(0, 2);
        }
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        confJson.year[i] = year;
        confJson.month[i] = month;
        confJson.day[i] = day;
        confJson.dateText[i] = day + '/' + month + '/' + year;

        for (var j = 0; j < entry.link.length; j++) {
            if (entry.link[j].rel == 'alternate') {
                confJson.titleText[i] = entry.link[j].title.replace(/"/g, '&quot;');
                confJson.href[i] = entry.link[j].href;
            }
        }
    }
    if (confJson.dateText.length) {
        for (var nMonth = 0; nMonth < 11; nMonth++) {
            pos = conf.months.indexOf('|');
            if (pos > 0)
                confDate.monthName[nMonth] = conf.months.substr(0, pos);

            conf.months = conf.months.substr(pos + 1);
        }
        confDate.monthName[11] = conf.months;

        for (var nDay = 0; nDay < 6; nDay++) {
            pos = conf.days.indexOf("|");
            if (pos > 0) {
                confDate.dayName[nDay] = conf.days.substr(0, pos);
            }
            conf.days = conf.days.substr(pos + 1);
        }
        confDate.dayName[6] = conf.days;
        confToday.yearNow += 1900;
        confOther.monthConstructed = false;
        confOther.yearConstructed = false;

        widthCalendar = 200; //calendar size
        contentDate = "\
		<style>.sStyle{" + confStyle.anchor + "}.styleTable{font-family:arial;font-size:" + confStyle.size + "px;background-color:#fff;" + confStyle.border + "}.styleDate{background-color:#fff;font-family:" + confStyle.family + "font-weight:bold;font-size:" + confStyle.size + "px;color:#313131;border:1px solid #eee;cursor:pointer;}.styleArrow{border:1px solid #eee;cursor:pointer;padding:1;line-height:8px;}.tableCalendar{text-align:center;font-family:" + confStyle.family + "font-size:" + confStyle.size + "px;box-shadow:0 0 10px #333;background-color:#fff}.subTableCalendar{padding:2px;font-family:arial; font-size:" + confStyle.size + "px;text-align:center} </style><div id='contentDate' style='width:" + widthCalendar + "px'><table class='tableCalendar'><tr id='chead' style='background-color:" + conf.bgcolor + ";'><td><table style='width:218px'><tr><td class='subTableCalendar'><span style='color:#fff'><strong><span id='caption'></span></strong></span></td></tr></table></td></tr><tr><td style='padding:5px;background-color:#fff'><span id='content'></span></td></tr>\
		<tr style='background-color:" + confStyle.bgover + "'><td style='padding:5px' align='center'><span id='lblToday'></span></td></tr>\
		</table></div><div id='selectMonth' style='position:relative;max-width:" + widthCalendar + "px;visibility:hidden;'></div><div id='selectYear' style='position:relative;top:0;max-width:" + widthCalendar + "px;visibility:hidden;'></div>";

        document.getElementById("calendar").innerHTML = contentDate;
        document.getElementById("lblToday").innerHTML = "<a title='" + conf.date + "' data-toggle='tooltip' style='" + confStyle.anchor + ";cursor:pointer;' href='#' onclick='confOther.monthSelected=confToday.monthNow;confOther.yearSelected=confToday.yearNow;constructCalendar();return false;'>" + confDate.dayName[(confDate.today.getDay() - conf.start == -1) ? 6 : (confDate.today.getDay() - conf.start)] + ", " + confToday.dateNow + " " + confDate.monthName[confToday.monthNow] + " " + confToday.yearNow + "</a>";

        confOther.content = document.getElementById("contentDate").style;
        confOther.contentMonth = document.getElementById("selectMonth").style;
        confOther.contentYear = document.getElementById("selectYear").style;
        confOther.contentDate = document.getElementById("contentDate");

        headCalendar = "<table width='100%' cellpadding='1' cellspacing='2'><tr><td style='width:5px'><div id='spanLeft' class='styleArrow' onclick='decMonth()' onmousedown='clearTimeout(confOther.timeout1);confOther.timeout1=setTimeout(\"StartDecMonth()\",500)' onmouseup='clearTimeout(confOther.timeout1);clearInterval(confOther.interval1)'></div></td>";
        headCalendar += "<td style='width:5px'><div id='spanRight' class='styleArrow' onclick='incMonth()' onmousedown='clearTimeout(confOther.timeout1);confOther.timeout1=setTimeout(\"StartIncMonth()\",500)' onmouseup='clearTimeout(confOther.timeout1);clearInterval(confOther.interval1)'></div></td>";
        headCalendar += "<td style='text-align:right'><span id='spanMonth' class='styleDate'></span></td>";
        headCalendar += "<td style='text-align:right'><span id='spanYear' class='styleDate'></span></td></tr></table>";

        document.getElementById("caption").innerHTML = headCalendar;
        popUpCalendar();
    }
}

function StartDecMonth() {
    confOther.interval1 = setInterval("decMonth()", 80);
}

function StartIncMonth() {
    confOther.interval1 = setInterval("incMonth()", 80);
}

function incMonth() {
    confOther.monthSelected++;
    if (confOther.monthSelected > 11) {
        confOther.monthSelected = 0;
        confOther.yearSelected++;
    }
    constructCalendar();
}

function decMonth() {
    confOther.monthSelected--;
    if (confOther.monthSelected < 0) {
        confOther.monthSelected = 11;
        confOther.yearSelected--;
    }
    constructCalendar();
}

function overDate(oTd) {
    oTd.style.backgroundColor = confStyle.bgover;
}

function posTop() {
    //alert(confOther.contentDate.offsetHeight + '\n' + document.getElementById('chead').offsetHeight);
    var top = -(confOther.contentDate.offsetHeight) + (document.getElementById('chead').offsetHeight - 4);
    return top;
}

function constructMonth() {
    var sHTML, styleTable;
    popDownYear();
    confOther.monthPosition = true;
    if (!confOther.monthConstructed) {
        sHTML = "";
        for (var i = 0; i < 12; i++) {
            sName = confDate.monthName[i];
            if (i == confOther.monthSelected) {
                sName = "<strong>" + sName + "</strong>";
            }
            sHTML += "<tr><td id='m" + i + "' onmouseover='overDate(this);' onmouseout='this.style.backgroundColor=\"\"' style='cursor:pointer;background-color:#fff' onclick='confOther.monthConstructed=false;confOther.monthSelected=" + i + ";constructCalendar();popDownMonth();event.cancelBubble=true;'>&nbsp;" + sName + "&nbsp;</td></tr>";
        }
        document.getElementById("selectMonth").innerHTML = "<table class='styleTable' cellspacing='0' onmouseover='clearTimeout(confOther.timeout1)' onmouseout='clearTimeout(confOther.timeout1);confOther.timeout1=setTimeout(\"popDownMonth()\",100);event.cancelBubble=true;'>" + sHTML + "</table>";
        confOther.monthConstructed = true;
    }
}

function countYear(n) {
    var newYear, txtYear;
    for (var i = 0; i < 7; i++) {
        newYear = (i + confOther.startYear) + n;
        if (newYear == confOther.yearSelected) {
            txtYear = "&nbsp;<strong>" + newYear + "</strong>&nbsp;";
        } else {
            txtYear = "&nbsp;" + newYear + "&nbsp;";
        }
        document.getElementById("y" + i).innerHTML = txtYear;
    }
    if (n > 0) {
        confOther.startYear++;
    } else {
        confOther.startYear--;
    }
}

function incYear() {
    countYear(1);
}

function decYear() {
    countYear(-1);
}

function selectYear(nYear) {
    confOther.yearSelected = parseInt(nYear + confOther.startYear);
    confOther.yearConstructed = false;
    constructCalendar();
    popDownYear();
}

function constructYear() {
    var sHTML, styleTable;
    popDownMonth();
    if (!confOther.yearConstructed) {
        sHTML = "<tr><td onmouseover='overDate(this);' onmouseout='clearInterval(confOther.interval1);this.style.backgroundColor=\"\"' style='text-align:center;cursor:pointer' onmousedown='clearInterval(confOther.interval1);confOther.interval1=setInterval(\"decYear()\",30);event.cancelBubble=true;' onmouseup='clearInterval(confOther.interval1);event.cancelBubble=true;'><strong>&#8892;</strong></td></tr>";
        j = 0;
        confOther.startYear = confOther.yearSelected - 3;
        for (var i = (confOther.yearSelected - 3); i <= (confOther.yearSelected + 3); i++) {
            sName = i;
            if (i == confOther.yearSelected) {
                sName = "<strong>" + sName + "</strong>";
            }
            sHTML += "<tr><td id='y" + j + "' onmouseover='overDate(this);' onmouseout='this.style.backgroundColor=\"\"' style='text-align:center;cursor:pointer' onclick='selectYear(" + j + ");event.cancelBubble=true'>&nbsp;" + sName + "&nbsp;</td></tr>";
            j++;
        }
        sHTML += "<tr><td onmouseover='overDate(this);' onmouseout='clearInterval(confOther.interval2);this.style.backgroundColor=\"\"' style='text-align:center;cursor:pointer' onmousedown='clearInterval(confOther.interval2);confOther.interval2=setInterval(\"incYear()\",30);event.cancelBubble=true;' onmouseup='clearInterval(confOther.interval2);event.cancelBubble=true;'><strong>&#8891;</strong></td></tr>";
        document.getElementById("selectYear").innerHTML = "<table class='styleTable' style='width:44px;' onmouseover='clearTimeout(confOther.timeout2)' onmouseout='clearTimeout(confOther.timeout2);confOther.timeout2=setTimeout(\"popDownYear()\",100)' cellspacing='0'>" + sHTML + "</table>";
        confOther.yearConstructed = true;
    }
}

function constructCalendar() {
    var aNumDays = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        startDate = new Date(confOther.yearSelected, confOther.monthSelected, 1),
        datePointer, endDate, sTitle, sHref, aData, sTarget;

    if (confOther.monthSelected == 1) {
        endDate = new Date(confOther.yearSelected, confOther.monthSelected + 1, 1);
        endDate = new Date(endDate - (24 * 60 * 60 * 1000));
        numDaysInMonth = endDate.getDate();
    } else {
        numDaysInMonth = aNumDays[confOther.monthSelected];
    }

    datePointer = 0;
    dayPointer = startDate.getDay() - conf.start;

    if (dayPointer < 0) {
        dayPointer = 6;
    }

    sHTML = "<table	style='font-family:" + confStyle.family + "font-size:" + (confStyle.size - 1) + "px;'><tr>";
    for (var i = 0; i < 7; i++) {
        sHTML += "<td style='width:27px;text-align:right'><strong>" + confDate.dayName[i].substr(0, 3) + "</strong></td>";
    }
    sHTML += "</tr><tr>";

    for (var i = 1; i <= dayPointer; i++) {
        sHTML += "<td>&nbsp;</td>";
    }

    sTarget = (conf.newtab) ? "_blank" : "_parent";

    for (datePointer = 1; datePointer <= numDaysInMonth; datePointer++) {
        dayPointer++;
        sHTML += "<td style='text-align:right'>";
        sTitle = "";
        sHref = "javascript:;";
        sStyle = "";
        var sTwoOrMore = 0;

        for (var i = 0; i < confJson.dateText.length; i++) {
            if (datePointer == confJson.day[i] && (confOther.monthSelected + 1) == confJson.month[i] && confOther.yearSelected == confJson.year[i]) {
                sHref = confJson.href[i];
                if (sStyle.indexOf("border-radius:100%;border:2px solid " + conf.bgcolor + ";cursor:pointer;") == -1) {
                    sStyle += "border-radius:100%;border:2px solid " + conf.bgcolor + ";cursor:pointer;";
                }
                //sTitle = confJson.titleText[i];
                sTitle += '&#10004; ' + confJson.titleText[i] + '\n';
				if (conf.tooltip) {
					sTitle +='<br>';
				}
                //break;
            }
        }
        if (datePointer == confToday.dateNow && confOther.monthSelected == confToday.monthNow && confOther.yearSelected == confToday.yearNow) {
            sHTML += "<a " + (sTitle != "" ? "data-calendar-toggle='tooltip' data-bs-html='true' title='" + sTitle + "'" : "") + " class='sStyle' " + (sStyle != "" ? "style='" + sStyle + "'" : "") + " href='" + sHref + "' target='" + sTarget + "'><span style='font-weight:bolder;color:#E2574C'>&nbsp;" + datePointer + "</span>&nbsp;</a>";
        } else if (dayPointer % 7 == (conf.start * -1) + 1) {
            sHTML += "<a " + (sTitle != "" ? "data-calendar-toggle='tooltip' data-bs-html='true' title='" + sTitle + "'" : "") + " class='sStyle' " + (sStyle != "" ? "style='" + sStyle + "'" : "") + " href='" + sHref + "' target='" + sTarget + "'>&nbsp;<span style='color:#a00;font-weight:bolder'>" + datePointer + "</span>&nbsp;</a>";
        } else {
            sHTML += "<a " + (sTitle != "" ? "data-calendar-toggle='tooltip' data-bs-html='true' title='" + sTitle + "'" : "") + " class='sStyle' " + (sStyle != "" ? "style='" + sStyle + "'" : "") + " href='" + sHref + "' target='" + sTarget + "'>&nbsp;" + datePointer + "&nbsp;</a>";
        }
        sHTML += "";
        if ((dayPointer + conf.start) % 7 == conf.start) {
            sHTML += "</tr><tr>";
        }
    }

    document.getElementById("content").innerHTML = sHTML;
    document.getElementById("spanMonth").innerHTML = "&nbsp;" + confDate.monthName[confOther.monthSelected] + "&nbsp;";
    document.getElementById("spanYear").innerHTML = "&nbsp;" + confOther.yearSelected + "&nbsp;";

    if (conf.tooltip) {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll("[data-calendar-toggle='tooltip']"))
        var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    }
}

function popUpCalendar() {
    var aData = confJson.dateText[0].split("/");
    confOther.dateSelected = parseInt(aData[0], 10);
    confOther.monthSelected = parseInt(aData[1] - 1, 10);
    confOther.yearSelected = parseInt(aData[2], 10);

    if (isNaN(confOther.dateSelected) || isNaN(confOther.monthSelected) || isNaN(confOther.yearSelected)) {
        confOther.dateSelected = confToday.dateNow;
        confOther.monthSelected = confToday.monthNow;
        confOther.yearSelected = confToday.yearNow;
    }
    constructCalendar();
}

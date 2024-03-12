$(document).ready(function() {
    const URL = "https://script.google.com/macros/s/AKfycbwBbQHotFk1fOJz39ePPYFt4pQAQOkdxSSQhEvtL19L2lGSREvX4iHcRNJkcUcjMD3tyA/exec";
    var DATA = []; // will be filled from spreadsheet

    var LANS = ["Qi", "En", "Ru", "Ge"];
    const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const WEEK_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    var CURRENT_LANGUAGE = "En";
    var CURRENT_MONTH_TRANSLATION = "january";

    var CURRENT_MONTH = [];


    var SLIDE_INDEX = 0;
    var SLIDES = $(".slide");
    var TOTAL_SLIDES = SLIDES.length;

    var DAY_INDEX = 1;
    var DAYS = $(".ver-slide");
    var TOTAL_DAYS = DAYS.length;

    var centerX = 100;
    var centerY = 100;
    var radius = 50;
    var startAngle = Math.PI;
    var endAngleMoon = Math.PI / 2;
    var endAngleSun = 2 * Math.PI;

    var currentAngle = startAngle;
    var moon_increment_x = 2.2;
    var moon_increment_y = 0.6;

    var sun_increment_x = 1.1;
    var sun_increment_y = 0.7;

    var Settings = {
        lan: 0,
        dark: 1,
        notify: 1,
        sound: 0,
        notifyBefore: 0
    }

    const minimalSwipeDistance = 50;

    var PrayerTimer = 5;


    SLIDES[SLIDE_INDEX].classList.add("active-slide");

    DAYS[DAY_INDEX].classList.add("active-day");

    // slide days
    function showNextDay() {
        if(DAY_INDEX >= 2) {
            return;
        }
        DAYS[DAY_INDEX].classList.remove("active-day");
        $(".day-indicator")[DAY_INDEX].classList.remove("day-active");
        if(DAY_INDEX == 2) {
            $(".day-next")[0].dissabled = true;
        }
        else {
            DAY_INDEX = DAY_INDEX + 1;
        }
        DAYS[DAY_INDEX].classList.add("active-day");
        $(".day-indicator")[DAY_INDEX].classList.add("day-active");
    }


    function showPreviousDay() {
        if(DAY_INDEX <= 0) {
            return;
        }
        DAYS[DAY_INDEX].classList.remove("active-day");
        $(".day-indicator")[DAY_INDEX].classList.remove("day-active");
        
        if(DAY_INDEX == 0) {
            $(".day-prev")[0].dissabled = true;
        } 
        else {
            DAY_INDEX = DAY_INDEX - 1;
        }
        DAYS[DAY_INDEX].classList.add("active-day");
        $(".day-indicator")[DAY_INDEX].classList.add("day-active");
    }



    function showNextSlide() {
        $(".close").click();
        SLIDES[SLIDE_INDEX].classList.remove("active-slide");
        $(".indicator")[SLIDE_INDEX].classList.remove("active");
        SLIDE_INDEX = (SLIDE_INDEX + 1) % TOTAL_SLIDES;
        SLIDES[SLIDE_INDEX].classList.add("active-slide");
        $(".indicator")[SLIDE_INDEX].classList.add("active");
    }

    function showPreviousSlide() {
        $(".close").click();
        SLIDES[SLIDE_INDEX].classList.remove("active-slide");
        $(".indicator")[SLIDE_INDEX].classList.remove("active");
        SLIDE_INDEX = (SLIDE_INDEX - 1 + TOTAL_SLIDES) % TOTAL_SLIDES;
        SLIDES[SLIDE_INDEX].classList.add("active-slide");
        $(".indicator")[SLIDE_INDEX].classList.add("active");
    }

    

    $('.day-prev').click(function() {
        showPreviousDay();
    });

    $('.day-next').click(function() {
        showNextDay();
    });

    
    $('.next').click(function() {
        showPreviousSlide();
    });

    $('.prev').click(function() {
        showNextSlide();
    });

    // Swipe gesture handling
    var touchstartX = 0;
    var touchendX = 0;

    // Swipe gesture handling top-bottom
    var touchstartY = 0;
    var touchendY = 0;

    document.querySelector('.slider-container').addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    }, false);

    document.querySelector('.slider-container').addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleGesture();
    }, false);

    function handleGesture() {
        var distanceX = touchendX - touchstartX;
        var distanceY = touchendY - touchstartY;
        if(Math.abs(distanceY) > minimalSwipeDistance) {
            if (touchendY < touchstartY) {
                // Swiped top
                showNextDay();
            } 
            else {
                // Swiped bottom
                showPreviousDay();
            }
        }
        if (Math.abs(distanceX) > minimalSwipeDistance) {
            if (touchendX < touchstartX) {
                // Swiped left
                showNextSlide();
            } 
            else {
                // Swiped right
                showPreviousSlide();
            }
        }
    }

    function changeLanguage(n) {
        try {
            let lan = LANS[n];
            CURRENT_LANGUAGE = lan;
            for(let i = 0; i < translations.length; i++) {
                let key = Object.keys(translations[i])[0];
                console.log(key);
                let elems = $(`.${key}`);
                for(let j = 0; j < elems.length; j++) {
                    elems[j].innerHTML = translations[i][key][lan];
                }
            }
            if($(".current-month")[0] != undefined) {
                $("#month")[0].children[0].innerText = $(".current-month")[0].innerText;
            }
        }
        catch(ex) {
            console.log(ex);
        }
        
    }

    $("#lan").change(function() {
        let lan = parseInt($("#lan").val());
        changeLanguage(lan);
    })

    var TODAY_MAGR_MINUTES = 0;
    function calculateMoonCicle() {
        let today_magr = $(".time")[3].innerText;
        var current_date = new Date();
        var month_index = current_date.getMonth();
        CURRENT_MONTH = prayerTimes[month_index];
        var tomorrow = current_date.getDate();
        var today_times = CURRENT_MONTH[tomorrow];
        let tomorrow_fajr = today_times[0];
        let today_minutes = ((24 - parseInt(today_magr.split(':')[0])) * 60) + parseInt(today_magr.split(':')[1]);
        TODAY_MAGR_MINUTES = today_minutes;
        let tomorrow_minutes =  (parseInt(tomorrow_fajr.split(':')[0]) * 60) + parseInt(tomorrow_fajr.split(':')[1]);
        let minutes = today_minutes + tomorrow_minutes;
        return minutes;
    }

    var TODAY_FAJR_MINUTES = 0;

    function calculateSunCicle() {
        let today_fajr = $(".time")[0].innerText;
        var current_date = new Date();
        var month_index = current_date.getMonth();
        CURRENT_MONTH = prayerTimes[month_index];
        var today_magr = $(".time")[3].innerText;
        let magr_minutes = ((24 - parseInt(today_magr.split(':')[0])) * 60) + parseInt(today_magr.split(':')[1]);

        let fajr_minutes =  (parseInt(today_fajr.split(':')[0]) * 60) + parseInt(today_fajr.split(':')[1]);
        TODAY_FAJR_MINUTES = fajr_minutes;
        let minutes = magr_minutes - fajr_minutes;
        return minutes;
    }

    function checkIfDay() {
        var currentTime = new Date();


        var today_magr = $(".time")[3].innerText;
        let hr = parseInt(today_magr.split(':')[0]);
        let mt = parseInt(today_magr.split(':')[1]);

        let today_fajr = $(".time")[0].innerText;
        let hr1 = parseInt(today_fajr.split(':')[0]);
        let mt1 = parseInt(today_fajr.split(':')[1]);

        var compareTime = new Date();
        compareTime.setHours(hr);
        compareTime.setMinutes(mt);
        compareTime.setSeconds(0);

        var compareTime2 = new Date();
        compareTime2.setHours(hr1);
        compareTime2.setMinutes(mt1);
        compareTime2.setSeconds(0);

        // Compare the times
        if (currentTime.getTime() > compareTime2.getTime() && currentTime.getTime() < compareTime.getTime()) {

            return true;
        }
        else {

            return false;
        }
    }

    function calculateCurrentPosition() {
        let isDay = checkIfDay();
        if(isDay) {
            let sunCicleMinutes = calculateSunCicle();
            let frameTime = parseInt(sunCicleMinutes / 315);
            let currentProgress = CURRENT_MINUTES - TODAY_FAJR_MINUTES;
            let progress = currentProgress / frameTime;
            return progress;
            // day
            // sun frames: 315
        }
        else {
            let moonCircleMinutes = calculateMoonCicle();
            let frameTime = parseInt(moonCircleMinutes / 158);
            let currentProgress = CURRENT_MINUTES - TODAY_MAGR_MINUTES;
            let progress = currentProgress / frameTime;
            return progress;
            // night
            // moon frames: 158
        }

    }

    function displaySunOrMoon() {
        currentAngle = startAngle;
        let isDay = checkIfDay();
        let progress = calculateCurrentPosition();
        if(isDay) {
            // sun

            currentAngle += (progress * 0.01);
            var coordinates = calculateCoordinates(centerX, centerY, radius, currentAngle);

            let x = coordinates.x;
            let y = coordinates.y; // 100 - 50 - 100
            let y1 = Math.abs((y - 50)) * sun_increment_y;
            let x1 = Math.abs((x - 50)) * sun_increment_x - 20;
            sunFrame(x1, y1);
            $("#moon").addClass("hidden");
            $("#sun").removeClass("hidden");
            $(".night").addClass("hidden");
        }
        else {
            // moon
            currentAngle += (progress * 0.01);
            var coordinates = calculateCoordinates(centerX, centerY, radius, currentAngle);

            let x = coordinates.x;
            let y = coordinates.y;
            let y1 = Math.abs((150 - y)) * moon_increment_y;
            let x1 = Math.abs((x - 50)) * moon_increment_x - 10;
            moonFrame(x1, y1);
            $(".night").removeClass("hidden");
            $("#sun").addClass("hidden");
            $("#moon").removeClass("hidden");
        }
    }


    $(".slider-container").click(function() {
        if(!$("#settings").hasClass("hidden")) {
            $("#settings").addClass("hidden");
        }
        if(!$("#aboutUs").hasClass("hidden")) {
            $("#aboutUs").addClass("hidden");
        }
        if(!$("#contactUs").hasClass("hidden")) {
            $("#contactUs").addClass("hidden");
        }
        if(!$("#feedback").hasClass("hidden")) {
            $("#feedback").addClass("hidden");
        }
    })

    $(".close").click(function() {
        if(!$("#settings").hasClass("hidden")) {
            $("#settings").addClass("hidden");
        }
        if(!$("#aboutUs").hasClass("hidden")) {
            $("#aboutUs").addClass("hidden");
        }
        if(!$("#contactUs").hasClass("hidden")) {
            $("#contactUs").addClass("hidden");
        }
        if(!$("#feedback").hasClass("hidden")) {
            $("#feedback").addClass("hidden");
        }
    })

    function calculateCoordinates(centerX, centerY, radius, angle) {
        var x = centerX + radius * Math.cos(angle);
        var y = centerY + radius * Math.sin(angle);
        return { x: x, y: y };
    }

    function moonFrame(x, y) {
        let moon = $("#moon")[0];
        moon.style.top = y + "%";
        moon.style.left = x + "%";
        if(x > 85) {
            $("#moon").addClass("hidden");
        }
        else {
            if($("#moon").hasClass("hidden")) {
                $("#moon").removeClass("hidden");
            }
        }
    }

    function sunFrame(x, y) {
        let sun = $("#sun")[0];
        if(x > 76) {
            $("#sun").addClass("hidden");
        }
        else {
            if($("#sun").hasClass("hidden")) {
                $("#sun").removeClass("hidden");
            }
        }
        sun.style.top = y + "%";
        sun.style.left = x + "%";
    }

    var isSun = true;

    var test = 0;
    function animateSun() {
        if(!isSun) {
            return;
        }
        var coordinates = calculateCoordinates(centerX, centerY, radius, currentAngle);
        currentAngle += 0.01;
        let x = coordinates.x;
        let y = coordinates.y; // 100 - 50 - 100
        let y1 = Math.abs((y - 50)) * sun_increment_y;
        let x1 = Math.abs((x - 50)) * sun_increment_x - 20;
        sunFrame(x1, y1);
        test++;
        if (currentAngle <= endAngleSun) {
            setTimeout(animateSun, 500);
        }
        else {

            currentAngle = startAngle;
            
            animateSun();
        }
    }

    // animateSun();

    $("#darkTheme").change(function() {
        currentAngle = startAngle;
        changeTheme($("#darkTheme")[0].checked);
    })

    var test2 = 0;
    function animateMoon() {
        if(isSun) {
            return;
        }
        var coordinates = calculateCoordinates(centerX, centerY, radius, currentAngle);
        currentAngle -= 0.01;
        let x = coordinates.x;
        let y = coordinates.y;
        let y1 = Math.abs((150 - y)) * moon_increment_y;
        let x1 = Math.abs((x - 50)) * moon_increment_x - 10;
        moonFrame(x1, y1);
        test2++;
        if (currentAngle >= endAngleMoon) {
            setTimeout(animateMoon, 500);
        }
        else {
            currentAngle = startAngle;
            animateMoon();
        }
    }

    $("#settings_btn").click(function(e) {
        e.stopPropagation();
        $("#settings").toggleClass("hidden");
    })

    $("#aboutus_btn").click(function(e) {
        e.stopPropagation();
        $("#aboutUs").toggleClass("hidden");
    })

    $("#contact_btn").click(function(e) {
        e.stopPropagation();
        $("#contactUs").toggleClass("hidden");
    })

    $("#feedback_btn").click(function(e) {
        e.stopPropagation();
        $("#feedback").toggleClass("hidden");
    })

    function getDateName(day_index, month_index, current_day, index) {
        day_index = day_index + index;
        current_day = current_day + index;
        let day_key = WEEK_DAYS[day_index];
        let month_key = MONTHS[month_index];

        let day_translation = translations.find(obj => obj.hasOwnProperty(day_key))[day_key][CURRENT_LANGUAGE];
        
        let month_translation = translations.find(obj => obj.hasOwnProperty(month_key))[month_key][CURRENT_LANGUAGE];

        // CURRENT_MONTH_TRANSLATION = month_key;

        let p = document.createElement("P");
        p.innerText = day_translation;
        p.classList.add(day_key);

        let div = document.createElement("DIV");

        let p1 = document.createElement("P");
        p1.innerText = current_day + 1;


        let p2 = document.createElement("P");
        p2.innerText = month_translation;
        p2.style.marginRight = "10px";
        p2.classList.add(month_key);

        div.append(p2);
        div.append(p1);

        $(".date")[index].append(p);
        $(".date")[index].append(div);
    }

    function printDayDates(day_index, month_index, current_day) {
        for(let i = 0; i < 3; i++) {
            getDateName(day_index, month_index, current_day, i);
        }
    }

    function currentDate(lan) {
        var current_date = new Date();
        var month_index = current_date.getMonth();
        CURRENT_MONTH = prayerTimes[month_index];
        var today = (current_date.getDate() - 1);
        var today_times = CURRENT_MONTH[current_day];
        var times = $(".time");
        let day_index = current_date.getDay();
        printDayDates(day_index - 2, month_index, today - 1);
        
        
        for(let j = 0; j < 3; j++) {
            var current_day = (current_date.getDate() - 2) + j;
            var today_times = CURRENT_MONTH[current_day];
            if(j == 1) {
                findNextPrayer(today_times);
            }
            for(let i = 0; i < 5; i++) {
                times[j * 5 + i].innerText = today_times[i];
            }
        }
        
        if($(".current-month")[0] != undefined) {
            $(".current-month").removeClass("current-month");
        }
        $(".month")[month_index].classList.add("current-month");
        $(".month")[month_index].click();
    }



    function findNextPrayer(today_times) {
        var dt = new Date();
        let hour = dt.getHours();
        let minutes = dt.getMinutes();
        let number = (parseInt(hour) * 60) + (parseInt(minutes));
        let index = -1;
        for(let i = 0; i < 5; i++) {
            let hr = today_times[i].split(":")[0];
            let mt = today_times[i].split(":")[1];
            let nr = (parseInt(hr) * 60) + (parseInt(mt));
            if(nr > number) {

                index = i;
                break;
            }
        }
        if(index != -1) {
            countdown(index, today_times, number);
            $("#note").addClass("hidden");
        }
        else {
            $("#note").removeClass("hidden");
        }
    }

    function changeTheme(isDark) {
        if(isDark) {
            isSun = false;
            $(".prayer").addClass("dark-theme");
            $(".month").addClass("dark-theme");
            $(".content").addClass("dark-theme");
            $(".option").addClass("dark-theme");

            $(".night").removeClass("hidden");
            $("#sun").addClass("hidden");
            $("#moon").removeClass("hidden");
            // animateMoon();
        }
        else {
            isSun = true;
            $(".dark-theme").removeClass("dark-theme");

            $("#moon").addClass("hidden");
            $("#sun").removeClass("hidden");
            $(".night").addClass("hidden");
            // animateSun();
        }
    }

    var CURRENT_MINUTES = 0;

    function countdown(index, today_times) {
        var x = setInterval(function() {
            var dt = new Date();
            let hour = dt.getHours();
            let minutes = dt.getMinutes();
            let number = (parseInt(hour) * 60) + (parseInt(minutes));
            CURRENT_MINUTES = number;
            let target_div = $(".empty")[index + 5];
            target_div.innerHTML = "";
            target_div.classList.add("target-div");
            let p = document.createElement("p");
            p.innerText = $("#remaining")[0].innerText;
            $(".target-div").append(p);
            let div = document.createElement("DIV");
            let hr = parseInt(today_times[index].split(":")[0]);
            let mt = parseInt(today_times[index].split(":")[1]);
            let nr = (parseInt(hr) * 60) + (parseInt(mt));
            let difference = nr - number;
            let seconds = dt.getSeconds();
            div.innerText = parseInt(difference / 60) + ":" + (difference % 60) + ":" + (60 - seconds);
            if($(".next-prayer")[0] != undefined) {
                $(".next-prayer").removeClass("next-prayer");
            }
            $(".prayer")[index + 5].classList.add("next-prayer");
            $(".target-div").append(div);
            if(nr <= number && ((number - nr) <= PrayerTimer)) {
                // 5 minutes
                $(".prayer")[index + 5].classList.add("prayer-time");
            }
            else if(nr < number) {
                $(".prayer")[index + 5].classList.remove("prayer-time");
                clearInterval(x);
                findNextPrayer(today_times);
            }
        }, 1000);
    }




// settings

    


    $("#lan").change(function() {
        changeSettings();
    });

    $("#darkTheme").change(function() {
        changeSettings();
    });

    $("#prayerOn").change(function() {
        changeSettings();
    });

    $("#SoundOn").change(function() {
        changeSettings();
    });

    $("#beforePrayerOn").change(function() {
        changeSettings();
    });

    
    

    function changeSettings() {
        var settings = {
            lan: $("#lan")[0].value,
            dark_theme: $("#darkTheme")[0].checked,
            notify: $("#prayerOn")[0].checked,
            sound: $("#SoundOn")[0].checked,
            notifyBefore: $("#beforePrayerOn")[0].checked
        }
        saveSettings(settings);
    }

    // Function to retrieve settings from localStorage
    function getSettings() {
        var settingsJSON = localStorage.getItem('settings');
        return settingsJSON ? JSON.parse(settingsJSON) : null;
    }

    // Function to save settings to localStorage
    function saveSettings(updatedSettings) {
        localStorage.setItem('settings', JSON.stringify(updatedSettings));
    }

    var LAN_SHORT_NAMES = ["RU", "EN", "RU", "GE"];

    function applySettings() {
        var savedSettings = getSettings();
        if(savedSettings != null) {
            changeTheme(savedSettings.dark_theme);
            changeLanguage(savedSettings.lan);
            $("#lan")[0].value = savedSettings.lan;
            $("#darkTheme")[0].checked = savedSettings.dark_theme;
            currentDate(LAN_SHORT_NAMES[savedSettings.lan]);
        }
        else {
            changeLanguage(1);
            currentDate("EN");
        }
    }

    $(".month").click(function() {
        if(SLIDE_INDEX != 0) {
            showPreviousSlide();
        }
        $(".header")[0].innerText = $(this)[0].innerText;

        let index = $(this).index();

        // check current date and if selected month is current month, define the current day
        let current_date = new Date();
        let month_index = current_date.getMonth();
        let day = -1; // if its not -1 it means we are in current month

        if(month_index == index) {
            day = current_date.getDate() - 1;
        }

        let month_data = prayerTimes[index];
        let table = $("#monthData");
        table.html("");

        for(let i = 0; i < month_data.length; i++) {
            let tr = document.createElement("TR");
            if(i == day) {
                tr.classList.add("current-day");
            }
            let td = document.createElement("TD");
            td.innerText = i + 1;
            td.classList.add("day-index");
            tr.append(td);
            for(let j = 0; j < 5; j++) {
                let timesTd = document.createElement("TD");
                timesTd.innerText = month_data[i][j];
                tr.append(timesTd);
            }
            table.append(tr);
        }
    })

    const prayerTimes = [
        [
            ["06:47", "13:15", "15:20", "17:47", "19:11"],
            ["06:47", "13:15", "15:20", "17:48", "19:11"],
            ["06:47", "13:15", "15:20", "17:48", "19:11"],
            ["06:47", "13:15", "15:21", "17:49", "19:13"],
            ["06:46", "13:15", "15:21", "17:51", "19:14"],
            ["06:46", "13:15", "15:22", "17:52", "19:16"],
            ["06:45", "13:15", "15:22", "17:54", "19:17"],
            ["06:45", "13:15", "15:23", "17:55", "19:19"],
            ["06:44", "13:15", "15:24", "17:57", "19:20"],
            ["06:44", "13:15", "15:25", "17:58", "19:21"],
            ["06:44", "13:15", "15:26", "17:59", "19:22"],
            ["06:43", "13:15", "15:27", "18:00", "19:24"],
            ["06:43", "13:15", "15:28", "18:02", "19:25"],
            ["06:42", "13:15", "15:29", "18:03", "19:26"],
            ["06:41", "13:15", "15:29", "18:04", "19:27"],
            ["06:40", "13:15", "15:30", "18:05", "19:28"],
            ["06:39", "13:15", "15:31", "18:06", "19:29"],
            ["06:38", "13:15", "15:32", "18:07", "19:30"],
            ["06:37", "13:15", "15:33", "18:08", "19:31"],
            ["06:36", "13:15", "15:34", "18:08", "19:31"],
            ["06:36", "13:15", "15:35", "18:08", "19:31"],
            ["06:36", "13:15", "15:36", "18:09", "19:32"],
            ["06:35", "13:15", "15:37", "18:11", "19:33"],
            ["06:35", "13:15", "15:38", "18:13", "19:36"],
            ["06:34", "13:15", "15:39", "18:15", "19:38"],
            ["06:34", "13:15", "15:40", "18:17", "19:40"],
            ["06:34", "13:15", "15:41", "18:19", "19:42"],
            ["06:34", "13:15", "15:42", "18:21", "19:44"],
            ["06:33", "13:15", "15:43", "18:23", "19:46"],
            ["06:33", "13:15", "15:45", "18:24", "19:47"],
            ["06:32", "13:15", "15:45", "18:25", "19:48"]
        ],
        [
            ["06:32", "13:15", "15:46", "18:25", "19:49"],
            ["06:32", "13:15", "15:47", "18:25", "19:50"],
            ["06:32", "13:15", "15:49", "18:26", "19:51"],
            ["06:31", "13:15", "15:50", "18:27", "19:51"],
            ["06:31", "13:15", "15:52", "18:28", "19:51"],
            ["06:31", "13:15", "15:53", "18:29", "19:53"],
            ["06:30", "13:15", "15:55", "18:31", "19:55"],
            ["06:29", "13:15", "15:57", "18:31", "19:56"],
            ["06:28", "13:15", "15:58", "18:32", "19:57"],
            ["06:27", "13:15", "16:00", "18:33", "19:58"],
            ["06:26", "13:15", "16:01", "18:34", "19:59"],
            ["06:25", "13:15", "16:02", "18:35", "20:00"],
            ["06:24", "13:15", "16:03", "18:36", "20:01"],
            ["06:22", "13:15", "16:04", "18:37", "20:02"],
            ["06:21", "13:15", "16:05", "18:38", "20:03"],
            ["06:20", "13:15", "16:06", "18:39", "20:04"],
            ["06:19", "13:15", "16:06", "18:40", "20:05"],
            ["06:17", "13:15", "16:06", "18:41", "20:06"],
            ["06:16", "13:15", "16:06", "18:42", "20:07"],
            ["06:15", "13:15", "16:07", "18:43", "20:08"],
            ["06:13", "13:15", "16:08", "18:44", "20:09"],
            ["06:12", "13:15", "16:08", "18:45", "20:10"],
            ["06:10", "13:15", "16:09", "18:47", "20:12"],
            ["06:09", "13:15", "16:11", "18:49", "20:14"],
            ["06:07", "13:15", "16:11", "18:51", "20:16"],
            ["06:06", "13:15", "16:12", "18:53", "20:18"],
            ["06:04", "13:15", "16:13", "18:54", "20:20"],
            ["06:03", "13:15", "16:13", "18:56", "20:22"],
            ["06:02", "13:15", "16:14", "18:57", "20:23"]
        ],
        [
            ["06:01", "13:15", "16:14", "18:59", "20:24"],
            ["06:00", "13:15", "16:15", "19:00", "20:25"],
            ["05:58", "13:15", "16:15", "19:01", "20:26"],
            ["05:56", "13:15", "16:16", "19:02", "20:27"],
            ["05:55", "13:15", "16:17", "19:04", "20:29"],
            ["05:53", "13:15", "16:18", "19:06", "20:31"],
            ["05:51", "13:15", "16:19", "19:08", "20:33"],
            ["05:50", "13:15", "16:20", "19:09", "20:34"],
            ["05:48", "13:15", "16:21", "19:10", "20:35"],
            ["05:46", "13:15", "16:21", "19:11", "20:36"],
            ["05:45", "13:15", "16:22", "19:11", "20:37"],
            ["05:43", "13:15", "16:22", "19:12", "20:38"],
            ["05:41", "13:15", "16:23", "19:13", "20:39"],
            ["05:39", "13:15", "16:24", "19:14", "20:40"],
            ["05:37", "13:15", "16:24", "19:15", "20:42"],
            ["05:36", "13:15", "16:25", "19:17", "20:43"],
            ["05:34", "13:15", "16:25", "19:18", "20:44"],
            ["05:32", "13:15", "16:26", "19:19", "20:45"],
            ["05:30", "13:15", "16:26", "19:20", "20:46"],
            ["05:28", "13:15", "16:27", "19:21", "20:47"],
            ["05:26", "13:15", "16:27", "19:22", "20:49"],
            ["05:24", "13:15", "16:28", "19:24", "20:50"],
            ["05:23", "13:15", "16:29", "19:25", "20:53"],
            ["05:21", "13:15", "16:30", "19:28", "20:55"],
            ["05:19", "13:15", "16:31", "19:30", "20:56"],
            ["05:17", "13:15", "16:32", "19:31", "20:56"],
            ["05:15", "13:15", "16:33", "19:31", "20:57"],
            ["05:13", "13:15", "16:34", "19:32", "20:58"],
            ["05:11", "13:15", "16:34", "19:33", "20:59"],
            ["05:09", "13:15", "16:35", "19:35", "21:00"],
            ["05:07", "13:15", "16:35", "19:35", "21:00"]
        ],
        [
            ["05:05", "13:15", "16:36", "19:36", "21:01"],
            ["05:03", "13:15", "16:36", "19:37", "21:02"],
            ["05:01", "13:15", "16:37", "19:38", "21:03"],
            ["05:01", "13:15", "16:37", "19:39", "21:04"],
            ["04:57", "13:15", "16:38", "19:40", "21:05"],
            ["04:55", "13:15", "16:38", "19:40", "21:05"],
            ["04:53", "13:15", "16:38", "19:41", "21:06"],
            ["04:51", "13:15", "16:39", "19:42", "21:07"],
            ["04:49", "13:15", "16:39", "19:42", "21:08"],
            ["04:47", "13:15", "16:39", "19:43", "21:09"],
            ["04:47", "13:15", "16:40", "19:44", "21:10"],
            ["04:45", "13:15", "16:40", "19:46", "21:12"],
            ["04:41", "13:15", "16:41", "19:48", "21:13"],
            ["04:39", "13:15", "16:42", "19:50", "21:15"],
            ["04:37", "13:15", "16:43", "19:52", "21:17"],
            ["04:35", "13:15", "16:44", "19:54", "21:19"],
            ["04:33", "13:15", "16:45", "19:55", "21:20"],
            ["04:33", "13:15", "16:46", "19:56", "21:21"],
            ["04:31", "13:15", "16:47", "19:57", "21:22"],
            ["04:27", "13:15", "16:48", "19:58", "21:23"],
            ["04:25", "13:15", "16:49", "19:59", "21:24"],
            ["04:23", "13:15", "16:50", "20:00", "21:25"],
            ["04:21", "13:15", "16:50", "20:01", "21:26"],
            ["04:19", "13:15", "16:51", "20:02", "21:27"],
            ["04:17", "13:15", "16:51", "20:03", "21:28"],
            ["04:17", "13:15", "16:52", "20:04", "21:29"],
            ["04:13", "13:15", "16:52", "20:05", "21:30"],
            ["04:11", "13:15", "16:54", "20:06", "21:31"],
            ["04:09", "13:15", "16:55", "20:07", "21:32"],
            ["04:08", "13:15", "16:59", "20:09", "21:34"]
        ],
        [
            ["04:06", "13:15", "17:02", "20:10", "21:35"],
            ["04:05", "13:15", "17:03", "20:11", "21:36"],
            ["04:04", "13:15", "17:04", "20:12", "21:37"],
            ["04:03", "13:15", "17:06", "20:13", "21:38"],
            ["04:02", "13:15", "17:08", "20:14", "21:39"],
            ["04:01", "13:15", "17:09", "20:15", "21:40"],
            ["04:00", "13:15", "17:10", "20:16", "21:41"],
            ["03:59", "13:15", "17:10", "20:17", "21:42"],
            ["03:58", "13:15", "17:10", "20:18", "21:43"],
            ["03:57", "13:15", "17:10", "20:19", "21:44"],
            ["03:56", "13:15", "17:10", "20:20", "21:45"],
            ["03:55", "13:15", "17:10", "20:21", "21:46"],
            ["03:54", "13:15", "17:10", "20:22", "21:47"],
            ["03:53", "13:15", "17:10", "20:23", "21:48"],
            ["03:52", "13:15", "17:10", "20:24", "21:49"],
            ["03:51", "13:15", "17:10", "20:25", "21:50"],
            ["03:50", "13:15", "17:10", "20:26", "21:51"],
            ["03:49", "13:15", "17:10", "20:27", "21:52"],
            ["03:48", "13:15", "17:10", "20:28", "21:53"],
            ["03:47", "13:15", "17:10", "20:29", "21:54"],
            ["03:46", "13:15", "17:10", "20:30", "21:55"],
            ["03:45", "13:15", "17:10", "20:30", "21:55"],
            ["03:44", "13:15", "17:10", "20:30", "21:55"],
            ["03:43", "13:15", "17:10", "20:31", "21:56"],
            ["03:42", "13:15", "17:10", "20:31", "21:56"],
            ["03:41", "13:15", "17:10", "20:32", "21:57"],
            ["03:41", "13:15", "17:10", "20:33", "21:58"],
            ["03:40", "13:15", "17:10", "20:34", "21:59"],
            ["03:39", "13:15", "17:10", "20:35", "22:00"],
            ["03:38", "13:15", "17:10", "20:36", "22:01"],
            ["03:37", "13:15", "17:10", "20:37", "22:02"]
        ],
        [
            ["03:36", "13:15", "17:10", "20:38", "22:03"],
            ["03:35", "13:15", "17:10", "20:39", "22:04"],
            ["03:34", "13:15", "17:10", "20:40", "22:05"],
            ["03:33", "13:15", "17:10", "20:41", "22:06"],
            ["03:32", "13:15", "17:10", "20:42", "22:07"],
            ["03:31", "13:15", "17:11", "20:44", "22:08"],
            ["03:31", "13:15", "17:11", "20:45", "22:10"],
            ["03:30", "13:15", "17:11", "20:46", "22:11"],
            ["03:30", "13:15", "17:12", "20:47", "22:12"],
            ["03:30", "13:15", "17:12", "20:48", "22:13"],
            ["03:29", "13:15", "17:12", "20:49", "22:14"],
            ["03:29", "13:15", "17:13", "20:50", "22:15"],
            ["03:28", "13:15", "17:14", "20:51", "22:16"],
            ["03:28", "13:15", "17:14", "20:51", "22:16"],
            ["03:28", "13:15", "17:15", "20:52", "22:17"],
            ["03:27", "13:15", "17:15", "20:52", "22:17"],
            ["03:27", "13:15", "17:15", "20:52", "22:17"],
            ["03:26", "13:15", "17:15", "20:52", "22:17"],
            ["03:26", "13:15", "17:15", "20:53", "22:18"],
            ["03:27", "13:15", "17:15", "20:53", "22:18"],
            ["03:28", "13:15", "17:15", "20:53", "22:18"],
            ["03:29", "13:15", "17:15", "20:53", "22:18"],
            ["03:31", "13:15", "17:15", "20:53", "22:18"],
            ["03:33", "13:15", "17:15", "20:53", "22:18"],
            ["03:34", "13:15", "17:15", "20:53", "22:18"],
            ["03:35", "13:15", "17:15", "20:53", "22:18"],
            ["03:36", "13:15", "17:15", "20:53", "22:18"],
            ["03:38", "13:15", "17:15", "20:53", "22:18"],
            ["03:39", "13:15", "17:15", "20:53", "22:18"],
            ["03:40", "13:15", "17:15", "20:53", "22:18"]
        ],
        [
            ["03:41", "13:15", "17:15", "20:52", "22:17"],
            ["03:43", "13:15", "17:15", "20:51", "22:16"],
            ["03:45", "13:15", "17:15", "20:51", "22:16"],
            ["03:46", "13:15", "17:15", "20:50", "22:15"],
            ["03:47", "13:15", "17:15", "20:50", "22:15"],
            ["03:48", "13:15", "17:15", "20:49", "22:14"],
            ["03:49", "13:15", "17:15", "20:48", "22:13"],
            ["03:50", "13:15", "17:15", "20:47", "22:12"],
            ["03:51", "13:15", "17:15", "20:46", "22:11"],
            ["03:53", "13:15", "17:15", "20:46", "22:11"],
            ["03:55", "13:15", "17:15", "20:46", "22:11"],
            ["03:56", "13:15", "17:15", "20:45", "22:12"],
            ["03:57", "13:15", "17:15", "20:44", "22:09"],
            ["03:58", "13:15", "17:15", "20:43", "22:08"],
            ["03:59", "13:15", "17:15", "20:42", "22:07"],
            ["04:01", "13:15", "17:15", "20:41", "22:06"],
            ["04:03", "13:15", "17:15", "20:40", "22:05"],
            ["04:05", "13:15", "17:13", "20:40", "22:05"],
            ["04:07", "13:15", "17:13", "20:40", "22:05"],
            ["04:09", "13:15", "17:13", "20:39", "22:04"],
            ["04:09", "13:15", "17:13", "20:39", "22:04"],
            ["04:10", "13:15", "17:12", "20:38", "22:03"],
            ["04:10", "13:15", "17:12", "20:37", "22:02"],
            ["04:10", "13:15", "17:11", "20:35", "22:00"],
            ["04:10", "13:15", "17:11", "20:34", "21:59"],
            ["04:10", "13:15", "17:11", "20:33", "21:58"],
            ["04:10", "13:15", "17:09", "20:32", "21:57"],
            ["04:11", "13:15", "17:09", "20:31", "21:56"],
            ["04:11", "13:15", "17:08", "20:30", "21:55"],
            ["04:11", "13:15", "17:08", "20:29", "21:54"],
            ["04:11", "13:15", "17:08", "20:28", "21:53"]
        ],
        [
            ["04:12", "13:15", "17:08", "20:28", "21:53"],
            ["04:13", "13:15", "17:07", "20:27", "21:52"],
            ["04:14", "13:15", "17:06", "20:26", "21:51"],
            ["04:16", "13:15", "17:05", "20:25", "21:50"],
            ["04:17", "13:15", "17:05", "20:24", "21:49"],
            ["04:19", "13:15", "17:04", "20:22", "21:47"],
            ["04:20", "13:15", "17:03", "20:21", "21:46"],
            ["04:21", "13:15", "17:02", "20:20", "21:44"],
            ["04:22", "13:15", "17:01", "20:18", "21:43"],
            ["04:24", "13:15", "17:00", "20:16", "21:40"],
            ["04:25", "13:15", "17:00", "20:14", "21:39"],
            ["04:27", "13:15", "16:59", "20:12", "21:37"],
            ["04:28", "13:15", "16:58", "20:11", "21:36"],
            ["04:29", "13:15", "16:57", "20:10", "21:35"],
            ["04:30", "13:15", "16:57", "20:09", "21:34"],
            ["04:32", "13:15", "16:56", "20:08", "21:33"],
            ["04:33", "13:15", "16:55", "20:07", "21:32"],
            ["04:35", "13:15", "16:54", "20:05", "21:32"],
            ["04:36", "13:15", "16:53", "20:03", "21:28"],
            ["04:38", "13:15", "16:52", "20:01", "21:26"],
            ["04:39", "13:15", "16:52", "19:59", "21:24"],
            ["04:40", "13:15", "16:51", "19:57", "21:22"],
            ["04:41", "13:15", "16:50", "19:55", "21:20"],
            ["04:42", "13:15", "16:49", "19:54", "21:18"],
            ["04:43", "13:15", "16:49", "19:52", "21:17"],
            ["04:44", "13:15", "16:48", "19:50", "21:17"],
            ["04:45", "13:15", "16:47", "19:49", "21:17"],
            ["04:46", "13:15", "16:46", "19:48", "21:15"],
            ["04:47", "13:15", "16:45", "19:47", "21:14"],
            ["04:48", "13:15", "16:44", "19:46", "21:12"],
            ["04:49", "13:15", "16:44", "19:45", "21:11"]
        ],
        [
            ["04:49", "13:15", "16:44", "19:44", "21:09"],
            ["04:50", "13:15", "16:44", "19:43", "21:08"],
            ["04:51", "13:15", "16:44", "19:42", "21:07"],
            ["04:52", "13:15", "16:43", "19:40", "21:06"],
            ["04:53", "13:15", "16:42", "19:39", "21:04"],
            ["04:54", "13:15", "16:41", "19:37", "21:02"],
            ["04:55", "13:15", "16:41", "19:36", "21:01"],
            ["04:56", "13:15", "16:40", "19:34", "20:59"],
            ["04:57", "13:15", "16:40", "19:33", "20:58"],
            ["04:58", "13:15", "16:39", "19:31", "20:56"],
            ["04:59", "13:15", "16:38", "19:29", "20:54"],
            ["05:00", "13:15", "16:37", "19:27", "20:52"],
            ["05:01", "13:15", "16:37", "19:25", "20:50"],
            ["05:03", "13:15", "16:36", "19:23", "20:48"],
            ["05:05", "13:15", "16:35", "19:21", "20:46"],
            ["05:07", "13:15", "16:34", "19:19", "20:44"],
            ["05:09", "13:15", "16:33", "19:17", "20:42"],
            ["05:11", "13:15", "16:32", "19:15", "20:40"],
            ["05:12", "13:15", "16:32", "19:13", "20:38"],
            ["05:13", "13:15", "16:31", "19:11", "20:36"],
            ["05:14", "13:15", "16:31", "19:09", "20:34"],
            ["05:15", "13:15", "16:30", "19:07", "20:32"],
            ["05:16", "13:15", "16:29", "19:05", "20:30"],
            ["05:17", "13:15", "16:28", "19:03", "20:28"],
            ["05:18", "13:15", "16:27", "19:01", "20:26"],
            ["05:19", "13:15", "16:25", "18:59", "20:24"],
            ["05:20", "13:15", "16:24", "18:57", "20:22"],
            ["05:21", "13:15", "16:22", "18:55", "20:20"],
            ["05:22", "13:15", "16:21", "18:53", "20:18"],
            ["05:24", "13:15", "16:19", "18:51", "20:17"]
        ],
        [
            ["05:25", "13:15", "16:18", "18:50", "20:16"],
            ["05:26", "13:15", "16:17", "18:49", "20:15"],
            ["05:27", "13:15", "16:16", "18:48", "20:13"],
            ["05:28", "13:15", "16:15", "18:46", "20:11"],
            ["05:29", "13:15", "16:14", "18:44", "20:09"],
            ["05:30", "13:15", "16:13", "18:42", "20:07"],
            ["05:31", "13:15", "16:12", "18:40", "20:05"],
            ["05:32", "13:15", "16:11", "18:38", "20:03"],
            ["05:33", "13:15", "16:10", "18:36", "20:01"],
            ["05:34", "13:15", "16:09", "18:34", "19:59"],
            ["05:35", "13:15", "16:08", "18:32", "19:57"],
            ["05:36", "13:15", "16:07", "18:30", "19:55"],
            ["05:37", "13:15", "16:06", "18:28", "19:53"],
            ["06:38", "13:15", "16:05", "18:26", "19:51"],
            ["05:39", "13:15", "16:04", "18:24", "19:49"],
            ["05:40", "13:15", "16:03", "18:22", "19:47"],
            ["05:41", "13:15", "16:02", "18:19", "19:45"],
            ["05:43", "13:15", "16:01", "18:17", "19:43"],
            ["05:45", "13:15", "16:00", "18:16", "19:41"],
            ["05:47", "13:15", "15:58", "18:14", "19:39"],
            ["05:48", "13:15", "15:57", "18:12", "19:37"],
            ["05:50", "13:15", "15:56", "18:10", "19:35"],
            ["05:51", "13:15", "15:55", "18:08", "19:33"],
            ["05:52", "13:15", "15:54", "18:06", "19:31"],
            ["05:53", "13:15", "15:53", "18:04", "19:29"],
            ["05:54", "13:15", "15:52", "18:03", "19:28"],
            ["05:56", "13:15", "15:51", "18:02", "19:27"],
            ["05:57", "18:15", "15:50", "18:01", "19:26"],
            ["05:57", "13:15", "15:49", "18:00", "19:25"],
            ["05:58", "13:15", "15:48", "17:59", "19:24"],
            ["05:58", "13:15", "15:47", "17:59", "19:24"]
        ],
        [
            ["05:59", "13:15", "15:46", "17:57", "19:22"],
            ["06:00", "13:15", "15:45", "17:56", "19:21"],
            ["06:01", "13:15", "15:44", "17:55", "19:20"],
            ["06:02", "13:15", "15:44", "17:54", "19:19"],
            ["06:03", "13:15", "15:44", "17:53", "19:18"],
            ["06:04", "13:15", "15:43", "17:53", "19:18"],
            ["06:05", "13:15", "15:43", "17:52", "19:17"],
            ["06:06", "13:15", "15:42", "17:52", "19:17"],
            ["06:07", "13:15", "15:42", "17:51", "19:16"],
            ["06:08", "13:15", "15:41", "17:51", "19:16"],
            ["06:09", "13:15", "15:41", "17:50", "19:15"],
            ["06:10", "13:15", "15:40", "17:50", "19:15"],
            ["06:11", "13:15", "15:40", "17:49", "19:14"],
            ["06:12", "13:15", "15:39", "17:49", "19:14"],
            ["06:13", "13:15", "15:39", "17:48", "19:13"],
            ["06:14", "13:15", "15:38", "17:48", "19:13"],
            ["06:15", "13:15", "15:38", "17:47", "19:12"],
            ["06:16", "13:15", "15:37", "17:47", "19:12"],
            ["06:17", "13:15", "15:37", "17:46", "19:11"],
            ["06:18", "13:15", "15:36", "17:46", "19:11"],
            ["06:19", "13:15", "15:36", "17:45", "19:10"],
            ["06:20", "13:15", "15:35", "17:45", "19:10"],
            ["06:21", "13:15", "15:36", "17:44", "19:09"],
            ["06:22", "13:15", "15:34", "17:44", "19:09"],
            ["06:23", "13:15", "15:34", "17:43", "19:08"],
            ["06:24", "13:15", "15:33", "17:43", "19:08"],
            ["06:25", "13:15", "15:33", "17:42", "19:07"],
            ["06:26", "13:15", "15:32", "17:42", "19:07"],
            ["06:27", "13:15", "15:32", "17:41", "19:06"],
            ["06:28", "13:15", "15:31", "17:41", "19:06"],
            ["06:29", "13:15", "15:30", "17:40", "19:05"]
        ],
        [
            ["06:29", "13:15", "15:29", "17:40", "19:04"],
            ["06:30", "13:15", "15:29", "17:39", "19:03"],
            ["06:30", "13:15", "15:29", "17:38", "19:02"],
            ["06:31", "13:15", "15:28", "17:37", "19:01"],
            ["06:32", "13:15", "15:28", "17:36", "19:00"],
            ["06:33", "13:15", "15:28", "17:35", "19:00"],
            ["06:34", "13:15", "15:27", "17:34", "18:59"],
            ["06:35", "13:15", "15:27", "17:34", "18:59"],
            ["06:36", "13:15", "15:27", "17:34", "18:59"],
            ["06:36", "13:15", "15:26", "17:34", "18:59"],
            ["06:37", "13:15", "15:26", "17:34", "18:59"],
            ["06:38", "13:15", "15:26", "17:34", "18:59"],
            ["06:38", "13:15", "15:25", "17:34", "18:59"],
            ["06:39", "13:15", "15:25", "17:34", "18:59"],
            ["06:40", "13:15", "15:25", "17:34", "18:59"],
            ["06:40", "13:15", "15:24", "17:34", "18:59"],
            ["06:41", "13:15", "15:24", "17:34", "18:59"],
            ["06:41", "13:15", "15:24", "17:34", "18:59"],
            ["06:42", "13:15", "15:23", "17:34", "18:59"],
            ["06:43", "13:15", "15:23", "17:35", "19:00"],
            ["06:43", "13:15", "15:23", "17:35", "19:00"],
            ["06:44", "13:15", "15:22", "17:36", "19:01"],
            ["06:44", "13:15", "15:22", "17:37", "19:02"],
            ["06:45", "13:15", "15:21", "17:38", "19:03"],
            ["06:45", "13:15", "15:20", "17:39", "19:04"],
            ["06:45", "13:15", "15:20", "17:40", "19:05"],
            ["06:46", "13:15", "15:20", "17:41", "19:06"],
            ["06:46", "13:15", "15:20", "17:42", "19:07"],
            ["06:46", "13:15", "15:20", "17:43", "19:08"],
            ["06:47", "13:15", "15:20", "17:44", "19:09"],
            ["06:47", "13:15", "15:20", "17:45", "19:09"]
        ]
    ];


    const translations = [
        {
            "contact_us": {
                "Qi": "Svyaze val",
                "En": "Contact Us",
                "Ru": "Свяжитесь с нами",
                "Ge": "კონტაქტი"
            }
        },
        {
            "contact_us_text": {
                "Qi": "Shoi xatt hum deleexh, shoi 'eul ili Pankiser baaxarxuasht peidanie xirk der ell xatish derg, txueg kxoudeich xaz xatarg da DevPankisi toobun.  <a href=\"http://devpankisi.com\">DevPankisi</a> c1en hum chu daar xuleexh ili c1en program chu yalar xuleexh DevPanksis web site t1i xirk da shun shie dolu huma'. Txuec svyaze boula ettua: <br><br> <p><a href=\"mailto:devpankisi@gmail.com\">Email</a></p> <p><a href=\"https://www.instagram.com/devpankisi/\">Instagram</a></p> <p><a href=\"https://t.me/pankisi_dev_bot\">Telegram</a></p> <br> Txox lest tiax xa lieih saitieg hous: <a href=\"http://devpankisi.com\">DevPankisi.com</a>.",
                "En": "Your feedback matters to us! Connect with us on social media to share your thoughts and suggestions. Stay updated on our projects and reach out to us for any inquiries. Follow us on: <br><br> <p><a href=\"mailto:devpankisi@gmail.com\">Email</a></p> <p><a href=\"https://www.instagram.com/devpankisi/\">Instagram</a></p> <p><a href=\"https://t.me/pankisi_dev_bot\">Telegram</a></p> <br> Remember, your input helps us shape a better future for Pankisi. For more information and to explore our portfolio, visit our website: <a href=\"http://devpankisi.com\">DevPankisi.com</a>.",
                "Ru": "Ваше мнение имеет для нас значение! Свяжитесь с нами в социальных сетях, чтобы поделиться своими мыслями и предложениями. Будьте в курсе наших проектов и обращайтесь к нам с любыми вопросами. Подписывайтесь на нас в: <br><br> <p><a href=\"mailto:devpankisi@gmail.com\">Email</a></p> <p><a href=\"https://www.instagram.com/devpankisi/\">Instagram</a></p> <p><a href=\"https://t.me/pankisi_dev_bot\">Telegram</a></p> <br> Помните, что ваш вклад помогает нам формировать лучшее будущее для Панкиси. Для получения дополнительной информации и изучения нашего портфолио посетите наш веб-сайт: <a href=\"http://devpankisi.com\">DevPankisi.com</a>.",
                "Ge": "თქვენი აზრი ჩვენთვის მნიშვნელოვანია! დაგვიკავშირდით სოციალურ მედიაში. თვალი ადევნეთ ჩვენს საქმიანობას და გაგვიზიარეთ თქვენი აზრი. გამოგვიწერეთ შემდეგ სოციალურ ქსელებში: <br><br> <p><a href=\"mailto:devpankisi@gmail.com\">Email</a></p> <p><a href=\"https://www.instagram.com/devpankisi/\">Instagram</a></p> <p><a href=\"https://t.me/pankisi_dev_bot\">Telegram</a></p> <br> ჩვენს შესახებ მეტი ინფორმაციისთვის გადახედეთ ჩვენი გუნდის ვებსაიტს ვებგვერდზე: <a href=\"http://devpankisi.com\">DevPankisi.com</a>."
            }
        },
        {
            "close": {
                "Qi": "T1ikhovla",
                "En": "Close",
                "Ru": "Закрыть",
                "Ge": "დახურვა"
            }
        },
        {
            "info": {
                "Qi": "Xa'am",
                "En": "Info",
                "Ru": "Информация",
                "Ge": "ინფორმაცია"
            }
        },
        {
            "welcome_message": {
                "Qi": "Assalamu Aleiqum! Marsh dog1eild shu <b>AzanPankisi</b> chu. shu eggir tueshamie nakxuast, miloxa' laamaz xeenish shug lor eiturg iolush e. Txa program chug1ual cxhennich teipan xalua iocush laamaz xenishk xhous ettua ba shun.",
                "En": "Welcome to AzanPankisi, your ultimate companion for accessing prayer times in Pankisi. Stay connected with your faith effortlessly!",
                "Ru": "Добро пожаловать в <b>AzanPankisi</b>, вашего надежного спутника для отслеживания времени молитв в Панкиси.  Без труда узнавайте время молитв с помощью нашего приложения.",
                "Ge": "მოგესალმებით <b>AzanPankisi</b>-ში, პირველი ლოცვის დროების აპლიკაცია პანკისში."
            }
        },
        {
            "about_app": {
                "Qi": "Programax lest:",
                "En": "About App:",
                "Ru": "О приложении:",
                "Ge": "აპლიკაციის შესახებ"
            }
        },
        {
            "about_app_text": {
                "Qi": "<b>AzanPankisi</b> program yar baxhan der, Pankiser laamaz xeenishk att xhaazheit ettua bar. ",
                "En": "<b>AzanPankisi</b> is designed to provide easy access to prayer times in Pankisi, catering specifically to the Pankisi community. Never miss a prayer with our intuitive app, ensuring you stay connected to your faith no matter where you are in Pankisi.",
                "Ru": "<b>AzanPankisi</b> создан для обеспечения простого доступа к времени молитв в Панкиси, Специально ориентированный на сообщество Панкиси. Никогда не пропускайте молитву с нашим интуитивно понятным приложением, обеспечивая доступ ко времени молитв только в Панкиси.",
                "Ge": "<b>AzanPankisi</b> არის აპლიკაცია რომელიც გიმარტივებთ ლოცვის დროების მონიტორინგს პანკისში, არ დააგვიანო არც ერთი ლოცვა სადაც არ უნდა იყო პანკისში."
            }
        },
        {
            "about_us": {
                "Qi": "Txox lest",
                "En": "About Us",
                "Ru": "О нас",
                "Ge": "ჩვენს შესახებ"
            }
        },
        {
            "about_us_text": {
                "Qi": "Txo <b>DevPankisi</b> oolush Pankiser toob e. Txo veshax kxetar baxhan, Pankiser toobun ieshush programieshcar ili web-saiteshcar human ieshush g1o dar.   Txa toobun iukx1e daaxk1 loocurish: <br><br><b>Aslan Borchashvili<br>Shobur Margoev<br>Suleiman Mutoshvili</b><br><br>",
                "En": "We are the DevPankisi team, a group of passionate individuals from Pankisi dedicated to serving our community through technology. Meet our team members: <br><br><b>Aslan Borchashvili<br>Shobur Margoev<br>Suleiman Mutoshvili</b><br><br>",
                "Ru": "Мы - команда <b>DevPankisi</b>, группа людей из Панкиси, объединившихся для создания инновационных решений для нашего сообщества. Представляем нашу команду: <br><br><b>Аслан Борчашвили<br>Шобур Маргоев<br>Сулейман Мутошвили</b><br><br>",
                "Ge": "ჩვენ ვართ <b>DevPankisi</b>, ახალგაზრდა დეველოპერების გუნდი პანკისიდან, ჩვენი მიზანია წავახალისოთ და ხელი შევუწყოთ პანკისის განვითარებას ტექნოლოგიის საშუალებით, ჩვენი გუნდის წევრები: <br><br><b>ასლან ბორჩაშვილი<br>შობურ მარგოევ<br>სულეიმან მუთოშვილი</b><br><br>"
            }
        },
        {
            "about_team": {
                "Qi": "<b>DevPankisi</b> kxullin xilar baxhan, Pankiser naxag informacie, peida' ieceiturg bolush iolu saitesht, programisht 1alazhua erg iolush kxullin e. <b>DevPankisi</b> t1i yaa ezish iol xeen chu kxi dukxa' hum da 'eul iolush e.",
                "En": "At <b>DevPankisi</b>, we specialize in developing apps and websites tailored to the unique needs of the Pankisi community. Our mission is to enhance accessibility, connectivity, and convenience for everyone in our community. With <b>AzanPankisi</b> as our first offering, we're committed to creating more innovative solutions to empower and uplift Pankisi.",
                "Ru": "В <b>DevPankisi</b> мы специализируемся на разработке приложений и веб-сайтов, адаптированных под уникальные потребности сообщества Панкиси. Наша миссия - повышение доступности, связанности и удобства для каждого в нашем сообществе. Начиная с <b>AzanPankisi</b>, нашего первого проекта, мы готовы создавать более инновационные решения для укрепления и подъема Панкиси.",
                "Ge": "<b>DevPankisi</b>-ში ჩვენი მთავარი მიზანია ჩვენი ხალხის უნიკალურ საჭიროებებზე მორგებული აპლიკაციების შექმნა და განვითარება."
            }
        },
        {
            "general": {
                "Qi": "Kuertara",
                "En": "General",
                "Ru": "Общее",
                "Ge": "ზოგადი"
            }
        },
        {
            "language": {
                "Qi": "Muatt",
                "En": "Language",
                "Ru": "Язык",
                "Ge": "ენა"
            }
        },
        {
            "note": {
                "Qi": "*wyachuan bualx cabo mos okx nastroikish, dalmuklah ca goush ti lodiarg!",
                "En": "*these settings are not working at the moment, we are working on it and will be included in next update!",
                "Ru": "В данный момент эти настройки не работают, мы работаем над этим и включим их в следующее обновление!",
                "Ge": "*ეს ფუნქციები ჯერ არ მუშაობს, მალე დემატება!"
            }
        },
        {
            "dark_theme": {
                "Qi": "Kxuelan buas",
                "En": "Dark Theme",
                "Ru": "Темная тема",
                "Ge": "მუქი ფერები"
            }
        },
        {
            "notifications": {
                "Qi": "Dagvakxar",
                "En": "Notifications",
                "Ru": "Уведомления",
                "Ge": "შეტყობინებები"
            }
        },
        {
            "notify_on_prayer": {
                "Qi": "Lamazan xann dag vakxar",
                "En": "Notify on prayer time:",
                "Ru": "Уведомлять о времени молитвы",
                "Ge": "შეტყობინება ლოცვის დროს"
            }
        },
        {
            "notify_with_sound": {
                "Qi": "Tatanс dagvakxar:",
                "En": "Play sound:",
                "Ru": "Воспроизвести звук",
                "Ge": "ხმის შეტყობინება"
            }
        },
        {
            "notify_5_min_advance": {
                "Qi": "5 min. xhalxox dag vakxar",
                "En": "Notify 5 minutes advance:",
                "Ru": "Уведомить за 5 минут",
                "Ge": "შეტყობინება 5 წუთით ადრე"
            }
        },
        {
            "fajr": {
                "Qi": "1yira ",
                "En": "Fajr",
                "Ru": "Фаджр",
                "Ge": "დილის"
            }
        },
        {
            "zuhr": {
                "Qi": "Delkx1a",
                "En": "Zuhr",
                "Ru": "Зухр",
                "Ge": "შუადღის"
            }
        },
        {
            "asr": {
                "Qi": "Malx-buzar",
                "En": "Asr",
                "Ru": "Аср",
                "Ge": "საღამოს"
            }
        },
        {
            "magrib": {
                "Qi": "Mergish",
                "En": "Maghrib",
                "Ru": "Магриб",
                "Ge": "მზის-ჩასვლის"
            }
        },
        {
            "isha": {
                "Qi": "Pxhuer",
                "En": "Isha",
                "Ru": "Иша",
                "Ge": "ღამის"
            }
        },
        {
            "all_prayer_times_passed": {
                "Qi": "Taxan-laar Shie dol lamaz dina della.",
                "En": " all prayers for today are done!",
                "Ru": "Все молитвы на сегодня завершены!",
                "Ge": "დღეისთვის ყველა ლოცვა შესრულებულია!"
            }
        },
        {
            "january": {
                "Qi": "Kxollaman",
                "En": "January",
                "Ru": "Январь",
                "Ge": "იანვარი"
            }
        },
        {
            "february": {
                "Qi": "Chillan",
                "En": "February",
                "Ru": "Февраль",
                "Ge": "თებერვალი"
            }
        },
        {
            "march": {
                "Qi": "Bekarg",
                "En": "March",
                "Ru": "Март",
                "Ge": "მარტი"
            }
        },
        {
            "april": {
                "Qi": "Oxanan",
                "En": "April",
                "Ru": "Апрель",
                "Ge": "აპრილი"
            }
        },
        {
            "may": {
                "Qi": "Hutosurg",
                "En": "May",
                "Ru": "Май",
                "Ge": "მაისი"
            }
        },
        {
            "june": {
                "Qi": "Asaran",
                "En": "June",
                "Ru": "Июнь",
                "Ge": "ივნისი"
            }
        },
        {
            "july": {
                "Qi": "Mangalan",
                "En": "July",
                "Ru": "Июль",
                "Ge": "ივლისი"
            }
        },
        {
            "august": {
                "Qi": "Xhettan",
                "En": "August",
                "Ru": "Август",
                "Ge": "აგვისტო"
            }
        },
        {
            "september": {
                "Qi": "Tovbecan",
                "En": "September",
                "Ru": "Сентябрь",
                "Ge": "სექტემბერი"
            }
        },
        {
            "october": {
                "Qi": "Esaran",
                "En": "October",
                "Ru": "Октябрь",
                "Ge": "ოქტომბერი"
            }
        },
        {
            "november": {
                "Qi": "Laxhanan",
                "En": "November",
                "Ru": "Ноябрь",
                "Ge": "ნოემბერი"
            }
        },
        {
            "december": {
                "Qi": "G1uran",
                "En": "December",
                "Ru": "Декабрь",
                "Ge": "დეკემბერი"
            }
        },
        {
            "day": {
                "Qi": "De",
                "En": "day",
                "Ru": "день",
                "Ge": "დღე"
            }
        },
        {
            "settings": {
                "Qi": "Xiicamish",
                "En": "Settings",
                "Ru": "Настройки",
                "Ge": "პარამეტრები"
            }
        },
        {
            "remaining": {
                "Qi": "Isan xa",
                "En": "Remaining:",
                "Ru": "Оставшееся:",
                "Ge": "დარჩენილია"
            }
        },
        {
            "monday": {
                "Qi": "Orshot-di",
                "En": "Monday",
                "Ru": "Понедельник",
                "Ge": "ორშაბათი"
            }
        },
        {
            "tuesday": {
                "Qi": "Shinari-di",
                "En": "Tuesday",
                "Ru": "Вторник",
                "Ge": "სამშაბათი"
            }
        },
        {
            "wednesday": {
                "Qi": "Khaara-di",
                "En": "Wednesday",
                "Ru": "Среда",
                "Ge": "ოთხშაბათი"
            }
        },
        {
            "thursday": {
                "Qi": "E'ari-di",
                "En": "Thursday",
                "Ru": "Четверг",
                "Ge": "ხუთშაბათი"
            }
        },
        {
            "friday": {
                "Qi": "P1eraska-di",
                "En": "Friday",
                "Ru": "Пятница",
                "Ge": "პარასკევი"
            }
        },
        {
            "saturday": {
                "Qi": "Shuota-di",
                "En": "Saturday",
                "Ru": "Суббота",
                "Ge": "შაბათი"
            }
        },
        {
            "sunday": {
                "Qi": "K1iran-di",
                "En": "Sunday",
                "Ru": "Воскресенье",
                "Ge": "კვირა"
            }
        },
        {
            "feedback": {
                "Qi": "Khiitsam",
                "En": "Feedback",
                "Ru": "Отзыв",
                "Ge": "გამოხმაურება"
            }
        },
        {
            "feedback_text": {
                "Qi": "text",
                "En": "Thank you for taking the time to test our prayer times app. Your feedback is invaluable to us as we strive to create the best possible experience for our users. Please follow the link to send us your feedback:  or you can send it to our telegram bot: <p><a href=\"https://t.me/pankisi_dev_bot\">Telegram Bot</a></p>",
                "Ru": "Спасибо, что нашли время протестировать наше приложение «Время молитв». Ваши отзывы бесценны для нас, поскольку мы стремимся создать наилучшие впечатления для наших пользователей. Пожалуйста, перейдите по ссылке, чтобы отправить нам свой отзыв, или вы можете отправить его нашему телеграм-боту: <a href=\"https://t.me/pankisi_dev_bot\">телеграм-бот</a>",
                "Ge": "გმადლობთ, რომ უთმობთ დროს ჩვენი აპლიკაციის შემოწმებას, თქვენი აზრი ჩვენთვის მნიშვნელოვანია, გთხოვთ გადახვიდეთ ბმულზე და შეავსოთ ფორმა რათა დააფიქსიროთ თვენი აზრი, შენიშვნები, იდეები ან მიწეროთ ჩვენს ტელეგრამ ბოტს: <a href=\"https://t.me/pankisi_dev_bot\">ტელეგრამის ბოტი</a>"
            }
        }
    ]

    applySettings();
})
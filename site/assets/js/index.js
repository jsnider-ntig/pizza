// The map of all of the months with its corresponding number
let listOfMonths = [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december"
];
let listOfZipCodes = [98139, 98140, 98142, 98138]

// The first function that runs when the page loads
$(document).ready(() => {

    $("#orderButton").on("click", () => toggleOverlayVisibility(true));

    $("#orderConfirmButton").on("click", () => getZipCodeFromInput());

    $("#orderInput").on("keyup", ev => {
        if(ev.key === "Enter") {
            ev.preventDefault();
            $("#orderConfirmButton").click();
        }
    });

    reorderListByClosestDate(new Date());

    $("body").on("keyup", ev => {
        if((ev.key === "Esc" || ev.key === "Escape") &&
        $("#orderOverlay").attr("data-state") == "visible") {
            ev.preventDefault();
            toggleOverlayVisibility(false);
        }
    });
});

/**
 * The function that gets and reorders the list passed to the function.
 * It gets the current order and converts the text to a Date variable.
 * If the next closed date month number is larger than the current month number, the date is this year.
 * It then calculates the difference in days between the dates and sort the children and re-append the children to the original element (listElement)
 * @param {HTMLElement} listElement The list element with the dates as children
 */
function reorderListByClosestDate(date) {
    let strList = $("#closedDays").children().map((_, val) => val.children[0].innerText);

    let dates = strList.map((_, val) => {
        let dateString = val.split(" ");
        dateString[1] = listOfMonths.indexOf(dateString[1]);
        let newDate = new Date(date.getFullYear(), dateString[1], dateString[0]);
        if(newDate < date)
            newDate.setFullYear(newDate.getFullYear() + 1);

        return newDate;
    }).sort((a, b) => a > b);

    $("#closedDays").html("");
    dates.each((_, val) => {
        let day = val.getDate();
        let month = listOfMonths[val.getMonth()];
        $("#closedDays").append("<li><span class='closedDay'>"+day+" "+month+"</span><span>Stängt</span></li>");
    });
}

/**
 * The current scroll position
 */
function toggleScroll() {
    let status = $._data($("#orderButton")[0], "events") === undefined;
    if(status) {
        $('body').on('scroll touchmove mousewheel', function(e){
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
    } else {
        $('body').off('scroll touchmove mousewheel');
    }
}
/**
 * Toggles the visibility by switching the overlay display property while adding a few click event listeners to hide the overlay when clicking outside of the overlay
 * @param {Boolean} overlayBool If the overlay is visible or not
 */
function toggleOverlayVisibility(status = false) {
    let overlayDiv = $("#orderOverlay");
    overlayDiv.attr("data-state", status ? "visible" : "hidden");
    if (status) {
        $("#orderStatus").text("Skriv in ditt postnummer");
        $("#orderInput").val("");
        toggleScroll();

        $(window).on("mousedown", ev => {
            ev.target == overlayDiv[0] ? toggleOverlayVisibility(false):null;
        });
        $("#orderCloseButton").on("click", (_) => toggleOverlayVisibility(false));
        $("#orderOverlay").css({ "display": "flex", "opacity": 1});
    } else {
        $(window).off('scroll');
        $(window).off('click');
        overlayDiv.css("opacity", 0);
        // Sets the overlay to display none after a set delay to let the transition finish
        setTimeout(() => {
            overlayDiv.css("display", "none");
            $("#orderStatus").removeClass();
        }, 150);
    }
}

/**
 * Gets the overlays input value and validates if it's a number and if it's a valid zip-code.
 * The overlay status element then shows if the zip-code is valid or not
 */
function getZipCodeFromInput() {
    let orderStatus = $("#orderStatus");
    orderStatus.removeClass();

    let inputValue = $("#orderInput").val();

    if (listOfZipCodes.indexOf(parseInt(inputValue)) > -1) {
        finalResult = "Vi levererar till dig";
        finalClass = "orderSuccess";
    } else if (inputValue == "") {
        finalResult = "Skriv in ditt postnummer";
        finalClass = "orderInfo";
    } else {
        finalResult = "Vi levererar inte till dig";
        finalClass = "orderFail";
    }
    orderStatus.text(finalResult);
    orderStatus.addClass(finalClass);
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}


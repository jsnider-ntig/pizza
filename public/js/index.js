// Creates a date variable with the current date
const dateNow = new Date();

// The map of all of the months with its corresponding number
let listOfMonths = {
    "januari": 1,
    "februari": 2,
    "mars": 3,
    "april": 4,
    "maj": 5,
    "juni": 6,
    "juli": 7,
    "augusti": 8,
    "september": 9,
    "oktober": 10,
    "november": 11,
    "december": 12,
}

/**@type {HTMLHeadingElement} */
let orderButton;

/** @type {HTMLDivElement} */
let overlayDiv;

/** @type {HTMLDivElement} */
let contentDiv;

let windowClickEvent;
/**@type {HTMLInputElement} */
let textInput;
/**@type {HTMLDivElement} */
let orderSearchButton;
/**@type {HTMLDivElement} */
let orderCloseButton;
/**@type {HTMLSpanElement} */
let orderStatus;
let listOfZipCodes = [98139, 98140, 98142, 98138]

function getScrollWidth() {
    console.log(window.innerWidth - document.body.clientWidth)
    return window.innerWidth - document.body.clientWidth;
}


// The first function that runs when the page loads
onload = (() => {
    contentDiv = document.getElementById("ContentDiv");

    orderButton = document.getElementById("orderButton");
    orderButton.addEventListener("click", () => toggleOverlay(getOverlayState()));

    orderSearchButton = document.getElementById("orderConfirmButton");
    orderSearchButton.addEventListener("click", () => getNumber());

    textInput = document.getElementById("orderInput");
    textInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            orderSearchButton.click();
        }
    });

    getDaysUntil(document.getElementById("closedDays"));
});

/**
 * The function that gets and reorders the list passed to the function
 * @param {HTMLElement} listElement 
 */
function getDaysUntil(listElement) {
    // The list of all of the child nodes 
    let list = listElement.children;
    for (let index = 0; index < list.length; index++) {
        // The next date from the for loop as a string ex: january 8
        const dateString = list[index].children[0].innerHTML;

        // Initial variables
        let daysBetween = 0;
        let sameDay = false;

        // Splitting the dates into an array with month and year
        let dateSplit = dateString.split(" ");

        // Creates variables with the month/date numbers as value
        let monthNumber = listOfMonths[dateSplit[1]]
        let dateNumber = dateSplit[0];

        // Creates the same variables above but with the current month and date
        let monthNowNumber = dateNow.getMonth() + 1;
        let dayNowNumber = dateNow.getDate();

        let year = 0;
        if (monthNumber < monthNowNumber) {
            // When the number of the month is smaller than the current month number
            // We know that it's next year
            year = dateNow.getFullYear() + 1;
        } else if (monthNumber > monthNowNumber) {
            // When the number of the month is larger than the current month number
            // We know that it's this year
            year = dateNow.getFullYear();
        } else {
            // Same Month
            if (dateNumber < dayNowNumber) {
                // When the date is smaller than the current date
                // We know that it's next year
                year = dateNow.getFullYear() + 1;
            } else if (dateNumber > dayNowNumber) {
                // When the date is larger than the current date
                // We know that it's this year
                year = dateNow.getFullYear();
            } else {
                // Same day
                sameDay = true;
            }
        }
        if (!sameDay) {
            // Calculate the number of days left when the date isn't the current date
            let date = Date.parse(monthNumber + " " + dateNumber + " " + year);
            let deltaTime = new Date(date).getTime() - dateNow.getTime();
            daysBetween = Math.ceil(deltaTime / (1000 * 60 * 60 * 24));
        }
        // Sets the daysLeft attribute for each li element to its correct value
        list[index].setAttribute("daysLeft", daysBetween)
    }
    let childrenList = [];
    // Adds all of the listElements into a new array instead of using the listElement.children which is an HTMLCollection
    for (let index = 0; index < listElement.children.length; index++) {
        childrenList.push(listElement.children[index])
    }
    // Sorts the items by their individual daysLeft value
    childrenList.sort((item1, item2) => {
        return item1.getAttribute("daysLeft") - item2.getAttribute("daysLeft");
    });
    // Appends each element from the array to the HTML li
    childrenList.forEach(element => listElement.appendChild(element));
}

function getOverlayState() {
    // If the element is undefined, get the element
    if (!overlayDiv) overlayDiv = document.getElementById("orderOverlay");
    // Get the attribute value
    let currentState = overlayDiv.getAttribute("data-state");
    // Return the correct bool depending on the value
    return currentState == "visible" ? true : false;
}

function toggleOverlay(overlayBool) {
    if (!overlayDiv) overlayDiv = document.getElementById("orderOverlay");
    // Change the attribute to visible or hidden depending on the overlayBool value
    overlayDiv.setAttribute("data-state", overlayBool ? "hidden" : "visible");
    if (!overlayBool) {
        // When the overlay should hide
        contentDiv.style.marginRight = getScrollWidth() + "px"
        // Remove page scroll which will introduce a shift in the page which is mitigated by the margin right
        document.body.style.overflowY = "hidden";
        // When clicking the outerDiv, close the overlay
        windowClickEvent = window.addEventListener("mousedown", (event) => {
            if (event.target == overlayDiv) toggleOverlay(true);
        });
        // If the element is undefined, get the element
        if (!orderCloseButton) orderCloseButton = document.getElementById("orderCloseButton");
        // Set an event listener to the close button
        orderCloseButton.addEventListener("click", (event) => toggleOverlay(true));
        // Sets the display of the overlay to grid
        overlayDiv.style.display = "grid";
        // Call width to update the component after display change to fix transition not working
        overlayDiv.clientWidth;
        // Set the opacity to 1 to start the transition
        overlayDiv.style.opacity = 1;
    } else {
        // Show overlay
        // Sets a margin of zero to the upper div
        contentDiv.style.marginRight = 0;
        // Restore scroll
        document.body.style.overflowY = "visible";
        // Remove the window eventListener
        window.removeEventListener("click", windowClickEvent);
        // Set the opacity of the overlay to 0
        overlayDiv.style.opacity = 0;
        // Sets the overlay to display none after a set delay to let the transition finish
        setTimeout(() => overlayDiv.style.display = "none", 150);
    }
}

function getNumber() {
    /** @type {String} */
    // Replace all of the spaces and dashes with an empty space
    let value = textInput.value.replace(" ", "").replace("-", "");
    // The default result
    let result = "Vi levererar inte till dig";
    // If the text only contains numbers
    if (value.match(RegExp("^[0-9]+$"))) {
        // To check if the given number matches any of the 
        for (let index = 0; index < listOfZipCodes.length; index++) {
            // If the number matches
            if (listOfZipCodes[index].toString() == value) {
                // Change the result if the number matches
                result = "Vi levererar till dig";
                // End the loop
                index = listOfZipCodes.length;
            }
        }
    }
    // If the value wasn't typed in
    if (value == "") result = "Skriv in ditt postnummer";
    // If the element is undefined, get the element
    if (!orderStatus) orderStatus = document.getElementById("orderStatus");
    // Show the message to the user
    orderStatus.textContent = result;
}
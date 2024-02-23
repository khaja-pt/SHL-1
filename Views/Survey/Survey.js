document.addEventListener("DOMContentLoaded", function () {
    const expandMenuBtn = document.getElementById("expand-menu-btn");
    const leftMenu = document.querySelector(".left-menu");
    const formElements = document.querySelector(".form-elements");
    const surveyElementsContainer = document.getElementById("survey-elements");

    expandMenuBtn.addEventListener("click", function () {
        console.log("Expand menu button clicked."); // Add this line to test
        leftMenu.classList.toggle("expanded");
        if (leftMenu.classList.contains("expanded")) {
            formElements.style.display = "block";
        } else {
            formElements.style.display = "none";
        }
    });


    const draggables = document.querySelectorAll(".form-group[draggable='true']");

    draggables.forEach(function (draggable) {
        draggable.addEventListener("dragstart", function (event) {
            const dataType = draggable.getAttribute("data-type");
            event.dataTransfer.setData("text/plain", dataType);
        });
    });

    surveyElementsContainer.addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    surveyElementsContainer.addEventListener("drop", function (event) {
        event.preventDefault();
        const dataType = event.dataTransfer.getData("text/plain");
        console.log("Dropped dataType:", dataType);

        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group", "draggable-item");

        switch (dataType) {
            case "text":
                addTextField(formGroup);
                break;
            case "radio":
                addRadioButton(formGroup);
                break;
            case "dropdown":
                addDropdown(formGroup);
                break;
            case "phone":
                addPhoneNumberField(formGroup);
                break;
            case "email":
                addEmailField(formGroup);
                break;
            case "rating":
                addRatingField(formGroup);
                break;
            case "yesno":
                addYesNoField(formGroup);
                break;
            case "fillblank":
                addFillInBlanksField(formGroup);
                break;
            
        }

        surveyElementsContainer.appendChild(formGroup);
    });


    function addTextField(formGroup) {
        const label = createEditableLabel("Click here to type for the text:");
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.classList.add("form-control");
        formGroup.appendChild(label);
        formGroup.appendChild(input);
    }

    function addRadioButton(formGroup) {
        const label = createEditableLabel("Radio:");

        const radio1 = createRadioButton("Option 1");
        const radio2 = createRadioButton("Option 2");
        const radio3 = createRadioButton("Option 3");

        formGroup.appendChild(label);
        formGroup.appendChild(radio1);
        formGroup.appendChild(radio2);
        formGroup.appendChild(radio3);
    }

    function addDropdown(formGroup) {
        const label = createEditableLabel("Dropdown:");

        const optionInput = document.createElement("input");
        optionInput.setAttribute("type", "text");
        optionInput.classList.add("form-control", "dropdown-option", "mt-1", "col-9");
        optionInput.placeholder = "Enter Option";
        optionInput.style.display = "block";

        const addOptionBtn = document.createElement("button");
        addOptionBtn.textContent = "Add Option";
        addOptionBtn.classList.add("btn", "btn-primary", "add-option-btn", "mt-1");
        addOptionBtn.style.marginLeft = "10px";

        const optionWrapper = document.createElement("div");
        optionWrapper.style.display = "flex";
        optionWrapper.appendChild(optionInput);
        optionWrapper.appendChild(addOptionBtn);

        const select = document.createElement("select");
        select.classList.add("form-control", "dropdown-select");

        formGroup.appendChild(label);
        formGroup.appendChild(select);
        formGroup.appendChild(optionWrapper);

        addOptionBtn.addEventListener("click", function () {
            // toggleVisibility(optionInput);
            const optionValue = optionInput.value.trim();
            if (optionValue !== "") {
                const option = document.createElement("option");
                option.textContent = optionValue;
                select.appendChild(option);
                optionInput.value = ""; // Clear the text input
            }
        });
    }

    function toggleVisibility(element) {
        element.style.display = (element.style.display === "none") ? "inline-block" : "none";
    }



    function createEditableLabel(labelText) {
        const label = document.createElement("label");
        label.contentEditable = true;
        label.textContent = labelText;
        return label;
    }

    function createRadioButton(labelText) {
        const radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", "radio");
        radio.classList.add("form-check-input");
        const label = createEditableLabel(labelText);
        const radioContainer = document.createElement("div");
        radioContainer.classList.add("form-check");
        radioContainer.appendChild(radio);
        radioContainer.appendChild(label);
        return radioContainer;
    }
    function addYesNoField(formGroup) {
        console.log("Adding Yes/No Field");
        const label = createEditableLabel("Yes/No:");
        const yesOption = createRadioButton("Yes", "yesNoOption");
        const noOption = createRadioButton("No", "yesNoOption");

        formGroup.appendChild(label);
        formGroup.appendChild(yesOption);
        formGroup.appendChild(noOption);
    }

    function createRadioButton(labelText, groupName) {
        const radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", groupName);
        radio.classList.add("form-check-input");
        const label = createEditableLabel(labelText);
        const radioContainer = document.createElement("div");
        radioContainer.classList.add("form-check");
        radioContainer.appendChild(radio);
        radioContainer.appendChild(label);
        return radioContainer;
    }
    function addFillInBlanksField(formGroup) {
        console.log("Adding Fill in the Blanks Field");
        const label = createEditableLabel("Fill in the Blank:");
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.classList.add("form-control");
        formGroup.appendChild(label);
        formGroup.appendChild(input);
    }



    surveyElementsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            const item = event.target.closest(".draggable-item");
            item.remove();
        }
    });
});
// JavaScript code to send form data to the controller when the button is clicked
document.getElementById("submitSurvey").addEventListener("click", function () {
    // Example of extracting form data from dynamic form elements
    const formData = {};

    // Select all draggable items inside the survey container
    const draggableItems = document.querySelectorAll("#survey-elements .draggable-item");

    // Loop through each draggable item to extract its data
    draggableItems.forEach(function (item, index) {
        const elementType = item.querySelector("label").textContent;
        const input = item.querySelector("input");

        // Extract the value based on the element type
        if (elementType.includes("Text") || elementType.includes("Radio")) {
            formData[`textbox_${index}`] = { label: elementType, value: input.value };
        } else if (elementType.includes("Dropdown")) {
            const selectElement = item.querySelector("select");
            const options = Array.from(selectElement.options).map(option => option.text);
            formData[`dropdown_${index}`] = { label: elementType, selectedValue: selectElement.value, options: options };
        }
    });

    // Now you have the formData object containing the form data, you can send it to the server
    console.log(formData); // For testing purposes, you can log the form data to the console

    // Use fetch or any other method to send the formData object to the server
    fetch('/Survey/NewSurvey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit form.');
            }
            console.log('Form submitted successfully.');
        })
        .catch(error => {
            console.error('Error:', error);
        });


document.addEventListener("DOMContentLoaded", function () {
    var timeLeft = 300; // Time in seconds (5 minutes)
    var timerElement = document.getElementById('surveyTimer');
    var timerId;

    function updateTimer() {
        var minutes = Math.floor(timeLeft / 60);
        var seconds = timeLeft % 60;
        timerElement.textContent = `Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timerId);
            // Automatically submit the form, or inform the user that the time is up
            document.getElementById('submitSurvey').click(); // Simulate form submission
            // Alternatively, you could alert the user or redirect them
            // alert("Time's up! The form was submitted automatically.");
            // window.location.href = '/time-up';
        } else {
            timeLeft--;
        }
    }

    timerId = setInterval(updateTimer, 1000);
});

});


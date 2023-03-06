var fpcontainer = document.querySelector('.fpcontainer');
var uipanels;
var jxapi;
var floatingPanels = [];


var currentMuteStatus;
var popupVolumeTimeout;

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


function createIconTextDivForPanel(id, text, icon, color, page) {
    const div = document.createElement('div');
    div.id = id;
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.justifyContent = 'flex-start';
    div.style.alignItems = 'center';
    div.style.height = '160px';

    const circle = document.createElement('div');
    circle.style.width = '80px';
    circle.style.height = '80px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = color;
    div.appendChild(circle);

    const iconElement = document.createElement('img');
    iconElement.src = icon;
    iconElement.width = 50;
    iconElement.height = 50;
    iconElement.style.position = 'relative';
    iconElement.style.top = '50%';
    iconElement.style.left = '50%';
    iconElement.style.transform = 'translate(-47%, -45%)';
    circle.appendChild(iconElement);

    const textElement = document.createElement('p');
    textElement.innerText = text;
    textElement.style.marginTop = '5px'; // Add some top margin to the text
    textElement.style.textAlign = 'center'; // Center the text
    div.appendChild(textElement);


    div.onclick = () => {
        displayUIXPanel(id, page);
    }

    return div;
}
function createIconTextDivForAction(id, text, icon, color) {
    const div = document.createElement('div');
    div.id = id;
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.justifyContent = 'flex-start';
    div.style.alignItems = 'center';
    div.style.height = '160px';

    const circle = document.createElement('div');
    circle.style.width = '80px';
    circle.style.height = '80px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = color;
    div.appendChild(circle);

    const iconElement = document.createElement('img');
    iconElement.src = icon;
    iconElement.width = 50;
    iconElement.height = 50;
    iconElement.style.position = 'relative';
    iconElement.style.top = '50%';
    iconElement.style.left = '50%';
    iconElement.style.transform = 'translate(-47%, -45%)';
    circle.appendChild(iconElement);

    const textElement = document.createElement('p');
    textElement.innerText = text;
    textElement.style.marginTop = '5px'; // Add some top margin to the text
    textElement.style.textAlign = 'center'; // Center the text
    div.appendChild(textElement);

    div.onclick = () => {
        xapiPanelClick(id);
    }

    return div;
}



function addIncallIconFirstRow() {
    // Get the table element
    var table = document.getElementById('incalliconsrow1');

    // Create a new table cell
    var cell = document.createElement("td");

    // Set the cell's height and content
    cell.style.height = "150px";
    cell.textContent = "New Cell";

    // Set the cell's width
    cell.style.width = "150px";

    // Append the cell to the row
    table.rows[0].appendChild(cell);
}



function handleCallDisconnect() {
    jxapi.Event.CallDisconnect.on(value => {
        if (value.CauseValue != 1) {
            showErrorPopup(value.CauseString);
        }
        hideCallingScreen();
        hideIncallScreen();
    });

}
function handleCallSuccessful() {
    jxapi.Event.CallSuccessful.on(value => {
        hideCallingScreen();
        showIncallScreen();
    });
}

function showStandbyScreen() {
    var standby = document.querySelector('#standby');
    standby.style.display = 'block';
    setTimeout(function () {
        standby.style.opacity = 1;
    }, 10);

}
function hideStandbyScreen() {
    var standby = document.querySelector('#standby');
    standby.style.opacity = 0;
    setTimeout(function () {
        standby.style.display = 'none';
    }, 200);

}
function standbyDeactivate() {
    jxapi.Command.Standby.Deactivate();
}

function showHalfwakeScreen() {
    var standby = document.querySelector('#halfwake');
    standby.style.display = 'block';
    setTimeout(function () {
        standby.style.opacity = 1;
    }, 10);

}
function hideHalfwakeScreen() {
    var standby = document.querySelector('#halfwake');
    standby.style.opacity = 0;
    setTimeout(function () {
        standby.style.display = 'none';
    }, 200);

}

function showIncallScreen() {
    var incall = document.querySelector('#incall');
    incall.style.display = 'block';
    incall.classList.add('show');
    setTimeout(function () {
        incall.style.opacity = 1;
    }, 10);

}
function hideIncallScreen() {
    var incall = document.querySelector('#incall');
    incall.style.opacity = 0;
    setTimeout(function () {
        incall.style.display = 'none';
    }, 200);

}


function showCallingScreen(number) {
    var calling = document.querySelector('#calling');
    var callingtext = document.getElementById('callingtext');
    callingtext.innerHTML = `Calling: ${number}`;
    calling.style.display = 'block';
    setTimeout(function () {
        calling.style.opacity = 1;
    }, 10);

}
function hideCallingScreen() {
    var calling = document.querySelector('#calling');
    calling.style.opacity = 0;
    setTimeout(function () {
        calling.style.display = 'none';
    }, 200);

}

function respondToPrompt(feedbackId, optionId) {
    jxapi.Command.UserInterface.Message.Prompt.Response({
        FeedbackId: feedbackId,
        OptionId: optionId
    });
    hidePrompt();
}
function showPrompt(prompt) {
    setTimeout(() => {
        var promptcontainer = document.getElementById('promptcontainer');
        var promptpanel = document.getElementById('promptpanel');
        var prompttitle = document.getElementById('prompttitle');
        var prompttext = document.getElementById('prompttext');
        var promptoptions = document.getElementById('promptoptions');
        prompttitle.innerHTML = prompt.Title;
        prompttext.innerHTML = prompt.Text;
        promptcontainer.style.display = 'block';
        promptcontainer.onclick = () => { clearPrompt(prompt) };

        while (promptoptions.firstChild) {
            promptoptions.removeChild(promptoptions.firstChild);
        }

        for (let i = 1; i <= 5; i++) {
            if (prompt[`Option.${i}`]) {
                var option = document.createElement("div");
                option.style.display = "flex";
                option.style.justifyContent = "center";
                option.style.alignItems = "center";
                option.style.width = "100%";
                option.style.height = "50px";
                option.style.cursor = 'pointer';
                option.innerHTML = prompt[`Option.${i}`];

                option.onclick = () => respondToPrompt(prompt.FeedbackId, i);

                promptoptions.appendChild(option);
            }
        }


        setTimeout(function () {
            promptcontainer.style.opacity = 1;
        }, 10);
    }, 250);


}


function hidePrompt() {
    var promptcontainer = document.getElementById('promptcontainer');
    promptcontainer.style.opacity = 0;
    setTimeout(function () {
        promptcontainer.style.display = 'none';
    }, 200);
}
function clearPrompt(prompt) {
    jxapi.Command.UserInterface.Message.Prompt.Clear(
        { FeedbackId: prompt.FeedbackId });
    hidePrompt();
}

function showUIXPanel() {
    fpcontainer.style.display = 'block';
    setTimeout(function () {
        fpcontainer.style.opacity = 1;
    }, 10);
}



function showTextinput(textinput) {
    console.log(textinput);
    setTimeout(() => {
        var textinputcontainer = document.getElementById('textinputcontainer');
        var textinputpanel = document.getElementById('textinputpanel');
        var textinputtitle = document.getElementById('textinputtitle');
        var textinputtext = document.getElementById('textinputtext');
        var textinputsubmit = document.getElementById('textinputsubmit');
        var textinputresponse = document.getElementById('textinputresponse');
        var textinputclear = document.getElementById('textinputclear');
        var textinputsubmit = document.getElementById('textinputsubmit');

        
        if (textinput.SubmitText) textinputsubmit.innerHTML = textinput.SubmitText;
        if (textinput.Placeholder) textinputresponse.placeholder = textinput.Placeholder;
        textinputtitle.innerHTML = textinput.Title;
        textinputtext.innerHTML = textinput.Text;
        textinputcontainer.style.display = 'block';
        textinputcontainer.onclick = () => { clearTextinput(textinput) };
        textinputclear.onclick = () => { clearTextinput(textinput) };
        textinputsubmit.onclick = () => {  submitTextinput(textinput, textinputresponse.value)}

        setTimeout(function () {
            textinputcontainer.style.opacity = 1;
        }, 10);
    }, 250);


}


function hideTextinput() {
    var textinputcontainer = document.getElementById('textinputcontainer');
    textinputcontainer.style.opacity = 0;
    setTimeout(function () {
        textinputcontainer.style.display = 'none';
    }, 200);
}
function clearTextinput(textinput) {
    jxapi.Command.UserInterface.Message.TextInput.Clear(
        { FeedbackId: textinput.FeedbackId });
    hideTextinput();
}

function submitTextinput(textinput, text) {
    jxapi.Command.UserInterface.Message.TextInput.Response(
        { FeedbackId: textinput.FeedbackId, Text: text });
        hideTextinput();
}






function showCallScreen() {
    var callpanelerror = document.getElementById('callpanelerror');
    var callpanelnumber = document.getElementById('callpanelnumber');
    callpanelnumber.value = '';
    callpanelerror.style.display = 'none';
    const ds = document.getElementById('default_call');

    ds.onclick = hideCallScreen;
    ds.style.display = 'block'
    setTimeout(() => {
        ds.style.opacity = 1;
    }, 10);
}
function hideCallScreen() {
    const ds = document.getElementById('default_call');
    ds.style.display = 'none'
    setTimeout(() => {
        ds.style.opacity = 0;
    }, 200);
}

function hideUIXPanel() {
    var uixPanel = document.querySelector('.uixpanel');
    if (uixPanel) {
        fpcontainer.removeChild(uixPanel);
    }
    fpcontainer.style.opacity = 0;
    setTimeout(function () {
        fpcontainer.style.display = 'none';
    }, 300);
}

function displayUIXPanel(name, page) {
    var found;
    var defaultTab;
    var uixPanel = document.createElement('div');
    uixPanel.className = 'uixpanel';


    for (const panel of floatingPanels) {
        if (panel.id == name) {
            found = true;
            defaultTab = panel.dataset.defaultOpen;
            uixPanel.appendChild(panel);
        }
    }

    if (found) {
        
        fpcontainer.appendChild(uixPanel);
        
        if (page == '') {
            document.getElementById(defaultTab).click();
        }
        else {
            document.getElementById(name + '_' + page).click();
        }

        

        showUIXPanel();

    }
}

fpcontainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('fpcontainer')) {
        hideUIXPanel();
    }
});


function addIconTextToGrid(text, icon, id, color, page, actionbutton = false) {

    const gridContainer = document.querySelector('.grid-container');
    var newDiv;
    if (actionbutton) {
        newDiv = createIconTextDivForAction(id, text, icon, color);
    }
    else {
        newDiv = createIconTextDivForPanel(id, text, icon, color, page);
    }



    gridContainer.appendChild(newDiv);
}

function loadUiExtensionsPanels(uiext) {
    uipanels = uiext.Extensions.Panel;
    uipanels.sort((p1, p2) => { (p1.Order > p2.Order) ? 1 : -1 });


    for (const panel of uiext.Extensions.Panel) {
        var tabCounter = 0;
        if (panel.Page) {
            if ((panel.Location == 'HomeScreen' || panel.Location == 'HomeScreenAndCallControls') && panel.Visibility == 'Auto') {

                //TODO, SUPPORT FOR HOMESCREEN BUTTONS
                //TODO, SUPPORT CUSTOM ICONS
                var icon = panel.Icon;
                if (panel.Icon == 'Custom') icon = 'Sliders';

                addIconTextToGrid(panel.Name, `icons/${icon}.svg`, panel.PanelId, panel.Color, panel.Page[0].PageId);
                var fpcontent = document.createElement('div');
                fpcontent.id = panel.PanelId;

                // Create tab container
                const tabContainer = document.createElement('div');
                tabContainer.classList.add('tab');
                fpcontent.appendChild(tabContainer);

                
                fpcontent.dataset.defaultOpen = panel.PanelId + '_' + panel.Page[0].PageId;
                for (const page of panel.Page) {

                    const pageId = panel.PanelId + "_tab_" + page.PageId;
                    var tabButton = document.createElement('button');
                    tabButton.classList.add('tablinks');

                    tabButton.id = panel.PanelId + '_' + page.PageId;

                    tabButton.onclick = (event) => { openTab(event, pageId) }

                    tabButton.textContent = page.Name;

                    tabContainer.appendChild(tabButton);


                    const tabContent = document.createElement('div');
                    tabContent.classList.add('tabcontent');
                    tabContent.id = pageId;
                    const tabText = document.createElement('p');
                    tabText.textContent = page.Name;


                    fpcontent.appendChild(tabContent);

                    var fptable = document.createElement('table');
                    fptable.classList.add('uixtable')

                    tabContent.appendChild(fptable);



                    for (const row of page.Row) {
                        var fprow = document.createElement('tr');
                        fptable.appendChild(fprow);

                        var fpcolumnleft = document.createElement('td');
                        fpcolumnleft.style.height = '50px';

                        fpcolumnleft.classList.add('uixpanellr');
                        fpcolumnleft.innerHTML = row.Name;

                        var fpcolumnright = document.createElement('td');
                        fpcolumnright.style.height = '50px';
                        fpcolumnright.classList.add('uixpanelrr');

                        fprow.appendChild(fpcolumnleft);
                        fprow.appendChild(fpcolumnright);
                        if (row.Widget) {
                            for (const widget of row.Widget) {
                                //console.log(widget);
                                var widgetOptions = [];
                                const propertiesValuesPair = widget.Options.split(';');
                                for (const pvp of propertiesValuesPair) {
                                    const propvalue = pvp.split('=');
                                    widgetOptions[propvalue[0]] = propvalue[1];
                                }

                                if (widget.Type == 'Spacer') {
                                    let spacerSize = widget.Options.split('=')[1];
                                    var widgetSpacer = document.createElement('span');
                                    widgetSpacer.classList.add('spacer');
                                    widgetSpacer.style.width = spacerSize * 40 + "px";
                                    fpcolumnright.appendChild(widgetSpacer);
                                }
                                if (widget.Type == 'Button') {
                                    var widgetButton = document.createElement('button');

                                    if (widgetOptions['icon']) {
                                        if (widgetOptions['icon'] == 'red' || widgetOptions['icon'] == 'blue' || widgetOptions['icon'] == 'green' || widgetOptions['icon'] == 'yellow') {
                                            widgetButton.classList.add("round-button");
                                        }
                                        else {
                                            widgetButton.classList.add("round-button-inverted");
                                        }


                                        // Create an image element and set its attributes
                                        const buttonImage = document.createElement("img");
                                        buttonImage.setAttribute("src", 'icons/buttons/' + widgetOptions['icon'] + '.svg');


                                        // Append the image to the button
                                        widgetButton.appendChild(buttonImage);
                                    }
                                    else {
                                        widgetButton.classList.add('cisco-button');
                                        widgetButton.innerHTML = widget.Name;
                                    }

                                    widgetButton.id = widget.WidgetId;

                                    widgetButton.onclick = () => { xapiWidgetClick(widget.WidgetId) };
                                    widgetButton.onmousedown = () => { xapiWidgetPressed(widget.WidgetId) };
                                    widgetButton.onmouseup = () => { xapiWidgetReleased(widget.WidgetId) };
                                    fpcolumnright.appendChild(widgetButton);
                                }
                                else if (widget.Type == 'ToggleButton') {

                                    // create label element
                                    const toggleWidget = document.createElement("label");
                                    toggleWidget.classList.add("toggle-switch");


                                    // create input element
                                    const toggleInput = document.createElement("input");
                                    toggleInput.id = widget.WidgetId;
                                    toggleInput.name = widget.WidgetId;
                                    toggleInput.setAttribute("type", "checkbox");
                                    toggleInput.onclick = () => { xapiToggleChange(widget.WidgetId) };

                                    // create span element
                                    const toggleSpan = document.createElement("span");
                                    toggleSpan.classList.add("slider", "round");

                                    // add input and span to label
                                    toggleWidget.appendChild(toggleInput);
                                    toggleWidget.appendChild(toggleSpan);


                                    fpcolumnright.appendChild(toggleWidget);
                                }
                                else if (widget.Type == 'Slider') {
                                    var slider = document.createElement('input');
                                    slider.type = 'range';
                                    slider.classList.add('cisco-range');
                                    slider.min = 0;
                                    slider.max = 255;
                                    slider.value = 0;
                                    slider.onchange = () => { xapiWidgetChanged(widget.WidgetId, slider.value) }
                                    slider.id = widget.WidgetId;
                                    fpcolumnright.appendChild(slider);
                                }
                                else if (widget.Type == 'Text') {
                                    var text = document.createElement('span');
                                    text.id = widget.WidgetId;
                                    text.innerHTML = '?';
                                    fpcolumnright.appendChild(text);
                                }
                                else if (widget.Type == 'GroupButton') {
                                    // Create the button group container element

                                    const buttonGroup = document.createElement('div');
                                    buttonGroup.className = 'button-group';
                                    buttonGroup.id = widget.WidgetId;

                                    for (const btnunit of widget.ValueSpace.Value) {
                                        const btn = document.createElement('button');
                                        btn.className = 'buttonunit active';
                                        btn.id = widget.WidgetId + "?" + btnunit.Key;
                                        btn.textContent = btnunit.Name;
                                        btn.setAttribute("tag", "groupbuttonunit");
                                        btn.onmousedown = () => { xapiGroupButtonPressed(widget.WidgetId, btnunit.Key) };
                                        btn.onmouseup = () => { xapiGroupButtonReleased(widget.WidgetId, btnunit.Key) };

                                        buttonGroup.appendChild(btn);
                                    }
                                    fpcolumnright.appendChild(buttonGroup);

                                }
                                else if (widget.Type == 'Spinner') {
                                    const spinnerDiv = document.createElement("div");
                                    spinnerDiv.classList.add("spinner");

                                    const spinnerUpButton = document.createElement("button");
                                    spinnerUpButton.classList.add("spinner-btn", "spinner-right");
                                    spinnerUpButton.onclick = () => { xapiSpinnerClick(widget.WidgetId, 'increment') }
                                    spinnerUpButton.onmousedown = () => { xapiSpinnerPress(widget.WidgetId, 'increment') }
                                    spinnerUpButton.onmouseup = () => { xapiSpinnerRelease(widget.WidgetId, 'increment') }

                                    const spinnerUpImg = document.createElement("img");
                                    spinnerUpImg.setAttribute("src", "icons/buttons/arrow_down.svg");

                                    spinnerUpButton.appendChild(spinnerUpImg);
                                    spinnerDiv.appendChild(spinnerUpButton);

                                    const spinnerValueSpan = document.createElement("span");
                                    spinnerValueSpan.classList.add("spinner-value");
                                    spinnerValueSpan.id = widget.WidgetId;
                                    spinnerValueSpan.innerText = " ";

                                    spinnerDiv.appendChild(spinnerValueSpan);

                                    const spinnerDownButton = document.createElement("button");
                                    spinnerDownButton.classList.add("spinner-btn", "spinner-left");
                                    spinnerDownButton.onclick = () => { xapiSpinnerClick(widget.WidgetId, 'decrement') }
                                    spinnerDownButton.onmousedown = () => { xapiSpinnerPress(widget.WidgetId, 'decrement') }
                                    spinnerDownButton.onmouseup = () => { xapiSpinnerRelease(widget.WidgetId, 'decrement') }

                                    const spinnerDownImg = document.createElement("img");
                                    spinnerDownImg.setAttribute("src", "icons/buttons/arrow_up.svg");

                                    spinnerDownButton.appendChild(spinnerDownImg);
                                    spinnerDiv.appendChild(spinnerDownButton);


                                    fpcolumnright.appendChild(spinnerDiv);

                                }

                            }
                        }

                    }

                }

                floatingPanels.push(fpcontent);
                document.getElementById('invisidiv').appendChild(fpcontent);


                /* Handle the button groups */
                const buttonGroups = document.querySelectorAll('.button-group');
                buttonGroups.forEach(buttonGroup => {
                    const buttons = buttonGroup.querySelectorAll('.buttonunit');
                    buttons.forEach(button => {
                        button.addEventListener('click', () => {
                            buttons.forEach(otherButton => {
                                otherButton.classList.remove('active');
                            });
                            button.classList.add('active');
                        });
                    });
                });
            }
        }
        else {
            addIconTextToGrid(panel.Name, `icons/${icon}.svg`, panel.PanelId, panel.Color, true);
        }
    }

}

function setValue(id, value, widget) {

    if (id != null) {
        var element = document.getElementById(id);

        if (element != null) {

            if (element.nodeName == 'BUTTON') {
            }
            else if (element.type == 'checkbox') {
                element.checked = value == 'on' ? true : false;
            }
            else if (element.type == 'range') {
                element.value = value;
            }
            else if (element.nodeName == 'SPAN') {
                if (value == '') {
                    element.innerHTML = widget.WidgetId;
                }
                else {
                    element.innerHTML = value;
                }
            }
            else if (element.classList.contains('button-group')) {
                for (const child of element.childNodes) {
                    if (child.id.split('?')[1] == value) {
                        child.click();
                    }
                }
            }

        }
    }
}

function syncWidgetsValues(widgets) {
    for (const widget of widgets) {
        //console.log(widget);
        setValue(widget.WidgetId, widget.Value, widget);
    }
}
function xapiWidgetClick(widgetid) {
    jxapi.Command.UserInterface.Extensions.Widget.Action({ Type: 'clicked', Value: '', WidgetId: widgetid });
}
function xapiGroupButtonPressed(widgetid, value) {
    jxapi.Command.UserInterface.Extensions.Widget.Action({ Type: 'pressed', Value: value, WidgetId: widgetid });
}
function xapiGroupButtonReleased(widgetid, value) {
    jxapi.Command.UserInterface.Extensions.Widget.Action({ Type: 'released', Value: value, WidgetId: widgetid });
}
function xapiWidgetPressed(widgetid) {
    jxapi.Command.UserInterface.Extensions.Widget.Action({ Type: 'pressed', Value: '', WidgetId: widgetid });
}
function xapiWidgetReleased(widgetid) {
    jxapi.Command.UserInterface.Extensions.Widget.Action({ Type: 'released', Value: '', WidgetId: widgetid });
}
function xapiWidgetChanged(widgetid, value) {
    jxapi.Command.UserInterface.Extensions.Widget.Action({ Type: 'changed', Value: value, WidgetId: widgetid });
}
function xapiToggleChange(toggle) {
    var element = document.getElementById(toggle);

    var value = element.checked ? 'on' : 'off';
    jxapi.Command.UserInterface.Extensions.Widget.Action({ Type: 'changed', Value: value, WidgetId: toggle });
}
function xapiSpinnerPress(widgetid, value) {
    jxapi.Command.UserInterface.Extensions.Widget.Action({ Type: 'pressed', value: value, WidgetId: widgetid });
}
function xapiSpinnerRelease(widgetid, value) {
    jxapi.Command.UserInterface.Extensions.Widget.Action({ Type: 'released', value: value, WidgetId: widgetid });
}
function xapiSpinnerClick(widgetid, value) {
    jxapi.Command.UserInterface.Extensions.Widget.Action({ Type: 'clicked', value: value, WidgetId: widgetid });
}
function xapiPanelClick(widgetid) {
    jxapi.Command.UserInterface.Extensions.Panel.Clicked({ PanelId: widgetid });
}
function setLed(value) {
    var led = document.getElementById("led");
    led.style.backgroundColor = value ? 'white' : 'black';
}

function setSystemName(name) {
    document.getElementById('systemname').innerHTML = name;
}
function showVolumePopup() {
    const volumepopup = document.getElementById("volumepopup");
    volumepopup.style.display = "block";
    volumepopup.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 100,
        fill: "forwards",
    });
}

function hideVolumePopup() {
    const volumepopup = document.getElementById("volumepopup");
    volumepopup.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 100,
        fill: "forwards",
    }).onfinish = function () {
        volumepopup.style.display = "none";
    };
}

function showErrorPopup(errortext) {
    const errorpopup = document.getElementById("errorpopup");
    const errorpopuptext = document.getElementById('errorpopuptext');
    errorpopuptext.innerHTML = errortext;
    errorpopup.style.display = "block";
    errorpopup.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 100,
        fill: "forwards",
    });
    setTimeout(() => {
        hideErrorPopup();
    }, 5000);
}

function hideErrorPopup() {
    const errorpopup = document.getElementById("errorpopup");
    errorpopup.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 100,
        fill: "forwards",
    }).onfinish = function () {
        errorpopup.style.display = "none";
    };
}

async function handleVolume() {
    var allVolLevels = document.querySelectorAll(".vol_level");

    for (const vol_level of allVolLevels) {
        var vol_level_sliderr = document.getElementById('vol_level_slider');
        var vol = await jxapi.Status.Audio.Volume.get();
        vol_level.innerHTML = vol;
        vol_level_sliderr.value = vol;
    }

    jxapi.Status.Audio.Volume.on(async vol => {
        var allVolLevels = document.querySelectorAll(".vol_level");
        for (const vol_level of allVolLevels) {
            var vol_level_sliderr = document.getElementById('vol_level_slider');
            var vol = await jxapi.Status.Audio.Volume.get();
            vol_level.innerHTML = vol;
            vol_level_sliderr.value = vol;
        }
        vol_level.innerHTML = vol;
        vol_level_sliderr.value = vol;
        popupVolume();
    });

}

async function handleMute() {
    var smallMuteImg = document.getElementById('mic_mutetoggle_img');
    currentMuteStatus = await jxapi.Status.Audio.Microphones.Mute.get();
    if (currentMuteStatus == 'Off') {
        smallMuteImg.src = 'icons/buttons/mic.svg';
    }
    else {
        smallMuteImg.src = 'icons/buttons/mic_muted.svg';
    }


    jxapi.Status.Audio.Microphones.Mute.on(value => {
        currentMuteStatus = value;
        if (currentMuteStatus == 'Off') {
            smallMuteImg.src = 'icons/buttons/mic.svg';
        }
        else {
            smallMuteImg.src = 'icons/buttons/mic_muted.svg';
        }
    });

}

async function handlePrompts() {
    jxapi.Event.UserInterface.Message.Prompt.Display.on(prompt => {
        showPrompt(prompt);
        if (prompt.Duration != 0) {
            setTimeout(hidePrompt, prompt.Duration * 1000);
        }
    });

}

async function handleTextinputs() {
    jxapi.Event.UserInterface.Message.TextInput.Display.on(textinput => {
        showTextinput(textinput);
    });
}

async function handlePanelEvents() {
    jxapi.Event.UserInterface.Extensions.Panel.Open.on(event => {
        hidePrompt();
        displayUIXPanel(event.PanelId, event.PageId);
    });
}

function volumeIncrease() {
    jxapi.Command.Audio.Volume.Increase({ Steps: 5 });
}
function volumeDecrease() {
    jxapi.Command.Audio.Volume.Decrease({ Steps: 5 });
}

function micMute() {
    jxapi.Command.Audio.Microphones.Mute();
}
function micUnmute() {
    jxapi.Command.Audio.Microphones.Unmute();
}
function toggleMute() {
    jxapi.Command.Audio.Microphones.ToggleMute();
}

function popupVolume() {
    if (popupVolumeTimeout == undefined) {
        showVolumePopup();
    }

    popupVolumeTimeout = setTimeout(() => {
        hideVolumePopup()
        clearTimeout(popupVolumeTimeout);
        popupVolumeTimeout = undefined;
    }, 3000);
}

function createDefaultButtons() {
    const gridContainer = document.querySelector('.grid-container');

    const defaultButtons = [
        {
            id: 'default_button_call',
            color: '#151515',
            icon: 'icons/Camera.svg',
            text: 'Call',
            onclick: showCallScreen
        }
    ];

    for (const button of defaultButtons) {
        const div = document.createElement('div');
        div.id = button.id;
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.justifyContent = 'flex-start';
        div.style.alignItems = 'center';
        div.style.height = '160px';

        const circle = document.createElement('div');
        circle.style.width = '80px';
        circle.style.height = '80px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = button.color;
        div.appendChild(circle);

        const iconElement = document.createElement('img');
        iconElement.src = button.icon;
        iconElement.width = 50;
        iconElement.height = 50;
        iconElement.style.position = 'relative';
        iconElement.style.top = '50%';
        iconElement.style.left = '50%';
        iconElement.style.transform = 'translate(-47%, -45%)';
        circle.appendChild(iconElement);

        const textElement = document.createElement('p');
        textElement.innerText = button.text;
        textElement.style.marginTop = '5px'; // Add some top margin to the text
        textElement.style.textAlign = 'center'; // Center the text
        div.appendChild(textElement);

        div.onclick = button.onclick;

        gridContainer.appendChild(div);
    }
}

function createDefaultIncallButtons() {
    const incallButtonsRow1 = document.getElementById('incalliconsrow1');

    const defaultButtons = [
        {
            id: 'default_button_call',
            color: 'red',
            icon: 'icons/buttons/end.svg',
            inverticon: true,
            text: 'End call',
            textcolor: 'white',
            onclick: () => { console.log('LOL') }
        }
    ];

    for (const button of defaultButtons) {
        const div = document.createElement('div');
        div.id = button.id;
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.justifyContent = 'flex-start';
        div.style.alignItems = 'center';
        div.style.height = '160px';

        const circle = document.createElement('div');
        circle.style.width = '80px';
        circle.style.height = '80px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = button.color;
        div.appendChild(circle);

        const iconElement = document.createElement('img');
        iconElement.src = button.icon;
        iconElement.width = 50;
        iconElement.height = 50;
        iconElement.style.position = 'relative';
        iconElement.style.top = '50%';
        iconElement.style.left = '50%';
        iconElement.style.transform = 'translate(-47%, -45%)';
        iconElement.style.filter = button.inverticon ? 'invert(100%)' : '';
        circle.appendChild(iconElement);

        const textElement = document.createElement('p');
        textElement.innerText = button.text;
        textElement.style.marginTop = '5px'; // Add some top margin to the text
        textElement.style.textAlign = 'center'; // Center the text
        textElement.style.color = button.textcolor;
        div.appendChild(textElement);

        div.onclick = disconnectCall;

        incallButtonsRow1.appendChild(div);
    }

}

async function watchStandby(xapi) {
    let csb = await xapi.Status.Standby.State.get({ Steps: 5 });
    if (csb == 'Standby') {
        setLed(true);
        hideHalfwakeScreen();
        showStandbyScreen();
    }
    else if (csb == 'Halfwake') {
        setLed(false);
        hideStandbyScreen();
        showHalfwakeScreen();
    }
    else {
        setLed(false);
        hideStandbyScreen();
        hideHalfwakeScreen();
    }

    xapi.Status.Standby.State.on(csb => {
        if (csb == 'Standby') {
            setLed(true);
            hideHalfwakeScreen();
            showStandbyScreen();
        }
        else if (csb == 'Halfwake') {
            setLed(false);
            hideStandbyScreen();
            showHalfwakeScreen();
        }
        else {
            setLed(false);
            hideStandbyScreen();
            hideHalfwakeScreen();
        }
    });
}

function addStopPropagation(panel) {
    const callPanel = document.getElementById(panel);
    callPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function dial() {
    var callnumber = document.getElementById('callpanelnumber');
    var callpanelerror = document.getElementById('callpanelerror');

    if (callnumber.value != '') {
        callpanelerror.style.display = 'none';
        hideCallScreen();
        showCallingScreen(callnumber.value);
        jxapi.Command.Dial(
            {
                Number: callnumber.value
            });
    }
    else {
        callpanelerror.style.display = 'block'
        callpanelerror.innerHTML = 'Please enter number or address'
    }
}
function disconnectCall() {
    jxapi.Command.Call.Disconnect();
}


jxapi = jsxapi
    .connect(config.CODEC_IP, {
        username: config.CODEC_USERNAME,
        password: config.CODEC_PASSWORD
    })
    .on('error', console.error)
    .on('ready', async (xapi) => {

        watchStandby(xapi);

        var systemname = await xapi.Config.SystemUnit.Name.get();
        setSystemName(systemname);

        /* Handle volume */
        handleVolume();

        /* Handle mute */
        handleMute();

        /* Handle call connect and disconnect */
        handleCallDisconnect();
        handleCallSuccessful();

        /* Handle prompts */
        handlePrompts();

        /* Handle textinputs */
        handleTextinputs();

        /* Create default buttons */
        createDefaultButtons();

        /* Create default in call buttons */
        createDefaultIncallButtons();

        /* Handle panel events */
        handlePanelEvents();


        /* Stop propagation on panels */
        addStopPropagation('call_panel');
        addStopPropagation('promptpanel');
        addStopPropagation('textinputpanel');


        /* Get current UI elements and render HTML */
        var uiext = await xapi.Command.UserInterface.Extensions.List({});
        loadUiExtensionsPanels(uiext);

        /* Get current UI element values and update value for each UI element */
        var currValues = await xapi.Status.UserInterface.Extensions.Widget.get();
        syncWidgetsValues(currValues);


        /* Make sure that any screens are hidden */
        hideIncallScreen();
        hideCallScreen();
        hideHalfwakeScreen();
        hideStandbyScreen();

        /* handle spinners ? */
        xapi.Status.UserInterface.Extensions.Widget.on(value => {
            xapi.Status.UserInterface.Extensions.Widget.get().then(w => {

                var index = parseInt(value.id);
                var wid = w[index - 1];

                setValue(wid.WidgetId, wid.Value, wid);
            });
        });


        xapi.Event.UserInterface.Extensions.Widget.Action.on(async action => {
            //console.log(action);
            try {
                let element = document.getElementById(action.WidgetId);
                //console.log(element);
                if (element.type == 'checkbox') {
                    element.checked = action.Value == 'on' ? true : false;
                }
                else if (element.type == 'range') {
                    element.value = action.Value;
                }
                else if (element.classList.contains('button-group')) {
                    for (const child of element.childNodes) {
                        if (child.id.split('?')[1] == action.Value) {
                            child.click();
                        }
                    }
                }

            }
            catch { }


        });


    });


setLed(false);
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


function createIconTextDivForPanel(id, text, icon, color) {
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
        displayUIXPanel(id);
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

function showUIXPanel() {
    fpcontainer.style.display = 'block';
    setTimeout(function () {
        fpcontainer.style.opacity = 1;
    }, 10);
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

function displayUIXPanel(name) {

    var uixPanel = document.createElement('div');
    uixPanel.className = 'uixpanel';


    for (const panel of floatingPanels) {
        if (panel.id == name) {
            uixPanel.appendChild(panel);
        }
    }

    fpcontainer.appendChild(uixPanel);
    document.getElementById("defaultOpen").click();
    showUIXPanel();
}

fpcontainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('fpcontainer')) {
        hideUIXPanel();
    }
});


function addIconTextToGrid(text, icon, id, color, actionbutton = false) {

    const gridContainer = document.querySelector('.grid-container');
    var newDiv;
    if (actionbutton) {
        newDiv = createIconTextDivForAction(id, text, icon, color);
    }
    else {
        newDiv = createIconTextDivForPanel(id, text, icon, color);
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

                addIconTextToGrid(panel.Name, `icons/${icon}.svg`, panel.PanelId, panel.Color);
                var fpcontent = document.createElement('div');
                fpcontent.id = panel.PanelId;

                // Create tab container
                const tabContainer = document.createElement('div');
                tabContainer.classList.add('tab');
                fpcontent.appendChild(tabContainer);

                var firstPage = true;
                for (const page of panel.Page) {
                    const pageId = panel.PanelId + "_tab_" + page.id;
                    var tabButton = document.createElement('button');
                    tabButton.classList.add('tablinks');
                    if (firstPage) tabButton.id = 'defaultOpen';
                    tabButton.onclick = () => { openTab(event, pageId) }

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
async function handleVolume() {
    var vol_level = document.getElementById('vol_level');
    var vol_level_sliderr = document.getElementById('vol_level_slider');
    var vol = await jxapi.Status.Audio.Volume.get();
    vol_level.innerHTML = vol;
    vol_level_sliderr.value = vol;

    jxapi.Status.Audio.Volume.on(vol => {
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
    },3000);
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

        /* Get current UI elements and render HTML */
        var uiext = await xapi.Command.UserInterface.Extensions.List({});
        loadUiExtensionsPanels(uiext);

        /* Get current UI element values and update value for each UI element */
        var currValues = await xapi.Status.UserInterface.Extensions.Widget.get();
        syncWidgetsValues(currValues);


        /* handle spinners ? */
        xapi.Status.UserInterface.Extensions.Widget
            .on(value => {
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
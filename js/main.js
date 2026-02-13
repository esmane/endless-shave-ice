// global puzzle settings
var GRID_SIZE_W = 1;    // also, the number of colors
var GRID_SIZE_H = 3;    // also, the number of shapes
var DIFFICULTY = 1;     // 0 for jr, 1 for sr, 2 for master

// global interface settings
var globalIsDarkBackground = false;
var globalIsAutosaveSettings = false;

// these are for the buttons
var globalSelectedColor = '0';
var globalSelectedShape = '0';
var globalSelectedDelete = false;

// the grid
var globalPlayerGrid;
var globalSolution;
var globalClues = [];
var globalScaleFactor = 1;


// main init function. runs on startup and is responsible for loading the settings and generating the first puzzle.
window.onload = function()
{
    globalScaleFactor = determineScale();
    // setup the default grid and button sizes
    setupGridHTML(false, globalScaleFactor);
    setupButtonsHTML(globalScaleFactor);


    // now let's attempt to load the previous settings using cookies
    // difficulty
    var c = getCookie("difficulty");
    switch(c)
    {
        case '0':
            document.getElementById("difficulty-jr").checked = true;
            DIFFICULTY = 0;
            break;

        case '2':
            document.getElementById("difficulty-mst").checked = true;
            DIFFICULTY = 2;
            break;

        // default to senior
        default:
            document.getElementById("difficulty-sr").checked = true;
            DIFFICULTY = 1;
            break;
    }

    // width and height
    c = getCookie("width");
    if(Number(c) >= 2 && Number(c) <= 5)
    {
        document.getElementById("size-w").value = Number(c);
    }
    else
    {
        document.getElementById("size-w").value = 3;
    }

    // dark mode
    c = getCookie("dark-mode");
    globalIsDarkBackground = false;
    // if (we prefer dark and have no cookie set) or have cookie set to dark, make dark
    if((window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches && c === "") || c === "true")
    {
        document.getElementById("dark-background-option").checked = true;
        setBackground();
    }
    else
    {
        document.getElementById("dark-background-option").checked = false;
    }
    
    
    c = getCookie("autosave-settings");
    if(c === "true")
    {
        globalIsAutosaveSettings = true;
        document.getElementById("autosave-settings-option").checked = true;
    }
    else
    {
        document.getElementById("autosave-settings-option").checked = false;
    }


    // if that fails, we generate a new puzzle
    clearPlayerGrid();
    generatePuzzle();
    
    // this is how we detect an unload on mobile browsers
    // we save on unload
    document.addEventListener('visibilitychange', function()
    {
        if(document.visibilityState === 'hidden')
        {
            saveEverything();
        }
    });
};


// save on unload
document.onbeforeunload = function()
{
    saveEverything();
};


// this is called when you click the modal
function modalAction(name, generate)
{
    document.getElementById(name).style.display = "none";
    if(generate !== undefined)
    {
        generatePuzzle();
    }
}


// scale grid when window is resized
// there are probably better ways to do this but this is simple enough
var scaleTimeout;
window.onresize = function()
{
    clearTimeout(scaleTimeout);
    scaleTimeout = setTimeout(function()
        {
            globalScaleFactor = determineScale();
            setupButtonsHTML(globalScaleFactor);
            setupGridHTML(true, globalScaleFactor);
        }, 250);
};


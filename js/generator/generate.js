// main puzzle generation function
// here's basically how it works:
// we have a two step loop that repeats until the puzzle is generated
// the first step randomly generates clues
// the second step tries to solve the puzzle, and fills in the solution grid
// we repeat these two steps until the puzzle has been solved and the full solution grid has been filled in

function generatePuzzle()
{
    // first, let's see what the grid width and height are
    // not a typo, width and height are reversed for some reason
    GRID_SIZE_H = Math.round(document.getElementById("size-w").value);

    if(GRID_SIZE_H < 2)
    {
        GRID_SIZE_H = 2;
        document.getElementById("size-w").value = 2;
    }
    else if(GRID_SIZE_H > 5)
    {
        GRID_SIZE_H = 5;
        document.getElementById("size-w").value = 5;
    }


    // first step, make sure the grid size hasn't been changed before generating the puzzle
    if(GRID_SIZE_W !== globalPlayerGrid.length || GRID_SIZE_H !== globalPlayerGrid[0].length)
    {
        setupGridHTML(false, globalScaleFactor);
        setupButtonsHTML(globalScaleFactor);
    }
    clearPlayerGrid();

    var allFlavors = [];
    for(let i = 0; i < GRID_SIZE_H; i++)
    {
        for(let j = 0; j < GRID_SIZE_H; j++)
        {
            allFlavors[i + (j * GRID_SIZE_H)] = i + "-" + j;
        }
    }
    
    globalSolution = [];
    for(let i = 0; i < GRID_SIZE_H; i++)
    {
        let flavor = 0;
        let rand_index = 0;
        
        do
        {
            rand_index = getRandomInt(0, GRID_SIZE_H * GRID_SIZE_H)
            flavor = allFlavors[rand_index];
        } while (flavor === 0);
        
        allFlavors[rand_index] = 0;
        globalSolution[i] = flavor;
    }
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}


function guessFlavor()
{
    var guessed_correctly = 0;
    var guessed_flavors = [];
    for(let i = 0; i < globalPlayerGrid.length; i++)
    {
        for(let j = 0; j < globalPlayerGrid[i].length; j++)
        {
            for(let k = 0; k < globalSolution.length; k++)
            {
                if(globalPlayerGrid[i][j] === globalSolution[k])
                {
                    let already_guessed = false;
                    for(let l = 0; l < guessed_flavors.length; l++)
                    {
                        if(globalSolution[k] === guessed_flavors[l])
                        {
                            already_guessed = true;
                            break;
                        }
                    }
                    if(!already_guessed)
                    {
                        guessed_flavors[guessed_correctly] = globalSolution[k];
                        guessed_correctly++;
                    }
                }
            }
        }
    }
    
    if(guessed_correctly === globalSolution.length)
    {
        document.getElementById("modal-display-win").style.display = "block";
    }
    else
    {
        switch(guessed_correctly)
        {
        case 0:
            document.getElementById("modal-display-none").style.display = "block";
            break;
        case 1:
            document.getElementById("modal-display-one").style.display = "block";
            break;
        case 2:
            document.getElementById("modal-display-two").style.display = "block";
            break;
        case 3:
            document.getElementById("modal-display-three").style.display = "block";
            break;
        case 4:
            document.getElementById("modal-display-four").style.display = "block";
            break;
        }
    }
}

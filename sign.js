// sign.js
// This script enables you to click the sign button of xiami.com automatically via PhantomJS.

// Debug Flags
var flags = false;
window.console.debugLog = function(message){
    if(flags){
        console.log(message);
    }
}

// Read config file

var fs = require('fs'),
    system = require('system');
var args = system.args;
var pathToConfig = 'config.json';
if (args.length === 2){
    pathToConfig = args[1];
}
if(args.length === 3){
    pathToConfig = args[2];
    if(args[1] === '-v'){
        flags = true;
    }
}
try{
    var configFile = fs.open(pathToConfig, 'r');
}
catch(err){
    console.log(err);
    console.log("Try to load 'config.json'.");
    try{
        var configFile = fs.open('config.json', 'r');
    }
    catch(err){
        console.log(err);
        console.log("No config found. Exiting PhantomJS.")
        phantom.exit();
    }
}


// Initialization

var configObj = JSON.parse(configFile.read());
var config = configObj.config;
var routineList = configObj.routine_list;

// console.debugLog(JSON.stringify(config))
// console.debugLog(JSON.stringify(routineList))

// Setup PhantomJS

var webPage = require('webpage')
var page = webPage.create();

page.settings.userAgent = config.user_agent;

// Routine execute

function doAction(routineCount, actionCount, jumped){

    console.log("Executing routine " + (routineCount + 1) + " action " + (actionCount + 1) + " ...");

    if(routineList[routineCount].actions[actionCount].skip === false){  // If the action is not to skip
        
        // 1st action hack

        if(actionCount === 0){  // If the action is the first action of the routine
            if(routineList[routineCount].skip === true){    // If the routine is to be skipped

                console.log("Skipping current routine due to config...");
                // Skip the routine

                if(routineCount < routineList.length - 1){  // If current routine is not the last routine
                    routineCount = routineCount + 1;

                }
                else{   // If current routine is the last routine
                    phantom.exit();  // Safely exit PhantomJS
                }            
            }
            else{   // If the routine is not to be skipped, load the init_url of the routine and run the action when finished loading.

                if(jumped === false){   // If the page of the action has not been loaded

                    console.log("Encountered 1st action of current routine. Start loading init_url...")

                    if(routineCount > 0){   // If current routine is not the first routine
                        page.close();   // Then page should be closed first for next open.
                    }
                    page.open(routineList[routineCount].init_url, function(status){  // Load the page
                        console.log('Init_url load status: ' + status);
                        if(status !== 'success'){
                            console.log('Unable to open destination page. Routine aborted.');
                        }
                        else{
                            console.log("Successfully opened destinaton page. Now try to execute actions.");
                            delay = Math.floor(Math.random() * routineList[routineCount].delay_execute_range);
                            console.debugLog("Delay: " + delay);
                            setTimeout(function(){doAction(routineCount, actionCount, true)}, delay);  // When the page is loaded, use jump = true to tell that the page has been loaded, just go ahead for the action
                        }
                    });
                    return;
                }
            }

        }


        // Execute the action

        var action = routineList[routineCount].actions[actionCount];
        page.evaluate(function(action){
            // Action Code

            if(action.identifier_type === 'id'){
                var element = document.getElementById(action.identifier);
            }
            if(action.identifier_type === 'class'){
                var element = document.getElementsByClassName(action.identifier)[0 + action.offset];
            }
            if(action.type === 'fill'){
                element.value = action.fill_content;
            } 
            if(action.type === 'click'){
                element.click();
            }
        
        }, action);
        if(flags){
            page.render("snap.png");
        }
        


    }
    else{
        console.log("Routine " + (routineCount+1) + " action " + (actionCount + 1) + " aborted due to settings.")
    }


    // Move the list pointers / Stepping

    var routineCountNext, actionCountNext;

    if(actionCount < routineList[routineCount].actions.length - 1){ // If current action is not the last action of current routine
        actionCountNext = actionCount + 1;
        routineCountNext = routineCount;
    }
    else{   // If current action is the last action of current routine
        if(routineCount < routineList.length - 1){  // If current routine is not the last routine
            routineCountNext = routineCount + 1;    // routineCount move on
            actionCountNext = 0;    // Reset actionCount

            setTimeout(function(){  // Why setTimeout: the last action is very likely to trigger AJAX / page jump.
                doAction(routineCountNext, actionCountNext, false)  // So there must be time for them
            },1000);

            return;

        }
        else{   // If current routine is the last routine
            console.log("All routes finished. PhantomJS will exit after" + config.wait_timeout + " ms.")

            // When all actions are done, setTimeOut() to give AJAX some time, then preform exit tasks
            setTimeout(function(){

                // Exit tasks
                fs.write('cookies.txt', JSON.stringify(phantom.cookies), 'w');  // Write cookies to file
                if(flags){
                    page.render("exit.png");    //Render a final image of the page
                }
                // When exit tasks are done, safely exit PhantomJS
                phantom.exit();
            }, config.wait_timeout);
            return;
            
        }
    }

    // Triggers next action execution

    if(routineList[routineCount].actions[actionCount].triggers_jump === true && routineList[routineCount].actions[actionCount].skip === false){
        console.debugLog("Encountered action that will cause page jump.");
        page.onLoadFinished = function(status){
            console.debugLog('Jump status:' + status);
            if(flags){
                page.render("action" + actionCount + ".png");
            }        
            page.onLoadFinished = undefined;    // Clean up event binding for next binding
            doAction(routineCountNext, actionCountNext, false);
        }
        console.debugLog("OnLoadFinished event handler set.");
    }
    else{
        doAction(routineCountNext, actionCountNext, false);
    }

}

doAction(0, 0, false);  // Triggers execution loop
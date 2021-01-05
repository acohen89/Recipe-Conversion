console.log("Recipe Chrome Extension Loaded");
let cupToGrams  = {"AP Flour": 130.0, "Bread Flour": 135.0, "Flour": 130.0, "WW Flour": 128.0, "Rye Flour": 102.0, "Water": 240.0, "Sugar": 200.0, "Raw Sugar": 250.0, "Brown Sugar": 220.0,
"Confectioners Sugar": 125.0, "Milk": 242.0, "Cocoa Powder": 85.0, "Oil": 242.0, "Chocolate Chunks": 140.0, "Chocolate Chips": 170.0, "Nuts": 110.0, "Raisins": 155.0, "Oats": 105.0, "Heavy Cream": 225.0, "Buttermilk": 225.0, "Yogurt": 225.0, "Sour Cream": 225.0, "Peanut Butter": 250, "Rice": 200.0, "Light Corn Syrup": 328.0, "Dark Corn Syrup": 328.0, "Corn Syrup": 328.0
 }
let metricDict = {"Tsp": "Teaspoon", "tsp": "Teaspoon", "TSP": "Teaspoon", "teaspoon": "Teaspoon", "Teaspoon": "Teaspoon", "TeaSpoon": "Teaspoon", "TSPs": "Teaspoon", "Tsps": "Teaspoon", "Teaspoons": "Teaspoon", "teaspoons": "Teaspoon", "Teaspoons": "Teaspoon",
"Tbs": "Tablespoon", "tbs": "Tablespoon", "TBSP": "Tablespoon", "Tbsp": "Tablespoon", "TBS": "Tablespoon", "tablespoon": "Tablespoon", "Tablespoon": "Tablespoon", "TableSpoon": "Tablespoon", "TBSs": "Tablespoon", "Tbss": "Tablespoon", "Tablespoon": "Tablespoon", "tablespoons": "Tablespoon", "Tablespoons": "Tablespoon", 

"Cups": "Cup", "cups": "Cup", "Cup": "Cup", "cup": "Cup", "CUPS": "Cup", "CUP": "Cup", "c": "Cup", "C": "Cup", "cs": "Cup", "Cs": "Cup", "CS": "Cup"}
let possibleNums = {"1/2": 0.5, "1/3": 0.333, "1/4": 0.25, "1/8": 0.125, "2/3": 0.666, "3/4": 0.75, "3/8": 0.375, "5/8": 0.625, "7/8": 0.875}
let teaspoonToGrams = {"Salt": 5.0, "Yeast": 3.1,}
let tablespoonToGrams = {"Butter": 14.1, "Honey": 21.25, "Cornstarch": 9.375, "Maple Syrup": 20.0}
function cupToTeaspoon(measurement){return 48.0 * measurement;}
function cupToTablespoon(measurement){ return 16 * measurement;}
function tablespoonToCup(measurement){return 0.0625 * measurement;}
function tablespoonToTeaspoon(measurement){return 3 * measurement;}
function teaspoonToTablespoon(measurement){return 0.333 * measurement;}
function teaspoonToCup(measurement){return 0.0208333 * measurement;}
let element = Array.prototype.slice.call(document.querySelectorAll("li"));

for (let i  = 0; i < element.length; i++) {
    // console.log(element[i].textContent);  
    let ingredient = ingredientSearch(element[i].textContent);
    if(dictNotNull(ingredient)) {
       // console.log(element[i].textContent);  
       let ogNumandMetric = findNumandMetric(element[i].textContent); 
       if(ogNumandMetric["Num"] != "NULL" && ogNumandMetric["Metric"] != "NULL"){
        // element[i].textContent = element[i].textContent.replace(ingredient["Item"], "REPLACED!");
        console.log(ingredient["Item"]);
        console.log(ogNumandMetric);
        element[i].textContent = replacement(element[i].textContent, ingredient, ogNumandMetric);
        // element[i].textContent = element[i].textContent.replace(ingredient["Item"].toLowerCase(), "REPLACED!"); // Replaces lowercase words  
       }
    }
    // console.log(element[i].textContent);
    //let tempArr = element[i].textContent.split(" ");
    // console.log(tempArr);
}

function replacement(ogText, ingredientDict, numandMetric){
    let ogTextArr = ogText.split(" ");
    let replacementText = ""; 
    let ogMetric = numandMetric["Metric"];
    let weight = "NULL";
    let reqMetric = findReqMetric(ingredientDict["Item"]);
    if(reqMetric != ogMetric){
        num = convertMetrics(reqMetric, ogMetric, numandMetric["Num"]);
    }
    if(reqMetric == "Cup"){
        if(!(ingredientDict["Item"] in cupToGrams)){console.log("Error!");}
        weight = numandMetric["Num"] * cupToGrams[ingredientDict["Item"]];
    } else if(reqMetric == "Tablespoon") {
        if(!(ingredientDict["Item"] in tablespoonToGrams)){console.log("Error!");}
        weight = numandMetric["Num"] * tablespoonToGrams[ingredientDict["Item"]];
    } else if (reqMetric == "Teaspoon"){
        if(!(ingredientDict["Item"] in teaspoonToGrams)){console.log("Error!");}
        weight = numandMetric["Num"] * teaspoonToGrams[ingredientDict["Item"]];
    } else {console.log("Error: Req metric wrong");}
    replacementText = ogText.replace(numandMetric["OGNum"], weight + "g");
    if(numandMetric["TwoNums"] == true){
        if(numandMetric["TwoNums"] == "NULL") {console.log("Error: TwoNums = NUll");}
        let temp = replacementText.replace(numandMetric["SecondOGNum"], "");
        replacementText = temp; 
    }
    // TODO: find metric in orginal format and replace it with that 
    // removes metric
    return replacementText.replace(numandMetric["ogFormatMetric"], "");
}
function convertMetrics(metric, ogMetric, num){
    if(metric == "Teaspoon"){
        if(ogMetric == "Teaspoon"){
            return "NULL";
        }else if (ogMetric == "Tablespoon"){
            return teaspoonToTablespoon(num);
        }else if(ogMetric == "Cup") {
            return teaspoonToCup(num);
        }
    }else if (metric == "Tablespoon"){
        if(ogMetric == "Teaspoon"){
            return tablespoonToTeaspoon(num);
        }else if (ogMetric == "Tablespoon"){
            return "NULL";
        }else if(ogMetric == "Cup") {
            return tablespoonToCup(num);
        }
    }else if(metric == "Cup") {
        if(ogMetric == "Teaspoon"){
            return cupToTeaspoon(num);
        }else if (ogMetric == "Tablespoon"){
            return cupToTablespoon(num);
        }else if(ogMetric == "Cup") {
            return "NULL";
        }
    }
}

function findNumandMetric(text){
    let textArr = text.split(" ");
    let retDict = {"Num": "NULL", "Metric": "NULL", "TwoNums": "NULL", "OGNum": "NULL", "SecondOGNum": "NULL", "ogFormatMetric": "NULL"}
    let foundMetric = false;
    let foundNum = false;
    let go = true;
    for(let i = 0; i < textArr.length; i++){
        if(!foundMetric && textArr[i] in metricDict) {
            // searches for either cups, tablespoons, or teaspoons
            retDict["ogFormatMetric"] = textArr[i];
            retDict["Metric"] = metricDict[textArr[i]];
            foundMetric = true;
        } else if(!foundNum){
            if(textArr[i] in possibleNums){
                retDict["Num"] = possibleNums[textArr[i]];
                retDict["OGNum"] = textArr[i];
                retDict["TwoNums"] = false;
                go = false;
                foundNum = true;
            } else if(go && parseInt(textArr[i], 10) <= 32){
                let firstNum = parseInt(textArr[i], 10); 
                let secondNum = 0.0;
                retDict["OGNum"] = textArr[i];
                if(i + 1 < textArr.length){
                    if(textArr[i+1] in possibleNums){
                        secondNum = possibleNums[textArr[i+1]];
                        retDict["SecondOGNum"] = textArr[i+1];
                        retDict["TwoNums"] = true;
                    } else if (i + 2 < textArr.length){
                        if(textArr[i+2] in possibleNums){
                            secondNum = possibleNums[textArr[i+2]];
                            retDict["SecondOGNum"] = textArr[i+2];
                            retDict["TwoNums"] = true;
                        }
                    } else if(i + 3 < textArr.length){
                        if(textArr[i+3] in possibleNums){
                            secondNum = possibleNums[textArr[i+3]];
                            retDict["SecondOGNum"] = textArr[i+3];
                            retDict["TwoNums"] = true;
                        }
                    }
                }
                retDict["Num"] = firstNum + secondNum;
                foundNum = true;
            }
        }
    }
    return retDict;
}

function ingredientSearch(foodEl){
    let ret = {"Item": "NULL", "Multiple": "NULL", "OG Metric": "NULL" }
    let found = false;
    let foodArr = foodEl.split(" ");
    for(let i = 0; i < foodArr.length; i++){
        let strArr = foodArr[i].split("");
        if(typeof(strArr[0]) == "string" && strArr.length >= 0 ){
            strArr[0] = strArr[0].toUpperCase();    
        } 
        foodArr[i] = strArr.join("");
    }

    // TODO if it has oz or g in it, don't do anything   
    for(let i = 0; i < foodArr.length; i++){
        if(typeof(foodArr[i] != "int")) {
            if(foodArr[i] in cupToGrams){
                ret["Item"] = foodArr[i];
                ret["Multiple"] = cupToGrams[foodArr[i]];
                ret["OG Metric"] = "Cup";
                found = true;
            } else if (foodArr[i] in tablespoonToGrams){
                ret["Item"] = foodArr[i];
                ret["Multiple"] = tablespoonToGrams[foodArr[i]];
                ret["OG Metric"] = "Tablespoon";
                found = true;
            } else if (foodArr[i] in teaspoonToGrams){  
                ret["Item"] = foodArr[i];
                ret["Multiple"] = teaspoonToGrams[foodArr[i]];
                ret["OG Metric"] = "Teaspoon";
                found = true;
            }
        }
    }   
    if(!found){
        ret = secondarySearch(foodArr);
    }
    return ret;

}
function secondarySearch(foodArr){
    return {"Item": "NULL", "Multiple": "NULL", "OG Metric": "NULL" };
}
function findReqMetric(item){
    if(item in cupToGrams){ return "Cup";} 
    else if(item in tablespoonToGrams){ return "Tablespoon";}
    else if (item in teaspoonToGrams){return "Teaspoon";}
    else{
        console.log("Error occured when finding the req metric");
        return "NULL";
    }
}
function dictNotNull(dict){
    for (k in dict){
        if(dict[k] == "NULL"){
            return false;
        }
    }
    return true;
}

// first do if there is no number in the line, skip it
// if it has oz or g or lb in it, don't do anything 
// add extracts and vanilla 
// make a check for sugar functions, determining if it is brown or white
// add vegetable stocks and broths 
// eventually add items like vegetables 
// add liters and gallons eventually? 
// add case wher it is like "2 cups plus 1 tablespoon"
// add case where it's half a cup plus a third of a cup
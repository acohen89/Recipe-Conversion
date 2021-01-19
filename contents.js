console.log("Recipe Chrome Extension Loaded");
let cupToGrams = {
    "AP Flour": 130.0, "Bread Flour": 135.0, "Flour": 130.0, "WW Flour": 128.0, "Rye Flour": 102.0, "Water": 240.0, "Sugar": 200.0, "Raw Sugar": 250.0, "Brown Sugar": 220.0,
    "Confectioners Sugar": 125.0, "Milk": 242.0, "Cocoa Powder": 85.0, "Oil": 242.0, "Chocolate Chunks": 140.0, "Chocolate Chips": 170.0, "Nuts": 110.0, "Raisins": 155.0, "Oats": 105.0, "Heavy Cream": 225.0, "Buttermilk": 225.0, "Yogurt": 225.0, "Sour Cream": 225.0, "Peanut Butter": 250, "Rice": 200.0, "Light Corn Syrup": 328.0, "Dark Corn Syrup": 328.0, "Corn Syrup": 328.0,
    "Broth": 235.0, "Stock": 235.0, "Balsamic Vinegar": 255.0, "Whipping Cream": 231.0
}
let metricDict = {
    "Tsp": "Teaspoon", "tsp": "Teaspoon", "TSP": "Teaspoon", "teaspoon": "Teaspoon", "Teaspoon": "Teaspoon", "TeaSpoon": "Teaspoon", "TSPs": "Teaspoon", "Tsps": "Teaspoon", "Teaspoons": "Teaspoon", "teaspoons": "Teaspoon", "Teaspoons": "Teaspoon",
    "Tbs": "Tablespoon", "tbs": "Tablespoon", "TBSP": "Tablespoon", "Tbsp": "Tablespoon", "TBS": "Tablespoon", "tablespoon": "Tablespoon", "Tablespoon": "Tablespoon", "TableSpoon": "Tablespoon", "TBSs": "Tablespoon", "Tbss": "Tablespoon", "Tablespoon": "Tablespoon", "tablespoons": "Tablespoon", "Tablespoons": "Tablespoon",
    "Cups": "Cup", "cups": "Cup", "Cup": "Cup", "cup": "Cup", "CUPS": "Cup", "CUP": "Cup", "c": "Cup", "C": "Cup", "cs": "Cup", "Cs": "Cup", "CS": "Cup"
}
let possibleNums = { "1/2": 0.5, "1/3": 0.333, "1/4": 0.25, "1/8": 0.125, "2/3": 0.666, "3/4": 0.75, "3/8": 0.375, "5/8": 0.625, "7/8": 0.875, "⅛": 0.125, "¼": 0.25, "⅓": 0.333, "⅜": 0.375, "½": 0.5, "⅔": 0.666, "¾": 0.75 }
let teaspoonToGrams = { "Salt": 5.0, "Yeast": 3.1, "Cinnamon": 2.64, "Baking Powder": 4.0, "Vanilla": 4.0, "extract": 4.0 }
let tablespoonToGrams = { "Butter": 14.1, "Honey": 21.25, "Cornstarch": 9.375, "Maple Syrup": 20.0 }
function cupToTeaspoon(measurement) { return 0.0208333 * measurement; }
function cupToTablespoon(measurement) { return 0.0625 * measurement; }
function tablespoonToCup(measurement) { return 16 * measurement; }
function tablespoonToTeaspoon(measurement) { return 0.333 * measurement; }
function teaspoonToTablespoon(measurement) { return 3 * measurement; }
function teaspoonToCup(measurement) { return 48 * measurement; }
let element = Array.prototype.slice.call(document.querySelectorAll("li"));

for (let i = 0; i < element.length; i++) {
    if (!containsGramsOrNum(element[i].textContent)) { // put !containsGramsOrNum(element[i].textContent
        let ingredient = ingredientSearch(element[i].textContent);
        if (dictNotNull(ingredient)) {
            let ogNumandMetric = findNumandMetric(element[i].textContent, ingredient);
            if (ogNumandMetric["Num"] != "NULL" && ogNumandMetric["Metric"] != "NULL") {
                //console.log(ingredient["Item"]);
                //console.log(ogNumandMetric);
                let replaced = false;
                if (element[i].childNodes.length >= 2) {
                    if (element[i].childNodes[1].className == "checkbox-list") {
                        let split = element[i].querySelectorAll("span");
                        if (split.length >= 1) {
                            split[1].textContent = replacement(split[1].textContent, ingredient, ogNumandMetric);
                            replaced = true;
                        } else {
                            console.log("Error: trying to replace checkboxes")
                        }
                    }
                }
                for (let j = 0; j < element[i].childNodes.length; j++) {
                    // for tomorrow:
                    // loop through all elements of the child node and add them to a string
                    // with that string, do normal replacement method
                    // then, using a loop, add each part of the string back the orginal place in child node
                    if (element[i].childNodes[j].textContent == "▢ ") {
                        if (j + 1 < element[i].childNodes.length) {
                            let copyText = copyOfText(element[i].childNodes);
                            let replacemenText = replacement(copyText, ingredient, ogNumandMetric).replace(/\s+/g, ' ').trim();
                            element[i].childNodes = textToNodes(replacemenText, element[i].childNodes);
                        }
                        replaced = true;
                    }
                }
                if (!replaced) {
                    element[i].textContent = replacement(element[i].textContent, ingredient, ogNumandMetric);
                }
            }
        }
    }

}
function textToNodes(text, childElements){
    let textArr = text.split(" ");
    let k = 1;
    for(let i = 1; i < childElements.length; i++){
        childElements[i].textContent = textArr[k];
        if(i + 1 < childElements.length){
            i++;
            childElements[i].textContent = " ";
        }
        k++;
    }
    return childElements;
}
function copyOfText(childElements){
    // let copyArr = new Array(childElements.length-1);
    let retStr = "";
    for(let k = 0; k < childElements.length; k++){
        retStr += childElements[k].textContent;
    }
    return retStr;
}
function replacement(ogText, ingredientDict, numandMetric) {
    let ogTextArr = ogText.split(" ");
    let replacementText = "";
    let ogMetric = numandMetric["Metric"];
    let weight = "NULL";
    let reqMetric = findReqMetric(ingredientDict["Item"]);
    if (reqMetric != ogMetric) {
        numandMetric["Num"] = convertMetrics(reqMetric, ogMetric, numandMetric["Num"]);
    }
    if (reqMetric == "Cup") {
        if (!(ingredientDict["Item"] in cupToGrams)) { console.log("Error!"); }
        weight = numandMetric["Num"] * cupToGrams[ingredientDict["Item"]];
    } else if (reqMetric == "Tablespoon") {
        if (!(ingredientDict["Item"] in tablespoonToGrams)) { console.log("Error!"); }
        weight = numandMetric["Num"] * tablespoonToGrams[ingredientDict["Item"]];
    } else if (reqMetric == "Teaspoon") {
        if (!(ingredientDict["Item"] in teaspoonToGrams)) { console.log("Error!"); }
        weight = numandMetric["Num"] * teaspoonToGrams[ingredientDict["Item"]];
    } else { console.log("Error: Req metric wrong"); }
    if (weight >= 5) { replacementText = ogText.replace(numandMetric["OGNum"], Math.round(weight) + "g"); }
    else { replacementText = ogText.replace(numandMetric["OGNum"], round(weight, 1) + "g"); }
    if (numandMetric["TwoNums"] == true) {
        if (numandMetric["TwoNums"] == "NULL") { console.log("Error: TwoNums = NUll"); }
        let temp = replacementText.replace(numandMetric["SecondOGNum"], "");
        replacementText = temp;
    }
    // removes metric
    return replacementText.replace(numandMetric["ogFormatMetric"], "");
}
function convertMetrics(metric, ogMetric, num) {
    if (metric == "Teaspoon") {
        if (ogMetric == "Teaspoon") {
            return "NULL";
        } else if (ogMetric == "Tablespoon") {
            return teaspoonToTablespoon(num);
        } else if (ogMetric == "Cup") {
            return teaspoonToCup(num);
        }
    } else if (metric == "Tablespoon") {
        if (ogMetric == "Teaspoon") {
            return tablespoonToTeaspoon(num);
        } else if (ogMetric == "Tablespoon") {
            return "NULL";
        } else if (ogMetric == "Cup") {
            return tablespoonToCup(num);
        }
    } else if (metric == "Cup") {
        if (ogMetric == "Teaspoon") {
            return cupToTeaspoon(num);
        } else if (ogMetric == "Tablespoon") {
            return cupToTablespoon(num);
        } else if (ogMetric == "Cup") {
            return "NULL";
        }
    }
}

function findNumandMetric(text, ingredient) {
    let textArr = text.split(" ");
    let retDict = { "Num": "NULL", "Metric": "NULL", "TwoNums": "NULL", "OGNum": "NULL", "SecondOGNum": "NULL", "ogFormatMetric": "NULL" }
    let foundMetric = false;
    let foundNum = false;
    let go = true;
    for (let i = 0; i < textArr.length; i++) {
        if (!foundMetric && textArr[i] in metricDict) {
            // searches for either cups, tablespoons, or teaspoons
            retDict["ogFormatMetric"] = textArr[i];
            retDict["Metric"] = metricDict[textArr[i]];
            foundMetric = true;
        } else if (!foundNum) {
            if (textArr[i] in possibleNums) {
                retDict["Num"] = possibleNums[textArr[i]];
                retDict["OGNum"] = textArr[i];
                retDict["TwoNums"] = false;
                go = false;
                foundNum = true;
            } else if (go && parseInt(textArr[i], 10) <= 32) {
                let firstNum = parseInt(textArr[i], 10);
                let secondNum = 0.0;
                retDict["OGNum"] = textArr[i];
                if (i + 1 < textArr.length) {
                    if (textArr[i + 1] in possibleNums) {
                        secondNum = possibleNums[textArr[i + 1]];
                        retDict["SecondOGNum"] = textArr[i + 1];
                        retDict["TwoNums"] = true;
                    } else if (i + 2 < textArr.length) {
                        if (textArr[i + 2] in possibleNums) {
                            secondNum = possibleNums[textArr[i + 2]];
                            retDict["SecondOGNum"] = textArr[i + 2];
                            retDict["TwoNums"] = true;
                        }
                    } else if (i + 3 < textArr.length) {
                        if (textArr[i + 3] in possibleNums) {
                            secondNum = possibleNums[textArr[i + 3]];
                            retDict["SecondOGNum"] = textArr[i + 3];
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
function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function ingredientSearch(foodEl) {
    let ret = { "Item": "NULL", "Multiple": "NULL", "OG Metric": "NULL"}
    let found = false;
    let foodArr = foodEl.split(" ");
    for (let i = 0; i < foodArr.length; i++) {
        let strArr = foodArr[i].split("");
        if (typeof (strArr[0]) == "string" && strArr.length >= 0) {
            strArr[0] = strArr[0].toUpperCase();
        }
        foodArr[i] = strArr.join("");
    }
    for (let i = 0; i < foodArr.length; i++) {
        if (typeof (foodArr[i] != "int")) { // change to number?
            let nextWordAvai = false;
            let tryDif = foodArr[i].replace(",", "").replace(" ", "");
            if (i + 1 < foodArr.length) { nextWordAvai = true; }
            if (foodArr[i] in cupToGrams) {
                ret["Item"] = foodArr[i];
                ret["Multiple"] = cupToGrams[foodArr[i]];
                ret["OG Metric"] = "Cup";
                found = true;
            } else if (foodArr[i] in tablespoonToGrams) {
                ret["Item"] = foodArr[i];
                ret["Multiple"] = tablespoonToGrams[foodArr[i]];
                ret["OG Metric"] = "Tablespoon";
                found = true;
            } else if (foodArr[i] in teaspoonToGrams) {
                ret["Item"] = foodArr[i];
                ret["Multiple"] = teaspoonToGrams[foodArr[i]];
                ret["OG Metric"] = "Teaspoon";
                found = true;
            } else if (tryDif in tablespoonToGrams) {
                ret["Item"] = tryDif;
                ret["Multiple"] = tablespoonToGrams[tryDif];
                ret["OG Metric"] = "Tablespoon";
                found = true;
            } else if (tryDif in cupToGrams) {
                ret["Item"] = tryDif;
                ret["Multiple"] = cupToGrams[tryDif];
                ret["OG Metric"] = "Cup";
                found = true;
            } else if (tryDif in teaspoonToGrams) {
                ret["Item"] = tryDif;
                ret["Multiple"] = teaspoonToGrams[tryDif];
                ret["OG Metric"] = "Teaspoon";
                found = true;
            }
            else if (i + 1 < foodArr.length) {
                let twoWordTest = foodArr[i] + " " + foodArr[i + 1];
                if (twoWordTest in cupToGrams) {
                    ret["Item"] = twoWordTest;
                    ret["Multiple"] = cupToGrams[twoWordTest];
                    ret["OG Metric"] = "Cup";
                    found = true;
                } else if (twoWordTest in tablespoonToGrams) {
                    ret["Item"] = twoWordTest;
                    ret["Multiple"] = tablespoonToGrams[twoWordTest];
                    ret["OG Metric"] = "Tablespoon";
                    found = true;
                } else if (twoWordTest in teaspoonToGrams) {
                    ret["Item"] = twoWordTest;
                    ret["Multiple"] = teaspoonToGrams[twoWordTest];
                    ret["OG Metric"] = "Teaspoon";
                    found = true;
                }
            }
        }
    }
    if (!found) {
        ret = secondarySearch(foodArr);
    }
    return ret;

}
function secondarySearch(foodArr) {
    return { "Item": "NULL", "Multiple": "NULL", "OG Metric": "NULL" };
}
function findReqMetric(item) {
    if (item in cupToGrams) { return "Cup"; }
    else if (item in tablespoonToGrams) { return "Tablespoon"; }
    else if (item in teaspoonToGrams) { return "Teaspoon"; }
    else {
        console.log("Error occured when finding the req metric");
        return "NULL";
    }
}
function dictNotNull(dict) {
    for (k in dict) {
        if (dict[k] == "NULL") {
            return false;
        }
    }
    return true;
}
function containsGramsOrNum(text) {
    let textArr = text.split(" ");
    for (let i = 0; i < textArr.length; i++) {
        let k = 0;
        while (k < textArr[i].length) {
            if (isInt(textArr[i][k])) {
                while (isInt(textArr[i][k])) {
                    k++;
                }
                let testSubString = textArr[i].substring(k, textArr[i].length);
                if(testSubString.includes("g") || testSubString.includes("grams") || testSubString.includes("Grams") || testSubString.includes("gr") || testSubString.includes("ml") || testSubString.includes("ML") || testSubString.includes("Ml") || testSubString.includes("milliliters") || testSubString.includes("Milliliters")){
                    return true;
                }
            }
            k++;
        }
    }
    return false;
}
function isInt(char) {
    if (isNaN(parseInt(char))) {
        return false;
    }
    return true;
}
function removeMetricAndIngredient(metric, ingredient, text){
    text = text.replace(metric, "").replace(ingredient, "");
    let ingredientArr = ingredient.split("");
    if (typeof (ingredientArr[0]) == "string" && ingredientArr.length >= 0) {
        ingredientArr[0] = ingredientArr[0].toLowerCase();
    }
    let newIngredient = ingredientArr.join("");
    return text.replace(newIngredient, "");

}


// add extracts and vanilla 
// add vegetable stocks and broths 
// eventually add items like vegetables 
// add liters and gallons eventually? 
// add case wher it is like "2 cups plus 1 tablespoon" or "2 cups and a 1/4 of a cup"
// add case where it's half a cup plus a third of a cup
// add all-purpose flour case 
// add mini chocolate chips
// add if it has a period or astrix after item
// add cormeal and half-and-half
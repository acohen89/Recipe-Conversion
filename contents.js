console.log("Recipe Chrome Extension Loaded");
let cupToGrams  = {"AP Flour": 130.0, "Bread Flour": 135.0, "WW Flour": 128.0, "Rye Flour": 102.0, "Water": 240.0, "Sugar": 200.0, "Raw Sugar": 250.0, "Brown Sugar": 220.0,
"Confectioners Sugar": 125.0, "Milk": 242.0, "Cocoa Powder": 85.0, "Oil": 242.0, "Chocolate Chunks": 140.0, "Chocolate Chips": 170.0, "Nuts": 110.0, "Raisins": 155.0, "Oats": 105.0, "Heavy Cream": 225.0, "Buttermilk": 225.0, "Yogurt": 225.0, "Sour Cream": 225.0, "Peanut Butter": 250, "Rice": 200.0, "Light Corn Syrup": 328.0, "Dark Corn Syrup": 328.0, "Corn Syrup": 328.0
 }
let metricDict = {"Tsp": "Teaspoon", "tsp": "Teaspoon", "TSP": "Teaspoon", "teaspoon": "Teaspoon", "Teaspoon": "Teaspoon", "TeaSpoon": "Teaspoon", "TSPs": "Teaspoon", "Tsps": "Teaspoon", "Teaspoons": "Teaspoon", "teaspoons": "Teaspoon", "Teaspoons": "Teaspoon",
"Tbs": "Tablespoon", "tbs": "Tablespoon", "TBS": "Tablespoon", "tablespoon": "Tablespoon", "Tablespoon": "Tablespoon", "TableSpoon": "Tablespoon", "TBSs": "Tablespoon", "Tbss": "Tablespoon", "Tablespoon": "Tablespoon", "tablespoons": "Tablespoon", "Tablespoons": "Tablespoon", 

"Cups": "Cup", "cups": "Cup", "Cup": "Cup", "cup": "Cup", "CUPS": "Cup", "CUP": "Cup", "c": "Cup", "C": "Cup"}
let possibleNums = {"1/2": 0.5, "1/3": 0.333, "1/4": 0.25, "1/8": 0.125, "2/3": 0.666, "3/4": 0.75, "3/8": 0.375, "5/8": 0.625, "7/8": 0.875}
let teaspoonToGrams = {"Salt": 5.0, "Yeast": 3.1,}
let tablespoonToGrams = {"Butter": 14.1, "Honey": 21.25, "Cornstarch": 9.375, "Maple Syrup": 20.0}
let element = Array.prototype.slice.call(document.querySelectorAll("li"));
for (let i  = 0; i < element.length; i++) {
    // console.log(element[i].textContent);  
    let ingredient = ingredientSearch(element[i].textContent);
    if(dictNotNull(ingredient)) {
       console.log(element[i].textContent);  
       let ogNumandMetric = findNumandMetric(element[i].textContent); 
       if(ogNumandMetric[0] != "NULL" && ogNumandMetric[1] != "NULL"){
        element[i].textContent = element[i].textContent.replace(ingredient["Item"], "REPLACED!");
        element[i].textContent = replace(element[i].textContent, ingredient, ogNumandMetric);
        element[i].textContent = element[i].textContent.replace(ingredient["Item"].toLowerCase(), "REPLACED!"); // Replaces lowercase words  
       }
    }
    // console.log(element[i].textContent);
    //let tempArr = element[i].textContent.split(" ");
    // console.log(tempArr);
}

function replace(ogText, ingredientDict){
    let ogTextArr = ogText.split(" ");
    let replacementText = ""; 


    return replacementText;
}

function findNumandMetric(text){
    let textArr = text.split(" ");
    let retArr = [0, ""];
    for(let i = 0; i < textArr.length; i++){
        if(textArr[i] in metricDict) {
            // searches for either cups, tablespoons, or teaspoons
            retArr[1] = metricDict[textArr[i]];
        }
        else {
            return ["NULL", "NULL"]
        }


    }
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
                ret["OG Metric"] = "Cups";
                found = true;
            } else if (foodArr[i] in tablespoonToGrams){
                ret["Item"] = foodArr[i];
                ret["Multiple"] = tablespoonToGrams[foodArr[i]];
                ret["OG Metric"] = "Tbs";
                found = true;
            } else if (foodArr[i] in teaspoonToGrams){  
                ret["Item"] = foodArr[i];
                ret["Multiple"] = teaspoonToGrams[foodArr[i]];
                ret["OG Metric"] = "Tsp";
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
function dictNotNull(dict){
    for (k in dict){
        if(dict[k] == "NULL"){
            return false;
        }
    }
    return true;
}

// first do if there is no number in the line, skip it
// if it has oz or g in it, don't do anything 
// add extracts and vanilla 
// make a check for sugar functions, determining if it is brown or white
// add vegetable stocks and broths 
// eventually add items like vegetables 
// add liters and gallons eventually? 
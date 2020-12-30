console.log("Recipe Chrome Extension Loaded");
let cupToGrams  = {"AP Flour": 130.0, "Bread Flour": 135.0, "WW Flour": 128.0, "Rye Flour": 102.0, "Water": 240.0, "Sugar": 200.0, "Raw Sugar": 250.0, "Brown Sugar": 220.0,
"Confectioners Sugar": 125.0, "Milk": 242.0, "Cocoa Powder": 85.0, "Oil": 242.0, "Chocolate Chunks": 140.0, "Chocolate Chips": 170.0, "Nuts": 110.0, "Raisins": 155.0, "Oats": 105.0, "Heavy Cream": 225.0, "Buttermilk": 225.0, "Yogurt": 225.0, "Sour Cream": 225.0, "Peanut Butter": 250, "Rice": 200.0, "Light Corn Syrup": 328.0, "Dark Corn Syrup": 328.0, "Corn Syrup": 328.0
 }
let teaspoonToGrams = {"Salt": 5.0, "Yeast": 3.1,}
let tablespoonToGrams = {"Butter": 14.1, "Honey": 21.25, "Cornstarch": 9.375, "Maple Syrup": 20.0}
let element = Array.prototype.slice.call(document.querySelectorAll("li"));
for (let i  = 0; i < element.length; i++) {
    // console.log(element[i].textContent);  
    let ingredient = ingredientSearch(element[i].textContent);
    if(dictNotNull(ingredient)) {
        //console.log(ingredient);
       console.log(element[i].textContent);  
       element[i].textContent = element[i].textContent.replace(ingredient["Item"], "REPLACED!");
       element[i].textContent = element[i].textContent.replace(ingredient["Item"].toLowerCase(), "REPLACED!"); // not replacing because one is capital one is lower case 
    }
    // console.log(element[i].textContent);
    //let tempArr = element[i].textContent.split(" ");
    // console.log(tempArr);
}
// let testArr = ["1 cup salted butter* softened", "1 cup white (granulated) sugar", "1 cup light brown sugar packed", "2 tsp pure vanilla extract", "2 large eggs"]
// element.textContent = el.textContent.replace("HTML", "test! ");
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
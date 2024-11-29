function addFilter(attribute, value) {
    if (isEmpty(selectControl)){
        selectControl[attribute] = value;
        if (attribute == "hour") {
            newData = data.filter(function(s) {
                return s[attribute] == selectControl.hour.filter(function(g){
                    return g == s[attribute];
                });
            });
        }
        else {
            newData = data.filter(function(s) {
                return s[attribute] == selectControl[attribute];
            });
        }
        updateAll(newData, attribute);
    }
    else {
        if (selectControl.hasOwnProperty(attribute)) {
            if (Array.isArray(selectControl[attribute])) {
                if (Array.isArray(value)) {
                    value.forEach(function(d) {
                        selectControl[attribute].push(d);
                    });
                }
                else {
                    selectControl[attribute].push(value);
                }
            }
            else {
                selectControl[attribute] = [selectControl[attribute], value];
            } // end of if attribute exists
        }
        else {
            selectControl[attribute] = value;
        }
        newData = data;
        for(var key in selectControl) {
            if(selectControl.hasOwnProperty(key)){
                if (Array.isArray(selectControl[key])) {
                    newData = newData.filter(function(s) {
                        return s[key] == selectControl[key].filter(function(g){
                            return g == s[key];
                        })})} // end of if attribute is array
                else {
                    newData = newData.filter(function(s) {
                        return s[key] == selectControl[key];
                    })} // end of else: if attribute is array
            }}; // end of for loop
        updateAll(newData, attribute);
    } // end of else: if isEmpty()
}; // end of function addFilter(filter, value)

function replaceFilter(attribute, value, data) {
    if (attribute == "event" || attribute == "lid") {
        selectControl = {};
    }
    selectControl[attribute] = value;
    newData = data;
    for(var key in selectControl) {
        if(selectControl.hasOwnProperty(key)){
            if (Array.isArray(selectControl[key])) {
                newData = newData.filter(function(s) {
                    return s[key] == selectControl[key].filter(function(g){
                        return g == s[key];
                    })})} // end of if attribute is array
            else {
                newData = newData.filter(function(s) {
                    return s[key] == selectControl[key];
                })} // end of else: if attribute is array
        }}; // end of for loop
    updateAll(newData, attribute);
}; // end of function replaceFilter(attribute, value)

function removeFilter(attribute, value) {
    if (Array.isArray(selectControl[attribute])) {
        if (selectControl[attribute].length == 1) {
            delete selectControl[attribute];
        }
        else {
            if (attribute == "hour") {
                if (selectControl.hour.length == 6) {
                    delete selectControl.hour
                }
                else {
                    var index = selectControl.hour.indexOf(value[0]);
                    if (index > -1) {
                        selectControl.hour.splice(index, 6);
                    }
                }
            }
            else {
                var index = selectControl[attribute].indexOf(value);
                if (index > -1) {
                    selectControl[attribute].splice(index, 1);
            }
            }
        }
        newData = data;
        for(var key in selectControl) {
            if(selectControl.hasOwnProperty(key)){
                if (Array.isArray(selectControl[key])) {
                    newData = newData.filter(function(s) {
                        return s[key] == selectControl[key].filter(function(g){
                            return g == s[key];
                        })})} // end of if attribute is array
                else {
                    newData = newData.filter(function(s) {
                        return s[key] == selectControl[key];
                    })} // end of else: if attribute is array
            }}; // end of for loop
        updateAll(newData, attribute);
    } // end of if array
    else {
        delete selectControl[attribute];
        if (isEmpty(selectControl)) {
            updateAll(data, "");
        }
        else {
            newData = data;
            for(var key in selectControl) {
                if(selectControl.hasOwnProperty(key)){
                    if (Array.isArray(selectControl[key])) {
                        newData = newData.filter(function(s) {
                            return s[key] == selectControl[key].filter(function(g){
                                return g == s[key];
                            })})} // end of if attribute is array
                    else {
                        newData = newData.filter(function(s) {
                            return s[key] == selectControl[key];
                        })} // end of else: if attribute is array
                }}; // end of for loop
            updateAll(newData, "");
        }
    }
}; // end of function removeFilter(filter, value)


function updateAll(newData, attribute) {
    
    wCloud.update(newData);
    
    /*
    if (!selectControl.hasOwnProperty("month")) {
        mBar.update(newData);
    }
    if (!selectControl.hasOwnProperty("year")) {
        yBar.update(newData);
    }
     */
    if (!selectControl.hasOwnProperty("weekday")) {
        wBar.update(newData);
    }
   
    if (!selectControl.hasOwnProperty("hour")) {
        hBar.update(newData);
    }
    if (attribute != "language") {
        lPie.update(newData);
    }
    
} // end of updateAll
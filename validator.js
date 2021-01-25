class ValidateRequest{

    isJsonType(data){
        if(data.headers['content-type'] !== 'application/json'){
            return false;
        }
        return true;
    }

    hasRuleData(req){
        if(!('rule' in req)){
            return Error('rule is required.');
        }
        if(!('data' in req)){
            return Error('data is required.');
        }
        return;  
    }

    isRuleJson(data){
        if(data.constructor === Object){
            return true;
        }
        return false;
    }

    ruleContainsReqFields(rule){
        if(!('field' in rule)){
            return Error('field is required.');
        }
        if(!('condition' in rule)){
            return Error('condition is required.');
        }
        if(!('condition_value' in rule)){
            return Error('condition_value is required.');
        }
    }

    isDataValid(data){
        if(data.constructor === Object || data.constructor === Array || data.constructor === String){
            return true;
        }
        return false;
    }

    checkFieldData(input){
        const fields = input.rule.field;
        const data = input.data;
        let output;
        
        //check if value of rule.field is a string to be used as key in data
        if(fields.constructor !== String){
            return Error(`rule.field should be a string.`);
        }
        
        //split into array incase of nested field
        const fieldArr = fields.trim().split(".");
        let fieldValue;

        //if not nested, retrieve first value
        if(fieldArr.length == 1){
            fieldValue = fieldArr[0];
            if(data.constructor === Object){
                if(!(fieldValue in data)){
                    return Error(`field ${fieldValue} is missing from data.`);
                }
            }
            if(data.constructor === Array || data.constructor === String){
                if(!data.includes(fieldValue)){
                    return Error(`field ${fieldValue} is missing from data.`);
                }
            }
            output = data[fieldValue.toString()];
            
            return output;
            
        }else{
            let appendKey;
            //loop through nested data and check if it exists in data
            for (let i = 0; i < fieldArr.length; i++) {
                fieldValue = fieldArr[i].trim();
                
                if(data.constructor === Object){
                    if(appendKey == undefined){
                        if(!(fieldValue in data)){
                            return Error(`field ${fieldValue} is missing from data.`);
                        }

                        appendKey = data[fieldValue.toString()];
                        
                        continue;
                    }else{
                        //check type of variable in current data.
                        if(!((appendKey.constructor === Object) ? (fieldValue in appendKey) : (appendKey.toString().includes(fieldValue)))){
                            return Error(`field ${fieldValue} is missing from data.`);
                        }
                        appendKey = appendKey[fieldValue.toString()];
                        output = appendKey;
                        continue;
                    }
                }
                if(data.constructor === Array || data.constructor === String){
                    if(appendKey === undefined){
                        if(!data.includes(fieldValue)){
                            return Error(`field ${fieldValue} is missing from data.`);
                        }
                        appendKey = data[fieldValue.toString()];
                        continue;
                    }else{
                        if(!appendKey.includes(fieldValue)){
                            return Error(`field ${fieldValue} is missing from data.`);
                        }
                        appendKey = appendKey[fieldValue.toString()];
                        output = appendKey;
                        continue;
                    }
                }
                
                
            }
            return output;
            
        }
    }

    checkConditionTypes(fieldVal, rule){
        
        if(fieldVal.constructor === rule.condition_value.constructor){
            return true;
        }
        return Error(`data.field should be of type ${typeof(rule.condition_value)}.`);
    }

    validateRuleData(fieldVal, ruleObj){
        let output = false;
        const conditionVal = ruleObj.condition_value;
        switch (ruleObj.condition.toString().trim().toLowerCase()) {
            case 'eq':
                output = (fieldVal === conditionVal) ? true : false;
                break;
            case 'neq':
                output = (fieldVal !== conditionVal) ? true : false;
                break;
            case 'gt':
                output = (fieldVal > conditionVal) ? true : false;
                break;
            case 'gte':
                output = (fieldVal >= conditionVal) ? true : false;
                break;
            case 'contains':
                output = (fieldVal.toString().includes(conditionVal)) ? true : false;
                break
            default:
                return Error(`'${ruleObj.condition}' is not a valid condition.`);
        }
        
        return output;
    }

}

module.exports = ValidateRequest;
class ValidateRequest{

    isJsonType(data){
        if(data.headers['content-type'] !== 'application/json'){
            return false;
        }
        return true;
    }

    hasRuleData(req){
        // const keys = ['rule', 'data'];
        // if(keys.every(k => Object.keys(req).includes(k))){
        //     return true;
        // }
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
            return Error('rule.field is required.');
        }
        if(!('condition' in rule)){
            return Error('rule.condition is required.');
        }
        if(!('condition_value' in rule)){
            return Error('rule.condition_value is required.');
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
        // console.log(field.split(".",2));
        const fieldArr = fields.split(".",3);
        let fieldValue;

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
            // if(data.constructor === String){
            //     data.includes
            // }
        }else{
            let appendKey;
            for (let i = 0; i < fieldArr.length; i++) {
                fieldValue = fieldArr[i];
                
                if(data.constructor === Object){
                    if(appendKey == undefined){
                        if(!(fieldValue in data)){
                            return Error(`field ${fieldValue} is missing from data.`);
                        }

                        appendKey = data[fieldValue.toString()];
                        
                        continue;
                    }else{
                        if(!(fieldValue in appendKey)){
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
        switch (ruleObj.condition.toLowerCase()) {
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
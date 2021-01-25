class Response{
    printProfile(){
        const output = {
            "message": "My Rule-Validation API",
            "status": "success",
            "data": {
                "name": "Olushile Gerald Timi",
                "github": "@OgTimi",
                "email": "ogtimi@outlook.com",
                "mobile": "07083249026",
                "twitter": "@timi__og"
            }
        }

        return output;
    }

    validationResponse(fieldVal, rule, isTrue){
        const result = {
            "message" : (isTrue) ? `field ${rule.field.toString().trim()} successfully validated.` : `field ${rule.field.toString().trim()} failed validation.`,
            "status" : (isTrue) ? "success" : "error",
            "data" : {
                "validation" : {
                    "error" : (isTrue) ? false : true,
                    "field" : `${rule.field}`,
                    "field_value" : fieldVal,
                    "condition" : `${rule.condition}`,
                    "condition_value" : rule.condition_value
                }
            }
        }
        
        return result;
    }

    badRequest(message){
        const response = {
            "message" : message.toString(),
            "status" : "error",
            "data" : null
        }

        return response;
    }
}

module.exports = Response;
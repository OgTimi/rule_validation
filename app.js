
const Express = require('express');
const Validator = require('./validator');
const Response = require('./response');
const jsend = require('jsend');
const util = require('util');

const app = Express();

const validator = new Validator();
const response = new Response();

app.use(Express.json());

app.use((err, req, res, next)=>{
    if(err){
        return res.status(400).send(response.badRequest('Invalid JSON payload passed.'));
    }else{
        next();
    }
})


app.get('/', (req, res)=>{
    const output = response.printProfile();
    // console.log(output);
    return res.send(output);
})

app.post('/validate-rule', (req, res) => {

    try{
        //check if valid JSON request
        if(!validator.isJsonType(req)){
            
            return res.status(400).send(response.badRequest('request content must be of type json.'));
        }

        const request = req.body;
        if(request.constructor === Array){
            return res.status(400).send(response.badRequest(`Json object expected. Array received.`));
        }
        
        //check if required fields exist
        const hasRD = validator.hasRuleData(request)
        if (hasRD instanceof Error){
            return res.status(400).send(response.badRequest(hasRD.message));
        }
        
        //check if rule value is a valid object.
        if(!validator.isRuleJson(request.rule)){
            return res.status(400).send(response.badRequest('rule should be an object.'));
        }

        //check if rule has required fields 
        const ruleFields = validator.ruleContainsReqFields(request.rule);
        if(ruleFields instanceof Error){
            return res.status(400).send(response.badRequest(ruleFields.message));
        }
        //check data type
        if(!validator.isDataValid(request.data)){
            return res.status(400).send(response.badRequest('data must be of either type Json, Array or String.'));
        }
        //Check if value of rule field exists in data object. Retrieve value if it does.
        const fieldData = validator.checkFieldData(request);
        if(fieldData instanceof Error){
            return res.status(400).send(response.badRequest(fieldData.message));
        }

        //Run condition against rule and data
        const finalValidation = validator.validateRuleData(fieldData, request.rule);
        if(finalValidation instanceof Error){
            //Encountered error
            return res.status(400).send(response.badRequest(finalValidation.message));
        }else if (!finalValidation) {
            //Validation failed
            const result = response.validationResponse(fieldData, request.rule, false);
            return res.status(400).send(result);
        } else {
            //Validation Passed
            const result = response.validationResponse(fieldData, request.rule, true);
            return res.status(200).send(result);
        }
    }
    catch (err) {
        console.log(err)
        return res.status(400).send(response.badRequest('Something went wrong. Please contact administrator.'));
    }

})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port:${port}`));



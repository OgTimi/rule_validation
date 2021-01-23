
const Express = require('express');
const Validator = require('./validator');
const Response = require('./response');
const jsend = require('jsend');
const util = require('util');

const app = Express();

app.use(Express.json());

app.use((err, req, res, next)=>{
    if(err){
        return res.status(400).send(jsend.error('Invalid JSON payload passed.'));
    }else{
        next();
    }
})

const validator = new Validator();
const response = new Response();

app.get('/', (req, res)=>{
    const output = response.printProfile();
    // console.log(output);
    return res.send(output);
})

app.post('/validate-rule', (req, res) => {

    try{
        //check if valid JSON request
        if(!validator.isJsonType(req)){
            
            return res.status(400).send(jsend.error('request must be a JSON data.ENTER'));
        }

        const request = req.body;
        
        //check if required fields exist
        const hasRD = validator.hasRuleData(request)
        if (hasRD instanceof Error){
            return res.status(400).send(jsend.error(hasRD));
        }
        
        //check if rule value is a valid object.
        if(!validator.isRuleJson(request.rule)){
            return res.status(400).send(jsend.error('rule should be an object.'));
        }

        //check if rule has required fields 
        const ruleFields = validator.ruleContainsReqFields(request.rule);
        if(ruleFields instanceof Error){
            return res.status(400).send(jsend.error(ruleFields));
        }
        //check data type
        if(!validator.isDataValid(request.data)){
            return res.status(400).send(jsend.error('data must be of either type Array, Json or String.'));
        }
        //Check if value of rule field exists in data object. Retrieve value if it does.
        const fieldData = validator.checkFieldData(request);
        if(fieldData instanceof Error){
            return res.status(400).send(jsend.error(fieldData));
        }

        //Check type of condition values.
        const conditionType = validator.checkConditionTypes(fieldData, request.rule);
        if(conditionType instanceof Error){
            return res.status(400).send(jsend.error(conditionType));
        }

        const finalValidation = validator.validateRuleData(fieldData, request.rule);
        if(finalValidation instanceof Error){
            return res.status(400).send(jsend.error(finalValidation));
        }else if (!finalValidation) {
            const result = response.validationResponse(fieldData, request.rule, false);
            return res.status(400).send(result);
        } else {
            const result = response.validationResponse(fieldData, request.rule, true);
            return res.status(200).send(result);
        }



        return res.send(jsend.success(req.body.rule));
        //return jsend.success('Validation successful')
    }
    catch (err) {
        console.log(err)
        return res.send(jsend.error('Something went wrong. Contact administrator.'));
    }

})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port:${port}`));



var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var Logs = require('../../models/dbConfig').getModel;
var queryBoxIn = require('../../models/dbConfig').queryBoxModel;
var util = require('util');
router.post('/',function(req,res,next){
  //console.log("someInModel",someInModel);
  console.log("queryBoxIn",queryBoxIn);
  console.log("")
  var count = 0;
  var queryObj = {
    dimensions :[],
    measures :[],
    "operators": {
                  "logical": ["and", "or"],
                  "condtional": [">", "<", ">=", "<=", "=="]
          },
          "aggregators": [{
                  "name": "top",
                  "noOfArguments": 1
          }, {
                  "name": "bottom",
                  "noOfArguments": 1
          }, {
                  "name": "average",
                  "noOfArguments": 0
          }]
  };

queryBoxIn.find(function(err, doc){
  console.log(doc);
  doc[0].git.dimensions.map(function(dimensionData){
    var tempName = dimensionData.name;
    var tempDisplay = dimensionData.displayName;
    Logs(req.session.user.organization,"commitDataModel").find().distinct(tempName,
    function(err,result){
          if(err){
            console.log("we are having issue in retriving data", err);
          }
          else{
            var temp = {
              name : {},
              displayName : {},
              values : []
            };
            temp.name = tempName;
            temp.displayName = tempDisplay;
            temp.values = result;
            queryObj.dimensions.push(temp);
            count++;
            if(count === doc[0].git.dimensions.length){
              myPrint();
              mongoose.connection.close();
              res.send(queryObj);
            }
          }
        });
  });
});
function myPrint(){
  console.log(util.inspect(queryObj,false,null));
}
});

module.exports = router;

const express = require('express');
const router = express();
const Data = require('../models/Data');

router.post('/', async (req,res)=>{

    const { sap_Id, name, contact_no, year_join, year_passed, profile_pic } = await req.body ;
    try{

        const data = await Data.create({ sap_Id, name, contact_no, year_join, year_passed, profile_pic })
        res.status(200).send("Data saved successfully !!");

    }catch(err){

    console.log("error che");
    res.status(500).send(err);

    }

})


module.exports = router;

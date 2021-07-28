const express = require('express');
const router = express();
const Data = require('../models/Data');
const Internship = require('../models/internships')

router.post('/', async (req,res)=>{

    const { sap_Id, name, contact_no, year_join, year_passed, profile_pic, contribution, academic_cgpa,internships, cultural_activities, sports_activities, NSS_activities} = await req.body ;

    try{

        let internshipsArray = [];
        // internships.map( async (internship)=>{
        //     const { name,role,description,proof_link } = internship;
        //     const res = await Internship.create({name, role, description, proof_link})
        //     console.log(res._id)
        //     await internshipsArray.push(res._id);
        // })

        internships.map( async (internship)=>{
            const { name,role,description,proof_link } = internship;
            const res = new Internship({name, role, description, proof_link})
            internshipsArray.push(res._id);
            await res.save();
            
        })

        const data = await Data.create({ sap_Id, name, contact_no, year_join, year_passed, profile_pic, contribution, academic_cgpa, cultural_activities, sports_activities, NSS_activities, internshipsArray })
        res.status(200).send("Data saved successfully !!");

    }catch(err){

    console.log("error che");
    res.status(500).send(err);

    }

})


module.exports = router;

const express = require('express');
const router = express();
const Data = require('../models/User');
const Internship = require('../models/internships')
const Project = require('../models/projects')
const Publication = require('../models/publication')
const Achievement = require('../models/achievements')
let { requireAuth } = require("../middlewares/userMiddleware");


router.get('/', requireAuth, async(req,res)=>{

    const {sap_Id, name, contact_no, year_join, 
        year_passed, profile_pic, contribution, 
        academic_cgpa,internshipsArray, projectArray, cultural_activities, 
        sports_activities, NSS_activities, linkedin, achievementsArray,
        publicationArray, further_contributions } = req.user


    const projects = await Promise.all(
        projectArray.map((projectId) => {
          return Project.findById(projectId);
        })
      );
    const internships = await Promise.all(
        internshipsArray.map((internshipId) => {
          return Internship.findById(internshipId);
        })
      );
    const publications = await Promise.all(
        publicationArray.map((publicationId) => {
          return Publication.findById(publicationId);
        })
      );

    const achievements = await Promise.all(
        achievementsArray.map((achievementId) => {
          return Achievement.findById(achievementId);
        })
      );

      res.status(200).send({ sap_Id, name, contact_no, year_join, 
        year_passed, profile_pic, contribution, 
        academic_cgpa,internships, projects, cultural_activities, 
        sports_activities, NSS_activities, linkedin, achievements,
        publications, further_contributions
      })
      

})

router.post('/', requireAuth, async (req,res)=>{

    const { sap_Id, name, contact_no, year_join, 
            year_passed, profile_pic, contribution, 
            academic_cgpa,internships, projects, cultural_activities, 
            sports_activities, NSS_activities, linkedin, achievements,
            publications, further_contributions
          } = await req.body ;
    let user = req.user

    try{

        let internshipsArray = [];
        internships.map( async (internship)=>{
            const { name, role, description, proof_link, start_date, end_date } = internship;
            if(internship._id){
                internshipsArray.push(internship._id);
                const data = { name, role, description, proof_link, start_date, end_date }
                const res = await Internship.findOneAndUpdate({_id:internship._id},{$set:data},{ returnDocument: 'after' })
                
            }else{
                const res = new Internship({name, role, description, proof_link, start_date, end_date})
                internshipsArray.push(res._id);
                await res.save();
            }
            
            
        })

        let projectArray = [];
        projects.map( async (project)=>{
            const { title, description, project_link } = project;
            if(project._id){
              projectArray.push(project._id);
                const data = { title, description, project_link }
                const res = await Project.findOneAndUpdate({_id:project._id},{$set:data},{ returnDocument: 'after' })

            } else {
                const res = new Project({title, description, project_link})
                projectArray.push(res._id);
                await res.save();
            }
            
            
        })

        let publicationArray = [];
        publications.map( async (Publication1)=>{
            const { title, publication, author, conference, year } = Publication1;
            if(Publication1._id){
                publicationArray.push(Publication1._id);
                const data = { title, publication, author, conference, year }
                const res = await Publication.findOneAndUpdate({_id:Publication1._id},{$set:data},{ returnDocument: 'after' })

            } else {
              const res = new Publication({title, publication, author, conference, year})
              publicationArray.push(res._id);
              await res.save();
            }

            
        })


        let achievementsArray = [];
        achievements.map( async (achievement)=>{
            const { title, description, proof_link } = achievement;
            if(achievement._id){
              achievementsArray.push(achievement._id);
                const data = { title, description, proof_link }
                const res = await Achievement.findOneAndUpdate({_id:achievement._id},{$set:data},{ returnDocument: 'after' })

            } else {
              const res = new Achievement({title, description, proof_link })
              achievementsArray.push(res._id);
              await res.save();
            }
          
            
        })

        const userData = {
            sap_Id, name, contact_no, year_join, 
            year_passed, profile_pic, contribution, 
            academic_cgpa,internshipsArray, projectArray, cultural_activities, 
            sports_activities, NSS_activities, linkedin, achievementsArray,
            publicationArray, further_contributions
        }

        const data = await Data.findOneAndUpdate({sap_Id:sap_Id},{$set:userData},{ returnDocument: 'after' })
        console.log(data)
        // data.internshipsArray = internshipsArray
        // data.projectArray = projectArray
        // data.publicationArray = publicationArray
        // data.achievementsArray = achievementsArray
        // await data.save();



        // const data = await Data.create({ sap_Id, name, contact_no, 
        //                                  linkedin, year_join, year_passed, 
        //                                  profile_pic, contribution, academic_cgpa, 
        //                                  cultural_activities, sports_activities, 
        //                                  NSS_activities, internshipsArray,
        //                                  projectArray, achievementsArray, publicationArray,
        //                                  further_contributions
        //                                })
        res.status(200).send("Data saved successfully !!");

    }catch(err){

    console.log(err);
    res.status(500).send(err);

    }

})


module.exports = router;

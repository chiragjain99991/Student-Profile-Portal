const Data = require('../models/User');
const Internship = require('../models/internships')
const Project = require('../models/projects')
const Publication = require('../models/publication')
const Achievement = require('../models/achievements')
const Coursera = require("../models/coursera")
const Cgpa = require("../models/cgpa");

class DataController{

    async data(req,res){
        if(req.user.isAdmin){
       
            const allData = []
            
            const data = await Data.find({$and:[{ isAdmin: { $ne: true }},{ isSuperAdmin: { $ne: true }},{ isValid: true },{ isUpdated: true}]},null,{sort:{'updatedAt':-1}})
            data.map( async (user)=>{
                  const {sap_Id, name, contact_no, year_join, year_passed, profile_pic} = user;
      
                  
                    allData.push({ sap_Id, name, contact_no, year_join, 
                      year_passed, profile_pic});
                
              })
                res.status(200).send(allData);
             
            
      
          } else {

            const {sap_Id, name, contact_no, year_join, 
              year_passed, profile_pic, contribution, 
              academic_cgpa,internshipsArray, projectArray, cultural_activities, 
              sports_activities, NSS_activities, linkedin, achievementsArray,
              publicationArray, further_contributions, courseraArray, gre, ielts, gate, cat, gmat, tofel, resume, email } = req.user

            const cgpaObject = await Cgpa.find({year: year_passed})
      
      
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

            const coursera = await Promise.all(
              courseraArray.map((courseId) => {
                return Coursera.findById(courseId);
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
              academic_cgpa,internships, coursera, projects, cultural_activities, 
              sports_activities, NSS_activities, linkedin, achievements,
              publications, further_contributions,  gre, ielts, gate, cat, gmat, tofel, resume, cgpaObject, email
            });
          }
      
           
    }
    async deleteUser(req,res){
      if(req.user.isAdmin && req.user.isSuperAdmin){
          try{
            
            const { sapId } = req.params;
            const user = await Data.findOne({sap_Id:sapId})
            if(user){
              await Data.findOneAndDelete({sap_Id:sapId})
              res.status(200).send({msg:`User with sapId ${sapId} deleted successfully`})
            }else{
              return res.status(500).send({msg:"User not found"});
            }
          }catch(err){
            return res.status(500).send({msg:err.message});
          }
      }else{
           
        res.status(500).send({msg:"Only Super Admin is allowed to delete profile of students"})
      }
    }
    async editUser(req,res){
      if(req.user.isAdmin && req.user.isSuperAdmin){

          const { sapId } = req.params;
          const { sap_Id, year_join, year_passed } = req.body;
          const user = await Data.findOne({sap_Id:sapId})
          
          if(user){
            const alreadyuser = await Data.findOne({sap_Id:sap_Id})
            if(alreadyuser && Number(sapId) !== Number(sap_Id)){
              res.status(500).send({msg:"This sap id is already associated with another account."})
            } else {
            const user = await Data.findOneAndUpdate({sap_Id:sapId},{ sap_Id, year_join, year_passed })
            res.status(200).send({msg:`User with sapId ${sapId} edited successfully`})
            }
          }else{
            return res.status(500).send({msg:"User not found"});
          }
      }else{
           
        res.status(500).send({msg:"Only Super Admin is allowed to edit profile of students"})
      }
    }
    async dataForAdmin(req,res){
        if(req.user.isAdmin){

            const { sapId } = req.params;
            const user = await Data.findOne({sap_Id:sapId})
        
            const {sap_Id, email, name, contact_no, year_join, 
              year_passed, profile_pic, contribution, 
              academic_cgpa,internshipsArray, courseraArray, projectArray, cultural_activities, 
              sports_activities, NSS_activities, linkedin, achievementsArray,
              publicationArray, further_contributions, gre, ielts, gate, cat, gmat, tofel, resume } = user
        
        
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
            const coursera = await Promise.all(
              courseraArray.map((courseId) => {
                return Coursera.findById(courseId);
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
        
            res.status(200).send({ sap_Id, email,name, contact_no, year_join, 
              year_passed, profile_pic, contribution, 
              academic_cgpa,internships, coursera, projects, cultural_activities, 
              sports_activities, NSS_activities, linkedin, achievements,
              publications, further_contributions,  gre, ielts, gate, cat, gmat, tofel, resume
            })
        
          }else{
           
            res.status(500).send({msg:"Only Admin is allowed to view profile of students"})
          }
    }

    async getAllDocuments(req, res){
      if(req.user.isAdmin && req.user.isSuperAdmin){
        const documents = [];


        const internships = await Internship.find();
        internships.map((internship)=>{
          documents.push(internship.proof_link)
        })


        const achievements = await Achievement.find();
        achievements.map((achievement)=>{
          documents.push(achievement.proof_link)
        })

        const users = await Data.find();
        users.map((user)=>{
          if(user.resume !== ""){
            documents.push(user.resume)
          }

          if(user.profile_pic !== ""){
            documents.push(user.profile_pic)
          }
          
        })


        res.status(200).send({documents})
       
      }else{      
        res.status(500).send({msg:"Only Super Admin is allowed to view all documents"});
      }
    }

    async postData(req,res){
        const { sap_Id, name, contact_no, year_join, 
            year_passed, profile_pic, contribution, 
            academic_cgpa,internships, coursera, projects, cultural_activities, 
            sports_activities, NSS_activities, linkedin, achievements,
            publications, further_contributions, gre, ielts, gate, cat, gmat, tofel, resume, email
          } = await req.body ;
    let user = req.user

    if(user.sap_Id === sap_Id){

      try{

        let courseraArray = [];
        coursera.map( async (course)=>{
            const {  course_name, university, duration, sem, cert_link, level } = course;
            if(course._id){
                courseraArray.push(course._id);
                const data = { course_name, university, duration, sem, cert_link, level }
                const res = await Coursera.findOneAndUpdate({_id:course._id},{$set:data},{ returnDocument: 'after' })
                
            }else{
                const res = new Coursera({course_name, university, duration, sem, cert_link, level})
                courseraArray.push(res._id);
                await res.save();
            }
            
            
        })

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
            const {  description, proof_link } = achievement;
            if(achievement._id){
              achievementsArray.push(achievement._id);
                const data = {  description, proof_link }
                const res = await Achievement.findOneAndUpdate({_id:achievement._id},{$set:data},{ returnDocument: 'after' })

            } else {
              const res = new Achievement({ description, proof_link })
              achievementsArray.push(res._id);
              await res.save();
            }
          
            
        })

        const userData = {
            sap_Id, name, contact_no, year_join, 
            year_passed, profile_pic, contribution, 
            academic_cgpa, internshipsArray, courseraArray, projectArray, cultural_activities, 
            sports_activities, NSS_activities, linkedin, achievementsArray,
            publicationArray, further_contributions,  email, gre, ielts, gate, cat, gmat, tofel, resume, isUpdated: true
        }

        const data = await Data.findOneAndUpdate({sap_Id:sap_Id},{$set:userData},{ returnDocument: 'after' })
        console.log(data)
        res.status(200).send("Data saved successfully !!");

    }catch(err){

    console.log(err);
     return res.status(500).send({msg:err.message});

    }

    }else{
      res.status(500).send("User can only change his/her data")
    }
    }

}
module.exports = new DataController()
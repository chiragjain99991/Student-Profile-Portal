const Cgpa = require("../models/cgpa")
class CgpaController{
    async createNewCgpa(req, res){
       
        if(req.user.isAdmin && req.user.isSuperAdmin){
            const { year, cgpacount } = req.body;
            
            if(year === ""){
                 res.status(500).send({msg:"all fields are necessary"});
            }
            try{
                const cgpa = await Cgpa.create({ year, cgpacount });
                return res.status(200).send({cgpa});

            }catch(err){
                return res.status(500).send({msg:err.message});
            }
            
        }else{
           
            res.status(500).send({msg:"Only Super Admin is allowed to create cgpa"})
        }
    }
    async getCgpa(req, res){
        if(req.user.isAdmin && req.user.isSuperAdmin){
            try{
                const cgpas = await Cgpa.find({},null, {sort:{'year':-1}});
                return res.status(200).send({cgpas});

            }catch(err){
                return res.status(500).send({msg:err.message});
            }
        }else{
            
            res.status(500).send({msg:"Only Super Admin is allowed to edit cgpa"})

        }
        
    }
    async editCgpa(req, res){
        if(req.user.isAdmin && req.user.isSuperAdmin){
            const { year } = req.params;
            const { cgpacount } = req.body;
            try{
                const cgpa = await Cgpa.findOneAndUpdate({ year }, { $set: { year,cgpacount }},{ returnDocument: 'after' });
               
                return res.status(200).send({cgpa});
    
            }catch(err){
                return res.status(500).send({msg:err.message});
            }
            
        }else{
           
            res.status(500).send({msg:"Only Super Admin is allowed to edit cgpa"})

        }
      
        
    }
}

module.exports = new CgpaController();
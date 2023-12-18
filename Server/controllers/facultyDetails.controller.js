const facultyDetail = require("../models/facultyDetails.model.js");

const middleware = require("../util/middleware.js");

const checkServePage = (req,res) => {
    const checkToken = middleware.checkTokenAdmin(req,res);
    console.log(checkToken);
}


const createItem = async (req,res) => {

    /* id, email must be unique */
    const emailExists = await facultyDetail.findOne( {email: req.body.email} ).exec() != null ? true : false;
    const data = await facultyDetail.findOne( {id: req.body.id} ).exec() != null ? true : false;
    if (!emailExists && !data) {
        dataInstance = new facultyDetail({
            title: req.body.title,
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.body.image,
            status: req.body.status,
            department: req.body.department,
            designation:req.body.designation,
        });
    
        await dataInstance
        .save()
        .then((returnResponse) => res.send("data added to db"))
        .catch((err) => {console.log(err)});
    } 
    else {
        res.send('email address or employee id are already in use');
    }

};

const deleteItem = async (req,res) => {
    const data = await facultyDetail.findOne( {id: req.params.id} ).exec() != null ? true : false;

    if (!data) {
        res.send("you are trying to delete an item that does not exist");
    }
    else {
        await facultyDetail.findOneAndDelete( { id: req.params.id } )
        .then((ret) => res.send("data deleted"))
        .catch((err) => console.log(err));
    }
};

const updateItem = async (req,res) => {
    console.log(req.params.id);
    console.log(req.body);
    const data = await facultyDetail.find( {id: req.params.id} ).exec();
    console.log(data);
    if (data) {
        const newData = {
            title: req.body.title,
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.body.image,
            status: req.body.status,
            department: req.body.department,
            designation:req.body.designation,
        };
        
        await facultyDetail.findOneAndUpdate( { id: req.params.id }, newData ).exec();
        res.send("data updated");
    }
    else {
        res.send("something went wrong");
    }
};

const getOne = async (req,res) => {
    const data = await facultyDetail.find( {id: req.params.id} ).exec();
    if (data) {
        res.send(data[0]);
    }
    else {
        res.send("notfound")
    }

};

const getAll = async (req,res) => {
    const data = await facultyDetail.find( {} );
    res.send(data);

};



module.exports = { createItem, deleteItem, updateItem, getOne, getAll, checkServePage };
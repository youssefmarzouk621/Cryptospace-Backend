const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const relation = new mongoose.Schema({
    flag: {
        type: String
    },    
    user: {
        type: Schema.ObjectId,
        ref: 'users'
    }
},{timestamps:true})
const Relation = mongoose.model('relations', relation);
module.exports = {
    RelationModel : Relation,
    RelationSchema : relation
}
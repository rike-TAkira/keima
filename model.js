const config   = require('./config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(config.mongodb);
const AppSchema = new Schema({
    title : String,
    userid: String,
    date  : Date
});
mongoose.model('App', AppSchema);

function eq(x, k) {
    return function(_, y) {
        k(x == y);
    }
}

function neq(x, k) {
    return function(_, y) {
        k(x != y);
    }
}

function success(k) {
    return function(error, x) {
        if(!error){ return k(x); }
        else      { throw error; }
    }
}

const App = mongoose.model('App');
exports.App = {
    create : function(title, userid , k) {
        App.count({ title : title },
                  eq(0,
                     function(b) {
                         if(b){
                             const app = new App();
                             app.title  = title;
                             app.userid = userid;
                             app.date   = new Date();
                             app.save(k);
                         } else {
                             k("dup error")
                         }
                     }));
    },
    all : function(userid, k) {
        App.find({ userid : userid }).sort({'title' : 'asc'}).exec(success(k));
    },
    get : function(id, k) {
        App.findById(id, success(k));
    },
    update : function(id, obj, k) {
        obj.date = new Date();
        App.update({ _id : id }, obj, success(k));
    },
    remove : function(id, k) {
        App.remove({ _id : id }, success(k));
    }
}

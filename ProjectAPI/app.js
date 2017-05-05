/**
 * Created by moutasem on 02.05.2017.
 */
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    router = express.Router(),
    Task = require('./app/models/task.js');
port = process.env.PORT || 4000;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/project');


//configure app routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(port, () => console.log(`listening to *:${port}`));
app.use('/api', router);


//general logger
router.use((req, resp, next) => {
    console.log(`request made to ${req.url}`);
    next();
});

// POST: /tasks
router.post('/tasks', (req, resp) => {
    var task = new Task();
    task.name = req.body.name;
    task.category = req.body.category;
    task.creator = req.body.creator;

    task.save((err) => {
        if (err) {
            resp.status(400);
            resp.json(err);
        }
        resp.status(201);
        resp.json({message: "task created successfully"});
    });

});

// GET: /tasks
router.get('/tasks', (req, resp) => {
    var task = new Task();
    Task.find((err, docs) => {
        if (err) {
            resp.status(400);
            resp.json(err);
        }
        resp.status(200);
        resp.json(docs);
    });
});


//GET /tasks/:task_id
router.get('/tasks/:task_id', (req, resp) => {
    Task.findById(req.params.task_id, (err, doc) => {
        if (err) {
            resp.status(400);
            resp.json(err);
        }
        resp.status(200);
        resp.json(doc);
    });
});

//PUT /tasks/:task_id
router.put('/tasks/:task_id', (req, resp) => {
    Task.findById(req.params.task_id, (err, task) => {
        if (err) {
            resp.status(400);
            resp.json(err);
        }
        console.log(req.body);
        task.name = req.body.name;
        task.category = req.body.category;

        task.save((err) => {
            if (err) {
                res.send(err);
            }

            resp.status(200);
            resp.json({message: " updated successfully"});

        });
    });
});


//DELETE /tasks/task_id
router.delete('/tasks/:task_id', (req, resp) => {
    Task.remove({
        _id : req.params.task_id
    },(err, task)=>{
        if (err) {
            resp.status(400);
            resp.send(err);
        }

        resp.status(200);
        resp.json({message: `object with _id: ${req.params.task_id} , was deleted successfully`});
    });
});
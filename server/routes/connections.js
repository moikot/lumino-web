var Connection = require('../models/connection');
var express = require('express');
var router = express.Router();

router.route('/connections')
  .get(function(req, res) {
    Connection.find(function(err, connections) {
      if (err) {
        return res.send(err);
      }
      res.json(connections);
    });
  })
  .post(function(req, res) {
    var connection = new Connection(req.body);

    connection.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.send({ message: 'Connection Added' });
  });
});

router.route('/connections/:id')
  .put(function(req,res){
    Connection.findOne({ _id: req.params.id }, function(err, connection) {
      if (err) {
        return res.send(err);
      }

      for (var prop in req.body) {
        connection[prop] = req.body[prop];
      }

      // save the connection
      connection.save(function(err) {
        if (err) {
          return res.send(err);
        }

        res.json({ message: 'Connection updated!' });
      });
    });
  })
  .get(function(req, res) {
    Connection.findOne({ _id: req.params.id}, function(err, connection) {
      if (err) {
        return res.send(err);
      }

      res.json(connection);
    });
  })
  .delete(function(req, res) {
    Connection.remove({
      _id: req.params.id
    }, function(err, connection) {
      if (err) {
        return res.send(err);
      }
      res.json({ message: 'Connection successfully deleted' });
    });
});

module.exports = router;
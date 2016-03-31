"use strict";
var express = require('express');
var router = express.Router();
var ticketModel = require('../models/ticket');
var Ticket = ticketModel.Ticket;
//utility function to check if user is authenticated
function requireAuth(req, res, next) {
    //check if user is log in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}
//get tickets page
router.get('/', requireAuth, function (req, res, next) {
    var typeUser = req.user ? req.user.type : '';
    if (typeUser == 'Admin') {
        //use the Ticket model to query the Tickets collection
        Ticket.find(function (error, tickets) {
            if (error) {
                console.log(error);
                res.end(error);
            }
            else {
                //no error, list of tickets
                res.render('tickets/index', {
                    title: 'Tickets',
                    tickets: tickets,
                    typeU: typeUser,
                    displayName: req.user ? req.user.displayName : ''
                });
            }
        });
    }
    else {
        res.redirect('/users');
    }
});
// get add page
router.get('/add', requireAuth, function (req, res, next) {
    res.render('tickets/add', {
        title: 'Create New Ticket',
        displayName: req.user ? req.user.displayName : ''
    });
});
// POST add page - save the new ticket
router.post('/add', requireAuth, function (req, res, next) {
    Ticket.create({
        ticketTitle: req.body.ticketTitle,
        ticketDescription: req.body.ticketDescription,
        ticketPriority: req.body.ticketPriority,
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        incidentNarrative: { comment: 'Ticket submitted' }
    }, function (error, Ticket) {
        // did we get back an error or valid Ticket object?
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/tickets');
        }
    });
});
// GET edit page - show the current ticket in the form
router.get('/:id', requireAuth, function (req, res, next) {
    var id = req.params.id;
    Ticket.findById(id, function (error, Ticket) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //show the edit view
            res.render('tickets/edit', {
                title: 'Ticket Details',
                ticket: Ticket,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
// POST edit page - update the selected ticket
router.post('/:id', requireAuth, function (req, res, next) {
    // grab the id from the url parameter
    var id = req.params.id;
    // create and populate a ticket object
    var ticket = new Ticket({
        _id: id,
        ticketTitle: req.body.ticketTitle,
        ticketDescription: req.body.ticketDescription,
        ticketPriority: req.body.ticketPriority,
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        ticketStatus: req.body.ticketStatus,
        incidentNarrative: [{
                comment: req.body.comment
            }],
    });
    var incidentComment = req.body.comment;
    var incidentStatus = req.body.ticketStatus;
    // run the update using mongoose and our model
    Ticket.update({ _id: id }, { $push: { incidentNarrative: { comment: incidentComment, ticketStatus: incidentStatus } } }, function (error) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //if success update
            res.redirect('/tickets');
        }
    });
});
// make this public
module.exports = router;

//# sourceMappingURL=tickets.js.map

"use strict";
var mongoose = require('mongoose');
// Define object schema
var ticketSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        default: Date.now
    },
    ticketNumber: {
        type: String,
        default: Date.now
    },
    ticketTitle: {
        type: String,
        default: '',
        trim: true,
        required: 'Ticket Title is required'
    },
    ticketDescription: {
        type: String,
        default: '',
        trim: true,
        required: 'Ticket Description is required'
    },
    ticketPriority: {
        type: String,
        enum: ['HIGH', 'MEDIUM', 'LOW'],
        default: 'LOW',
        trim: true,
        required: 'Ticket Priority is required'
    },
    customerName: {
        type: String,
        default: '',
        trim: true,
        required: 'Customer Name is required'
    },
    customerPhone: {
        type: String,
        default: '',
        trim: true,
        required: 'Customer Phone is required'
    },
    incidentNarrative: [{
            commentDate: {
                type: Date,
                default: Date.now
            },
            comment: String,
            ticketStatus: {
                type: String,
                enum: ['NEW', 'IN PROGRESS', 'CLOSED'],
                default: 'NEW',
                trim: true,
                required: 'Ticket Status is required'
            }
        }]
});
exports.Ticket = mongoose.model('Ticket', ticketSchema);

//# sourceMappingURL=ticket.js.map

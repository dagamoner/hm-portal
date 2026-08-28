const ical = require('ical-generator').default;

const calendar = ical({ 
    name: 'MH Calendario',
    prodId: '//MH//Higiene y Seguridad//ES'
});
calendar.createEvent({
    start: new Date(),
    end: new Date(),
    summary: 'Test Event'
});
console.log(calendar.toString());

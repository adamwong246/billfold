Roommates = new Meteor.Collection("roommates");
Bills     = new Meteor.Collection("bills");
Payments  = new Meteor.Collection('payment');

Handlebars.registerHelper("prettifyDate", function(date) {
  return date.toISOString().substring(0, 10);
});

if (Meteor.isClient) {

  Template.grid.roommates = function () {return Roommates.find({});};
  Template.grid.bills     = function () {return Bills.find({});};
  Template.grid.payments  = function () {return Payments.find({});};

  Template.grid.owed = function (options) {
    var roommate = Roommates.findOne(options.hash.roommate_id);
    var bill = Bills.findOne(options.hash.bill_id);

    if (bill && roommate ) {
      if ((roommate.arrival_date <= bill.departure_date) && (roommate.departure_date >= bill.arrival_date)) {

        // the difference in days of the bill's timespan
        var timeDiff = Math.abs(bill.departure_date.getTime() - bill.arrival_date.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        // range to calculate over
        var lesser  = new Date(Math.max  (roommate.arrival_date, bill.arrival_date));
        var greater = new Date(Math.min  (roommate.departure_date, bill.departure_date));

        var accumulator = 0;

        for (var d = lesser; d < greater; d.setDate(d.getDate() + 1)) {

          // number of roommates present on this day
          var roommate_count = Roommates.find({ arrival_date: { $lt: d }, departure_date: { $gt: d } }).count();
          
          // prevent division by zero
          if (roommate_count > 0){
            // add to accumulated total payment for user and bill
            accumulator += ((bill.amount / roommate_count)/diffDays);
          }

        }

        return accumulator;
      }

      return 0;
    } else {
      return 'fail';
    }
  };

  Template.grid.paid = function (options) {
    payment = Payments.findOne({bill_id: options.hash.bill_id, roommate_id: options.hash.roommate_id});

    if (payment){
      return payment;
    } else{
      return "nada";
    }
    // return 'derp';
  };

  Template.payment.payer_name = function(payer_id) {
    return Roommates.findOne(payer_id).name;
  }

  Template.grid.events({

    'submit form.new_roommate': function(event) {
      Roommates.insert({
        name: event.target.elements.namedItem('name').value,
        arrival_date: new Date(event.target.elements.namedItem('arrival_date').value),
        departure_date: new Date(event.target.elements.namedItem('departure_date').value),
      });
    },

    'submit form.new_bill': function(event) {
      Bills.insert({
        name: event.target.elements.namedItem('name').value,
        arrival_date:new Date(event.target.elements.namedItem('arrival_date').value),
        departure_date: new Date(event.target.elements.namedItem('departure_date').value),
        amount: event.target.elements.namedItem('amount').value
      });
    },

    'submit form.new_payment': function(event) {
      console.log(event.target.elements.namedItem('payer'));
      Payments.insert({
        payer: event.target.elements.namedItem('payer').value,
        amount: event.target.elements.namedItem('amount').value
      });
    }
  });

  Template.roommate.events({

    'click input.delete_roommate': function (event) {
      Roommates.remove(event.target.dataset.roommateid);
    },

    "blur input[name='name']": function (event) {
      Roommates.update(event.target.dataset.roommateid, {$set: {name: event.target.value}});
    },

    "blur input[name='arrival_date']": function (event) {
      Roommates.update(event.target.dataset.roommateid, {$set: {arrival_date: new Date(event.target.value)}});
    },
    
    "blur input[name='departure_date']": function (event) {
      Roommates.update(event.target.dataset.roommateid, {$set: {departure_date: new Date(event.target.value)}});
    }
  });

  Template.bill.events({

    'click input.delete_bill': function (event) {
      Bills.remove(event.target.dataset.billid);
    },

    "blur input[name='name']": function (event) {
      Bills.update(event.target.dataset.billid, {$set: {name: event.target.value}});
    },

    "blur input[name='amount']": function (event) {
      Bills.update(event.target.dataset.billid, {$set: {amount: event.target.value}});
    },

    "blur input[name='arrival_date']": function (event) {
      Bills.update(event.target.dataset.billid, {$set: {arrival_date: new Date(event.target.value)}});
    },
    
    "blur input[name='departure_date']": function (event) {
      Bills.update(event.target.dataset.billid, {$set: {departure_date: new Date(event.target.value)}});
    }

  });

  Template.payment.events({

    'click input.delete_payment': function (event) {
      Payments.remove(event.target.dataset.paymentid);
    },
  });

}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    
    // if (Roommates.find().count() === 0) {
    //   var names = ["Ada Lovelace",
    //                "Grace Hopper",
    //                "Marie Curie",
    //                "Carl Friedrich Gauss",
    //                "Nikola Tesla",
    //                "Claude Shannon"];
    //   for (var i = 0; i < names.length; i++)
    //     Roommates.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    // }

    // if (Bills.find().count() === 0) {
    //   [
    //     {
    //       "name":"electric",
    //       "amount":"99.87",
    //       "start_date": moment().subtract('days', 10).calendar(),
    //       "end_date": moment().add('days', 20).calendar()
    //     }
    //   ]
      // var b_names = ["Electric",
      //              "Water"];
      // for (var j = 0; j < b_names.length; j++)
      //   Bills.insert({
      //     name: b_names[j],
      //     score: Math.floor(Random.fraction()*10)*5});
    // }

  });
}

UserBills = new Meteor.Collection("user_bills");
Bills     = new Meteor.Collection("bills");
Payments  = new Meteor.Collection('payment');

Handlebars.registerHelper("prettifyDate", function(date) {
  if (date == null) {
    return date;
  } else {
    return date.toISOString().substring(0, 10);
  }
});

Handlebars.registerHelper("identify", function(thing){
  return JSON.stringify(thing);
});

Handlebars.registerHelper("identify_user", function(user){
  var u = Meteor.users.findOne(user,{
      fields: {
        emails: 1,
        _id: 1
      }
  });
  return u && u.emails ? u.emails[0].address : "";
});

Handlebars.registerHelper("identify_bill", function(bill){
  var b = Bills.findOne(bill);
  return b && b.name ? b.name : "";
});

if (Meteor.isClient) {

  Template.grid.users = function (){
    return Meteor.users.find({}, {
      fields: {
        emails: 1,
        _id: 1
      }
    });
  };

  Template.grid.user_bills = function () {return UserBills.find({});};
  Template.grid.bills     = function () {return Bills.find({});};
  Template.grid.payments  = function () {return Payments.find({});};

  Template.user_bill.owed = function () {
    return ownage(this);
  };

  Template.grid.user_owes_user = function(option){
    if (option.hash.payer._id != option.hash.payee._id){
      var payer = Meteor.users.findOne(option.hash.payer);
      var payee = Meteor.users.findOne(option.hash.payee);
      var user_bills = UserBills.find({user: payee._id});

      if (user_bills.count() > 0){
        return user_bills.fetch().reduce(function(previousValue, user_bill, index, array){
          return previousValue + ownage(user_bill);
        }, 0);
      } else {
        return 0;
      }
    } else {
      return "na";
    }

  };

  Template.grid.paid = function (options) {
    payment = Payments.findOne({bill_id: options.hash.bill_id, roommate_id: options.hash.roommate_id});
    if (payment){
      return payment;
    } else{
      return "nada";
    }
  };

  Template.grid.events({

    // 'submit form.new_roommate': function(event) {
    //   UserBills.insert({
    //     name: event.target.elements.namedItem('name').value,
    //     arrival_date: new Date(event.target.elements.namedItem('arrival_date').value),
    //     departure_date: new Date(event.target.elements.namedItem('departure_date').value),
    //   });
    // },

    'submit form.new_bill': function(event) {
      Bills.insert({
        name: event.target.elements.namedItem('name').value,
        arrival_date: (
          (event.target.elements.namedItem('arrival_date').value == "") ? null : new Date(event.target.elements.namedItem('arrival_date').value)
        ),
        departure_date: (
          (event.target.elements.namedItem('departure_date').value == "") ? null : new Date(event.target.elements.namedItem('departure_date').value)
        ),
        amount: event.target.elements.namedItem('amount').value,
        owner: event.target.elements.namedItem('owner').value
      });
    },

    'submit form.new_user_bill': function(event) {
      console.log(event);
      UserBills.insert({
        user: event.target.elements.namedItem('user').value,
        bill: event.target.elements.namedItem('bill').value,
        arrival_date: (
          (event.target.elements.namedItem('arrival_date').value == "") ? null : new Date(event.target.elements.namedItem('arrival_date').value)
        ),
        departure_date: (
          (event.target.elements.namedItem('departure_date').value == "") ? null : new Date(event.target.elements.namedItem('departure_date').value)
        ),
      });
    },

    'submit form.new_payment': function(event) {
      Payments.insert({
        payer: event.target.elements.namedItem('payer').value,
        payee: event.target.elements.namedItem('payee').value,
        amount: event.target.elements.namedItem('amount').value
      });
    },

    'click input.delete_bill': function (event) {
      Bills.remove(event.target.dataset.billid);
    },

    'click input.delete_user_bill': function (event) {
      UserBills.remove(event.target.dataset.userbillid);
    },
    
    'click input.delete_payment': function (event) {
      Payments.remove(event.target.dataset.paymentid);
    },

    // "blur input[name='name']": function (event) {
    //   UserBills.update(event.target.dataset.roommateid, {$set: {name: event.target.value}});
    // },

    // "blur input[name='arrival_date']": function (event) {
    //   UserBills.update(event.target.dataset.roommateid, {$set: {arrival_date: new Date(event.target.value)}});
    // },
    
    // "blur input[name='departure_date']": function (event) {
    //   UserBills.update(event.target.dataset.roommateid, {$set: {departure_date: new Date(event.target.value)}});
    // },

    // "blur input[name='name']": function (event) {
    //   Bills.update(event.target.dataset.billid, {$set: {name: event.target.value}});
    // },

    // "blur input[name='amount']": function (event) {
    //   Bills.update(event.target.dataset.billid, {$set: {amount: event.target.value}});
    // },

    // "blur input[name='arrival_date']": function (event) {
    //   Bills.update(event.target.dataset.billid, {$set: {arrival_date: new Date(event.target.value)}});
    // },
    
    // "blur input[name='departure_date']": function (event) {
    //   Bills.update(event.target.dataset.billid, {$set: {departure_date: new Date(event.target.value)}});
    // },

    // 'click input.delete_payment': function (event) {
    //   Payments.remove(event.target.dataset.paymentid);
    // },
  });

}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    
    Meteor.publish(null, function() {
      return Meteor.users.find({}, {
        fields: {
          emails: 1
        }
      });
    });

    // if (UserBills.find().count() === 0) {
    //   var names = ["Ada Lovelace",
    //                "Grace Hopper",
    //                "Marie Curie",
    //                "Carl Friedrich Gauss",
    //                "Nikola Tesla",
    //                "Claude Shannon"];
    //   for (var i = 0; i < names.length; i++)
    //     UserBills.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
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

function ownage(user_bill) {
  var user = Meteor.users.findOne(user_bill.user);
  var bill = Bills.findOne(user_bill.bill);

  if (bill && user ) {
    if ((user_bill.arrival_date <= bill.departure_date) && (user_bill.departure_date >= bill.arrival_date)) {

      // the difference in days of the bill's timespan
      var timeDiff = Math.abs(bill.departure_date.getTime() - bill.arrival_date.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // range to calculate over
      var lesser  = new Date(Math.max  (user_bill.arrival_date, bill.arrival_date));
      var greater = new Date(Math.min  (user_bill.departure_date, bill.departure_date));

      var accumulator = 0;

      for (var d = lesser; d < greater; d.setDate(d.getDate() + 1)) {

        // number of UserBills present on this day
        var user_count = UserBills.find({ arrival_date: { $lt: d }, departure_date: { $gt: d }, bill: bill._id }).count();
        
        // prevent division by zero
        if (user_count > 0){
          // add to accumulated total payment for user and bill
          accumulator += ((bill.amount / user_count)/diffDays);
        }

      }

      return accumulator;
    }

    return 0;
  } else {
    return 'fail';
  }
}


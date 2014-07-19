// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Roommates = new Meteor.Collection("roommates");
Bills = new Meteor.Collection("bills"); // These are divided equally amongst all roommates

if (Meteor.isClient) {
  Template.grid.roommates = function () {
    return Roommates.find({});
  };

  Template.grid.bills = function () {
    return Bills.find({});
  };

  Template.grid.bill_roommate = function (roommate_id, bill_id) {
    // var roommate = Roommates.findOne(roommate_id);
    // var bill = Bills.findOne(bill_id);
    // return bill.name;
    return "foo";
  };

  Template.grid.events({

    'submit form.new_roommate': function(event) {
      Roommates.insert({
        name: event.target.elements.namedItem('name').value,
        arrival_date: event.target.elements.namedItem('arrival_date').value,
        departure_date: event.target.elements.namedItem('departure_date').value
      });
    },

    'submit form.new_bill': function(event) {
      Bills.insert({
        name: event.target.elements.namedItem('name').value,
        arrival_date: event.target.elements.namedItem('arrival_date').value,
        departure_date: event.target.elements.namedItem('departure_date').value,
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
      Roommates.update(event.target.dataset.roommateid, {$set: {arrival_date: event.target.value}});
    },
    
    "blur input[name='departure_date']": function (event) {
      Roommates.update(event.target.dataset.roommateid, {$set: {departure_date: event.target.value}});
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
      Bills.update(event.target.dataset.billid, {$set: {arrival_date: event.target.value}});
    },
    
    "blur input[name='departure_date']": function (event) {
      Bills.update(event.target.dataset.billid, {$set: {departure_date: event.target.value}});
    }

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

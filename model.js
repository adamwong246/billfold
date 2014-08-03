UserBills = new Meteor.Collection("user_bills");
Bills     = new Meteor.Collection("bills");
Payments  = new Meteor.Collection('payments');

// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     Meteor.publish(null, function() {
//       return Meteor.users.find({}, {
//         fields: {
//           emails: 1
//         }
//       });
//     });
//   });
// }


Roles.addUsersToRoles('dciT5bjoaHHCTAiWx', 'admin');

Meteor.publish('user_bills', function() {
  return UserBills.find({});
});

Meteor.publish('bills', function() {
  return Bills.find({});
});

Meteor.publish('payments', function() {
  return Payments.find({});
});

Meteor.publish('users', function() {
  return Meteor.users.find({});
});

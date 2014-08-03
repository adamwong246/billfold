Meteor.publish(null, function() {
  return Meteor.users.find({}, {
    fields: {
      emails: 1
    }
  });
});

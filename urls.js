var urls = [
  // 'api/ticket/2/requestNumber?include=assignedAgent,user,user.phonenumber,user.phonenumbers,user.emailAddress,user.emailAddresses,user.address,user.company,user.memberships,form,form.datas,tasks',
  // 'api/ticket/4/requestNumber?include=assignedAgent,user,user.phonenumber,user.phonenumbers,user.emailAddress,user.emailAddresses,user.address,user.company,user.memberships,form,form.datas,tasks',
  // 'api/ticket/9/requestNumber?include=assignedAgent,user,user.phonenumber,user.phonenumbers,user.emailAddress,user.emailAddresses,user.address,user.company,user.memberships,form,form.datas,tasks',
  // 'api/ticket/7/requestNumber?include=assignedAgent,user,user.phonenumber,user.phonenumbers,user.emailAddress,user.emailAddresses,user.address,user.company,user.memberships,form,form.datas,tasks',
  'api/status',
  // 'api/user?include=emailAddresses,phonenumbers,memberships,memberships.team,credentials,address,emailAddress,phonenumber&id=30',
  'api/user/1?include=memberships,credentials,address,emailAddress,emailAddresses,phonenumber,phonenumbers',
  'api/listdefinition'
];




module.exports = {
  getEndpoints: function(environment){
    //TODO: Create different endponts to diff environments
    return urls;
  }
}

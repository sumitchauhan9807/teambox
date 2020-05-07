exports.sendTeamConfirmationMail = (emailData)=>{
    const emailHTML = `
        <h1>Hello, ${emailData.team_name} admin</h1>
        <p>To confirm you email and activate team please click the button below</p>
        <a href="${emailData.teamActivateLink}">Activate team</a>`;
        return emailHTML;
}
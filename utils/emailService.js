const transporter = require('../config/emailConfig');

async function sendWelcomeEmail(toEmail, username) {
  const mailOptions = {
    from: `"HR Task Management" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Welcome to HR Task Management!',
    text: `Hi ${username},\n\nThanks for signing up! We're excited to have you onboard.\n\nBest,\nHR Task Management Team`,
    html: `<p>Hi <b>${username}</b>,</p><p>Thanks for signing up! We're excited to have you onboard.</p><p>Best,<br>HR Task Management Team</p>`,
  };

  await transporter.sendMail(mailOptions);
}
async function sendTaskAssignmentEmail(toEmail, username, task) {
  const mailOptions = {
    from: `"HR Task Management" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `New Task Assigned: ${task.title}`,
    text: `Hi ${username},\n\nA new task titled "${task.title}" has been assigned to you.\nDescription: ${task.description}\nDue Date: ${task.dueDate}\n\nPlease check your dashboard for details.\n\nBest,\nYourAppName Team`,
    html: `<p>Hi <b>${username}</b>,</p>
           <p>A new task titled "<b>${task.title}</b>" has been assigned to you.</p>
           <p><b>Description:</b> ${task.description}</p>
           <p><b>Due Date:</b> ${task.dueDate}</p>
           <p>Please check your dashboard for details.</p>
           <p>Best,<br>YourAppName Team</p>`,
  };
  await transporter.sendMail(mailOptions);
}

async function sendTaskStatusUpdateEmail(toEmail, username, task) {
  const mailOptions = {
    from: `"HR Task Management" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Task Status Updated: ${task.title}`,
    text: `Hi ${username},\n\nThe status of your task "${task.title}" has been updated to "${task.status}".\n\nKeep up the good work!\n\nBest,\nYourAppName Team`,
    html: `<p>Hi <b>${username}</b>,</p>
           <p>The status of your task "<b>${task.title}</b>" has been updated to "<b>${task.status}</b>".</p>
           <p>Keep up the good work!</p>
           <p>Best,<br>YourAppName Team</p>`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendWelcomeEmail,
  sendTaskAssignmentEmail,
  sendTaskStatusUpdateEmail,
};

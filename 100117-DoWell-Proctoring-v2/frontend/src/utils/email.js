import axios from "axios";

const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to join event</title>
</head>
<body>
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:100px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="#" style="font-size:1.2em;color: #00466a;text-decoration:none;font-weight:600">Dowell UX Living Lab</a>
          </div>
          <p style="font-size:1.1em">You have been invited to join this event</p>
          <p style="font-size:1.1em">{message}</p>
        </div>
      </div>
</body>
</html>
`;

const sendEmail = async (message, email, newEvent) => {
  try {
    const emailContent = emailTemplate.replace("{message}", message);

    const response = await axios.post(
      "https://100085.pythonanywhere.com/api/dowell_bulk_email/",
      {
        to_email_list: email,
        fromname: "Manish",
        fromemail: "manish@dowellresearch.in",
        subject: `Dowell Proctoring: Invitation to join ${newEvent}`,
        email_content: emailContent,
      }
    );

    console.log("Email sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export { sendEmail };

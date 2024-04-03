import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(subject, recipient, body):
    sender = "webmaster@secure-cloud.co.za"
    password = "S3cureLog1nR00t"

    # Create the email message
    msg = MIMEMultipart()
    msg["From"] = sender
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    # Send the email
    with smtplib.SMTP("mail.ultracloud.co.za", 587) as server:
        server.starttls()
        server.login(sender, password)
        server.send_message(msg)

    print("Email sent successfully!")

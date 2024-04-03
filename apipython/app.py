import datetime
import bcrypt
import os
import psycopg2
import git
import json
from flask import Flask, request, send_file, jsonify, send_from_directory
from flask_restx import Api, Resource, fields, Namespace
from apscheduler.schedulers.background import BackgroundScheduler
from send_email import send_email
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options


app = Flask(__name__)

CORS(app)
api = Api(app, version='1.0', title='Swagger API Interface', description='A simple API Service')
ns = Namespace('API', description='API End-Points')
api.add_namespace(ns)

app.config['JWT_SECRET_KEY'] = '7ebb0fc376c3b114376cc79789f997eb' 

jwt = JWTManager(app)

db_config = {
    'dbname': 'apigithub',
    'user': 'postgres',
    'password': 'S3cureLog1nR00t',
    'host': '192.168.2.86',
    'port': '5432'
}


@app.route('/screenshots/<filename>')
def serve_screenshot(filename):
    path = f'/home/auditech/screenshots/{filename}'
    return send_file(path, mimetype='image/png')


def take_screenshot(pull_request_url, screenshot_path):
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode.
    chrome_options.add_argument('--no-sandbox')  # Bypass OS security model
    chrome_options.add_argument('--disable-dev-shm-usage')  # Overcome limited resource problems

    chromedriver_path = '/usr/local/bin/chromedriver-linux64/chromedriver'
    chrome_service = Service(executable_path=chromedriver_path)

    driver = webdriver.Chrome(service=chrome_service, options=chrome_options)

    try:
        driver.get(pull_request_url)
        driver.save_screenshot(screenshot_path)
    finally:
        driver.quit()

@ns.route('/github')
class GitHubWebhook(Resource):
    def post(self):
        event_type = request.headers.get('X-GitHub-Event', 'unknown')
        payload = request.json

        pull_request_id = payload.get('pull_request', {}).get('id')
        
        if pull_request_id:
            screenshot_filename = f"{pull_request_id}.png"
            screenshot_path = f'/home/auditech/screenshots/{screenshot_filename}'

            pull_request_url = payload.get('pull_request', {}).get('html_url')
            if pull_request_url:

                take_screenshot(pull_request_url, screenshot_path)
        else:
            return {'error': 'Pull request ID not found in payload'}, 400

        try:
            conn = psycopg2.connect(**db_config)
            cur = conn.cursor()

            insert_sql = """INSERT INTO github_notifications 
                            (event_type, title, state, pull_request_id, pull_request_url, screenshot_path, received_at) 
                            VALUES (%s, %s, %s, %s, %s, %s, now())"""
            cur.execute(insert_sql, (
                event_type,
                payload.get('pull_request', {}).get('title'),
                payload.get('pull_request', {}).get('state'),
                pull_request_id,
                pull_request_url,
                screenshot_path
            ))
            conn.commit()
        except Exception as e:
            print(f"Failed to Log The Webhook: {e}")
            return {'error': 'Failed to Process Webhook'}, 500
        finally:
            if conn:
                cur.close()
                conn.close()

        return {'message': 'Webhook Received & Processed'}


@ns.route('/test_db_connection')
class TestDBConnection(Resource):
    def get(self):
        response = {"connection": "Failed", "create_table": "Failed", "drop_table": "Failed"}
        try:
            conn = psycopg2.connect(**db_config)
            cur = conn.cursor()
            response["connection"] = "Successful"
   
            try:
                cur.execute("CREATE TABLE db_connection_test (id SERIAL PRIMARY KEY, comment TEXT);")
                conn.commit()
                response["create_table"] = "Successful"

                cur.execute("DROP TABLE db_connection_test;")
                conn.commit()
                response["drop_table"] = "Successful"
            except Exception as e:
                print(e)
                conn.rollback()
            finally:
                cur.close()
                conn.close()
        except Exception as e:
            print(e)
        return (response)


email_model = ns.model('Email', {
    'recipient': fields.String(required=True, description='The recipient email address'),
})


@ns.route('/send-test-email')
class SendTestEmail(Resource):
    @ns.expect(email_model, validate=True)
    def post(self):
 
        data = request.json
        recipient = data['recipient']       
        # Hardcoded subject and body
        subject = "Secure-Cloud Test Email"
        body = "This is a system generated test email from Secure-Cloud."
        try:
            send_email(subject, recipient, body)
            return {"message": f"Test email sent successfully to {recipient}"}
        except Exception as e:
            return {"error": str(e)}, 500


@ns.route('/manual_pull_repo')
class ManualPullRepo(Resource):
    def get(self):
        repo_path = "/home/auditech/repos/manualapigithub/"
        git_url = "https://github.com/gavinultracloud/AudITech.git"
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        # Initialize response with failed status
        response = {
            "timestamp": timestamp,
            "status": "Failed",
            "response": ""
        }

        try:
            try:
                repo = git.Repo(repo_path)
            except git.exc.NoSuchPathError:
                # If the repo does not exist, clone it
                repo = git.Repo.clone_from(git_url, repo_path)

            origin = repo.remotes.origin
            origin.pull()
            response["status"] = "Success"
            response["response"] = "Repository Pulled Successfully."
        except Exception as e:
            response["response"] = str(e)

        try:
            conn = psycopg2.connect(**db_config)
            cur = conn.cursor()
            insert_sql = "INSERT INTO pull_request_logs (timestamp, status, response) VALUES (%s, %s, %s)"
            cur.execute(insert_sql, (timestamp, response["status"], response["response"]))
            conn.commit()
            cur.close()
            conn.close()
        except Exception as e:
            print(f"Failed to log the manual pull request: {e}")
            # Optionally, update the response to indicate database logging failed
            response["response"] += f" Logging to database failed: {e}"

        return (response)

login_model = api.model('Login', {
    'emailAddress': fields.String(required=True, description='The user email address', example='string'),
    'password': fields.String(required=True, description='The user password', example='string'),
})


@ns.route('/login')
class Login(Resource):
    @ns.expect(login_model, validate=True)
    def post(self):
        req_data = request.get_json()
        emailAddress = req_data['emailAddress']
        password = req_data['password']

        response = {
            "emailAddressState": "No Db Response emailAddress",
            "passwordState": "No Db Response password",
            "loginState": "Login Invalid"
        }

        try:
            conn = psycopg2.connect(**db_config)
            cur = conn.cursor()

            cur.execute("SELECT password FROM userDetails WHERE emailAddress = %s", (emailAddress,))
            user = cur.fetchone()

            if user:
                response["emailAddressState"] = "Authenticated emailAddress"
                
                if bcrypt.checkpw(password.encode('utf-8'), user[0].encode('utf-8')):
                    response["passwordState"] = "Authenticated password"
                    response["loginState"] = "Login Successful"
                    
                    # Generate JWT Token when login is successful
                    access_token = create_access_token(identity=emailAddress)
                    response["access_token"] = access_token  # Include the token in the response
                    
                else:
                    response["passwordState"] = "Invalid password"
            else:
                response["emailAddressState"] = "Invalid emailAddress"
                
        except Exception as e:
            print(e)
        finally:
            if conn:
                cur.close()
                conn.close()

        return (response)

# Define the model for user email input
user_email_model = ns.model('UserEmail', {
    'emailAddress': fields.String(required=True, description='The user email address')
})

@ns.route('/get_user_details')
class GetUserDetails(Resource):
    @ns.expect(user_email_model, validate=True)
    def post(self):
        req_data = request.get_json()
        emailAddress = req_data['emailAddress']

        try:
            conn = psycopg2.connect(**db_config)
            cur = conn.cursor()
            cur.execute("SELECT firstName, surname, cellPhone, emailAddress FROM userDetails WHERE emailAddress = %s", (emailAddress,))
            user_details = cur.fetchone()
            
            if user_details:
                response = {
                    "firstName": user_details[0], 
                    "surname": user_details[1], 
                    "cellPhone": user_details[2], 
                    "emailAddress": user_details[3]
                }
                return response
            else:
                return {"message": "User not found"}, 404
        except Exception as e:
            return {"error": str(e)}, 500
        finally:
            if conn:
                cur.close()
                conn.close()


@ns.route('/register')
class Register(Resource):
    @ns.expect(api.model('Register', {
        'emailAddress': fields.String(required=True, description='User email address'),
        'firstName': fields.String(required=True, description='User first name'),
        'surname': fields.String(required=True, description='User surname'),
        'cellPhone': fields.String(required=True, description='User cell phone number'),
        'password': fields.String(required=True, description='User password'),
    }))
    def post(self):
        data = request.get_json()
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        try:
            conn = psycopg2.connect(**db_config)
            cur = conn.cursor()
            cur.execute("INSERT INTO userDetails (emailAddress, firstName, surname, cellPhone, password) VALUES (%s, %s, %s, %s, %s)",
                        (data['emailAddress'], data['firstName'], data['surname'], data['cellPhone'], hashed_password))
            conn.commit()
            return ({"message": "User registered successfully"}), 201
        except Exception as e:
            return ({"error": str(e)}), 500
        finally:
            cur.close()
            conn.close()


@ns.route('/pull_request_logs')
class PullRequestLogs(Resource):
    def get(self):
        try:
            conn = psycopg2.connect(**db_config)
            cur = conn.cursor()
            # Update the SELECT statement to fetch new fields
            cur.execute("""
                SELECT event_type, title, state, pull_request_id, pull_request_url, screenshot_path, received_at
                FROM github_notifications
                ORDER BY received_at DESC
            """)
            logs = cur.fetchall()
            response = [{
                "event_type": log[0],
                "title": log[1],
                "state": log[2],
                "pull_request_id": log[3],
                "pull_request_url": log[4],
                "screenshot_path": log[5],
                "received_at": log[6].isoformat() if isinstance(log[6], datetime.datetime) else log[6]
            } for log in logs]
            return response
        except Exception as e:
            return {"error": str(e)}, 500
        finally:
            if conn:
                cur.close()
                conn.close()


os.environ['GIT_SSH_COMMAND'] = 'ssh -i /root/.ssh/id_rsa -o IdentitiesOnly=yes'

def git_pull_edit_commit_push():
    repo_path = "/home/auditech/repos/apigithub"
    git_url = "git@github.com/gavinultracloud/AudITech.git"
    file_to_modify = os.path.join(repo_path, "schedulededitingdoc.txt")
    timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()

    try:
        repo = git.Repo(repo_path)
        repo.git.reset('--hard')
        repo.git.clean('-fdx')
    except git.exc.NoSuchPathError:
        # If the repo does not exist, clone it
        repo = git.Repo.clone_from(git_url, repo_path)
        print("Repository Cloned Successfully.")

    # Ensure 'origin' remote exists
    if 'origin' in repo.remotes:
        origin = repo.remotes.origin
        origin.pull()
        print("Repository Pulled Successfully.")

        # Modify a file to trigger a change
        with open(file_to_modify, 'a') as file:
            file.write(f"Update at {timestamp}\n")

        # Commit the change
        repo.git.add(file_to_modify)
        repo.git.commit('-m', f"Automated update at {timestamp}")

        # Push the change
        origin.push()
        status = "Success"
        response = "Edit, Commit, and Push Successful."
    else:
        status = "Failed"
        response = "Remote 'origin' does not exist."

    # Log the action
    log_action(status, response, timestamp)


def log_action(status, response, timestamp):
    # Insert log entry into the database
    try:
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor()
        insert_sql = "INSERT INTO pull_request_logs (timestamp, status, response) VALUES (%s, %s, %s)"
        cur.execute(insert_sql, (timestamp, status, response))
        conn.commit()
    except Exception as e:
        print(f"Failed to log the action: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()
        print(f"Action logged: {timestamp}, {status}, {response}")

# Schedule the task
scheduler = BackgroundScheduler()
scheduler.add_job(git_pull_edit_commit_push, 'interval', minutes=60)
scheduler.start()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

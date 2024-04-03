import bcrypt
import psycopg2

# Database connection configuration
db_config = {
    'dbname': 'apigithub',
    'user': 'postgres',
    'password': 'S3cureLog1nR00t',
    'host': '192.168.2.86',
    'port': '5432'
}

# New password to hash
new_password = "P@ssword-01"
hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

# Email address of the user to update
user_email = "string@string.com"

# Update the user's password in the database
conn = psycopg2.connect(**db_config)
cur = conn.cursor()
cur.execute("UPDATE userDetails SET password = %s WHERE emailAddress = %s", (hashed_password.decode('utf-8'), user_email))
conn.commit()
cur.close()
conn.close()

print("User's password updated successfully.")

# config.py
""" Sets up the locations and configurations for flask and connexion """
import os
import pathlib
import connexion
import os
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

# Finds the absolute path to the parent directory of this file.
basedir = pathlib.Path(__file__).parent.resolve()
connex_app = connexion.App(__name__, specification_dir=basedir)
db_dir = f"sqlite:///{basedir / 'game.db'}"

app = connex_app.app
app.config["SQLALCHEMY_DATABASE_URI"] = db_dir
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["DEBUG"] = True

# This requires a secret key is set up in the os environment.
# Create a secret key using python -c 'import secrets; print(secrets.token_hex())' in the terminal
# then in the command prompt do setx SECRET_KEY "your-secret-key"
# In PyCharm set a SECRET_KEY variable in the runtime configuration for app.py
app.config["SECRET_KEY"] = os.environ.get('SECRET_KEY')

# set the server name
# app.config["SERVER_NAME"] = 'http://127.0.0.2:5000'

db = SQLAlchemy(app)
ma = Marshmallow(app)

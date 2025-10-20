# config.py
""" Sets up the locations and configurations for flask and connexion """

import pathlib
import connexion
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
# set the server name
# app.config["SERVER_NAME"] = 'http://127.0.0.2:5000'

db = SQLAlchemy(app)
ma = Marshmallow(app)

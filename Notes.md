# Rest APIs with Flask, Connexion and SQLAlchemy

Notes based on Real Python Tutorials taken from [Python REST APIs With Flask, Connexion, and SQLAlchemy Part 1](https://realpython.com/flask-connexion-rest-api/), [Tutorial Part 2](https://realpython.com/flask-connexion-rest-api-part-2/), [Tutorial Part 3](https://realpython.com/flask-connexion-rest-api-part-3/)

The tutorial [Build a JavaScript Front End for a Flask API](https://realpython.com/flask-javascript-frontend-for-rest-api/) gives instructions for building a Front End that uses the database and API calls from the previous tutorials.

## REST framework
REST stands for **re**presentational **s**tate **t**ransfer. It provides guidelines on how to architect a network-connected software system.

[Python and REST APIs: Interacting With Web Services](https://realpython.com/api-integration-in-python/)

### HTML requests in REST

You can **get** data from an api using GET requests, for example, from the python `requests` module. The data can be formatted as JSON.

You can write data using a POST request.

A PUT request updates our overwrites existing data.

PATCH is used to amend existing data.

DELETE will completely remove data.

### Rest tutorial

The tutorial discusses how to make REST API requests in Flask, Django and Fast API.

### Curl commands

Curl stands for **client URL** and allows you to make requests to a server and see the results. This can be used to see the results from an API call, such as `curl https://api.github.com/users/AndrewDales` will show my GitHub data.
This website allows Curl commands from windows: [REQBIN - Run Curl Commands Online](Run Curl Commands Online)

# OpenAPI, Swagger and Connexion

*OpenAPI* provides a formal standard for describing HTTP API's. It is used to 
- validate input and output data
- describe API endpoints

A Swagger configuration file is a .YAML file used to contain OpenAPI definitions.

*Swagger* is the **brand name** for a suite of products that work with the OpenAPI specifications.

The *Swagger* file is also used by Flask to create a UI that allows you to see the API calls in action. You can navigate to `localhost:8000/api/ui` to see the UI.

*Connexion* is a Python library that links the API structure, written in the Swagger file with the python functions that implement the logic for each endpoint.
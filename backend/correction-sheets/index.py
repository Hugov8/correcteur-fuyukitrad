from flask import Flask, request, jsonify, make_response
import requests

import correcteur
from flask_cors import CORS, cross_origin
from flasgger import swag_from, Swagger

app = Flask(__name__)

app.config['SWAGGER'] = {
    "swagger_version": "2.0",
    "title": "Flasgger",
    "headers": [
        ('Access-Control-Allow-Origin', '*'),
        ('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS"),
        ('Access-Control-Allow-Credentials', "true"),
    ],
    "specs": [
        {
            "version": "0.0.1",
            "title": "Api connecteur",
            "endpoint": 'v1_spec',
            "description": 'This is the version 1 of our API',
            "route": '/v1/spec',
        }
    ]
}

CORS(app)
Swagger(app)

PORT = 3030
HOST = '0.0.0.0'
URL_SHEET_MANAGER = "https://zoltraak.ovh/dev/correcteur/api/"

@swag_from('./openapi_doc/home.yml')
@app.route("/", methods=['GET'])
def home():
    return "<h1 style='color:blue'>Connexion réussi!</h1>"

@app.route('/getCorrectedSheet', methods=['GET'])
@swag_from('openapi_doc/get-corrected-sheet.yml')
@cross_origin()
def getCorrectedSheet():
    if 'urlSheet' not in request.headers:
        return make_response(jsonify({"messageErreur": "Fournir le lien de la sheet"}), 400)
    if 'idSheet' not in request.args:
        return make_response(jsonify({"messageErreur": "Fournir une id sheet"}), 400)
    if 'ZOLTRAAK_JWT' not in request.cookies:
        return make_response(jsonify({"messageErreur": "Non authentifié"}), 401)
    try:
        values = requests.get(URL_SHEET_MANAGER+"getColumn/"+request.args["idSheet"]+"/H", headers={"lienSpreadsheet": request.headers["urlSheet"]}, cookies={'ZOLTRAAK_JWT': request.cookies.get('ZOLTRAAK_JWT')})
        return make_response(jsonify(correcteur.checkSentences(values.json()["response"])), 200)
    except Exception as e:
        return make_response(jsonify({"messageErreur": "Vérifier le lien fourni : "+e.__str__()}), 501)


if __name__ == "__main__":
    print("Server running in port %s" % (PORT))
    app.run(host=HOST, port=PORT)

from flask import Flask, request, jsonify, make_response

import correcteur
from flask_cors import CORS
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

@swag_from('./openapi_doc/home.yml')
@app.route("/", methods=['GET'])
def home():
    return "<h1 style='color:blue'>Connexion réussi!</h1>"

@swag_from('./openapi_doc/get-id-sheet.yml')
@app.route('/getIdSheet', methods=['GET'])
def getIdSheets():
    if 'urlSheet' not in request.headers:
        return make_response(jsonify({"messageErreur": "urlSheet not found"}), 400)
    try:
        wksheet = correcteur.getWorksheet(request.headers['urlSheet'])
    except:
        return make_response(jsonify({"messageErreur": "Vérifier le lien fourni"}), 400)
    rows = list(filter(lambda l : l.title!="Names" and l.title!="Template", wksheet.worksheets()[1:]))
    rows = list(map(lambda l: l.title, rows))
    return make_response(jsonify({"title": wksheet.title, "sheets": rows}), 200)

@app.route('/getCorrectedSheet', methods=['GET'])
@swag_from('openapi_doc/get-corrected-sheet.yml')
def getCorrectedSheet():
    if 'urlSheet' not in request.headers:
        return make_response(jsonify({"messageErreur": "Fournir le lien de la sheet"}), 400)
    if 'idSheet' not in request.args:
        return make_response(jsonify({"messageErreur": "Fournir une id sheet"}), 400)
    try:
        wksheet = correcteur.getWorksheet(request.headers["urlSheet"])
    except:
        return make_response(jsonify({"messageErreur": "Vérifier le lien fourni"}))
    rows = wksheet.worksheets()
    for row in rows:
        if row.title==request.args['idSheet']:
            try:
                return make_response(jsonify(correcteur.checkSheet(row)), 200)
            except Exception as e:
                return make_response(jsonify({"messageErreur":"erreur inconnue : " + str(e)}), 400)
    return make_response(jsonify({"messageErreur": "Sheet not found"}, 404))

@swag_from('openapi_doc/get-corrected-spreadsheet.yml')
@app.route("/getCorrectedSpreadsheet", methods=['GET'])
def getCorrectedSpreadsheet():
    if 'urlSheet' not in request.headers:
        return make_response(jsonify({"messageErreur": "Fournir le lien de la sheet"}), 400)
    try:
        return make_response(jsonify(correcteur.checkOrthographeWorksheet(request.headers["urlSheet"])), 200)
    except:
        return make_response(jsonify({"messageErreur":"Vérifier le lien"}), 400)

@app.route('/modifySheet', methods=['POST'])
@swag_from('openapi_doc/modify-sheet.yml')
def modifySheet():
    if 'urlSheet' not in request.headers:
        return make_response(jsonify({"messageErreur": "Fournir le lien de la sheet"}), 400)
    if 'idSheet' not in request.args:
        return make_response(jsonify({"messageErreur": "Fournir le l'id de la sheet"}), 400)

    data = request.get_json()
    if 'line' not in data and 'value' not in data:
        return make_response(jsonify({"messageErreur":"Fournir l'attribut line et value dans le corps sous format json"}), 400)
    
    try:
        wksheet = correcteur.getWorksheet(request.headers["urlSheet"])
    except:
        return make_response(jsonify({"messageErreur":"Vérifier le lien fourni"}))
    rows = wksheet.worksheets()
    for row in rows:
        if row.title==request.args['idSheet']:
            try:
                row.update_cell(data["line"], 8, data["value"])
                return make_response(jsonify({"state": "success"}), 202)
            except:
                return make_response(jsonify({"messageErreur":"Veuillez réessayer plus tard"}), 400)
    return make_response(jsonify({"messageErreur": "error, sheet not found"}, 404))

if __name__ == "__main__":
    print("Server running in port %s" % (PORT))
    app.run(host=HOST, port=PORT)

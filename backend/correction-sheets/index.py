from flask import Flask, render_template, request, jsonify, make_response
import requests
import json
import correcteur
import os
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

PORT = 3030
HOST = '0.0.0.0'
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/", methods=['GET'])
def home():
    return "<h1 style='color:blue'>Connexion réussi!</h1>"

@app.route('/getIdSheet', methods=['GET'])
@cross_origin()
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
@cross_origin()
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
            except:
                return make_response(jsonify({"messageErreur":"erreur inconnue"}), 400)
    return make_response(jsonify({"messageErreur": "Sheet not found"}, 404))

@app.route("/getCorrectedSpreadsheet", methods=['GET'])
def getCorrectedSpreadsheet():
    if 'urlSheet' not in request.headers:
        return make_response(jsonify({"messageErreur": "Fournir le lien de la sheet"}), 400)
    
    try:
        return make_response(jsonify(correcteur.checkOrthographeWorksheet(request.headers["urlSheet"])), 200)
    except:
        return make_response(jsonify({"messageErreur":"Vérifier le lien"}))

@app.route('/modifySheet', methods=['POST'])
@cross_origin()
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
                return make_response(jsonify({"state": "success"}), 200)
            except:
                return make_response(jsonify({"messageErreur":"Veuillez réessayer plus tard"}), 400)
    return make_response(jsonify({"messageErreur": "error, sheet not found"}, 404))

if __name__ == "__main__":
    print("Server running in port %s" % (PORT))
    app.run(host=HOST, port=PORT)

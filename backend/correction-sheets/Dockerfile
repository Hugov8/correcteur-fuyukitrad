FROM python:3.8-alpine
WORKDIR /app
COPY requirements.txt /app
COPY cert_serveur.pem /usr/local/share/ca-certificates/cert_serveur.pem
RUN update-ca-certificates
RUN pip install -r requirements.txt
ADD . /app/
CMD ["waitress-serve","--port=3030","index:app"]

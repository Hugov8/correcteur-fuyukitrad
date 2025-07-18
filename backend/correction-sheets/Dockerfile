FROM python:3.8-alpine
WORKDIR /app
COPY requirements.txt /app
COPY cert_serveur.pem /etc/ssl/certs/cert_serveur.pem
RUN update-ca-certificates
RUN pip install -r requirements.txt
ADD . /app/
CMD ["waitress-serve","--port=3030","index:app"]

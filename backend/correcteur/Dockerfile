FROM python:3.8-alpine
WORKDIR /app

ADD . /app/
CMD ["python","grammalecte-server.py","-ht", "0.0.0.0","-p","8080","-t"]

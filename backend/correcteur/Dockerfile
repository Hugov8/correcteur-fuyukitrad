FROM python:3.8-alpine

ENV VERSION 2.3.0

WORKDIR /app

ADD . /app/
CMD ["python","grammalecte-server.py","-ht", "0.0.0.0","-p","8080"]

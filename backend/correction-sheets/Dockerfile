FROM python:3.8-alpine
WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt
ADD . /app/
CMD ["waitress-serve","--port=3030","index:app"]

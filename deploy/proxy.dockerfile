FROM python:3.12-slim-bullseye

ENV PIP_DISABLE_PIP_VERSION_CHECK="1"

WORKDIR /app
COPY proxy/requirements.txt ./
RUN pip install -r requirements.txt


COPY proxy/ ./proxy/
COPY proxyapp.py .

EXPOSE 8000

ENTRYPOINT ["gunicorn", "--access-logfile=-", "--bind", "0.0.0.0:8000", "proxyapp:app"]
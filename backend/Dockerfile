FROM python:3.8

WORKDIR /code

COPY ./requirements/main.txt /code/requirements.txt
RUN pip install -r /code/requirements.txt

COPY ./api /code/api

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "80"]

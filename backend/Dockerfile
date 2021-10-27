FROM python:3.8

WORKDIR /code

COPY ./requirements /code/requirements
RUN pip install -r /code/requirements/main.txt

ARG INSTALL_DEV=false
RUN bash -c "if [ $INSTALL_DEV == 'true' ] ; then pip install -r /code/requirements/lint.txt ; fi"
RUN bash -c "if [ $INSTALL_DEV == 'true' ] ; then pip install -r /code/requirements/test.txt ; fi"

COPY . .

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "80"]

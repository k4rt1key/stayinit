FROM python:3.10

WORKDIR /user/src/app

COPY requirements.txt .

RUN python3 -m venv /venv
ENV path="/venv/bin:$PATH"

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

EXPOSE 7000

CMD ["uvicorn", "api:app", "--port", "7000"]
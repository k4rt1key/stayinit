FROM python:3.11-slim

WORKDIR /user/src/app

COPY requirements.txt .

RUN python3 -m venv /venv
ENV path="/venv/bin:$PATH"

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

EXPOSE 7000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7000"]
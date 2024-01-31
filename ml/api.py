from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import joblib
from sklearn.feature_extraction import DictVectorizer
import pandas as pd

# Create FastAPI app instance
app = FastAPI()

# CORS configuration
origins = [
   "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Pydantic model for request validation
class ValidationItem(BaseModel):
    property_sqft: int
    property_bhk: int
    property_city: str
    property_locality: str
    is_furnished: str
    property_project: str
    num_of_baths: int
    bachelors_or_family: str
    floornumber: int
    totalfloor: int
    property_pricenan: int
    property_bhknan: int
    property_sqftnan: int
    num_of_bathsnan: int
    floornumbernan: int
    totalfloornan: int

# Load the model and DictVectorizer
model = joblib.load('model.joblib')
dv = joblib.load('dict_vectorizer.pkl')

# Function to preprocess input data
def preprocess_data(input_data):
    input_data_dict = input_data.to_dict(orient='records')
    input_data_encoded = dv.transform(input_data_dict)
    return input_data_encoded

# Route for validation endpoint
@app.post('/')
async def validate(item: ValidationItem):
    try:
        input_data = pd.DataFrame([item.dict()])
        input_data_encoded = preprocess_data(input_data)
        prediction = model.predict(input_data_encoded)
        return {"prediction": float(prediction[0])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# Exception handler for HTTPException
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail},
    )

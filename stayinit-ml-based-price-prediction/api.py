from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from sklearn.feature_extraction import DictVectorizer
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins, adjust this as needed for your production environment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


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

# Load your model
model = joblib.load('model3.joblib')

dv = joblib.load('dict_vectorizer.pkl')

def preprocess_data(input_data):
    # Convert input data to a list of dictionaries (like the format DictVectorizer expects)
    input_data_dict = input_data.to_dict(orient='records')
    
    # Use the preloaded DictVectorizer to transform the input data
    input_data_encoded = dv.transform(input_data_dict)
    
    return input_data_encoded

@app.post('/')
async def validate(item: ValidationItem):
    input_data = pd.DataFrame([item.dict()])  
    input_data_encoded = preprocess_data(input_data)
    prediction = model.predict(input_data_encoded)
    return {"prediction": float(prediction[0])}







# from fastapi import FastAPI
# from pydantic import BaseModel
# import pickle 
# import pandas as pd
# import joblib

# app = FastAPI()

# class validationItem(BaseModel):
#     property_sqft : int  # 1285,
#     property_bhk: int #2,
#     property_city: str #'ahmedabad',
#     property_locality: str #'bopal',
#     is_furnished: str #'furnished',
#     property_project: str #'applewoods_sorrel_apartments',
#     num_of_baths : int #2,
#     bachelors_or_family : str #'bachelors/family',
#     floornumber : int #6,
#     totalfloor : int #14,
#     property_pricenan : int #0,
#     property_bhknan: int #0,
#     property_sqftnan: int #0,
#     num_of_bathsnan: int #0,
#     floornumbernan: int #0,
#     totalfloornan: int #0

# # with open('model.pkl', 'rb') as f:
# #     model = pickle.load(f)



# model = joblib.load('model3.joblib')


# # input={
# #     'property_sqft' : 1285,
# #     'property_bhk':2,
# #     'property_city':'ahmedabad',
# #     'property_locality':'bopal',
# #     'is_furnished':'furnished',
# #     'property_project': 'applewoods_sorrel_apartments',
# #     'num_of_baths' : 2,
# #     'bachelors_or_family' : 'bachelors/family',
# #     'floornumber' : 6,
# #     'totalfloor' : 14,
# #     'property_pricenan' : 0,
# #     'property_bhknan':0,
# #     'property_sqftnan':0,
# #     'num_of_bathsnan':0,
# #     'floornumbernan':0,
# #     'totalfloornan':0
# # }

# from sklearn.feature_extraction import DictVectorizer


# @app.post('/')
# async def validate(item:validationItem):
#     input_data = item.dict()
#     dict_vectorizer = DictVectorizer(sparse=False)
#     input_data_transformed = dict_vectorizer.transform([input_data])

#     # df = pd.DataFrame([item.dict().values()],columns=item.dict().keys())
#     yhat = model.predict(input_data_transformed)
#     return {"prediction" : int(yhat[0])}

# # async def validate(item:validationItem):
# #     df = pd.DataFrame([item.dict().values()],columns=item.dict().keys())
# #     yhat = model_api.predict(df)
# #     return {"prediction":int(yhat)}



# # ad10={
# #     'property_sqft' : 1285,
# #     'property_bhk':2,
# #     'property_city':'ahmedabad',
# #     'property_locality':'bopal',
# #     'is_furnished':'furnished',
# #     'property_project': 'applewoods_sorrel_apartments',
# #     'num_of_baths' : 2,
# #     'bachelors_or_family' : 'bachelors/family',
# #     'floornumber' : 6,
# #     'totalfloor' : 14,
# #     'property_pricenan' : 0,
# #     'property_bhknan':0,
# #     'property_sqftnan':0,
# #     'num_of_bathsnan':0,
# #     'floornumbernan':0,
# #     'totalfloornan':0
# # }
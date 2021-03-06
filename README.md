# SentimentAnalysis
3rd SEM Project on Sentiment Analysis using Simple Neural Network

Data set is available at https://www.kaggle.com/kazanova/sentiment140


1. EDA.ipynb -> exploratory data analysis of the dataset
2. DataProcessing.ipynb -> Data PreProcessing step, the output file of this step is used as input data for training the model
3. ModelTraining.ipynb -> Format the data fot training the model and training a simple Neural Net


### Model Info
<pre>
Model: "sequential"
Layer (type)                 Output Shape              Param 

embedding (Embedding)        (None, 40, 32)            256000    
global_average_pooling1d (Gl (None, 32)                0         
dense (Dense)                (None, 24)                792       
dense_1 (Dense)              (None, 1)                 25        

Total params: 256,817
Trainable params: 256,817
Non-trainable params: 0
</pre>

TwitterConnectionAPI contains a class that can fetch users data and tweets using Twitter API.

## Flask App

main.py is the flask backend that server html pages from ./static folder

To use the code, train the export the model as .h5 (or other compatible format) and export a tokenizer.json file.

**Both this files can be exported by running the code in ModelTraining.ipynb**

You can get a twitter Bearer Token from Twitter API page.

---
The model is saved in .h5 format, this can be changes to .json to use in TensorFlow JS

Following code can be used in terminal (after installing tensorflowjs) to convert .h5 to ,json model

---
## Running the Flask App

First run will take a few seconds as files for NLTK will need to be downloaded

1. Install all required libraries (I havent included requirments.txt as i was not using a virtual environment)
  (Tensorflow, NLTK, requests, json and Flask)
2.  get the BEARER TOKEN from twitter of you want to use the twitter analysis tool. in main.py replace <YOUR_BEARER_TOKEN> with your token.
3.  run the main.py file by `python main.py` or `python3 main.py`
4.  Once the server is running, web interface will be available at `http://127.0.0.1:5000/`

---

install tensorflowjs

`sudo pip install tensorflowjs`

`sudo pip3 install tensorflowjs`

Convert model to .json

`tensorflowjs_converter --input_format=keras PATH_TO_MODEL.h5 OUTPUT_PATH`  

---

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

embedding (Embedding)        (None, 200, 16)           480000    
global_average_pooling1d (Gl (None, 16)                0         
dense (Dense)                (None, 24)                408       
dense_1 (Dense)              (None, 1)                 25        

Total params: 480,433
Trainable params: 480,433
Non-trainable params: 0
</pre>

TwitterConnectionAPI contains a class that can fetch users data and tweets using Twitter API.

## Flask APP

main.py is the flask backend that server html pages from ./static folder

To use the code, train the export the model as .h5 (or other compatible format) and export a tokenizer.json file.

**Both this files can be exported by running the code in ModelTraining.ipynb**

You can get a twitter Bearer Token from Twitter API page.

---
The model is saved in .h5 format, this can be changes to .json to use in TensorFlow JS

Following code can be used in terminal (after installing tensorflowjs) to convert .h5 to ,json model


install tensorflowjs

`sudo pip install tensorflowjs`

`sudo pip3 install tensorflowjs`

Convert model to .json

`tensorflowjs_converter --input_format=keras PATH_TO_MODEL.h5 OUTPUT_PATH`  
---

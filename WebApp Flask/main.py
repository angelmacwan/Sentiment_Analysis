from flask import Flask, render_template, request

import requests
import json

import nltk
from nltk.tokenize import sent_tokenize

import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import tokenizer_from_json


# Model Paramaters (Should be the same when training the model)
vocab_size = 30000
embedding_dim = 16
max_length = 200
trunc_type='post'
padding_type='post'
oov_tok = "<OOV>"

# download all nltk packages if not already downloaded
print("Downloading NLTK Packages, might take a while")
nltk.download("all")
print("NLTK Packages available")

class TwitterAPI:
    def __init__(self):
        self.bearer_token = <YOUR_BEARER_TOKEN>
        self.headers = {"Authorization": "Bearer {}".format(self.bearer_token)}
    
    def UserInfoUrl(self, uname):
        usernames = f"usernames={uname}"
        user_fields = "user.fields=description,created_at,profile_image_url"
        return f"https://api.twitter.com/2/users/by?{usernames}&{user_fields}"
  
    def getUserInfo(self, uname):
        url = self.UserInfoUrl(uname)
        response = requests.request("GET", url, headers=self.headers)
        print(response.status_code)
        if response.status_code != 200:
            raise Exception(
                "Request returned an error: {} {}".format(
                    response.status_code, response.text
                )
            )
        res = response.json()
        return res['data'][0]
    
    def getTweets(self, uid):
        params = {"tweet.fields": "created_at", "max_results":"100"}
        url = f"https://api.twitter.com/2/users/{uid}/tweets"
        response = requests.request("GET", url, headers=self.headers, params=params)
        print(response.status_code)
        if response.status_code != 200:
            raise Exception(
                "Request returned an error: {} {}".format(
                    response.status_code, response.text
                )
            )
        return response.json()['data']

tw = TwitterAPI()

# Load Model
model = tf.keras.models.load_model('./MODEL/SentimentModel01.h5')


# Load Tokenizer
with open('./MODEL/tokenizer.json') as f:
    data = json.load(f)
    tokenizer = tokenizer_from_json(data)

def predictSentiment(x):
    sequences = tokenizer.texts_to_sequences(x)
    padded = pad_sequences(sequences, maxlen=max_length, padding=padding_type, truncating=trunc_type)
    return model.predict(padded)


app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/gettweets/<name>")
def getTweets(name):
    try:
        userInfo = tw.getUserInfo(name) # user Info
        tweets = tw.getTweets(userInfo["id"]) # Tweets
        tweets = [i["text"] for i in tweets]
        sentiment = predictSentiment(tweets)
        res = []
        res.append(userInfo)
        for i,j in zip(tweets, list(sentiment)):
            res.append({"text":i, "sentiment":str(j[0])})

        return json.dumps(res)
    except:
        return json.dumps({"status":"NotFound", "message":"Enter Valid ID"})


@app.route("/textanalysis", methods = ["POST", "GET"])
def textAnalysis():
    try:
        req = request.json
        # convert string into tokens
        data = sent_tokenize(req)
        sentiment = predictSentiment(data)
        res = []
        for i,j in zip(data, list(sentiment)):
            res.append({"text":i, "sentiment":str(j[0])})
        return json.dumps(res)
    except:
        return "-1"



if __name__ == "__main__":
    app.run(debug=True)

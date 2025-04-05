from flask import Flask, request, jsonify
from pyspark.sql import SparkSession
from pyspark.sql.functions import col
from pyspark.ml.feature import Tokenizer, StopWordsRemover, CountVectorizer, IDF, StringIndexer
from pyspark.ml.classification import LogisticRegression
from pyspark.ml import Pipeline, PipelineModel
from pyspark.ml.recommendation import ALS, ALSModel
from pyspark.sql.types import StructType, StructField, IntegerType, StringType, FloatType
import random
import os

app = Flask(__name__)

# Initialize Spark session
spark = SparkSession.builder.appName("SkillProviderSentimentAndRecommendation").getOrCreate()

# Generate synthetic dataset (you may load real data here instead)
NUM_USERS = 10000
NUM_PROVIDERS = 500
NUM_REVIEWS = 100000

positive_reviews = [
    "Excellent work delivered on time!", "Very responsive and professional.",
    "Great experience, highly recommended!", "Perfect communication and delivery!"
]
negative_reviews = [
    "Late delivery and poor communication.", "Not satisfied with the response time.",
    "Bad experience, wouldn’t recommend.", "Unprofessional and delayed service."
]

def generate_reviews():
    data = []
    for _ in range(NUM_REVIEWS):
        user = random.randint(0, NUM_USERS-1)
        provider = random.randint(0, NUM_PROVIDERS-1)
        sentiment = random.choice([0, 1])
        text = random.choice(positive_reviews if sentiment else negative_reviews)
        data.append((user, provider, text, sentiment))
    return data

schema = StructType([
    StructField("user", IntegerType(), True),
    StructField("provider", IntegerType(), True),
    StructField("review", StringType(), True),
    StructField("label", IntegerType(), True)
])

review_data = spark.createDataFrame(generate_reviews(), schema)

# Build sentiment analysis pipeline
tokenizer = Tokenizer(inputCol="review", outputCol="words")
remover = StopWordsRemover(inputCol="words", outputCol="filtered")
vectorizer = CountVectorizer(inputCol="filtered", outputCol="features_raw")
idf = IDF(inputCol="features_raw", outputCol="features")
classifier = LogisticRegression(featuresCol="features", labelCol="label")

sentiment_pipeline = Pipeline(stages=[tokenizer, remover, vectorizer, idf, classifier])
sentiment_model = sentiment_pipeline.fit(review_data)

# Train ALS recommender
als = ALS(userCol="user", itemCol="provider", ratingCol="label", coldStartStrategy="drop")
als_model = als.fit(review_data)

@app.route("/analyze_sentiment", methods=["POST"])
def analyze_sentiment():
    data = request.json
    review = data.get("review")
    if not review:
        return jsonify({"error": "Review text required"}), 400

    df = spark.createDataFrame([(review,)], ["review"])
    result = sentiment_model.transform(df).select("probability", "prediction").first()
    sentiment = "positive" if result[1] == 1 else "negative"
    confidence = float(result[0][int(result[1])])

    return jsonify({"sentiment": sentiment, "confidence": round(confidence, 3)})

@app.route("/recommend/<int:user_id>", methods=["GET"])
def recommend(user_id):
    users_df = spark.createDataFrame([(user_id,)], ["user"])
    recommendations = als_model.recommendForUserSubset(users_df, 5).collect()
    if not recommendations:
        return jsonify({"error": "No recommendations found for user."}), 404

    recs = recommendations[0]["recommendations"]
    return jsonify({"user": user_id, "recommendations": [{"provider": r["provider"], "score": round(r["rating"], 2)} for r in recs]})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
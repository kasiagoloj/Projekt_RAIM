from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    print("Ala ma kota") #w terminalu
    return "Hello world" #w przeglądarce

if __name__ == "__main__":
    app.run(debug=True)

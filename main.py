from flask import Flask, render_template, request, url_for

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload")
def upload():
    """
    Questa route riceve lat e lon come query string,
    ad es. /upload?lat=45.0&lon=12.5
    e poi renderizza la pagina upload.html
    """
    lat = request.args.get("lat", 0)
    lon = request.args.get("lon", 0)
    return render_template("upload.html", lat=lat, lon=lon)

if __name__ == "__main__":
    app.run(debug=True)

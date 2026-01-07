from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# allow requests from your Vite dev server
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    }
})



@app.route("/api/register", methods=["POST"])
def register():
    # read JSON sent by axios
    data = request.get_json()
    print("REGISTER data:", data, flush=True)  # debug in PyCharm

    full_name = data.get("fullName")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    # same validation idea as frontend
    if not full_name or not email or not password or not role:
        return jsonify({"message": "Missing fields"}), 400

    if len(full_name.strip()) < 2:
        return jsonify({"message": "Full name too short"}), 400

    if len(password) < 8:
        return jsonify({"message": "Password too short"}), 400

    # 👉 here you would normally check if email already exists
    # and save the user to the database.
    # For now we'll just pretend it worked.

    print("User registered OK:", full_name, email, role, flush=True)

    return jsonify({"message": "User registered successfully"}), 201


@app.route("/api/hello")
def hello():
    return jsonify({"message": "Flask is running"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

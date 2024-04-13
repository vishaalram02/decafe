from flask import Flask, jsonify, request
import subprocess, os
from flask_httpauth import HTTPBasicAuth

app = Flask(__name__)
auth = HTTPBasicAuth()

@auth.verify_password
def verify(username, password):
    if username == os.environ["USER"] and password == os.environ["PASS"]:
        return username

@app.route('/exec', methods=['POST'])
@auth.login_required
def exec():
    data = request.get_json()
    input = data.get('input')
    with open('input.dcf', 'w') as f:
        f.write(input)
    try:
        subprocess.run(['./decaf', 'input.dcf', '-o', 'input.s'], capture_output=True, text=True)
        subprocess.run(['gcc', '-no-pie', '-o', 'out', 'input.s'])
        result = subprocess.run(['./out'], capture_output=True, text=True)

        if result.returncode == 0:
            return jsonify({'success': True, 'output': result.stdout})
        else:
            return jsonify({'success': True, 'output': result.stderr}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
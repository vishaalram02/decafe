from flask import Flask, jsonify, request
import subprocess, os
from flask_httpauth import HTTPBasicAuth
from dotenv import load_dotenv


app = Flask(__name__)
auth = HTTPBasicAuth()
load_dotenv()

@auth.verify_password
def verify(username, password):
    if username == os.environ["USERNAME"] and password == os.environ["PASSWORD"]:
        return username

@app.route('/exec', methods=['POST'])
@auth.login_required
def exec():
    data = request.get_json()
    opt = data.get('opt')
    input = data.get('input')
    result = None

    with open('input.dcf', 'w') as f:
        f.write(input)
    try:
        result = subprocess.run([os.environ['DECAF_PATH'], 'input.dcf', '-o', 'input.s', '-O', opt], capture_output=True, text=True)
        if result.returncode != 0:
            return jsonify({'success': False, 'error': result.stderr}), 400
        
        result = subprocess.run(['gcc', '-no-pie', '-o', 'out', 'input.s'])
        if result.returncode != 0:
            return jsonify({'success': False, 'error': result.stderr}), 400
        
        result = subprocess.run(['timeout', '5', './out'], capture_output=True, text=True)

        if result.returncode == 124:
            return jsonify({'success': False, 'error': 'Execution timed out'}), 400
        elif result.returncode != 0:
            return jsonify({'success': False, 'error': result.stderr}), 400
        else:
            return jsonify({'success': True, 'output': result.stdout})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


def parse_cfg(lines):
    nodes = []
    edges = []

    cur_node = {'instructions': []}
    edges.append({
        'id': 'GLOBAL_START',
        'source': '_GLOBAL_BLOCK', 
        'target': 'main',
        'sourceHandle': '_GLOBAL_BLOCK:end',
        'targetHandle': 'main'
    })
    
    for line in lines:
        if len(line) == 0:
            continue
        if line[-1] == ':':
            if 'label' in cur_node:
                nodes.append(cur_node)
                cur_node = {'instructions': []}                    
            cur_node['label'] = line[:-1]
        else:
            words = line.split()

            if len(words) > 2 and words[-2] == '->':
                edges.append({
                    'id': cur_node['label'] + ':' + str(len(cur_node['instructions'])),
                    'source': cur_node['label'], 
                    'target': words[-1],
                    'targetHandle': words[-1],
                    'sourceHandle': cur_node['label'] + ':' + 'end'
                })
                 
                if words[0] == "if":
                    cur_node['instructions'].append({'text': ' '.join(words[0:-2])})
                    cur_node['end_branch'] = True
                    edges[-1]['color'] = '#4ade80'
                elif words[0] == "goto":
                    if 'end_branch' in cur_node:
                        cur_node['instructions'].append({'text': 'else ' + ' '.join(words[0:-2])})
                        edges[-1]['color'] = '#f87171'
                    else:
                        cur_node['instructions'].append({'text': ' '.join(words[0:-2])})
                        edges[-1]['color'] = '#60a5fa'
                else:
                    edges[-1]['sourceHandle'] = cur_node['label'] + ':' + str(len(cur_node['instructions']))
                    cur_node['instructions'].append({'text': ' '.join(words[0:-2]), 'label': words[-1]})
                    edges[-1]['color'] = '#60a5fa'
                   
            else:
                cur_node['instructions'].append({'text': line})

    if 'label' in cur_node:
        nodes.append(cur_node)

    return nodes, edges


@app.route('/ir', methods=['POST'])
@auth.login_required
def ir():
    data = request.get_json()
    input = data.get('input')
    phase = data.get('phase')
    opt = data.get('opt')
    result = None

    with open('input.dcf', 'w') as f:
        f.write(input)
    try:
        result = subprocess.run([os.environ['DECAF_PATH'], 'input.dcf', '-g', phase, '-O', opt], capture_output=True, text=True)

        if result.returncode == 0:
            output = result.stdout
            lines = output.split('\n')
            
            nodes = []
            edges = []

            nodes, edges = parse_cfg(lines)
            return jsonify({'success': True, 'nodes': nodes, 'edges': edges})  
        else:
            return jsonify({'success': False, 'error': result.stderr}), 400
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
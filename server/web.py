from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import subprocess, os
import time
from pydantic import BaseModel

DECAF_PATH = "/usr/local/bin/decafe"

# Define request models
class ExecRequest(BaseModel):
    opt: str
    input: str

class IrRequest(BaseModel):
    input: str
    phase: str
    opt: str

# Initialize FastAPI app
app = FastAPI()

@app.get("/")
async def index():
    return "Hello, World!"

@app.post("/exec")
async def exec_code(request: ExecRequest):
    try:
        with open('input.dcf', 'w') as f:
            f.write(request.input)

        result = subprocess.run([DECAF_PATH, 'input.dcf', '-s', '-o', 'input.s', '-O', request.opt], 
                              capture_output=True, text=True)
        if result.returncode != 0:
            return JSONResponse(
                status_code=400,
                content={'success': False, 'error': result.stderr}
            )
        
        result = subprocess.run(['gcc', '-no-pie', '-o', 'out', 'input.s'])
        if result.returncode != 0:
            return JSONResponse(
                status_code=400,
                content={'success': False, 'error': result.stderr}
            )
        
        start = time.time()
        proc = subprocess.Popen(['timeout', '5', './out'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout = proc.stdout.read(1000)
        stderr = proc.stderr.read(1000)
        
        proc.wait()
        returncode = proc.returncode
        
        end = time.time()
        total_time = round((end - start) * 1000, 2)

        if returncode == 124:
            return JSONResponse(
                status_code=400,
                content={'success': False, 'error': 'Execution timed out (5s)', 'time': total_time}
            )
        elif returncode != 0:
            return JSONResponse(
                status_code=400,
                content={'success': False, 'error': stderr, 'time': total_time}
            )
        else:
            return {'success': True, 'output': stdout, 'time': total_time}

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': str(e)}
        )

@app.post("/ir")
async def ir(request: IrRequest):
    try:
        with open('input.dcf', 'w') as f:
            f.write(request.input)

        result = subprocess.run([DECAF_PATH, 'input.dcf', '-s', '-g', request.phase, '-O', request.opt], 
                              capture_output=True, text=True)

        if result.returncode == 0:
            output = result.stdout
            lines = output.split('\n')
            nodes, edges = parse_cfg(lines)
            return {'success': True, 'nodes': nodes, 'edges': edges}
        else:
            return JSONResponse(
                status_code=400,
                content={'success': False, 'error': result.stderr}
            )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={'success': False, 'error': str(e)}
        )

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
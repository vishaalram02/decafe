<div align="center">
    <h1>decafe ☕️</ht>
</div>

## Overview 😀

Decafe is a compiler IR visualization tool that I designed for Computer Language Engineering (6.110). The tool allows you to dynamically visualize various compiler optimizations and execute the code within the browser. 

The compiler works on a language called decaf which is a subset of C with some additional features. You can view the entire specification for when I took the class [here](https://6110-sp24.github.io/assets/documents/decaf-specification.pdf). 

<div align="center">
    <img src="./public/cfg.png" width="80%">
</div>

## Setup 💻

The backend server is deployed with [Modal](https://modal.com/). You can follow the documentation to set up your environment and token. 
First create a `.env.local` file in the root directory with the server url from the modal app:

```bash
BACKEND_URL=
```

Finally, deploy the app and run the frontend locally:

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

cd server

modal deploy server/app.py
```
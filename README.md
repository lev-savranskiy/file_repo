# Bridge File Repository
This Tool will be used across the company to upload download and search campaign related file on AWS. Each file will have searchable meta data. 
This is an early prototype! I used JSX as coding sugar to make it more "intuitive" to build HTML. It  is not a globally accepted standard. This is the reason why i use third party  babelcore-browser  "compiler" to transform the JSX to vanilla JS, and this is where BABEL comes through. Compiling in the browser has a fairly limited use case. 

Once prototyping done, i will setup Grunt or other tool and reference the compiled files (which should have only vanilla JS code) instead of original JSX ones.

more info at https://babeljs.io/docs/setup/#installation

# Requirements

* Python 3.6.1
* pip

# Installation

pip install -r requirements.txt

# Running

python application.py

**NOTE: API will listen on port 5000**
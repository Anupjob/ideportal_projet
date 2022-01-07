#IDE
This repo contains the main functionality for the api server to connect to the mongodb and a scheduler system for different pdf parsers.

## setup
After cloning the repo use conda to create env and install dependencies:
```
conda env create --file=environment.yaml
```
To update the existing env:
```
conda env update --file environment.yml --prune
```
## starting the server
```
conda activate IDE
python main.py
```

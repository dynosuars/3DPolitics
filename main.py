import os 
import json

a = json.loads(open('assets/people/people.json').read())['file']

for file in a:
    if not os.path.exists(f'assets/people/{file}'):
        with open(f'assets/people/{file}', 'w') as f:
            json.dump({"vectors": []}, f)
            f.close()
    
import os
import shutil
import subprocess
import time

def convert(inp : str, con : str) -> None:
    subprocess.run(['ffmpeg', '-i', inp, inp.replace(os.path.splitext(inp)[1], '.' + con)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if(os.path.exists(inp.replace(os.path.splitext(inp)[1], '.' + con))):
        os.remove(inp.replace(os.path.splitext(inp)[1], '.' + con))
        return

    shutil.move(inp.replace(os.path.splitext(inp)[1], '.' + con), os.getcwd() + "/assets/images/people")
    print(f"Converted {inp} to {con} and moved to assets/images/people")


def main():
    while True:
        for file in os.listdir():
            print(f"Checking {file}...")
            if file.endswith(('.png', '.jpeg', '.webp', '.avif')):
                convert(file, 'jpg')

        time.sleep(5)

if __name__ == "__main__":
    main()
